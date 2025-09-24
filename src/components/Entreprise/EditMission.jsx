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

export default function EditMissionModal({ mission, isOpen, onClose, onUpdated }) {
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
    if (!formData.description.trim()) newErrors.description = "La description est obligatoire";
    if (!formData.competence.trim()) newErrors.competence = "Les compétences sont obligatoires";
    if (!formData.budget || parseFloat(formData.budget) <= 0) newErrors.budget = "Le budget doit être > 0";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const csrftoken = getCookie("csrftoken");
      const res = await fetch(`http://localhost:8001/msn/missions/${mission.id_mission}/`, {
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
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error("Erreur mise à jour : " + errText);
      }

      const updated = await res.json();
      if (onUpdated) onUpdated(updated);
      onClose();

      // ✅ toast succès
      toast.success("Mission mise à jour avec succès ✅", { position: "top-center" });

    } catch (err) {
      console.error(err);

      // ❌ toast erreur
      toast.error(err.message || "Une erreur est survenue ❌", { position: "top-center" });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[500px]">
        <h2 className="text-xl font-semibold mb-4">Éditer la mission</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="titre"
            value={formData.titre}
            onChange={handleChange}
            placeholder="Titre"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.titre && <p className="text-red-500 text-sm">{errors.titre}</p>}

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}

          <input
            type="text"
            name="competence"
            value={formData.competence}
            onChange={handleChange}
            placeholder="Compétences requises"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.competence && <p className="text-red-500 text-sm">{errors.competence}</p>}

          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Budget"
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.budget && <p className="text-red-500 text-sm">{errors.budget}</p>}

          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200">
              Annuler
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white"
            >
              {loading ? "Mise à jour..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
