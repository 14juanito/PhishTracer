import { FiStar } from 'react-icons/fi';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Daniel Lukali',
      role: 'Coordinateur ATE-I-N et DataScientist',
      content:
        'PhishTracer est un outil essentiel pour la sécurité de nos données. Sa capacité à détecter les menaces en temps réel nous permet de protéger efficacement nos utilisateurs.',
      rating: 5,
      image: '/assets/lukali.png',
    },
    {
      name: 'Thomas Dubois',
      role: 'Responsable IT',
      content:
        'La solution PhishTracer a considérablement renforcé notre sécurité. Les alertes sont précises et les analyses détaillées nous aident à prendre les bonnes décisions.',
      rating: 5,
      image: '/assets/testimonial-2.jpg',
    },
    {
      name: 'Marie Laurent',
      role: 'Directrice Marketing',
      content:
        'Grâce à PhishTracer, nous avons pu sensibiliser notre équipe aux risques du phishing. L\'interface est intuitive et les rapports sont très clairs.',
      rating: 5,
      image: '/assets/testimonial-3.jpg',
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 font-poppins">
            Ce qu'en disent nos utilisateurs
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Découvrez les retours d'expérience de nos utilisateurs satisfaits
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 