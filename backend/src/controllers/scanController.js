const Scan = require('../models/Scan');
const User = require('../models/User');
const axios = require('axios');

// @desc    Get all scans for current user
// @route   GET /api/scans/my-scans
// @access  Private
exports.getMyScans = async (req, res) => {
  try {
    const scans = await Scan.findByUserId(req.user.id);
    res.status(200).json({
      success: true,
      count: scans.length,
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
    const scan = await Scan.findByPk(req.params.id);

    if (!scan) {
      return res.status(404).json({
        success: false,
        message: 'Scan non trouvé'
      });
    }

    // Make sure user owns the scan or is admin
    if (req.user.role !== 'admin' && scan.userId !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Non autorisé à supprimer ce scan'
      });
    }

    await scan.destroy();

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

// @desc    Launch a phishing scan via CheckPhish API
// @route   POST /api/scans/check
// @access  Private
exports.checkPhish = async (req, res) => {
  const apiKey = '0c9x5ezhz2nxljf5fggdyu25ecx4w3d5v6xkzixyik8t1yg3zez9lzmr9ktmccru';
  const { url } = req.body;
  
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL manquante' });
  }

  try {
    // Lancer le scan via CheckPhish
    const response = await axios.post('https://developers.checkphish.ai/api/neo/scan/', {
      apiKey,
      urlInfo: { url },
      scanType: 'quick'
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const { jobID, timestamp } = response.data;

    // Sauvegarder la demande de scan en base
    const scan = await Scan.create({
      userId: req.user.id,
      url,
      jobId: jobID,
      status: 'pending',
      scanStartTs: timestamp
    });

    res.status(200).json({ 
      success: true, 
      jobID,
      timestamp,
      scanId: scan.id
    });
  } catch (error) {
    console.error('Erreur CheckPhish:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la soumission à CheckPhish', 
      error: error.message 
    });
  }
};

// @desc    Get phishing scan status via CheckPhish API
// @route   POST /api/scans/status
// @access  Private
exports.checkPhishStatus = async (req, res) => {
  const apiKey = '0c9x5ezhz2nxljf5fggdyu25ecx4w3d5v6xkzixyik8t1yg3zez9lzmr9ktmccru';
  const { jobID } = req.body;
  
  if (!jobID) {
    return res.status(400).json({ success: false, message: 'jobID manquant' });
  }

  try {
    // Récupérer le statut via CheckPhish
    const response = await axios.post('https://developers.checkphish.ai/api/neo/scan/status', {
      apiKey,
      jobID,
      insights: true
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    const result = response.data;

    // Mettre à jour le scan en base
    const scan = await Scan.findByJobId(jobID);
    if (scan) {
      await scan.update({
        status: result.status === 'DONE' ? 'completed' : 'processing',
        disposition: result.disposition || 'unknown',
        brand: result.brand,
        insights: result.insights,
        screenshotPath: result.screenshot_path,
        resolved: result.resolved,
        scanEndTs: result.scan_end_ts,
        categories: result.categories,
        errorMessage: result.status === 'FAILED' ? 'Scan échoué' : null
      });
    }

    res.status(200).json({ 
      success: true, 
      data: result,
      scanId: scan ? scan.id : null
    });
  } catch (error) {
    console.error('Erreur statut CheckPhish:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de la récupération du statut CheckPhish', 
      error: error.message 
    });
  }
}; 

// @desc    Scan email content for phishing
// @route   POST /api/scans/email/content
// @access  Private
exports.scanEmailContent = async (req, res) => {
  const { emailContent } = req.body;
  
  if (!emailContent) {
    return res.status(400).json({ success: false, message: 'Contenu de l\'email manquant' });
  }

  try {
    // Analyse simple du contenu de l'email
    const analysis = analyzeEmailContent(emailContent);
    
    // Sauvegarder le scan en base
    const scan = await Scan.create({
      userId: req.user.id,
      url: null,
      emailContent: emailContent.substring(0, 1000), // Limiter la taille
      status: 'completed',
      disposition: analysis.isPhishing ? 'phishing' : 'clean',
      scanStartTs: new Date(),
      scanEndTs: new Date(),
      insights: analysis.insights
    });

    res.status(200).json({ 
      success: true, 
      isPhishing: analysis.isPhishing,
      confidence: analysis.confidence,
      scanDate: new Date().toISOString(),
      insights: analysis.insights,
      scanId: scan.id
    });
  } catch (error) {
    console.error('Erreur scan email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'analyse de l\'email', 
      error: error.message 
    });
  }
};

// @desc    Scan email file for phishing
// @route   POST /api/scans/email/file
// @access  Private
exports.scanEmailFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Fichier manquant' });
  }

  try {
    const emailContent = req.file.buffer.toString('utf8');
    
    // Analyse du contenu du fichier
    const analysis = analyzeEmailContent(emailContent);
    
    // Sauvegarder le scan en base
    const scan = await Scan.create({
      userId: req.user.id,
      url: null,
      emailContent: emailContent.substring(0, 1000), // Limiter la taille
      status: 'completed',
      disposition: analysis.isPhishing ? 'phishing' : 'clean',
      scanStartTs: new Date(),
      scanEndTs: new Date(),
      insights: analysis.insights
    });

    res.status(200).json({ 
      success: true, 
      isPhishing: analysis.isPhishing,
      confidence: analysis.confidence,
      scanDate: new Date().toISOString(),
      insights: analysis.insights,
      scanId: scan.id
    });
  } catch (error) {
    console.error('Erreur scan fichier email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors de l\'analyse du fichier email', 
      error: error.message 
    });
  }
};

// Fonction utilitaire pour analyser le contenu d'un email
function analyzeEmailContent(content) {
  const lowerContent = content.toLowerCase();
  let score = 0;
  const insights = [];

  // Indicateurs de phishing
  const phishingIndicators = [
    { pattern: /urgent|urgente|immédiat|immédiate/, weight: 2, name: 'Urgence' },
    { pattern: /password|mot de passe|compte|account/, weight: 3, name: 'Demande de mot de passe' },
    { pattern: /click here|cliquez ici|cliquer ici/, weight: 2, name: 'Lien suspect' },
    { pattern: /bank|banque|paypal|amazon|microsoft|google/, weight: 1, name: 'Imitation de marque' },
    { pattern: /verify|vérifier|confirm|confirmer/, weight: 2, name: 'Demande de vérification' },
    { pattern: /suspended|suspendu|blocked|bloqué/, weight: 3, name: 'Menace de suspension' },
    { pattern: /http:\/\//, weight: 2, name: 'Lien non sécurisé' },
    { pattern: /bit\.ly|tinyurl|goo\.gl/, weight: 2, name: 'Lien raccourci' }
  ];

  phishingIndicators.forEach(indicator => {
    if (indicator.pattern.test(lowerContent)) {
      score += indicator.weight;
      insights.push(indicator.name);
    }
  });

  // Vérifier les liens suspects
  const urlRegex = /https?:\/\/[^\s]+/g;
  const urls = content.match(urlRegex) || [];
  if (urls.length > 3) {
    score += 1;
    insights.push('Nombreux liens');
  }

  // Calculer la confiance
  const confidence = Math.min(score * 10, 100);
  const isPhishing = score >= 5;

  return {
    isPhishing,
    confidence,
    insights: [...new Set(insights)] // Supprimer les doublons
  };
} 