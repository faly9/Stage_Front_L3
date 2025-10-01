import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import EntrepriseDashboard from "./components/Entreprise/EntrepriseDashboard";
import FreelanceDashboard from "./components/Frelance/FreelanceDashbord";
import ProtectedRoute from "./components/auth/utils";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard protégé */}
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
      <ToastContainer position="top-center" autoClose={1000} />
    </BrowserRouter>
  );
}
