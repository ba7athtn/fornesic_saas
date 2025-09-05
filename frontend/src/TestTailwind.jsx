import React from 'react';

function TestTailwind() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header de test Tailwind + Ba7ath */}
        <div className="bg-gradient-to-r from-ba7ath-primary to-ba7ath-secondary text-white rounded-2xl p-8 mb-8 animate-fade-in">
          <div className="flex items-center space-x-4">
            <div className="text-5xl">🔍</div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Ba7ath Forensic Analysis
              </h1>
              <p className="text-xl opacity-90">
                ✨ Tailwind CSS + Thème Ba7ath activé avec succès !
              </p>
            </div>
          </div>
        </div>

        {/* Test des cartes forensiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-forensic">
            <div className="text-3xl mb-3">📤</div>
            <h3 className="text-ba7ath-primary font-bold text-lg mb-2">Upload Zone</h3>
            <p className="text-gray-600 text-sm">Zone d'upload modernisée avec animations Tailwind</p>
          </div>
          
          <div className="card-forensic">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-ba7ath-primary font-bold text-lg mb-2">Analyses</h3>
            <p className="text-gray-600 text-sm">Analyses forensiques IA avec interface moderne</p>
          </div>
          
          <div className="card-forensic">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-ba7ath-primary font-bold text-lg mb-2">Résultats</h3>
            <p className="text-gray-600 text-sm">Dashboard premium avec scores en temps réel</p>
          </div>
        </div>

        {/* Test des boutons Ba7ath */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="btn-ba7ath-primary">
            🚀 Analyser une image
          </button>
          <button className="btn-ba7ath-secondary">
            💎 Voir la galerie
          </button>
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all hover:-translate-y-1">
            ✨ Style Premium
          </button>
        </div>

        {/* Test des badges de statut */}
        <div className="flex flex-wrap gap-3 mb-8">
          <span className="badge-success">✅ Image authentique</span>
          <span className="badge-warning">⏳ Analyse en cours</span>
          <span className="badge-danger">⚠️ Manipulation détectée</span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
            🤖 IA Générée
          </span>
        </div>

        {/* Zone d'upload stylisée avec Tailwind */}
        <div className="border-3 border-dashed border-ba7ath-accent bg-gradient-to-br from-white to-blue-50 rounded-2xl p-12 text-center hover:shadow-glow transition-all duration-300 hover:-translate-y-2 group">
          <div className="text-6xl mb-4 group-hover:animate-bounce">📤</div>
          <h3 className="text-2xl font-bold text-ba7ath-primary mb-4">
            Zone d'Upload Tailwind CSS
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Interface modernisée avec animations fluides et design responsive
          </p>
          <button className="btn-ba7ath-primary group-hover:shadow-glow-lg">
            Choisir un fichier
          </button>
        </div>

        {/* Message de validation */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-lg">
            <span className="text-xl mr-2">✅</span>
            <span className="font-medium">Tailwind CSS configuré et fonctionnel pour Ba7ath!</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestTailwind;
