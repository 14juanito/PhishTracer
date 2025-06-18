import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

const Hero = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Texte à gauche */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Protégez-vous contre le phishing avec PhishTracer
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Détectez et prévenez les attaques de phishing en temps réel. Notre solution analyse vos e-mails et URLs pour une protection maximale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-all hover:scale-105"
              >
                Commencer gratuitement
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/demo"
                className="inline-flex items-center px-6 py-3 border border-blue-200 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-all hover:scale-105"
              >
                Voir la démo
              </Link>
            </div>
          </div>

          {/* Image à droite */}
          <div className="flex-1">
            <img
              src="/assets/phish-1.jpg"
              alt="Protection contre le phishing"
              className="w-full max-w-lg mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 