# 🚀 Déploiement Rapide sur Vercel

## Déploiement en 5 minutes

### 1. Préparation (2 min)
```bash
# Cloner le projet (si pas déjà fait)
git clone <votre-repo>
cd PhishTracer-1.0

# Installer les dépendances
npm install
```

### 2. Déploiement Frontend (2 min)
```bash
# Option A : Via script automatique
./deploy.sh

# Option B : Manuel
npm i -g vercel
vercel login
vercel --prod
```

### 3. Configuration (1 min)
1. Allez sur [vercel.com/dashboard](https://vercel.com/dashboard)
2. Trouvez votre projet
3. Allez dans Settings > Environment Variables
4. Ajoutez : `VITE_API_URL=https://votre-backend-url.com`

## Déploiement Backend

### Option 1 : Vercel (Recommandé)
1. Créez un nouveau projet Vercel
2. Pointez vers le dossier `backend/`
3. Déployez

### Option 2 : Railway (Gratuit)
1. Allez sur [railway.app](https://railway.app)
2. Connectez votre repo
3. Sélectionnez le dossier `backend/`
4. Configurez les variables d'environnement

## Variables d'Environnement Backend

```
DATABASE_URL=votre_url_db
JWT_SECRET=votre_secret_jwt
CORS_ORIGIN=https://votre-frontend.vercel.app
```

## ✅ Vérification

1. ✅ Frontend déployé
2. ✅ Backend déployé  
3. ✅ Variables d'environnement configurées
4. ✅ Base de données connectée
5. ✅ Test de l'application

## 🆘 En cas de problème

- Vérifiez les logs dans Vercel Dashboard
- Testez localement : `npm run dev`
- Consultez `DEPLOYMENT.md` pour plus de détails 