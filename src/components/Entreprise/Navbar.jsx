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
    <aside className="w-64 bg-gradient-to-b from-white via-red-50 to-white shadow-xl flex flex-col justify-between p-5 h-screen border-r border-red-100">
      {/* Partie du haut */}
      <div>
        {/* <h1 className="text-2xl font-bold text-red-600 mb-6 text-center tracking-wide">
          Entreprise
        </h1> */}

        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onSectionChange(item.key)}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-left font-medium transition-all duration-300 shadow-sm
            ${
              section === item.key
                ? "bg-red-600 text-white shadow-md scale-[1.02]"
                : "text-gray-700 hover:bg-red-100 hover:shadow-sm hover:scale-[1.02]"
            }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  section === item.key ? "bg-white/20" : "bg-red-100"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-base">{item.label}</span>

              {/* Badge rouge si Candidats */}
              {item.key === "Candidat" && candidatureCount > 0 && (
                <span className="absolute right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                  +{candidatureCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Bouton déconnexion */}
      <div className="pt-6 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 active:scale-95 shadow-md transition-all duration-300"
        >
          🚪 Déconnexion
        </button>
      </div>
    </aside>
  );
}
