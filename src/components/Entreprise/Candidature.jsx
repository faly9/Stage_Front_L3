import React, { useEffect, useState } from "react";

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
function formatDateForInput(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  const tzOffset = d.getTimezoneOffset() * 60000; // corriger fuseau horaire
  return new Date(d - tzOffset).toISOString().slice(0, 16);
}

export default function CandidatureList({candidatures , setCandidatures , drafts , setDrafts}) {
  // const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [candidatures , setCandidatures] = useState([])

  // 🔹 Charger toutes les candidatures au montage
  // useEffect(() => {
  //   fetch("http://localhost:8001/ptl/candidatures/", {
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error(`Erreur ${res.status}`);
  //       return res.json();
  //     })
  //     .then((data) => {
  //       const arrayData = Array.isArray(data) ? data : [];
  //       setCandidatures(arrayData);

  //       // Initialiser les drafts
  //       const initialDrafts = {};
  //       arrayData.forEach((c) => {
  //         initialDrafts[c.id_candidature] = {
  //           status: c.status || "attente",
  //           date_entretien: c.date_entretien || "",
  //           commentaire_entretien: c.commentaire_entretien || "",
  //         };
  //       });
  //       setDrafts(initialDrafts);
  //     })
  //     .catch((err) => setError(err.message))
  //     .finally(() => setLoading(false));
  // }, [setCandidatures]);

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
        if (!res.ok) throw new Error(`Erreur ${res.status} lors de la mise à jour`);
        return res.json();
      })
      .then(() => {
        alert("✅ Candidature mise à jour !");
      })
      .catch((err) => alert(err.message));
  };

  // 🔹 Rendu
  if (loading) return <p className="text-center">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;
  if (candidatures.length === 0)
    return <p className="text-center text-gray-500">Aucune candidature</p>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Candidatures à mes offres
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidatures.map((c) => {
          const draft = drafts[c.id_candidature] || {};
          return (
            <div
              key={c.id_candidature}
              className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition"
            >
              {/* Titre et date */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-blue-600">
                  {c.mission_titre || "Mission non renseignée"}
                </h2>
                <p className="text-gray-500 text-sm">{c.date}</p>
              </div>

              {/* Profil freelance */}
              <div className="flex items-center mt-3 mb-4">
                {c.freelance_photo ? (
                  <img
                    src={`http://localhost:8001/media/${c.freelance_photo}`}
                    alt={c.freelance_nom || "Freelance inconnu"}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-3" />
                )}
                <div>
                  <h3 className="text-lg font-semibold">
                    {c.freelance_nom || "Nom non renseigné"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {c.freelance_description || "Compétences non renseignées"}
                  </p>
                </div>
              </div>

              {/* Infos freelance */}
              <p className="mb-1">
                <span className="font-semibold">Compétences :</span>{" "}
                {c.freelance_competence || "Non renseignées"}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Contact :</span>{" "}
                {c.freelance_email || "Non renseigné"}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Expériences :</span>{" "}
                {c.freelance_experience || "Non renseignées"}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Diplômes :</span>{" "}
                {c.freelance_formation || "Non renseigné"}
              </p>
              <p className="mb-1">
                <span className="font-semibold">Certificats :</span>{" "}
                {c.freelance_certificat || "Non renseigné"}
              </p>
              <p className="mb-2">
                <span className="font-semibold">Tarif :</span>{" "}
                {c.freelance_tarif ? `${c.freelance_tarif} €/h` : "Non défini"}
              </p>

              {/* Statut */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Statut :
                </label>
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
                  className="w-full p-2 border rounded-lg mt-1"
                >
                  <option value="en_attente">En attente</option>
                  <option value="en_entretien">En entretien</option>
                </select>
              </div>

              {/* Date entretien */}
              <div className="mt-3">
                {draft.date_entretien && (
                  <p className="text-sm text-green-600 font-medium mb-1">
                    📅 Entretien prévu le :{" "}
                    {new Date(draft.date_entretien).toLocaleString()}
                  </p>
                )}
                <label className="block text-sm font-medium text-gray-700">
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
                  className="w-full p-2 border rounded-lg mt-1"
                />
              </div>

              {/* Commentaire */}
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700">
                  Commentaire :
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
                  className="w-full p-2 border rounded-lg mt-1"
                  rows="2"
                />
              </div>

              {/* Bouton Enregistrer */}
              <button
                onClick={() => handleUpdate(c.id_candidature)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Envoyer
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
