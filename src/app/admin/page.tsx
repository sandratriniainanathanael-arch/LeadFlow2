export default function AdminPage() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-4xl mx-auto my-12 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Panneau d'Administration</h1>
      <p className="text-gray-500 text-sm mb-6">Gestion globale du SaaS LeadFlow.</p>
      <div className="bg-gray-50 p-4 rounded border text-sm text-gray-700">
        Statistiques globales, volume total de scraping et statut système opérationnel.
      </div>
    </div>
  );
}
