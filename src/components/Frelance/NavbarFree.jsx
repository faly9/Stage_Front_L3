// 🧭 NavbarFreelance.js
// Date : 15 Octobre 2025
// Auteur : Faly Raph
// Description : Barre latérale moderne et responsive pour l’espace freelanceur (profil, offres, notifications)

import React, { useState } from "react";
import { User, Briefcase, MessageCircle, LogOut, Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

// --- Gestion du cookie CSRF ---
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

export default function NavbarFreelance({
  activeSection,
  onSectionChange,
  newoffer,
  newnotification,
}) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    const csrftoken = getCookie("csrftoken");
    try {
      const res = await fetch(`${API_URL}/auth/logout/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": csrftoken },
      });

      if (res.ok) {
        toast.success("✅ Déconnexion réussie", { position: "top-center" });
        navigate("/");
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
    { name: "Mon Profil", icon: <User className="w-5 h-5" /> },
    { name: "Offres disponibles", icon: <Briefcase className="w-5 h-5" /> },
    { name: "Notifications", icon: <MessageCircle className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* --- Bouton menu mobile --- */}
      <div className="md:hidden flex justify-between items-center bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] p-4 shadow">
        <h1 className="text-lg font-semibold text-[var(--accent-strong)]">
          Freelanceur
        </h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-[var(--icon-primary)] hover:text-[var(--icon-secondary)] transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Barre latérale --- */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-gradient-to-b from-[var(--gradient-from)
        shadow-xl flex flex-col justify-between p-5 border-r border-[var(--border)] 
        transition-transform duration-500 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"} z-50`}
      >
        {/* --- Menu du haut --- */}
        <div className="space-y-8">

          <nav className="flex flex-col gap-3">
            {sections.map((sec) => (
              <button
                key={sec.name}
                onClick={() => {
                  onSectionChange(sec.name);
                  setIsOpen(false);
                }}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium 
                  transition-all duration-300 shadow-sm
                  ${
                    activeSection === sec.name
                      ? "bg-[var(--accent)] text-[var(--text-on-accent)] scale-[1.02] shadow-md"
                      : "text-[var(--text-primary)] hover:bg-[var(--accent-light)] hover:text-[var(--text-on-accent)]"
                  }`}
              >
                <div
                  className={`p-2 rounded-lg color-[var(--text-primary)] ${
                    activeSection === sec.name ? "bg-white/20" : ""
                  }`}
                  
                >
                  {sec.icon}
                </div>
                <span className="text-base">{sec.name}</span>

                {/* --- Badges dynamiques --- */}
                {sec.name === "Offres disponibles" && newoffer > 0 && (
                  <span className="absolute right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                    {newoffer}
                  </span>
                )}
                {sec.name === "Notifications" && newnotification > 0 && (
                  <span className="absolute right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                    {newnotification}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* --- Bouton Déconnexion --- */}
        <div className="pt-6 border-t border-[var(--border)]">
          <button
            onClick={handleLogout}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-strong)] text-[var(--text-on-accent)]
              flex items-center gap-10 px-4 py-3 rounded-xl font-semibold shadow-md 
              transition-all duration-300"
          >
            <LogOut className="w-8 h-8 p-2 bg-white/20 rounded-lg" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
