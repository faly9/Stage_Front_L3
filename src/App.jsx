import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import EntrepriseDashboard from "./components/Entreprise/EntrepriseDashboard";
import FreelanceDashboard from "./components/Frelance/FreelanceDashbord";
import ProtectedRoute from "./components/auth/utils";
import VerifyEmail from "./components/auth/VerifyEmail"; // ✅ Ajout ici
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VerifyNotice from "./components/auth/VerifyNotice";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentification */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-notice" element={<VerifyNotice />} />

        {/* ✅ Vérification d’email */}
        <Route path="/verify/:uid/:token" element={<VerifyEmail />} />

        {/* Dashboards protégés */}
        <Route
          path="/dashboard-entreprise"
          element={
            <ProtectedRoute>
              <EntrepriseDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard-freelance"
          element={
            <ProtectedRoute>
              <FreelanceDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* ✅ Toast notifications */}
      <ToastContainer position="top-center" autoClose={1500} />
    </BrowserRouter>
  );
}
