# Service de Métriques

Service de collecte, traitement et analyse des métriques pour votre architecture microservices, offrant une visibilité complète sur les performances et l'utilisation de vos services.

## 🚀 Fonctionnalités

- **Collecte de métriques** : Agrégation des données de performance
- **Analyse en temps réel** : Traitement des données en temps réel
- **Tableaux de bord** : Visualisation des métriques
- **Alertes** : Notifications automatiques sur les seuils
- **API RESTful** : Interface complète pour les métriques
- **Validation des données** : Validation robuste avec Joi
- **Logging avancé** : Système de logs avec Winston

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
PORT=3002
MONGODB_URI=mongodb://localhost:27017/metrics-service
JWT_SECRET=votre-secret-jwt
NODE_ENV=development
METRICS_RETENTION_DAYS=30
ALERT_WEBHOOK_URL=https://hooks.slack.com/services/...
```

## 🚀 Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start
```

## 📊 Types de Métriques

### Métriques Système

- **CPU** : Utilisation du processeur
- **Mémoire** : Consommation mémoire
- **Disque** : Espace disque utilisé
- **Réseau** : Trafic réseau

### Métriques Application

- **Requêtes** : Nombre et temps de réponse
- **Erreurs** : Taux d'erreur et types
- **Utilisateurs** : Utilisateurs actifs
- **Performances** : Temps de chargement

### Métriques Métier

- **Conversions** : Taux de conversion
- **Revenus** : Métriques financières
- **Engagement** : Interaction utilisateur
- **Rétention** : Rétention des utilisateurs

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
├── validators/     # Validation Joi
└── server.ts       # Point d'entrée
```

## 🔧 Technologies Utilisées

- **Express.js** : Framework web
- **TypeScript** : Typage statique
- **MongoDB** : Base de données
- **Mongoose** : ODM pour MongoDB
- **Joi** : Validation des données
- **Axios** : Client HTTP
- **Winston** : Logging
- **Swagger** : Documentation API

## 📈 Visualisation

### Tableaux de Bord

- **Vue d'ensemble** : Métriques principales
- **Performance** : Graphiques de performance
- **Utilisation** : Analyses d'utilisation
- **Alertes** : État des alertes

### Graphiques

- **Séries temporelles** : Évolution dans le temps
- **Histogrammes** : Distribution des valeurs
- **Graphiques circulaires** : Répartition
- **Cartes de chaleur** : Visualisation dense

## 🚨 Système d'Alertes

### Types d'Alertes

- **Seuils** : Valeurs limites
- **Tendances** : Évolution anormale
- **Anomalies** : Détection automatique
- **Disponibilité** : Service down

### Notifications

- **Email** : Notifications par email
- **Slack** : Intégration Slack
- **Webhook** : Webhooks personnalisés
- **SMS** : Notifications SMS

## 🛡️ Sécurité

- Authentification JWT
- Validation des entrées
- Protection CORS
- Chiffrement des données sensibles
- Audit trail

## 📊 Monitoring

- Logs structurés
- Métriques de performance
- Monitoring des requêtes
- Alertes automatiques

## 🔄 Intégrations

### Services Externes

- **Prometheus** : Métriques
- **Grafana** : Visualisation
- **ElasticSearch** : Recherche
- **InfluxDB** : Série temporelle

### APIs

- **REST** : API RESTful
- **GraphQL** : Requêtes flexibles
- **WebSockets** : Temps réel
- **Webhooks** : Notifications

## 📝 Licence

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez créer une issue avant de soumettre une pull request.
