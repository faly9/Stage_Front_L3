import React, { useState, useEffect } from "react";
import NavbarFreelance from "./NavbarFree";
import CardProfil from "./CardProfil";
import CardOffre from "./OffreDispo";
import EditProfileFreelance from "./EditProfil";
import { toast } from "react-toastify";

export default function FreelanceDashboard() {
  const [activeSection, setActiveSection] = useState("Mon Profil");
  const [editingFreelance, setEditingFreelance] = useState(null);
  const [freelances, setFreelances] = useState([]);
  const [missions, setMissions] = useState([]); // 🔹 utilisé à la place de offres statiques
  const [loading, setLoading] = useState(true);

  // Charger profil freelance
  useEffect(() => {
    const fetchFreelance = async () => {
      try {
        const res = await fetch("http://localhost:8001/frl/freelances/", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setFreelances(Array.isArray(data) ? data : [data]);
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
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setMissions(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Erreur API missions:", error);
      }
    };

    fetchMissions();
  }, []);


  const handlePostuler = (offre) => {
    alert("Vous postulez pour : " + offre.titre);
  };

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
                    key={offre.id}
                    offre={offre}
                    onPostuler={handlePostuler}
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

      case "Historique":
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4">Historique</h2>
            <p>Liste des missions terminées ou candidatures passées.</p>
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
        onSectionChange={setActiveSection}
      />

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white shadow p-4">
          <h1 className="text-2xl font-bold">Dashboard Freelance</h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
