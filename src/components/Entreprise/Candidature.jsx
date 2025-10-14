import React, { useEffect, useState } from "react";
import StartCall from "./StartCall";
import { toast } from "react-toastify";

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

// ✅ Formatter la date pour un <input type="datetime-local" />
// Pour affichage lisible (notification, texte, etc.)

// Pour input datetime-local (champ du formulaire)
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
  // const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timezoneEntreprise, setTimezoneEntreprise] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone // fuseau local par défaut
  );

  useEffect(() => {
    fetch("http://localhost:8001/ptl/candidatures/", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const arrayData = Array.isArray(data) ? data : [];
        setCandidatures(arrayData);

        // Initialiser drafts seulement si vides
        if (Object.keys(drafts).length === 0) {
          const initialDrafts = {};
          arrayData.forEach((c) => {
            initialDrafts[c.id_candidature] = {
              status: c.status || "attente",
              date_entretien: c.date_entretien || "",
              commentaire_entretien: c.commentaire_entretien || "",
            };
          });
          setDrafts(initialDrafts);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [setCandidatures, setDrafts]);

  // 🔹 Update candidature
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

    fetch(`http://localhost:8001/ptl/candidatures/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify(updates),
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

  // 🔹 Rendu
  if (loading) return <p className="text-center">Chargement...</p>;
  if (error)
    return <p className="text-center text-red-500">Erreur : {error}</p>;
  if (candidatures.length === 0)
    return <p className="text-center text-gray-500">Aucune candidature</p>;

  return (
<div className="p-6 bg-gray-50 min-h-screen">
<h1 className="sticky top-0 z-50 text-3xl sm:text-4xl font-extrabold mb-8 text-center
               bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500
               drop-shadow-lg py-4">
  Candidatures à mes offres
</h1>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {candidatures.map((c) => {
      const draft = drafts[c.id_candidature] || {};

      let dateLocale = "";
      if (draft.date_entretien) {
        dateLocale = new Date(draft.date_entretien).toLocaleString("fr-FR", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          hour12: false,
        });
      }

      return (
        <div
          key={c.id_candidature}
          className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-transform transform hover:-translate-y-1 duration-300"
        >
          {/* Titre et date */}
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold text-purple-600">
              {c.mission_titre || "Mission non renseignée"}
            </h2>
            <p className="text-gray-400 text-sm">{c.date}</p>
          </div>

          {/* Profil freelance */}
          <div className="flex items-center mt-1 mb-4">
            {c.freelance_photo ? (
              <img
                src={`http://localhost:8001/media/${c.freelance_photo}`}
                alt={c.freelance_nom || "Freelance inconnu"}
                className="w-14 h-14 rounded-full mr-3 border-2 border-purple-200 object-cover"
              />
            ) : (
              <div className="w-14 h-14 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                <span className="text-gray-400 font-bold">?</span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold">{c.freelance_nom || "Nom non renseigné"}</h3>
              <p className="text-sm text-gray-500">{c.freelance_description || "Compétences non renseignées"}</p>
            </div>
          </div>

          {/* Infos freelance */}
          <div className="space-y-1 text-gray-700 text-sm mb-3">
            <p><span className="font-semibold">Compétences :</span> {c.freelance_competence || "Non renseignées"}</p>
            <p><span className="font-semibold">Contact :</span> {c.freelance_email || "Non renseigné"}</p>
            <p><span className="font-semibold">Expériences :</span> {c.freelance_experience || "Non renseignées"}</p>
            <p><span className="font-semibold">Diplômes :</span> {c.freelance_formation || "Non renseigné"}</p>
            <p><span className="font-semibold">Certificats :</span> {c.freelance_certificat || "Non renseigné"}</p>
            <p><span className="font-semibold">Tarif :</span> {c.freelance_tarif ? `${c.freelance_tarif} €/h` : "Non défini"}</p>
          </div>

          <p className="font-semibold mb-2">Réponse à une demande d’emploi :</p>

          {/* Statut */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut :</label>
            <select
              value={draft.status || "attente"}
              onChange={(e) =>
                setDrafts((prev) => ({
                  ...prev,
                  [c.id_candidature]: {
                    ...prev[c.id_candidature],
                    status: e.target.value,
                  },
                }))
              }
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 transition"
            >
              <option value="en_attente">En attente</option>
              <option value="en_entretien">En entretien</option>
            </select>
          </div>

          {/* Fuseau horaire entreprise */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Fuseau horaire de l’entreprise :</label>
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 transition"
            >
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Indian/Antananarivo">Indian/Antananarivo</option>
              <option value="America/New_York">America/New_York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>

          {/* Date entretien */}
          <div className="mb-3">
            {draft.date_entretien && (
              <p className="text-sm text-green-600 font-medium mb-1">
                📅 Entretien prévu le : {dateLocale} (heure locale)
              </p>
            )}
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Choisir une date d’entretien :
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          {/* Commentaire */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lien de la salle d'entretien :
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
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 transition"
              rows="2"
            />
          </div>

          {/* Boutons */}
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleUpdate(c.id_candidature)}
              className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition font-medium"
            >
              Envoyer votre réponse
            </button>
            <div className="w-full">
              <StartCall freelancerId={c.freelance} />
            </div>
          </div>
        </div>
      );
    })}
  </div>
</div>
  );
}
