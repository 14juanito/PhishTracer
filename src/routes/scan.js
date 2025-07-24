const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { scanUrlWithVirusTotal, scanEmailWithVirusTotal } = require('../controllers/scanController');
const { scanUrlWithGoogleSafeBrowsing } = require('../controllers/googleSafeBrowsing');
const auth = require('../middleware/auth'); // Middleware d’authentification existant
const axios = require('axios'); // Ajouter axios pour récupérer le HTML
const cheerio = require('cheerio'); // Pour parser le HTML

// Fonction utilitaire d'analyse HTML avancée
async function analyzeHtmlContent(html, url) {
  const $ = cheerio.load(html);
  let suspicion = 0;
  let reasons = [];

  // a) Formulaires suspects
  const forms = $('form');
  if (forms.length > 0) {
    forms.each((i, form) => {
      const hasPassword = $(form).find('input[type="password"]').length > 0;
      const hasEmail = $(form).find('input[type="email"]').length > 0;
      if (hasPassword) {
        suspicion += 30;
        reasons.push('Formulaire de connexion avec champ mot de passe détecté');
      }
      if (hasEmail) {
        suspicion += 10;
        reasons.push('Formulaire avec champ email détecté');
      }
      // Vérifier l'action du formulaire
      const action = $(form).attr('action');
      if (action && !action.startsWith('/') && !action.includes(url)) {
        suspicion += 15;
        reasons.push('Formulaire envoyant les données vers un domaine externe');
      }
    });
  }

  // b) Mots-clés dans le texte
  const pageText = $('body').text().toLowerCase();
  const phishingPhrases = [
    'votre compte a été suspendu', 'confirmez vos informations', 'paiement requis',
    'votre compte sera supprimé', 'cliquez ici pour vérifier', 'update your account',
    'mot de passe', 'sécurité', 'identifiant', 'connexion', 'login', 'verify your account'
  ];
  phishingPhrases.forEach(phrase => {
    if (pageText.includes(phrase)) {
      suspicion += 15;
      reasons.push(`Phrase suspecte détectée : "${phrase}"`);
    }
  });

  // c) Liens externes suspects
  $('a').each((i, link) => {
    const href = $(link).attr('href');
    if (href && !href.startsWith('#') && !href.includes(url)) {
      suspicion += 5;
      reasons.push(`Lien externe suspect : ${href}`);
    }
    if (href && (href.includes('bit.ly') || href.includes('tinyurl'))) {
      suspicion += 10;
      reasons.push(`Lien raccourci détecté : ${href}`);
    }
  });

  // d) Champs cachés, iframes, scripts
  if ($('input[type="hidden"]').length > 2) {
    suspicion += 10;
    reasons.push('Plusieurs champs cachés détectés');
  }
  if ($('iframe').length > 0) {
    suspicion += 10;
    reasons.push('Iframe détecté dans la page');
  }
  if ($('script[src]').length > 5) {
    suspicion += 10;
    reasons.push('De nombreux scripts externes détectés');
  }

  // e) Titre/meta
  const title = $('title').text().toLowerCase();
  if (title.includes('sécurité') || title.includes('compte')) {
    suspicion += 10;
    reasons.push('Titre de page suspect');
  }

  // f) Favicon externe
  const favicon = $('link[rel="icon"]').attr('href');
  if (favicon && !favicon.includes(url)) {
    suspicion += 5;
    reasons.push('Favicon hébergé sur un domaine externe');
  }

  // g) Domaine exotique ou peu connu
  const urlObj = new URL(url);
  const tld = urlObj.hostname.split('.').pop();
  const exoticTlds = ['ru', 'tk', 'ml', 'ga', 'cf', 'gq', 'xyz'];
  if (exoticTlds.includes(tld)) {
    suspicion += 15;
    reasons.push('Domaine avec une extension peu courante ou à risque');
  }

  // h) Sous-domaine long ou complexe
  const subdomainParts = urlObj.hostname.split('.');
  if (subdomainParts.length > 3) {
    suspicion += 10;
    reasons.push('Sous-domaine long ou complexe');
  }
  if (/\d/.test(urlObj.hostname)) {
    suspicion += 10;
    reasons.push('Domaine contenant des chiffres');
  }
  const domainSuspiciousWords = ['login', 'secure', 'account', 'update', 'verify'];
  domainSuspiciousWords.forEach(word => {
    if (urlObj.hostname.includes(word)) {
      suspicion += 10;
      reasons.push(`Mot-clé suspect dans le domaine : ${word}`);
    }
  });

  // i) Chargement de ressources externes
  const externalResources = [];
  $('script[src], img[src], link[rel="stylesheet"][href]').each((i, el) => {
    const src = $(el).attr('src') || $(el).attr('href');
    if (src && !src.startsWith('/') && !src.includes(urlObj.hostname)) {
      externalResources.push(src);
    }
  });
  if (externalResources.length > 2) {
    suspicion += 10;
    reasons.push('Plusieurs ressources chargées depuis des domaines externes');
  }

  // j) WHOIS (âge du domaine) - à intégrer si besoin
  // TODO: Intégrer une requête WHOIS pour vérifier si le domaine est très récent (ex: < 6 mois)
  // Si oui, suspicion += 20 et reasons.push('Domaine très récent');

  // k) Mentions légales/page d'accueil (optionnel)
  // TODO: Vérifier la présence de mentions légales ou d'une page d'accueil classique

  return { suspicion: Math.min(suspicion, 100), reasons };
}

// Route pour le scan d'une URL
router.post('/api/scan-url', auth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL manquante' });

  try {
    // 1. Scan Google Safe Browsing
    const googleResult = await scanUrlWithGoogleSafeBrowsing(url);

    let suspicion = 0;
    let reason = [];

    if (googleResult.isUnsafe) {
      suspicion = 100;
      reason.push("Détecté comme dangereux par Google Safe Browsing");
    } else {
      // Heuristique simple si Google ne détecte rien
      const suspiciousKeywords = ['login', 'secure', 'account', 'verify', 'update', 'bank', 'paypal'];
      const hasSuspiciousKeyword = suspiciousKeywords.some(kw => url.toLowerCase().includes(kw));
      if (hasSuspiciousKeyword) {
        suspicion += 40;
        reason.push("Mot-clé suspect dans l'URL");
      }
      // Analyse du contenu HTML du site (avancée)
      try {
        const response = await axios.get(url, { timeout: 5000 });
        const html = response.data;
        // DEBUG: Log du HTML récupéré (à retirer en production)
        console.log('HTML récupéré pour analyse:', html.slice(0, 1000)); // Limite à 1000 caractères
        const htmlAnalysis = await analyzeHtmlContent(html, url);
        suspicion += htmlAnalysis.suspicion;
        reason = reason.concat(htmlAnalysis.reasons);
      } catch (err) {
        reason.push("Impossible d'analyser le contenu du site (site inaccessible ou trop lent)");
      }
      // TODO: Pour une analyse plus poussée, utiliser Puppeteer ou Playwright pour charger le site comme un vrai navigateur et exécuter le JS.
      // Si aucune heuristique, suspicion faible
      if (suspicion === 0) {
        suspicion = 5;
        reason.push("Aucun signe évident de phishing");
      }
      // Limiter le score à 100
      suspicion = Math.min(suspicion, 100);
    }

    res.json({
      url,
      isPhishing: suspicion >= 20, // seuil abaissé à 20 pour détection plus stricte
      suspicionPercent: suspicion,
      reason,
      googleSafeBrowsing: googleResult
    });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du scan', details: err.message });
  }
});

// Route pour le scan d'un fichier email (.eml, .txt, etc.)
router.post('/api/scans/email/file', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier envoyé.' });
    }
    const emailText = req.file.buffer.toString('utf-8');
    const result = await scanEmailWithVirusTotal(emailText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du scan du fichier email', details: err.message });
  }
});

// Route pour le scan d'une URL avec Google Safe Browsing
router.post('/api/scan-google', auth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL manquante' });
  try {
    const result = await scanUrlWithGoogleSafeBrowsing(url);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l’analyse Google Safe Browsing', details: err.message });
  }
});

// Exemple de réponse pour le scan d'une URL
router.post('/api/scan-url/example-response', auth, async (req, res) => {
  const exampleResponse = {
    url: 'http://phishing-login.com',
    isPhishing: true,
    suspicionPercent: 70,
    reason: [
      "Mot-clé suspect dans l'URL",
      "URL non sécurisée (HTTP)"
    ],
    googleSafeBrowsing: {
      url: 'http://phishing-login.com',
      isUnsafe: false,
      matches: []
    }
  };
  res.json(exampleResponse);
});

module.exports = router;