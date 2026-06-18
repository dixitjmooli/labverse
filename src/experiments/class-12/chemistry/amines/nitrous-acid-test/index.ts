// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const nitrousAcidTest: TestDef = {
  id: 'nitrous-acid',
  name: 'Nitrous Acid Test',
  category: 'Amines',
  emoji: '🫧',
  gradient: 'from-sky-400 to-cyan-500',
  desc: 'HNO₂ (NaNO₂ + HCl) reacts differently with 1°, 2°, 3° amines — effervescence, oil, or dissolution.',
  reagents: [
    { id: 'nano2', name: 'NaNO₂ Solution', shortName: 'NaNO₂', accentColor: '#0284c7', liquidColor: 'rgba(2,132,199,0.2)', ringColor: 'ring-sky-400', bgColor: 'bg-sky-50' },
    { id: 'hcl', name: 'Dilute HCl', shortName: 'HCl', accentColor: '#0891b2', liquidColor: 'rgba(8,145,178,0.15)', ringColor: 'ring-cyan-400', bgColor: 'bg-cyan-50' },
  ],
  unknownTypes: ['1° Amine', '2° Amine', '3° Amine'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1 || !r2) return { visual: 'no-reaction', liquidColor: 'rgba(2,132,199,0.1)', description: 'Add both NaNO₂ and HCl to generate HNO₂ in situ.' }
    if (type === '1° Amine') return { visual: 'effervescence', liquidColor: 'rgba(8,145,178,0.2)', description: 'Effervescence (N₂ gas)! 1° aliphatic amine reacts with HNO₂ to release N₂ and form alcohol.' }
    if (type === '2° Amine') return { visual: 'oily-layer', liquidColor: 'rgba(255,220,150,0.35)', description: 'Yellow oily layer! 2° amine forms N-nitrosoamine (yellow oil).' }
    return { visual: 'dissolve', liquidColor: 'rgba(8,145,178,0.15)', description: 'Dissolves forming soluble salt. 3° aliphatic amine forms amine salt with HCl — no nitrosation.' }
  },
  introSteps: [
    { title: 'Three Unknown Amines', desc: 'Tubes A, B, C contain 1°, 2°, and 3° amines.' },
    { title: 'Add NaNO₂ + HCl', desc: 'Generates HNO₂ in situ. Each amine type reacts differently.' },
    { title: 'Observe the Result', desc: 'N₂ bubbles = 1°. Yellow oil = 2°. Just dissolves = 3°.' },
  ],
  reactionKey: [
    { type: '1° Aliphatic Amine', results: ['Effervescence (N₂ gas)', 'Forms alcohol'], color: 'bg-sky-50', textColor: 'text-sky-700' },
    { type: '2° Amine', results: ['Yellow oily layer (N-nitrosoamine)'], color: 'bg-amber-50', textColor: 'text-amber-700' },
    { type: '3° Aliphatic Amine', results: ['Dissolves (forms salt, no nitrosation)'], color: 'bg-cyan-50', textColor: 'text-cyan-700' },
  ],
  recap: [
    '1° Aliphatic amines react with HNO₂ to form diazonium salts (unstable) → N₂ gas + alcohol. Effervescence is observed.',
    '2° Amines form N-nitrosoamines, which appear as a yellow oily layer.',
    '3° Aliphatic amines simply dissolve as they form salts with HCl. No nitrosation occurs.',
    'Note: 1° Aromatic amines form stable diazonium salts at 0-5°C (used in azo dye test).',
  ],
};

export const manifest: ExperimentManifest = {
  id: "nitrous-acid-test",
  title: "Nitrous Acid Test",
  emoji: "\ud83e\udee7",
  blurb: "HNO\u2082 (NaNO\u2082 + HCl) \u2014 effervescence/oil/dissolution distinguishes amine classes.",
  gradient: "from-sky-400 to-cyan-500",
  durationMin: 6,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "amines",
};

const module = { manifest, test: nitrousAcidTest };
export default module;
