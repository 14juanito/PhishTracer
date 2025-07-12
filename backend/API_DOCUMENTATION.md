# API PhishTracer - Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentification
L'API utilise des cookies JWT pour l'authentification. Les cookies sont automatiquement envoyés avec chaque requête.

## Endpoints

### 🔐 Authentification

#### POST /auth/register
Inscrire un nouvel utilisateur
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### POST /auth/login
Se connecter
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Obtenir les informations de l'utilisateur connecté
- **Authentification requise**

#### GET /auth/logout
Se déconnecter

#### POST /auth/create-admin
Créer le premier administrateur
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "admin123"
}
```

### 🔍 Scans

#### GET /scans/my-scans
Obtenir tous les scans de l'utilisateur connecté
- **Authentification requise**

#### POST /scans/check
Lancer un scan de phishing
- **Authentification requise**
```json
{
  "url": "https://example.com"
}
```

#### POST /scans/status
Vérifier le statut d'un scan
- **Authentification requise**
```json
{
  "jobID": "job_id_from_check_response"
}
```

#### DELETE /scans/:id
Supprimer un scan
- **Authentification requise**

### 👨‍💼 Administration

#### GET /admin/users
Obtenir tous les utilisateurs
- **Authentification admin requise**

#### POST /admin/users
Créer un nouvel utilisateur
- **Authentification admin requise**
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}
```

#### PUT /admin/users/:id
Modifier un utilisateur
- **Authentification admin requise**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "role": "admin"
}
```

#### DELETE /admin/users/:id
Supprimer un utilisateur
- **Authentification admin requise**

#### GET /admin/scans
Obtenir tous les scans
- **Authentification admin requise**

#### DELETE /admin/scans/:id
Supprimer un scan
- **Authentification admin requise**

#### GET /admin/stats
Obtenir les statistiques de base
- **Authentification admin requise**

#### GET /admin/api-stats
Obtenir les statistiques détaillées de l'API
- **Authentification admin requise**

### 🧪 Test et Santé

#### GET /test
Tester que l'API fonctionne
```json
{
  "message": "API PhishTracer fonctionne correctement",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

#### GET /health
Vérifier la santé de l'API
```json
{
  "status": "OK",
  "database": "Connected",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Codes de réponse

- **200** : Succès
- **201** : Créé avec succès
- **400** : Requête invalide
- **401** : Non autorisé
- **404** : Non trouvé
- **500** : Erreur serveur

## Rate Limiting

- **API générale** : 100 requêtes par IP par 15 minutes
- **Authentification** : 5 tentatives par IP par 15 minutes
- **Scans** : 10 scans par utilisateur par minute

## Validation

L'API valide automatiquement :
- Format des emails
- Longueur des mots de passe (minimum 6 caractères)
- Format des URLs pour les scans
- Rôles utilisateur (user/admin)

## Gestion des erreurs

Toutes les erreurs retournent un format standard :
```json
{
  "success": false,
  "message": "Description de l'erreur",
  "errors": ["Détails des erreurs de validation"]
}
```

## Exemples d'utilisation

### Connexion et obtention des scans
```bash
# 1. Se connecter
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}' \
  -c cookies.txt

# 2. Obtenir les scans (utilise les cookies)
curl -X GET http://localhost:5000/api/scans/my-scans \
  -b cookies.txt
```

### Lancer un scan
```bash
curl -X POST http://localhost:5000/api/scans/check \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}' \
  -b cookies.txt
``` 