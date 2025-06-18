import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const token = googleUser.getAuthResponse().id_token;
      
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Échec de l\'authentification Google');
      }

      navigate('/dashboard');
    } catch (err) {
      setError('Échec de l\'authentification Google');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Image et citation de gauche */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12">
        <img
          src="/assets/phish-2.jpg"
          alt="PhishTracer Logo"
          className="max-w-lg w-full mb-12 object-contain"
          style={{ maxHeight: '250px' }}
        />
        <div className="max-w-lg text-center">
          <blockquote className="text-2xl font-poppins text-gray-800 italic mb-4">
            "La cybersécurité ne concerne pas que les grandes entreprises mais elle concerne tout le monde"
          </blockquote>
          <p className="text-lg font-semibold text-blue-600">
            Guy-Germain Mbaki
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Spécialiste en CyberSécurité
          </p>
        </div>
      </div>

      {/* Formulaire de droite */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {/* En-tête */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">
              Connexion
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenue sur PhishTracer ! Connectez-vous pour continuer.
            </p>
          </div>

          {/* Bouton Google */}
          <div className="flex flex-col space-y-4">
            <button
              type="button"
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all hover:scale-105"
            >
              <FcGoogle className="w-5 h-5 mr-2" />
              Continuer avec Google
            </button>
          </div>

          {/* Séparateur */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                ou connectez-vous avec
              </span>
            </div>
          </div>

          {/* Formulaire */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="sr-only">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Adresse e-mail"
                  />
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="sr-only">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Mot de passe"
                  />
                </div>
              </div>
            </div>

            {/* Options de connexion */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Se souvenir de moi
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            </div>

            {/* Bouton de connexion */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-105"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </div>
          </form>

          {/* Lien d'inscription */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Pas encore de compte ?</span>{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Inscrivez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 