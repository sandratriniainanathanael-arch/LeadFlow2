export default function AdminPage() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-red-100 max-w-4xl mx-auto my-12">
      <h1 className="text-3xl font-bold text-red-600 mb-2">Panneau d'Administration</h1>
      <p className="text-gray-500 text-sm mb-6">Gestion globale du SaaS LeadFlow.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded border">
          <div className="text-xs text-gray-500 font-semibold uppercase">Total Utilisateurs</div>
          <div className="text-2xl font-black text-gray-900 mt-1">1 — Mode Test</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="text-xs text-gray-500 font-semibold uppercase">Total Leads Scrapés</div>
          <div className="text-2xl font-black text-gray-900 mt-1">0</div>
        </div>
        <div className="bg-gray-50 p-4 rounded border">
          <div className="text-xs text-gray-500 font-semibold uppercase">Statut Système</div>
          <div className="text-2xl font-black text-green-600 mt-1">Opérationnel</div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded border text-sm text-gray-700">
        Le panneau de contrôle complet et les statistiques de scraping en temps réel seront synchronisés dès l'activation finale de la base de données.
      </div>
    </div>
  );
}
