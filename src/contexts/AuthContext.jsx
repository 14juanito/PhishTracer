import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Configuration d'axios pour pointer vers le backend
axios.defaults.baseURL = 'http://localhost:5000';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  async function login(email, password) {
    try {
      console.log('Tentative de connexion avec:', { email });
      const response = await axios.post('/api/auth/login', { email, password }, {
        withCredentials: true
      });
      console.log('Réponse de connexion:', response.data);
      setCurrentUser(response.data.user);
      showNotification('success', 'Connexion réussie !');
      return response.data; // Retourne les données complètes incluant le rôle
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data || error);
      if (error.response?.data?.message === 'Email ou mot de passe incorrect') {
        showNotification('error', 'Email ou mot de passe incorrect');
      } else {
        showNotification('error', 'Erreur lors de la connexion');
      }
      throw error.response?.data || error;
    }
  }

  async function register(email, password, name) {
    try {
      console.log('Tentative d\'inscription avec:', { email, name });
      if (!password || password.length < 6) {
        showNotification('error', 'Le mot de passe doit contenir au moins 6 caractères');
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }
      const response = await axios.post('/api/auth/register', { email, password, name }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Réponse d\'inscription:', response.data);
      setCurrentUser(response.data.user);
      showNotification('success', 'Inscription réussie !');
      return response.data;
    } catch (error) {
      console.error('Erreur d\'inscription:', error.response?.data || error);
      if (error.response?.data?.message === 'Cet email est déjà utilisé') {
        showNotification('error', 'Cet email est déjà utilisé');
      } else {
        showNotification('error', 'Erreur lors de l\'inscription');
      }
      throw error.response?.data || error;
    }
  }

  async function logout() {
    try {
      console.log('Tentative de déconnexion');
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true
      });
      console.log('Déconnexion réussie');
      setCurrentUser(null);
      showNotification('success', 'Déconnexion réussie');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      setCurrentUser(null);
      showNotification('error', 'Erreur lors de la déconnexion');
    }
  }

  async function getMe() {
    try {
      console.log('Tentative de récupération du profil');
      const response = await axios.get('/api/auth/me', {
        withCredentials: true
      });
      console.log('Profil récupéré:', response.data);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Erreur de récupération du profil:', error);
      setCurrentUser(null);
      throw error.response?.data || error;
    }
  }

  useEffect(() => {
    getMe()
      .catch((error) => {
        // Si getMe échoue, on assume que l'utilisateur n'est pas connecté
        console.log('Utilisateur non connecté ou API non disponible:', error.message);
        setCurrentUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const value = {
    currentUser,
    login,
    register,
    logout,
    getMe,
    notification,
    setNotification,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
} 