import React, { useEffect, useRef } from "react";

export default function VideoCall({ roomName, displayName, onLeave }) {
  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);

  const loadJitsiScript = () => {
    return new Promise((resolve, reject) => {
      if (window.JitsiMeetExternalAPI) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject("❌ Impossible de charger l’API Jitsi");
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    if (apiRef.current) return;

    const startJitsi = async () => {
      try {
        await loadJitsiScript();
        const domain = "meet.jit.si";
        const options = {
          roomName,
          parentNode: jitsiContainerRef.current,
          width: "100%",
          height: 500,
          userInfo: { displayName: displayName || "Utilisateur" },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        apiRef.current = api;

        api.addEventListener("readyToClose", () => {
          api.dispose();
          apiRef.current = null;
          if (typeof onLeave === "function") onLeave();
        });
      } catch (err) {
        console.error("Erreur Jitsi:", err);
      }
    };

    startJitsi();

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
        apiRef.current = null;
      }
    };
  }, [roomName, displayName, onLeave]);

  return (
    <div className="mt-4 flex flex-col items-center">
      <div
        ref={jitsiContainerRef}
        style={{ borderRadius: "12px", overflow: "hidden" }}
        className="w-full"
      ></div>

      <button
        onClick={() => {
          if (apiRef.current) {
            apiRef.current.executeCommand("hangup");
            apiRef.current.dispose();
            apiRef.current = null;
          }
          if (typeof onLeave === "function") onLeave();
        }}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
      >
        🚪 Quitter l’entretien
      </button>
    </div>
  );
}
