'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Beaker, Droplets, TestTube2, CheckCircle2, XCircle, RotateCcw, BookOpen, Award, ChevronRight, Info, Zap, Eye } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type AmineDegree = '1°' | '2°' | '3°'
type Reagent = 'hinsberg' | 'naoh' | null
type GamePhase = 'intro' | 'experiment' | 'identify' | 'results'

interface TestTube {
  id: string
  label: string
  amine: AmineDegree
  hinsbergAdded: boolean
  naohAdded: boolean
  reaction: ReactionState
  liquidLevel: number // 0 = empty, 1 = half, 2 = full
  fizzing: boolean
}

interface ReactionState {
  precipitateFormed: boolean
  precipitateDissolved: boolean
  oilyLayer: boolean
  color: string
  description: string
  liquidColor: string
  liquidGradient: string
}

// ─── Chemistry Logic ─────────────────────────────────────────────────────────

function getReaction(amine: AmineDegree, hinsbergAdded: boolean, naohAdded: boolean): ReactionState {
  // No reagents — empty tube
  if (!hinsbergAdded && !naohAdded) {
    return {
      precipitateFormed: false,
      precipitateDissolved: false,
      oilyLayer: false,
      color: 'empty',
      description: '',
      liquidColor: 'transparent',
      liquidGradient: ''
    }
  }

  // Only Hinsberg added
  if (hinsbergAdded && !naohAdded) {
    if (amine === '1°') {
      return {
        precipitateFormed: true,
        precipitateDissolved: false,
        oilyLayer: false,
        color: 'white-precipitate',
        description: 'White precipitate formed! A sulfonamide product has been produced.',
        liquidColor: 'rgba(220, 230, 255, 0.6)',
        liquidGradient: 'from-blue-100/50 via-white/30 to-transparent'
      }
    }
    if (amine === '2°') {
      return {
        precipitateFormed: true,
        precipitateDissolved: false,
        oilyLayer: false,
        color: 'white-precipitate',
        description: 'White precipitate formed! A sulfonamide product has been produced.',
        liquidColor: 'rgba(220, 230, 255, 0.6)',
        liquidGradient: 'from-blue-100/50 via-white/30 to-transparent'
      }
    }
    // 3° — no reaction
    return {
      precipitateFormed: false,
      precipitateDissolved: false,
      oilyLayer: false,
      color: 'no-reaction',
      description: 'No visible reaction. The amine remains unchanged.',
      liquidColor: 'rgba(200, 210, 240, 0.3)',
      liquidGradient: 'from-blue-50/30 via-transparent to-transparent'
    }
  }

  // Only NaOH added (without Hinsberg first)
  if (!hinsbergAdded && naohAdded) {
    if (amine === '3°') {
      return {
        precipitateFormed: false,
        precipitateDissolved: false,
        oilyLayer: true,
        color: 'oily',
        description: 'Oily layer separates — amine is insoluble in aqueous base.',
        liquidColor: 'rgba(255, 220, 150, 0.4)',
        liquidGradient: 'from-amber-100/40 via-amber-50/20 to-transparent'
      }
    }
    return {
      precipitateFormed: false,
      precipitateDissolved: false,
      oilyLayer: false,
      color: 'slight-milky',
      description: 'Slight cloudiness. Add Hinsberg reagent first for proper test.',
      liquidColor: 'rgba(200, 210, 240, 0.2)',
      liquidGradient: 'from-gray-100/30 via-transparent to-transparent'
    }
  }

  // Both added
  if (amine === '1°') {
    return {
      precipitateFormed: true,
      precipitateDissolved: true,
      oilyLayer: false,
      color: 'clear-dissolved',
      description: 'Precipitate dissolved! The sulfonamide has an acidic H, making it soluble in NaOH.',
      liquidColor: 'rgba(180, 210, 255, 0.35)',
      liquidGradient: 'from-blue-100/30 via-blue-50/15 to-transparent'
    }
  }
  if (amine === '2°') {
    return {
      precipitateFormed: true,
      precipitateDissolved: false,
      oilyLayer: false,
      color: 'white-precipitate-persist',
      description: 'Precipitate remains! The sulfonamide has no acidic H, so it stays insoluble in NaOH.',
      liquidColor: 'rgba(220, 230, 255, 0.6)',
      liquidGradient: 'from-blue-100/50 via-white/30 to-transparent'
    }
  }
  // 3°
  return {
    precipitateFormed: false,
    precipitateDissolved: false,
    oilyLayer: true,
    color: 'oily-both',
    description: 'No reaction with Hinsberg. Oily layer appears with NaOH — original amine is insoluble.',
    liquidColor: 'rgba(255, 220, 150, 0.4)',
    liquidGradient: 'from-amber-100/40 via-amber-50/20 to-transparent'
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function createTestTubes(): TestTube[] {
  const amines = shuffleArray<AmineDegree>(['1°', '2°', '3°'])
  return [
    { id: 'A', label: 'Test Tube A', amine: amines[0], hinsbergAdded: false, naohAdded: false, reaction: getReaction(amines[0], false, false), liquidLevel: 0, fizzing: false },
    { id: 'B', label: 'Test Tube B', amine: amines[1], hinsbergAdded: false, naohAdded: false, reaction: getReaction(amines[1], false, false), liquidLevel: 0, fizzing: false },
    { id: 'C', label: 'Test Tube C', amine: amines[2], hinsbergAdded: false, naohAdded: false, reaction: getReaction(amines[2], false, false), liquidLevel: 0, fizzing: false },
  ]
}

// ─── Fizz Bubble Component ───────────────────────────────────────────────────

function FizzBubbles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            left: `${15 + Math.random() * 70}%`,
            bottom: '10%',
          }}
          animate={{
            y: [0, -40 - Math.random() * 40],
            opacity: [0.9, 0.4, 0],
            scale: [1, 1.3, 0.5],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.8,
            delay: Math.random() * 0.6,
            repeat: 3,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Droplet Animation ───────────────────────────────────────────────────────

function DropletFall({ reagent, targetRect }: { reagent: Reagent; targetRect: DOMRect | null }) {
  if (!targetRect) return null

  const color = reagent === 'hinsberg' ? '#fbbf24' : '#60a5fa'

  return (
    <motion.div
      className="fixed z-[100] pointer-events-none"
      style={{
        left: targetRect.left + targetRect.width / 2 - 4,
        top: targetRect.top,
      }}
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: targetRect.height * 0.4, opacity: 0.3, scale: 0.6 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.9, 0.6] }}
    >
      {/* Teardrop shape */}
      <svg width="8" height="14" viewBox="0 0 8 14">
        <path d="M4 0 C4 0 0 7 0 9.5 C0 11.7 1.8 14 4 14 C6.2 14 8 11.7 8 9.5 C8 7 4 0 4 0Z" fill={color} />
      </svg>
    </motion.div>
  )
}

// ─── Test Tube SVG Visual ────────────────────────────────────────────────────

function TestTubeVisual({ tube, onClick, active, tubeRef }: {
  tube: TestTube
  onClick: () => void
  active: boolean
  tubeRef: React.RefObject<HTMLDivElement | null>
}) {
  const { reaction, liquidLevel } = tube

  // Liquid height as percentage of tube interior
  const liquidHeightPct = liquidLevel === 0 ? 0 : liquidLevel === 1 ? 45 : 65

  return (
    <motion.div
      ref={tubeRef}
      className={`relative flex flex-col items-center cursor-pointer select-none ${active ? 'hover:scale-[1.03]' : ''}`}
      onClick={onClick}
      whileHover={active ? { y: -5 } : {}}
      whileTap={active ? { scale: 0.97 } : {}}
    >
      {/* Tube Label */}
      <motion.div
        className={`text-xl font-black mb-2 px-5 py-1.5 rounded-xl transition-all duration-300 tracking-wide ${
          (tube.hinsbergAdded || tube.naohAdded)
            ? 'bg-emerald-100 text-emerald-800 shadow-md'
            : 'bg-gray-100 text-gray-500'
        }`}
        layout
      >
        {tube.id}
      </motion.div>

      {/* Test Tube SVG */}
      <div className="relative" style={{ width: 80, height: 200 }}>
        <svg viewBox="0 0 80 200" className="w-full h-full" style={{ overflow: 'visible' }}>
          {/* Tube rim */}
          <rect x={14} y={4} width={52} height={8} rx={4} fill="#e5e7eb" stroke="#d1d5db" strokeWidth={1.5} />
          
          {/* Glass body */}
          <path
            d="M18 12 L18 155 Q18 185 40 185 Q62 185 62 155 L62 12"
            fill="rgba(255,255,255,0.08)"
            stroke="#d1d5db"
            strokeWidth={2}
            strokeLinecap="round"
          />

          {/* Liquid fill */}
          {liquidLevel > 0 && (
            <motion.path
              d={`M20 ${175 - liquidHeightPct * 1.4} L20 155 Q20 183 40 183 Q60 183 60 155 L60 ${175 - liquidHeightPct * 1.4}`}
              fill={reaction.liquidColor}
              initial={{ opacity: 0, d: `M20 175 L20 175 Q20 175 40 175 Q60 175 60 175 L60 175` }}
              animate={{
                opacity: 1,
                d: `M20 ${175 - liquidHeightPct * 1.4} L20 155 Q20 183 40 183 Q60 183 60 155 L60 ${175 - liquidHeightPct * 1.4}`
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          {/* Meniscus / liquid surface line */}
          {liquidLevel > 0 && (
            <motion.ellipse
              cx={40}
              cy={175 - liquidHeightPct * 1.4}
              rx={20}
              ry={3}
              fill={reaction.liquidColor}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={0.5}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            />
          )}

          {/* Precipitate settled at bottom */}
          {reaction.precipitateFormed && !reaction.precipitateDissolved && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}>
              <ellipse cx={40} cy={173} rx={17} ry={6} fill="white" stroke="#e5e7eb" strokeWidth={0.5} />
              <ellipse cx={34} cy={171} rx={5} ry={3} fill="white" opacity={0.7} />
              <ellipse cx={47} cy={172} rx={4} ry={2.5} fill="white" opacity={0.6} />
            </motion.g>
          )}

          {/* Precipitate dissolving animation — wisps going up */}
          {reaction.precipitateDissolved && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.5 }}>
              {[0, 1, 2, 3].map(i => (
                <motion.circle
                  key={i}
                  cx={32 + i * 6}
                  cy={170}
                  r={2}
                  fill="white"
                  opacity={0.5}
                  animate={{ cy: [170, 150, 130], opacity: [0.6, 0.3, 0] }}
                  transition={{ duration: 2, delay: 0.8 + i * 0.3, repeat: 1, ease: 'easeOut' }}
                />
              ))}
            </motion.g>
          )}

          {/* Oily layer near top of liquid */}
          {reaction.oilyLayer && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.6 }}>
              <ellipse cx={40} cy={175 - liquidHeightPct * 1.4 + 6} rx={18} ry={4} fill="#fcd34d" opacity={0.7} />
              <ellipse cx={40} cy={175 - liquidHeightPct * 1.4 + 6} rx={14} ry={2.5} fill="#fde68a" opacity={0.5} />
            </motion.g>
          )}

          {/* Glass shine */}
          <rect x={24} y={20} width={2.5} height={100} rx={1.25} fill="rgba(255,255,255,0.35)" />
          <rect x={54} y={30} width={1.5} height={60} rx={0.75} fill="rgba(255,255,255,0.15)" />
        </svg>

        {/* Fizz bubbles overlay */}
        <FizzBubbles active={tube.fizzing} />

        {/* "EMPTY" watermark when no liquid */}
        {liquidLevel === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase rotate-[-90deg]">empty</span>
          </div>
        )}
      </div>

      {/* Reagent badges */}
      <div className="flex gap-1 mt-2 min-h-[22px] flex-wrap justify-center">
        <AnimatePresence>
          {tube.hinsbergAdded && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0 }}
              className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold border border-amber-200"
            >
              Hinsberg
            </motion.span>
          )}
          {tube.naohAdded && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0 }}
              className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200"
            >
              NaOH
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Reaction description */}
      <AnimatePresence mode="wait">
        {(tube.hinsbergAdded || tube.naohAdded) && reaction.description && (
          <motion.div
            key={reaction.description}
            initial={{ opacity: 0, y: 8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="mt-1 text-[11px] text-center text-gray-500 max-w-[130px] leading-snug"
          >
            {reaction.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Reagent Bottle Visual ───────────────────────────────────────────────────

function ReagentBottle({ name, shortName, selected, onClick, color, accentColor, liquidColor }: {
  name: string
  shortName: string
  selected: boolean
  onClick: () => void
  color: string
  accentColor: string
  liquidColor: string
}) {
  return (
    <motion.div
      className={`relative flex flex-col items-center cursor-pointer p-3 rounded-2xl transition-all duration-300 ${
        selected
          ? `ring-[3px] ring-offset-2 shadow-xl scale-110 ${color}`
          : 'hover:bg-gray-50 hover:shadow-md'
      }`}
      onClick={onClick}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.93 }}
    >
      {/* Bottle SVG */}
      <div className="relative" style={{ width: 70, height: 110 }}>
        <svg viewBox="0 0 70 110" className="w-full h-full">
          {/* Cap */}
          <rect x={24} y={0} width={22} height={12} rx={3} fill={selected ? '#374151' : '#9ca3af'} />
          {/* Neck */}
          <rect x={27} y={12} width={16} height={18} fill={selected ? '#4b5563' : '#d1d5db'} />
          {/* Body */}
          <rect x={10} y={30} width={50} height={65} rx={6} fill={selected ? '#f9fafb' : '#ffffff'} stroke={selected ? accentColor : '#e5e7eb'} strokeWidth={selected ? 2.5 : 1.5} />
          {/* Liquid inside bottle */}
          <rect x={13} y={55} width={44} height={37} rx={4} fill={liquidColor} opacity={0.6} />
          {/* Label area */}
          <rect x={18} y={38} width={34} height={22} rx={3} fill="white" stroke="#e5e7eb" strokeWidth={0.5} />
          <text x={35} y={52} textAnchor="middle" fontSize={8} fontWeight="bold" fill={accentColor}>{shortName}</text>
          {/* Glass shine */}
          <rect x={15} y={35} width={2} height={30} rx={1} fill="rgba(255,255,255,0.5)" />
        </svg>

        {/* Animated droplet icon when selected */}
        {selected && (
          <motion.div
            className="absolute -top-2 -right-2"
            animate={{ y: [0, 3, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
          >
            <Droplets className="w-5 h-5 text-blue-500" />
          </motion.div>
        )}
      </div>

      {/* Bottle Name */}
      <div className={`mt-1 text-[11px] font-bold text-center leading-tight max-w-[100px] ${
        selected ? 'text-gray-800' : 'text-gray-400'
      }`}>
        {name}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-1 text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5"
        >
          <Zap className="w-3 h-3" /> Ready to add
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Intro Screen ────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="max-w-lg text-center py-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {/* Animated Flask Icon */}
        <motion.div
          className="mx-auto mb-6 w-28 h-28 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-300/50 relative overflow-hidden"
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
        >
          <FlaskConical className="w-14 h-14 text-white relative z-10" />
          {/* Bubbles inside flask icon */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/20"
              style={{ width: 6 + i * 3, height: 6 + i * 3, left: `${25 + i * 20}%` }}
              animate={{ bottom: ['20%', '70%'], opacity: [0.6, 0] }}
              transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }}
            />
          ))}
        </motion.div>

        <h1 className="text-5xl font-black text-gray-800 mb-2 tracking-tight">
          Hinsberg Test
        </h1>
        <p className="text-xl text-emerald-600 font-semibold mb-1">Virtual Chemistry Lab</p>
        <p className="text-base text-gray-400 mb-10">
          Identify unknown amines through interactive experimentation
        </p>

        {/* How it works */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border border-white/80 text-left">
          <h2 className="text-lg font-bold text-gray-700 mb-5 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            How It Works
          </h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-black">1</span>
              <div>
                <p className="font-semibold text-gray-700">Three Unknown Test Tubes</p>
                <p className="text-gray-500">Tubes A, B, and C each contain a different amine — 1°, 2°, or 3° — but you don&apos;t know which is which!</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black">2</span>
              <div>
                <p className="font-semibold text-gray-700">Add Reagents with the Dropper</p>
                <p className="text-gray-500">Pick Hinsberg Reagent or NaOH, then click a test tube. Watch the liquid fill and reactions happen in real-time!</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black">3</span>
              <div>
                <p className="font-semibold text-gray-700">Observe the Results</p>
                <p className="text-gray-500">Precipitate formation, dissolution, oily layers — each reaction reveals clues about the amine type.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-black">4</span>
              <div>
                <p className="font-semibold text-gray-700">Identify & Submit</p>
                <p className="text-gray-500">Based on your observations, assign each tube its correct amine degree and submit your answer!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hinsberg Test Key */}
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-10 shadow-xl border border-white/80 text-left">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Reaction Key
          </h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <span className="font-black text-emerald-700 text-base w-10 shrink-0">1°</span>
              <div>
                <p className="font-semibold text-emerald-800">+ Hinsberg → White precipitate</p>
                <p className="text-emerald-600">+ NaOH → Precipitate <strong>dissolves</strong> (acidic H on N)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <span className="font-black text-amber-700 text-base w-10 shrink-0">2°</span>
              <div>
                <p className="font-semibold text-amber-800">+ Hinsberg → White precipitate</p>
                <p className="text-amber-600">+ NaOH → Precipitate <strong>remains</strong> (no acidic H on N)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <span className="font-black text-blue-700 text-base w-10 shrink-0">3°</span>
              <div>
                <p className="font-semibold text-blue-800">+ Hinsberg → No reaction</p>
                <p className="text-blue-600">+ NaOH → Oily layer separates</p>
              </div>
            </div>
          </div>
        </div>

        <motion.button
          onClick={onStart}
          className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-300/40 hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          Enter the Lab <ChevronRight className="inline w-5 h-5 ml-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Results Screen ──────────────────────────────────────────────────────────

function ResultsScreen({ tubes, answers, onReset }: {
  tubes: TestTube[]
  answers: Record<string, AmineDegree>
  onReset: () => void
}) {
  const correct = tubes.filter(t => answers[t.id] === t.amine).length
  const total = tubes.length
  const perfect = correct === total

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="max-w-md w-full text-center py-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Score badge */}
        <motion.div
          className="mb-6"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}
        >
          {perfect ? (
            <div className="w-28 h-28 mx-auto bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-200/60 relative">
              <Award className="w-14 h-14 text-white" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-yellow-300"
                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>
          ) : (
            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-2xl ${
              correct >= 2
                ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200/60'
                : 'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-200/60'
            }`}>
              <span className="text-4xl font-black text-white">{correct}/{total}</span>
            </div>
          )}
        </motion.div>

        <h2 className="text-4xl font-black text-gray-800 mb-2">
          {perfect ? 'Perfect Score!' : correct >= 2 ? 'Great Job!' : 'Keep Practicing!'}
        </h2>
        <p className="text-gray-400 mb-8 text-lg">
          {perfect
            ? 'You correctly identified all three amines!'
            : `You got ${correct} out of ${total} correct.`}
        </p>

        {/* Detailed Results */}
        <div className="space-y-4 mb-8">
          {tubes.map((tube, i) => {
            const isCorrect = answers[tube.id] === tube.amine
            return (
              <motion.div
                key={tube.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 shadow-md ${
                  isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
                }`}
                initial={{ x: -40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.2 }}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {isCorrect ? (
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  ) : (
                    <XCircle className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-gray-800 text-lg">Test Tube {tube.id}</div>
                  <div className="text-sm text-gray-500">
                    Your answer: <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>{answers[tube.id]}</span>
                    {!isCorrect && (
                      <> &rarr; Correct: <span className="font-bold text-emerald-600">{tube.amine}</span></>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Explanation */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-xl border border-white/80 text-left"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-lg">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Quick Recap
          </h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p><strong className="text-emerald-700">1° Amine:</strong> Forms sulfonamide with Hinsberg reagent. The sulfonamide has an acidic H on nitrogen, so it dissolves in NaOH. This is the key distinguishing feature from 2°.</p>
            <p><strong className="text-amber-700">2° Amine:</strong> Also forms sulfonamide with Hinsberg reagent. But this sulfonamide has NO acidic H on nitrogen, so it remains insoluble even in NaOH. The precipitate persists.</p>
            <p><strong className="text-blue-700">3° Amine:</strong> Does NOT react with Hinsberg reagent at all. With NaOH, the original amine forms an oily layer because it is insoluble in aqueous base.</p>
          </div>
        </motion.div>

        <motion.button
          onClick={onReset}
          className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-300/40 hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
        >
          <RotateCcw className="inline w-5 h-5 mr-2" />
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main Experiment Screen ──────────────────────────────────────────────────

function ExperimentScreen({ tubes, setTubes, onIdentify }: {
  tubes: TestTube[]
  setTubes: React.Dispatch<React.SetStateAction<TestTube[]>>
  onIdentify: () => void
}) {
  const [selectedReagent, setSelectedReagent] = useState<Reagent>(null)
  const [dropletTarget, setDropletTarget] = useState<string | null>(null)
  const [showInstruction, setShowInstruction] = useState(true)
  const [dropletRect, setDropletRect] = useState<DOMRect | null>(null)
  const tubeRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const anyReagentAdded = tubes.some(t => t.hinsbergAdded || t.naohAdded)
  const allTubesTested = tubes.every(t => t.hinsbergAdded && t.naohAdded)

  const handleAddReagent = useCallback((tubeId: string) => {
    if (!selectedReagent) return

    const tubeEl = tubeRefs.current[tubeId]
    if (tubeEl) {
      setDropletRect(tubeEl.getBoundingClientRect())
    }
    setDropletTarget(tubeId)

    // After drop animation, update the tube state
    setTimeout(() => {
      setTubes(prev => prev.map(t => {
        if (t.id !== tubeId) return t
        const hinsbergAdded = selectedReagent === 'hinsberg' ? true : t.hinsbergAdded
        const naohAdded = selectedReagent === 'naoh' ? true : t.naohAdded
        const reaction = getReaction(t.amine, hinsbergAdded, naohAdded)
        const newLevel = !t.hinsbergAdded && !t.naohAdded ? 1 : 2 // First reagent: half, second: full
        return { ...t, hinsbergAdded, naohAdded, reaction, liquidLevel: newLevel, fizzing: true }
      }))

      // Stop fizzing after a delay
      setTimeout(() => {
        setTubes(prev => prev.map(t => t.id === tubeId ? { ...t, fizzing: false } : t))
      }, 2500)
    }, 500)

    // Clear droplet
    setTimeout(() => {
      setDropletTarget(null)
      setDropletRect(null)
    }, 600)
  }, [selectedReagent, setTubes])

  useEffect(() => {
    if (anyReagentAdded && showInstruction) {
      const t = setTimeout(() => setShowInstruction(false), 6000)
      return () => clearTimeout(t)
    }
  }, [anyReagentAdded, showInstruction])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-teal-50/50 flex flex-col">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">Hinsberg Test Lab</h1>
              <p className="text-[10px] text-gray-400">Virtual Chemistry Experiment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInstruction(true)}
              className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Info className="w-3.5 h-3.5" /> Help
            </button>
            {anyReagentAdded && (
              <motion.button
                onClick={onIdentify}
                className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-200/50"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                Identify Amines <ChevronRight className="inline w-4 h-4 ml-0.5" />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Lab Bench */}
      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 max-w-5xl mx-auto w-full">

        {/* Instruction Banner */}
        <AnimatePresence>
          {showInstruction && (
            <motion.div
              initial={{ opacity: 0, y: -15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -15, height: 0 }}
              className="mb-6 w-full max-w-md"
            >
              <div className="bg-white border border-emerald-200 rounded-2xl px-5 py-4 text-center text-sm shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-emerald-500" />
                  <span className="font-bold text-emerald-700">Instructions</span>
                </div>
                {!selectedReagent ? (
                  <p className="text-gray-600">Select a <strong>reagent bottle</strong> below, then click a <strong>test tube</strong> to add it.</p>
                ) : (
                  <p className="text-gray-600">Now click on a <strong>test tube</strong> to add <strong className={selectedReagent === 'hinsberg' ? 'text-amber-600' : 'text-blue-600'}>{selectedReagent === 'hinsberg' ? 'Hinsberg Reagent' : 'NaOH'}</strong> to it.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Reagent Shelf ─── */}
        <div className="mb-8 w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">Reagent Shelf</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex gap-6 sm:gap-10 justify-center">
            <ReagentBottle
              name="Hinsberg Reagent"
              shortName="C₆H₅SO₂Cl"
              selected={selectedReagent === 'hinsberg'}
              onClick={() => setSelectedReagent(selectedReagent === 'hinsberg' ? null : 'hinsberg')}
              color="ring-amber-400 bg-amber-50"
              accentColor="#d97706"
              liquidColor="rgba(251, 191, 36, 0.3)"
            />
            <ReagentBottle
              name="Aqueous NaOH"
              shortName="NaOH"
              selected={selectedReagent === 'naoh'}
              onClick={() => setSelectedReagent(selectedReagent === 'naoh' ? null : 'naoh')}
              color="ring-blue-400 bg-blue-50"
              accentColor="#2563eb"
              liquidColor="rgba(96, 165, 250, 0.3)"
            />
          </div>
        </div>

        {/* Droplet animation */}
        <AnimatePresence>
          {dropletTarget && dropletRect && (
            <DropletFall reagent={selectedReagent} targetRect={dropletRect} />
          )}
        </AnimatePresence>

        {/* ─── Test Tubes Area ─── */}
        <div className="mb-6 w-full">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">Unknown Amines</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex gap-4 sm:gap-10 justify-center items-start">
            {tubes.map(tube => (
              <TestTubeVisual
                key={tube.id}
                tube={tube}
                onClick={() => handleAddReagent(tube.id)}
                active={!!selectedReagent}
                tubeRef={(el) => { tubeRefs.current[tube.id] = el }}
              />
            ))}
          </div>
        </div>

        {/* ─── Observation Log ─── */}
        <motion.div
          className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100 mt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <Beaker className="w-4 h-4 text-emerald-500" />
            Observation Log
          </h3>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
            {tubes.every(t => !t.hinsbergAdded && !t.naohAdded) ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-300 italic">Add reagents to see observations here...</p>
                <p className="text-[10px] text-gray-200 mt-1">Tip: Start with Hinsberg Reagent, then add NaOH</p>
              </div>
            ) : (
              tubes.map(tube => (
                (tube.hinsbergAdded || tube.naohAdded) && (
                  <motion.div
                    key={tube.id + tube.reaction.description}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-2 items-start text-sm p-3 bg-gray-50 rounded-xl"
                  >
                    <TestTube2 className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-bold text-gray-700">Tube {tube.id}:</span>{' '}
                      <span className="text-gray-600">{tube.reaction.description}</span>
                    </div>
                  </motion.div>
                )
              ))
            )}
          </div>
        </motion.div>

        {/* Hint area */}
        {!allTubesTested && anyReagentAdded && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-xs text-gray-400 text-center"
          >
            Tip: For the complete Hinsberg test, add <strong>both</strong> reagents to each tube and observe carefully.
          </motion.p>
        )}
      </main>
    </div>
  )
}

// ─── Identify Screen ─────────────────────────────────────────────────────────

function IdentifyScreen({ tubes, onSubmit }: {
  tubes: TestTube[]
  onSubmit: (answers: Record<string, AmineDegree>) => void
}) {
  const [answers, setAnswers] = useState<Record<string, AmineDegree>>({
    A: '' as AmineDegree,
    B: '' as AmineDegree,
    C: '' as AmineDegree,
  })

  const degrees: AmineDegree[] = ['1°', '2°', '3°']

  const handleSelect = (tubeId: string, degree: AmineDegree) => {
    const newAnswers = { ...answers }
    newAnswers[tubeId] = degree
    // If this degree was already assigned elsewhere, clear that tube
    Object.keys(newAnswers).forEach(key => {
      if (key !== tubeId && newAnswers[key] === degree) {
        newAnswers[key] = '' as AmineDegree
      }
    })
    setAnswers(newAnswers)
  }

  const allSelected = Object.values(answers).every(a => a !== '')

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
            <Eye className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 leading-tight">Identify the Amines</h1>
            <p className="text-[10px] text-gray-400">Based on your observations</p>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full">
        <motion.div
          className="w-full text-center mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <p className="text-gray-600">
            Review your observations and assign each tube its correct amine degree.
          </p>
        </motion.div>

        <div className="w-full space-y-4 mb-8">
          {tubes.map((tube, i) => (
            <motion.div
              key={tube.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100"
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.12 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-gray-800 text-xl">Test Tube {tube.id}</h3>
                <AnimatePresence mode="wait">
                  {answers[tube.id] && (
                    <motion.span
                      key={answers[tube.id]}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0 }}
                      className="text-sm px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold"
                    >
                      {answers[tube.id]} Amine
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Observation recap */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 text-xs text-gray-500 flex items-start gap-2">
                <TestTube2 className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span>{tube.reaction.description || 'No reagents were added to this tube.'}</span>
              </div>

              {/* Degree selection buttons */}
              <div className="flex gap-2">
                {degrees.map(degree => {
                  const isSelected = answers[tube.id] === degree
                  const degreeColors: Record<string, string> = {
                    '1°': 'from-emerald-500 to-teal-500 shadow-emerald-200',
                    '2°': 'from-amber-500 to-orange-500 shadow-amber-200',
                    '3°': 'from-blue-500 to-indigo-500 shadow-blue-200',
                  }
                  return (
                    <motion.button
                      key={degree}
                      onClick={() => handleSelect(tube.id, degree)}
                      className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${
                        isSelected
                          ? `bg-gradient-to-r ${degreeColors[degree]} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500'
                      }`}
                      whileHover={{ scale: isSelected ? 1 : 1.04 }}
                      whileTap={{ scale: 0.94 }}
                    >
                      {degree}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.button
          onClick={() => onSubmit(answers)}
          disabled={!allSelected}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${
            allSelected
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-300/50 hover:shadow-2xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
          whileHover={allSelected ? { scale: 1.02, y: -2 } : {}}
          whileTap={allSelected ? { scale: 0.98 } : {}}
        >
          {allSelected ? 'Submit Answers' : 'Assign all tubes to continue'}
        </motion.button>
      </main>
    </motion.div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('intro')
  const [tubes, setTubes] = useState<TestTube[]>([])
  const [answers, setAnswers] = useState<Record<string, AmineDegree>>({})

  const startExperiment = useCallback(() => {
    setTubes(createTestTubes())
    setPhase('experiment')
  }, [])

  const goToIdentify = useCallback(() => {
    setPhase('identify')
  }, [])

  const submitAnswers = useCallback((ans: Record<string, AmineDegree>) => {
    setAnswers(ans)
    setPhase('results')
  }, [])

  const resetGame = useCallback(() => {
    setPhase('intro')
    setTubes([])
    setAnswers({})
  }, [])

  return (
    <AnimatePresence mode="wait">
      {phase === 'intro' && (
        <motion.div key="intro" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          <IntroScreen onStart={startExperiment} />
        </motion.div>
      )}

      {phase === 'experiment' && (
        <motion.div key="experiment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <ExperimentScreen tubes={tubes} setTubes={setTubes} onIdentify={goToIdentify} />
        </motion.div>
      )}

      {phase === 'identify' && (
        <motion.div key="identify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <IdentifyScreen tubes={tubes} onSubmit={submitAnswers} />
        </motion.div>
      )}

      {phase === 'results' && (
        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ResultsScreen tubes={tubes} answers={answers} onReset={resetGame} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
