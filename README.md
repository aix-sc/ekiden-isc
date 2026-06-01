# ISC Experiments — EKIDEN.ai-aligned web app

An open-source, reproducible companion to the **Ingest-time Semantic Compilation (ISC)**
paper (Wild–Takahashi, target venue **CIDR 2027**), built on the **EKIDEN.ai stack** so it
drops straight into the internal monorepo and tooling.

- Re-run the **cost model** (Experiment A) live — sliders for the cost constants recompute the
  break-even **R\*** and the cost curves.
- Explore the **incremental-maintenance** results (Experiment C) from the *real* measurements,
  plus the Procrustes "virtual axis update" recovery curve.
- Read each experiment's **purpose, data source, and evaluation methodology**.
- **Download** every data file, figure, and the experiment source code.
- **Ask questions** via a Gemini-powered chat — the API key stays server-side in a Cloud Function.

## Stack

| Layer | Choice |
|---|---|
| Frontend | **Vue 3, Vuetify 3, TypeScript, Vite** |
| Styles | **SCSS** (`lang="scss"` SFC blocks + `src/styles`) |
| Backend | **Firebase** — Hosting, **Cloud Functions** (Gemini proxy), **Firestore** (experiment metadata + question log), **Storage** (artifact hosting, optional) |
| Testing | **Vitest** (unit) + **Cypress** (e2e) |
| Lint/Build | **ESLint** (flat config) + **TypeScript** + **Vite** |
| Packages | **Yarn workspaces** (`yarn@4.5.3`) |
| Runtime | **Node ≥ 20** |

## Monorepo layout

```
ekiden-isc-experiments/
├── package.json                # Yarn workspaces root
├── firebase.json               # Hosting + Functions + Firestore + Storage + emulators
├── firestore.rules  storage.rules
├── packages/web/               # @ekiden/isc-web — Vue 3 + Vuetify + Vite app
│   ├── src/{components,composables,services,plugins,styles,data,types}
│   ├── src/__tests__/          # Vitest unit tests
│   ├── cypress/e2e/            # Cypress e2e tests
│   └── public/data/            # real experiment artifacts (downloadable + charted)
└── functions/                  # @ekiden/isc-functions — Cloud Functions (geminiChat)
```

## Prerequisites

```bash
node -v          # >= 20
corepack enable  # provides Yarn 4
```

## Install & run (works offline for the UI)

```bash
yarn install
yarn dev          # → http://localhost:5173
```

Without Firebase configured, the page renders from the bundled data and the chat shows a
"configure Firebase" notice — everything else is fully interactive.

## Quality gates

```bash
yarn lint         # ESLint across all workspaces
yarn test:unit    # Vitest (cost-model math, context builder, component render)
yarn test:e2e     # Cypress (run `yarn dev` first, or use start-server-and-test in CI)
yarn build        # vue-tsc type-check + Vite production build → packages/web/dist
```

## Firebase setup

1. Create a project at <https://console.firebase.google.com>, add a Web App, copy the config.
2. In `packages/web`, `cp .env.example .env` and fill the `VITE_FIREBASE_*` values.
3. `cp .firebaserc.example .firebaserc` and set your project id.
4. Enable Firestore and Storage in the console.

### The Gemini chat (server-side key)

The chat calls the `geminiChat` Cloud Function, which holds the key as a Secret and logs each
question to the `questions` Firestore collection — the key is never shipped to the browser.

```bash
firebase functions:secrets:set GEMINI_KEY     # paste a key from aistudio.google.com/apikey
yarn build:functions
firebase deploy --only functions
```

### Local emulators (no cloud needed)

```bash
firebase emulators:start          # Functions :5001 · Firestore :8080 · Storage :9199 · UI
# then in packages/web/.env: VITE_USE_EMULATORS=true
yarn dev
```

## Deploy

```bash
yarn deploy        # builds web + functions, then `firebase deploy`
# Hosting serves packages/web/dist → https://YOUR_PROJECT.web.app
```

## Storage (optional, for production artifact hosting)

By default the downloadable artifacts are served from Hosting (`/data/*`). To serve them from
Cloud Storage instead, upload `packages/web/public/data/*` under `experiments/` in your bucket
(rules already allow public read) and point the download links at the Storage URLs.

## Make it OSS + citable

```bash
git init && git add . && git commit -m "ISC experiments (EKIDEN stack)"
git remote add origin https://github.com/YOUR_GH_USERNAME/ekiden-isc-experiments.git
git push -u origin main
```

Set `GITHUB_URL` in `packages/web/src/data/experiments.ts`. For a stable citation in the paper,
cut a GitHub release and mint a **Zenodo DOI** for it (CIDR is single-blind, so a non-anonymous
link is fine to cite).

## License

MIT.
