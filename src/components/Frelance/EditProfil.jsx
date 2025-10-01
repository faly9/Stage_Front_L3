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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold mb-4">
          {profile.id_freelance ? "Modifier le profil" : "Créer mon profil"}
        </h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {/* Photo */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="relative">
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
                    profile.photoPreview ||
                    profile.photo /* backend peut renvoyer URL */
                  }
                  alt="Aperçu Profil"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">+</span>
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

        {/* Nom */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Nom</label>
          <input
            type="text"
            name="nom"
            value={profile.nom || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={profile.description || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Compétences */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Compétences(,)</label>
          <textarea
            name="competence"
            value={profile.competence || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Expériences */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Expériences(,)</label>
          <textarea
            name="experience"
            value={profile.experience || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Diplômes */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Diplômes(,)</label>
          <textarea
            name="formation"
            value={profile.formation || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Certificats */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Certificats(,)</label>
          <textarea
            name="certificat"
            value={profile.certificat || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>

        {/* Tarif */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Tarif E/h</label>
          <input
            type="number"
            name="tarif"
            value={profile.tarif || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
