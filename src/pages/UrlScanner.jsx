import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiLink, FiShield, FiAlertTriangle, FiCheckCircle, FiClock, FiInfo } from 'react-icons/fi';
import axios from 'axios';

const UrlScanner = () => {
  const { currentUser } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Veuillez entrer une URL');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Première étape : lancer le scan
      const scanResponse = await axios.post('/api/scans/check', { url: url.trim() }, {
        withCredentials: true
      });

      const scanData = scanResponse.data;

      if (!scanData.success) {
        throw new Error(scanData.message || 'Erreur lors du lancement du scan');
      }

      // Deuxième étape : récupérer le statut du scan
      const statusResponse = await axios.post('/api/scans/status', { jobID: scanData.jobID }, {
        withCredentials: true
      });

      const statusData = statusResponse.data;

      if (statusData.success) {
        // Formater les résultats pour l'affichage
        const formattedResult = {
          url: url.trim(),
          isPhishing: statusData.data.disposition === 'phishing',
          confidence: statusData.data.confidence || 0,
          scanDate: new Date().toISOString(),
          brand: statusData.data.brand,
          categories: statusData.data.categories,
          insights: statusData.data.insights,
          status: statusData.data.status
        };
        setResult(formattedResult);
      } else {
        setError(statusData.message || 'Erreur lors de la récupération du statut');
      }
    } catch (error) {
      console.error('Erreur de scan:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.message) {
        setError(error.message);
      } else {
        setError('Erreur de connexion au serveur');
      }
    } finally {
      setLoading(false);
    }
  };

  const getVerdictColor = (isPhishing) => {
    return isPhishing ? 'text-red-600' : 'text-green-600';
  };

  const getVerdictBg = (isPhishing) => {
    return isPhishing ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  };

  const getVerdictIcon = (isPhishing) => {
    return isPhishing ? <FiAlertTriangle className="w-6 h-6" /> : <FiCheckCircle className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Scanner d'URL</h1>
            <p className="text-gray-600 mt-1">Analysez une URL pour détecter les menaces de phishing</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scanner Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
              className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <FiLink className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analyse d'URL</h2>
            <p className="text-gray-600">Entrez l'URL que vous souhaitez analyser</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                URL à analyser
              </label>
              <div className="relative">
              <input
                type="url"
                  id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiLink className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Analyse en cours...
                </div>
              ) : (
                'Analyser l\'URL'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className={`px-6 py-4 ${getVerdictBg(result.isPhishing)}`}>
              <div className="flex items-center">
                <div className={`${getVerdictColor(result.isPhishing)}`}>{getVerdictIcon(result.isPhishing)}</div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold text-gray-900">Résultat de l'analyse</h3>
                  <p className={`text-sm font-medium ${getVerdictColor(result.isPhishing)}`}>{result.isPhishing ? 'URL malveillante détectée' : 'URL non détectée comme phishing'}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* URL Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Détails de l'URL</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">URL analysée</label>
                      <p className="text-sm text-gray-900 break-all">{result.url}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Risque de phishing</label>
                      <div className="flex items-center">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${
                              result.suspicionPercent >= 70 ? 'bg-red-500' : result.suspicionPercent >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${result.suspicionPercent || 0}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{result.suspicionPercent || 0}%</span>
                      </div>
                      <div className="text-xs mt-1">
                        {result.suspicionPercent >= 70 && "Risque élevé de phishing"}
                        {result.suspicionPercent >= 40 && result.suspicionPercent < 70 && "Risque modéré"}
                        {result.suspicionPercent < 40 && "Risque faible"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Raisons</label>
                      <ul className="list-disc ml-5 text-sm text-gray-700">
                        {(result.reason || []).map((r, i) => <li key={i}>{r}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Scan Information */}
                <div>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Informations du scan</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <FiClock className="w-4 h-4 text-gray-400 mr-2" />
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Date du scan</label>
                        <p className="text-sm text-gray-900">{new Date(result.scanDate || Date.now()).toLocaleString('fr-FR')}</p>
                      </div>
                    </div>
                    {result.googleSafeBrowsing && (
                      <div className="flex items-start">
                        <FiShield className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                        <div>
                          <label className="block text-xs font-medium text-gray-500">Google Safe Browsing</label>
                          <p className="text-sm text-gray-900">{result.googleSafeBrowsing.isUnsafe ? 'Menace détectée' : 'Aucune menace détectée'}</p>
                          {result.googleSafeBrowsing.threats && result.googleSafeBrowsing.threats.length > 0 && (
                            <ul className="list-disc ml-5 text-xs text-red-700">
                              {result.googleSafeBrowsing.threats.map((t, i) => <li key={i}>{t.threatType} ({t.platformType})</li>)}
                            </ul>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Recommandations</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  {result.isPhishing ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700"><strong>⚠️ Attention :</strong> Cette URL a été identifiée comme malveillante.</p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• Ne saisissez pas vos informations personnelles</li>
                        <li>• Ne téléchargez aucun fichier depuis ce lien</li>
                        <li>• Signalez cette URL à votre équipe IT</li>
                        <li>• Vérifiez l'orthographe de l'URL</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-700"><strong>✅ Sécurisé :</strong> Cette URL semble sûre.</p>
                      <ul className="text-sm text-gray-600 space-y-1 ml-4">
                        <li>• L'URL ne présente pas de signes de phishing</li>
                        <li>• Vous pouvez procéder avec prudence</li>
                        <li>• Restez vigilant aux demandes d'informations sensibles</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tips */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6"
        >
          <div className="flex items-start">
            <FiInfo className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-2">Conseils de sécurité</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vérifiez toujours l'orthographe des URLs avant de cliquer</li>
                <li>• Méfiez-vous des URLs qui imitent des sites connus</li>
                <li>• Ne partagez jamais vos identifiants par email</li>
                <li>• Utilisez un gestionnaire de mots de passe sécurisé</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UrlScanner; 