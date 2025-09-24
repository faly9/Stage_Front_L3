import React from "react";
import { Edit } from "lucide-react";

export default function CardProfil({ freelance, onEdit }) {
  // 🔹 Normalisation des données
  const competences = freelance.competence
    ? freelance.competence.split(",").map((c) => c.trim())
    : [];

  const diplomes = freelance.formation
    ? freelance.formation.split(",").map((d) => d.trim())
    : [];

  const certificats = freelance.certificat
    ? freelance.certificat.split(",").map((c) => c.trim())
    : [];

  const experiences = freelance.experience
    ? freelance.experience.split(",").map((e) => e.trim())
    : [];

  return (
    <div className="relative bg-white shadow-xl rounded-xl p-6 w-full max-w-md mx-auto overflow-hidden group">
      {/* En-tête */}
      <div className="flex flex-col items-center mb-6 relative z-10">
        <img
          src={freelance.photo || "/images/profil.png"}
          alt={freelance.nom || "Profil"}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 mb-3"
        />
        <h2 className="text-2xl font-bold">{freelance.nom || "Nom non renseigné"}</h2>
        <p className="text-gray-600">
          {freelance.description || "Description non renseignée"}
        </p>
      </div>

      {/* Compétences */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Compétences</h3>
        {competences.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {competences.map((comp, idx) => (
              <li key={idx}>{comp}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Aucune compétence renseignée</p>
        )}
      </div>

      {/* Expériences */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Expériences professionnelles</h3>
        {experiences.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {experiences.map((exp, idx) => (
              <li key={idx}>{exp}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Aucune expérience renseignée</p>
        )}
      </div>

      {/* Diplômes */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Diplômes</h3>
        {diplomes.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {diplomes.map((diplome, idx) => (
              <li key={idx}>{diplome}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Aucun diplôme renseigné</p>
        )}
      </div>

      {/* Certificats */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Certificats</h3>
        {certificats.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {certificats.map((cert, idx) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">Aucun certificat renseigné</p>
        )}
      </div>

      {/* Tarif */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Tarif</h3>
        <p className="text-green-600 font-bold text-xl">
          {freelance.tarif ? `${freelance.tarif} €/h` : "Non défini"}
        </p>
      </div>

      {/* Bouton Modifier */}
      <div className="flex justify-end gap-3 mt-4 relative z-10">
        <button
          onClick={() => onEdit && onEdit(freelance)}
          className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <Edit className="w-4 h-4" /> Modifier
        </button>
      </div>
    </div>
  );
}
