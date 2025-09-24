// components/ButtonAdd.jsx
export default function ButtonAdd({ onClick, label = "Ajouter" }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-green-600 text-white font-medium shadow-md hover:bg-green-700 transition"
    >
      <span className="text-lg">+</span>
      {label}
    </button>
  );
}
