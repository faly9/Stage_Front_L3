import React from "react";
import { Edit } from "lucide-react";

export default function CardProfil({ freelance, onEdit }) {
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

  const renderBadges = (items) =>
    items.length > 0
      ? items.map((item, idx) => (
          <span
            key={idx}
            className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full mr-2 mb-2"
          >
            {item}
          </span>
        ))
      : <p className="text-gray-400 text-sm">Aucune information renseignée</p>;

  return (
    <div className="relative bg-gradient-to-br from-white to-purple-50 shadow-2xl rounded-2xl p-6 w-full max-w-md mx-auto overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      {/* En-tête */}
      <div className="flex flex-col items-center mb-6 relative z-10">
        <img
          src={freelance.photo || "/images/profil.png"}
          alt={freelance.nom || "Profil"}
          className="w-24 h-24 rounded-full object-cover border-2 border-indigo-300 mb-3 shadow-md"
        />
        <h2 className="text-2xl font-bold text-gray-800">{freelance.nom || "Nom non renseigné"}</h2>
        <p className="text-gray-600 text-center">{freelance.description || "Description non renseignée"}</p>
      </div>

      {/* Compétences */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Compétences</h3>
        <div className="flex flex-wrap">{renderBadges(competences)}</div>
      </div>

      {/* Expériences */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Expériences</h3>
        <div className="flex flex-wrap">{renderBadges(experiences)}</div>
      </div>

      {/* Diplômes */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Diplômes</h3>
        <div className="flex flex-wrap">{renderBadges(diplomes)}</div>
      </div>

      {/* Certificats */}
      <div className="mb-4 relative z-10">
        <h3 className="text-lg font-semibold mb-2 border-b pb-1">Certificats</h3>
        <div className="flex flex-wrap">{renderBadges(certificats)}</div>
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
          className="flex items-center gap-1 px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-md"
        >
          <Edit className="w-4 h-4" /> Modifier
        </button>
      </div>
    </div>
  );
}
