
# Deploying Tokenizable

The app is a static Vite + React SPA. It builds to `dist/` and can be hosted on
Cloudflare Pages, Vercel, Netlify, or any static host.

---

## Cloudflare Pages (recommended)

### Option A — Git integration (dashboard)

1. Push this repository to GitHub / GitLab.
2. Cloudflare dashboard → **Workers & Pages** → **Create application** → **Pages** →
   **Connect to Git** → select the repository.
3. Configure the build:

   | Setting | Value |
   | --- | --- |
   | Framework preset | `Vite` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `/` (leave empty) |

4. Environment variables (Settings → Environment variables) — only if the build
   complains about the Node version:

   | Name | Value |
   | --- | --- |
   | `NODE_VERSION` | `20` |

5. **Save and Deploy**. Every push to the production branch redeploys; other
   branches get preview URLs automatically.

### Option B — Direct upload with Wrangler

```bash
npm install
npm run build
npm run deploy:cf        # npx wrangler pages deploy dist --project-name=tokenizable
```

### Node version pinning

`.nvmrc` and `.node-version` both pin Node **20**, and `package.json` declares
`"engines": { "node": ">=20" }`. Cloudflare Pages reads these automatically, so the
`NODE_VERSION` environment variable is now optional rather than a workaround. Vite 5
and the Hardhat dev toolchain both fail to install on Cloudflare's legacy default
Node, which is the usual cause of a green local build and a red Pages build.

### wrangler.toml

The repo root contains:

```toml
name = "tokenizable"
compatibility_date = "2024-11-01"
pages_build_output_dir = "dist"
```

`pages_build_output_dir` is what lets Wrangler and the Pages Git integration agree on
`dist/` without re-entering it in the dashboard. It does not turn the project into a
Worker — this is still a pure static Pages deployment.

### Build output

`vite.config.js` pins `build.outDir` to `dist`, disables source maps for production,
targets `es2020`, and splits `react` / `react-dom` / `react-router-dom` into a
`vendor-react` chunk so the immutable `/assets/*` cache rule in `public/_headers`
does the most work across deploys.

### SPA routing

`public/_redirects` contains:

```
/*    /index.html   200
```

This is copied verbatim into `dist/` at build time and lets Cloudflare Pages serve
`index.html` for client-side routes such as `/governance`, `/safety` and `/join`
instead of returning 404. Do not delete it.

`public/_headers` adds long-lived immutable caching for hashed assets in
`/assets/*` plus a few baseline security headers.

### Custom domain

Pages project → **Custom domains** → **Set up a domain**. If the domain is already
on Cloudflare DNS the CNAME is created for you; otherwise point a CNAME at
`<project>.pages.dev`.

---

## Vercel

`vercel.json` is kept for Vercel compatibility:

```json
{ "routes": [{ "src": "/[^.]+", "dest": "/", "status": 200 }] }
```

Build command `npm run build`, output directory `dist`.

---

## Local commands

```bash
npm install       # install dependencies
npm run dev       # dev server on 0.0.0.0 (external access enabled)
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Contracts (Hardhat)

The blockchain subsystem lives alongside the site and does **not** affect the static
build. Cloudflare Pages only ever serves `dist/`.

```bash
npm install          # single install, restores vite + the Hardhat toolchain
npm run test         # full chai test suite (membership, TKN, MintController)
npm run dev          # Hardhat node :8545 -> deploy -> Vite dev server :3000
```

`npm run dev` is orchestrated by `scripts/smart-dev.js`:

1. `hardhat node` on port 8545 with full transaction logging,
2. `scripts/wait-and-deploy.js` waits for the RPC then deploys `Factory.sol`,
3. Vite dev server on port 3000.

`Factory` deploys the membership NFT, the TKN governance token, the mint controller
and the test stablecoins, then writes every address to
`public/local-deployment.json`. Never edit that file by hand — change the deploy
script and redeploy.

Artifacts are emitted to `public/artifacts`, so the frontend reads real ABIs at
runtime instead of hardcoded copies. The browser never talks to the node directly:
`/api/rpc` is proxied to `127.0.0.1:8545` in dev, and live chains use their public
RPC endpoint selected by `chainId`.

**Live networks:** open the Preview tab and use **Deploy Contracts** (next to
Deploy). That flow targets Polygon Amoy first and produces `public/deployment.json`.
Do not deploy to Polygon mainnet until a real Amoy mint plus treasury receipt has
been verified, and until `MintController.setStablecoins(...)` points at the real
Circle USDC / USDT addresses and `setAllowlistSigner(...)` has replaced the
placeholder Contributor signer.

## Notes

- The marketing build itself needs no server, database, or secrets — `dist/` is
  fully static, which is exactly what Cloudflare Pages wants.
- `public/_redirects` (SPA fallback) and `public/_headers` (immutable asset caching
  plus baseline security headers) are copied verbatim into `dist/`. Do not delete
  them, or `/governance`, `/safety` and `/join` will 404 on Cloudflare.

- Environment variables to set in the Pages project when the contracts are live:
  `VITE_VERCEL_ENV=production`, `VITE_PRIVY_APP_ID`, `VITE_WALLETCONNECT_PROJECT_ID`,
  `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, and `NODE_VERSION=20`. The Supabase
  values have safe literal fallbacks in `src/lib/supabase.js`, but set them explicitly
  in Pages so the project can be repointed without a code change. In Supabase, add the
  Pages URL (and any preview URLs) to Authentication → URL Configuration → Redirect URLs,
  otherwise the magic-link sign-in used by Groups/Rooms/Events will bounce.
 With `VITE_VERCEL_ENV=production` the frontend reads
  `public/deployment.json` and a live public RPC instead of the local node.
- Hero and section media are served from remote CDNs, so no large binaries live in
  the repository.
- `PRIVATE_KEY` / `AMOY_RPC_URL` are deploy-time only — never expose them to the
  Pages build, and never commit `.env` (see `.env.example`).
