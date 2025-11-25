import React, { useState } from "react";
import { Edit } from "lucide-react";
// import { API_URL } from "../../config";
import { getConfig } from "../../config";

// 🔹 Récupère un cookie (ex: CSRF token)
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie) {
    document.cookie.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key === name) cookieValue = decodeURIComponent(value);
    });
  }
  return cookieValue;
};

export default function EditProfileFreelance({ freelance, onSave, onCancel }) {
  // 🔹 États du profil
  const [profile, setProfile] = useState({
    id_freelance: freelance?.id_freelance || null,
    nom: freelance?.nom || "",
    description: freelance?.description || "",
    competence: freelance?.competence || "",
    experience: freelance?.experience || "",
    formation: freelance?.formation || "",
    certificat: freelance?.certificat || "",
    tarif: freelance?.tarif || "",
    photo: freelance?.photo || null,
    photoPreview: null,
  });
  const { API_URL , MEDIA_URL } = getConfig();

  console.log("api", API_URL)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  console.log("🚀 EditProfileFreelance rendu avec freelance:", freelance);
  // 🔹 Gère les changements de champs texte
  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  // 🔹 Gère le changement de photo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        photo: file,
        photoPreview: URL.createObjectURL(file),
      });
    }
  };

  // 🔹 Sauvegarde ou met à jour le profil
  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("nom", profile.nom || "");
      formData.append("description", profile.description || "");
      formData.append("tarif", profile.tarif || 0);
      formData.append("competence", profile.competence || "");
      formData.append("experience", profile.experience || "");
      formData.append("formation", profile.formation || "");
      formData.append("certificat", profile.certificat || "");

      if (profile.photo instanceof File) {
        formData.append("photo", profile.photo);
      }
      console.log("Fichier photo à envoyer:", profile.photo);
      console.log("Est-ce un fichier ? ", profile.photo instanceof File);
      // Attendu : true, et le log du fichier
      const isUpdate = !!profile.id_freelance;
      const url = isUpdate
      ? `${API_URL}/frl/freelances/${profile.id_freelance}/`
      : `${API_URL}/frl/freelances/`;
      
      const res = await fetch(url, {
        method: isUpdate ? "PATCH" : "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData,
      });
      
      console.log("Contenu FormData:", [...formData.entries()]);
      if (!res.ok) {
        const errData = await res.json();
        console.error("⚠️ Erreur API:", errData);
        throw new Error(
          isUpdate
            ? "Erreur lors de la mise à jour du profil"
            : "Erreur lors de la création du profil"
        );
      }

      const updated = await res.json();
      onSave(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Interface utilisateur
  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl border border-gray-200 dark:border-gray-700 transform transition-all duration-300 animate-fadeIn">
        {/* Titre */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">
          {profile.id_freelance ? "Modifier le profil" : "Créer mon profil"}
        </h2>

        {/* Message d'erreur */}
        {error && (
          <p className="text-red-500 text-center text-sm mb-3">{error}</p>
        )}

        {/* Photo de profil */}
        <div className="flex flex-col items-center justify-center gap-4 mb-6">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="profileUpload"
            />
            <label htmlFor="profileUpload" className="cursor-pointer">
              {profile.photoPreview || profile.photo ? (
                <img
                  src={
                    profile.photoPreview // 1. Aperçu local (si un nouveau fichier est sélectionné)
                      ? profile.photoPreview
                      : typeof profile.photo === 'string' 
                        ? `${MEDIA_URL}/${profile.photo}` // 2. URL du backend (si c'est une chaîne et un chemin relatif)
                        : "/images/profil.png" // 3. Photo par défaut
                  }
                  alt="Aperçu Profil"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-2 border-indigo-300 dark:border-indigo-500 shadow-lg group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 text-2xl font-bold">
                  +
                </div>
              )}
            </label>
            <label
              htmlFor="profileUpload"
              className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 p-1.5 rounded-full shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
            >
              <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            </label>
          </div>
        </div>

        {/* Formulaire d’édition */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: "Nom", name: "nom", type: "text" },
            { label: "Description", name: "description", type: "textarea", rows: 3 },
            { label: "Compétences (séparées par ,)", name: "competence", type: "textarea", rows: 3 },
            { label: "Expériences (séparées par ,)", name: "experience", type: "textarea", rows: 3 },
            { label: "Diplômes (séparés par ,)", name: "formation", type: "textarea", rows: 3 },
            { label: "Certificats (séparés par ,)", name: "certificat", type: "textarea", rows: 3 },
            { label: "Tarif €/h", name: "tarif", type: "number" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={profile[field.name] || ""}
                  onChange={handleChange}
                  rows={field.rows}
                  className="w-full p-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-300 transition shadow-sm hover:shadow-md"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={profile[field.name] || ""}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500 focus:border-indigo-300 transition shadow-sm hover:shadow-md"
                />
              )}
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-400 dark:hover:bg-gray-600 transition font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto px-5 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-xl hover:bg-indigo-700 dark:hover:bg-indigo-600 transition font-medium"
          >
            {loading
              ? "Enregistrement..."
              : profile.id_freelance
                ? "Mettre à jour"
                : "Créer"}
          </button>
        </div>
      </div>
    </div>
  );
}
