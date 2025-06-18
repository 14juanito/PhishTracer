import { FiMail, FiLink, FiShield, FiAlertTriangle, FiBarChart2, FiClock } from 'react-icons/fi';

const Features = () => {
  const features = [
    {
      icon: <FiMail className="w-8 h-8" />,
      title: 'Analyse des emails',
      description: 'Détection avancée des emails de phishing avec analyse du contenu et des pièces jointes.',
      color: 'hover:bg-blue-50 hover:text-blue-600'
    },
    {
      icon: <FiLink className="w-8 h-8" />,
      title: 'Détection des liens',
      description: 'Vérification en temps réel des liens suspects et des domaines malveillants.',
      color: 'hover:bg-green-50 hover:text-green-600'
    },
    {
      icon: <FiShield className="w-8 h-8" />,
      title: 'Protection proactive',
      description: 'Surveillance continue des domaines pour détecter instantanément les tentatives de phishing.',
      color: 'hover:bg-purple-50 hover:text-purple-600'
    },
    {
      icon: <FiAlertTriangle className="w-8 h-8" />,
      title: 'Alertes intelligentes',
      description: 'Notifications immédiates en cas de détection de domaines suspects ou de tentatives d\'attaque.',
      color: 'hover:bg-red-50 hover:text-red-600'
    },
    {
      icon: <FiBarChart2 className="w-8 h-8" />,
      title: 'Analyses détaillées',
      description: 'Tableaux de bord complets avec statistiques et rapports sur les menaces détectées.',
      color: 'hover:bg-yellow-50 hover:text-yellow-600'
    },
    {
      icon: <FiClock className="w-8 h-8" />,
      title: 'Historique complet',
      description: 'Conservation des données historiques pour suivre l\'évolution des menaces et améliorer la sécurité.',
      color: 'hover:bg-indigo-50 hover:text-indigo-600'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Fonctionnalités principales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez comment PhishTracer protège votre entreprise contre les attaques de phishing
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white p-8 rounded-lg shadow-sm transition-all duration-300 transform hover:scale-105 ${feature.color}`}
            >
              <div className="text-blue-600 mb-4 transition-colors duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 