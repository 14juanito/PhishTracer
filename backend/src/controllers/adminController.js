const admin = require('firebase-admin');
const db = admin.firestore();

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    const users = [];
    
    snapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        id: doc.id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      });
    });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs'
    });
  }
};

// @desc    Get all scans
// @route   GET /api/admin/scans
// @access  Private/Admin
exports.getAllScans = async (req, res) => {
  try {
    const scansRef = db.collection('scans');
    const snapshot = await scansRef.get();
    const scans = [];
    
    for (const doc of snapshot.docs) {
      const scanData = doc.data();
      // Get user data if available
      let userData = null;
      if (scanData.userId) {
        const userDoc = await db.collection('users').doc(scanData.userId).get();
        if (userDoc.exists) {
          userData = userDoc.data();
        }
      }
      
      scans.push({
        id: doc.id,
        ...scanData,
        user: userData ? {
          id: userDoc.id,
          name: userData.name,
          email: userData.email
        } : null
      });
    }

    res.status(200).json({
      success: true,
      count: scans.length,
      scans
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des scans:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des scans'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Delete all scans associated with the user
    const scansRef = db.collection('scans');
    const userScans = await scansRef.where('userId', '==', userId).get();
    
    const batch = db.batch();
    userScans.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Delete the user
    batch.delete(userRef);
    await batch.commit();

    res.status(200).json({
      success: true,
      message: 'Utilisateur supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur'
    });
  }
};

// @desc    Delete scan
// @route   DELETE /api/admin/scans/:id
// @access  Private/Admin
exports.deleteScan = async (req, res) => {
  try {
    const scanRef = db.collection('scans').doc(req.params.id);
    const scanDoc = await scanRef.get();

    if (!scanDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Scan non trouvé'
      });
    }

    await scanRef.delete();

    res.status(200).json({
      success: true,
      message: 'Scan supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du scan:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du scan'
    });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    // Get total users
    const usersSnapshot = await db.collection('users').get();
    const totalUsers = usersSnapshot.size;

    // Get total scans
    const scansSnapshot = await db.collection('scans').get();
    const totalScans = scansSnapshot.size;

    // Get malicious scans
    const maliciousScansSnapshot = await db.collection('scans')
      .where('isPhishing', '==', true)
      .get();
    const maliciousScans = maliciousScansSnapshot.size;

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentUsersSnapshot = await db.collection('users')
      .where('createdAt', '>=', sevenDaysAgo)
      .get();
    const recentUsers = recentUsersSnapshot.size;

    const recentScansSnapshot = await db.collection('scans')
      .where('createdAt', '>=', sevenDaysAgo)
      .get();
    const recentScans = recentScansSnapshot.size;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalScans,
        maliciousScans,
        safeScans: totalScans - maliciousScans,
        recentUsers,
        recentScans
      }
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
}; 