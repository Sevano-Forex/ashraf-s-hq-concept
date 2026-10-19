# Cloudflare client database

Selected by the user: **ashraf_client_auth_db**, account `685cb53a67c522bb0a483a75803a6832`, database `ec75f4e8-77be-431d-96e8-8e1f9e23d40d`.

## Prepared locally

- Worker binding `CLIENT_DB` is declared in `wrangler.jsonc`. The generated Nitro Worker configuration is checked to ensure this binding is retained exactly once.
- `cloudflare/migrations/0001_client_accounts.sql` is the D1/SQLite schema for profiles, marketing preferences, consent history, future memberships, and basic test activity.
- Its foreign keys, test-only constraint, default consent, and consent-history triggers are verified locally using SQLite.

## Not yet connected

The Cloudflare dashboard required sign-in in the available browser. The remote schema has not been inspected or applied, and no customer records have been copied or created. A configuration declaration is not proof of an active remote binding.

The visible portal still supports a fictional in-memory sample account. Its earlier Supabase sign-in implementation is unconfigured; do not supply Supabase settings merely to connect D1. The earlier Supabase test database/schema remains unused and has not been deleted.

D1 supplies database storage, not a ready-made customer identity service. The next implementation step is to connect server-side authentication and the account API to `CLIENT_DB`. Select and configure the identity layer before enabling test credential entry. Do not replace managed authentication with a browser password check or store plaintext passwords in these tables.

## Cloudflare setup

1. Sign in to the named Cloudflare account and inspect the D1 database for existing tables before applying migrations.
2. Open the site's Worker, **Bindings → Add binding → D1 database**. Use variable name `CLIENT_DB` and select `ashraf_client_auth_db`. Apply it to the intended test environment.
3. After inspecting existing data, apply the D1 migrations using an authenticated Wrangler session:

```powershell
wrangler d1 migrations apply ashraf_client_auth_db --remote --config wrangler.jsonc
```

The migration intentionally does not use `DROP`, replace existing tables, or silently suppress existing-table conflicts. Do not run the PostgreSQL migration under `supabase/migrations` against D1.

4. Implement the server account API. Every request must verify its session and derive the client ID from the verified identity. Use bound prepared statements; never trust a client ID submitted by the browser. D1 does not inherit the Supabase row-level policies, so authorization must be enforced in the Worker.
5. Keep membership writes limited to trusted server/admin code and verified payment-provider webhooks. Keep marketing opt-in optional and default false.
6. Validate two-user isolation, expired sessions, sign-out, profile persistence, and consent history before enabling approved test accounts. Real customer registration and paid subscriptions remain a later phase.

## Internal analytics example

```sql
SELECT substr(created_at, 1, 7) AS month, count(*) AS test_accounts
FROM client_profiles GROUP BY 1 ORDER BY 1;
SELECT sum(email_opt_in) AS opted_in, count(*) AS preference_records
FROM client_marketing_preferences;
SELECT substr(occurred_at, 1, 10) AS day, count(*) AS test_logins
FROM client_events WHERE event_type = 'test_login' GROUP BY 1 ORDER BY 1;
```

Use these only through protected administrator access. They do not contain Setmore appointment/revenue data or prove completed bookings.

References: https://developers.cloudflare.com/d1/worker-api/ and https://developers.cloudflare.com/d1/reference/migrations/
