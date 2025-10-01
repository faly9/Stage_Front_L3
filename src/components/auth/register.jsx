import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState(""); // ✅ nouveau champ rôle
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let tempErrors = {};

    // juste une debogage de code
    console.log(email, role, password, cpassword);
    if (!email) tempErrors.email = "L'email est obligatoire";
    if (!role) tempErrors.role = "Le rôle est obligatoire";
    if (!password) tempErrors.password = "Le mot de passe est obligatoire";
    if (!cpassword) tempErrors.cpassword = "La confirmation est obligatoire";
    if (password && cpassword && password !== cpassword)
      tempErrors.cpassword = "Les mots de passe ne correspondent pas";

    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;

    try {
      const res = await fetch("http://localhost:8001/auth/register/", {
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
      } else {
        setErrors({ server: data.error || "Erreur lors de l'inscription" });
      }
    } catch (err) {
      setErrors({ server: "Erreur réseau : " + err.message });
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-blue-100">
      {/* Boules animées */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-purple-300 opacity-30 animate-bounce"
          style={{
            width: `${20 + Math.random() * 80}px`,
            height: `${20 + Math.random() * 80}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}

      <div className="relative bg-white w-full max-w-5xl min-h-[700px] rounded-2xl shadow-2xl flex overflow-hidden">
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
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800 animate-bounce">
            Inscription
          </h1>

          {message && (
            <p className="mb-4 text-center text-green-500 font-semibold">
              {message}
            </p>
          )}
          {errors.server && (
            <p className="mb-4 text-center text-red-500 font-semibold">
              {errors.server}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 space-y-5"
          >
            {/* Email */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-purple-400"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Sélection rôle */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium">
                Choisissez votre rôle
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                  errors.role
                    ? "border-red-500 focus:ring-red-400"
                    : "focus:ring-purple-400"
                }`}
              >
                <option value="">-- Sélectionnez un rôle --</option>
                <option value="Freelance">Freelance</option>
                <option value="Entreprise">Entreprise</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium">
                Mot de passe
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-purple-400"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmation mot de passe */}
            <div className="w-full">
              <label className="block text-gray-700 font-medium">
                Confirmation du mot de passe
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="password"
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                  className={`w-full pl-10 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
                    errors.cpassword
                      ? "border-red-500 focus:ring-red-400"
                      : "focus:ring-purple-400"
                  }`}
                />
              </div>
              {errors.cpassword && (
                <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
            >
              S'inscrire
            </button>
          </form>

          <div className="flex justify-center pt-4">
            <p>
              Avez-vous déjà un compte ?{" "}
              <button
                className="underline text-blue-600"
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
