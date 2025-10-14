import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import Navbar from "./Navbar";
import axios from "axios";
import CardMission from "./Card_mission";
import ButtonAdd from "./Ajout_mission";
import EditMissionModal from "./EditMission";
import { toast } from "react-toastify";
import CandidatureList from "./Candidature";
import EntrepriseNotifications from "./EntrepriseNotifications";

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
      const res = await fetch("http://localhost:8001/msn/missions/me/", {
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
      <div className="bg-white p-6 rounded-2xl shadow-2xl w-[500px] max-w-full relative">
        {/* Titre */}
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
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
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
          {errors.titre && (
            <p className="text-red-500 text-sm">{errors.titre}</p>
          )}

          <textarea
            name="description"
            value={mission.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition resize-none"
            rows={4}
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}

          <input
            type="text"
            name="competence"
            value={mission.competence}
            onChange={handleChange}
            placeholder="Compétences requises"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
          {errors.competence && (
            <p className="text-red-500 text-sm">{errors.competence}</p>
          )}

          <input
            type="number"
            name="budget"
            value={mission.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
          />
          {errors.budget && (
            <p className="text-red-500 text-sm">{errors.budget}</p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition font-medium"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSaveMission}
              disabled={loading}
              className="px-5 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition font-medium"
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>
        </div>

        {/* Close bouton */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg"
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
    fetch("http://localhost:8001/etr/id/", { credentials: "include" })
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
      `ws://localhost:8001/ws/candidatures/${entreprise_id}/`
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
      const res = await fetch("http://localhost:8001/msn/missions/me/", {
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
                  `http://localhost:8001/msn/missions/${id_mission}/`,
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
      const res = await fetch("http://localhost:8001/auth/info/", {
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
      const res = await fetch("http://localhost:8001/etr/entreprises/me/", {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Erreur fetch profile");
      const data = await res.json();
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

      const res = await fetch("http://localhost:8001/etr/entreprises/me/", {
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
        const response = await axios.get("http://localhost:8001/ptl/notee/", {
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
      `ws://localhost:8001/ws/entretien/${userrole}/${user.id}/`
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
    } else {
       toast.success(`📢 Nouvelle notification : ${latest.mission_titre}`, {
        autoClose: 3000,
      });
     }
  }, [entretienNotifications]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar
        onSectionChange={handleSectionChange}
        candidatureCount={candidatureCount}
        section={currentsection}
      />

      <div className="flex-1 flex flex-col bg-gradient-to-b from-red-50 to-white min-h-screen">
        <header className="flex justify-between items-center bg-white/80 backdrop-blur-sm shadow-md border-b border-red-100 px-6 py-4">
          <h1 className="text-2xl font-bold text-red-600 tracking-wide">
            Espace Entreprise
          </h1>

          <div className="flex items-center gap-4">
            <p className="font-medium text-gray-800 text-lg">
              {user.nom || "Utilisateur"}
            </p>
            <div
              className="relative group cursor-pointer"
              onClick={toggleProfile}
            >
              {user.profile_image ? (
                <img
                  src={user.profile_image}
                  alt="Profil"
                  className="w-12 h-12 rounded-full border-2 border-red-500 shadow-md object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-200 flex items-center justify-center border-2 border-red-500 shadow-md">
                  <span className="text-red-700 font-bold text-lg">
                    {user.nom ? user.nom[0].toUpperCase() : "U"}
                  </span>
                </div>
              )}

              {/* Effet de survol */}
              <div className="absolute top-full right-0 z-[9999] mt-2 bg-white border shadow-lg rounded-xl px-3 py-1 text-sm text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Éditer le profil
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 overflow-y-auto">
          {currentsection === "dashboard" && (
            <div>
              <div className="sticky top-0 bg-white mb-6 z-50 shadow-sm flex justify-between px-4 py-3">
                <h1 className="text-2xl font-bold">Missions publiées</h1>
                <ButtonAdd onClick={() => setIsModalOpen(true)} />
              </div>

              {/* Modal ajout mission */}
              <Mission
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdded={fetchMissions}
              />

              {/* Liste des missions */}
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
                  <p className="text-gray-500">Aucune mission pour le moment</p>
                )}
              </div>

              {/* Modal édition mission */}
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

          {currentsection == "Candidat" && (
            <div>
              <CandidatureList
                candidatures={candidatures}
                setCandidatures={setCandidatures}
                drafts={drafts}
                setDrafts={setDrafts}
              />
            </div>
          )}
          {currentsection == "message" && (
            <div>
              <EntrepriseNotifications
                entretienNotifications={entretienNotifications}
              />
            </div>
          )}
        </main>

        {/* MODAL PROFIL */}
        {isProfileOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* --- FOND FLOU + OMBRÉ --- */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity duration-300"></div>

            {/* --- MODAL --- */}
            <div className="relative z-10 bg-gradient-to-b from-white via-white to-gray-50 rounded-3xl shadow-2xl p-8 w-[420px] transform transition-all duration-300 scale-100 hover:scale-[1.01]">
              <h2 className="text-2xl font-bold mb-5 text-center text-gray-800">
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
                    <label htmlFor="profileUpload" className="cursor-pointer">
                      {user.profile_image ? (
                        <img
                          src={user.profile_image}
                          alt="Aperçu Profil"
                          className="w-28 h-28 rounded-full object-cover ring-4 ring-purple-200 shadow-md group-hover:ring-purple-400 transition-all duration-300"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 group-hover:border-purple-400 transition">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-500"
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
                      className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full shadow-lg cursor-pointer hover:bg-purple-700 transition"
                    >
                      <Edit className="w-4 h-4 text-white" />
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
                      <span className="text-sm font-medium text-gray-700">
                        {field.label}
                      </span>
                      <input
                        type={field.type}
                        name={field.name}
                        value={field.value}
                        onChange={handleChange}
                        readOnly={field.readOnly}
                        placeholder={field.placeholder || ""}
                        className="w-full mt-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
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
                    className="px-5 py-2.5 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
                    onClick={toggleProfile}
                  >
                    Annuler
                  </button>
                  <button
                    className="px-5 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-md transition"
                    onClick={handleSaveProfile}
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>

              {/* --- CLOSE BUTTON --- */}
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg font-bold transition"
                onClick={toggleProfile}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
