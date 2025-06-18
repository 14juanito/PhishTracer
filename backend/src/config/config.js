require('dotenv').config();

const config = {
  // MongoDB Configuration
  MONGO_URI: process.env.MONGO_URI || 'mongodb+srv://juanitoelroy14:juanitoelroy@cluster0.aqavthu.mongodb.net/phishtracer?retryWrites=true&w=majority&appName=Cluster0',
  MONGO_OPTIONS: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'PhishTracer_SuperSecretKey_2024_Secure',
  JWT_EXPIRE: '24h',
  JWT_COOKIE_EXPIRE: 24,

  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

module.exports = config; 