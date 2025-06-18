import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Notification from '../components/Notification';
import { FiUsers, FiFileText, FiTrash2, FiBarChart, FiAlertTriangle } from 'react-icons/fi';

const AdminDashboard = () => {
  const { currentUser, notification, setNotification } = useAuth();
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdminData = async () => {
    try {
      const usersRes = await axios.get('/api/admin/users', { withCredentials: true });
      const scansRes = await axios.get('/api/admin/scans', { withCredentials: true });
      const statsRes = await axios.get('/api/admin/stats', { withCredentials: true });

      setUsers(usersRes.data.users);
      setScans(scansRes.data.scans);
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('Impossible de charger les données d\'administration.');
      setNotification({ type: 'error', message: 'Impossible de charger les données d\'administration.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && currentUser.role === 'admin') {
      fetchAdminData();
    } else if (currentUser && currentUser.role !== 'admin') {
      setNotification({ type: 'error', message: 'Accès non autorisé à cette page.' });
      // Redirect or handle unauthorized access
    }
  }, [currentUser]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`, { withCredentials: true });
        setUsers(users.filter(user => user._id !== userId));
        setNotification({ type: 'success', message: 'Utilisateur supprimé avec succès.' });
      } catch (err) {
        console.error('Error deleting user:', err);
        setNotification({ type: 'error', message: 'Erreur lors de la suppression de l\'utilisateur.' });
      }
    }
  };

  const handleDeleteScan = async (scanId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce scan ?')) {
      try {
        await axios.delete(`/api/admin/scans/${scanId}`, { withCredentials: true });
        setScans(scans.filter(scan => scan._id !== scanId));
        setNotification({ type: 'success', message: 'Scan supprimé avec succès.' });
      } catch (err) {
        console.error('Error deleting scan:', err);
        setNotification({ type: 'error', message: 'Erreur lors de la suppression du scan.' });
      }
    }
  };

  if (loading) return <div className="text-white text-center py-10">Chargement des données d'administration...</div>;
  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!currentUser || currentUser.role !== 'admin') return <div className="text-red-500 text-center py-10">Accès refusé. Vous devez être administrateur.</div>;

  return (
    <div className="min-h-screen bg-gray-900">
      <Sidebar />
      <Topbar />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <main className="lg:pl-64 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white mb-8">Tableau de Bord Administrateur</h1>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-400">Total Utilisateurs</h3>
                <p className="text-3xl font-bold text-white">{stats.totalUsers || 0}</p>
              </div>
              <FiUsers className="text-blue-500 text-4xl" />
            </div>
            <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-400">Total Scans</h3>
                <p className="text-3xl font-bold text-white">{stats.totalScans || 0}</p>
              </div>
              <FiFileText className="text-green-500 text-4xl" />
            </div>
            <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-400">Scans Malveillants</h3>
                <p className="text-3xl font-bold text-white">{stats.maliciousScans || 0}</p>
              </div>
              <FiAlertTriangle className="text-red-500 text-4xl" />
            </div>
            <div className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-400">Statistiques</h3>
                <p className="text-3xl font-bold text-white">Voir Détails</p>
              </div>
              <FiBarChart className="text-purple-500 text-4xl" />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des Utilisateurs</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rôle</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          <FiTrash2 className="inline-block" /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Scans Table */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des Scans</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">URL/Fichier</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Utilisateur</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Verdict</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-gray-800 divide-y divide-gray-700">
                  {scans.map((scan) => (
                    <tr key={scan._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{scan.url || scan.filename}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{scan.user ? scan.user.email : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${scan.isPhishing ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                          {scan.isPhishing ? 'Phishing' : 'Sûr'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(scan.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        <button
                          onClick={() => handleDeleteScan(scan._id)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          <FiTrash2 className="inline-block" /> Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 