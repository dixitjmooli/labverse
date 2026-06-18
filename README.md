# LabVerse — Interactive Science Experiments for Classes 9–12

A teaching aid for teachers. A visual playground for students. Perform CBSE/NCERT science experiments **interactively in your browser** — add reagents, observe reactions, identify unknowns.

## Features

- 🎓 **CBSE 2024-25 syllabus** for Class 9, 10, 11, 12 (Science, Maths, Physics, Chemistry, Biology)
- 🧪 **18 live chemistry experiments** (Class 12 — Amines, Alcohols/Phenols/Ethers, Aldehydes/Ketones/Carboxylic Acids)
- 🚧 **Coming Soon** badges on chapters without experiments (add new experiments without disrupting existing ones)
- 🔊 **Synthesized sound effects** via Web Audio API — no audio files needed
- 🎨 **SVG visuals** — test tubes, reagent bottles, precipitates, effervescence, silver mirror, foul-smell stink lines, student reactions
- 📱 **Responsive** — works on phones, tablets, desktops

## Adding a new experiment (branching-friendly)

Every experiment lives in its own folder. Adding one **never touches existing experiments**.

1. Pick the right path:
   ```
   src/experiments/class-<N>/<subject>/<chapter-slug>/<experiment-id>/index.ts
   ```
2. Copy an existing experiment folder as a template (e.g. `src/experiments/class-12/chemistry/amines/hinsberg-test/`).
3. Edit the `TestDef` (reagents, reaction logic, intro steps, recap) and the `manifest` (id, title, blurb, gradient).
4. Add **two lines** to `src/experiments/registry.ts`:
   ```ts
   import myNewTest from "@/experiments/class-12/chemistry/amines/my-new-test";
   // ...inside MODULES array:
   myNewTest,
   ```
5. The new experiment is now live at `/class-12/chemistry/amines/my-new-test`. Existing experiments are unchanged.

## Tech stack

- **Next.js 16** with App Router + Turbopack
- **TypeScript** end-to-end
- **Tailwind CSS 4** + shadcn/ui
- **Framer Motion** for animations
- **Web Audio API** for synthesized SFX

## Local development

```bash
bun install
bun run dev
# → http://localhost:3000
```

## Deployment

This app is configured for **Vercel** — push to GitHub, then import the repo on Vercel. No env vars required.

```bash
bun run build   # production build
bun run start   # production server (after build)
```

## Architecture

```
src/
├── app/
│   ├── page.tsx                                    # Home — class selection
│   ├── class-[classId]/page.tsx                   # Subject selection
│   ├── class-[classId]/[subjectId]/page.tsx       # Chapter list (with Coming Soon)
│   ├── class-[classId]/[subjectId]/[chapterSlug]/page.tsx  # Experiment list
│   └── class-[classId]/[subjectId]/[chapterSlug]/[experimentId]/page.tsx  # Player
├── components/lab/
│   ├── ExperimentPlayer.tsx     # Generic game flow (intro → experiment → identify → results)
│   ├── TestTube.tsx              # SVG test tube + reagent bottle visuals
│   └── VisualEffects.tsx         # Stink lines, bubbles, student reaction, sound toggle
├── experiments/
│   ├── registry.ts              # Single source of truth for all experiments
│   └── class-12/chemistry/
│       ├── amines/{hinsberg,carbylamine,nitrous-acid,azo-dye}-test/
│       ├── alcohols-phenols-and-ethers/{lucas,chromic-acid,victor-meyer,...}-test/
│       └── aldehydes-ketones-and-carboxylic-acids/{tollens,fehlings,iodoform,...}-test/
└── lib/
    ├── syllabus.ts               # CBSE chapter list per (class, subject)
    ├── syllabus-utils.ts         # Helpers that bridge syllabus + registry
    ├── lab-types.ts              # Shared TestDef / ExperimentManifest types
    └── sound-engine.ts           # Web Audio SFX singleton
```

## Available experiments (18)

### Class 12 · Chemistry · Amines (4)
- 🧪 Hinsberg Test — distinguish 1°/2°/3° amines
- 💨 Carbylamine Test — foul isocyanide smell with 1° amines
- 🫧 Nitrous Acid Test — effervescence/oil/dissolution
- 🎨 Azo Dye Test — vivid orange-red dye with 1° aromatic amines

### Class 12 · Chemistry · Alcohols, Phenols and Ethers (7)
- 🍺 Lucas Test — turbidity speed for 1°/2°/3° alcohols
- 🟢 Chromic Acid Test — green Cr³⁺ with 1°/2° alcohols
- 🔴 Victor Meyer Test — colour test (red/blue/colourless)
- 🟡 Ceric Ammonium Nitrate — red colour with alcohols/phenols
- 💜 Ferric Chloride Test — violet/green/blue with phenols
- 🟤 Bromine Water Test — decolourisation + white ppt
- 🔵 Libermann Nitroso Test — blue/red with phenols

### Class 12 · Chemistry · Aldehydes, Ketones and Carboxylic Acids (7)
- 🪞 Tollens' Test — silver mirror with aldehydes
- 🔴 Fehling's Test — brick-red Cu₂O with aliphatic aldehydes
- 🌸 Schiff's Test — magenta with aldehydes
- 💛 2,4-DNP Test — yellow/orange ppt with aldehydes + ketones
- 🟡 Iodoform Test — yellow CHI₃ ppt with CH₃CO-/CH₃CH(OH)-
- 🫧 NaHCO₃ Test — CO₂ effervescence with carboxylic acids
- 🍓 Ester Test — sweet fruity smell

## License

MIT — free for educational use.
