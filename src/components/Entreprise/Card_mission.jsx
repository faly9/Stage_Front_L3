import { Briefcase, DollarSign, Star, Edit, Trash2 } from "lucide-react";

export default function CardMission({ mission, onEdit, onDelete }) {
  return (
    <div
      className="rounded-2xl shadow-md p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
      style={{
        background: "linear-gradient(to bottom right, var(--gradient-from), var(--gradient-to))",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          className="text-xl font-semibold flex items-center gap-2"
          style={{ color: "var(--accent-strong)", fontFamily: "Poppins, sans-serif" }}
        >
          <Briefcase className="w-5 h-5" style={{ color: "var(--icon-primary)" }} />
          {mission.titre}
        </h3>

        <span
          className="px-3 py-1 text-sm rounded-full font-medium"
          style={{
            backgroundColor: "var(--accent-light)",
            color: "var(--text-on-accent)",
          }}
        >
          Publiée
        </span>
      </div>

      {/* Description */}
      <p className="mb-3 line-clamp-3" style={{ color: "var(--text-secondary)" }}>
        {mission.description}
      </p>

      {/* Infos */}
      <div className="space-y-2 mb-4">
        <p className="text-sm flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold">Compétences :</span> {mission.competence_requis}
        </p>
        <p className="text-sm flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="font-semibold">Budget :</span> {mission.budget} €
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onEdit(mission)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--text-on-accent)",
          }}
        >
          <Edit className="w-4 h-4" /> Modifier
        </button>
        <button
          onClick={() => onDelete(mission.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium transition"
          style={{
            backgroundColor: "var(--red-bot)",
            color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}
        >
          <Trash2 className="w-4 h-4" /> Supprimer
        </button>
      </div>
    </div>
  );
}
