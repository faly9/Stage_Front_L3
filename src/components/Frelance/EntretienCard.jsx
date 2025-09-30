import React from "react";

export default function EntretienCard({ entrepriseNom, entreprisePhoto, date, commentaire }) {
//   if (!date) return null; // Pas d'entretien => pas de carte

  return (
    <div className="mt-4 p-5 bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-2xl shadow-md">
      {/* En-tête entreprise */}
      <div className="flex items-center gap-3 mb-3">
        {entreprisePhoto ? (
          <img
            src={`http://localhost:8001/media/${entreprisePhoto}`}
            alt={entrepriseNom || "Entreprise"}
            className="w-12 h-12 rounded-full border border-green-400 shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-green-300 flex items-center justify-center text-white font-bold">
            {entrepriseNom ? entrepriseNom[0] : "E"}
          </div>
        )}
        <h3 className="text-lg font-semibold text-green-700">{entrepriseNom || "Entreprise"}</h3>
      </div>

      {/* Corps du message */}
      <h2 className="text-xl font-bold text-green-800 flex items-center gap-2">
        🎉 Félicitations !
      </h2>
      <p className="text-gray-700 mt-1">
        Vous êtes sélectionné pour passer un entretien avec nos RH.
      </p>

      {/* Date */}
      <p className="mt-3 text-green-800 font-medium">
        📅 Rendez-vous prévu le{" "}
        <span className="font-bold">
          {new Date(date).toLocaleString()}
        </span>
      </p>

      {/* Commentaire (optionnel) */}
      {commentaire && (
        <p className="mt-2 italic text-gray-600">
          💬 {commentaire}
        </p>
      )}
    </div>
  );
}
