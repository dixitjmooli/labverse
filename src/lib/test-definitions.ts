// ─── Class 12 CBSE Organic Chemistry Test Definitions ─────────────────────────
// All tests from NCERT Class 12 Chemistry: Units 11 (Alcohols, Phenols, Ethers),
// Unit 12 (Aldehydes, Ketones, Carboxylic Acids), Unit 13 (Amines)

export type ReactionVisual =
  | 'precipitate' | 'color-change' | 'silver-mirror' | 'foul-smell'
  | 'fruity-smell' | 'antiseptic-smell' | 'effervescence' | 'turbidity'
  | 'oily-layer' | 'no-reaction' | 'dissolve' | 'decolorize' | 'dye'

export interface ReactionResult {
  visual: ReactionVisual
  precipitateColor?: string
  liquidColor: string
  description: string
  smellType?: 'foul' | 'fruity' | 'antiseptic'
  turbiditySpeed?: 'immediate' | 'slow' | 'none'
}

export interface ReagentDef {
  id: string
  name: string
  shortName: string
  accentColor: string
  liquidColor: string
  ringColor: string
  bgColor: string
}

export interface IntroStep {
  title: string
  desc: string
}

export interface ReactionKeyEntry {
  type: string
  results: string[]
  color: string // tailwind bg color
  textColor: string
}

export interface TestDef {
  id: string
  name: string
  category: string
  emoji: string
  gradient: string
  desc: string
  reagents: ReagentDef[]
  unknownTypes: string[]
  getReaction: (unknownType: string, r1Added: boolean, r2Added: boolean) => ReactionResult
  introSteps: IntroStep[]
  reactionKey: ReactionKeyEntry[]
  recap: string[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALCOHOLS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

export const lucasTest: TestDef = {
  id: 'lucas',
  name: 'Lucas Test',
  category: 'Alcohols',
  emoji: '🧪',
  gradient: 'from-amber-400 to-orange-500',
  desc: 'Distinguish 1°, 2°, 3° alcohols using Lucas Reagent (ZnCl₂ + conc. HCl). Watch for turbidity!',
  reagents: [
    { id: 'lucas', name: 'Lucas Reagent', shortName: 'ZnCl₂+HCl', accentColor: '#d97706', liquidColor: 'rgba(251,191,36,0.3)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-50' },
    { id: 'water', name: 'Water (for dilution)', shortName: 'H₂O', accentColor: '#3b82f6', liquidColor: 'rgba(96,165,250,0.2)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['1° Alcohol', '2° Alcohol', '3° Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add Lucas Reagent first.' }
    if (type === '3° Alcohol') return { visual: 'turbidity', liquidColor: 'rgba(255,255,255,0.7)', turbiditySpeed: 'immediate', description: 'Immediate turbidity! 3° alcohol reacts instantly forming alkyl chloride.' }
    if (type === '2° Alcohol') return { visual: 'turbidity', liquidColor: 'rgba(255,255,255,0.5)', turbiditySpeed: 'slow', description: 'Turbidity appears within 5 minutes. 2° alcohol reacts slowly.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,220,255,0.2)', description: 'No turbidity at room temperature. 1° alcohol does not react.' }
  },
  introSteps: [
    { title: 'Three Unknown Alcohols', desc: 'Tubes A, B, C contain 1°, 2°, and 3° alcohols — identify which is which.' },
    { title: 'Add Lucas Reagent', desc: 'Lucas Reagent (ZnCl₂ + conc. HCl) reacts differently with each alcohol type.' },
    { title: 'Observe Turbidity', desc: 'Immediate cloudiness = 3° alcohol. Slow (5 min) = 2° alcohol. No reaction = 1° alcohol.' },
  ],
  reactionKey: [
    { type: '3° Alcohol', results: ['+ Lucas Reagent → Immediate turbidity'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: '2° Alcohol', results: ['+ Lucas Reagent → Turbidity in ~5 min'], color: 'bg-amber-50', textColor: 'text-amber-700' },
    { type: '1° Alcohol', results: ['+ Lucas Reagent → No turbidity at RT'], color: 'bg-emerald-50', textColor: 'text-emerald-700' },
  ],
  recap: [
    '3° Alcohols react fastest with Lucas Reagent because the 3° carbocation formed is the most stable.',
    '2° Alcohols react slowly as the 2° carbocation is moderately stable.',
    '1° Alcohols do not react at room temperature because 1° carbocation is too unstable to form.',
  ],
}

export const chromicAcidTest: TestDef = {
  id: 'chromic-acid',
  name: 'Chromic Acid Test',
  category: 'Alcohols',
  emoji: '🔬',
  gradient: 'from-orange-400 to-red-500',
  desc: 'Jones oxidation test: K₂Cr₂O₇/H₂SO₄ distinguishes oxidizable alcohols from 3° alcohols.',
  reagents: [
    { id: 'chromic', name: 'Chromic Acid Reagent', shortName: 'K₂Cr₂O₇', accentColor: '#ea580c', liquidColor: 'rgba(234,88,12,0.3)', ringColor: 'ring-orange-400', bgColor: 'bg-orange-50' },
    { id: 'acid', name: 'Dil. H₂SO₄', shortName: 'H₂SO₄', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.15)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
  ],
  unknownTypes: ['1° Alcohol', '2° Alcohol', '3° Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add Chromic Acid Reagent first.' }
    if (type === '3° Alcohol') return { visual: 'no-reaction', liquidColor: 'rgba(234,88,12,0.25)', description: 'No color change. 3° alcohols cannot be oxidized.' }
    return { visual: 'color-change', liquidColor: 'rgba(34,197,94,0.4)', description: `Orange → Green! ${type} is oxidized. Cr⁶⁺ (orange) reduces to Cr³⁺ (green).` }
  },
  introSteps: [
    { title: 'Three Unknown Alcohols', desc: 'Tubes A, B, C contain 1°, 2°, and 3° alcohols.' },
    { title: 'Add Chromic Acid', desc: 'K₂Cr₂O₇/H₂SO₄ is orange. If the alcohol can be oxidized, it turns green.' },
    { title: 'Observe Color Change', desc: 'Orange → Green = oxidizable (1° or 2°). No change = 3° alcohol.' },
  ],
  reactionKey: [
    { type: '1° Alcohol', results: ['Orange → Green (oxidized to aldehyde/carboxylic acid)'], color: 'bg-emerald-50', textColor: 'text-emerald-700' },
    { type: '2° Alcohol', results: ['Orange → Green (oxidized to ketone)'], color: 'bg-amber-50', textColor: 'text-amber-700' },
    { type: '3° Alcohol', results: ['No color change (cannot be oxidized)'], color: 'bg-red-50', textColor: 'text-red-700' },
  ],
  recap: [
    '1° Alcohols are oxidized first to aldehydes, then to carboxylic acids. The Cr⁶⁺ is reduced to Cr³⁺, changing color from orange to green.',
    '2° Alcohols are oxidized to ketones. Same color change occurs.',
    '3° Alcohols have no H on the carbon bearing the OH group, so they cannot be oxidized. No color change.',
  ],
}

export const victorMeyerTest: TestDef = {
  id: 'victor-meyer',
  name: 'Victor Meyer Test',
  category: 'Alcohols',
  emoji: '🎨',
  gradient: 'from-red-400 to-pink-500',
  desc: 'Classical test: Different colored solutions for 1° (red), 2° (blue), 3° (colorless) alcohols.',
  reagents: [
    { id: 'vm-r1', name: 'PI₃ / Red P + I₂', shortName: 'PI₃', accentColor: '#be185d', liquidColor: 'rgba(190,24,93,0.2)', ringColor: 'ring-pink-400', bgColor: 'bg-pink-50' },
    { id: 'vm-r2', name: 'AgNO₂ / NaNO₂', shortName: 'AgNO₂', accentColor: '#7c3aed', liquidColor: 'rgba(124,58,237,0.2)', ringColor: 'ring-violet-400', bgColor: 'bg-violet-50' },
  ],
  unknownTypes: ['1° Alcohol', '2° Alcohol', '3° Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (r1 && !r2) return { visual: 'color-change', liquidColor: 'rgba(200,210,240,0.2)', description: 'Step 1 done: alkyl iodide formed. Now add AgNO₂.' }
    if (!r1 && r2) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add PI₃ first, then AgNO₂.' }
    if (type === '1° Alcohol') return { visual: 'color-change', liquidColor: 'rgba(239,68,68,0.4)', description: 'Red color! Nitroalkane formed from 1° alcohol gives red color with nitrous acid.' }
    if (type === '2° Alcohol') return { visual: 'color-change', liquidColor: 'rgba(59,130,246,0.4)', description: 'Blue color! Pseudonitrol formed from 2° alcohol gives blue color.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'No color. 3° alcohol does not give this test — nitroalkane is not formed.' }
  },
  introSteps: [
    { title: 'Three Unknown Alcohols', desc: 'Tubes A, B, C contain 1°, 2°, and 3° alcohols.' },
    { title: 'Add PI₃ then AgNO₂', desc: 'First converts alcohol to alkyl iodide, then to nitroalkane.' },
    { title: 'Observe Color', desc: 'Red = 1° alcohol. Blue = 2° alcohol. Colorless = 3° alcohol.' },
  ],
  reactionKey: [
    { type: '1° Alcohol', results: ['Red color (nitroalkane → nitrous acid → red)'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: '2° Alcohol', results: ['Blue color (pseudonitrol formed)'], color: 'bg-blue-50', textColor: 'text-blue-700' },
    { type: '3° Alcohol', results: ['No color (does not give test)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    '1° Alcohol → R-I → R-NO₂ (1° nitroalkane) → with HNO₂ gives red color.',
    '2° Alcohol → R-I → R-NO₂ (2° nitroalkane) → with HNO₂ gives blue pseudonitrol.',
    '3° Alcohol does not form nitroalkane under these conditions, so no color is observed.',
  ],
}

export const cericAmmoniumNitrateTest: TestDef = {
  id: 'ceric',
  name: 'Ceric Ammonium Nitrate Test',
  category: 'Alcohols',
  emoji: '⚡',
  gradient: 'from-yellow-400 to-amber-500',
  desc: 'Ceric Ammonium Nitrate turns from yellow to red in presence of alcohols (1°, 2°, 3°).',
  reagents: [
    { id: 'can', name: 'Ceric Ammonium Nitrate', shortName: '(NH₄)₂Ce(NO₃)₆', accentColor: '#ca8a04', liquidColor: 'rgba(202,138,4,0.3)', ringColor: 'ring-yellow-400', bgColor: 'bg-yellow-50' },
    { id: 'can-dil', name: 'Dilute HNO₃', shortName: 'HNO₃', accentColor: '#a16207', liquidColor: 'rgba(161,98,7,0.15)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-50' },
  ],
  unknownTypes: ['Alcohol', 'Phenol', 'Carboxylic Acid'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add Ceric Ammonium Nitrate first.' }
    if (type === 'Alcohol') return { visual: 'color-change', liquidColor: 'rgba(220,38,38,0.35)', description: 'Yellow → Red! Alcohol forms a red complex with ceric ammonium nitrate.' }
    if (type === 'Phenol') return { visual: 'color-change', liquidColor: 'rgba(34,100,50,0.3)', description: 'Green/brown color. Phenol gives a different colored complex.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(202,138,4,0.2)', description: 'No red color. Carboxylic acids do not form the red complex.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain an alcohol, a phenol, and a carboxylic acid.' },
    { title: 'Add CAN Reagent', desc: 'Ceric Ammonium Nitrate is yellow. It reacts with alcohols to give red color.' },
    { title: 'Observe Color', desc: 'Red = Alcohol. Green-brown = Phenol. No change = Carboxylic acid.' },
  ],
  reactionKey: [
    { type: 'Alcohol', results: ['Yellow → Red (alkoxy cerium complex)'], color: 'bg-red-50', textColor: 'text-red-700' },
    { type: 'Phenol', results: ['Green-brown color'], color: 'bg-green-50', textColor: 'text-green-700' },
    { type: 'Carboxylic Acid', results: ['No red color change'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Alcohols react with CAN to form a red alkoxy cerium complex: (NH₄)₂Ce(NO₃)₅(OR).',
    'Phenols give a green-brown to brown color, different from the red of alcohols.',
    'Carboxylic acids do not give the characteristic red color.',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHENOLS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

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
}

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
}

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
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALDEHYDES & KETONES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

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
}

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
}

export const schiffTest: TestDef = {
  id: 'schiff',
  name: "Schiff's Test",
  category: 'Aldehydes & Ketones',
  emoji: '💗',
  gradient: 'from-pink-400 to-rose-500',
  desc: "Schiff's reagent (colorless) restores pink/magenta color with aldehydes. Very sensitive test.",
  reagents: [
    { id: 'schiff', name: "Schiff's Reagent", shortName: 'Schiff Reag.', accentColor: '#e11d48', liquidColor: 'rgba(225,29,72,0.1)', ringColor: 'ring-pink-400', bgColor: 'bg-pink-50' },
    { id: 'schiff-wait', name: 'Wait (observe)', shortName: 'Wait', accentColor: '#be123c', liquidColor: 'rgba(190,18,60,0.08)', ringColor: 'ring-rose-400', bgColor: 'bg-rose-50' },
  ],
  unknownTypes: ['Aldehyde', 'Ketone', 'Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: "Add Schiff's Reagent first." }
    if (type === 'Aldehyde') return { visual: 'color-change', liquidColor: 'rgba(225,29,72,0.35)', description: 'Pink/magenta color restored! Aldehyde restores the color of Schiff reagent.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(225,29,72,0.05)', description: `No pink color. ${type} does not restore Schiff's reagent color.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain aldehyde, ketone, and alcohol.' },
    { title: "Add Schiff's Reagent", desc: "Colorless Schiff's reagent (decolorized fuchsin) turns pink with aldehydes." },
    { title: 'Observe Color', desc: 'Pink/magenta = Aldehyde. No color = Ketone or Alcohol.' },
  ],
  reactionKey: [
    { type: 'Aldehyde', results: ['Pink/magenta color restored'], color: 'bg-pink-50', textColor: 'text-pink-700' },
    { type: 'Ketone', results: ['No pink color'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Alcohol', results: ['No pink color'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    "Schiff's reagent is decolorized fuchsin (rosaniline). Aldehydes react to restore the magenta color.",
    'Ketones and alcohols do not restore the color.',
    'This is one of the most sensitive tests for aldehydes.',
  ],
}

export const dnpTest: TestDef = {
  id: 'dnp',
  name: '2,4-DNP Test',
  category: 'Aldehydes & Ketones',
  emoji: '🌼',
  gradient: 'from-yellow-400 to-amber-500',
  desc: '2,4-Dinitrophenylhydrazine gives yellow/orange precipitate with carbonyl compounds (aldehydes & ketones).',
  reagents: [
    { id: 'dnp', name: '2,4-DNP Reagent', shortName: '2,4-DNPH', accentColor: '#ca8a04', liquidColor: 'rgba(202,138,4,0.25)', ringColor: 'ring-yellow-400', bgColor: 'bg-yellow-50' },
    { id: 'dnp-acid', name: 'Dil. H₂SO₄', shortName: 'H₂SO₄', accentColor: '#a16207', liquidColor: 'rgba(161,98,7,0.1)', ringColor: 'ring-amber-400', bgColor: 'bg-amber-50' },
  ],
  unknownTypes: ['Aldehyde', 'Ketone', 'Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add 2,4-DNP reagent first.' }
    if (type === 'Aldehyde') return { visual: 'precipitate', precipitateColor: '#eab308', liquidColor: 'rgba(234,179,8,0.3)', description: 'Yellow precipitate! 2,4-DNP hydrazone formed with aldehyde.' }
    if (type === 'Ketone') return { visual: 'precipitate', precipitateColor: '#f97316', liquidColor: 'rgba(249,115,22,0.3)', description: 'Orange precipitate! 2,4-DNP hydrazone formed with ketone.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(202,138,4,0.1)', description: 'No precipitate. Alcohols do not have a carbonyl group.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain aldehyde, ketone, and alcohol.' },
    { title: 'Add 2,4-DNP Reagent', desc: '2,4-DNPH reacts with C=O group to form hydrazones (yellow/orange ppt).' },
    { title: 'Observe Precipitate', desc: 'Yellow ppt = Aldehyde. Orange ppt = Ketone. No ppt = Alcohol.' },
  ],
  reactionKey: [
    { type: 'Aldehyde', results: ['Yellow precipitate (2,4-DNP hydrazone)'], color: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { type: 'Ketone', results: ['Orange precipitate (2,4-DNP hydrazone)'], color: 'bg-orange-50', textColor: 'text-orange-700' },
    { type: 'Alcohol', results: ['No precipitate (no C=O group)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    '2,4-DNPH reacts with the carbonyl group (C=O) of aldehydes and ketones to form 2,4-dinitrophenylhydrazones.',
    'Aldehydes typically give yellow precipitates, while ketones give orange precipitates.',
    'Alcohols do not have a C=O group and give no precipitate. This test confirms the presence of a carbonyl group.',
  ],
}

export const iodoformTest: TestDef = {
  id: 'iodoform',
  name: 'Iodoform Test',
  category: 'Aldehydes & Ketones',
  emoji: '🧈',
  gradient: 'from-lime-400 to-yellow-500',
  desc: 'I₂/NaOH gives yellow precipitate of CHI₃ with methyl ketones and ethanol. Has antiseptic smell!',
  reagents: [
    { id: 'i2', name: 'Iodine Solution', shortName: 'I₂', accentColor: '#65a30d', liquidColor: 'rgba(101,163,13,0.25)', ringColor: 'ring-lime-400', bgColor: 'bg-lime-50' },
    { id: 'naoh-i', name: 'NaOH Solution', shortName: 'NaOH', accentColor: '#2563eb', liquidColor: 'rgba(37,99,235,0.15)', ringColor: 'ring-blue-400', bgColor: 'bg-blue-50' },
  ],
  unknownTypes: ['Ethanol/CH₃CHO', 'Methyl Ketone', 'Other Ketone'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add I₂ solution first.' }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(101,163,13,0.15)', description: 'I₂ added. Now add NaOH to complete the test.' }
    if (type === 'Ethanol/CH₃CHO') return { visual: 'precipitate', precipitateColor: '#facc15', liquidColor: 'rgba(250,204,21,0.3)', smellType: 'antiseptic', description: 'Yellow precipitate of CHI₃ (iodoform)! Antiseptic smell. CH₃CH₂OH or CH₃CHO detected.' }
    if (type === 'Methyl Ketone') return { visual: 'precipitate', precipitateColor: '#facc15', liquidColor: 'rgba(250,204,21,0.3)', smellType: 'antiseptic', description: 'Yellow precipitate of CHI₃! Methyl ketone (CH₃CO-) detected. Antiseptic smell.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(101,163,13,0.1)', description: 'No yellow precipitate. This compound does not have a CH₃CO- or CH₃CH(OH)- group.' }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain ethanol/acetaldehyde, methyl ketone, and other ketone.' },
    { title: 'Add I₂ + NaOH', desc: 'I₂/NaOH gives yellow CHI₃ precipitate with CH₃CO- or CH₃CH(OH)- groups.' },
    { title: 'Observe Precipitate', desc: 'Yellow ppt + antiseptic smell = Positive. No ppt = Negative.' },
  ],
  reactionKey: [
    { type: 'Ethanol/CH₃CHO', results: ['Yellow CHI₃ precipitate + antiseptic smell'], color: 'bg-lime-50', textColor: 'text-lime-700' },
    { type: 'Methyl Ketone', results: ['Yellow CHI₃ precipitate + antiseptic smell'], color: 'bg-yellow-50', textColor: 'text-yellow-700' },
    { type: 'Other Ketone', results: ['No yellow precipitate'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Compounds with CH₃CO- group (methyl ketones) or CH₃CH(OH)- group (ethanol) give the iodoform test.',
    'I₂/NaOH oxidizes and iodinates the methyl group, forming yellow CHI₃ (iodoform) with a characteristic antiseptic smell.',
    'Other ketones (without CH₃CO- group) do not give this test.',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// CARBOXYLIC ACIDS TESTS
// ═══════════════════════════════════════════════════════════════════════════════

export const nahco3Test: TestDef = {
  id: 'nahco3',
  name: 'Sodium Bicarbonate Test',
  category: 'Carboxylic Acids',
  emoji: '🫧',
  gradient: 'from-cyan-400 to-blue-500',
  desc: 'NaHCO₃ produces brisk effervescence (CO₂) with carboxylic acids. Phenols and alcohols do not react.',
  reagents: [
    { id: 'nahco3', name: 'NaHCO₃ Solution', shortName: 'NaHCO₃', accentColor: '#0891b2', liquidColor: 'rgba(8,145,178,0.2)', ringColor: 'ring-cyan-400', bgColor: 'bg-cyan-50' },
    { id: 'lime', name: 'Ca(OH)₂ (lime water)', shortName: 'Ca(OH)₂', accentColor: '#e5e7eb', liquidColor: 'rgba(229,231,235,0.3)', ringColor: 'ring-gray-300', bgColor: 'bg-gray-50' },
  ],
  unknownTypes: ['Carboxylic Acid', 'Phenol', 'Alcohol'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add NaHCO₃ solution first.' }
    if (r1 && !r2) {
      if (type === 'Carboxylic Acid') return { visual: 'effervescence', liquidColor: 'rgba(8,145,178,0.15)', description: 'Brisk effervescence! CO₂ gas evolved from carboxylic acid + NaHCO₃.' }
      return { visual: 'no-reaction', liquidColor: 'rgba(8,145,178,0.1)', description: `No effervescence. ${type} is weaker than H₂CO₃ and does not react.` }
    }
    // Both added - test CO2 with lime water
    if (type === 'Carboxylic Acid') return { visual: 'effervescence', liquidColor: 'rgba(255,255,255,0.4)', description: 'CO₂ turns lime water milky! Confirmed carboxylic acid.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(8,145,178,0.1)', description: `No CO₂ evolved. ${type} confirmed.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain carboxylic acid, phenol, and alcohol.' },
    { title: 'Add NaHCO₃', desc: 'Carboxylic acids are stronger than H₂CO₃ and release CO₂ with NaHCO₃.' },
    { title: 'Observe Effervescence', desc: 'Brisk effervescence (CO₂) = Carboxylic acid. No bubbles = Phenol or Alcohol.' },
  ],
  reactionKey: [
    { type: 'Carboxylic Acid', results: ['Brisk effervescence (CO₂)', 'CO₂ turns lime water milky'], color: 'bg-cyan-50', textColor: 'text-cyan-700' },
    { type: 'Phenol', results: ['No effervescence (weaker than H₂CO₃)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Alcohol', results: ['No effervescence (neutral)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Carboxylic acids are stronger acids than H₂CO₃ (carbonic acid), so they displace CO₂ from NaHCO₃.',
    'Phenols are weaker acids than H₂CO₃ and do not react with NaHCO₃ — this is a key distinction.',
    'Alcohols are essentially neutral and do not react with NaHCO₃.',
  ],
}

export const esterTest: TestDef = {
  id: 'ester',
  name: 'Esterification Test',
  category: 'Carboxylic Acids',
  emoji: '🌸',
  gradient: 'from-pink-400 to-rose-500',
  desc: 'Carboxylic acid + Alcohol + H₂SO₄ (catalyst) → Ester with sweet fruity smell!',
  reagents: [
    { id: 'ethanol', name: 'Ethanol', shortName: 'C₂H₅OH', accentColor: '#be185d', liquidColor: 'rgba(190,24,93,0.15)', ringColor: 'ring-pink-400', bgColor: 'bg-pink-50' },
    { id: 'h2so4', name: 'Conc. H₂SO₄ (catalyst)', shortName: 'H₂SO₄', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.1)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
  ],
  unknownTypes: ['Carboxylic Acid', 'Phenol', 'Aldehyde'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add ethanol first.' }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(190,24,93,0.1)', description: 'Ethanol added. Now add H₂SO₄ catalyst and heat.' }
    if (type === 'Carboxylic Acid') return { visual: 'fruity-smell', liquidColor: 'rgba(244,114,182,0.25)', description: 'Sweet fruity smell! Ester formed from carboxylic acid + ethanol.' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: `No fruity smell. ${type} does not undergo esterification with ethanol.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain carboxylic acid, phenol, and aldehyde.' },
    { title: 'Add Ethanol + H₂SO₄', desc: 'Conc. H₂SO₄ catalyzes ester formation: RCOOH + C₂H₅OH → RCOOC₂H₅ + H₂O.' },
    { title: 'Smell the Product', desc: 'Sweet fruity smell = Ester formed = Carboxylic acid. No smell = Phenol/Aldehyde.' },
  ],
  reactionKey: [
    { type: 'Carboxylic Acid', results: ['Sweet fruity smell (ester formed)'], color: 'bg-pink-50', textColor: 'text-pink-700' },
    { type: 'Phenol', results: ['No fruity smell (phenol ester less distinct)'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: 'Aldehyde', results: ['No ester formation'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    'Carboxylic acids react with alcohols in the presence of conc. H₂SO₄ to form esters with characteristic fruity smells.',
    'This is Fischer esterification: RCOOH + R\'OH ⇌ RCOOR\' + H₂O (H₂SO₄ catalyst, heat).',
    'Phenols can form esters but the product smell is different. Aldehydes do not undergo esterification.',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// AMINES TESTS
// ═══════════════════════════════════════════════════════════════════════════════

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
}

export const carbylamineTest: TestDef = {
  id: 'carbylamine',
  name: 'Carbylamine Test',
  category: 'Amines',
  emoji: '💨',
  gradient: 'from-lime-400 to-green-500',
  desc: 'CHCl₃ + alc. KOH gives extremely foul smell (isocyanide) with 1° amines only!',
  reagents: [
    { id: 'chcl3', name: 'Chloroform', shortName: 'CHCl₃', accentColor: '#7c3aed', liquidColor: 'rgba(124,58,237,0.25)', ringColor: 'ring-violet-400', bgColor: 'bg-violet-50' },
    { id: 'koh', name: 'Alcoholic KOH', shortName: 'alc. KOH', accentColor: '#059669', liquidColor: 'rgba(5,150,105,0.25)', ringColor: 'ring-emerald-400', bgColor: 'bg-emerald-50' },
  ],
  unknownTypes: ['1° Amine', '2° Amine', '3° Amine'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (r1 && !r2) return { visual: 'no-reaction', liquidColor: 'rgba(124,58,237,0.15)', description: 'CHCl₃ added. Now add alc. KOH and heat.' }
    if (!r1 && r2) return { visual: 'no-reaction', liquidColor: 'rgba(5,150,105,0.15)', description: 'Add CHCl₃ first for the carbylamine test.' }
    if (type === '1° Amine') return { visual: 'foul-smell', liquidColor: 'rgba(132,204,22,0.3)', smellType: 'foul', description: 'FOUL SMELL! Isocyanide (carbylamine) formed — extremely offensive odor!' }
    return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.2)', description: `No reaction. ${type} does NOT give the carbylamine test.` }
  },
  introSteps: [
    { title: 'Three Unknown Amines', desc: 'Tubes A, B, C contain 1°, 2°, and 3° amines.' },
    { title: 'Add CHCl₃ + Alc. KOH', desc: 'Heat the mixture. Only 1° amines form isocyanides.' },
    { title: 'Smell the Result', desc: 'Extremely foul smell = 1° amine. No smell = 2° or 3° amine.' },
  ],
  reactionKey: [
    { type: '1° Amine', results: ['Extremely foul smell (isocyanide)'], color: 'bg-lime-50', textColor: 'text-lime-700' },
    { type: '2° Amine', results: ['No foul smell'], color: 'bg-gray-50', textColor: 'text-gray-700' },
    { type: '3° Amine', results: ['No foul smell'], color: 'bg-gray-50', textColor: 'text-gray-700' },
  ],
  recap: [
    '1° Amines react with CHCl₃ and alcoholic KOH to form isocyanides (R-NC), which have an extremely offensive odor.',
    '2° and 3° amines do not give this test — no isocyanide is formed.',
    'This test is specific for primary amines (both aliphatic and aromatic).',
  ],
}

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
}

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
}

// ═══════════════════════════════════════════════════════════════════════════════
// SODIUM METAL TEST (General)
// ═══════════════════════════════════════════════════════════════════════════════

export const sodiumMetalTest: TestDef = {
  id: 'sodium-metal',
  name: 'Sodium Metal Test',
  category: 'General',
  emoji: '🔥',
  gradient: 'from-red-400 to-yellow-500',
  desc: 'Na metal reacts with compounds having active H (alcohols, phenols, carboxylic acids) → H₂ gas (effervescence).',
  reagents: [
    { id: 'na-metal', name: 'Sodium Metal', shortName: 'Na', accentColor: '#dc2626', liquidColor: 'rgba(220,38,38,0.15)', ringColor: 'ring-red-400', bgColor: 'bg-red-50' },
    { id: 'flame', name: 'Bring near flame', shortName: '🔥 Test', accentColor: '#ea580c', liquidColor: 'rgba(234,88,12,0.1)', ringColor: 'ring-orange-400', bgColor: 'bg-orange-50' },
  ],
  unknownTypes: ['Alcohol', 'Phenol', 'Carboxylic Acid'],
  getReaction(type, r1, r2) {
    if (!r1 && !r2) return { visual: 'no-reaction', liquidColor: 'transparent', description: '' }
    if (!r1) return { visual: 'no-reaction', liquidColor: 'rgba(200,210,240,0.15)', description: 'Add sodium metal first.' }
    if (r1 && !r2) return { visual: 'effervescence', liquidColor: 'rgba(220,38,38,0.1)', description: `Effervescence (H₂ gas)! ${type} has an active H that reacts with Na metal.` }
    // Both - test H2 with flame
    return { visual: 'effervescence', liquidColor: 'rgba(220,38,38,0.1)', description: `H₂ gas burns with a "pop" sound! Confirmed active hydrogen in ${type}.` }
  },
  introSteps: [
    { title: 'Three Unknown Compounds', desc: 'Tubes A, B, C contain alcohol, phenol, and carboxylic acid.' },
    { title: 'Add Sodium Metal', desc: 'Na reacts with compounds containing active H (O-H bond) to release H₂.' },
    { title: 'Test the Gas', desc: 'All three give H₂, but reaction vigor differs. Pair with other tests to distinguish.' },
  ],
  reactionKey: [
    { type: 'Alcohol', results: ['H₂ gas (moderate effervescence)', '2ROH + 2Na → 2RONa + H₂'], color: 'bg-amber-50', textColor: 'text-amber-700' },
    { type: 'Phenol', results: ['H₂ gas (moderate effervescence)', '2ArOH + 2Na → 2ArONa + H₂'], color: 'bg-purple-50', textColor: 'text-purple-700' },
    { type: 'Carboxylic Acid', results: ['H₂ gas (vigorous effervescence)', '2RCOOH + 2Na → 2RCOONa + H₂'], color: 'bg-red-50', textColor: 'text-red-700' },
  ],
  recap: [
    'All compounds with active hydrogen (alcohols, phenols, carboxylic acids) react with Na metal to give H₂ gas.',
    'Carboxylic acids react most vigorously due to the most acidic O-H bond.',
    'This test alone cannot distinguish between them — use with NaHCO₃ test or FeCl₃ test.',
  ],
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALL TESTS REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

export const ALL_TESTS: TestDef[] = [
  // Alcohols
  lucasTest,
  chromicAcidTest,
  victorMeyerTest,
  cericAmmoniumNitrateTest,
  // Phenols
  fecl3Test,
  bromineWaterTest,
  libermannTest,
  // Aldehydes & Ketones
  tollensTest,
  fehlingsTest,
  schiffTest,
  dnpTest,
  iodoformTest,
  // Carboxylic Acids
  nahco3Test,
  esterTest,
  // Amines
  hinsbergTest,
  carbylamineTest,
  nitrousAcidTest,
  azoDyeTest,
  // General
  sodiumMetalTest,
]

export const TEST_CATEGORIES = [
  { name: 'Alcohols', emoji: '🍺', color: 'from-amber-400 to-orange-500' },
  { name: 'Phenols', emoji: '💜', color: 'from-purple-400 to-violet-500' },
  { name: 'Aldehydes & Ketones', emoji: '🪞', color: 'from-rose-400 to-pink-500' },
  { name: 'Carboxylic Acids', emoji: '🧪', color: 'from-cyan-400 to-blue-500' },
  { name: 'Amines', emoji: '💨', color: 'from-lime-400 to-green-500' },
  { name: 'General', emoji: '🔥', color: 'from-red-400 to-yellow-500' },
]
