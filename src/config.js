const hostname = window.location.hostname;

export const API_URL =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "freelance.local"
    ? import.meta.env.VITE_API_URL // pour environnement externe (navigateur)
    : import.meta.env.VITE_API_DOCKER; // pour Docker interne

export const WEBSOCKET_API_URL =
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "freelance.local"
    ? import.meta.env.VITE_WS_URL
    : import.meta.env.VITE_WS_DOCKER;
