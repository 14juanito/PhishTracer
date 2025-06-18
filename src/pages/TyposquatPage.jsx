import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import TyposquatTable from '../components/TyposquatTable';
import { FiInfo } from 'react-icons/fi';

export default function TyposquatPage() {
  const [domain, setDomain] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implémenter la logique de génération de typosquat
    console.log('Analyse du domaine:', domain);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Topbar />

      <main className="lg:pl-64 pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">
              Détection de Typosquatting
            </h1>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
              <div className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="domain"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Entrez un domaine à analyser
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="exemple.com"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors hover:scale-105 transform"
                >
                  Générer Typosquat
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Résultats de l'analyse
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FiInfo className="w-4 h-4" />
                <span>Survolez les en-têtes pour plus d'informations</span>
              </div>
            </div>

            <TyposquatTable />
          </div>
        </div>
      </main>
    </div>
  );
} 