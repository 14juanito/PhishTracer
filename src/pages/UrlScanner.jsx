import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { FiSearch, FiShield, FiClock } from 'react-icons/fi';

const UrlScanner = () => {
  const [url, setUrl] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/scan/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      setScanResult(data);
      setScanHistory(prev => [data, ...prev]);
    } catch (error) {
      console.error('Erreur lors du scan:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Scanner d'URL</h2>
          <form onSubmit={handleScan} className="space-y-4">
            <div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Entrez l'URL à scanner"
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              {isLoading ? 'Analyse en cours...' : 'Scanner'}
            </button>
          </form>
        </div>

        {scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 rounded-lg p-6 mb-8"
          >
            <h3 className="text-xl font-bold text-white mb-4">Résultat du scan</h3>
            <div className="space-y-2">
              <p className="text-gray-300">URL: {scanResult.url}</p>
              <p className="text-gray-300">Statut: {scanResult.isPhishing ? '⚠️ Phishing détecté' : '✅ Sécurisé'}</p>
              <p className="text-gray-300">Confiance: {scanResult.confidence}%</p>
            </div>
          </motion.div>
        )}

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Historique des scans</h3>
          <div className="space-y-4">
            {scanHistory.map((scan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-700 rounded-lg p-4"
              >
                <p className="text-gray-300">URL: {scan.url}</p>
                <p className="text-gray-300">Statut: {scan.isPhishing ? '⚠️ Phishing détecté' : '✅ Sécurisé'}</p>
                <p className="text-gray-300">Date: {new Date(scan.timestamp).toLocaleString()}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UrlScanner; 