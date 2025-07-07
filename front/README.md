# Application Frontend

Application web moderne construite avec Next.js, offrant une interface utilisateur réactive et élégante pour votre plateforme de services.

## 🚀 Fonctionnalités

- **Next.js 15** : Framework React moderne avec App Router
- **TypeScript** : Typage statique pour une meilleure robustesse
- **Paiements Stripe** : Intégration complète des paiements
- **Interface réactive** : Design adaptatif pour tous les appareils
- **Composants réutilisables** : Architecture modulaire
- **Optimisations performances** : Turbopack pour un développement rapide

## 📋 Prérequis

- Node.js (version 18 ou supérieure)
- npm ou yarn
- Compte Stripe (pour les paiements)

## 🛠️ Installation

```bash
# Cloner le repository
git clone <url-du-repository>

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
```

## ⚙️ Configuration

Créez un fichier `.env.local` avec les variables suivantes :

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=votre-secret-nextauth
```

## 🚀 Démarrage

```bash
# Développement (avec Turbopack)
npm run dev

# Production
npm run build
npm start

# Linting
npm run lint
```

## 📱 Pages et Fonctionnalités

### Pages Principales

- **Accueil** : Présentation des services
- **Authentification** : Connexion et inscription
- **Tableau de bord** : Interface utilisateur principale
- **Paiements** : Gestion des abonnements et paiements
- **Profil** : Gestion du compte utilisateur

### Composants

- **Layout** : Structure générale de l'application
- **Header/Footer** : Navigation et informations
- **Forms** : Formulaires réactifs avec validation
- **Cards** : Composants d'affichage des données
- **Modals** : Fenêtres modales pour les interactions

## 🎨 Design System

### Couleurs

- **Primary** : Bleu (#3B82F6)
- **Secondary** : Gris (#6B7280)
- **Success** : Vert (#10B981)
- **Warning** : Orange (#F59E0B)
- **Error** : Rouge (#EF4444)

### Typographie

- **Headings** : Inter Bold
- **Body** : Inter Regular
- **Code** : JetBrains Mono

## 🔧 Technologies Utilisées

- **Next.js 15** : Framework React
- **React 19** : Bibliothèque UI
- **TypeScript** : Typage statique
- **TailwindCSS** : Framework CSS
- **Stripe** : Paiements en ligne
- **Lucide React** : Icônes
- **React Icons** : Icônes supplémentaires

## 🛡️ Sécurité

- Authentification sécurisée
- Validation côté client et serveur
- Protection CSRF
- Sanitisation des données
- HTTPS en production

## 📊 Performance

- **Optimisations Next.js** : SSR, SSG, ISR
- **Lazy loading** : Chargement différé des composants
- **Optimisation images** : next/image
- **Bundle splitting** : Séparation du code
- **Caching** : Mise en cache intelligente

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests end-to-end
npm run test:e2e

# Coverage
npm run test:coverage
```

## 📝 Licence

ISC

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez suivre les conventions de code et créer une issue avant de soumettre une pull request.

## 📞 Support

Pour toute question ou problème, n'hésitez pas à créer une issue sur le repository.
