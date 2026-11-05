# Documentation d'Architecture, Installation et Déploiement Cloudflare Workers

Cette application **NOVA_AI** combine :
- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS (v4)
- **Backend Edge** : Cloudflare Workers avec le framework HTTP **Hono**, validation de données **Zod**, et intégration native **Cloudflare D1 (SQL)** et **Cloudflare R2 (Stockage)**
- **Shared** : Schémas Zod et types TypeScript partagés entre le worker et le client React

---

## 1. Structure du Projet

```text
├── index.html                   # Entry point HTML avec Inter Font (400, 500, 600, 700)
├── wrangler.jsonc               # Configuration Cloudflare Workers & bindings (D1, R2, Assets)
├── vite.config.ts               # Configuration Vite avec middleware Hono pour dev local
├── src/
│   ├── shared/                  # Types et schémas partagés
│   │   ├── schemas.ts           # Schémas Zod (Consultation, Contact, Demo)
│   │   └── types.ts             # Interfaces TypeScript & CloudflareEnv
│   ├── worker/                  # Backend Cloudflare Worker
│   │   ├── index.ts             # Application Hono REST API & Cloudflare Edge handler
│   │   └── schema.sql           # Schéma SQL pour Cloudflare D1
│   └── client/                  # Frontend React
│       ├── main.tsx             # Point d'entrée React
│       ├── App.tsx              # Page principale & composition
│       ├── index.css            # Styles Tailwind v4, Inter font & dark theme
│       ├── components/
│       │   ├── Navbar.tsx           # Barre de navigation fixe avec logo & navigation
│       │   ├── ScrollVideo.tsx      # Arrière-plan vidéo synchronisé au défilement
│       │   ├── SectionOne.tsx       # Section Héro (Clear. Precise. Automated.)
│       │   ├── SectionTwo.tsx       # Section Capacité (Learn to see brilliantly.)
│       │   ├── ConsultationModal.tsx# Modale de prise de rendez-vous avec Mitha
│       │   ├── DemoModal.tsx        # Démo interactive connectée à l'API Worker
│       │   └── ProjectsModal.tsx    # Modal vitrine des 6 projets
│       └── hooks/
│           ├── useScrollProgress.ts # Calcul du scroll normalisé (0 à 1) avec lerp
│           └── useRevealAnimation.ts# IntersectionObserver pour apparition staggered
```

---

## 2. Compatibilité Cloudflare Workers

- **Aucune dépendance à Node.js / Express** : Utilisation exclusive des APIs Fetch standards (Request, Response, Headers) et du framework Hono.
- **Base de données SQL D1** : Schéma SQLite managé par Cloudflare (`src/worker/schema.sql`).
- **Mode Développeur Hybride** : Pendant le développement avec `npm run dev`, Vite émule l'appel worker via le fetch handler Hono natif, garantissant un comportement identique à la production.

---

## 3. Commandes npm

| Commande | Description |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement Vite (frontend + API Hono sur le port 3000) |
| `npm run build` | Compile le frontend React dans `dist/` pour le déploiement Cloudflare Assets |
| `npm run wrangler:dev` | Lance l'émulateur local Cloudflare Workers avec Wrangler |
| `npm run wrangler:deploy` | Déploie l'application complète (Assets + Worker) sur Cloudflare |
| `npm run d1:create` | Crée la base de données D1 sur votre compte Cloudflare |
| `npm run d1:migrate` | Applique le schéma SQL sur la base D1 distante |
| `npm run lint` | Vérifie les types TypeScript (`tsc --noEmit`) |

---

## 4. Guide de Déploiement pas-à-pas sur Cloudflare

### Étape 1 : Connexion à Cloudflare
```bash
npx wrangler login
```

### Étape 2 : Créer la base Cloudflare D1
```bash
npx wrangler d1 create novaai-db
```
Wrangler affichera votre `database_id`. Copiez-le dans le fichier `wrangler.jsonc` :
```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "novaai-db",
    "database_id": "VOTRE_DATABASE_ID_ICI"
  }
]
```

### Étape 3 : Initialiser le schéma D1
```bash
# Pour le dev local :
npx wrangler d1 execute novaai-db --local --file=./src/worker/schema.sql

# Pour la production Cloudflare :
npx wrangler d1 execute novaai-db --remote --file=./src/worker/schema.sql
```

### Étape 4 (Optionnelle) : Créer le bucket R2
```bash
npx wrangler r2 bucket create novaai-storage
```

### Étape 5 : Compiler le frontend et déployer avec Wrangler
```bash
# 1. Build du frontend
npm run build

# 2. Déploiement Worker + Static Assets
npx wrangler deploy
```

Votre site sera immédiatement accessible mondialement sur le réseau Anycast de Cloudflare, avec une latence < 30ms et zéro serveur Node.js à gérer.
