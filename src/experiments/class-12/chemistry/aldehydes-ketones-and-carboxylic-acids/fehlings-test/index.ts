// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const fehlingsTest: TestDef = {
  id: 'fehlings',
  name: "Fehling's Test",
  category: 'Aldehydes & Ketones',
  emoji: '🧱',
  gradient: 'from-blue-400 to-red-500',
  desc: "Fehling's solution gives brick-red precipitate with aliphatic aldehydes. Aromatic aldehydes don't respond.",
  reagents: [
    { id: 'fehlings', name: "Fehling's A + B", shortName: 'Fehling Sol.', accentColor: '#2563eb', liquidColor: 'rgba(37,99,235,0.25)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
    { id: 'warm-f', name: 'Warm (Heat)', shortName: 'Δ Heat', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.1)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
  ],
  unknownTypes: ['Aliphatic Ald.', 'Ketone', 'Aromatic Ald.'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: "Add Fehling's solution first." }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(37,99,235,0.15)', description: 'Solution added. Now heat to see reaction.' }
    if (type === 'Aliphatic Ald.') return { visual: 'precipitate', precipitateColor: '#b91c1c', liquidColor: 'rgba(185,28,28,0.3)', description: 'Brick-red precipitate! Cu²⁺ is reduced to Cu₂O by aliphatic aldehyde.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(37,99,235,0.1)', description: `No brick-red precipitate. ${type} does not reduce Fehling's solution.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain aliphatic aldehyde, ketone, and aromatic aldehyde.' },
    { title: "Add Fehling's + Heat", desc: "Fehling's A (CuSO₄) + B (alkaline tartrate) = blue. Aldehydes reduce Cu²⁺ to Cu₂O." },
    { title: 'Observe Precipitate', desc: 'Brick-red ppt = Aliphatic aldehyde. No ppt = Ketone or Aromatic aldehyde.' },
  ],
  reactionKey: [
    { type: 'Aliphatic Ald.', results: ['Brick-red precipitate (Cu₂O)'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: 'Ketone', results: ["No brick-red precipitate"], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Aromatic Ald.', results: ["No precipitate (doesn't reduce Fehling's)"], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    "Aliphatic aldehydes reduce the deep blue Cu²⁺ complex in Fehling's solution to brick-red Cu₂O.",
    "Aromatic aldehydes (like benzaldehyde) do NOT reduce Fehling's solution — this is a key distinction from Tollens' test.",
    'Ketones generally do not reduce Fehling’s solution.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "fehlings-test",
  title: "Fehling",
  emoji: "\ud83e\uddf1",
  blurb: "Fehling's solution: aliphatic aldehydes give brick-red Cu\u2082O ppt; ketones & ArCHO don't.",
  gradient: "from-blue-400 to-red-500",
  durationMin: 6,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "aldehydes-ketones-and-carboxylic-acids",
};

const module = { manifest, test: fehlingsTest };
export default module;
