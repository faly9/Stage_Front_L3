import React, { useState } from "react";
import { Edit } from "lucide-react";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

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
      const isUpdate = !!profile.id_freelance;
      console.log(isUpdate);
      const url = isUpdate
        ? `http://localhost:8001/frl/freelances/${profile.id_freelance}/`
        : "http://localhost:8001/frl/freelances/";

      const res = await fetch(url, {
        method: isUpdate ? "PUT" : "POST",
        credentials: "include",
        headers: {
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData,
      });

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

  return (
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
  <div className="bg-white p-6 rounded-3xl w-full max-w-lg overflow-y-auto max-h-[90vh] shadow-2xl border border-gray-200 transform transition-all duration-300 scale-95 animate-fadeIn">
    
    {/* Titre */}
    <h2 className="text-2xl font-bold mb-4 text-gray-800">
      {profile.id_freelance ? "Modifier le profil" : "Créer mon profil"}
    </h2>
    {error && <p className="text-red-600 mb-2">{error}</p>}

    {/* Photo */}
    <div className="flex items-center justify-center gap-4 mb-6">
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
              src={profile.photoPreview || profile.photo}
              alt="Aperçu Profil"
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-300 shadow-lg group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold">
              +
            </div>
          )}
        </label>
        <label
          htmlFor="profileUpload"
          className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100 transition cursor-pointer"
        >
          <Edit className="w-4 h-4 text-gray-600" />
        </label>
      </div>
    </div>

    {/* Champs du formulaire */}
    {[
      { label: "Nom", name: "nom", type: "text" },
      { label: "Description", name: "description", type: "textarea", rows: 3 },
      { label: "Compétences (séparées par ,)", name: "competence", type: "textarea", rows: 3 },
      { label: "Expériences (séparées par ,)", name: "experience", type: "textarea", rows: 3 },
      { label: "Diplômes (séparés par ,)", name: "formation", type: "textarea", rows: 3 },
      { label: "Certificats (séparés par ,)", name: "certificat", type: "textarea", rows: 3 },
      { label: "Tarif €/h", name: "tarif", type: "number" },
    ].map((field, idx) => (
      <div className="mb-4" key={idx}>
        <label className="block mb-1 font-medium text-gray-700">{field.label}</label>
        {field.type === "textarea" ? (
          <textarea
            name={field.name}
            value={profile[field.name] || ""}
            onChange={handleChange}
            rows={field.rows}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 transition-shadow shadow-sm hover:shadow-md"
          />
        ) : (
          <input
            type={field.type}
            name={field.name}
            value={profile[field.name] || ""}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-300 transition-shadow shadow-sm hover:shadow-md"
          />
        )}
      </div>
    ))}

    {/* Boutons */}
    <div className="flex justify-end gap-3 mt-6">
      <button
        onClick={onCancel}
        className="px-5 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition"
      >
        Annuler
      </button>
      <button
        onClick={handleSave}
        disabled={loading}
        className="px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
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
