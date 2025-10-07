import React, { useState, useEffect } from "react";
import NavbarFreelance from "./NavbarFree";
import CardProfil from "./CardProfil";
import axios from "axios";
import CardOffre from "./OffreDispo";
import EditProfileFreelance from "./EditProfil";
import { toast } from "react-toastify";
import EntretienCard from "./EntretienCard";

export default function FreelanceDashboard() {
  const [entretienNotifications, setEntretienNotifications] = useState([]);

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
        const res = await fetch("http://localhost:8001/frl/freelances/", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          // Assurer que setFreelances reçoit toujours un tableau pour simplifier l'accès
          setFreelances(Array.isArray(data) ? data : data ? [data] : []);
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
        const res = await fetch("http://localhost:8001/msn/missions/", {
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
      .get("http://localhost:8001/ptl/note/", { withCredentials: true })
      .then((res) => {
        // 🔹 Supprimer les doublons par id_candidature
        const unique = Array.from(
          new Map(res.data.map((item) => [item.id_candidature, item])).values()
        );
        console.log("unique apres le reload",unique)
        setEntretienNotifications(unique);
        console.log(entretienNotifications)
      })
      .catch((err) => console.error("Erreur chargement notifications :", err));
  }, []);

  // WebSocket pour notifications temps réel
  useEffect(() => {
    if (!freelances.length) return;

    const freelanceId = freelances[0].id_freelance;
    if (!freelanceId) return;

    const ws = new WebSocket(
      `ws://localhost:8001/ws/entretien/${freelanceId}/`
    );

    ws.onopen = () => console.log("✅ WS Entretien connecté");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Notification reçue:", data);

      setEntretienNotifications((prev) => {
        // Ajouter seulement si id_candidature unique
        const exists = prev.some(
          (n) => n.id_candidature === data.id_candidature
        );
        if (exists) return prev;
        return [data, ...prev];
      });
      setNewnotification((count) => count + 1);

      toast.info(`📢 Entretien mis à jour : ${data.mission_titre}`);
    };

    ws.onerror = (err) => console.error("❌ WS Entretien erreur :", err);
    ws.onclose = () => console.log("❌ WS Entretien fermé");

    return () => ws.close();
  }, [freelances]);

  // Connexion WebSocket pour le temps réel (Missions)
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8001/ws/missions/");

    socket.onopen = () => console.log("✅ WS Missions connecté");

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      const mission = message.mission;
      const action = message.action;

      switch (action) {
        case "created": {
          // Option 1 : Ajouter directement, mais forcer fetch pour ID correct
          setMissions((prev) => [mission, ...prev]);
          setNewoffer((count) => count + 1);
          toast.info(`📢 Nouvelle mission : ${mission.titre}`);

          // 🔹 Fetch missions pour récupérer l'ID définitif
          try {
            const res = await fetch("http://localhost:8001/msn/missions/", {
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
      `ws://localhost:8001/ws/candidatures/${entrepriseId}/`
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
                  key={idx}
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
            <h2 className="text-xl font-semibold mb-4">Offres disponibles</h2>
            <div className="flex flex-col gap-6">
              {missions.length > 0 ? (
                missions.map((offre) => (
                  <CardOffre
                    key={offre.id_mission}
                    offre={offre}
                    onPostuler={postuler}
                  />
                ))
              ) : (
                <p>Aucune offre disponible pour le moment.</p>
              )}
            </div>
          </div>
        );

      case "IA":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">IA</h2>
            <p>Contenu IA ou outils d’assistance pour freelances.</p>
          </div>
        );

      case "Notifications":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Notifications</h2>
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
    <div className="flex h-screen bg-gray-100">
      <NavbarFreelance
        user={{ nom: "Freelance X", profile_image: "" }}
        activeSection={activeSection}
        freelance={freelances[0] || {}}
        onSectionChange={handleSectionChange}
        newoffer={newoffer}
        newnotification={newnotification}
      />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white shadow p-4">
          <h1 className="text-2xl font-bold">Freelanceur</h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
