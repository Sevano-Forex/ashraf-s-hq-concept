import type { D1Database } from "@cloudflare/workers-types";
import { betterAuth } from "better-auth";
import { accountAuthOptions } from "./account-auth-options";

export type ClientEnv = {
  CLIENT_DB?: D1Database;
  CLIENT_AUTH_ENABLED?: string;
  CLIENT_AUTH_SECRET?: string;
  CLIENT_AUTH_ORIGIN?: string;
};
const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" },
  });
export function accountsConfigured(env: ClientEnv, origin: string) {
  return Boolean(
    env.CLIENT_DB &&
    env.CLIENT_AUTH_ENABLED === "true" &&
    env.CLIENT_AUTH_SECRET &&
    env.CLIENT_AUTH_SECRET.length >= 32 &&
    env.CLIENT_AUTH_ORIGIN === origin &&
    origin.startsWith("https://"),
  );
}
export async function handleClientRequest(request: Request, env: ClientEnv): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const configured = accountsConfigured(env, url.origin);
  if (path === "/api/client/status" && request.method === "GET") return json({ configured });
  if (!configured) return json({ error: "Test sign-in is not available yet." }, 503);
  if (!["GET", "POST", "PATCH"].includes(request.method))
    return json({ error: "Method not allowed." }, 405);
  if (request.method !== "GET" && request.headers.get("origin") !== env.CLIENT_AUTH_ORIGIN)
    return json({ error: "This request is not permitted." }, 403);
  if (
    request.method !== "GET" &&
    !request.headers.get("content-type")?.startsWith("application/json")
  )
    return json({ error: "A JSON request is required." }, 415);
  const db = env.CLIENT_DB!;
  const auth = betterAuth({
    ...accountAuthOptions,
    database: db,
    secret: env.CLIENT_AUTH_SECRET!,
    baseURL: env.CLIENT_AUTH_ORIGIN!,
    trustedOrigins: [env.CLIENT_AUTH_ORIGIN!],
  });
  // Expose only the auth operations used by this approved-test portal.
  if (path.startsWith("/api/auth/")) {
    if (
      request.method !== "POST" ||
      !["/api/auth/sign-in/email", "/api/auth/sign-out"].includes(path)
    )
      return json({ error: "Not found." }, 404);
    if (Number(request.headers.get("content-length") ?? 0) > 4096)
      return json({ error: "Request too large." }, 413);
    const text = await request.text();
    if (text.length > 4096) return json({ error: "Request too large." }, 413);
    const authRequest = new Request(request, { body: text });
    const result = await auth.handler(authRequest);
    result.headers.set("cache-control", "no-store");
    return result;
  }
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return json({ error: "Please sign in to your test account." }, 401);
  const profile = await db
    .prepare(
      "SELECT id, display_name FROM client_profiles WHERE auth_provider = 'better-auth' AND auth_subject = ? AND is_test = 1",
    )
    .bind(session.user.id)
    .first<{ id: string; display_name: string }>();
  if (!profile)
    return json({ error: "This preview is available to approved test accounts only." }, 403);
  if (path === "/api/client/account" && request.method === "GET") {
    const [preferences, membership] = await Promise.all([
      db
        .prepare("SELECT email_opt_in FROM client_marketing_preferences WHERE client_id = ?")
        .bind(profile.id)
        .first<{ email_opt_in: number }>(),
      db
        .prepare("SELECT status, plan_name FROM client_memberships WHERE client_id = ?")
        .bind(profile.id)
        .first<{ status: string; plan_name: string | null }>(),
    ]);
    return json({
      userId: profile.id,
      email: session.user.email,
      displayName: profile.display_name,
      emailOptIn: preferences?.email_opt_in === 1,
      membershipStatus: membership?.status ?? "not_enrolled",
      planName: membership?.plan_name ?? null,
    });
  }
  if (
    request.method !== "PATCH" ||
    !["/api/client/profile", "/api/client/preferences"].includes(path)
  )
    return json({ error: "Not found." }, 404);
  const raw = await request.text();
  if (raw.length > 1024) return json({ error: "Request too large." }, 413);
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (path.endsWith("/profile")) {
    const name = typeof body["displayName"] === "string" ? body["displayName"].trim() : "";
    if (name.length < 2 || name.length > 80)
      return json({ error: "Please use a name between 2 and 80 characters." }, 400);
    await db.batch([
      db.prepare("UPDATE client_profiles SET display_name = ? WHERE id = ?").bind(name, profile.id),
      db
        .prepare("INSERT INTO client_events(client_id, event_type) VALUES (?, 'profile_updated')")
        .bind(profile.id),
    ]);
  } else {
    if (typeof body["emailOptIn"] !== "boolean")
      return json({ error: "Please select an email preference." }, 400);
    await db
      .prepare(
        "INSERT INTO client_marketing_preferences(client_id, email_opt_in) VALUES (?, ?) ON CONFLICT(client_id) DO UPDATE SET email_opt_in = excluded.email_opt_in",
      )
      .bind(profile.id, body["emailOptIn"] ? 1 : 0)
      .run();
  }
  return json({ saved: true });
}
