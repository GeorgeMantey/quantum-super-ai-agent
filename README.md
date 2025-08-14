# Quantum Super AI Agent

## Quickstart
1. `pnpm i`
2. `cp .env.example .env` and set `OPENAI_API_KEY`
3. `pnpm --filter web dev` → open http://localhost:3000

## Deploy
- Vercel (root=apps/web): Build `pnpm i && pnpm build`, Start `pnpm start`
- Optional Render worker (root=apps/worker): Build `pnpm i && pnpm build`, Start `node dist/index.js`
