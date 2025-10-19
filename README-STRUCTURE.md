# Application de Facturation - Structure Modulaire

## 🏗️ Structure du Projet

Votre application a été refactorisée pour une meilleure organisation et maintenabilité :

```
src/
├── components/           # Composants React réutilisables
│   ├── common/          # Composants partagés
│   │   └── Modal.tsx    # Composant modal générique
│   ├── ventes/          # Composants liés aux ventes
│   │   └── AddVenteForm.tsx
│   ├── projections/     # Composants des projections
│   │   └── ProjectionTable.tsx
│   └── partenaires/     # Composants des partenaires
│       ├── PartnerManager.tsx
│       └── PartenaireForm.tsx
├── hooks/               # Hooks React personnalisés
│   └── useCommissionData.ts  # Logique métier principale
├── types/               # Types TypeScript
│   └── index.ts         # Interfaces et types partagés
├── utils/               # Fonctions utilitaires
│   ├── dataLoader.ts    # Données initiales
│   ├── formatters.ts    # Fonctions de formatage
│   └── projections.ts   # Logique de calcul des projections
├── styles/              # Styles CSS organisés
│   ├── index.css        # Point d'entrée des styles
│   ├── global.css       # Styles globaux de l'app
│   ├── buttons.css      # Styles des boutons
│   ├── modal.css        # Styles de la modal
│   ├── forms.css        # Styles des formulaires
│   ├── projections.css  # Styles des projections
│   └── partenaires.css  # Styles des partenaires
├── App.tsx              # Composant principal (orchestrateur)
├── main.tsx             # Point d'entrée de l'application
└── style.css            # ⚠️ Ancien fichier (peut être supprimé)
```

## 🎯 Avantages de cette Structure

### ✅ **Maintenabilité**
- Code organisé en modules logiques
- Séparation claire des responsabilités
- Facile à naviguer et comprendre

### ✅ **Réutilisabilité**
- Composants modulaires et réutilisables
- Hooks personnalisés partageables
- Fonctions utilitaires centralisées

### ✅ **Scalabilité**
- Structure extensible pour nouvelles fonctionnalités
- Types TypeScript pour une meilleure documentation du code
- Styles organisés par domaine fonctionnel

### ✅ **Développement**
- Imports plus clairs et organisés
- Tests unitaires plus faciles à écrire
- Collaboration d'équipe facilitée

## 🔧 Comment Ajouter de Nouvelles Fonctionnalités

### Nouveau Composant
1. Créer le fichier dans `src/components/[domaine]/`
2. Ajouter les types nécessaires dans `src/types/index.ts`
3. Créer les styles associés dans `src/styles/`
4. Importer et utiliser dans `App.tsx`

### Nouvelle Logique Métier
1. Créer un nouveau hook dans `src/hooks/`
2. Ou ajouter une fonction utilitaire dans `src/utils/`

### Nouveaux Types
1. Ajouter dans `src/types/index.ts`
2. Exporter pour utilisation dans toute l'app

## 📁 Fichiers Principaux

- **`App.tsx`** : Orchestrateur principal, gère la navigation et les états globaux
- **`useCommissionData.ts`** : Contient toute la logique métier (state management)
- **`types/index.ts`** : Définitions TypeScript centralisées
- **`styles/index.css`** : Point d'entrée de tous les styles

## 🚀 Commandes Disponibles

```bash
# Démarrer le serveur de développement
pnpm run dev

# Build de production
pnpm run build

# Prévisualiser le build
pnpm run preview
```

## 📝 Notes Techniques

- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **CSS moderne** avec variables et grid/flexbox
- **Hooks personnalisés** pour la logique métier
- **Types stricts** pour une meilleure DX

---

✨ **Votre application est maintenant plus organisée, maintenable et prête pour évoluer !**