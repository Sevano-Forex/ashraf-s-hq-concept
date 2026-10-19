import { DatabaseSync } from "node:sqlite";
import { writeFileSync } from "node:fs";
import { getMigrations } from "better-auth/db/migration";
import { accountAuthOptions } from "../src/lib/account-auth-options.ts";
const migration = await getMigrations({
  ...accountAuthOptions,
  database: new DatabaseSync(":memory:"),
});
writeFileSync(
  "cloudflare/migrations/0002_test_auth.sql",
  "-- Better Auth schema generated from pinned options. No credentials or customer data.\n" +
    (await migration.compileMigrations()),
);
