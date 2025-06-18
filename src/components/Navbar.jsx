import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiLogIn, FiUserPlus, FiMenu, FiX, FiClock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="PhishTracer"
                className="h-12 w-auto"
              />
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/contact"
              className="text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium"
            >
              Contact
            </Link>
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium"
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/scan-history"
                  className="text-gray-500 hover:text-blue-600 transition-colors px-3 py-2 text-sm font-medium"
                >
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    Historique
                  </div>
                </Link>
              </>
            )}
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center px-4 py-2 border border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-all hover:scale-105"
                >
                  <FiLogIn className="mr-2" />
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105"
                >
                  <FiUserPlus className="mr-2" />
                  Inscription
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 transition-all hover:scale-105"
              >
                <FiLogIn className="mr-2" />
                Déconnexion
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Ouvrir le menu</span>
              {isMenuOpen ? (
                <FiX className="block h-6 w-6" />
              ) : (
                <FiMenu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/contact"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
            >
              Contact
            </Link>
            {currentUser && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  Tableau de bord
                </Link>
                <Link
                  to="/scan-history"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiClock className="mr-2" />
                    Historique
                  </div>
                </Link>
              </>
            )}
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiLogIn className="mr-2" />
                    Connexion
                  </div>
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <FiUserPlus className="mr-2" />
                    Inscription
                  </div>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 text-base font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <div className="flex items-center">
                  <FiLogIn className="mr-2" />
                  Déconnexion
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 