// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const bromineWaterTest: TestDef = {
  id: 'bromine-water',
  name: 'Bromine Water Test',
  category: 'Phenols',
  emoji: '🟠',
  gradient: 'from-orange-400 to-amber-500',
  desc: 'Bromine water gets decolorized by phenol with white precipitate of tribromophenol.',
  reagents: [
    { id: 'br2', name: 'Bromine Water', shortName: 'Br₂/H₂O', accentColor: '#ea580c', liquidColor: 'rgba(234,88,12,0.35)', ringColor: 'ring-orange-400', bgColor: 'bg-orange-50' },
    { id: 'br2-base', name: 'Dilute NaOH', shortName: 'NaOH', accentColor: '#2563eb', liquidColor: 'rgba(37,99,235,0.15)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['Phenol', 'Alcohol', 'Aniline'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add Bromine Water first.' }
    if (type === 'Phenol') return { visual: 'decolorize', precipitateColor: '#ffffff', liquidColor: 'rgba(255,255,255,0.5)', description: 'Orange Br₂ decolorized + White precipitate of 2,4,6-tribromophenol!' }
    if (type === 'Aniline') return { visual: 'decolorize', precipitateColor: '#fef3c7', liquidColor: 'rgba(254,243,199,0.4)', description: 'Br₂ decolorized + White/yellow precipitate of 2,4,6-tribromoaniline.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(234,88,12,0.2)', description: 'No reaction. Alcohols do not decolorize bromine water.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain phenol, alcohol, and aniline.' },
    { title: 'Add Bromine Water', desc: 'Orange bromine water reacts with phenols and anilines via electrophilic substitution.' },
    { title: 'Observe Decolorization', desc: 'Orange → colorless + white ppt = Phenol or Aniline. No change = Alcohol.' },
  ],
  reactionKey: [
    { type: 'Phenol', results: ['Orange decolorized + White precipitate (2,4,6-tribromophenol)'], color: 'bg-purple-50', textColor: 'text-purple-700' },
    { type: 'Aniline', results: ['Orange decolorized + White/yellow ppt (2,4,6-tribromoaniline)'], color: 'bg-blue-50', textColor: 'text-blue-700' },
    { type: 'Alcohol', results: ['No decolorization, no precipitate'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Phenol undergoes electrophilic substitution with Br₂. The -OH group activates the ring, giving 2,4,6-tribromophenol as a white precipitate.',
    'Aniline also undergoes electrophilic substitution giving 2,4,6-tribromoaniline.',
    'Alcohols do not have an activated aromatic ring, so they do not react with bromine water.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "bromine-water-test",
  title: "Bromine Water Test",
  emoji: "\ud83d\udfe0",
  blurb: "Bromine water decolourises with phenols (white ppt of tribromophenol) & unsaturation.",
  gradient: "from-orange-400 to-amber-500",
  durationMin: 5,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "alcohols-phenols-and-ethers",
};

const module = { manifest, test: bromineWaterTest };
export default module;
