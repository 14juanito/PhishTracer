# Guide de Déploiement sur Vercel

## Prérequis

1. Avoir un compte Vercel (gratuit)
2. Avoir Git installé
3. Avoir Node.js installé (version 16+)

## Déploiement du Frontend

### 1. Préparation

```bash
# Installer les dépendances
npm install

# Tester le build localement
npm run build
```

### 2. Déploiement sur Vercel

#### Option A : Via l'interface Vercel (Recommandé)

1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec votre compte GitHub/GitLab/Bitbucket
3. Cliquez sur "New Project"
4. Importez votre repository
5. Vercel détectera automatiquement que c'est un projet Vite/React
6. Configurez les variables d'environnement :
   - `VITE_API_URL` : URL de votre backend déployé

#### Option B : Via Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter à Vercel
vercel login

# Déployer
vercel

# Pour déployer en production
vercel --prod
```

### 3. Configuration des Variables d'Environnement

Dans votre dashboard Vercel, allez dans Settings > Environment Variables et ajoutez :

```
VITE_API_URL=https://votre-backend-url.com
```

## Déploiement du Backend

### Option 1 : Vercel (Recommandé pour les petits projets)

1. Créez un nouveau projet Vercel pour le backend
2. Configurez le dossier `backend/` comme racine
3. Ajoutez un fichier `vercel.json` dans le dossier backend :

```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/index.js"
    }
  ]
}
```

### Option 2 : Autres plateformes

- **Railway** : Déploiement simple avec base de données
- **Render** : Déploiement gratuit avec base de données
- **Heroku** : Déploiement classique (payant)
- **DigitalOcean App Platform** : Déploiement scalable

## Configuration de la Base de Données

### Option 1 : Base de données cloud

- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **MongoDB Atlas** (MongoDB)
- **Railway** (PostgreSQL/MySQL)

### Option 2 : Base de données locale

Pour le développement, vous pouvez utiliser une base de données locale.

## Variables d'Environnement Backend

Configurez ces variables dans votre plateforme de déploiement :

```
DATABASE_URL=votre_url_de_base_de_donnees
JWT_SECRET=votre_secret_jwt
CORS_ORIGIN=https://votre-frontend.vercel.app
PORT=5000
```

## Mise à Jour des URLs

Après le déploiement, mettez à jour les URLs dans votre frontend :

1. Allez dans votre dashboard Vercel
2. Trouvez l'URL de votre backend
3. Mettez à jour `VITE_API_URL` avec cette URL

## Vérification du Déploiement

1. Testez votre application déployée
2. Vérifiez que les appels API fonctionnent
3. Testez l'authentification
4. Vérifiez les fonctionnalités principales

## Support

En cas de problème :
1. Vérifiez les logs dans votre dashboard Vercel
2. Testez localement avec les mêmes variables d'environnement
3. Vérifiez la configuration CORS du backend
4. Assurez-vous que toutes les variables d'environnement sont configurées 