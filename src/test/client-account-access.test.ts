// @vitest-environment node
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { D1Database } from "@cloudflare/workers-types";
import { betterAuth } from "better-auth";
import { accountAuthOptions } from "@/lib/account-auth-options";
import { handleClientRequest, type ClientEnv } from "@/lib/client-account-server";

const origin = "https://barber.example.test";
let sqlite: DatabaseSync;
let env: ClientEnv;
let cookie = "";
function d1Adapter(sqlite: DatabaseSync) {
  function prepare(sql: string) {
    let parameters: Array<string | number | null> = [];
    return {
      bind(...values: Array<string | number | null>) {
        parameters = values;
        return this;
      },
      async all() {
        const statement = sqlite.prepare(sql);
        const results = statement.all(...parameters);
        const changes = sqlite
          .prepare("SELECT changes() AS changes, last_insert_rowid() AS last_row_id")
          .get()!;
        return { results, success: true, meta: changes };
      },
      async first() {
        return sqlite.prepare(sql).get(...parameters) ?? null;
      },
      async run() {
        return this.all();
      },
    };
  }
  return {
    prepare,
    exec: (sql: string) => sqlite.exec(sql),
    batch: (statements: Array<ReturnType<typeof prepare>>) =>
      Promise.all(statements.map((s) => s.all())),
  } as unknown as D1Database;
}
function request(path: string, method = "GET", body?: unknown, requestOrigin = origin) {
  return new Request(origin + path, {
    method,
    headers: {
      origin: requestOrigin,
      cookie,
      "content-type": "application/json",
      "cf-connecting-ip": "192.0.2.1",
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
async function provision(email: string, approved = true) {
  const auth = betterAuth({
    ...accountAuthOptions,
    database: env.CLIENT_DB!,
    secret: env.CLIENT_AUTH_SECRET!,
    baseURL: origin,
    emailAndPassword: { enabled: true, minPasswordLength: 12 },
    trustedOrigins: [origin],
  });
  const result = await auth.api.signUpEmail({
    body: { email, password: "Fictional-test-password-938!", name: "Test Client" },
  });
  if (approved)
    sqlite
      .prepare(
        "INSERT INTO client_profiles(id, auth_provider, auth_subject, display_name) VALUES (?, 'better-auth', ?, 'Test Client')",
      )
      .run(result.user.id, result.user.id);
  return result.user.id;
}
async function login(email = "one@example.test") {
  const response = await handleClientRequest(
    request("/api/auth/sign-in/email", "POST", {
      email,
      password: "Fictional-test-password-938!",
      rememberMe: false,
    }),
    env,
  );
  cookie = response.headers
    .getSetCookie()
    .map((c) => c.split(";")[0])
    .join("; ");
  return response;
}
beforeEach(() => {
  sqlite = new DatabaseSync(":memory:");
  sqlite.exec(readFileSync("cloudflare/migrations/0001_client_accounts.sql", "utf8"));
  sqlite.exec(readFileSync("cloudflare/migrations/0002_test_auth.sql", "utf8"));
  env = {
    CLIENT_DB: d1Adapter(sqlite),
    CLIENT_AUTH_ENABLED: "true",
    CLIENT_AUTH_SECRET: "fixture-only-secret-that-is-at-least-32-characters",
    CLIENT_AUTH_ORIGIN: origin,
  };
  cookie = "";
});
afterEach(() => sqlite.close());
describe("D1 approved test accounts", () => {
  it("stays disabled without all required configuration", async () => {
    const response = await handleClientRequest(request("/api/client/status"), {});
    expect(await response.json()).toEqual({ configured: false });
    expect((await handleClientRequest(request("/api/client/account"), {})).status).toBe(503);
  });
  it("rejects anonymous data access and public registration", async () => {
    expect((await handleClientRequest(request("/api/client/account"), env)).status).toBe(401);
    expect(
      (await handleClientRequest(request("/api/auth/sign-up/email", "POST", {}), env)).status,
    ).toBe(404);
  });
  it("rejects requests from another origin before touching account data", async () => {
    expect(
      (
        await handleClientRequest(
          request(
            "/api/client/profile",
            "PATCH",
            { displayName: "No" },
            "https://untrusted.example",
          ),
          env,
        )
      ).status,
    ).toBe(403);
  });
  it("does not grant portal access to an authenticated but unapproved account", async () => {
    await provision("unapproved@example.test", false);
    expect((await login("unapproved@example.test")).status).toBe(200);
    expect((await handleClientRequest(request("/api/client/account"), env)).status).toBe(403);
  });
  it("rejects expired sessions", async () => {
    await provision("one@example.test");
    await login();
    sqlite.prepare("UPDATE auth_session SET expiresAt = ?").run(Date.now() - 60000);
    expect((await handleClientRequest(request("/api/client/account"), env)).status).toBe(401);
  });
  it("limits repeated password attempts in database-backed storage", async () => {
    let response: Response | undefined;
    for (let attempt = 0; attempt < 6; attempt++) response = await login("missing@example.test");
    expect(response?.status).toBe(429);
  });
  it("saves only the signed-in client's profile and audits consent changes", async () => {
    const first = await provision("one@example.test");
    const second = await provision("two@example.test");
    expect((await login()).status).toBe(200);
    expect(cookie).toContain("session_token");
    const initial = await handleClientRequest(request("/api/client/account"), env);
    expect(await initial.json()).toMatchObject({
      userId: first,
      emailOptIn: false,
      membershipStatus: "not_enrolled",
    });
    expect(
      (
        await handleClientRequest(
          request("/api/client/profile", "PATCH", { displayName: "New Name", userId: second }),
          env,
        )
      ).status,
    ).toBe(200);
    expect(
      sqlite.prepare("SELECT display_name FROM client_profiles WHERE id = ?").get(second)?.[
        "display_name"
      ],
    ).toBe("Test Client");
    expect(
      sqlite.prepare("SELECT display_name FROM client_profiles WHERE id = ?").get(first)?.[
        "display_name"
      ],
    ).toBe("New Name");
    for (const emailOptIn of [true, true, false])
      await handleClientRequest(request("/api/client/preferences", "PATCH", { emailOptIn }), env);
    expect(
      sqlite
        .prepare("SELECT email_opt_in FROM client_consent_history ORDER BY id")
        .all()
        .map((r) => r["email_opt_in"]),
    ).toEqual([1, 0]);
    expect(
      (
        await handleClientRequest(
          request("/api/client/membership", "PATCH", { status: "active" }),
          env,
        )
      ).status,
    ).toBe(404);
    expect(
      (
        await handleClientRequest(
          request("/api/client/profile", "PATCH", { displayName: "x" }),
          env,
        )
      ).status,
    ).toBe(400);
    expect((await handleClientRequest(request("/api/auth/sign-out", "POST", {}), env)).status).toBe(
      200,
    );
    expect((await handleClientRequest(request("/api/client/account"), env)).status).toBe(401);
  });
});
