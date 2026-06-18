// Auto-generated experiment module. Edit freely — this file is self-contained.
// To add a new experiment, copy this folder structure under the right chapter.

import type { TestDef, ExperimentManifest } from "@/lib/lab-types";

export const libermannTest: TestDef = {
  id: 'libermann',
  name: "Libermann's Test",
  category: 'Phenols',
  emoji: '🔵',
  gradient: 'from-blue-400 to-indigo-500',
  desc: "Libermann's test gives blue/green color with phenols. Specific for phenolic -OH group.",
  reagents: [
    { id: 'lib-r1', name: 'NaNO₂ + H₂SO₄', shortName: 'NaNO₂/H₂SO₄', accentColor: '#4f46e5', liquidColor: 'rgba(79,70,229,0.2)', ringColor: 'ring-indigo-400', bgColor: 'bg-indigo-50' },
    { id: 'lib-r2', name: 'NaOH (make alkaline)', shortName: 'NaOH', accentColor: '#2563eb', liquidColor: 'rgba(37,99,235,0.15)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['Phenol', 'Alcohol', 'Carboxylic Acid'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add NaNO₂/H₂SO₄ first.' }
    if (r1 && !r2) return { visual: 'color-change', liquidColor: type === 'Phenol' ? 'rgba(30,64,175,0.3)' : 'rgba(200,210,240,0.15)', description: type === 'Phenol' ? 'Blackish-green in acid layer. Now add NaOH to see full color.' : 'No characteristic color yet.' }
    // Both added
    if (type === 'Phenol') return { visual: 'color-change', liquidColor: 'rgba(37,99,235,0.5)', description: 'Blue color in alkaline solution! Phenol gives positive Libermann test.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'No blue color. Not a phenol.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain phenol, alcohol, and carboxylic acid.' },
    { title: 'Add Reagents', desc: 'First NaNO₂/H₂SO₄, then NaOH to make alkaline.' },
    { title: 'Observe Color', desc: 'Blue color = Phenol. No blue = Alcohol or Carboxylic acid.' },
  ],
  reactionKey: [
    { type: 'Phenol', results: ['Blue/green color in alkaline medium'], color: 'bg-blue-50', textColor: 'text-blue-700' },
    { type: 'Alcohol', results: ['No blue color'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Carboxylic Acid', results: ['No blue color'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    "Phenol reacts with NaNO₂ in H₂SO₄ to form indophenol, which in alkaline medium gives a blue color.",
    'Alcohols and carboxylic acids do not have the phenolic -OH group and do not give this test.',
  ],
};

export const manifest: ExperimentManifest = {
  id: "libermann-nitroso-test",
  title: "Libermann",
  emoji: "\ud83d\udd35",
  blurb: "Phenol + NaNO\u2082 + H\u2082SO\u2084 \u2192 blue/red Liebermann colour reaction for phenols.",
  gradient: "from-blue-400 to-indigo-500",
  durationMin: 5,
  classId: "12",
  subjectId: "chemistry",
  chapterSlug: "alcohols-phenols-and-ethers",
};

const module = { manifest, test: libermannTest };
export default module;
