const User = require('../models/User');
const Scan = require('../models/Scan');
const { Op } = require('sequelize');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role', 'isActive', 'lastLogin', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message
    });
  }
};

// @desc    Get all scans
// @route   GET /api/admin/scans
// @access  Private/Admin
exports.getAllScans = async (req, res) => {
  try {
    const scans = await Scan.findAll({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      count: scans.length,
      scans
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des scans:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des scans',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Delete all scans associated with the user
    await Scan.destroy({ where: { userId } });
    
    // Delete the user
    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message
    });
  }
};

// @desc    Delete scan
// @route   DELETE /api/admin/scans/:id
// @access  Private/Admin
exports.deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findByPk(req.params.id);
    
    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan non trouvé'
      });
    }

    await scan.destroy();

    res.status(200).json({
      success: true,
      message: 'Scan supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du scan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du scan',
      error: error.message
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get total users
    const totalUsers = await User.count();

    // Get total scans
    const totalScans = await Scan.count();

    // Get scans today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const scansToday = await Scan.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    // Get active users (users who logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: thirtyDaysAgo
        }
      }
    });

    res.status(200).json({
        totalUsers,
        totalScans,
      scansToday,
      activeUsers
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
}; 

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user'
    });

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, password, role } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Check if email is already used by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Cet email est déjà utilisé'
        });
      }
    }

    // Update user
    const updateData = { name, email, role };
    if (password) {
      updateData.password = password;
    }

    await user.update(updateData);

    // Remove password from response
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    };

    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la modification de l\'utilisateur',
      error: error.message
    });
  }
}; 

// @desc    Get detailed API statistics
// @route   GET /api/admin/api-stats
// @access  Private/Admin
exports.getApiStats = async (req, res) => {
  try {
    // Get user statistics
    const totalUsers = await User.count();
    const activeUsers = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    // Get scan statistics
    const totalScans = await Scan.count();
    const scansToday = await Scan.count({
      where: {
        createdAt: {
          [Op.gte]: new Date().setHours(0, 0, 0, 0)
        }
      }
    });

    const scansThisWeek = await Scan.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const scansThisMonth = await Scan.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Get scan results distribution
    const scanResults = await Scan.findAll({
      attributes: [
        'disposition',
        [Op.fn('COUNT', Op.col('id')), 'count']
      ],
      group: ['disposition'],
      raw: true
    });

    // Get recent activity
    const recentScans = await Scan.findAll({
      include: [{ model: User, as: 'user', attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 10,
      attributes: ['id', 'name', 'email', 'role', 'createdAt']
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          recent: recentUsers
        },
        scans: {
          total: totalScans,
          today: scansToday,
          thisWeek: scansThisWeek,
          thisMonth: scansThisMonth,
          results: scanResults,
          recent: recentScans
        }
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques API:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques API',
      error: error.message
    });
  }
}; 