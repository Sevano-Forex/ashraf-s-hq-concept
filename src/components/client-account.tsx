import { useEffect, useState, type FormEvent } from "react";
import { CreditCard, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getAccountClient,
  sampleAccount,
  type ClientAccount,
  type AccountClient,
} from "@/lib/client-accounts";
import { bookingUrl } from "@/lib/barbershop";

export function ClientAccountSection() {
  const [db, setDb] = useState<AccountClient | null>(null);
  const [account, setAccount] = useState<ClientAccount | null>(null);
  const [isSample, setIsSample] = useState(false);
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [emailOptIn, setEmailOptIn] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const showAccount = (next: ClientAccount) => {
    setAccount(next);
    setName(next.displayName);
    setEmailOptIn(next.emailOptIn);
    setPassword("");
  };

  useEffect(() => {
    let active = true;
    void (async () => {
      const connection = await getAccountClient();
      if (!active || !connection) return;
      setDb(connection);
      setBusy(true);
      try {
        const next = await connection.restore();
        if (active && next) showAccount(next);
      } catch {
        if (active) setError("Your test session could not be restored. Please sign in again.");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const clearMessages = () => {
    setNotice("");
    setError("");
  };
  const startSample = () => {
    clearMessages();
    setIsSample(true);
    showAccount({ ...sampleAccount });
    setNotice("Sample account only. Changes here are temporary and are not saved to the database.");
  };
  const signIn = async (event: FormEvent) => {
    event.preventDefault();
    if (!db || busy) return;
    clearMessages();
    setBusy(true);
    try {
      const next = await db.signIn(email.trim(), password);
      setIsSample(false);
      showAccount(next);
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to sign in. Please try again.");
    } finally {
      setPassword("");
      setBusy(false);
    }
  };
  const saveProfile = async (event: FormEvent) => {
    event.preventDefault();
    if (!account || busy) return;
    clearMessages();
    const trimmedName = name.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError("Please use a name between 2 and 80 characters.");
      return;
    }
    setBusy(true);
    try {
      if (!isSample) {
        if (!db) throw new Error("The connection is unavailable. Please try again.");
        await db.saveProfile(trimmedName);
      }
      setAccount({ ...account, displayName: trimmedName });
      setNotice(
        isSample
          ? "Sample profile updated for this preview only."
          : "Your test profile has been saved.",
      );
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to save profile.");
    } finally {
      setBusy(false);
    }
  };
  const savePreferences = async (event: FormEvent) => {
    event.preventDefault();
    if (!account || busy) return;
    clearMessages();
    setBusy(true);
    try {
      if (!isSample) {
        if (!db) throw new Error("The connection is unavailable. Please try again.");
        await db.savePreferences(emailOptIn);
      }
      setAccount({ ...account, emailOptIn });
      setNotice(
        isSample
          ? "Sample preference updated. Nothing was saved and no emails will be sent."
          : "Your test preference has been saved. This preview does not send marketing emails.",
      );
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to save preferences.");
    } finally {
      setBusy(false);
    }
  };
  const signOut = async () => {
    clearMessages();
    setBusy(true);
    try {
      if (!isSample && db) {
        await db.signOut();
      }
      setAccount(null);
      setIsSample(false);
      setName("");
      setEmailOptIn(false);
      setEmail("");
      setPassword("");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Unable to sign out.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      id="client-account"
      className="client-account-section"
      aria-labelledby="client-account-title"
    >
      <div className="container">
        <div className="account-heading">
          <div>
            <p className="eyebrow">CLIENT ACCESS · TEST PREVIEW</p>
            <h2 id="client-account-title">
              YOUR CHAIR.
              <br />
              <span>YOUR ACCOUNT.</span>
            </h2>
          </div>
          <p>
            One place for your profile, preferences, and future membership. This preview uses test
            accounts only. Customer registration is not open.
          </p>
        </div>
        {notice && (
          <p className="account-notice" role="status">
            {notice}
          </p>
        )}
        {error && (
          <p className="account-error" role="alert">
            {error}
          </p>
        )}
        {!account ? (
          <div className="account-login-grid">
            <div className="account-intro">
              <UserRound size={32} aria-hidden="true" />
              <h3>A little more personal.</h3>
              <p>Preview a client space designed around your next fresh look.</p>
              <ul>
                <li>Keep your profile in one place</li>
                <li>Choose your email preferences</li>
                <li>See future membership details</li>
              </ul>
              <p className="account-small">
                Appointments continue through Setmore. Website accounts do not show live appointment
                history yet.
              </p>
            </div>
            <div className="account-card">
              <h3>
                <LockKeyhole size={18} aria-hidden="true" />
                Test client sign-in
              </h3>
              {!db && (
                <p className="account-small">
                  Test sign-in is being connected. Explore a sample account below while it is
                  prepared.
                </p>
              )}
              <form onSubmit={signIn}>
                <label htmlFor="client-email">Test account email</label>
                <input
                  id="client-email"
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={!db || busy}
                />
                <label htmlFor="client-password">Password</label>
                <input
                  id="client-password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={!db || busy}
                />
                <Button type="submit" variant="brass" disabled={!db || busy}>
                  {busy ? "Please wait…" : "Sign in to test account"}
                </Button>
              </form>
              <div className="account-divider">OR TRY THE DESIGN</div>
              <Button type="button" variant="barberOutline" onClick={startSample} disabled={busy}>
                Explore a sample account
              </Button>
              <p className="account-small">
                Use only test details in this preview. No payments or marketing messages are sent.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="account-welcome">
              <div>
                <p className="eyebrow">{isSample ? "SAMPLE ACCOUNT" : "APPROVED TEST ACCOUNT"}</p>
                <h3>Welcome, {account.displayName}.</h3>
              </div>
              <Button type="button" variant="barberOutline" onClick={signOut} disabled={busy}>
                {isSample ? "Close sample account" : "Sign out"}
              </Button>
            </div>
            <div className="account-dashboard">
              <div className="account-card">
                <h3>
                  <UserRound size={18} aria-hidden="true" />
                  Your profile
                </h3>
                <form onSubmit={saveProfile}>
                  <label htmlFor="client-name">Display name</label>
                  <input
                    id="client-name"
                    value={name}
                    minLength={2}
                    maxLength={80}
                    required
                    disabled={busy}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <p className="account-small">{account.email}</p>
                  <Button type="submit" variant="brass" disabled={busy}>
                    Save profile
                  </Button>
                </form>
              </div>
              <div className="account-card">
                <h3>
                  <Mail size={18} aria-hidden="true" />
                  Stay in the loop
                </h3>
                <form onSubmit={savePreferences}>
                  <label className="account-checkbox">
                    <input
                      type="checkbox"
                      checked={emailOptIn}
                      disabled={busy}
                      onChange={(event) => setEmailOptIn(event.target.checked)}
                    />
                    <span>I would like email news and offers from the shop.</span>
                  </label>
                  <p className="account-small">
                    Optional and separate from a paid membership. You can change this choice at any
                    time. No emails are sent in this test preview.
                  </p>
                  <Button type="submit" variant="barberOutline" disabled={busy}>
                    Save preferences
                  </Button>
                </form>
              </div>
              <div className="account-card">
                <h3>
                  <CreditCard size={18} aria-hidden="true" />
                  Membership
                </h3>
                <p className="account-membership">{account.planName ?? "No membership selected"}</p>
                <p className="account-small">
                  Status: {account.membershipStatus.replaceAll("_", " ")}
                </p>
                <p>
                  Paid memberships are planned for a later phase. There is no checkout or charge in
                  this preview.
                </p>
                <Button variant="brass" asChild>
                  <a
                    href={bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Book on Setmore (opens in a new tab)"
                  >
                    Book on Setmore
                  </a>
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
