// components/ButtonAdd.jsx
import { Plus } from "lucide-react"; // Icône moderne

export default function ButtonAdd({ onClick, label = "Ajouter" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-2 px-5 py-2.5 
                 rounded-xl font-semibold text-[var(--text-on-accent)] 
                 bg-[var(--bouton-ajouter)] hover:bg-[var(--accent-strong)] 
                 shadow-md hover:shadow-lg transition-all duration-300 
                 transform hover:-translate-y-0.5 active:scale-95"
    >
      <Plus className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );
}
