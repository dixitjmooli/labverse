# Deploying LabVerse to Vercel

This guide walks you through deploying LabVerse to Vercel from the GitHub repo.

## Prerequisites

- A GitHub account (the repo is at https://github.com/dixitjmooli/labverse)
- A Vercel account (free tier is enough) — sign up at https://vercel.com

## Option A — Deploy via Vercel Dashboard (recommended, easiest)

1. Go to https://vercel.com and sign in with GitHub
2. Click **"Add New…" → "Project"**
3. Import the `dixitjmooli/labverse` repository from your GitHub
4. Vercel will auto-detect Next.js. Verify these settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `next build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `bun install` (or `npm install`)
   - **Root Directory:** `./` (default)
5. Click **"Deploy"**
6. Wait ~2 minutes for the build to complete
7. Your live site will be at `https://labverse.vercel.app` (or similar)

## Option B — Deploy via Vercel CLI

```bash
# Install Vercel CLI (one-time)
npm install -g vercel

# From the project root
cd /path/to/labverse
vercel login          # Follow the browser prompt

# Deploy a preview
vercel

# Deploy to production
vercel --prod
```

## Option C — Connect via Vercel Git Integration (best for continuous deployment)

1. Go to https://vercel.com → New Project → Import Git Repository
2. Select `dixitjmooli/labverse`
3. Click Deploy
4. Every future `git push origin main` will automatically trigger a new deployment

## Verifying the deployment

After deploy, the following URLs should work:

| URL | What you should see |
|-----|---------------------|
| `/` | Home page with 4 class cards (9, 10, 11, 12) |
| `/class/12` | 4 subject cards (Physics, Chemistry, Maths, Biology) |
| `/class/12/chemistry` | 10 chemistry chapters with status badges |
| `/class/12/chemistry/amines` | 4 amine experiments |
| `/class/12/chemistry/amines/hinsberg-test` | The Hinsberg test lab |
| `/class/9/science/matter-in-our-surroundings` | "Coming Soon" page |

## Environment variables

**None required.** The app is fully self-contained — no DB, no external APIs, no auth.

## Custom domain (optional)

After deployment:
1. Vercel Dashboard → your project → Settings → Domains
2. Add your custom domain (e.g. `labverse.example.com`)
3. Follow the DNS instructions Vercel provides

## Troubleshooting

**Build fails with "Module not found":**
- Ensure `bun install` (or `npm install`) ran successfully
- Delete `node_modules` and lockfile, then reinstall

**404 on routes:**
- Verify the route folder is `src/app/class/[classId]/` (not `class-[classId]`)
- Clear `.next` cache and rebuild

**Experiments don't load:**
- Check browser console for errors
- Verify `src/experiments/registry.ts` includes the experiment module
