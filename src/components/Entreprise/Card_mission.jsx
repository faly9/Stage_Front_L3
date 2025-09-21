
export default function CardMission() {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h3 className="text-xl font-bold mb-2">Titre de la mission</h3>
      <p className="text-gray-600 mb-4">
        Description rapide de la mission à afficher ici.
      </p>
      <div className="flex gap-2">
        <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition">
          Postuler
        </button>
        <button className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
          Détails
        </button>
      </div>
    </div>
  );
}