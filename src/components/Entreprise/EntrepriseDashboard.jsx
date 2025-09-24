import { useState, useEffect } from "react";
import { Edit } from "lucide-react";
import Navbar from "./Navbar";
import CardMission from "./Card_mission";
import ButtonAdd from "./Ajout_mission";
import EditMissionModal from "./EditMission";
import { toast } from "react-toastify";
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

  const handleChange = (e) => setMission({ ...mission, [e.target.name]: e.target.value });

const handleSaveMission = async () => {
  const newErrors = {};
  if (!mission.titre.trim()) newErrors.titre = "Le titre est obligatoire";
  if (!mission.description.trim()) newErrors.description = "La description est obligatoire";
  if (!mission.competence.trim()) newErrors.competence = "Les compétences sont obligatoires";
  if (!mission.budget || parseFloat(mission.budget) <= 0)
    newErrors.budget = "Le budget doit être supérieur à 0";

  setErrors(newErrors);
  if (Object.keys(newErrors).length > 0) return;

  setLoading(true);
  const csrftoken = getCookie("csrftoken");

  try {
    const res = await fetch("http://localhost:8001/msn/missions/me/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-CSRFToken": csrftoken },
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
    toast.success("Mission ajoutée avec succès ✅", { position: "top-center" });

  } catch (err) {
    console.error(err);

    // ❌ toast erreur
    toast.error(err.message || "Erreur lors de l'ajout de la mission ❌", { position: "top-center" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px]">
        <h2 className="text-xl font-semibold mb-4">Ajouter une mission</h2>
        <div className="space-y-4">
          <input type="text" name="titre" value={mission.titre} onChange={handleChange} placeholder="Titre" className="w-full px-3 py-2 border rounded-lg" />
          {errors.titre && <p className="text-red-500 text-sm">{errors.titre}</p>}

          <textarea name="description" value={mission.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border rounded-lg" />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <input type="text" name="competence" value={mission.competence} onChange={handleChange} placeholder="Compétences requises" className="w-full px-3 py-2 border rounded-lg" />
          {errors.competence && <p className="text-red-500 text-sm">{errors.competence}</p>}

          <input type="number" name="budget" value={mission.budget} onChange={handleChange} placeholder="Budget" className="w-full px-3 py-2 border rounded-lg" />
          {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">Annuler</button>
            <button type="button" onClick={handleSaveMission} disabled={loading} className="px-4 py-2 rounded-lg bg-green-600 text-white">{loading ? "Ajout..." : "Ajouter"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 🔹 Dashboard de l'entreprise
export default function EntrepriseDashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [missions, setMissions] = useState([]);
  const [user, setUser] = useState({ id: null, nom: "", secteur: "", profile_image: null, profile_imageFile: null });
  const [userinfo, setUserinfo] = useState({ email: "", role: "" });
  const [errors, setErrors] = useState({});
  const [section, setSection] = useState("dashboard");

  useEffect(() => {
    fetchUserProfile();
    fetchUserInfo();
    fetchMissions();
  }, []);

  const fetchMissions = async () => {
    try {
      const res = await fetch("http://localhost:8001/msn/missions/me/", { method: "GET", credentials: "include" });
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
      const res = await fetch("http://localhost:8001/auth/info/", { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error("Erreur fetch auth/info");
      const data = await res.json();
      setUserinfo({ email: data.email, role: data.role });
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const res = await fetch("http://localhost:8001/etr/entreprises/me/", { method: "GET", credentials: "include" });
      if (!res.ok) throw new Error("Erreur fetch profile");
      const data = await res.json();
      setUser({ id: data.id_entreprise, nom: data.nom, secteur: data.secteur, profile_image: data.profile_image || "", profile_imageFile: null });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });
  const handleFileChange = (e) => { const file = e.target.files[0]; if (file) setUser({ ...user, profile_imageFile: file, profile_image: URL.createObjectURL(file) }); };

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
    toast.success("Profil sauvegardé avec succès ✅", { position: "top-center" });

  } catch (err) {
    console.error(err);

    // ❌ toast erreur
    toast.error(err.message || "Erreur lors de la sauvegarde du profil ❌", { position: "top-center" });
  }
};

return (
    <div className="flex h-screen bg-gray-100">
      <Navbar onSectionChange={setSection} section={section} />
      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center bg-white shadow p-4">
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <div className="flex items-center gap-4">
            <p>{user.nom || "User"}</p>
            <img
              src={user.profile_image || ""}
              alt="Profil"
              className="w-10 h-10 rounded-full border cursor-pointer object-cover"
              onClick={toggleProfile}
            />
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 p-6 overflow-y-auto">
          {section === "dashboard" && (
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
                    prev.map((m) => (m.id_mission === updated.id_mission ? updated : m))
                  )
                }
              />
            </div>
          )}
        </main>

        {/* MODAL PROFIL */}
        {isProfileOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
            <div className="bg-white rounded-2xl p-6 w-96 relative z-10">
              <h2 className="text-xl font-bold mb-4">Éditer Profil</h2>

              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-center gap-4">
                  <div className="relative">
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
                          className="w-24 h-24 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
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
                      className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </label>
                  </div>
                </div>

                <label>
                  Role :
                  <input
                    type="text"
                    name="role"
                    value={userinfo.role}
                    readOnly
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </label>

                <label>
                  Nom :
                  <input
                    type="text"
                    name="nom"
                    value={user.nom}
                    onChange={handleChange}
                    placeholder="Nom de l'entreprise"
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                  {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
                </label>

                <label>
                  Secteur :
                  <input
                    type="text"
                    name="secteur"
                    value={user.secteur}
                    onChange={handleChange}
                    placeholder="Votre secteur"
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                  {errors.secteur && <p className="text-red-500 text-sm">{errors.secteur}</p>}
                </label>

                <label>
                  Email :
                  <input
                    type="email"
                    name="email"
                    readOnly
                    value={userinfo.email}
                    className="w-full mt-1 p-2 border rounded-lg"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                  onClick={toggleProfile}
                >
                  Annuler
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                  onClick={handleSaveProfile}
                >
                  Sauvegarder
                </button>
              </div>

              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
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
