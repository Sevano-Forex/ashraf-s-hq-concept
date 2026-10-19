# Client accounts: test phase

The client area remains on the index route at `#client-account`. Cloudflare D1 `ashraf_client_auth_db` is the selected storage. The earlier Supabase prototype is unused; its historical migration is retained, but its browser adapter and settings have been removed.

## Verified deployment

Two fictional approved accounts were provisioned in D1, the encrypted signing key was saved by the user, and the trusted origin and activation flag were enabled in the Worker dashboard. `keep_vars: true` preserves dashboard-managed runtime variables on subsequent Git deployments. Public registration remains disabled.

## Current behavior

- The sample account is fictional, held in memory, and never writes to any database.
- Actual sign-in is disabled unless the Worker has all four settings: the `CLIENT_DB` D1 binding, `CLIENT_AUTH_ENABLED=true`, `CLIENT_AUTH_ORIGIN` set to the exact HTTPS site origin, and a private `CLIENT_AUTH_SECRET` of at least 32 characters.
- Better Auth 1.7.10 handles hashed passwords and Secure/HttpOnly session cookies. Sessions expire after eight hours; the UI requests a session cookie rather than persistent remember-me login.
- Public registration, recovery emails, payment checkout, and marketing delivery are disabled. Provision approved fictional test accounts only.
- The server verifies the session and an approved `is_test=1` profile on every account read/write. It derives the client ID from the session, ignores submitted IDs, and uses prepared SQL statements.
- Clients can edit their own display name and optional email preference. Memberships are read-only. Consent changes are recorded by database triggers.
- Auth requests are restricted to same-origin sign-in/sign-out and database-backed rate limiting (five sign-in attempts per minute per caller). Other auth endpoints are not exposed.
- Basic profile-update activity is recorded. The schema reserves `test_login` for a later trusted login-event integration; login counts are not currently populated.

## Activation

1. Confirm the D1 binding and both SQL migrations are applied (see `cloudflare-client-database.md`).
2. Run `node scripts/prepare-test-clients.mjs` locally. This offline staff tool prepares two fictional `.test` accounts, hashed credential SQL, and a random signing key in ignored `.tooling` files. It never enables remote access or prints secrets. Do not commit or share those files. Do not rerun over existing prepared credentials.
3. With approval to create test credentials, apply `.tooling/provision-test-clients.sql` to the selected test D1 database through an authenticated administrative session. Never apply it to a production customer database.
4. In Cloudflare Worker Settings, add `CLIENT_AUTH_SECRET` as an encrypted **Secret**. The user should enter and submit this credential directly. It must never use a `VITE_` prefix or be committed in configuration.
5. Add plain-text variables `CLIENT_AUTH_ORIGIN=https://ashraf-s-hq-concept.ascend-web-studio.workers.dev` and `CLIENT_AUTH_ENABLED=true`. Keep the latter absent or `false` until the private key and approved accounts are ready.
6. Test both accounts on the actual Worker site: sign-in, reload, save name, opt in/out, sign-out, wrong password, and isolation. Lovable's independent preview remains in sample mode without the Worker bindings. Disable test sign-in by setting `CLIENT_AUTH_ENABLED=false`.

Automated tests exercise real SQL through a D1-compatible SQLite fixture, including two-account isolation, unapproved account rejection, session expiry, sign-out, rate limits, and consent audit behavior. Remote end-to-end sign-in must still be verified after activation.

Before real customer registration, add recovery and verified-email delivery, data retention/deletion, an appropriate privacy notice, and a separate reviewed rollout. Paid memberships require a payment provider and verified server-side webhooks; marketing requires a delivery provider. Setmore bookings remain independent and no appointment or revenue history is imported.
