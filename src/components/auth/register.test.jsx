// src/components/auth/register.test.jsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./register";
import { BrowserRouter } from "react-router-dom";
import { vi } from "vitest";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock getConfig()
vi.mock("../../config", () => ({
  getConfig: () => ({
    API_URL: "http://fakeapi.test",
  }),
}));

describe("Register Component", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    global.fetch = vi.fn();
  });

  it("affiche des erreurs si les champs sont vides", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(await screen.findByText(/l'email est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/le rôle est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/le mot de passe est obligatoire/i)).toBeInTheDocument();
    expect(screen.getByText(/la confirmation est obligatoire/i)).toBeInTheDocument();
  });

  it("affiche une erreur si les mots de passe ne correspondent pas", async () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Choisissez votre rôle"), {
      target: { value: "Freelance" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("Confirmation du mot de passe"), {
      target: { value: "different123" }, // 🔥 important : différent
    });

    fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(
      await screen.findByText(/les mots de passe ne correspondent pas/i)
    ).toBeInTheDocument();
  });

  it("inscription réussie et navigation", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: "ok" }),
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Choisissez votre rôle"), {
      target: { value: "Freelance" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("Confirmation du mot de passe"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/verify-notice");
    });
  });

  it("affiche erreur serveur si API renvoie une erreur", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Email déjà utilisé" }),
    });

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Choisissez votre rôle"), {
      target: { value: "Freelance" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("Confirmation du mot de passe"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(
      await screen.findByText(/email déjà utilisé/i)
    ).toBeInTheDocument();
  });

  it("affiche erreur réseau si fetch échoue", async () => {
    global.fetch.mockRejectedValueOnce(new Error("Network Error"));

    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@test.com" },
    });
    fireEvent.change(screen.getByLabelText("Choisissez votre rôle"), {
      target: { value: "Freelance" },
    });
    fireEvent.change(screen.getByLabelText("Mot de passe"), {
      target: { value: "abc123" },
    });
    fireEvent.change(screen.getByLabelText("Confirmation du mot de passe"), {
      target: { value: "abc123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /s'inscrire/i }));

    expect(
      await screen.findByText(/erreur réseau : network error/i)
    ).toBeInTheDocument();
  });
});
