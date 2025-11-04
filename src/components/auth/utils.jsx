import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { API_URL } from "../../config";
import { getConfig } from "../../config";

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const { API_URL } = getConfig();

  useEffect(() => {
    // Vérification côté backend si l'user est connecté
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/check/`, {
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
