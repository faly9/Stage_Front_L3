import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { loadConfig } from "./config";

const root = createRoot(document.getElementById("root"));

// On charge la config avant de rendre l'app
loadConfig().then(() => {
  root.render(
    // <React.StrictMode>
      <App />
    // </React.StrictMode>
  );
});
