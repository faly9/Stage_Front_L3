import { Home, Brain, User, MessageCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getConfig } from "../../config";

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

export default function Navbar({ section, onSectionChange, candidatureCount }) {
  const navigate = useNavigate();
  const { API_URL } = getConfig();

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
        toast.error(`❌ Erreur logout (${res.status})`, {
          position: "top-center",
        });
      }
    } catch (err) {
      toast.error("❌ Erreur réseau lors du logout", {
        position: "top-center",
      });
    }
  };

  const menuItems = [
    { key: "dashboard", label: "Missions", icon: <Home className="w-5 h-5" /> },
    { key: "Candidat", label: "Candidats", icon: <User className="w-5 h-5" /> },
    {
      key: "message",
      label: "Messages envoyés",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  return (
    <aside
      className="w-64 flex flex-col justify-between p-5 h-screen shadow-xl border-r transition-colors duration-500"
      style={{
        background: "var(--card-bg)",
        borderColor: "var(--border)",
      }}
    >
      {/* --- Partie du haut --- */}
      <div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 shadow-sm`}
              style={{
                background:
                  section === item.key ? "var(--accent)" : "transparent",
                color:
                  section === item.key
                    ? "var(--text-on-accent)"
                    : "var(--text-primary)",
                boxShadow:
                  section === item.key
                    ? "0 4px 10px rgba(0,0,0,0.15)"
                    : "none",
              }}
            >
              <div
                className="p-2 rounded-lg"
                style={{
                  background:
                    section === item.key ? "var(--accent-light)" : "transparent",
                  color:
                    section === item.key
                      ? "var(--text-primary)"
                      : "var(--text-primary)",
                }}
              >
                {item.icon}
              </div>
              <span className="text-base">{item.label}</span>

              {/* Badge de candidats */}
              {item.key === "Candidat" && candidatureCount > 0 && (
                <span
                  className="absolute right-4 text-xs px-2 py-0.5 rounded-full shadow"
                  style={{
                    background: "var(--accent-strong)",
                    color: "var(--text-on-accent)",
                  }}
                >
                  +{candidatureCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* --- Bouton déconnexion --- */}
      <div className="pt-6 border-t" style={{ borderColor: "var(--border)" }}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-5 px-4 py-3 rounded-xl font-semibold shadow-md transition-all duration-300 active:scale-95"
          style={{
            background: "var(--accent)",
            color: "var(--text-on-accent)",
          }}
        >
          <LogOut className="w-8 h-8 p-2 rounded-lg" style={{ color: "var(--text-on-accent)" }} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
