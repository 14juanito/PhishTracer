#!/bin/bash

echo "🚀 Déploiement de PhishTracer sur Vercel"
echo "========================================"

# Vérifier que Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

# Vérifier que l'utilisateur est connecté à Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Connexion à Vercel..."
    vercel login
fi

echo "📦 Déploiement du frontend..."
cd "$(dirname "$0")"

# Déployer le frontend
echo "🌐 Déploiement du frontend React..."
vercel --prod

echo ""
echo "🎉 Déploiement terminé !"
echo ""
echo "📋 Prochaines étapes :"
echo "1. Déployez le backend séparément"
echo "2. Configurez les variables d'environnement"
echo "3. Mettez à jour VITE_API_URL avec l'URL du backend"
echo ""
echo "📖 Consultez DEPLOYMENT.md pour plus de détails" 