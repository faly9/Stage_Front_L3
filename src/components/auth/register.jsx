import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// import { API_URL } from "../../config";
import { getConfig } from "../../config";

export default function Register() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { API_URL } = getConfig();


  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    if (!email) tempErrors.email = "L'email est obligatoire";
    if (!role) tempErrors.role = "Le rôle est obligatoire";
    if (!password) tempErrors.password = "Le mot de passe est obligatoire";
    if (!cpassword) tempErrors.cpassword = "La confirmation est obligatoire";
    if (password && cpassword && password !== cpassword)
      tempErrors.cpassword = "Les mots de passe ne correspondent pas";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    try {
      const res = await fetch(`${API_URL}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, password }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Inscription réussie !");
        setEmail("");
        setRole("");
        setPassword("");
        setCpassword("");
        setErrors({});
        navigate("/verify-notice");
      } else {
        setErrors({ server: data.error || "Erreur lors de l'inscription" });
      }
    } catch (err) {
      setErrors({ server: "Erreur réseau : " + err.message });
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))",
      }}
    >
      {/* Boules animées */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full opacity-20 animate-bounce"
          style={{
            backgroundColor: "var(--accent-light)",
            width: `${20 + Math.random() * 80}px`,
            height: `${20 + Math.random() * 80}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      <div
        className="relative w-full max-w-5xl min-h-[700px] rounded-2xl shadow-2xl flex overflow-hidden"
        style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}
      >
        {/* Image à gauche */}
        <div className="w-1/2 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=800&q=80"
            alt="Personne travaillant en ligne"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulaire à droite */}
        <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center">
          <h1
            className="text-4xl font-bold mb-6 text-center animate-bounce"
            style={{ color: "var(--text-primary)" }}
          >
            Inscription
          </h1>

          {message && (
            <p className="mb-4 text-center font-semibold" style={{ color: "var(--bouton-ajouter)" }}>
              {message}
            </p>
          )}
          {errors.server && (
            <p className="mb-4 text-center font-semibold" style={{ color: "var(--accent-strong)" }}>
              {errors.server}
            </p>
          )}

          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 space-y-5">
            {/* Email */}
            <div className="w-full">
              <label
                htmlFor="email"
                className="block font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  className="absolute left-3 top-3"
                  style={{ color: "var(--icon-primary)" }}
                />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.email ? "var(--accent-strong)" : "var(--border)",
                    backgroundColor: "var(--button-bg)",
                    color: "var(--text-primary)",
                    outlineColor: "var(--accent)",
                  }}
                />
              </div>
              {errors.email && (
                <p style={{ color: "var(--accent-strong)" }} className="text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Rôle */}
            <div className="w-full">
              <label htmlFor="role" className="block font-medium" style={{ color: "var(--text-primary)" }}>
                Choisissez votre rôle
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
                style={{
                  borderColor: errors.role ? "var(--accent-strong)" : "var(--border)",
                  backgroundColor: "var(--button-bg)",
                  color: "var(--text-primary)",
                  outlineColor: "var(--accent)",
                }}
              >
                <option value="">-- Sélectionnez un rôle --</option>
                <option value="Freelance">Freelance</option>
                <option value="Entreprise">Entreprise</option>
              </select>
              {errors.role && (
                <p style={{ color: "var(--accent-strong)" }} className="text-sm mt-1">
                  {errors.role}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="w-full">
              <label htmlFor="password" className="block font-medium" style={{ color: "var(--text-primary)" }}>
                Mot de passe
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-3 top-3"
                  style={{ color: "var(--icon-primary)" }}
                />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.password ? "var(--accent-strong)" : "var(--border)",
                    backgroundColor: "var(--button-bg)",
                    color: "var(--text-primary)",
                    outlineColor: "var(--accent)",
                  }}
                />
              </div>
              {errors.password && (
                <p style={{ color: "var(--accent-strong)" }} className="text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirmation */}
            <div className="w-full">
              <label htmlFor="cpass" className="block font-medium" style={{ color: "var(--text-primary)" }}>
                Confirmation du mot de passe
              </label>
              <div className="relative">
                <FaLock
                  className="absolute left-3 top-3"
                  style={{ color: "var(--icon-primary)" }}
                />
                <input
                  type="password"
                  id="cpass"
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                  className="w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition"
                  style={{
                    borderColor: errors.cpassword ? "var(--accent-strong)" : "var(--border)",
                    backgroundColor: "var(--button-bg)",
                    color: "var(--text-primary)",
                    outlineColor: "var(--accent)",
                  }}
                />
              </div>
              {errors.cpassword && (
                <p style={{ color: "var(--accent-strong)" }} className="text-sm mt-1">
                  {errors.cpassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg font-semibold transition transform hover:scale-105"
              style={{
                backgroundColor: "var(--accent)",
                color: "var(--text-on-accent)",
              }}
            >
              S'inscrire
            </button>
          </form>

          <div className="flex justify-center pt-4">
            <p style={{ color: "var(--text-secondary)" }}>
              Avez-vous déjà un compte ?{" "}
              <button
                className="underline"
                style={{ color: "var(--accent)" }}
                onClick={() => navigate("/")}
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
