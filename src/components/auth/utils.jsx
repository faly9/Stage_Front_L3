import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    // Vérification côté backend si l'user est connecté
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8001/auth/check/", {
        credentials: "include",
        });
        setIsAuthenticated(res.ok); // si backend renvoie 200 => connecté
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // En attente de la réponse du backend
  if (isAuthenticated === null) {
    return <p>Chargement...</p>; // tu peux mettre un spinner animé
  }

  // Si user est connecté => affiche le contenu
  // Sinon redirection vers /login
  return isAuthenticated ? children : <Navigate to="/" />;
}