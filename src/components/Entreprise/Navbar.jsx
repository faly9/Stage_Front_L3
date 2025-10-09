import { Home, Brain, User, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

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
        toast.error(`❌ Erreur logout (${res.status})`, {
          position: "top-center",
        });
        console.error("Erreur logout", res.status);
      }
    } catch (err) {
      console.error(err);
      toast.error("❌ Erreur réseau lors du logout", {
        position: "top-center",
      });
    }
  };

  const menuItems = [
    { key: "dashboard", label: "Missions", icon: <Home className="w-5 h-5" /> },
    { key: "ia", label: "Proposition IA", icon: <Brain className="w-5 h-5" /> },
    { key: "Candidat", label: "Candidats", icon: <User className="w-5 h-5" /> },
    {
      key: "message",
      label: "Messages envoyés",
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col justify-between p-4 h-screen overflow-y-auto">
      {/* Partie du haut */}
      <div>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg text-left font-medium transition
                ${
                  section === item.key
                    ? "bg-red-600 text-white"
                    : "text-gray-700 hover:bg-red-200"
                }`}
            >
              {item.icon}
              {item.label}

              {/* Badge rouge si Candidats */}
              {item.key === "Candidat" && candidatureCount > 0 && (
                <span className="absolute right-3 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                  new {candidatureCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bouton déconnexion collé en bas */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
