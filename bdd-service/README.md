# Service de Base de Données

Service centralisé de gestion des données pour votre architecture microservices, offrant une interface API RESTful pour toutes les opérations de base de données.

## 🚀 Fonctionnalités

- **API RESTful** : Interface complète pour les opérations CRUD
- **MongoDB** : Base de données NoSQL performante
- **Authentification JWT** : Sécurisation des endpoints
- **Documentation API** : Interface Swagger intégrée
- **Logging avancé** : Système de logs avec Winston
- **Validation des données** : Validation robuste des entrées
- **Sécurité** : Protection CORS et Helmet

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
PORT=3001
MONGODB_URI=mongodb://localhost:27017/database-service
JWT_SECRET=votre-secret-jwt
NODE_ENV=development
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

- URL : `http://localhost:3001/api-docs`

## 🔐 Endpoints Principaux

### Collections

- `GET /api/collections` - Liste des collections
- `POST /api/collections` - Créer une collection
- `DELETE /api/collections/:name` - Supprimer une collection

### Documents

- `GET /api/collections/:collection/documents` - Lister les documents
- `POST /api/collections/:collection/documents` - Créer un document
- `GET /api/collections/:collection/documents/:id` - Récupérer un document
- `PUT /api/collections/:collection/documents/:id` - Mettre à jour un document
- `DELETE /api/collections/:collection/documents/:id` - Supprimer un document

### Recherche

- `POST /api/collections/:collection/search` - Recherche avancée
- `GET /api/collections/:collection/aggregate` - Agrégation

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
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM pour MongoDB
- **JWT** : Authentification
- **Winston** : Logging
- **Swagger** : Documentation API

## 🛡️ Sécurité

- Authentification JWT requise
- Validation des entrées
- Protection CORS
- Headers de sécurité avec Helmet
- Limitation des accès par rôles

## 📊 Monitoring

- Logs structurés avec Winston
- Métriques de performance
- Monitoring des requêtes MongoDB

## 📝 Licence

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez créer une issue avant de soumettre une pull request.
