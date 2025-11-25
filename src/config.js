// config.js
let config = {
  API_URL: "",
  WEBSOCKET_API_URL: "",
  MEDIA_URL: ""
};

// Charger la configuration depuis config.json
export const loadConfig = async () => {
  try {
    const response = await fetch("/config.json", { cache: "no-store" });
    if (!response.ok) throw new Error("Fichier config.json introuvable");
    const data = await response.json();
    config = data;
    console.log("✅ Configuration chargée :", config);
  } catch (err) {
    console.error("❌ Erreur de chargement du fichier config.json :", err);
  }
};

// Accéder à la config depuis n’importe où
export const getConfig = () => config;
