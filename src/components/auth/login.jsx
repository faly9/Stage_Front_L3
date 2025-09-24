import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";



function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  const navigate = useNavigate(); 
console.log(crsftoken)
  // Déplacement du curseur -> effet parallax
  const handleMouseMove = (e) => {
    setCursor({
      x: (e.clientX / window.innerWidth - 0.5) * 40, // décalage -20px à +20px
      y: (e.clientY / window.innerHeight - 0.5) * 40,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let tempErrors = {};
    console.log("tonga eto" , email , password)

    if (!email) tempErrors.email = "L'email est obligatoire";
    if (!password) tempErrors.password = "Le mot de passe est obligatoire";
    setErrors(tempErrors);
    if (Object.keys(tempErrors).length > 0) return;
    
    try {
      const res = await fetch("http://localhost:8001/auth/login/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") // <-- ajouter ça
        },        
        body: JSON.stringify({ email, password }),
      });
      console.log("tongasoa" , email , password)

// Fonction utilitaire pour récupérer un cookie par son nom

      const data = await res.json();

if (res.ok) {
  toast.success("✅ Connexion réussie !", {
    position: "top-center",
    autoClose: 1000,
    onClose: () => {
      if (data.role === "Entreprise") {
        navigate("/dashboard-entreprise");
      } else {
        navigate("/dashboard-freelance");
      }
    },
  });

  setEmail("");
  setPassword("");
  setErrors({});
}
      else {
        if (data.error?.toLowerCase().includes("email")) {
          setErrors({ email: data.error });
        } else if (data.error?.toLowerCase().includes("mot de passe")) {
          setErrors({ password: data.error });
        } else {
          setErrors({ server: data.error || "Erreur lors de la connexion" });
        }
      }
    } catch (err) {
      setErrors({ server: "Erreur réseau : " + err.message });
    }
  };

  // Tableau des bulles animées
  const bubbles = [
    { size: 80, color: "bg-purple-400", pos: "top-10 left-10" },
    { size: 120, color: "bg-pink-400", pos: "bottom-20 right-20" },
    { size: 60, color: "bg-yellow-300", pos: "top-1/4 left-1/3" },
    { size: 100, color: "bg-blue-400", pos: "bottom-32 left-1/4" },
    { size: 150, color: "bg-green-400", pos: "top-1/2 right-1/4" },
    { size: 50, color: "bg-red-400", pos: "top-1/3 right-10" },
  ];

  return (
    <div
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-300 to-blue-100 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Boules animées */}
      {bubbles.map((b, i) => (
        <motion.div
          key={i}
          className={`absolute ${b.pos} ${b.color} rounded-full opacity-30`}
          style={{ width: b.size, height: b.size }}
          animate={{
            x: [cursor.x, cursor.x + (i % 2 === 0 ? 30 : -30), cursor.x],
            y: [cursor.y, cursor.y + (i % 2 === 0 ? 40 : -40), cursor.y],
          }}
          transition={{
            duration: 6 + i * 2,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      ))}

      {/* Cadre principal animé (parallax) */}
      <motion.div
        className="relative bg-white w-full max-w-5xl min-h-[700px] rounded-2xl shadow-2xl flex overflow-hidden z-10"
        animate={{
          x: cursor.x / 5, // léger effet parallax
          y: cursor.y / 5,
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      >
        {/* Image à gauche */}
        <div className="w-1/2 hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
            alt="Personne souriante devant un ordinateur"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Formulaire à droite */}
        <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
            Connexion
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
            onSubmit={handleLogin}
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

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition transform hover:scale-105"
            >
              Se connecter
            </button>
          </form>

<div className="flex justify-center pt-4">
  <p>
    Pas encore de compte ?{" "}
    <button
      className="underline text-blue-600"
      onClick={() => navigate("/register")}
    >
      S'inscrire
    </button>
  </p>
</div>        
</div>
      </motion.div>

    </div>
  );
}
