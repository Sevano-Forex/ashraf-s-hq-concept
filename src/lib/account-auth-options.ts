import type { BetterAuthOptions } from "better-auth";

// Shared by runtime and schema generation. Public account creation stays off.
export const accountAuthOptions = {
  emailAndPassword: { enabled: true, disableSignUp: true, minPasswordLength: 12 },
  user: { modelName: "auth_user" },
  session: { modelName: "auth_session", expiresIn: 60 * 60 * 8, updateAge: 60 * 60 },
  account: { modelName: "auth_account" },
  verification: { modelName: "auth_verification" },
  rateLimit: {
    enabled: true,
    storage: "database",
    modelName: "auth_rate_limit",
    window: 60,
    max: 20,
    customRules: { "/sign-in/email": { window: 60, max: 5 } },
  },
  advanced: { useSecureCookies: true },
} satisfies BetterAuthOptions;
