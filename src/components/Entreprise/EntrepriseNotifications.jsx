import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function EntrepriseNotifications({ entretienNotifications }) {
  return (
    <div className="p-4 bg-gray-50 rounded-xl shadow-lg max-w-full mx-auto">
      {/* Header with improved styling */}
      <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-indigo-600"
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
        Notifications d’entretien ({entretienNotifications.length})
      </h2>

      {/* Conditional rendering for no notifications */}
      {entretienNotifications.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">
          Aucune nouvelle notification d'entretien.
        </p>
      ) : (
        <ul className="space-y-4">
          {entretienNotifications.map((notif) => (
            <li
              key={notif.id_candidature}
              className="p-4 border-l-4 border-indigo-500 rounded-lg shadow-md bg-white hover:shadow-lg transition duration-200 ease-in-out"
            >
              {/* Mission Title */}
              <p className="text-lg font-semibold text-gray-800 mb-1 truncate">
                {notif.mission_titre}
              </p>

              {/* Interview Date */}
              <p className="text-sm text-gray-600 mb-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-red-500"
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
                Date entretien:{" "}
                <span
                  className={`ml-1 font-medium ${
                    notif.date_entretien ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {notif.date_entretien || "Non définie"}
                </span>
              </p>

              {/* Freelance Name */}
              <p className="text-sm text-gray-600 flex items-center">
                <svg
                  className="w-4 h-4 mr-2 text-indigo-500"
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
                Freelance:{" "}
                <span className="ml-1 font-medium text-gray-700">
                  {notif.freelance_nom}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
