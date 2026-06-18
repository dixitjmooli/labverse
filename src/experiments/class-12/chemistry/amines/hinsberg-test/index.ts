// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const hinsbergTest: TestDef = {
  id: 'hinsberg',
  name: 'Hinsberg Test',
  category: 'Amines',
  emoji: '🧪',
  gradient: 'from-amber-400 to-orange-500',
  desc: 'Distinguish 1°, 2°, 3° amines using Hinsberg Reagent (C₆H₅SO₂Cl) and NaOH.',
  reagents: [
    { id: 'hinsberg', name: 'Hinsberg Reagent', shortName: 'C₆H₅SO₂Cl', accentColor: '#d97706', liquidColor: 'rgba(251,191,36,0.3)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-50' },
    { id: 'naoh', name: 'Aqueous NaOH', shortName: 'NaOH', accentColor: '#2563eb', liquidColor: 'rgba(96,165,250,0.3)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['1° Amine', '2° Amine', '3° Amine'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (r1 && !r2) {
      if (type === '1° Amine') return { visual: 'precipitate', precipitateColor: '#ffffff', liquidColor: 'rgba(220,230,255,0.6)', description: 'White precipitate! Sulfonamide formed from 1° amine.' }
      if (type === '2° Amine') return { visual: 'precipitate', precipitateColor: '#ffffff', liquidColor: 'rgba(220,230,255,0.6)', description: 'White precipitate! Sulfonamide formed from 2° amine.' }
      return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.3)', description: 'No reaction. 3° amine does not react with Hinsberg reagent.' }
    }
    if (!r1 && r2) {
      if (type === '3° Amine') return { visual: 'oily-layer', liquidColor: 'rgba(255,220,150,0.4)', description: 'Oily layer — 3° amine is insoluble in base.' }
      return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.2)', description: 'Add Hinsberg reagent first for proper test.' }
    }
    if (type === '1° Amine') return { visual: 'dissolve', liquidColor: 'rgba(180,210,255,0.35)', description: 'Precipitate dissolved! 1° sulfonamide has acidic H, soluble in NaOH.' }
    if (type === '2° Amine') return { visual: 'precipitate', precipitateColor: '#ffffff', liquidColor: 'rgba(220,230,255,0.6)', description: 'Precipitate remains! 2° sulfonamide has NO acidic H, insoluble in NaOH.' }
    return { visual: 'oily-layer', liquidColor: 'rgba(255,220,150,0.4)', description: 'No reaction + oily layer = 3° amine.' }
  },
  introSteps: [
    { title: 'Three Unknown Amines', desc: 'Tubes A, B, C contain 1°, 2°, and 3° amines.' },
    { title: 'Add Hinsberg Reagent', desc: 'C₆H₅SO₂Cl reacts with 1° and 2° amines to form sulfonamides.' },
    { title: 'Then Add NaOH', desc: '1° sulfonamide dissolves in NaOH. 2° sulfonamide does not. 3° gives no reaction.' },
  ],
  reactionKey: [
    { type: '1° Amine', results: ['+ Hinsberg → White ppt', '+ NaOH → Ppt dissolves'], color: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { type: '2° Amine', results: ['+ Hinsberg → White ppt', '+ NaOH → Ppt remains'], color: 'bg-amber-50', textColor: 'text-amber-700' },
    { type: '3° Amine', results: ['+ Hinsberg → No reaction', '+ NaOH → Oily layer'], color: 'bg-blue-50', textColor: 'text-blue-700' },
  ],
  recap: [
    '1° Amines form sulfonamides with an acidic H on nitrogen, which dissolves in NaOH.',
    '2° Amines form sulfonamides with NO acidic H on nitrogen, so the precipitate remains insoluble.',
    '3° Amines do not react with Hinsberg reagent at all.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "hinsberg-test",
  title: "Hinsberg Test",
  emoji: "\ud83e\uddea",
  blurb: "Hinsberg reagent (C\u2086H\u2085SO\u2082Cl) + NaOH distinguishes 1\u00b0/2\u00b0/3\u00b0 amines.",
  gradient: "from-amber-400 to-orange-500",
  durationMin: 7,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "amines",
};

const module = { manifest, test: hinsbergTest };
export default module;
