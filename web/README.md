# Web Frontend (React + TypeScript)

This is a minimal personal finance UI with mock data.

## Run locally

```bash
cd web
npm install
npm run dev
```

Then open the local URL printed by the dev server.

## Build

```bash
npm run build
npm run preview
```

## Structure
- `src/services/mockApi.ts` mock in-memory accounts, transactions, budgets
- `src/pages/*` pages: Dashboard, Accounts, Transactions, Budgets
- `src/App.tsx` routes and navigation
