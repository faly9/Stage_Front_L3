import React, { useState } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";

export default function StartCall({ freelancerId, role = "Entreprise", existingRoom = null }) {
  const [roomName, setRoomName] = useState(existingRoom || "");
  const [start, setStart] = useState(!!existingRoom);

  const handleStartCall = () => {
    if (role === "Entreprise") {
      const uniqueRoom = `entreprise_call_${freelancerId}`;
      setRoomName(uniqueRoom);
      setStart(true);
    }
  };

  // ✅ Nouveau : bouton pour quitter et revenir à l'état initial
  const handleLeaveCall = () => {
    setStart(false);
    setRoomName("");
  };

  return (
    <div className="mt-2">
      {!start ? (
        role === "Entreprise" ? (
          <button
            onClick={handleStartCall}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            📞 Démarrer un appel
          </button>
        ) : (
          <p className="text-center text-gray-500">
            ⏳ En attente d’un appel de l’entreprise...
          </p>
        )
      ) : (
        <div className="mt-3">
          <h3 className="text-center text-gray-700 font-semibold mb-2">
            Salle : <span className="text-blue-600">{roomName}</span>
          </h3>

          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              disableDeepLinking: true,
              startWithAudioMuted: false,
              startWithVideoMuted: false,
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
            }}
            userInfo={{
              displayName: role,
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = "500px";
              iframeRef.style.width = "100%";
            }}
          />

          {/* ✅ Bouton Quitter ajouté ici */}
          <div className="text-center mt-4">
            <button
              onClick={handleLeaveCall}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              🚪 Quitter l’appel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
