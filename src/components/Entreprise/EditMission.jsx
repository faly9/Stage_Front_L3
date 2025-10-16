import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { X, Save, Loader2, Edit3 } from "lucide-react"; // Icônes modernes

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

      if (!res.ok) throw new Error("Erreur lors de la mise à jour ❌");

      const updated = await res.json();
      onUpdated?.(updated);
      onClose();
      toast.success("Mission mise à jour avec succès ✅", { position: "top-center" });
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div
        className="relative w-[480px] rounded-2xl shadow-2xl 
                   bg-[var(--bg-card)] text-[var(--text-primary)] 
                   border border-[var(--border-color)] 
                   p-8 transition-all duration-300"
      >
        {/* Header */}
        <h2 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
          <Edit3 className="w-6 h-6 text-[var(--accent)]" />
          Modifier la mission
        </h2>

        {/* Form */}
        <div className="space-y-4">
          {[
            { name: "titre", placeholder: "Titre de la mission" },
            { name: "description", placeholder: "Description détaillée", type: "textarea" },
            { name: "competence", placeholder: "Compétences requises" },
            { name: "budget", placeholder: "Budget en €", type: "number" },
          ].map(({ name, placeholder, type = "text" }) => (
            <div key={name}>
              {type === "textarea" ? (
                <textarea
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  rows={3}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 border-2 border-[var(--border-color)] rounded-lg 
                             focus:ring-2 focus:ring-[var(--accent)] focus:outline-none 
                             bg-[var(--input-bg)] text-[var(--text-primary)]"
                />
              ) : (
                <input
                  type={type}
                  name={name}
                  value={formData[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full px-4 py-2 border-2 border-[var(--border-color)] rounded-lg 
                             focus:ring-2 focus:ring-[var(--accent)] focus:outline-none 
                             bg-[var(--input-bg)] text-[var(--text-primary)]"
                />
              )}
              {errors[name] && (
                <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
              )}
            </div>
          ))}
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                       hover:bg-gray-300 dark:hover:bg-gray-600 transition font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--accent)] 
                       text-[var(--text-on-accent)] font-medium shadow-md 
                       hover:shadow-lg hover:brightness-110 transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Mise à jour...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Enregistrer
              </>
            )}
          </button>
        </div>

        {/* Bouton fermeture */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
