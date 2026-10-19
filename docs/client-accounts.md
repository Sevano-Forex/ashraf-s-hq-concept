# Client accounts: test phase

**Database direction updated:** the user selected Cloudflare D1 `ashraf_client_auth_db`. See `docs/cloudflare-client-database.md` for the prepared D1 schema, binding, and remaining integration steps. The Supabase-specific implementation below records the earlier prototype and is not the selected D1 integration. Sample-account mode remains available; authenticated persistence is not yet connected.

## Current status

- A Supabase/PostgreSQL database is provisioned for this Lovable project. The migration in `supabase/migrations/202610190001_client_test_accounts.sql` has been applied.
- The client area is on the existing index route at `#client-account`.
- Sample-account mode uses fictional in-memory data, with no credentials, database writes, emails, charges, or persistent sample session.
- Actual test sign-in requires the project URL and public publishable/anon key in the deployment environment. Without them, credential fields stay disabled. See `.env.example`; never put a service-role key in browser configuration.
- Only administrator-provisioned test profiles are accepted. There is no public registration or payment checkout. A database constraint permits only test profiles during this phase.

## Connect approved test users

1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in the Lovable deployment environment and `.env.local` for local checks. Rebuild after changing them.
2. Create test users through the Supabase Auth administration interface with confirmed test email addresses. Do not insert password records directly into `auth.users` or add passwords to application tables.
3. As an administrator, insert a `client_profiles` row for each Auth user UUID, using a fictional display name and `is_test = true`. Optionally insert matching marketing-preference and membership rows. Without a profile, login is rejected and the session is signed out.
4. Verify two separate test accounts cannot read or update each other's rows. Verify an authenticated user without an approved profile cannot enter the portal. Test wrong passwords, expired sessions, sign-out, reload, saved profile changes, and consent changes.
5. Use test accounts only. Before real customers, confirm business approval, data ownership, privacy notice and retention, account deletion, recovery-email delivery, public signup policy, and environment separation. Remove the test-only constraint only as part of that later reviewed rollout.

Auth sessions use session storage, so they are not deliberately kept after the browser session. Supabase Auth handles passwords; the application never stores them in its own tables.

## Database and access

| Table | Purpose | Client access |
|---|---|---|
| client_profiles | Test identity, name, account creation time | Read own; update own name only |
| client_marketing_preferences | Optional email consent, default false | Read and change own preference |
| client_consent_history | Database-written consent audit | Read own; cannot rewrite history |
| client_memberships | Future provider subscription reference and status | Read own; administrators write |
| client_events | Minimal account activity | Insert own allowed event types; no client-wide reporting |

All tables have row-level security. Anonymous access is revoked. No card data or generic unstructured tracking payload is stored. Bookings remain in Setmore; no booking history, attendance, revenue, or no-show data is inferred from clicks.

## Analytics foundation

An administrator can calculate test account growth, saved opt-in rate, and test-login events from the database. For example:

```sql
select date_trunc('month', created_at) as month, count(*) as test_accounts
from public.client_profiles group by 1 order by 1;
select count(*) filter (where email_opt_in) as opted_in, count(*) as preference_records
from public.client_marketing_preferences;
select date_trunc('day', occurred_at) as day, count(*) as test_logins
from public.client_events where event_type = 'test_login' group by 1 order by 1;
```

These are internal test metrics, not a production analytics dashboard or guaranteed business outcomes. No marketing platform is connected.

## Future paid memberships and marketing

Paid memberships and marketing consent are separate. A later payment integration must create checkout server-side and update memberships through verified, idempotent payment-provider webhooks. Clients must never be able to mark themselves paid. Only provider IDs and subscription status belong here, not card details.

A later email integration must check current consent, provide unsubscribe handling, and distinguish marketing from necessary account messages. This test version never sends marketing messages.

References: https://supabase.com/docs/guides/auth/passwords and https://supabase.com/docs/guides/database/postgres/row-level-security
