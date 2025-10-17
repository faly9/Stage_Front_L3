import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function VerifyEmail() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8001/auth/verify/${uid}/${token}/`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessage(data.message);
          // Redirection après 2 secondes
          toast.success("✅ Email vérifié avec succès ! Redirection...", { position: "top-center" });
          setTimeout(() => navigate("/"), 2000);
        } else {
          setMessage(data.message);
        }
      })
      .catch(err => setMessage("Erreur réseau : " + err.message));
  }, [uid, token, navigate]);

  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold">{message}</h1>
    </div>
  );
}
