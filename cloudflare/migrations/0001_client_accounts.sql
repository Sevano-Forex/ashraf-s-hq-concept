-- Cloudflare D1/SQLite application data. Apply only to the selected test DB.
-- Authentication must be verified server-side before any client queries.
-- No passwords, sessions, or payment-card data belong in these tables.
PRAGMA foreign_keys = ON;

CREATE TABLE client_profiles (
  id TEXT PRIMARY KEY NOT NULL,
  auth_provider TEXT NOT NULL,
  auth_subject TEXT NOT NULL,
  display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 2 AND 80),
  is_test INTEGER NOT NULL DEFAULT 1 CHECK (is_test = 1),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE (auth_provider, auth_subject)
);
CREATE TABLE client_marketing_preferences (
  client_id TEXT PRIMARY KEY NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
  email_opt_in INTEGER NOT NULL DEFAULT 0 CHECK (email_opt_in IN (0, 1)),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE TABLE client_memberships (
  client_id TEXT PRIMARY KEY NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
  plan_name TEXT,
  status TEXT NOT NULL DEFAULT 'not_enrolled' CHECK (status IN ('not_enrolled', 'trialing', 'active', 'past_due', 'cancelled')),
  billing_provider TEXT,
  provider_subscription_id TEXT UNIQUE,
  current_period_end TEXT,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE TABLE client_consent_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
  email_opt_in INTEGER NOT NULL CHECK (email_opt_in IN (0, 1)),
  recorded_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  source TEXT NOT NULL DEFAULT 'test_client_portal'
);
CREATE TABLE client_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  client_id TEXT NOT NULL REFERENCES client_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('test_login', 'profile_updated')),
  occurred_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX client_profiles_created ON client_profiles(created_at);
CREATE INDEX client_events_client_time ON client_events(client_id, occurred_at);
CREATE INDEX client_events_type_time ON client_events(event_type, occurred_at);
CREATE INDEX client_consent_client_time ON client_consent_history(client_id, recorded_at);

CREATE TRIGGER client_consent_on_insert AFTER INSERT ON client_marketing_preferences
BEGIN
  INSERT INTO client_consent_history(client_id, email_opt_in) VALUES (new.client_id, new.email_opt_in);
END;
CREATE TRIGGER client_consent_on_change AFTER UPDATE OF email_opt_in ON client_marketing_preferences
WHEN old.email_opt_in <> new.email_opt_in
BEGIN
  UPDATE client_marketing_preferences SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE client_id = new.client_id;
  INSERT INTO client_consent_history(client_id, email_opt_in) VALUES (new.client_id, new.email_opt_in);
END;
