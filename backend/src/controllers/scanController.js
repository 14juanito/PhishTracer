const Scan = require('../models/Scan');

// @desc    Get all scans for current user
// @route   GET /api/scans/my-scans
// @access  Private
exports.getMyScans = async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      data: scans
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des scans',
      error: error.message
    });
  }
};

// @desc    Delete a scan
// @route   DELETE /api/scans/:id
// @access  Private
exports.deleteScan = async (req, res) => {
  try {
    const scan = await Scan.findById(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan non trouvé'
      });
    }

    // Make sure user owns the scan
    if (scan.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé à supprimer ce scan'
      });
    }

    await scan.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du scan',
      error: error.message
    });
  }
}; 