const axios = require('axios');
require('dotenv').config();

const GOOGLE_SAFE_BROWSE_API_KEY = process.env.GOOGLE_SAFE_BROWSE_API_KEY;
const SAFE_BROWSE_ENDPOINT = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${GOOGLE_SAFE_BROWSE_API_KEY}`;

async function scanUrlWithGoogleSafeBrowse(url) {
  if (!GOOGLE_SAFE_BROWSE_API_KEY) {
    throw new Error("Clé API Google Safe Browsing non définie dans les variables d'environnement.");
  }

  const payload = {
    client: {
      clientId: "phishtracer",
      clientVersion: "1.0"
    },
    threatInfo: {
      threatTypes: [
        "MALWARE",
        "PHISHING",
        "UNWANTED_SOFTWARE",
        "SOCIAL_ENGINEERING",
        "POTENTIALLY_HARMFUL_APPLICATION"
      ],
      platformTypes: ["ANY_PLATFORM"],
      threatEntryTypes: ["URL"],
      threatEntries: [{ url }]
    }
  };

  try {
    const response = await axios.post(SAFE_BROWSE_ENDPOINT, payload);
    const matches = response.data.matches || [];

    if (matches.length > 0) {
      // Menaces détectées
      const threats = matches.map(match => ({
        threatType: match.threatType,
        platformType: match.platformType
      }));
      return {
        url,
        isMalicious: true,
        message: "Danger ! Cette URL est signalée comme potentiellement dangereuse.",
        threats,
        note: "La détection provient de Google Safe Browsing. Restez vigilant même si l'URL n'est pas détectée."
      };
    } else {
      // Aucune menace détectée
      return {
        url,
        isMalicious: false,
        message: "Cette URL semble fiable. (Cependant, restez vigilant !)",
        note: "L'absence de détection ne garantit pas l'innocuité à 100%."
      };
    }
  } catch (err) {
    if (err.response) {
      console.error("Erreur API Google Safe Browsing :", err.response.status, err.response.data);
      throw new Error(`Erreur Google Safe Browsing (${err.response.status}) : ${JSON.stringify(err.response.data)}`);
    } else {
      console.error("Erreur réseau ou inconnue :", err.message);
      throw new Error("Erreur lors de la connexion à Google Safe Browsing : " + err.message);
    }
  }
}

module.exports = { scanUrlWithGoogleSafeBrowse };