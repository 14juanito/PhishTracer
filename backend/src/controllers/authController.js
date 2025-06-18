const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const admin = require('firebase-admin');
const db = admin.firestore();

// Create token
const createToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  const token = createToken(user.id);

  const options = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if user exists
    const userExists = await User.findByEmail(email);
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Tentative de connexion pour:', email);

    // Check for user
    const user = await User.findByEmail(email);
    if (!user) {
      console.log('Utilisateur non trouvé');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('Utilisateur trouvé, vérification du mot de passe');
    // Check if password matches
    const isMatch = await User.matchPassword(password, user.password);
    if (!isMatch) {
      console.log('Mot de passe incorrect');
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    console.log('Connexion réussie');
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la connexion'
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie'
  });
};

// @desc    Create first admin
// @route   POST /api/auth/create-first-admin
// @access  Public
exports.createFirstAdmin = async (req, res) => {
  try {
    // Check if any admin exists
    const usersRef = db.collection('users');
    const adminSnapshot = await usersRef.where('role', '==', 'admin').get();
    
    if (!adminSnapshot.empty) {
      return res.status(400).json({
        success: false,
        message: 'Un administrateur existe déjà'
      });
    }

    const { name, email, password } = req.body;

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Erreur lors de la création de l\'admin:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'administrateur'
    });
  }
}; 