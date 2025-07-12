import { useState } from 'react';
import { FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

export default function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-gray-200 z-10">
      <div className="h-full px-6 flex items-center justify-end">
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <img
              src="/assets/phish-2.jpg"
              alt="Avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium text-gray-700"></span>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
              <a
                href="#profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiUser className="w-4 h-4 mr-3" />
                Voir profil
              </a>
              <a
                href="#settings"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <FiSettings className="w-4 h-4 mr-3" />
                Paramètres
              </a>
              <a
                href="#logout"
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
              >
                <FiLogOut className="w-4 h-4 mr-3" />
                Se déconnecter
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 