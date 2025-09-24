import { Briefcase, DollarSign, Star, Eye } from "lucide-react";

export default function CardOffre({ offre, onView, onPostuler }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          {offre.titre}
        </h3>
        <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 font-medium">
          Disponible
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-3 line-clamp-3">{offre.description}</p>

      {/* Infos */}
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold">Compétences :</span> {offre.competences.join(", ")}
        </p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="font-semibold">Budget :</span> {offre.budget} €
        </p>
      </div>

      {/* Actions freelance */}
      <div className="flex gap-3">
        <button
          onClick={() => onView && onView(offre)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          <Eye className="w-4 h-4" /> Voir détails
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
