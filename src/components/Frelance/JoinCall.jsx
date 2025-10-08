import React, { useState } from "react";
import VideoCall from "../Video/VideoCall";

export default function JoinCall() {
  const [roomName, setRoomName] = useState("");
  const [joined, setJoined] = useState(false);

  const handleJoin = () => {
    if (roomName.trim()) setJoined(true);
  };

  const handleLeave = () => {
    setJoined(false); // 🔁 Retour à l’écran d’accueil
    setRoomName(""); // 🔄 Réinitialise le champ
  };

  return (
    <div className="flex justify-center items-center mb-4 bg-gray-50">
      <div className="bg-white shadow-lg border border-gray-200 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
          🎥 Rejoindre la salle d’entretien
        </h2>

        <p className="text-gray-700 text-sm md:text-base font-medium bg-green-50 border-l-4 border-green-500 p-3 rounded-lg shadow-sm mb-6">
          Tapez ici le nom de la salle que l'entreprise vous envoie plus tard à
          la date et l'heure de l'entretien
        </p>

        {!joined ? (
          <div className="flex flex-col items-center gap-3">
            <input
              type="text"
              placeholder="Entrez le nom de la salle"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="border border-gray-300 focus:border-green-600 focus:ring focus:ring-green-200 outline-none p-2 rounded-lg w-64"
            />
            <button
              onClick={handleJoin}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition duration-300"
            >
              🔗 Rejoindre
            </button>
          </div>
        ) : (
          <VideoCall
            roomName={roomName}
            displayName="Freelance"
            onLeave={handleLeave}
          />
        )}
      </div>
    </div>
  );
}
