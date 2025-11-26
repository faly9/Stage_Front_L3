import { useState, useEffect, Profiler } from "react";
import { Edit, Bell, Moon, Sun, User } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import CardMission from "./Card_mission";
import ButtonAdd from "./Ajout_mission";
import EditMissionModal from "./EditMission";
import { toast } from "react-toastify";
import CandidatureList from "./Candidature";
import EntrepriseNotifications from "./EntrepriseNotifications";
// import { API_URL } from "../../config";
// import { WEBSOCKET_API_URL } from "../../config";
import { getConfig } from "../../config";

// 🔹 fonction utilitaire pour lire le cookie CSRF
const getCookie = (name) => {
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
};

// 🔹 Modal pour ajouter une mission
function Mission({ isOpen, onClose, onAdded }) {
  const [loading, setLoading] = useState(false);
  const [mission, setMission] = useState({
    titre: "",
    description: "",
    competence: "",
    budget: "",
  });
const { API_URL , MEDIA_URL } = getConfig();

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleChange = (e) =>
    setMission({ ...mission, [e.target.name]: e.target.value });

  const handleSaveMission = async () => {
    const newErrors = {};
    if (!mission.titre.trim()) newErrors.titre = "Le titre est obligatoire";
    if (!mission.description.trim())
      newErrors.description = "La description est obligatoire";
    if (!mission.competence.trim())
      newErrors.competence = "Les compétences sont obligatoires";
    if (!mission.budget || parseFloat(mission.budget) <= 0)
      newErrors.budget = "Le budget doit être supérieur à 0";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const csrftoken = getCookie("csrftoken");

    try {
      const res = await fetch(`${API_URL}/msn/missions/me/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({
          titre: mission.titre,
          description: mission.description,
          competence_requis: mission.competence,
          budget: mission.budget,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Erreur lors de l'ajout de la mission : " + errText);
      }

      const data = await res.json();
      if (onAdded) onAdded(); // rafraîchit la liste
      onClose();
      setMission({ titre: "", description: "", competence: "", budget: "" });

      // ✅ toast succès
      toast.success("Mission ajoutée avec succès ✅", {
        position: "top-center",
      });
    } catch (err) {
      console.error(err);

      // ❌ toast erreur
      toast.error(err.message || "Erreur lors de l'ajout de la mission ❌", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="p-6 rounded-2xl shadow-2xl w-[500px] max-w-full relative"
        style={{
          background: "var(--card-bg)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Titre */}
        <h2
          className="text-2xl font-semibold mb-6 text-center"
          style={{
            color: "var(--accent)",
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          Ajouter une mission
        </h2>

        {/* Formulaire */}
        <div className="space-y-4">
          <input
            type="text"
            name="titre"
            value={mission.titre}
            onChange={handleChange}
            placeholder="Titre"
            className="w-full px-4 py-2 rounded-xl focus:ring-2 focus:outline-none transition"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
          />
          {errors.titre && (
            <p className="text-sm" style={{ color: "var(--accent-strong)" }}>
              {errors.titre}
            </p>
          )}

          <textarea
            name="description"
            value={mission.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 rounded-xl focus:ring-2 focus:outline-none transition resize-none"
            rows={4}
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
          {errors.description && (
            <p className="text-sm" style={{ color: "var(--accent-strong)" }}>
              {errors.description}
            </p>
          )}

          <input
            type="text"
            name="competence"
            value={mission.competence}
            onChange={handleChange}
            placeholder="Compétences requises"
            className="w-full px-4 py-2 rounded-xl focus:ring-2 focus:outline-none transition"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
          {errors.competence && (
            <p className="text-sm" style={{ color: "var(--accent-strong)" }}>
              {errors.competence}
            </p>
          )}

          <input
            type="number"
            name="budget"
            value={mission.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full px-4 py-2 rounded-xl focus:ring-2 focus:outline-none transition"
            style={{
              background: "var(--button-bg)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
          {errors.budget && (
            <p className="text-sm" style={{ color: "var(--accent-strong)" }}>
              {errors.budget}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl transition font-medium"
              style={{
                background: "var(--button-bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSaveMission}
              disabled={loading}
              className="px-5 py-2 rounded-xl transition font-medium shadow-md"
              style={{
                background: "var(--accent)",
                color: "var(--text-on-accent)",
              }}
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </div>

        {/* Close bouton */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-bold text-lg"
          style={{
            color: "var(--text-secondary)",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// 🔹 Dashboard de l'entreprise
export default function EntrepriseDashboard() {
  const [entretienNotifications, setEntretienNotifications] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState({
    id: null,
    nom: "",
    secteur: "",
    profile_image: null,
    profile_imageFile: null,
  });
  const { API_URL, WEBSOCKET_API_URL , MEDIA_URL } = getConfig();

  const [userinfo, setUserinfo] = useState({ email: "", role: "" });
  const [entreprise_id, setEntreprise_id] = useState(null);
  const [candidatures, setCandidatures] = useState([]);
  const [drafts, setDrafts] = useState({});
  const [errors, setErrors] = useState({});

  // pour l indice de nouveau message
  const [currentsection, setCurrentSection] = useState("dashboard");
  const [candidatureCount, setCandidatureCount] = useState(() => {
    return parseInt(localStorage.getItem("candidatureCount")) || 0;
  });

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Charger le thème depuis localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDarkMode(true);
    }
  }, []);

  // Fonction pour basculer le thème
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("candidatureCount", candidatureCount);
  }, [candidatureCount]);

  const handleSectionChange = (section) => {
    setCurrentSection(section);
    // Quand l'utilisateur ouvre "candidatures", on considère que c'est lu
    if (section === "Candidat") {
      setCandidatureCount(0);
      localStorage.setItem("candidatureCount", 0);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchUserInfo();
    fetchMissions();
  }, []);

  // Récupérer l'ID de l'entreprise au montage
  useEffect(() => {
    fetch(`${API_URL}/etr/id/`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Erreur API entreprise");
        return res.json();
      })
      .then((data) => {
        setEntreprise_id(data.entreprise_id);
      })
      .catch((err) =>
        console.error("❌ Impossible de récupérer l'entreprise :", err)
      );
  }, []);

  // Connexion WebSocket candidature (uniquement quand entreprise_id est dispo)
  useEffect(() => {
    if (!entreprise_id) return;

    const ws = new WebSocket(
      `${WEBSOCKET_API_URL}/ws/candidatures/${entreprise_id}/`
    );

    ws.onopen = () =>
      console.log("✅ WebSocket connecté à l'entreprise", entreprise_id);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

       
      // 🔹 incrémente le compteur (et sauvegarde dans localStorage)
      setCandidatureCount((count) => {
        const newCount = count + 1;
        localStorage.setItem("candidatureCount", newCount);
        console.log("🟢 Ancien count:", count, "➡️ Nouveau count:", newCount);
        return newCount;
      });

      console.log("📥 Nouvelle candidature reçue :", data);

      // 🔹 ajoute ou met à jour la candidature
      setCandidatures((prev) => {
        const exists = prev.some(
          (c) => c.id_candidature === data.id_candidature
        );
        return exists
          ? prev.map((c) =>
            c.id_candidature === data.id_candidature ? data : c
          )
          : [data, ...prev];
      });

      // 🔹 ajoute/maj le draft
      setDrafts((prev) => ({
        ...prev,
        [data.id_candidature]: {
          status: data.status || "attente",
          date_entretien: data.date_entretien || "",
          commentaire_entretien: data.commentaire_entretien || "",
        },
      }));
    };

    ws.onerror = (err) => console.error("❌ Erreur WebSocket :", err);
    ws.onclose = () => console.log("⚠️ WebSocket déconnecté");

    return () => ws.close();
  }, [entreprise_id]);

  const fetchMissions = async () => {
    try {
      const res = await fetch(`${API_URL}/msn/missions/me/`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur fetch missions");
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fonction de suppression avec toast de confirmation
  const handleDeleteMission = (id_mission) => {
    toast.info(
      <div>
        <p>Voulez-vous vraiment supprimer cette mission ?</p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={async () => {
              try {
                const csrftoken = getCookie("csrftoken");
                const res = await fetch(
                  `${API_URL}/msn/missions/${id_mission}/`,
                  {
                    method: "DELETE",
                    credentials: "include",
                    headers: { "X-CSRFToken": csrftoken },
                  }
                );

                if (!res.ok) throw new Error("Erreur suppression mission");

                // ✅ mise à jour de la liste
                setMissions((prev) =>
                  prev.filter((m) => m.id_mission !== id_mission)
                );

                toast.dismiss(); // ferme le toast de confirmation
                toast.success("Mission supprimée avec succès ✅");
              } catch (err) {
                toast.dismiss();
                toast.error(err.message || "Une erreur est survenue ❌");
              }
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Oui
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Annuler
          </button>
        </div>
      </div>,
      { autoClose: false } // l'utilisateur choisit Oui ou Annuler
    );
  };

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/info/`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur fetch auth/info");
      const data = await res.json();
      setUserinfo({ email: data.email, role: data.role });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/etr/entreprises/me/`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Erreur fetch profile");
      const data = await res.json();
      console.log("Données entreprise récupérées :", data);
      setUser({
        id: data.id_entreprise,
        nom: data.nom,
        secteur: data.secteur,
        profile_image: data.profile_image || "",
        profile_imageFile: null,
      });
    } catch (err) {
      console.error(err);
    }
  };
  console.log("user entreprise", user.profile_image);

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleChange = (e) =>
    setUser({ ...user, [e.target.name]: e.target.value });
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file)
      setUser({
        ...user,
        profile_imageFile: file,
        profile_image: URL.createObjectURL(file),
      });
  };

  const handleSaveProfile = async () => {
    const newErrors = {};
    if (!user.nom.trim()) newErrors.nom = "Le nom est obligatoire";
    if (!user.secteur.trim()) newErrors.secteur = "Le secteur est obligatoire";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      const formData = new FormData();
      formData.append("nom", user.nom);
      formData.append("secteur", user.secteur);
      if (user.profile_imageFile) {
        formData.append("profile_image", user.profile_imageFile);
      }
      console.log("Fichier image à envoyer:", user.profile_image);

      const res = await fetch(`${API_URL}/etr/entreprises/me/`, {
        method: "POST",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Erreur sauvegarde profil : " + errText);
      }

      const data = await res.json();
      setUser({
        ...user,
        id: data.id_entreprise,
        nom: data.nom,
        secteur: data.secteur,
        profile_image: data.profile_image || "",
        profile_imageFile: null,
      });
      setIsProfileOpen(false);

      // ✅ toast succès
      toast.success("Profil sauvegardé avec succès ✅", {
        position: "top-center",
      });
    } catch (err) {
      console.error(err);

      // ❌ toast erreur
      toast.error(err.message || "Erreur lors de la sauvegarde du profil ❌", {
        position: "top-center",
      });
    }
  };

  // 🔹 Charger les notifications permanentes via session (pas de token)
  // Charger notifications permanentes

  // historique de la messagerie
  // 🔹 Charger les anciennes notifications persistantes (API)
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${API_URL}/ptl/notee/`, {
          withCredentials: true,
        });
        console.log(response.data);
        setEntretienNotifications(response.data);
        console.log("📦 Notifications persistantes chargées :", response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications :", error);
      }
    };

    fetchNotifications();
  }, []);

  // ───────── WebSocket notifications d'entretien ─────────
  useEffect(() => {
    if (!user.id) return;

    const userrole = "entreprise";
    const ws = new WebSocket(
      `${WEBSOCKET_API_URL}/ws/entretien/${userrole}/${user.id}/`
    );

    ws.onopen = () => console.log("✅ WS Entreprise connecté");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Notification reçue pour l'entreprise:", data);

      setEntretienNotifications((prev) => {
        const exists = prev.some(
          (n) => n.id_candidature === data.id_candidature
        );
        if (exists) {
          // ⚡ Met à jour la notification existante
          return prev.map((n) =>
            n.id_candidature === data.id_candidature ? { ...n, ...data } : n
          );
        } else {
          // ➕ Ajoute la nouvelle notification
          return [data, ...prev];
        }
      });
    };

    ws.onerror = (err) => console.error("❌ WS Entreprise erreur :", err);
    ws.onclose = () => console.log("❌ WS Entreprise fermé");

    return () => ws.close();
  }, [user.id]);

  // ───────── Effet pour afficher les toasts en toute sécurité ─────────
  useEffect(() => {
    if (entretienNotifications.length === 0) return;

    const latest = entretienNotifications[0]; // dernière notification
    const isUpdate =
      entretienNotifications.length > 1 &&
      entretienNotifications[1].id_candidature === latest.id_candidature;

    if (isUpdate) {
      toast.info(`🔄 Entretien mis à jour : ${latest.mission_titre}`, {
        autoClose: 3000,
      });
    }
  }, [entretienNotifications]);

  return (
    <div
      className="flex items-center justify-center h-screen transition-colors duration-500"
      style={{
        background:
          "linear-gradient(to bottom, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
      }}
    >
      <div className="w-[90%] max-w-[1600px] h-screen flex rounded-3xl shadow-2xl  overflow-hidden  bg-[var(--card-bg)]">
        <Navbar
          onSectionChange={handleSectionChange}
          candidatureCount={candidatureCount}
          section={currentsection}
        />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* HEADER */}
          <header className="flex justify-between items-center bg-[var(--card-bg)] backdrop-blur-md shadow-md border-b border-[var(--border)] px-6 py-4 transition-all duration-500">
            <p
              className="text-xl w-56 font-extrabold text-center bg-clip-text text-transparent
        bg-gradient-to-r from-[var(--accent)] via-[var(--accent-light)] to-[var(--accent-strong)] drop-shadow-lg"
            >
              {currentsection === "dashboard"
                ? "Liste des Missions"
                : currentsection === "ia"
                  ? "Proposition de l'IA"
                  : currentsection === "Candidat"
                    ? "Liste des candidats"
                    : currentsection === "message"
                      ? "Historiques"
                      : ""}
            </p>

            {/* PROFIL + ICONES */}
            <div className="flex flex-col justify-end lg:flex-row items-center gap-6 w-full ">
              <div className="relative cursor-pointer w-full max-w-lg sm:max-w-xl md:max-w-2xl">
                <div className="rounded-3xl bg-gradient-to-r from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] shadow-2xl border border-transparent hover:border-[var(--accent)] hover:shadow-[var(--accent-light)]/30 transition-all duration-500 w-full">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-5 bg-[var(--card-bg)] p-4 rounded-2xl shadow-md hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 w-full">
                    {/* PROFIL */}
                    <div className="flex items-center gap-4 relative group">
                      {user.profile_image ? (
                        <img
                          src={`${MEDIA_URL}/${user.profile_image}`}
                          onClick={toggleProfile}
                          alt="Profil"
                          className="w-12 h-12 rounded-full border-2 border-[var(--accent)] shadow-md object-cover transition-transform duration-300 hover:scale-105"
                        />
                      ) : (
                        <div
                          onClick={toggleProfile}
                          className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-strong)] flex items-center justify-center shadow-md"
                        >
                          <span className="text-[var(--text-on-accent)] font-bold text-lg">
                            {user.nom ? user.nom[0].toUpperCase() : "U"}
                          </span>
                        </div>
                      )}

                      <div className="absolute top-full left-0 mt-2 bg-[var(--tooltip-bg)] border border-[var(--border)] shadow-lg rounded-xl px-3 py-1 text-sm text-[var(--tooltip-text)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        ✏️ Éditer le profil
                      </div>

                      <div>
                        <h3 className="text-md font-semibold text-[var(--text-primary)]">
                          {user.nom || "Utilisateur"}
                        </h3>
                        <p className="text-sm text-[var(--text-secondary)] italic">
                          Entreprise disponible
                        </p>
                      </div>
                    </div>

                    {/* ICONES */}
                    <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-0">
                      <div className="relative group">
                        <User className="w-6 h-6 text-[var(--icon-primary)] hover:scale-110 transition-transform cursor-pointer" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[var(--tooltip-bg)] border border-[var(--border)] shadow-lg rounded-xl px-2 py-1 text-xs text-[var(--tooltip-text)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          👥 Candidats
                        </div>
                      </div>

                      <div className="relative group">
                        <Bell className="w-6 h-6 text-[var(--icon-secondary)] hover:scale-110 transition-transform cursor-pointer" />
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[var(--tooltip-bg)] border border-[var(--border)] shadow-lg rounded-xl px-2 py-1 text-xs text-[var(--tooltip-text)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          🔔 Notifications
                        </div>
                      </div>

                      <div className="relative group">
                        <button
                          onClick={toggleTheme}
                          className="p-2 rounded-full bg-[var(--button-bg)] shadow-md hover:scale-110 transition-transform duration-300"
                        >
                          {isDarkMode ? (
                            <Moon className="w-5 h-5 text-[var(--sun-color)]" />
                          ) : (
                            <Sun className="w-5 h-5 text-[var(--moon-color)]" />
                          )}
                        </button>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-[var(--tooltip-bg)] border border-[var(--border)] shadow-lg rounded-xl px-2 py-1 text-xs text-[var(--tooltip-text)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          🌗 Mode
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>{" "}
          {/* MAIN */}
          <main className="flex-1 p-6 hide-scrollbar overflow-y-auto bg-[var(--gradient-from)] text-[var(--text-primary)] transition-colors duration-500">
            {/* --- DASHBOARD SECTION --- */}
            {currentsection === "dashboard" && (
              <div>
                {/* --- HEADER --- */}
                <div className="sticky top-0 mb-6 z-50 bg-[var(--card-bg)] shadow-sm flex justify-between items-center px-4 py-4 border-b border-[var(--border)]">
                  <h1
                    className="sticky top-0 z-50 text-3xl sm:text-4xl font-extrabold text-center
              bg-clip-text text-transparent bg-gradient-to-r 
              from-[var(--accent)] via-[var(--accent-light)] to-[var(--accent-strong)]
              drop-shadow-md italic"
                  >
                    Missions publiées
                  </h1>
                  <ButtonAdd onClick={() => setIsModalOpen(true)} />
                </div>

                {/* --- MODAL AJOUT MISSION --- */}
                <Mission
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
                  onAdded={fetchMissions}
                />

                {/* --- LISTE DES MISSIONS --- */}
                <div className="flex flex-col gap-6">
                  {missions.length > 0 ? (
                    missions.map((mission) => (
                      <CardMission
                        key={mission.id_mission}
                        mission={mission}
                        onEdit={(m) => setEditingMission(m)}
                        onDelete={() => handleDeleteMission(mission.id_mission)}
                      />
                    ))
                  ) : (
                    <p className="text-[var(--text-secondary)]">
                      Aucune mission pour le moment
                    </p>
                  )}
                </div>

                {/* --- MODAL ÉDITION MISSION --- */}
                <EditMissionModal
                  mission={editingMission}
                  isOpen={!!editingMission}
                  onClose={() => setEditingMission(null)}
                  onUpdated={(updated) =>
                    setMissions((prev) =>
                      prev.map((m) =>
                        m.id_mission === updated.id_mission ? updated : m
                      )
                    )
                  }
                />
              </div>
            )}

            {/* --- CANDIDATURE SECTION --- */}
            {currentsection === "Candidat" && (
              <CandidatureList
                candidatures={candidatures}
                setCandidatures={setCandidatures}
                drafts={drafts}
                setDrafts={setDrafts}
              />
            )}

            {/* --- NOTIFICATIONS SECTION --- */}
            {currentsection === "message" && (
              <EntrepriseNotifications
                entretienNotifications={entretienNotifications}
              />
            )}

            {/* --- MODAL PROFIL --- */}
            {isProfileOpen && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                {/* --- FOND FLOU --- */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"></div>

                {/* --- CONTENU MODAL --- */}
                <div className="relative z-10 bg-[var(--card-bg)] rounded-3xl shadow-2xl p-8 w-[420px] border border-[var(--border)] transform transition-all duration-300 scale-100 hover:scale-[1.01]">
                  <h2 className="text-2xl font-bold mb-5 text-center text-[var(--text-primary)]">
                    ✨ Éditer le profil
                  </h2>

                  <div className="flex flex-col gap-4">
                    {/* --- PHOTO DE PROFIL --- */}
                    <div className="flex items-center justify-center">
                      <div className="relative group">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="profileUpload"
                        />
                        <label
                          htmlFor="profileUpload"
                          className="cursor-pointer"
                        >
                          {user.profile_imageFile ? (
                            // 🔹 Preview local
                            <img
                              src={URL.createObjectURL(user.profile_imageFile)}
                              alt="Aperçu Profil"
                              className="w-28 h-28 rounded-full object-cover ring-4 ring-[var(--accent-light)] shadow-md group-hover:ring-[var(--accent)] transition-all duration-300"
                            />
                          ) : user.profile_image ? (
                            // 🔹 Chemin relatif depuis l'API
                            <img
                              src={`${MEDIA_URL}/${user.profile_image}`}
                              alt="Aperçu Profil"
                              className="w-28 h-28 rounded-full object-cover ring-4 ring-[var(--accent-light)] shadow-md group-hover:ring-[var(--accent)] transition-all duration-300"
                            />
                          ) : (<div className="w-28 h-28 rounded-full bg-[var(--button-bg)] flex items-center justify-center border-2 border-dashed border-[var(--border)] group-hover:border-[var(--accent)] transition">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-12 w-12 text-[var(--text-secondary)]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          </div>
                          )}
                        </label>

                        <label
                          htmlFor="profileUpload"
                          className="absolute bottom-2 right-2 bg-[var(--accent)] p-2 rounded-full shadow-lg cursor-pointer hover:bg-[var(--accent-strong)] transition"
                        >
                          <Edit className="w-4 h-4 text-[var(--text-on-accent)]" />
                        </label>
                      </div>
                    </div>

                    {/* --- INPUTS --- */}
                    <div className="flex flex-col gap-3 mt-2">
                      {[
                        {
                          label: "Role",
                          name: "role",
                          type: "text",
                          readOnly: true,
                          value: userinfo.role,
                        },
                        {
                          label: "Nom",
                          name: "nom",
                          type: "text",
                          value: user.nom,
                          placeholder: "Nom de l'entreprise",
                          error: errors.nom,
                        },
                        {
                          label: "Secteur",
                          name: "secteur",
                          type: "text",
                          value: user.secteur,
                          placeholder: "Votre secteur",
                          error: errors.secteur,
                        },
                        {
                          label: "Email",
                          name: "email",
                          type: "email",
                          readOnly: true,
                          value: userinfo.email,
                        },
                      ].map((field, i) => (
                        <label key={i} className="block">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            {field.label}
                          </span>
                          <input
                            type={field.type}
                            name={field.name}
                            value={field.value}
                            onChange={handleChange}
                            readOnly={field.readOnly}
                            placeholder={field.placeholder || ""}
                            className="w-full mt-1 p-2.5 border border-[var(--border)] rounded-lg bg-[var(--button-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] focus:outline-none transition"
                          />
                          {field.error && (
                            <p className="text-red-500 text-sm mt-1">
                              {field.error}
                            </p>
                          )}
                        </label>
                      ))}
                    </div>

                    {/* --- BOUTONS --- */}
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        className="px-5 py-2.5 rounded-lg bg-[var(--button-bg)] text-[var(--text-primary)] font-medium hover:bg-[var(--accent-light)] hover:text-[var(--text-on-accent)] transition"
                        onClick={toggleProfile}
                      >
                        Annuler
                      </button>
                      <button
                        className="px-5 py-2.5 rounded-lg bg-[var(--accent)] text-[var(--text-on-accent)] font-medium hover:bg-[var(--accent-strong)] shadow-md transition"
                        onClick={handleSaveProfile}
                      >
                        Sauvegarder
                      </button>
                    </div>
                  </div>

                  {/* --- CLOSE BUTTON --- */}
                  <button
                    className="absolute top-3 right-3 text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-lg font-bold transition"
                    onClick={toggleProfile}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
