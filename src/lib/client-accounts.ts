export type ClientAccount = {
  userId: string;
  displayName: string;
  email: string;
  emailOptIn: boolean;
  membershipStatus: string;
  planName: string | null;
};
export const sampleAccount: ClientAccount = {
  userId: "sample-only",
  displayName: "Demo Client",
  email: "client@example.test",
  emailOptIn: false,
  membershipStatus: "not_enrolled",
  planName: null,
};
async function accountRequest<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    credentials: "same-origin",
    cache: "no-store",
    ...(body === undefined
      ? {}
      : { headers: { "content-type": "application/json" }, body: JSON.stringify(body) }),
  });
  if (!response.ok)
    throw new Error(
      response.status === 401
        ? "Please sign in again."
        : "Your test account request could not be completed. Please try again.",
    );
  return response.json() as Promise<T>;
}
export const accountClient = {
  async restore(): Promise<ClientAccount | null> {
    const response = await fetch("/api/client/account", {
      credentials: "same-origin",
      cache: "no-store",
    });
    if (response.status === 401) return null;
    if (!response.ok) throw new Error("Your test account could not be loaded.");
    return response.json() as Promise<ClientAccount>;
  },
  async signIn(email: string, password: string) {
    await accountRequest("/api/auth/sign-in/email", "POST", { email, password, rememberMe: false });
    try {
      const account = await this.restore();
      if (!account) throw new Error("Please sign in again.");
      return account;
    } catch (error) {
      await this.signOut();
      throw error;
    }
  },
  saveProfile: (displayName: string) =>
    accountRequest("/api/client/profile", "PATCH", { displayName }),
  savePreferences: (emailOptIn: boolean) =>
    accountRequest("/api/client/preferences", "PATCH", { emailOptIn }),
  signOut: () => accountRequest("/api/auth/sign-out", "POST", {}),
};
export type AccountClient = typeof accountClient;
export async function getAccountClient(): Promise<AccountClient | null> {
  if (typeof window === "undefined") return null;
  try {
    const status = await accountRequest<{ configured: boolean }>("/api/client/status");
    return status.configured ? accountClient : null;
  } catch {
    return null;
  }
}
