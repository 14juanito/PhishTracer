import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import UserStatus from '../components/UserStatus';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FiSearch, FiMail, FiAlertTriangle, FiLink, FiUpload, FiClock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [url, setUrl] = useState('');
  const [scanResults, setScanResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Veuillez vous connecter pour accéder au tableau de bord</h2>
      </div>
    );
  }

  const [stats] = React.useState({
    totalScans: 1250,
    maliciousDetected: 45,
    emailsAnalyzed: 850,
    activeThreats: 12
  });

  const features = [
    {
      title: 'Scanner d\'URL',
      description: 'Vérifiez la sécurité des liens suspects',
      icon: FiSearch,
      path: '/url-scanner'
    },
    {
      title: 'Analyse de Courriels',
      description: 'Détectez les tentatives de phishing dans vos emails',
      icon: FiMail,
      path: '/email-scanner'
    }
  ];

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Appel API pour scanner l'URL
      const response = await fetch('/api/scans/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setScanResults([data, ...scanResults]);
    } catch (error) {
      console.error('Erreur lors du scan:', error);
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith('.eml')) {
      alert('Veuillez sélectionner un fichier .eml');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('email', file);

    try {
      const response = await fetch('/api/scans/email', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setScanResults([data, ...scanResults]);
    } catch (error) {
      console.error('Erreur lors du scan:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      
      <Sidebar />
      

      <main className="lg:pl-64 pt-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <UserStatus user={currentUser} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Statistiques */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900">Scans effectués</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalScans}</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-green-900">URLs sécurisées</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.totalScans - stats.maliciousDetected}</p>
            </div>
            
            <div className="bg-red-50 rounded-lg p-6">
              <h3 className="text-lg font-medium text-red-900">URLs dangereuses</h3>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.maliciousDetected}</p>
            </div>
          </div>

          {/* Scanner d'URL */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Scanner une URL</h2>
            <form onSubmit={handleUrlSubmit} className="flex gap-4">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Entrez une URL à scanner"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <FiLink className="mr-2" />
                Scanner
              </button>
            </form>
          </div>

          {/* Scanner de fichier .eml */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Scanner un email</h2>
            <div className="flex items-center gap-4">
              <label className="flex-1">
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Télécharger un fichier .eml</span>
                        <input
                          type="file"
                          accept=".eml"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Historique des scans */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Historique des scans</h2>
            <div className="space-y-4">
              {scanResults.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 flex items-start space-x-4"
                >
                  <div className="flex-shrink-0">
                    {result.isSafe ? (
                      <FiCheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <FiAlertCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {result.type === 'url' ? 'Scan URL' : 'Scan Email'}
                      </h3>
                      <span className="text-sm text-gray-500">
                        <FiClock className="inline mr-1" />
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {result.type === 'url' ? result.url : result.emailSubject}
                    </p>
                    <p className="mt-2 text-sm text-gray-700">
                      {result.isSafe
                        ? 'Aucune menace détectée'
                        : 'Menace détectée : ' + result.threatDetails}
                    </p>
                  </div>
                </div>
              ))}
              {scanResults.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Aucun scan effectué
                </p>
              )}
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.path}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="ml-4 text-lg font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 