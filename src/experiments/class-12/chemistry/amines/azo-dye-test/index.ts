// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const azoDyeTest: TestDef = {
  id: 'azo-dye',
  name: 'Azo Dye Test',
  category: 'Amines',
  emoji: '🎨',
  gradient: 'from-red-400 to-orange-500',
  desc: '1° aromatic amines form orange-red azo dye via diazotization + coupling. Bright and vivid!',
  reagents: [
    { id: 'nano2-azo', name: 'NaNO₂ + HCl (0-5°C)', shortName: 'NaNO₂/HCl', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.15)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
    { id: 'phenol-couple', name: 'Alkaline β-naphthol', shortName: 'β-naphthol', accentColor: '#ea580c', liquidColor: 'rgba(234,88,12,0.2)', ringColor: 'ring-orange-400', bgColor: 'bg-orange-50' },
  ],
  unknownTypes: ['1° Aromatic Amine', '1° Aliphatic Amine', '2° Amine'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (r1 && !r2) {
      if (type === '1° Aromatic Amine') return { visual: 'no-reaction', liquidColor: 'rgba(220,38,38,0.1)', description: 'Diazonium salt formed (keep cold!). Now add β-naphthol to couple.' }
      if (type === '1° Aliphatic Amine') return { visual: 'effervescence', liquidColor: 'rgba(8,145,178,0.15)', description: 'N₂ gas evolved! Aliphatic diazonium is unstable — no coupling possible.' }
      return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: '2° amine does not form diazonium salt.' }
    }
    if (!r1 && r2) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Diazotize first with NaNO₂/HCl at 0-5°C.' }
    if (type === '1° Aromatic Amine') return { visual: 'dye', liquidColor: 'rgba(234,88,12,0.5)', description: 'Orange-red AZO DYE formed! Aromatic diazonium couples with β-naphthol!' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'No dye formed. Only 1° aromatic amines give the azo dye test.' }
  },
  introSteps: [
    { title: 'Three Unknown Amines', desc: 'Tubes A, B, C contain 1° aromatic amine, 1° aliphatic amine, and 2° amine.' },
    { title: 'Diazotize + Couple', desc: 'NaNO₂/HCl at 0-5°C forms diazonium salt, then add β-naphthol.' },
    { title: 'Observe Dye Formation', desc: 'Orange-red dye = 1° aromatic amine. N₂ bubbles = 1° aliphatic. Nothing = 2°.' },
  ],
  reactionKey: [
    { type: '1° Aromatic Amine', results: ['Orange-red azo dye (diazonium + β-naphthol)'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: '1° Aliphatic Amine', results: ['N₂ effervescence (unstable diazonium)'], color: 'bg-sky-50', textColor: 'text-sky-700' },
    { type: '2° Amine', results: ['No dye, no reaction'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    '1° Aromatic amines form stable diazonium salts at 0-5°C, which couple with β-naphthol to form orange-red azo dyes.',
    '1° Aliphatic amines form unstable diazonium salts that decompose immediately, releasing N₂ gas.',
    '2° and 3° amines do not form diazonium salts.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "azo-dye-test",
  title: "Azo Dye Test",
  emoji: "\ud83c\udfa8",
  blurb: "Diazotization + \u03b2-naphthol coupling \u2192 vivid orange-red azo dye with 1\u00b0 aromatic amines.",
  gradient: "from-red-400 to-orange-500",
  durationMin: 6,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "amines",
};

const module = { manifest, test: azoDyeTest };
export default module;
