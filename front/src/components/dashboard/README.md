# Composants Dashboard

Ce dossier contient tous les composants nécessaires pour créer des tableaux de bord dynamiques et informatifs.

## Composants Disponibles

### 1. UserDashboard

Tableau de bord pour les utilisateurs classiques avec :

- Statistiques personnelles (opportunités, deals, contacts, tâches)
- Graphique de performance mensuelle
- Activité récente
- Liste des prochaines actions

### 2. ManagerDashboard

Tableau de bord pour les managers et administrateurs avec :

- Statistiques de l'équipe
- Performance des membres
- Vue d'ensemble du pipeline commercial
- Alertes et notifications

### 3. QuickStats

Composant réutilisable pour afficher des statistiques avec icônes et couleurs personnalisables.

### 4. SimpleChart

Composant de graphique simple pour visualiser des données avec des barres de progression.

## Utilisation

```tsx
import { UserDashboard, ManagerDashboard } from "@/components/dashboard";

// Dans votre composant
const Dashboard = () => {
  const isManager = user?.role === "manager";

  return <div>{isManager ? <ManagerDashboard /> : <UserDashboard />}</div>;
};
```

## Personnalisation

Tous les composants utilisent les styles définis dans `@/styles/pages/dashboard/dashboardStyles.ts`. Vous pouvez facilement modifier les couleurs, espacements et autres propriétés visuelles.

## Données

Les composants utilisent actuellement des données fictives. Pour les intégrer avec de vraies données :

1. Remplacez les objets de données statiques par des appels API
2. Utilisez des hooks comme `useState` et `useEffect` pour gérer l'état
3. Ajoutez des indicateurs de chargement et de gestion d'erreur

## Responsive Design

Les composants sont conçus pour être responsifs et s'adapter automatiquement à différentes tailles d'écran grâce à l'utilisation de CSS Grid et Flexbox.
