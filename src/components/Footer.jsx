import React from 'react';
import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/logo.png"
                alt="PhishTracer Logo"
                className="h-18 w-auto"
              />
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              PhishTracer est votre outil de confiance pour détecter et prévenir les attaques de phishing.
              Protégez-vous et votre entreprise contre les menaces en ligne.
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Liens rapides
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                  Accueil
                </Link>
              </li>
              <li>
              
              </li>
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="mailto:contact@phishtracer.com" className="text-base text-gray-500 hover:text-gray-900">
                  contact@phishtracer.com
                </a>
              </li>
              <li className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">GitHub</span>
                  <FiGithub className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <FiTwitter className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">LinkedIn</span>
                  <FiLinkedin className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} PhishTracer. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 