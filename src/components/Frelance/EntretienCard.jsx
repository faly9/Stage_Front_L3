import React from "react";

export default function EntretienCard({ notification }) {
  if (!notification) 
    return <p className="text-gray-500">Aucune notification pour le moment.</p>;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition flex flex-col">
      <div className="flex items-center mb-3 gap-3">
        {notification.entreprise_photo ? (
          <img
            src={
              notification.entreprise_photo
                ? `http://localhost:8001${notification.entreprise_photo}`
                : `http://localhost:8001/media/${notification.entreprise_photo}`
            }
            alt={notification.entreprise_nom}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold">
            {notification.entreprise_nom?.[0] || "E"}
          </div>
        )}
        <h3 className="text-lg font-bold">{notification.entreprise_nom}</h3>
      </div>

      <p>A Mr/Md : {notification.freelance_nom}</p>
      <p className="text-sm text-gray-700 mb-1">📌 Mission : {notification.mission_titre}</p>
      <p className="text-sm text-gray-700 mb-1">📅 Date : {notification.date_entretien}</p>
      <p className="text-sm text-gray-700 mb-2">💬 {notification.commentaire}</p>

      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
        {notification.status}
      </span>
    </div>
  );
}
