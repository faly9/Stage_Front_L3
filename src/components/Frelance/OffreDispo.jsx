// 🎯 CardOffre.js
// Date : 15 Octobre 2025
// Auteur : Faly Raph
// Description : Carte d’offre interactive pour les freelanceurs avec détails et gestion de postulation

import { useState, useEffect } from "react";
import { Briefcase, DollarSign, Star, Eye } from "lucide-react";
import { API_URL } from "../../config";

export default function CardOffre({ offre, onPostuler }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isPostuled, setIsPostuled] = useState(false);
  console.log("🚀 CardOffre rendu avec offre:", API_URL)


  // 🔹 Vérifie si l'offre est déjà postulée au montage
  useEffect(() => {
    const postuledOffers = JSON.parse(localStorage.getItem("postuledOffers")) || [];
    if (postuledOffers.includes(offre.id_mission)) {
      setIsPostuled(true);
    }
  }, [offre.id_mission]);

  // 🔹 Gère la postulation
  const handlePostuler = () => {
    if (onPostuler) onPostuler(offre);
    setIsPostuled(true);

    const postuledOffers = JSON.parse(localStorage.getItem("postuledOffers")) || [];
    if (!postuledOffers.includes(offre.id_mission)) {
      postuledOffers.push(offre.id_mission);
      localStorage.setItem("postuledOffers", JSON.stringify(postuledOffers));
    }
  };

  return (
    <div
      className="bg-[var(--card-bg)] backdrop-blur-sm rounded-2xl shadow-md p-6 border border-[var(--border)]
      hover:shadow-lg hover:scale-[1.02] transition-all duration-300 
      from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]"
    >
      {/* --- Header entreprise --- */}
      <div className="flex items-center gap-4 mb-4">
        <img
          src={
               `${API_URL}/media/${offre.entreprise_photo}`
          }
          alt={offre.entreprise_nom}
          className="w-12 h-12 rounded-full object-cover border border-[var(--border)]"
        />
        <div>
          <p className="font-semibold text-[var(--text-primary)]">{offre.entreprise_nom}</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Secteur : <span className="font-medium">{offre.entreprise_secteur}</span>
          </p>
        </div>
      </div>

      {/* --- Titre mission --- */}
      <h3 className="text-lg md:text-xl font-bold text-[var(--accent-strong)] flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-[var(--accent)]" />
        {offre.titre}
      </h3>

      {/* --- Détails de l’offre --- */}
      {showDetails && (
        <div className="space-y-2 mb-4">
          <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed">
            {offre.description}
          </p>
          <p className="text-sm text-[var(--text-primary)] flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">Compétences :</span> {offre.competence_requis}
          </p>
          <p className="text-sm text-[var(--text-primary)] flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-500" />
            <span className="font-medium">Budget :</span> {offre.budget} €
          </p>
        </div>
      )}

      {/* --- Boutons d’action --- */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl
          border border-[var(--border)] text-[var(--text-primary)] font-medium
          hover:bg-[var(--accent-light)] hover:text-[var(--text-on-accent)] transition"
        >
          <Eye className="w-4 h-4" />
          {showDetails ? "Masquer les détails" : "Voir les détails"}
        </button>

        <button
          onClick={handlePostuler}
          disabled={isPostuled}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-semibold transition
            ${isPostuled
              ? "bg-gray-400 text-white cursor-not-allowed"
              : "bg-[var(--accent)] text-[var(--text-on-accent)] hover:bg-[var(--accent-strong)]"
            }`}
        >
          {isPostuled ? "Demande envoyée" : "Postuler"}
        </button>
      </div>
    </div>
  );
}
