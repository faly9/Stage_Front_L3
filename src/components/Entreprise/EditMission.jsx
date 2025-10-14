import { useState, useEffect } from "react";
import { toast } from "react-toastify";

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

export default function EditMissionModal({
  mission,
  isOpen,
  onClose,
  onUpdated,
}) {
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    competence: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mission) {
      setFormData({
        titre: mission.titre,
        description: mission.description,
        competence: mission.competence_requis,
        budget: mission.budget,
      });
    }
  }, [mission]);

  if (!isOpen || !mission) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const newErrors = {};
    if (!formData.titre.trim()) newErrors.titre = "Le titre est obligatoire";
    if (!formData.description.trim())
      newErrors.description = "La description est obligatoire";
    if (!formData.competence.trim())
      newErrors.competence = "Les compétences sont obligatoires";
    if (!formData.budget || parseFloat(formData.budget) <= 0)
      newErrors.budget = "Le budget doit être > 0";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const csrftoken = getCookie("csrftoken");
      const res = await fetch(
        `http://localhost:8001/msn/missions/${mission.id_mission}/`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            titre: formData.titre,
            description: formData.description,
            competence_requis: formData.competence,
            budget: formData.budget,
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Erreur mise à jour : " + errText);
      }

      const updated = await res.json();
      if (onUpdated) onUpdated(updated);
      onClose();

      toast.success("Mission mise à jour avec succès ✅", {
        position: "top-center",
      });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Une erreur est survenue ❌", {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-gradient-to-br from-white via-purple-50 to-purple-100 p-8 rounded-2xl shadow-2xl w-[480px] animate-fade-in">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          ✏️ Modifier la mission
        </h2>

        <div className="space-y-4">
          <div>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              placeholder="Titre de la mission"
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.titre && (
              <p className="text-red-500 text-sm mt-1">{errors.titre}</p>
            )}
          </div>

          <div>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description détaillée"
              rows={3}
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="competence"
              value={formData.competence}
              onChange={handleChange}
              placeholder="Compétences requises"
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.competence && (
              <p className="text-red-500 text-sm mt-1">
                {errors.competence}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="Budget en €"
              className="w-full px-4 py-2 border-2 border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
            {errors.budget && (
              <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow hover:shadow-md hover:from-purple-700 hover:to-blue-700 transition"
          >
            {loading ? "Mise à jour..." : "💾 Enregistrer"}
          </button>
        </div>

        {/* Bouton de fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
