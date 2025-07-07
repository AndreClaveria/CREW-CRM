# Service de Paiement

Service de paiement sécurisé et robuste pour votre architecture microservices, intégrant Stripe pour une gestion complète des transactions, abonnements et facturation.

## 🚀 Fonctionnalités

- **Paiements Stripe** : Intégration complète avec Stripe
- **Gestion des abonnements** : Abonnements récurrents
- **Facturation automatique** : Génération de factures
- **Webhooks** : Traitement des événements Stripe
- **Sécurité PCI** : Conformité aux standards de sécurité
- **Multi-devises** : Support de plusieurs devises
- **API RESTful** : Interface complète pour les paiements
- **Documentation Swagger** : API documentée

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- MongoDB
- TypeScript
- Compte Stripe (clés API)
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
PORT=3004
MONGODB_URI=mongodb://localhost:27017/payment-service
JWT_SECRET=votre-secret-jwt
NODE_ENV=development

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_API_VERSION=2023-10-16

# Currency
DEFAULT_CURRENCY=eur
SUPPORTED_CURRENCIES=eur,usd,gbp
```

## 🚀 Démarrage

```bash
# Développement
npm run dev

# Production
npm run build
npm start

# Linting
npm run lint
npm run lint:fix
```

## 💳 Types de Paiements

### Paiements Uniques

- **Cartes de crédit** : Visa, Mastercard, Amex
- **Portefeuilles numériques** : Apple Pay, Google Pay
- **Virement bancaire** : SEPA, ACH
- **Crypto-monnaies** : Bitcoin, Ethereum (via Stripe)

### Abonnements

- **Mensuel** : Facturation mensuelle
- **Annuel** : Facturation annuelle
- **Freemium** : Modèle gratuit/premium
- **Usage** : Facturation à l'usage

### Facturation

- **Factures automatiques** : Génération automatique
- **Factures manuelles** : Création manuelle
- **Devis** : Génération de devis
- **Crédits** : Gestion des crédits

## 🧪 Tests

```bash
# Tests unitaires
npm test

# Tests d'intégration
npm run test:integration

# Coverage
npm run test:coverage
```

## 📁 Structure du Projet

```
src/
├── controllers/     # Contrôleurs API
│   ├── payments/   # Paiements
│   ├── customers/  # Clients
│   ├── subscriptions/ # Abonnements
│   └── webhooks/   # Webhooks
├── middleware/      # Middlewares personnalisés
├── models/         # Modèles MongoDB
├── routes/         # Définition des routes
├── services/       # Logique métier
│   ├── stripe/     # Service Stripe
│   ├── billing/    # Facturation
│   └── analytics/  # Analytics
├── utils/          # Utilitaires
├── validators/     # Validation des données
└── server.ts       # Point d'entrée
```

## 🔧 Technologies Utilisées

- **Express.js** : Framework web
- **TypeScript** : Typage statique
- **MongoDB** : Base de données
- **Mongoose** : ODM pour MongoDB
- **Stripe** : Plateforme de paiement
- **JWT** : Authentification
- **Swagger** : Documentation API
- **Winston** : Logging
- **Helmet** : Sécurité

## 🛡️ Sécurité

### Conformité PCI

- **Chiffrement** : Toutes les données sensibles
- **Tokenisation** : Tokens Stripe pour les cartes
- **HTTPS** : Communication sécurisée uniquement
- **Audit** : Logs de toutes les transactions

### Authentification

- **JWT** : Tokens sécurisés
- **RBAC** : Contrôle d'accès basé sur les rôles
- **Rate Limiting** : Protection contre les abus
- **CORS** : Configuration sécurisée

### Validation

- **Sanitisation** : Nettoyage des entrées
- **Validation stricte** : Tous les paramètres
- **Webhooks** : Vérification des signatures
- **Monitoring** : Détection des fraudes

## 📊 Analytics et Reporting

### Métriques Business

- **Revenus** : Chiffre d'affaires total
- **MRR** : Revenus récurrents mensuels
- **Churn Rate** : Taux de désabonnement
- **LTV** : Valeur vie client

### Métriques Techniques

- **Taux de succès** : Paiements réussis
- **Temps de réponse** : Performance API
- **Erreurs** : Taux d'erreur
- **Uptime** : Disponibilité du service

### Rapports

- **Transactions** : Rapport détaillé
- **Abonnements** : État des abonnements
- **Remboursements** : Historique des remboursements
- **Fraude** : Détection et prévention

## 🚨 Gestion des Erreurs

### Types d'Erreurs Stripe

- **card_error** : Erreur de carte
- **api_connection_error** : Problème de connexion
- **api_error** : Erreur API Stripe
- **authentication_error** : Erreur d'authentification
- **idempotency_error** : Erreur d'idempotence
- **invalid_request_error** : Requête invalide
- **rate_limit_error** : Limite de débit atteinte

### Retry Logic

- **Exponential Backoff** : Délais croissants
- **Circuit Breaker** : Protection des services
- **Dead Letter Queue** : Messages échoués
- **Monitoring** : Alertes en temps réel

## 🔄 Webhooks Stripe

### Événements Gérés

- **payment_intent.succeeded** : Paiement réussi
- **payment_intent.payment_failed** : Paiement échoué
- **invoice.payment_succeeded** : Facture payée
- **invoice.payment_failed** : Facture impayée
- **customer.subscription.created** : Abonnement créé
- **customer.subscription.updated** : Abonnement modifié
- **customer.subscription.deleted** : Abonnement supprimé

### Traitement

- **Idempotence** : Éviter les doublons
- **Retry** : Nouvelle tentative automatique
- **Logging** : Traçabilité complète
- **Notifications** : Alertes automatiques

## 📈 Performance

### Optimisations

- **Connection Pooling** : Optimisation MongoDB
- **Caching** : Mise en cache des données fréquentes
- **Async Processing** : Traitement asynchrone
- **Database Indexing** : Index optimisés

### Monitoring

- **APM** : Monitoring des performances
- **Metrics** : Métriques détaillées
- **Alerts** : Alertes en temps réel
- **Dashboards** : Tableaux de bord

## 🌍 Internationalisation

### Devises Supportées

- **EUR** : Euro
- **USD** : Dollar américain
- **GBP** : Livre sterling
- **JPY** : Yen japonais
- **CAD** : Dollar canadien

### Localisation

- **Français** : Interface en français
- **Anglais** : Interface en anglais
- **Formats** : Formats locaux (dates, nombres)
- **Taxes** : Gestion des taxes locales

## 📝 Licence

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre les conventions de code et créer une issue avant de soumettre une pull request.

## 📞 Support

Pour toute question relative aux paiements ou problème technique, n'hésitez pas à créer une issue sur le repository.
