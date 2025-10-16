export default function EntrepriseNotifications({ entretienNotifications }) {
  const notificationsAvecDate = entretienNotifications.filter(
    (notif) => notif.date_entretien
  );

  return (
    <div className="p-6 bg-[var(--card-bg)] max-w-4xl mx-auto rounded-2xl shadow-xl border border-[var(--border)] transition-all duration-300">
      {/* Header */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] mb-6 flex items-center justify-center gap-2">
        <svg
          className="w-7 h-7 text-[var(--icon-primary)]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        Notifications d’entretien ({notificationsAvecDate.length})
      </h2>

      {/* Si aucune notification */}
      {notificationsAvecDate.length === 0 ? (
        <p className="text-[var(--text-secondary)] italic text-center py-8">
          Aucune notification d'entretien avec date définie.
        </p>
      ) : (
        <ul className="space-y-6">
          {notificationsAvecDate.map((notif) => {
            const dateLocale = new Date(notif.date_entretien).toLocaleString(
              "fr-FR",
              {
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hour12: false,
              }
            );

            return (
              <li
                key={notif.id_candidature}
                className="p-5 border-l-4 border-[var(--accent)] rounded-2xl shadow-md 
                           bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]
                           hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out"
              >
                {/* Titre de la mission */}
                <p className="text-lg font-semibold text-[var(--text-primary)] mb-2 truncate">
                  {notif.mission_titre}
                </p>

                {/* Date entretien */}
                <p className="text-sm text-[var(--text-secondary)] mb-2 flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-[var(--accent-strong)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="font-medium text-[var(--text-primary)]">
                    Date entretien :
                  </span>
                  <span className="ml-1 font-semibold text-[var(--accent-strong)]">
                    {dateLocale} (heure locale)
                  </span>
                </p>

                {/* Nom du freelance */}
                <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                  <svg
                    className="w-4 h-4 text-[var(--icon-secondary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  Freelance :
                  <span className="ml-1 font-medium text-[var(--text-primary)]">
                    {notif.freelance_nom}
                  </span>
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
