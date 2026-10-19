# Cloudflare client database

Selected database: **ashraf_client_auth_db**, account `685cb53a67c522bb0a483a75803a6832`, database `ec75f4e8-77be-431d-96e8-8e1f9e23d40d`.

## Verified remote setup

- The site Worker `ashraf-s-hq-concept` has binding **CLIENT_DB** pointing to this database, confirmed in Cloudflare's dashboard.
- `0001_client_accounts.sql` was applied through the D1 console: profiles, preferences, consent history, future memberships, and basic activity.
- `0002_test_auth.sql` was applied through the D1 console: Better Auth users, hashed credentials, sessions, verification records, and rate limits. Generated from the shared auth options and pinned library using `node scripts/generate-auth-schema.mjs`.
- No customer data was imported. Following explicit user approval, two fictional test users were provisioned separately from these schema migrations. The user saved the encrypted signing key; the trusted origin and activation flag were then configured in the Worker dashboard.

These two migrations were applied directly through the dashboard, **not through Wrangler's migration ledger**. Do not blindly run `wrangler d1 migrations apply --remote`: first baseline these already-applied files in the migration tooling, or it will try to recreate existing tables. Do not run the historical PostgreSQL migration under `supabase/migrations` against D1.

The generated Nitro Worker config retains the root `wrangler.jsonc` binding exactly once. Application authorization is in `src/lib/client-account-server.ts`; D1 does not supply row-level authorization automatically. Keep all SQL and authentication private to the Worker. See `client-accounts.md` for activation and limitations.

## Protected internal analytics examples

```sql
SELECT substr(created_at, 1, 7) AS month, count(*) AS test_accounts
FROM client_profiles GROUP BY 1 ORDER BY 1;
SELECT sum(email_opt_in) AS opted_in, count(*) AS preference_records
FROM client_marketing_preferences;
SELECT substr(occurred_at, 1, 10) AS day, count(*) AS profile_updates
FROM client_events WHERE event_type = 'profile_updated' GROUP BY 1 ORDER BY 1;
```

Use through administrator access only. These figures do not include Setmore bookings, customer revenue, or paid subscriptions.
