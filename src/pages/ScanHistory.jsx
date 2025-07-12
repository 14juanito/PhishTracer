import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiClock, FiLink, FiMail, FiFilter, FiSearch, FiEye, FiTrash2, FiDownload } from 'react-icons/fi';

const ScanHistory = () => {
  const { currentUser } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, phishing, safe
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScan, setSelectedScan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/scans/history', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setScans(data);
      } else {
        setError('Erreur lors du chargement de l\'historique');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteScan = async (scanId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce scan ?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/scans/${scanId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          setScans(scans.filter(scan => scan.id !== scanId));
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesFilter = filter === 'all' || 
      (filter === 'phishing' && scan.isPhishing) || 
      (filter === 'safe' && !scan.isPhishing);
    
    const matchesSearch = scan.url?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scan.emailContent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scan.filename?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getVerdictColor = (isPhishing) => {
    return isPhishing ? 'text-red-600' : 'text-green-600';
  };

  const getVerdictBg = (isPhishing) => {
    return isPhishing ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200';
  };

  const getVerdictIcon = (isPhishing) => {
    return isPhishing ? '⚠️' : '✅';
  };

  const getScanTypeIcon = (scanType) => {
    return scanType === 'url' ? <FiLink className="w-4 h-4" /> : <FiMail className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Historique des scans</h1>
            <p className="text-gray-600 mt-1">Consultez tous vos scans précédents</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total des scans</p>
                <p className="text-2xl font-bold text-gray-900">{scans.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiLink className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scans URL</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scans.filter(scan => scan.type === 'url').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiMail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scans Email</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scans.filter(scan => scan.type === 'email').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <FiClock className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menaces détectées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {scans.filter(scan => scan.isPhishing).length}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FiFilter className="w-4 h-4 text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700 mr-2">Filtrer par :</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous les scans</option>
                  <option value="phishing">Menaces détectées</option>
                  <option value="safe">Scans sûrs</option>
                </select>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Rechercher dans les scans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </motion.div>

        {/* Scans List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Résultats ({filteredScans.length})
            </h2>
          </div>

          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            </div>
          )}

          {filteredScans.length === 0 ? (
            <div className="p-12 text-center">
              <FiClock className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun scan trouvé</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filter !== 'all' 
                  ? 'Aucun scan ne correspond à vos critères de recherche.'
                  : 'Commencez par effectuer votre premier scan.'
                }
              </p>
        </div>
      ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contenu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verdict
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Confiance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredScans.map((scan) => (
                    <tr key={scan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getScanTypeIcon(scan.type)}
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-900 capitalize">
                            {scan.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {scan.url || scan.filename || scan.emailContent?.substring(0, 50) + '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          scan.isPhishing 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {getVerdictIcon(scan.isPhishing)} {scan.isPhishing ? 'Menace' : 'Sûr'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 w-16">
                            <div 
                              className={`h-2 rounded-full ${
                                scan.isPhishing ? 'bg-red-500' : 'bg-green-500'
                              }`}
                              style={{ width: `${scan.confidence || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{scan.confidence || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(scan.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedScan(scan);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteScan(scan.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>

      {/* Scan Details Modal */}
      {showModal && selectedScan && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Détails du scan
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type de scan</label>
                  <p className="text-sm text-gray-900 capitalize">{selectedScan.type}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Contenu analysé</label>
                  <p className="text-sm text-gray-900 break-all">
                    {selectedScan.url || selectedScan.filename || selectedScan.emailContent}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Verdict</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedScan.isPhishing 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {getVerdictIcon(selectedScan.isPhishing)} {selectedScan.isPhishing ? 'Menace détectée' : 'Sûr'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Niveau de confiance</label>
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className={`h-2 rounded-full ${
                          selectedScan.isPhishing ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${selectedScan.confidence || 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{selectedScan.confidence || 0}%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date du scan</label>
                  <p className="text-sm text-gray-900">
                    {new Date(selectedScan.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>

                {selectedScan.details && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Détails</label>
                    <p className="text-sm text-gray-900">{selectedScan.details}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanHistory; 