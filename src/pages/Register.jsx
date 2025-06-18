import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      return setError('Les mots de passe ne correspondent pas');
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password, name);
      navigate('/dashboard');
    } catch (err) {
      setError('Échec de l\'inscription. Veuillez réessayer.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Image et citation de gauche */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-8">
        <img
          src="/assets/log.jpg"
          alt="PhishTracer Logo"
          className="max-w-lg w-full mb-8 object-contain"
          style={{ maxHeight: '250px' }}
        />
        <div className="max-w-lg text-center">
          <blockquote className="text-2xl font-poppins text-gray-800 italic mb-4">
            "La plus grande faille de sécurité n'est pas dans le code, mais dans l'humain qui l'utilise. La sensibilisation est notre meilleure défense."
          </blockquote>
          <p className="text-lg font-semibold text-blue-600">
            Phillipe Kogenago
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Pentester
          </p>
        </div>
      </div>

      {/* Formulaire de droite */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          {/* En-tête */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 font-poppins">
              Créer un compte
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Bienvenue sur PhishTracer ! Créez votre compte pour commencer.
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
                ou inscrivez-vous avec
              </span>
            </div>
          </div>

          {/* Formulaire */}
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Nom complet */}
              <div>
                <label htmlFor="name" className="sr-only">
                  Nom complet
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Nom complet"
                  />
                </div>
              </div>

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
                    onChange={handleChange}
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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Mot de passe"
                  />
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all hover:scale-105"
              >
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </div>
          </form>

          {/* Lien de connexion */}
          <div className="text-center text-sm">
            <span className="text-gray-600">Déjà inscrit ?</span>{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Connectez-vous
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 