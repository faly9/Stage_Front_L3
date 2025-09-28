import { useState } from "react";
import { Briefcase, DollarSign, Star, Eye } from "lucide-react";

export default function CardOffre({ offre, onView, onPostuler }) {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      
      {/* Header entreprise */}
      <div className="flex items-center gap-4 mb-4">
        <img
        src={
    offre.entreprise_photo?.startsWith("/media/")
      ? `http://localhost:8001${offre.entreprise_photo}`
      : offre.entreprise_photo
  }          alt={offre.entreprise_nom}
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <p className="font-bold text-gray-800">{offre.entreprise_nom }</p>
          <p className="text-sm text-gray-500">{offre.entreprise_secteur}</p>
        </div>
      </div>

      {/* Titre mission */}
      <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-purple-600" />
        {offre.titre}
      </h3>

      {/* Détails affichés uniquement si showDetails=true */}
      {showDetails && (
        <div className="space-y-2 mb-4">
          <p className="text-gray-600">{offre.description}</p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" /> Compétences : {offre.competence_requis}
          </p>
          <p className="text-sm text-gray-700 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" /> Budget : {offre.budget} €
          </p>
        </div>
      )}

      {/* Actions freelance */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <Eye className="w-4 h-4" /> {showDetails ? "Masquer détails" : "Voir détails"}
        </button>
        <button
          onClick={() => onPostuler && onPostuler(offre)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
        >
          Postuler
        </button>
      </div>
    </div>
  );
}
