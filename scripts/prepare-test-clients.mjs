import { DatabaseSync } from "node:sqlite";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { betterAuth } from "better-auth";
import { accountAuthOptions } from "../src/lib/account-auth-options.ts";

// Offline staff tool only. There is no registration endpoint in the website.
// Files contain test credentials: keep .tooling ignored, apply SQL only to the test DB.
const db = new DatabaseSync(":memory:");
db.exec(readFileSync("cloudflare/migrations/0002_test_auth.sql", "utf8"));
const auth = betterAuth({
  ...accountAuthOptions,
  database: db,
  secret: randomBytes(48).toString("base64url"),
  baseURL: "https://offline.example.test",
  emailAndPassword: { enabled: true, minPasswordLength: 12 },
});
const credentials = [];
const profiles = [];
for (const number of [1, 2]) {
  const email = `test${number}@ashraf.example.test`;
  const password = randomBytes(24).toString("base64url");
  const name = `Test Client ${number}`;
  const result = await auth.api.signUpEmail({ body: { email, password, name } });
  profiles.push({
    id: randomUUID(),
    auth_provider: "better-auth",
    auth_subject: result.user.id,
    display_name: name,
    is_test: 1,
  });
  credentials.push(`${email}\n${password}`);
}
const quote = (value) =>
  value === null
    ? "NULL"
    : typeof value === "number"
      ? String(value)
      : `'${String(value).replaceAll("'", "''")}'`;
const insert = (table, row) =>
  `INSERT INTO "${table}" (${Object.keys(row)
    .map((k) => `"${k}"`)
    .join(", ")}) VALUES (${Object.values(row).map(quote).join(", ")});`;
const sql = [
  ...db
    .prepare("SELECT * FROM auth_user")
    .all()
    .map((row) => insert("auth_user", row)),
  ...db
    .prepare("SELECT * FROM auth_account")
    .all()
    .map((row) => insert("auth_account", row)),
  ...profiles.map((row) => insert("client_profiles", row)),
  ...profiles.map((row) =>
    insert("client_marketing_preferences", { client_id: row.id, email_opt_in: 0 }),
  ),
].join("\n");
mkdirSync(".tooling", { recursive: true });
writeFileSync(".tooling/provision-test-clients.sql", sql, { flag: "wx" });
writeFileSync(".tooling/test-client-credentials.txt", credentials.join("\n\n"), { flag: "wx" });
writeFileSync(".tooling/client-auth-secret.txt", randomBytes(48).toString("base64url"), {
  flag: "wx",
});
db.close();
console.log(
  "Prepared two fictional test accounts and a signing key in ignored .tooling files. No remote changes made.",
);
