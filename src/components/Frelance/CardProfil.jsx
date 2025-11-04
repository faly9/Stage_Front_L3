// 🎯 PageProfil.js
// Auteur : Faly Raph
// Date : 15 Octobre 2025
// Description : Page profil d’un freelance avec animations, badges dynamiques, et thème clair/sombre compatible.

import React from "react";
import { Edit } from "lucide-react";
import { motion } from "framer-motion";
import { API_URL } from "../../config";

export default function PageProfil({ freelance, onEdit }) {
  // --- Extraction des champs du freelance ---
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

  // --- Rendu des badges dynamiques ---
  const renderBadges = (items) =>
    items.length > 0 ? (
      items.map((item, idx) => (
        <span
          key={idx}
          className="inline-block bg-[var(--accent-light)] text-[var(--accent-strong)] text-xs font-medium px-3 py-1 rounded-full mr-2 mb-2 hover:bg-[var(--accent)] hover:text-[var(--text-on-accent)] transition-colors"
        >
          {item}
        </span>
      ))
    ) : (
      <p className="text-[var(--text-secondary)] text-sm italic">
        Aucune information renseignée
      </p>
    );

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center  bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)] px-6 transition-colors duration-500">
      
      {/* --- Message de bienvenue --- */}
      <motion.div
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex-1 max-w-xl p-6 lg:p-10 text-center lg:text-left"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--accent-strong)] mb-4">
          Bonjour 👋
        </h1>
        <p className="text-[var(--text-primary)] text-lg leading-relaxed mb-6">
          Bienvenue sur ton espace professionnel ! 🌟  
          Chaque jour est une opportunité de faire briller tes compétences.  
          Continue de progresser et crois en ton talent. 💪
        </p>
        <p className="text-[var(--text-secondary)] italic">
          “Le succès n’est pas le fruit du hasard, mais de la persévérance.”
        </p>
      </motion.div>

      {/* --- Carte profil --- */}
      <motion.div
        className="relative flex-1 max-w-lg bg-[var(--card-bg)] rounded-3xl p-8 shadow-2xl border border-[var(--border)] overflow-hidden backdrop-blur-sm transition-all duration-700"
        whileHover={{ scale: 1.02 }}
      >
        {/* Bordure animée avec dégradé */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-[3px] border-transparent"
          animate={{
            borderImageSource:
              "linear-gradient(90deg, var(--accent), var(--accent-light), var(--accent-strong), var(--accent))",
            borderImageSlice: 1,
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* --- Contenu principal du profil --- */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <motion.img
            src={`${API_URL}/media/${freelance.photo}` || "/images/profil.png"}
            alt="Profil"
            className="w-20 h-20 rounded-full object-cover border-4 border-[var(--accent-light)] shadow-md mb-4"
            whileHover={{ rotate: 3, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          />

          <h2 className="text-2xl font-bold text-[var(--text-primary)]">
            {freelance.nom || "Nom non renseigné"}
          </h2>
          <p className="text-[var(--text-secondary)] mb-6 text-center text-sm md:text-base">
            {freelance.description || "Description non renseignée"}
          </p>

          {/* --- Compétences --- */}
          <section className="mb-6 w-full">
            <h3 className="text-lg font-semibold mb-2 text-[var(--accent-strong)] border-b pb-1">
              Compétences
            </h3>
            <div className="flex flex-wrap justify-center">{renderBadges(competences)}</div>
          </section>

          {/* --- Expériences --- */}
          <section className="mb-6 w-full">
            <h3 className="text-lg font-semibold mb-2 text-[var(--accent-strong)] border-b pb-1">
              Expériences
            </h3>
            <div className="flex flex-wrap justify-center">{renderBadges(experiences)}</div>
          </section>

          {/* --- Diplômes --- */}
          <section className="mb-6 w-full">
            <h3 className="text-lg font-semibold mb-2 text-[var(--accent-strong)] border-b pb-1">
              Diplômes
            </h3>
            <div className="flex flex-wrap justify-center">{renderBadges(diplomes)}</div>
          </section>

          {/* --- Certificats --- */}
          <section className="mb-6 w-full">
            <h3 className="text-lg font-semibold mb-2 text-[var(--accent-strong)] border-b pb-1">
              Certificats
            </h3>
            <div className="flex flex-wrap justify-center">{renderBadges(certificats)}</div>
          </section>

          {/* --- Tarifs --- */}
          <section className="mb-6 w-full">
            <h3 className="text-lg font-semibold mb-2 text-[var(--accent-strong)] border-b pb-1">
              Tarifs
            </h3>
            <p className="text-[var(--accent)] font-bold text-xl">
              {freelance.tarif ? `${freelance.tarif} €/h` : "Tarif non défini"}
            </p>
          </section>

          {/* --- Bouton d’édition --- */}
          <motion.button
            onClick={() => onEdit && onEdit(freelance)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--accent)] text-[var(--text-on-accent)] font-medium shadow-md hover:bg-[var(--accent-strong)] transition-colors"
          >
            <Edit className="w-4 h-4" /> Modifier le profil
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
