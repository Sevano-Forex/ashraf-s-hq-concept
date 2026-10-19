import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ClientAccountSection } from "@/components/client-account";

vi.mock("@/lib/client-accounts", async importOriginal => {
  const original = await importOriginal<typeof import("@/lib/client-accounts")>();
  return { ...original, getAccountClient: () => null };
});
afterEach(cleanup);

describe("Test client area without a configured connection", () => {
  it("disables credential entry and explains the sample mode", () => {
    render(<ClientAccountSection />);
    expect(screen.getByLabelText("Test account email")).toBeDisabled();
    expect(screen.getByLabelText("Password")).toBeDisabled();
    expect(screen.getByRole("button", { name: "Sign in to test account" })).toBeDisabled();
    expect(screen.getByText(/Test sign-in is being connected/)).toBeInTheDocument();
  });
  it("lets the sample profile be edited without pretending it was saved to the database", async () => {
    render(<ClientAccountSection />);
    fireEvent.click(screen.getByRole("button", { name: "Explore a sample account" }));
    fireEvent.change(screen.getByLabelText("Display name"), { target: { value: "Sample Person" } });
    fireEvent.click(screen.getByRole("button", { name: "Save profile" }));
    expect(await screen.findByRole("heading", { name: "Welcome, Sample Person." })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("for this preview only");
  });
  it("starts marketing unchecked and discards sample changes when closed", async () => {
    render(<ClientAccountSection />);
    fireEvent.click(screen.getByRole("button", { name: "Explore a sample account" }));
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByRole("button", { name: "Save preferences" }));
    expect(await screen.findByRole("status")).toHaveTextContent("no emails will be sent");
    fireEvent.click(screen.getByRole("button", { name: "Close sample account" }));
    fireEvent.click(await screen.findByRole("button", { name: "Explore a sample account" }));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
    expect(screen.getByRole("heading", { name: "Welcome, Demo Client." })).toBeInTheDocument();
  });
});
