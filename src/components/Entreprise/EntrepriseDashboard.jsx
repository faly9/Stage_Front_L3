import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import CardMission from "./Card_mission";
import { Edit } from "lucide-react"; // icône modifier


// Utility function to get CSRF token from a cookie
const getCookie = (name) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    // console.log("cookie",cookies)
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export default function EntrepriseDashboard() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [errors, setErrors] = useState({})
  const [section, setSection] = useState("dashboard");

  const [user, setUser] = useState({
    id: null,
    nom: "",
    secteur: "",
    profile_image: "",
    profile_imageFile: null,
  });

  const [userinfo , setUserinfo] = useState({
    email : "",
    role : ""
  })
  const [csrftoken, setCsrfToken] = useState(null);
  
  useEffect(() => {
    // Get the CSRF token when the component mounts
    setCsrfToken(getCookie('csrftoken'));
    fetchUserProfile();
    user_info()
  }, []); // Empty dependency array means this runs once on mount

const user_info = async () => {
  try {
    // Récupérer les infos auth
    const infoRes = await fetch("http://localhost:8001/auth/info/", {
      method: "GET",
      credentials: "include",
    });

    if (!infoRes.ok) throw new Error("Erreur lors du fetch auth/info");

    const info = await infoRes.json();

    setUserinfo({
      email: info.email,
      role: info.role,
    });

    console.log("Infos utilisateur :", info);
  }
  catch (err){
    console.error("failed to fetch user info" , err)
  }
}

const fetchUserProfile = async () => {
  try {

    const res = await fetch("http://localhost:8001/etr/entreprises/me/", {
      method: "GET",
      credentials: "include",
    });
// console.log("resultat" , res)
    if (!res.ok) throw new Error("Erreur lors du fetch");

    const entreprise = await res.json();
    console.log("Entreprise connectée :", entreprise);

    setUser({
      id: entreprise.id_entreprise,
      nom: entreprise.nom,
      secteur: entreprise.secteur,
      profile_image: entreprise.profile_image || "",
      profile_imageFile: null,
    });
  
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
  }
};


  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUser({
        ...user,
        profile_imageFile: file,
        profile_image: URL.createObjectURL(file),
      });
    }
  };

const handleSave = async () => {
  const newErrors = {}

  // Validation nom
  if (!user.nom.trim()) {
    newErrors.nom = "Le nom est obligatoire";
  } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(user.nom)) {
    newErrors.nom = "Le nom ne doit contenir que des lettres";
  }

  
 // Validation secteur
  if (!user.secteur.trim()) {
    newErrors.secteur = "Le secteur est obligatoire";
  } else if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(user.secteur)) {
    newErrors.secteur = "Le secteur ne doit contenir que des lettres";
  }

  setErrors(newErrors);

   // S’il y a des erreurs, on arrête
  if (Object.keys(newErrors).length > 0) {
    return;
  }

  if (!csrftoken) {
    console.error("CSRF token is missing. Cannot save profile.");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("nom", user.nom);
    formData.append("secteur", user.secteur);
    if (user.profile_imageFile) {
      formData.append("profile_image", user.profile_imageFile);
    }

    const res = await fetch("http://localhost:8001/etr/entreprises/me/", {
      method: "POST",  // toujours POST
      credentials: "include",
      headers: { "X-CSRFToken": csrftoken },
      body: formData,
    });

    if (!res.ok) throw new Error("Erreur lors de la sauvegarde");

    const data = await res.json();
    console.log("Profil sauvegardé :", data);

    setUser({
      ...user,
      id: data.id_entreprise,
      nom: data.nom,
      secteur: data.secteur,
      profile_image: data.profile_image || "",
      profile_imageFile: null,
    });

    setIsProfileOpen(false);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="flex h-screen bg-gray-100">
    <Navbar onSectionChange={setSection} section={section}  />

      <div className="flex-1 flex flex-col">
     <header className="flex justify-between items-center bg-white shadow p-4">
  <h1 className="text-2xl font-bold">Tableau de bord</h1>
  <div className="flex items-center gap-4">
    <p>{user.nom || <span>User</span>}</p>

    {user.profile_image ? (
      <img
        src={user.profile_image}
        alt="Profil"
        className="w-10 h-10 rounded-full border cursor-pointer object-cover"
        onClick={toggleProfile}
      />
    ) : (
      <div
        className="w-10 h-10 rounded-full border flex items-center justify-center cursor-pointer bg-gray-100"
        onClick={toggleProfile}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    )}
  </div>
</header>

 <main className="flex-1 p-6 overflow-y-auto">
          {section === "dashboard" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Missions publiées</h1>
            {/* ➝ Ici tu charges tes missions */}
          </div>
        )}
        {section === "ia" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Propositions IA</h1>
            {/* ➝ Ici tu affiches les freelances proposés */}
          </div>
        )}
          {section === "Candidat" && (
          <div>
            <h1 className="text-2xl font-bold mb-4">Tous les candidats qui postulent pour votre offre.</h1>
            {/* ➝ Ici tu affiches les freelances proposés */}
          </div>
        )}

      </main>
    </div>        

      {isProfileOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          <div className="bg-white rounded-2xl p-6 w-96 relative z-10">
            <h2 className="text-xl font-bold mb-4">Éditer Profil</h2>

            <div className="flex flex-col gap-3">
<div className="flex items-center justify-center gap-4">
  <div className="relative">
    {/* Input caché */}
    <input
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
      id="profileUpload"
    />

    {/* Image ou icône par défaut */}
    <label htmlFor="profileUpload" className="cursor-pointer">
      {user.profile_image ? (
        <img
          src={user.profile_image}
          alt="Aperçu Profil"
          className="w-24 h-24 rounded-full object-cover"
        />
      ) : (
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
          {/* Icône de profil par défaut */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </div>
      )}
    </label>

    {/* Bouton modifier (crayon) en overlay */}
    <label
      htmlFor="profileUpload"
      className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer"
    >
      <Edit className="w-4 h-4 text-gray-600" />
    </label>
  </div>
</div>
              <label>
                Role :
                <input
                  type="text"
                  name="role"
                  value={userinfo.role}
                  readOnly
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </label>
              <label>
                Nom :
                <input
                  type="text"
                  name="nom"
                  value={user.nom}
                  required
                  placeholder="Nom de l'entreprise"
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                 {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
              </label>
              <label>
                Secteur :
                <input
                  type="text"
                  name="secteur"
                  placeholder="Votre secteur"
                  value={user.secteur}
                  required
                  onChange={handleChange}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
                {errors.secteur && <p className="text-red-500 text-sm">{errors.secteur}</p>}
              </label>
              <label>
                Email :
                <input
                  type="email"
                  name="email"
                  readOnly
                  value={userinfo.email}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </label>
              
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                onClick={toggleProfile}
              >
                Annuler
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                onClick={handleSave}
              >
                Sauvegarder
              </button>
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
              onClick={toggleProfile}
            >
              ✕
            </button>

          </div>
        </div>
      )}
    </div>
  );
}