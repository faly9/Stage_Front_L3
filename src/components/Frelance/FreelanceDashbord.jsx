import React, { useState, useEffect } from "react";
import NavbarFreelance from "./NavbarFree";
import CardProfil from "./CardProfil";
import axios from "axios";
import CardOffre from "./OffreDispo";
import EditProfileFreelance from "./EditProfil";
import { toast } from "react-toastify";
import EntretienCard from "./EntretienCard";
import { Moon, Sun, Bell, Briefcase } from "lucide-react";
// import { API_URL, WEBSOCKET_API_URL } from "../../config";
import { getConfig } from "../../config";

export default function FreelanceDashboard() {
  const [entretienNotifications, setEntretienNotifications] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { API_URL, WEBSOCKET_API_URL , MEDIA_URL } = getConfig();

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

  // Initialiser depuis localStorage
  const [newoffer, setNewoffer] = useState(() => {
    return parseInt(localStorage.getItem("newoffer")) || 0;
  });

  // Mettre à jour localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem("newoffer", newoffer);
  }, [newoffer]);

  const [editingFreelance, setEditingFreelance] = useState(null);
  const [freelances, setFreelances] = useState([]);
  const [missions, setMissions] = useState([]); // 🔹 missions dynamiques
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("Mon Profil");

  // nombre de nouvelle notification sur l'option notification
  const [newnotification, setNewnotification] = useState(() => {
    return parseInt(localStorage.getItem("newnotification")) || 0;
  });

  // Charger profil freelance
  useEffect(() => {
    const fetchFreelance = async () => {
      try {
        // NOTE: Utiliser l'ID du freelance authentifié pour une meilleure sécurité
        const res = await fetch(`${API_URL}/frl/freelances/`, {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          // Assurer que setFreelances reçoit toujours un tableau pour simplifier l'accès
          setFreelances(Array.isArray(data) ? data : data ? [data] : []);
          console.log("tonga eto ve");
          console.log("Données freelance chargées :", data);
        } else {
          setFreelances([]);
        }
      } catch (error) {
        console.error("Erreur API freelance:", error);
        setFreelances([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelance();
  }, []);

  // Charger missions existantes via API REST
  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await fetch(`${API_URL}/msn/missions/`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Erreur fetch missions");

        const data = await res.json();
        setMissions(data);
      } catch (err) {
        console.error("❌ Erreur de chargement des missions :", err.message);
      }
    };

    fetchMissions();
  }, []);

  // 🔹 Charger les notifications permanentes via session (pas de token)
  // Charger notifications permanentes
  useEffect(() => {
    axios
      .get(`${API_URL}/ptl/note/`, { withCredentials: true })
      .then((res) => {
        // 🔹 Supprimer les doublons par id_candidature
        const unique = Array.from(
          new Map(res.data.map((item) => [item.id_candidature, item])).values()
        );
        console.log("unique apres le reload", unique);
        setEntretienNotifications(unique);
        console.log(entretienNotifications);
      })
      .catch((err) => console.error("Erreur chargement notifications :", err));
  }, []);

  // WebSocket pour notifications temps réel
  useEffect(() => {
    if (!freelances.length) return;

    const freelanceId = freelances[0].id_freelance;
    if (!freelanceId) return;
    const userrole = "freelance";

    const ws = new WebSocket(
      `${WEBSOCKET_API_URL}/ws/entretien/${userrole}/${freelanceId}/`
    );

    ws.onopen = () => console.log("✅ WS Entretien connecté");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Notification reçue :", data);
      setNewnotification((count) => count + 1);

      setEntretienNotifications((prev) => {
        const exists = prev.some(
          (n) => n.id_candidature === data.id_candidature
        );

        let updated;
        if (exists) {
          // Mise à jour de la notification existante
          updated = prev.map((n) =>
            n.id_candidature === data.id_candidature ? { ...n, ...data } : n
          );
          // toast.info(`🔄 Entretien mis à jour : ${data.mission_titre}`);
        } else {
          // Nouvelle notification
          updated = [data, ...prev];
          toast.success(`📢 Nouvelle notification : ${data.entreprise_nom}`);
        }

        return updated;
      });
    };

    ws.onerror = (err) => console.error("❌ WS Entretien erreur :", err);
    ws.onclose = () => console.log("❌ WS Entretien fermé");

    return () => ws.close();
  }, [freelances]);

  // Connexion WebSocket pour le temps réel (Missions)
  useEffect(() => {
    const socket = new WebSocket(`${WEBSOCKET_API_URL}/ws/missions/`);

    socket.onopen = () => console.log("✅ WS Missions connecté");

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      const mission = message.mission;
      const action = message.action;
      console.log("📩 Message WS Missions :", message);

      switch (action) {
        case "created": {
          // Option 1 : Ajouter directement, mais forcer fetch pour ID correct
          setMissions((prev) => [mission, ...prev]);
          setNewoffer((count) => count + 1);
          toast.info(`📢 Nouvelle mission : ${mission.titre}`);

          // 🔹 Fetch missions pour récupérer l'ID définitif
          try {
            const res = await fetch(`${API_URL}/msn/missions/`, {
              credentials: "include",
            });
            if (res.ok) {
              const data = await res.json();
              setMissions(data); // Remplace l'ancien state avec l'ID correct
            }
          } catch (err) {
            console.error(
              "❌ Erreur fetch missions après création :",
              err.message
            );
          }
          break;
        }

        case "updated":
          setMissions((prev) =>
            prev.map((m) => (m.id_mission === mission.id_mission ? mission : m))
          );
          toast.info(`✏️ Mission mise à jour : ${mission.titre}`);
          break;

        case "deleted":
          setMissions((prev) =>
            prev.filter((m) => m.id_mission !== mission.id_mission)
          );
          toast.warn(`🗑️ Mission supprimée`);
          break;

        default:
          console.warn("⚠️ Action inconnue :", action);
          break;
      }
    };

    socket.onclose = () => console.log("❌ WS Missions fermé");
    return () => socket.close();
  }, []);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    if (section === "Offres disponibles") {
      setNewoffer(0); // reset du compteur
    } else if (section == "Notifications") {
      setNewnotification(0);
    }
  };

  /**
   * [CORRECTIF] : Fonction pour postuler à une mission via WebSocket.
   * Améliorations :
   * 1. Gestion des erreurs du backend (candidature existante, erreur serveur).
   * 2. Nettoyage et gestion des événements de la socket.
   */
  const postuler = (mission) => {
    // Vérification de la disponibilité du profil freelance
    if (freelances.length === 0 || !freelances[0].id_freelance) {
      toast.error("Veuillez créer votre profil freelance avant de postuler.");
      return;
    }

    const freelanceId = freelances[0].id_freelance;
    const entrepriseId = mission.entreprise;

    // Le WS de candidature doit être dynamique pour l'entreprise
    const ws = new WebSocket(
      `${WEBSOCKET_API_URL}/ws/candidatures/${entrepriseId}/`
    );

    ws.onopen = () => {
      console.log(
        "✅ WebSocket Candidature connecté à l'entreprise",
        entrepriseId
      );

      const payload = {
        mission_id: mission.id_mission,
        freelance_id: freelanceId,
      };
      ws.send(JSON.stringify(payload));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📥 Candidature reçue du backend :", data);

      if (data.error) {
        // [IMPORTANT] Gérer les erreurs du backend (ex: "Mission non trouvée", "Erreur de base de données")
        toast.error(`❌ Échec de la candidature: ${data.error}`);
      } else if (data.created === false) {
        // Gérer le cas où la candidature existe déjà (via get_or_create)
        toast.warn("⚠️ Vous avez déjà postulé à cette mission.");
      } else {
        // Succès de la création
        toast.success(
          `🎉 Candidature envoyée pour la mission : ${mission.titre}`
        );
      }

      ws.close(); // Fermer la connexion après avoir reçu la réponse
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket erreur de candidature :", err);
      toast.error("Erreur de connexion lors de l'envoi de la candidature.");
      ws.close(); // S'assurer de fermer en cas d'erreur
    };
  };

  // ... (renderContent and the rest of the component remain the same)
  const renderContent = () => {
    switch (activeSection) {
      case "Mon Profil":
        if (loading) return <p>Chargement...</p>;

        const hasProfile =
          freelances.length > 0 && freelances[0].id_freelance !== undefined;

        return (
          <div className="flex flex-col gap-6">
            {hasProfile ? (
              freelances.map((f, idx) => (
                <CardProfil
                  key={f.id_freelance || idx}
                  freelance={f}
                  onEdit={() => setEditingFreelance(f)}
                />
              ))
            ) : (
              <div className="p-4 border rounded bg-white text-center">
                <p className="text-gray-600 mb-3">
                  Aucun profil trouvé pour ce freelance.
                </p>
                <button
                  onClick={() =>
                    setEditingFreelance({
                      id_freelance: null,
                      nom: "",
                      description: "",
                      competence: "",
                      experience: "",
                      formation: "",
                      certificat: "",
                      tarif: 0,
                      photo: "",
                    })
                  }
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Créer mon profil
                </button>
              </div>
            )}

            {editingFreelance && (
              <EditProfileFreelance
                freelance={editingFreelance}
                onSave={(updated) => {
                  const exists = freelances.some(
                    (f) => f.id_freelance === updated.id_freelance
                  );

                  setFreelances((prev) => {
                    if (exists) {
                      return prev.map((f) =>
                        f.id_freelance === updated.id_freelance ? updated : f
                      );
                    } else {
                      return [updated];
                    }
                  });

                  toast.success(
                    exists
                      ? "Profil mis à jour avec succès ✅"
                      : "Profil créé avec succès 🎉"
                  );

                  setEditingFreelance(null);
                }}
                onCancel={() => setEditingFreelance(null)}
              />
            )}
          </div>
        );

      case "Offres disponibles":
        return (
          <div>
            {/* <motion.div
              className="relative p-6 rounded-3xl bg-white shadow-2xl overflow-hidden"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
            > */}
            {/* Contenu */}
            <div className="relative z-10 flex flex-col gap-6">
              {missions.length > 0 ? (
                missions.map((offre) => (
                  <CardOffre
                    key={offre.id_mission}
                    offre={offre}
                    onPostuler={postuler}
                  />
                ))
              ) : (
                <p className="text-gray-500 italic text-center">
                  Aucune offre disponible pour le moment.
                </p>
              )}
            </div>
            {/* </motion.div> */}
          </div>
        );

      case "Notifications":
        return (
          <div>
            <div className="flex flex-col gap-4">
              {entretienNotifications.length > 0 ? (
                entretienNotifications.map((entretien, index) => (
                  <EntretienCard
                    key={`${entretien.id_candidature}-${index}`}
                    notification={entretien} // 🔹 passer l'objet individuel, pas tout le tableau
                  />
                ))
              ) : (
                <p>Aucun entretien planifié pour le moment.</p>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen "
      style={{
        background:
          "linear-gradient(to bottom, var(--gradient-from), var(--gradient-via), var(--gradient-to))",
      }}
    >
      <div className="w-[90%] max-w-[1600px] h-screen flex  rounded-3xl shadow-2xl  overflow-hidden  bg-[var(--card-bg)]">
        <NavbarFreelance
          user={{ nom: "Freelance X", profile_image: "" }}
          activeSection={activeSection}
          freelance={freelances[0] || {}}
          onSectionChange={handleSectionChange}
          newoffer={newoffer}
          newnotification={newnotification}
        />

        <div className="flex-1 flex flex-col w-full">
          <div className="flex items-center justify-between bg-var(--gradient-from) shadow-md p-4 rounded-xl">
            {/* Titre à gauche */}
            <p
              className="sticky w-56 top-0 z-50  text-2xl font-extrabold  text-center
               bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
               drop-shadow-lg "
            >
              {activeSection === "Mon Profil"
                ? "Mon Profil"
                : activeSection === "Offres disponibles"
                  ? "Offres disponibles"
                  : activeSection === "Notifications"
                    ? "Notifications"
                    : ""}
            </p>
            {/* Profil à droite */}
            <div className="p-2 rounded-3xl flex bg-var(--gradient-from) shadow-xl transition-colors duration-500">
              {freelances.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400 text-center italic">
                  Aucun profil trouvé 😔
                </p>
              ) : (
                freelances.map((freelance) => (
                  <div
                    key={freelance.id_freelance}
                    className="flex  justify-end lg:flex-row items-center gap-6 w-full"
                  // className="flex items-center gap-10 justify-between bg-white dark:bg-gray-900 p-2  rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-transform duration-300"
                  >
                    {/* --- Profil --- */}
                    <div className="flex items-center w-52 gap-4">
                      <img
                        src={`${MEDIA_URL}/${freelance.photo}` || "/images/profil.png"}
                        alt="Profil"
                        className="w-12 h-12 rounded-full border-2 border-violet-500 shadow-md object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div>
                        <h2 className="font-poppins text-lg font-semibold text-[var(--text-primary)]">
                          {freelance.nom}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                          Freelance disponible
                        </p>
                      </div>
                    </div>

                    {/* --- Icônes --- */}
                  </div>
                ))
              )}
              <div className="flex items-center gap-6">
                <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400 hover:scale-110 transition-transform cursor-pointer" />
                <Bell className="w-6 h-6 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform cursor-pointer" />
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
              </div>
            </div>
          </div>

          <main className="flex-1 p-6 overflow-y-auto hide-scrollbar">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}
