import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import EntrepriseDashboard from "./components/Entreprise/EntrepriseDashboard";
import ProtectedRoute from "./components/auth/utils";

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
      </Routes>
    </BrowserRouter>
  );
}
