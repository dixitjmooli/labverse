// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const tollensTest: TestDef = {
  id: 'tollens',
  name: "Tollens' Test",
  category: 'Aldehydes & Ketones',
  emoji: '🪞',
  gradient: 'from-gray-300 to-gray-500',
  desc: "Silver Mirror Test! Tollens' reagent (AgNO₃/NH₃) gives silver mirror with aldehydes only.",
  reagents: [
    { id: 'tollens', name: "Tollens' Reagent", shortName: 'AgNO₃+NH₃', accentColor: '#6b7280', liquidColor: 'rgba(107,114,128,0.2)', ringColor: 'ring-gray-400', bgColor: 'bg-gray-50' },
    { id: 'warm', name: 'Warm (Heat)', shortName: 'Δ Heat', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.1)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
  ],
  unknownTypes: ['Aldehyde', 'Ketone', 'Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: "Add Tollens' Reagent first." }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(107,114,128,0.15)', description: type === 'Aldehyde' ? 'Reagent added. Now heat to see the silver mirror!' : 'Reagent added. Heat to see if reaction occurs.' }
    // Both added (with heating)
    if (type === 'Aldehyde') return { visual: 'silver-mirror', liquidColor: 'rgba(192,192,192,0.1)', description: 'SILVER MIRROR formed! Aldehyde reduces Ag⁺ to metallic silver on tube walls!' }
    return { visual: 'no-reaction', liquidColor: 'rgba(107,114,128,0.1)', description: `No silver mirror. ${type} does not reduce Tollens' reagent.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain aldehyde, ketone, and alcohol.' },
    { title: "Add Tollens' Reagent + Heat", desc: "Tollens' reagent contains [Ag(NH₃)₂]⁺. Aldehydes reduce Ag⁺ to silver." },
    { title: 'Observe Silver Mirror', desc: 'Silver mirror on walls = Aldehyde. No mirror = Ketone or Alcohol.' },
  ],
  reactionKey: [
    { type: 'Aldehyde', results: ['Silver mirror on tube walls (Ag⁺ → Ag⁰)'], color: 'bg-gray-50', textColor: 'text-gray-800' },
    { type: 'Ketone', results: ['No silver mirror'], color: 'bg-gray-100', textColor: 'text-gray-600' },
    { type: 'Alcohol', results: ['No silver mirror'], color: 'bg-gray-100', textColor: 'text-gray-600' },
  ],
  recap: [
    "Tollens' reagent contains the diamminesilver(I) complex [Ag(NH₃)₂]⁺. Aldehydes reduce Ag⁺ to metallic silver, which deposits as a mirror on the tube walls.",
    'Ketones do NOT have a readily oxidizable H, so they cannot reduce Ag⁺.',
    'This test distinguishes aldehydes from ketones. α-hydroxy ketones also give a positive test.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "tollens-test",
  title: "Tollens",
  emoji: "\ud83e\ude9e",
  blurb: "Silver mirror test \u2014 aldehydes reduce [Ag(NH\u2083)\u2082]\u207a to metallic Ag; ketones don't.",
  gradient: "from-gray-300 to-gray-500",
  durationMin: 6,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "aldehydes-ketones-and-carboxylic-acids",
};

const module = { manifest, test: tollensTest };
export default module;
