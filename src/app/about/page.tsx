import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LeadFlow - Our Mission & Vision",
  description: "Learn why LeadFlow exists and how we verify every lead.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-black tracking-tight text-gray-950 sm:text-5xl mb-6">
        À propos de LeadFlow
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed mb-4">
        <strong>Pourquoi nous existons :</strong> Les bases de données B2B traditionnelles sont obsolètes, surévaluées et remplies de contacts invalides.
      </p>
      <p className="text-lg text-gray-600 leading-relaxed mb-4">
        <strong>Notre Mission :</strong> Démocratiser l'accès à la croissance en fournissant des données décisionnelles fraîches et vérifiées en temps réel.
      </p>
      <p className="text-lg text-gray-600 leading-relaxed">
        <strong>Notre Vision :</strong> Permettre aux équipes commerciales de passer 100% de leur temps à clore des contrats, sans jamais perdre de temps à gratter le web.
      </p>
    </div>
  );
}
