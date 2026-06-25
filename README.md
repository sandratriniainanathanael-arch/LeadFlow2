# LeadFlow

Plateforme SaaS de génération de prospects B2B. L'utilisateur saisit un type
d'entreprise, une ville et un pays ; LeadFlow collecte automatiquement le
nom de l'entreprise, son téléphone, son email, son site web, sa page
LinkedIn, sa note Google et son adresse. Les résultats sont visibles
gratuitement ; les emails, téléphones et exports CSV/Excel sont déverrouillés
via un paiement Lemon Squeezy.

---

## Stack technique

| Couche          | Techno                                  |
|-----------------|------------------------------------------|
| Frontend        | Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Framer Motion |
| Backend         | Next.js API Routes                       |
| Base de données | Neon PostgreSQL                          |
| ORM             | Prisma                                   |
| Authentification| Clerk (email + Google OAuth)             |
| Paiement        | Lemon Squeezy                            |
| Déploiement     | Vercel                                   |

---

## Arborescence du projet

```
leadflow/
├── .env.example                  # Toutes les variables d'environnement requises
├── prisma/
│   ├── schema.prisma              # Schéma Prisma (Users, Searches, Leads, Payments, Exports, Subscriptions...)
│   ├── seed.ts                    # Script de seed (admin + utilisateur démo + leads d'exemple)
│   └── sql/schema.sql             # Équivalent SQL brut du schéma, pour Neon / CI
├── public/
│   ├── favicon.ico, favicon-*.png, apple-touch-icon.png, icon-*.png
│   ├── og-image.png               # Image OpenGraph / Twitter Card générée
│   └── site.webmanifest
├── src/
│   ├── app/
│   │   ├── page.tsx                       # Homepage (Hero, Features, How it works, Pricing, CTA)
│   │   ├── layout.tsx                     # Layout racine (fonts, ClerkProvider, ThemeProvider, metadata SEO)
│   │   ├── sitemap.ts / robots.ts         # SEO technique généré dynamiquement
│   │   ├── about/page.tsx                 # Page About (mission, vision, qualité des données)
│   │   ├── faq/page.tsx                   # FAQ (Accordion + JSON-LD FAQPage)
│   │   ├── blog/page.tsx                  # Liste des articles
│   │   ├── blog/[slug]/page.tsx           # Détail d'un article (SEO + JSON-LD Article)
│   │   ├── contact/page.tsx               # Formulaire de contact
│   │   ├── terms/page.tsx                 # Terms of Service
│   │   ├── privacy/page.tsx               # Privacy Policy
│   │   ├── affiliate/page.tsx             # Programme d'affiliation
│   │   ├── api-docs/page.tsx              # Documentation API publique
│   │   ├── sign-in/[[...sign-in]]/        # Page de connexion Clerk
│   │   ├── sign-up/[[...sign-up]]/        # Page d'inscription Clerk
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                 # Layout avec sidebar
│   │   │   ├── page.tsx                   # Formulaire de recherche + historique récent
│   │   │   ├── results/[id]/page.tsx      # Table de résultats (leads verrouillés/déverrouillés)
│   │   │   ├── history/page.tsx           # Historique complet des recherches
│   │   │   └── settings/page.tsx          # Plan, thème, notifications
│   │   ├── admin/
│   │   │   ├── layout.tsx                 # Garde d'accès (isAdmin requis)
│   │   │   ├── page.tsx                   # Dashboard analytics (revenus, utilisateurs, graphique)
│   │   │   ├── users/page.tsx             # Gestion des utilisateurs
│   │   │   └── revenue/page.tsx           # Historique des paiements
│   │   └── api/
│   │       ├── search/route.ts            # POST lance une recherche, GET liste l'historique
│   │       ├── search/[id]/route.ts       # Détail d'une recherche (avec masquage des champs verrouillés)
│   │       ├── leads/unlock/route.ts      # Déverrouille les leads d'une recherche (plan payant requis)
│   │       ├── export/route.ts            # Export CSV / XLSX
│   │       ├── checkout/route.ts          # Crée une session de paiement Lemon Squeezy
│   │       ├── webhooks/lemonsqueezy/     # Webhook paiements/abonnements
│   │       ├── webhooks/clerk/            # Webhook synchronisation utilisateurs
│   │       ├── account/route.ts           # Profil + usage de l'utilisateur courant
│   │       ├── notifications/route.ts     # Liste / marque comme lues
│   │       ├── contact/route.ts           # Formulaire de contact
│   │       └── admin/{users,stats}/       # Endpoints admin protégés
│   ├── components/
│   │   ├── layout/                # Navbar, Footer, Logo
│   │   ├── marketing/             # Hero, Features, Pricing, HowItWorks/CTA, ContactForm
│   │   ├── dashboard/             # SearchForm, ResultsTable, Sidebar, ThemeToggle, NotificationsPanel
│   │   ├── admin/                 # StatCard, SearchesChart, UsersTable
│   │   └── ui/                    # Composants shadcn/ui (Button, Card, Input, Select, Dialog, etc.)
│   ├── lib/
│   │   ├── auth.ts                # Provisioning JIT du User + limites de plan
│   │   ├── db.ts                  # Client Prisma singleton
│   │   ├── lead-pipeline.ts       # Orchestrateur : Google Places → Hunter → Abstract → Apify
│   │   ├── lemonsqueezy.ts        # Création de session de checkout
│   │   ├── utils.ts               # cn(), maskEmail(), maskPhone(), formatCurrency()...
│   │   ├── integrations/
│   │   │   ├── google-places.ts   # Découverte d'entreprises (+ fallback mock déterministe)
│   │   │   ├── hunter.ts          # Recherche/vérification d'emails
│   │   │   ├── abstract.ts        # Validation email + téléphone
│   │   │   └── apify.ts           # Enrichissement LinkedIn / scraping de site
│   │   └── data/
│   │       ├── faq.ts             # 5 questions FAQ
│   │       └── blog-posts/        # 3 articles de blog (≤200 mots chacun)
│   ├── types/lead.ts               # Types partagés RawLead / SearchParams
│   └── middleware.ts                # Protection des routes (Clerk) + garde admin
├── next.config.js
├── tailwind.config.ts              # Design tokens LeadFlow (couleurs, ombres, animations)
├── tsconfig.json
└── package.json
```

---

## Modèle de données (Prisma)

- **User** — compte, plan (FREE / STARTER / PRO), quota de leads, rôle admin
- **Search** — une recherche (type d'entreprise, ville, pays, statut)
- **Lead** — un résultat de recherche (coordonnées, vérifications, source, verrouillage)
- **Payment** — paiements one-off (Starter) et abonnements (Pro) via Lemon Squeezy
- **Subscription** — état de l'abonnement récurrent (actif, annulé, en pause...)
- **Export** — historique des exports CSV / Excel
- **Notification** — notifications in-app
- **BlogPost** — miroir optionnel en base des articles de blog statiques

Le schéma complet est dans `prisma/schema.prisma`. Une version SQL brute
équivalente est fournie dans `prisma/sql/schema.sql` si vous préférez
appliquer le schéma manuellement sur Neon plutôt que via Prisma Migrate.

---

## Intégrations API (vraies API + repli automatique en mode démo)

Chaque intégration appelle la vraie API si la clé correspondante est
présente dans `.env`, et **bascule automatiquement sur des données mock
déterministes** si la clé est absente — le produit reste donc démontrable
sans aucune configuration.

| Service                  | Variable d'env             | Rôle                                      |
|---------------------------|-----------------------------|--------------------------------------------|
| Google Places             | `GOOGLE_MAPS_API_KEY`       | Découverte des entreprises (nom, adresse, note, téléphone, site) |
| Hunter.io                 | `HUNTER_API_KEY`            | Recherche et vérification d'emails par domaine |
| Abstract API (email)      | `ABSTRACT_API_KEY`          | Validation de la délivrabilité des emails |
| Abstract API (téléphone)  | `ABSTRACT_PHONE_API_KEY`    | Validation du format/de la portée des numéros |
| Apify                     | `NEXT_PUBLIC_APIFY_TOKEN`   | Enrichissement LinkedIn + scraping de site web |
| Google OAuth (via Clerk)  | `GOOGLE_CLIENT_ID` / `_SECRET` | Connexion "Sign in with Google" |

---

## Installation locale

### Prérequis
- Node.js ≥ 18.18
- Un projet [Neon](https://neon.tech) (PostgreSQL serverless)
- Un compte [Clerk](https://clerk.com)
- Un compte [Lemon Squeezy](https://lemonsqueezy.com)
- (Optionnel) Clés Google Maps, Hunter.io, Abstract API, Apify pour le mode production

### Étapes

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement et renseigner vos clés
cp .env.example .env

# 3. Générer le client Prisma et appliquer le schéma sur Neon
npx prisma generate
npm run db:push

# 4. (Optionnel) Peupler la base avec un compte admin + données de démo
npm run db:seed

# 5. Lancer le serveur de développement
npm run dev
```

L'application est disponible sur `http://localhost:3000`.

### Configuration Clerk
1. Créez une application Clerk, activez "Email" et "Google" comme méthodes de connexion.
2. Copiez `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` et `CLERK_SECRET_KEY` dans `.env`.
3. Ajoutez un webhook Clerk vers `https://votredomaine.com/api/webhooks/clerk` (événements `user.created`, `user.updated`, `user.deleted`), copiez le secret dans `CLERK_WEBHOOK_SECRET`.
4. Pour donner les droits admin à un utilisateur : passez `isAdmin = true` sur sa ligne `User` (via Prisma Studio ou directement en SQL), ou utilisez le compte seedé `admin@leadflow.app`.

### Configuration Lemon Squeezy
1. Créez un Store et deux variantes de produit : Starter ($4.99, one-time) et Pro ($19.99/mois).
2. Renseignez `LEMONSQUEEZY_API_KEY`, `LEMONSQUEEZY_STORE_ID`, `LEMONSQUEEZY_VARIANT_ID_STARTER`, `LEMONSQUEEZY_VARIANT_ID_PRO`.
3. Ajoutez un webhook vers `https://votredomaine.com/api/webhooks/lemonsqueezy` (événements `order_created`, `subscription_created`, `subscription_updated`, `subscription_cancelled`, `subscription_expired`), copiez le secret dans `LEMONSQUEEZY_WEBHOOK_SECRET`.

---

## Déploiement sur Vercel

```bash
# Connecter le repo
vercel link

# Ajouter toutes les variables d'environnement de .env.example
vercel env add DATABASE_URL
vercel env add DATABASE_URL_UNPOOLED
vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
vercel env add CLERK_SECRET_KEY
# ... répéter pour chaque variable de .env.example

# Déployer en production
vercel --prod
```

Le script `build` (`prisma generate && next build`) régénère automatiquement
le client Prisma à chaque déploiement. Pensez à exécuter
`npx prisma migrate deploy` (ou `db:push`) contre votre base Neon de
production après le premier déploiement.

---

## Scripts disponibles

| Commande              | Description                                      |
|------------------------|---------------------------------------------------|
| `npm run dev`          | Démarre le serveur de développement              |
| `npm run build`        | Génère le client Prisma puis build Next.js       |
| `npm run start`        | Démarre le serveur en mode production            |
| `npm run db:push`      | Synchronise le schéma Prisma avec Neon (sans migration versionnée) |
| `npm run db:migrate`   | Crée et applique une migration Prisma versionnée |
| `npm run db:studio`    | Ouvre Prisma Studio                               |
| `npm run db:seed`      | Peuple la base avec un admin + données de démo   |

---

## Sécurité

- Toutes les routes `/dashboard`, `/admin` et les API sensibles sont protégées par le middleware Clerk.
- Les routes `/admin/*` vérifient en plus le flag `isAdmin` côté serveur.
- Les emails et téléphones sont masqués côté serveur (jamais envoyés en clair au client) tant que le lead n'est pas déverrouillé.
- Les webhooks Lemon Squeezy et Clerk valident la signature HMAC avant tout traitement.
- En-têtes de sécurité (`X-Frame-Options`, `X-Content-Type-Options`, etc.) appliqués globalement via `next.config.js`.

---

## Notes de contenu

- **FAQ** : 5 questions (Are the emails verified? / Is scraping legal? / How many leads can I export? / Do you offer refunds? / What countries are supported?).
- **Blog** : 3 articles, chacun ≤ 200 mots, sur la génération de leads B2B.
- **About** : page complète couvrant mission, vision, méthode de vérification des données et politique qualité.

Ce contenu peut être étendu facilement : ajoutez des entrées dans
`src/lib/data/faq.ts` ou un nouveau fichier `batchN.ts` dans
`src/lib/data/blog-posts/` (puis exportez-le depuis `index.ts`).
