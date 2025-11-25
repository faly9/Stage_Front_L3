import React, { useEffect, useState } from "react";
import StartCall from "./StartCall";
import { toast } from "react-toastify";
// import { API_URL } from "../../config";
import { getConfig } from "../../config";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function formatDateForInput(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
}

export default function CandidatureList({
  candidatures,
  setCandidatures,
  drafts,
  setDrafts,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState({});
  const [timezoneEntreprise, setTimezoneEntreprise] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const { API_URL , MEDIA_URL } = getConfig();


  useEffect(() => {
    fetch(`${API_URL}/ptl/candidatures/`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : [];
        setCandidatures(arrayData);

        if (Object.keys(drafts).length === 0) {
          const initialDrafts = {};
          arrayData.forEach((c) => {
            initialDrafts[c.id_candidature] = {
              status: c.status || "en_attente",
              date_entretien: c.date_entretien || "",
              commentaire_entretien: c.commentaire_entretien || "",
              timezone: c.timezone || timezoneEntreprise,
            };
          });
          setDrafts(initialDrafts);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setCandidatures, setDrafts, timezoneEntreprise]);

  const handleUpdate = (id) => {
    const updates = drafts[id];
    const csrftoken = getCookie("csrftoken");

    let dateUtc = "";
    if (updates.date_entretien) {
      const localDate = new Date(updates.date_entretien);
      const utcDate = new Date(
        localDate.toLocaleString("en-US", { timeZone: updates.timezone })
      );
      dateUtc = utcDate.toISOString();
    }

    const payload = {
      ...updates,
      date_entretien: dateUtc,
      timezone: updates.timezone,
    };

    fetch(`${API_URL}/ptl/candidatures/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(payload),
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok)
          throw new Error(`Erreur ${res.status} lors de la mise à jour`);
        return res.json();
      })
      .then(() => {
        toast.success("✅ Message envoyé !");
      })
      .catch((err) => alert(err.message));
  };

  const toggleDetails = (id) => {
    setShowDetails((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading)
    return (
      <p className="text-center text-[var(--text-secondary)]">Chargement...</p>
    );
    
  if (candidatures.length === 0)
    return (
      <p className="text-center text-[var(--text-secondary)]">
        Aucune candidature
      </p>
    );

  return (
    <div className="p-6 bg-[var(--gradient-from)] min-h-screen transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidatures.map((c) => {
          const draft = drafts[c.id_candidature] || {};
          const dateLocale = draft.date_entretien
            ? new Date(draft.date_entretien).toLocaleString("fr-FR", {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour12: false,
              })
            : "";

          return (
            <div
              key={c.id_candidature}
              className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl shadow-lg p-5 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
            >
              {/* --- En-tête --- */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-[var(--accent)]">
                  {c.mission_titre || "Mission non renseignée"}
                </h2>
                <button
                  onClick={() => toggleDetails(c.id_candidature)}
                  className="text-sm font-semibold text-[var(--accent)] hover:underline"
                >
                  {showDetails[c.id_candidature]
                    ? "Masquer les détails"
                    : "Afficher les détails"}
                </button>
              </div>

              {/* --- Profil freelance --- */}
              <div className="flex items-center mt-1 mb-4">
                {c.freelance_photo ? (
                  <img
                    src={`${MEDIA_URL}/${c.freelance_photo}`}
                    alt={c.freelance_nom || "Freelance inconnu"}
                    className="w-14 h-14 rounded-full mr-3 border-2 border-[var(--accent-light)] object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 bg-[var(--gradient-via)] rounded-full mr-3 flex items-center justify-center">
                    <span className="text-[var(--text-secondary)] font-bold">
                      ?
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {c.freelance_nom || "Nom non renseigné"}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] italic">
                    {c.freelance_description || "Compétences non renseignées"}
                  </p>
                </div>
              </div>

              {/* --- Détails freelance --- */}
              {showDetails[c.id_candidature] && (
                <div className="space-y-2 text-[var(--text-secondary)] text-sm mb-4">
                  <p>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Compétences :
                    </span>{" "}
                    {c.freelance_competence || "Non renseignées"}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Contact :
                    </span>{" "}
                    {c.freelance_email || "Non renseigné"}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Expériences :
                    </span>{" "}
                    {c.freelance_experience || "Non renseignées"}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Diplômes :
                    </span>{" "}
                    {c.freelance_formation || "Non renseigné"}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Certificats :
                    </span>{" "}
                    {c.freelance_certificat || "Non renseigné"}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--text-primary)]">
                      Tarif :
                    </span>{" "}
                    {c.freelance_tarif
                      ? `${c.freelance_tarif} €/h`
                      : "Non défini"}
                  </p>

                  {/* --- Statut --- */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Statut :
                    </label>
                    <select
                      value={draft.status || "en_attente"}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id_candidature]: {
                            ...prev[c.id_candidature],
                            status: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] transition"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="en_entretien">En entretien</option>
                    </select>
                  </div>

                  {/* --- Fuseau horaire --- */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Fuseau horaire :
                    </label>
                    <select
                      value={draft.timezone || timezoneEntreprise}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id_candidature]: {
                            ...prev[c.id_candidature],
                            timezone: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] transition"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Indian/Antananarivo">
                        Indian/Antananarivo
                      </option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Asia/Tokyo">Asia/Tokyo</option>
                    </select>
                  </div>

                  {/* --- Date entretien --- */}
                  <div>
                    {draft.date_entretien && (
                      <p className="text-sm text-[var(--accent-strong)] font-medium mb-1">
                        📅 Entretien prévu le : {dateLocale}
                      </p>
                    )}
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Choisir l'heure et la date d’entretien :
                    </label>
                    <input
                      type="datetime-local"
                      value={formatDateForInput(draft.date_entretien)}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id_candidature]: {
                            ...prev[c.id_candidature],
                            date_entretien: e.target.value,
                          },
                        }))
                      }
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] transition"
                    />
                  </div>

                  {/* --- Commentaire / Lien entretien --- */}
                  <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">
                      Lien ou commentaire pour Faly :
                    </label>
                    <textarea
                      value={draft.commentaire_entretien || ""}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [c.id_candidature]: {
                            ...prev[c.id_candidature],
                            commentaire_entretien: e.target.value,
                          },
                        }))
                      }
                      rows="2"
                      className="w-full p-2 border border-[var(--border)] rounded-lg bg-[var(--card-bg)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--accent)] transition"
                    />
                  </div>
                </div>
              )}

              {/* --- Boutons d’action --- */}
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleUpdate(c.id_candidature)}
                  className="w-full bg-[var(--accent)] text-[var(--text-on-accent)] py-2 rounded-xl hover:bg-[var(--accent-strong)] transition font-medium"
                >
                  Envoyer votre réponse
                </button>
                <StartCall freelancerId={c.freelance} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
