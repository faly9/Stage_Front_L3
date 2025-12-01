// src/components/auth/login.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./login";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";
import { toast } from "react-toastify";

// ----------------------
// Mocks
// ----------------------

// Mock react-router-dom pour useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// ----------------------
// Tests
// ----------------------
describe("Login Component", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    global.fetch = vi.fn();
  });

  it("login réussi navigue vers le dashboard freelance", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ role: "Freelance" }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "password" } });

    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => expect(toast.success).toHaveBeenCalled());
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/dashboard-freelance"));
  });

  it("échec login avec email incorrect", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email incorrect" }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "wrong@test.com" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "password" } });

    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => expect(screen.getByText(/email incorrect/i)).toBeInTheDocument());
  });

  it("échec login avec mot de passe incorrect", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Mot de passe incorrect" }),
    });

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "wrongpassword" } });

    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => expect(screen.getByText(/mot de passe incorrect/i)).toBeInTheDocument());
  });

  it("affiche erreur réseau si fetch échoue", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@test.com" } });
    fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: "password" } });

    fireEvent.click(screen.getByRole("button", { name: /se connecter/i }));

    await waitFor(() => expect(screen.getByText(/erreur réseau/i)).toBeInTheDocument());
  });
});
