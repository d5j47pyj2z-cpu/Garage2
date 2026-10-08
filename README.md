# 🚗 Garage Perso — Gestionnaire de véhicules

Application web 100% locale pour gérer ses véhicules personnels.

## Fonctionnalités
- Plusieurs véhicules
- Fiches véhicule
- Historique des entretiens
- Suivi carburant
- Dépenses
- Échéances et rappels
- Tableau de bord
- Export / import JSON
- Responsive téléphone / ordinateur
- Aucune base de données ni serveur nécessaire

## Installation sur GitHub Pages

1. Crée un nouveau dépôt GitHub, par exemple `garage-perso`.
2. Ajoute `index.html`, `style.css` et `app.js`.
3. Va dans **Settings → Pages**.
4. Sélectionne la branche `main` et le dossier `/root`.
5. GitHub Pages publiera automatiquement l'application.

Les données sont stockées dans le `localStorage` du navigateur. Utilise **Exporter mes données** pour faire une sauvegarde régulière.

## Structure

```text
garage-perso/
├── index.html
├── style.css
├── app.js
└── README.md
```

## V1.1
Correction du menu responsive : icônes visibles sur tablette et barre de navigation fixe en bas sur smartphone.
