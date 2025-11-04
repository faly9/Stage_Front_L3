const hostname = window.location.hostname;

export const API_URL =
  hostname === "localhost" || hostname === "127.0.0.1"  || hostname === "192.168.88.242"
    ? import.meta.env.VITE_API_URL  // navigateur
    : import.meta.env.VITE_API_DOCKER; // Docker interne

export const WEBSOCKET_API_URL =
  hostname === "localhost" || hostname === "127.0.0.1" || hostname === "192.168.88.242"
    ? import.meta.env.VITE_WS_URL
    : import.meta.env.VITE_WS_DOCKER;
