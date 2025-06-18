const Scan = require('../models/Scan');

// Récupérer l'historique des scans d'un utilisateur
const getMyScans = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id })
      .sort({ createdAt: -1 }) // Tri par date décroissante
      .select('url verdict ip scanId status createdAt'); // Sélection des champs

    res.json({
      success: true,
      count: scans.length,
      data: scans
    });
  } catch (error) {
    console.error('Error fetching scans:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch scans',
      details: error.message
    });
  }
};

// Supprimer un scan (admin ou propriétaire)
const deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        error: 'Scan not found'
      });
    }

    // Vérifier si l'utilisateur est admin ou propriétaire du scan
    if (req.user.role !== 'admin' && scan.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this scan'
      });
    }

    await scan.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error deleting scan:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete scan',
      details: error.message
    });
  }
};

module.exports = {
  getMyScans,
  deleteScan
}; 