const axios = require('axios');

const VIRUSTOTAL_API_KEY = '67fedc781f4170e5d95c35809bba7adc677c66f146f808936b53163df22247e9';

// Fonction pour extraire les liens d'un texte (email)
function extractLinks(text) {
  const regex = /(https?:\/\/[^\s]+)/g;
  return text.match(regex) || [];
}

async function scanUrlWithVirusTotal(url) {
  // 1. Envoi de l'URL à VirusTotal
  const postRes = await axios.post(
    'https://www.virustotal.com/api/v3/urls',
    `url=${encodeURIComponent(url)}`,
    {
      headers: {
        'x-apikey': VIRUSTOTAL_API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );
  const analysisId = postRes.data.data.id;

  // 2. Attendre 3 secondes
  await new Promise(resolve => setTimeout(resolve, 3000));

  // 3. Récupérer les résultats de l'analyse
  const getRes = await axios.get(
    `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
    {
      headers: { 'x-apikey': VIRUSTOTAL_API_KEY }
    }
  );
  const stats = getRes.data.data.attributes.stats;

  // Détection phishing avancée
  const suspiciousKeywords = ['login', 'secure', 'account', 'verify', 'update', 'bank', 'paypal'];
  const hasSuspiciousKeyword = suspiciousKeywords.some(kw => url.toLowerCase().includes(kw));
  const isHttp = url.startsWith('http://');
  const isPhishing =
    stats.malicious > 0 ||
    stats.suspicious > 0 ||
    isHttp ||
    hasSuspiciousKeyword;

  // 4. Retourner uniquement les stats demandées
  return {
    url,
    stats: {
      harmless: stats.harmless,
      malicious: stats.malicious,
      suspicious: stats.suspicious,
      undetected: stats.undetected
    },
    isPhishing
  };
}

// Nouvelle fonction pour scanner un email
async function scanEmailWithVirusTotal(emailText) {
  const links = extractLinks(emailText);
  const results = [];
  for (const url of links) {
    const scanResult = await scanUrlWithVirusTotal(url);
    results.push(scanResult);
  }
  // Si au moins un lien est phishing, on le signale
  const hasPhishing = results.some(r => r.isPhishing);
  return {
    email: emailText,
    links: results,
    hasPhishing
  };
}

module.exports = { scanUrlWithVirusTotal, scanEmailWithVirusTotal };

// router.post('/api/scan-url', auth, async (req, res) => {
router.post('/api/scan-url', async (req, res) => {
  // ...
});

router.post('/api/scan-email', auth, async (req, res) => {
  const { emailText } = req.body;
  if (!emailText) return res.status(400).json({ error: 'Texte d’email manquant' });
  try {
    const result = await scanEmailWithVirusTotal(emailText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors du scan', details: err.message });
  }
});