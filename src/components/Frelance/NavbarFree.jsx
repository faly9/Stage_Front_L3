// NavbarFreelance.js
import React from "react";
import { User, Briefcase, Cpu, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};


export default function NavbarFreelance({ user, activeSection, onSectionChange , freelance }) {
const navigate = useNavigate();

  const handleLogout = async () => {
    const csrftoken = getCookie("csrftoken");
    try {
      const res = await fetch("http://localhost:8001/auth/logout/", {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": csrftoken },
      });
  
      if (res.ok) {
        toast.success("✅ Déconnexion réussie", { position: "top-center" });
        navigate("/"); // redirection vers login
      } else {
        toast.error(`❌ Erreur logout (${res.status})`, { position: "top-center" });
        console.error("Erreur logout", res.status);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur réseau lors du logout", { position: "top-center" });
    }
  };
  
  
    const sections = [
    { name: "Mon Profil", icon: <User className="w-4 h-4" /> },
    { name: "Offres disponibles", icon: <Briefcase className="w-4 h-4" /> },
    { name: "IA", icon: <Cpu className="w-4 h-4" /> },
    { name: "Historique", icon: <Clock className="w-4 h-4" /> },
  ];




  return (
    <nav className="w-64 bg-white shadow flex flex-col justify-between">
      <div className="p-6 space-y-6">
        {/* Profil utilisateur */}
        <div className="flex flex-col items-center">
          <img
            src={freelance.photo || "/images/profil.png" // ✅ ton image par défaut dans /public
}
            alt="Profil"
            className="w-20 h-20 rounded-full border object-cover"
          />
          <p className="mt-2 font-bold">{freelance.nom}</p>
        </div>

        {/* Sections avec icône */}
        <div className="flex flex-col gap-3">
          {sections.map((sec) => (
            <button
              key={sec.name}
              className={`flex items-center gap-2 text-left px-3 py-2 rounded hover:bg-gray-200 transition ${
                activeSection === sec.name ? "bg-red-600 text-white font-semibold" : ""
              }`}
              onClick={() => onSectionChange(sec.name)}
            >
              {sec.icon}
              {sec.name}
            </button>
          ))}
        </div>
      </div>

      {/* Déconnexion */}
      <div className="p-6">
        <button
        onClick={handleLogout}
        className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
