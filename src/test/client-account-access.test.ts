import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";
import { loadTestAccount } from "@/lib/client-accounts";

function connection(profile: unknown, error: unknown = null) {
  const filters: Array<[string, string, string]> = [];
  const signOut = vi.fn().mockResolvedValue({ error: null });
  const db = {
    auth: { signOut },
    from: (table: string) => ({ select: () => ({ eq: (column: string, value: string) => {
      filters.push([table, column, value]);
      return { maybeSingle: async () => table === "client_profiles" ? { data: profile, error } : { data: null, error: null } };
    } }) }),
  } as unknown as SupabaseClient;
  return { db, filters, signOut };
}
describe("Approved test account access", () => {
  it("rejects an authenticated user who has no approved test profile", async () => {
    const test = connection(null);
    await expect(loadTestAccount(test.db, "unapproved", "sample@example.test")).rejects.toThrow("approved test accounts only");
    expect(test.signOut).toHaveBeenCalledOnce();
    expect(test.filters).toHaveLength(1);
  });
  it("does not interpret a failed profile request as an account", async () => {
    const test = connection(null, { message: "network error" });
    await expect(loadTestAccount(test.db, "test-user", "sample@example.test")).rejects.toThrow("could not be loaded");
  });
  it("scopes each query to the signed-in user and defaults to no consent or membership", async () => {
    const test = connection({ display_name: "Test Client", is_test: true });
    const account = await loadTestAccount(test.db, "test-user", "sample@example.test");
    expect(account.emailOptIn).toBe(false);
    expect(account.membershipStatus).toBe("not_enrolled");
    expect(test.filters).toEqual([
      ["client_profiles", "user_id", "test-user"],
      ["client_marketing_preferences", "user_id", "test-user"],
      ["client_memberships", "user_id", "test-user"],
    ]);
  });
});
