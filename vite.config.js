import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    host: true, // permet les connexions depuis l'extérieur
    port: 5173,
    allowedHosts: ["*"],
  },
   test: {
    globals: true,       // utiliser describe, it, expect globalement
    environment: 'jsdom', // simule le DOM
    setupFiles: './src/setupTests.js', // si nécessaire
  },
});
