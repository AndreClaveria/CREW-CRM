# Service d'Authentification

Un service d'authentification robuste et sécurisé pour votre architecture microservices, offrant une gestion complète des utilisateurs avec authentification JWT et OAuth.

## 🚀 Fonctionnalités

- **Authentification JWT** : Génération et validation de tokens sécurisés
- **OAuth Google** : Connexion simplifiée avec Google
- **Gestion des sessions** : Sessions sécurisées avec Express Session
- **Chiffrement des mots de passe** : Utilisation de bcrypt pour la sécurité
- **Documentation API** : Interface Swagger intégrée
- **Logging avancé** : Système de logs avec Winston
- **Sécurité renforcée** : Protection avec Helmet et CORS

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- MongoDB
- TypeScript
- npm ou yarn

## 🛠️ Installation

```bash
# Cloner le repository
git clone <url-du-repository>

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
```

## ⚙️ Configuration

Créez un fichier `.env` avec les variables suivantes :

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-service
JWT_SECRET=votre-secret-jwt
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=votre-client-id-google
GOOGLE_CLIENT_SECRET=votre-secret-google
SESSION_SECRET=votre-secret-session
```

## 🚀 Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## 📚 Documentation API

Une fois le service démarré, accédez à la documentation Swagger :

- URL : `http://localhost:3000/api-docs`

## 🔐 Endpoints Principaux

### Authentification

- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/profile` - Profil utilisateur

### OAuth

- `GET /api/auth/google` - Connexion Google
- `GET /api/auth/google/callback` - Callback Google

## 🧪 Tests

```bash
npm test
```

## 📁 Structure du Projet

```
src/
├── controllers/     # Contrôleurs API
├── middleware/      # Middlewares personnalisés
├── models/         # Modèles MongoDB
├── routes/         # Définition des routes
├── services/       # Logique métier
├── utils/          # Utilitaires
└── server.ts       # Point d'entrée
```

## 🔧 Technologies Utilisées

- **Express.js** : Framework web
- **TypeScript** : Typage statique
- **MongoDB** : Base de données
- **JWT** : Authentification
- **Passport** : Stratégies d'authentification
- **Winston** : Logging
- **Swagger** : Documentation API

## 🛡️ Sécurité

- Chiffrement des mots de passe avec bcrypt
- Validation des tokens JWT
- Protection CORS
- Headers de sécurité avec Helmet
- Validation des entrées

## 📝 Licence

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez créer une issue avant de soumettre une pull request.
