import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;
export function getAccountClient(): SupabaseClient | null {
  const url = import.meta.env["VITE_SUPABASE_URL"];
  const key = import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] || import.meta.env["VITE_SUPABASE_ANON_KEY"];
  if (!url || !key || typeof window === "undefined") return null;
  return client ??= createClient(url, key, {
    auth: { storage: window.sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
}

export type ClientAccount = {
  userId: string;
  displayName: string;
  email: string;
  emailOptIn: boolean;
  membershipStatus: string;
  planName: string | null;
};

export const sampleAccount: ClientAccount = {
  userId: "sample-only", displayName: "Demo Client", email: "client@example.test",
  emailOptIn: false, membershipStatus: "not_enrolled", planName: null,
};

export async function loadTestAccount(db: SupabaseClient, userId: string, email: string): Promise<ClientAccount> {
  const { data: profile, error } = await db.from("client_profiles").select("display_name,is_test").eq("user_id", userId).maybeSingle();
  if (error) throw new Error("Your account could not be loaded. Please try again.");
  if (!profile?.is_test) {
    await db.auth.signOut();
    throw new Error("This preview is available to approved test accounts only.");
  }
  const [preferences, membership] = await Promise.all([
    db.from("client_marketing_preferences").select("email_opt_in").eq("user_id", userId).maybeSingle(),
    db.from("client_memberships").select("status,plan_name").eq("user_id", userId).maybeSingle(),
  ]);
  if (preferences.error || membership.error) throw new Error("Your account details could not be loaded. Please try again.");
  return {
    userId, email, displayName: profile.display_name,
    emailOptIn: preferences.data?.email_opt_in ?? false,
    membershipStatus: membership.data?.status ?? "not_enrolled",
    planName: membership.data?.plan_name ?? null,
  };
}
