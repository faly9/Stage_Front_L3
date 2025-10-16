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
<div
  className="flex justify-center items-center mb-4"
  style={{ background: "var(--gradient-from)" }} // Fond basé sur le thème
>
  <div
    className="shadow-lg border rounded-2xl p-6 w-full max-w-md"
    style={{
      background: "var(--card-bg)",
      borderColor: "var(--border)",
      color: "var(--text-primary)",
    }}
  >
    <h2 style={{ color: "var(--accent)" }} className="text-xl font-semibold text-center mb-4">
      🎥 Rejoindre la salle d’entretien
    </h2>

    <p
      style={{ background: "var(--red-bot)", color: "var(--text-secondary)", borderColor: "var(--accent-light)" }}
      className="text-sm md:text-base font-medium border-l-4 p-3 rounded-lg shadow-sm mb-6"
    >
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
          style={{
            background: "var(--card-bg)",
            color: "var(--text-primary)",
            borderColor: "var(--border)",
          }}
          className="focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 p-2 border-3 rounded-lg w-64"
        />
        <button
          onClick={handleJoin}
          style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
          className="px-4 py-2 rounded-xl hover:opacity-90 transition duration-300"
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
