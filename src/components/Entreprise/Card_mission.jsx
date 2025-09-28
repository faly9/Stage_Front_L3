import { Briefcase, DollarSign, Star, Edit, Trash2, Eye } from "lucide-react";

export default function CardMission({ mission, onEdit, onDelete, onView }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-purple-700 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          {mission.titre}
        </h3>
        <span className="px-3 py-1 text-sm rounded-full bg-purple-100 text-purple-700 font-medium">
          Publiée
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-3 line-clamp-3">{mission.description}</p>

      {/* Infos */}
      <div className="space-y-2 mb-4">
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold">Compétences :</span>{" "}
          {mission.competence_requis}
        </p>
        <p className="text-sm text-gray-700 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="font-semibold">Budget :</span> {mission.budget} €
        </p>
      </div>

      {/* Actions entreprise */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(mission)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
        >
          <Edit className="w-4 h-4" /> Modifier
        </button>
        <button
          onClick={() => onDelete(mission.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition"
        >
          <Trash2 className="w-4 h-4" /> Supprimer
        </button>
      </div>
    </div>
  );
}
