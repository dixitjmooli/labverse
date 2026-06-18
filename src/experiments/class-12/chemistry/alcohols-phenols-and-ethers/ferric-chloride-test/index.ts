// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const fecl3Test: TestDef = {
  id: 'fecl3',
  name: 'Ferric Chloride Test',
  category: 'Phenols',
  emoji: '💜',
  gradient: 'from-purple-400 to-violet-500',
  desc: 'FeCl₃ gives violet/purple color with phenols. Alcohols and acids show no violet color.',
  reagents: [
    { id: 'fecl3', name: 'Neutral FeCl₃ Solution', shortName: 'FeCl₃', accentColor: '#7c3aed', liquidColor: 'rgba(124,58,237,0.25)', ringColor: 'ring-violet-400', bgColor: 'bg-violet-50' },
    { id: 'naoh-fe', name: 'NaOH (to make neutral)', shortName: 'NaOH', accentColor: '#2563eb', liquidColor: 'rgba(37,99,235,0.15)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['Phenol', 'Alcohol', 'Carboxylic Acid'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add FeCl₃ solution first.' }
    if (type === 'Phenol') return { visual: 'color-change', liquidColor: 'rgba(139,92,246,0.5)', description: 'Violet color! Phenol forms a violet complex with Fe³⁺ ions.' }
    if (type === 'Carboxylic Acid') return { visual: 'color-change', liquidColor: 'rgba(234,179,8,0.2)', description: 'Buff/faint yellow color. Some carboxylic acids give slight color but NOT violet.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'No violet color. Alcohols do not react with FeCl₃.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain phenol, alcohol, and carboxylic acid.' },
    { title: 'Add Neutral FeCl₃', desc: 'Neutral FeCl₃ gives a characteristic violet color with phenols only.' },
    { title: 'Observe Color', desc: 'Violet = Phenol. No violet = Alcohol or Carboxylic acid.' },
  ],
  reactionKey: [
    { type: 'Phenol', results: ['Violet/purple color (phenolate-Fe³⁺ complex)'], color: 'bg-violet-50', textColor: 'text-violet-700' },
    { type: 'Alcohol', results: ['No violet color'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Carboxylic Acid', results: ['Buff/faint yellow (NOT violet)'], color: 'bg-yellow-50', textColor: 'text-yellow-700' },
  ],
  recap: [
    'Phenols form a violet-colored complex with Fe³⁺ ions: 6ArOH + FeCl₃ → [Fe(OAr)₆]³⁻ + 3HCl.',
    'Alcohols do not give this test as they cannot form stable complexes with Fe³⁺.',
    'Carboxylic acids may give a buff color but NOT the characteristic violet.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "ferric-chloride-test",
  title: "Ferric Chloride Test",
  emoji: "\ud83d\udc9c",
  blurb: "Neutral FeCl\u2083 gives violet/green/blue colour with phenols \u2014 characteristic test.",
  gradient: "from-purple-400 to-violet-500",
  durationMin: 4,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "alcohols-phenols-and-ethers",
};

const module = { manifest, test: fecl3Test };
export default module;
