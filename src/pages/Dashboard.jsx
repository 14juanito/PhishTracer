import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiSearch, 
  FiMail, 
  FiAlertTriangle, 
  FiLink, 
  FiUpload, 
  FiClock, 
  FiAlertCircle, 
  FiCheckCircle,
  FiShield,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
  FiActivity
} from 'react-icons/fi';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [url, setUrl] = useState('');
  const [scanResults, setScanResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simuler des données de scan récentes
    setScanResults([
      {
        id: 1,
        type: 'url',
        url: 'https://example.com/suspicious-link',
        isSafe: false,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        threatDetails: 'Site de phishing détecté'
      },
      {
        id: 2,
        type: 'email',
        emailSubject: 'Urgent: Vérifiez votre compte',
        isSafe: true,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        threatDetails: 'Email légitime'
      },
      {
        id: 3,
        type: 'url',
        url: 'https://secure-bank.com/login',
        isSafe: true,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        threatDetails: 'Site sécurisé'
      }
    ]);
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Veuillez vous connecter pour accéder au tableau de bord</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-700">Se connecter</Link>
        </div>
      </div>
    );
  }

  const stats = {
    totalScans: 1250,
    maliciousDetected: 45,
    emailsAnalyzed: 850,
    activeThreats: 12,
    safePercentage: ((1250 - 45) / 1250 * 100).toFixed(1)
  };

  const quickActions = [
    {
      title: 'Scanner URL',
      description: 'Vérifiez la sécurité des liens',
      icon: FiLink,
      path: '/url-scanner',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Scanner Email',
      description: 'Analysez vos emails suspects',
      icon: FiMail,
      path: '/email-scanner',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Historique',
      description: 'Consultez vos scans récents',
      icon: FiBarChart2,
      path: '/scan-history',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Paramètres',
      description: 'Configurez vos préférences',
      icon: FiSettings,
      path: '/settings',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Simulation d'un scan
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newResult = {
        id: Date.now(),
        type: 'url',
        url: url,
        isSafe: Math.random() > 0.3,
        timestamp: new Date(),
        threatDetails: Math.random() > 0.3 ? 'Site sécurisé' : 'Menace détectée'
      };
      setScanResults([newResult, ...scanResults]);
      setUrl('');
    } catch (error) {
      console.error('Erreur lors du scan:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header avec padding pour le header fixe */}
      <div className="pt-16"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête du dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
              <p className="text-gray-600 mt-1">Bienvenue, {currentUser.name}</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentUser.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-medium text-gray-900">{currentUser.name}</div>
                <div className="text-gray-500">{currentUser.email}</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Statistiques principales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <FiActivity className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Scans</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalScans}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+12% ce mois</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FiShield className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Sécurisé</p>
                <p className="text-2xl font-bold text-gray-900">{stats.safePercentage}%</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+5% ce mois</span>
            </div>
            </div>
            
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <FiAlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menaces</p>
                <p className="text-2xl font-bold text-gray-900">{stats.maliciousDetected}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <FiTrendingDown className="w-4 h-4 text-red-500" />
              <span className="text-sm text-red-600 ml-1">-8% ce mois</span>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <FiMail className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Emails</p>
                <p className="text-2xl font-bold text-gray-900">{stats.emailsAnalyzed}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <FiTrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm text-green-600 ml-1">+15% ce mois</span>
            </div>
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => window.location.href = action.path}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-4`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Scanner rapide */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Scanner rapide</h2>
            <form onSubmit={handleUrlSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Entrez une URL à scanner..."
                className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyse...
                </>
              ) : (
                <>
                <FiLink className="mr-2" />
                Scanner
                </>
              )}
            </motion.button>
            </form>
        </motion.div>

        {/* Historique récent */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Scans récents</h2>
          </div>
          <div className="p-6">
            {scanResults.length > 0 ? (
            <div className="space-y-4">
                {scanResults.slice(0, 5).map((result) => (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {result.isSafe ? (
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FiCheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                    ) : (
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <FiAlertCircle className="w-5 h-5 text-red-600" />
                        </div>
                    )}
                  </div>
                    <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        {result.type === 'url' ? 'Scan URL' : 'Scan Email'}
                      </h3>
                        <span className="text-sm text-gray-500 flex items-center">
                          <FiClock className="w-4 h-4 mr-1" />
                          {result.timestamp.toLocaleString()}
                      </span>
                    </div>
                      <p className="text-sm text-gray-600 mt-1">
                      {result.type === 'url' ? result.url : result.emailSubject}
                    </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {result.threatDetails}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FiBarChart2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucun scan récent</p>
                  </div>
            )}
          </div>
        </motion.div>
        </div>
    </div>
  );
};

export default Dashboard; 