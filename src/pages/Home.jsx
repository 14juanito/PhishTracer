import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserStatus from '../components/UserStatus';
import { motion } from 'framer-motion';

const Home = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: 'Détection de phishing',
      description: 'Analysez les URLs et les emails pour détecter les tentatives de phishing.'
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Protection en temps réel',
      description: 'Surveillez vos communications en temps réel pour une protection maximale.'
    },
    {
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Rapports détaillés',
      description: 'Consultez des rapports détaillés sur les menaces détectées.'
    }
  ];

  const testimonials = [
    {
      content: "PhishTracer m'a permis de détecter plusieurs tentatives de phishing qui auraient pu compromettre la sécurité de mon entreprise.",
      author: "Marie Dubois",
      role: "Directrice IT, TechCorp"
    },
    {
      content: "Un outil indispensable pour la sécurité de nos communications. La détection en temps réel est particulièrement efficace.",
      author: "Thomas Martin",
      role: "Responsable Cybersécurité, SecureNet"
    },
    {
      content: "Interface intuitive et résultats fiables. Je recommande vivement PhishTracer pour la protection contre le phishing.",
      author: "Sophie Bernard",
      role: "Consultante en sécurité"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <div className="relative bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl leading-tight">
              Protégez-vous contre le phishing avec <span className="text-blue-600">PhishTracer</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0">
              Détectez et prévenez les attaques de phishing en temps réel. Notre solution analyse vos e-mails et URLs pour une protection maximale.
            </p>
            {currentUser ? (
              <div className="mt-8 flex flex-col items-center lg:items-start space-y-4">
                <UserStatus user={currentUser} />
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Accéder au tableau de bord
                </Link>
              </div>
            ) : (
              <div className="mt-8 flex justify-center lg:justify-start space-x-4">
                <Link
                  to="/register"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Commencer gratuitement →
                </Link>
               
              </div>
            )}
          </div>
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <img 
              src="/assets/phish-1.jpg" 
              alt="Phishing Illustration" 
              className="w-full max-w-md h-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-blue-600 sm:text-4xl">
              Fonctionnalités
            </h2>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="bg-white rounded-lg p-6 hover:bg-blue-700 transition-colors duration-200"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-w-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section - Only shown when not logged in */}
      {!currentUser && (
        <div className="py-12 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                Ce qu'en disent nos utilisateurs
              </h2>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={testimonial.author}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="bg-white-300 rounded-lg p-6"
                  >
                    <p className="text-lg text-white mb-4">"{testimonial.content}"</p>
                    <div className="text-white">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home; 