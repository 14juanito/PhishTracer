# PhishTracer

PhishTracer est une application web moderne permettant de détecter et tracer les tentatives de phishing à partir d'URL suspectes. Elle propose une interface utilisateur intuitive et un backend sécurisé avec intégration de l'API CheckPhish.

### 🚀 Fonctionnalités principales

- **🔍 Analyse d'URL** : Détection de phishing via l'API Google Safe
- **👥 Gestion des utilisateurs** : Inscription, connexion, rôles (user/admin)
- **📊 Tableau de bord** : Interface utilisateur et administrateur
- **📈 Historique des scans** : Suivi complet des analyses effectuées
- **🔔 Notifications de sécurité** : Alertes en temps réel
- **🛡️ Authentification sécurisée** : JWT, hashage des mots de passe
- **💾 Base de données MySQL** : Stockage robuste et performant

## 🛠️ Technologies utilisées

### Frontend
- **React 18** - Interface utilisateur moderne
- **TailwindCSS** - Styling et design responsive
- **Axios** - Requêtes HTTP vers l'API
- **Framer Motion** - Animations fluides
- **Vite** - Build tool rapide

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web
- **MySQL** - Base de données relationnelle
- **Sequelize** - ORM pour MySQL
- **JWT** - Authentification sécurisée
- **bcryptjs** - Hashage des mots de passe

### API Externe
- **Google  Safe** - Détection de phishing avancée

## 📋 Prérequis

- **Node.js** >= 16
- **MySQL** >= 8.0
- **npm** ou **yarn**

## 🚀 Installation

### 1. Cloner le projet
```bash
git clone [URL_DU_REPO]
cd PhishTracer-1.0
```

### 2. Configuration de la base de données
```bash
# Démarrer MySQL
brew services start mysql

# Créer la base de données
mysql -u root -e "CREATE DATABASE IF NOT EXISTS phishtracer;"
```

### 3. Configuration des variables d'environnement
Créer un fichier `.env` dans le dossier `backend/` :
```env
# Configuration MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=phishtracer
DB_USER=root
DB_PASSWORD=ton_mot_de_passe

# Configuration serveur
PORT=5000
NODE_ENV=development

# Configuration JWT
JWT_SECRET=PhishTracer_SuperSecretKey_2024_Secure
JWT_EXPIRE=24h
```

### 4. Installation des dépendances
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

### 5. Démarrage de l'application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🌐 Accès à l'application

- **Frontend** : http://localhost:5173 (ou port suivant disponible)
- **Backend API** : http://localhost:5000
- **Admin par défaut** : admin@phishtracer.com / admin123

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur connecté
- `POST /api/auth/logout` - Déconnexion

### Scans CheckPhish
- `POST /api/scans/check` - Lancer une analyse d'URL
- `POST /api/scans/status` - Récupérer le résultat d'un scan
- `GET /api/scans/my-scans` - Historique des scans utilisateur
- `DELETE /api/scans/:id` - Supprimer un scan

### Administration
- `GET /api/admin/users` - Liste des utilisateurs
- `GET /api/admin/scans` - Tous les scans
- `GET /api/admin/stats` - Statistiques du dashboard
- `DELETE /api/admin/users/:id` - Supprimer un utilisateur
- `DELETE /api/admin/scans/:id` - Supprimer un scan

## 🗄️ Structure de la base de données

### Table `users`
- `id` - Identifiant unique
- `name` - Nom de l'utilisateur
- `email` - Email unique
- `password` - Mot de passe hashé
- `role` - Rôle (user/admin)
- `isActive` - Statut actif
- `lastLogin` - Dernière connexion
- `createdAt/updatedAt` - Timestamps

### Table `scans`
- `id` - Identifiant unique
- `userId` - Référence utilisateur
- `url` - URL analysée
- `jobId` - ID CheckPhish
- `status` - Statut du scan
- `disposition` - Résultat (phish/safe/unknown)
- `brand` - Marque ciblée
- `insights` - Lien insights CheckPhish
- `screenshotPath` - Capture d'écran
- `categories` - Catégories de détection
- `createdAt/updatedAt` - Timestamps

## 📁 Structure du projet

```
PhishTracer-1.0/
├── src/                    # Frontend React
│   ├── components/         # Composants réutilisables
│   ├── pages/             # Pages de l'application
│   ├── contexts/          # Contextes React
│   └── utils/             # Utilitaires
├── backend/               # Backend Node.js
│   ├── src/
│   │   ├── config/        # Configuration (DB, etc.)
│   │   ├── controllers/   # Contrôleurs API
│   │   ├── models/        # Modèles Sequelize
│   │   ├── routes/        # Routes API
│   │   └── middleware/    # Middleware Express
│   └── package.json
├── database_schema.sql    # Schéma de la base de données
├── database_queries.sql   # Requêtes SQL utiles
└── README.md
```

## 🔧 Scripts utiles

### Base de données
```bash
# Sauvegarder la base
mysqldump -u root phishtracer > backup.sql

# Restaurer la base
mysql -u root phishtracer < backup.sql

# Voir les requêtes utiles
cat database_queries.sql
```

### Développement
```bash
# Redémarrer le backend
cd backend && npm run dev

# Redémarrer le frontend
npm run dev

# Vérifier les processus
ps aux | grep node
```

## 🚀 Déploiement sur Vercel

### Déploiement Rapide
```bash
# Déploiement automatique
./deploy.sh

# Ou déploiement manuel
npm i -g vercel
vercel login
vercel --prod
```

### Configuration
1. Configurez les variables d'environnement dans Vercel Dashboard
2. Déployez le backend séparément
3. Mettez à jour `VITE_API_URL` avec l'URL du backend

📖 **Consultez `QUICK_DEPLOY.md` pour un guide détaillé**

## 🐛 Dépannage

### Erreur de connexion MySQL
```bash
# Vérifier que MySQL tourne
brew services list | grep mysql

# Redémarrer MySQL
brew services restart mysql
```

### Erreur ECONNREFUSED
- Vérifier que le backend tourne sur le port 5000
- Vérifier la configuration du proxy dans `vite.config.js`

### Erreur de base de données
- Vérifier les variables d'environnement dans `.env`
- Vérifier que la base `phishtracer` existe

## 📝 Notes de développement

- L'API CheckPhish nécessite une clé API valide
- Les mots de passe sont automatiquement hashés avec bcrypt
- Les sessions utilisent JWT avec expiration de 24h
- La base de données se synchronise automatiquement au démarrage

## 👨‍💻 Auteur

Projet développé par [Votre Nom] - 2024

## 📄 Licence

Ce projet est sous licence [VOTRE_LICENCE]. 
