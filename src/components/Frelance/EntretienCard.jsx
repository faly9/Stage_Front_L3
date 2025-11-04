// components/EntretienCard.jsx
// Auteur : Faly Raph
// Date : 15 Octobre 2025
// Description : Carte d’entretien affichant les notifications de rendez-vous
// Compatible mode clair/sombre et responsive.

import React from "react";
import { Calendar, MessageCircle, Video, User } from "lucide-react";
import JoinCall from "./JoinCall";
// import { API_URL } from "../../config";
import { getConfig } from "../../config";

export default function EntretienCard({ notification }) {
  const { API_URL } = getConfig();

  if (!notification)
    return (
      <p className="text-[var(--text-secondary)] dark:text-[var(--text-secondary)] italic text-center">
        Aucune notification pour le moment.
      </p>
    );

  const formatLocalDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString("fr-FR", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      hour12: false,
    });
  };

  const formatEntrepriseDate = (dateString, timezoneEntreprise) => {
    if (!dateString || !timezoneEntreprise) return "";
    return new Date(dateString).toLocaleString("fr-FR", {
      timeZone: timezoneEntreprise,
      hour12: false,
    });
  };

  return (
    <div
      className="
        bg-[var(--card-bg)]
        rounded-3xl
        shadow-lg
        hover:shadow-2xl
        transition-all
        duration-300
        p-5 sm:p-6
        flex flex-col gap-4
        border
      "
      style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
    >
      {/* Bouton pour rejoindre l’appel */}
      <div className="flex  justify-center">
        <JoinCall />
      </div>

      {/* Informations entreprise */}
      <div className="flex items-center gap-3">
        {notification.entreprise_photo ? (
          <img
            src={
              notification.entreprise_photo.startsWith("/media/")
                ? `${API_URL}${notification.entreprise_photo}`
                : `${API_URL}/media/${notification.entreprise_photo}`
            }
            alt={notification.entreprise_nom}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow"
            style={{
              borderStyle: "solid",
              borderWidth: "2px",
              borderColor: "var(--accent-light)",
            }}
          />
        ) : (
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-xl font-bold"
            style={{
              background: "var(--gradient-via)",
              color: "var(--text-secondary)",
            }}
          >
            {notification.entreprise_nom?.[0] || "E"}
          </div>
        )}

        <h3 className="text-lg sm:text-xl font-bold" style={{ color: "var(--text-primary)" }}>
          {notification.entreprise_nom}
        </h3>
      </div>

      {/* Informations principales */}
      <div className="text-sm sm:text-base space-y-1" style={{ color: "var(--text-secondary)" }}>
        <p className="flex items-center gap-2">
          <User className="w-4 h-4" style={{ color: "var(--accent)" }} />
          À Mr/Mme : <span className="font-medium" style={{ color: "var(--text-primary)" }}>{notification.freelance_nom}</span>
        </p>

        <p className="flex items-center gap-2">
          <Video className="w-4 h-4" style={{ color: "var(--accent)" }} />
          Mission : <span className="font-medium" style={{ color: "var(--text-primary)" }}>{notification.mission_titre}</span>
        </p>
      </div>

      {/* Dates d’entretien */}
      {notification.date_entretien && (
        <div className="text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          <p className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" style={{ color: "var(--accent)" }} />
            <span className="font-medium" style={{ color: "var(--text-primary)" }}>Rendez-vous d’entretien :</span>
          </p>
          <ul className="ml-6 list-disc" style={{ color: "var(--text-secondary)" }}>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>Locale :</strong> {formatLocalDate(notification.date_entretien)}
            </li>
            <li>
              <strong style={{ color: "var(--text-primary)" }}>Entreprise :</strong>{" "}
              {formatEntrepriseDate(notification.date_entretien, notification.timezone)} ({notification.timezone})
            </li>
          </ul>
        </div>
      )}

      {/* Nom de salle ou attente */}
      {notification.commentaire_entretien ? (
        <p className="flex items-center gap-2 text-sm sm:text-base" style={{ color: "var(--text-secondary)" }}>
          <MessageCircle className="w-4 h-4" style={{ color: "var(--accent)" }} />
          Salle :{" "}
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {notification.commentaire_entretien}
          </span>
        </p>
      ) : (
        <p className="text-sm italic" style={{ color: "var(--text-secondary)" }}>
          Le nom de la salle sera communiqué au moment de l’entretien.
        </p>
      )}

      {/* Statut */}
      <div className="flex justify-end">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            notification.status === "confirmé"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
          }`}
        >
          {notification.status}
        </span>
      </div>
    </div>
  );
}
