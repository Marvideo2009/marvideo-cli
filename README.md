# 🚀 mar.js — CLI Modulaire par The Marvideoverse

**mar.js** est un outil CLI personnalisé, extensible avec des plugins, pour générer, analyser et déployer des projets JavaScript/TypeScript de façon rapide et stylée.

> 🛠️ Pensé pour les créateurs, les makers, et ceux qui veulent coder avec élégance.

---

## 🧰 Fonctionnalités principales

- 🎬 Création rapide de projets React/Tailwind/TS
- ✨ Signature visuelle by The Marvideoverse intégrée automatiquement
- 🔌 Système de plugins ultra-flexible
- 📦 Analyse de code intelligente
- 📤 Déploiement Git en un clic
- 📝 Génération automatique de README

---

## ⚙️ Installation

### 1. 📦 Prérequis

- [Node.js](https://nodejs.org/) ≥ 18
- [pnpm](https://pnpm.io/) ≥ 8
- Git

---

### 2. 📁 Cloner l'outil

```bash
git clone https://github.com/Marvideo2009/marvideo-cli.git
cd mar-cli
````

---

### 3. ✅ Rendre le CLI globalement accessible

```bash
pnpm install
pnpm link
```

Tu peux maintenant utiliser la commande `mar` n’importe où dans ton terminal ✨

---

## 🚀 Utilisation

### Créer un nouveau projet React/Tailwind/TS avec le style The Marvideoverse

```bash
mar create nom-projet
```

### Générer un fichier README automatiquement

```bash
mar plugin readme-generator "NomProjet" "Une courte description" React Vite Tailwind
```

### Scanner intelligemment le code source

```bash
mar plugin analyze
```

---

## 🔌 Ajouter un plugin depuis un dépôt Git

```bash
mar install-plugin https://github.com/utilisateur/monplugin.git
```

Tous les plugins sont stockés dans le dossier `plugins/` à côté de `mar.js` pour un contrôle total et une simplicité maximale.

---

## 📃 Liste des plugins fournis

| Plugin             | Description                             |
| ------------------ | --------------------------------------- |
| `analyze`          | Analyse le code et compte les lignes    |
| `deploy`           | Pousse les commits vers une branche Git |
| `readme-generator` | Crée un README.md complet               |

---

## 📁 Structure du projet

```text
mar-cli/
├── mar.js                # Le cœur du CLI
├── plugins/              # Dossier contenant tous les plugins
│   ├── analyze.js
│   ├── deploy.js
│   └── readme-generator.js
└── package.json
```

---

## ✍️ Signature Marvideo

Tous les projets générés sont stylisés avec une base React/Tailwind custom, et optimisés pour un design épuré, sombre et professionnel.

---

## ❤️ Contribuer

1. Fork ce dépôt
2. Ajoute tes plugins dans le dossier `plugins/`
3. Crée une PR

---

## 🔐 Sécurité

Certaines dépendances comme `esbuild` ou `@tailwindcss/oxide` nécessitent l'approbation explicite lors de l'installation :

```bash
pnpm approve-builds
```

---

## 📢 Licence

Projet open-source sous licence MIT.

---

> Créé avec passion par **Marvideo**
