'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Beaker, Droplets, TestTube2, CheckCircle2, XCircle, RotateCcw, BookOpen, Award, ChevronRight, Info, Zap, Eye, Volume2, VolumeX, Wind } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type AmineDegree = '1°' | '2°' | '3°'
type TestType = 'hinsberg' | 'carbylamine'
type GamePhase = 'menu' | 'intro' | 'experiment' | 'identify' | 'results'

interface ReactionState {
  precipitateFormed: boolean
  precipitateDissolved: boolean
  oilyLayer: boolean
  foulSmell: boolean
  color: string
  description: string
  liquidColor: string
}

interface TestTube {
  id: string
  label: string
  amine: AmineDegree
  reagent1Added: boolean
  reagent2Added: boolean
  reaction: ReactionState
  liquidLevel: number
  fizzing: boolean
  stinking: boolean
}

// ─── Sound Engine ────────────────────────────────────────────────────────────

class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = true

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext()
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  toggle() {
    this.enabled = !this.enabled
    return this.enabled
  }

  isEnabled() {
    return this.enabled
  }

  // Droplet falling sound
  playDrop() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.2)
    } catch { /* ignore */ }
  }

  // Liquid pouring / filling
  playPour() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const bufferSize = ctx.sampleRate * 0.5
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        data[i] = (Math.random() * 2 - 1) * 0.05 * Math.sin(t * Math.PI)
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.value = 600
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.2, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(ctx.currentTime)
    } catch { /* ignore */ }
  }

  // Bubbling / fizzing
  playFizz() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const bufferSize = ctx.sampleRate * 1.2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        const envelope = Math.sin(t * Math.PI / 1.2)
        data[i] = (Math.random() * 2 - 1) * 0.08 * envelope
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 2000
      filter.Q.value = 0.5
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.25, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.4)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2)
      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(ctx.currentTime)
    } catch { /* ignore */ }
  }

  // Precipitate formation (crystallization sound)
  playPrecipitate() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        const startT = ctx.currentTime + i * 0.08
        osc.frequency.setValueAtTime(1200 + i * 200, startT)
        osc.frequency.exponentialRampToValueAtTime(400, startT + 0.1)
        gain.gain.setValueAtTime(0.08, startT)
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.12)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startT)
        osc.stop(startT + 0.12)
      }
    } catch { /* ignore */ }
  }

  // Dissolving sound
  playDissolve() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.6)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.7)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.7)
    } catch { /* ignore */ }
  }

  // Foul smell — gross ooze + dramatic sting
  playFoulSmell() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      // Low rumble
      const osc1 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(80, ctx.currentTime)
      osc1.frequency.linearRampToValueAtTime(50, ctx.currentTime + 0.8)
      gain1.gain.setValueAtTime(0.12, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.0)
      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc1.start(ctx.currentTime)
      osc1.stop(ctx.currentTime + 1.0)

      // Dissonant sting
      setTimeout(() => {
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.type = 'square'
        osc2.frequency.setValueAtTime(220, ctx.currentTime)
        osc2.frequency.setValueAtTime(233, ctx.currentTime + 0.1)
        osc2.frequency.setValueAtTime(207, ctx.currentTime + 0.2)
        gain2.gain.setValueAtTime(0.06, ctx.currentTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.start(ctx.currentTime)
        osc2.stop(ctx.currentTime + 0.4)
      }, 200)
    } catch { /* ignore */ }
  }

  // Cough / gag sound
  playCough() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const bufferSize = ctx.sampleRate * 0.3
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        const t = i / ctx.sampleRate
        const burst = t < 0.05 ? 1 : (t < 0.15 ? 0.7 : 0.3)
        data[i] = (Math.random() * 2 - 1) * 0.2 * burst * (1 - t / 0.3)
      }
      const source = ctx.createBufferSource()
      source.buffer = buffer
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 800
      filter.Q.value = 2
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.3, ctx.currentTime)
      source.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      source.start(ctx.currentTime)
    } catch { /* ignore */ }
  }

  // Success chime
  playSuccess() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const notes = [523, 659, 784] // C5, E5, G5
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = freq
        const startT = ctx.currentTime + i * 0.15
        gain.gain.setValueAtTime(0.12, startT)
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(startT)
        osc.stop(startT + 0.4)
      })
    } catch { /* ignore */ }
  }

  // Error buzz
  playError() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'square'
      osc.frequency.value = 150
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)
    } catch { /* ignore */ }
  }

  // No reaction — soft thud
  playNoReaction() {
    if (!this.enabled) return
    try {
      const ctx = this.getCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.2)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.25)
    } catch { /* ignore */ }
  }
}

const soundEngine = new SoundEngine()

// ─── Chemistry Logic ─────────────────────────────────────────────────────────

function getHinsbergReaction(amine: AmineDegree, hinsbergAdded: boolean, naohAdded: boolean): ReactionState {
  if (!hinsbergAdded && !naohAdded) {
    return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'empty', description: '', liquidColor: 'transparent' }
  }
  if (hinsbergAdded && !naohAdded) {
    if (amine === '1°') return { precipitateFormed: true, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'white-precipitate', description: 'White precipitate formed! A sulfonamide product has been produced.', liquidColor: 'rgba(220, 230, 255, 0.6)' }
    if (amine === '2°') return { precipitateFormed: true, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'white-precipitate', description: 'White precipitate formed! A sulfonamide product has been produced.', liquidColor: 'rgba(220, 230, 255, 0.6)' }
    return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'no-reaction', description: 'No visible reaction. The amine remains unchanged.', liquidColor: 'rgba(200, 210, 240, 0.3)' }
  }
  if (!hinsbergAdded && naohAdded) {
    if (amine === '3°') return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: true, foulSmell: false, color: 'oily', description: 'Oily layer separates — amine is insoluble in aqueous base.', liquidColor: 'rgba(255, 220, 150, 0.4)' }
    return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'slight-milky', description: 'Slight cloudiness. Add Hinsberg reagent first for proper test.', liquidColor: 'rgba(200, 210, 240, 0.2)' }
  }
  // Both added
  if (amine === '1°') return { precipitateFormed: true, precipitateDissolved: true, oilyLayer: false, foulSmell: false, color: 'clear-dissolved', description: 'Precipitate dissolved! The sulfonamide has an acidic H, making it soluble in NaOH.', liquidColor: 'rgba(180, 210, 255, 0.35)' }
  if (amine === '2°') return { precipitateFormed: true, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'white-precipitate-persist', description: 'Precipitate remains! The sulfonamide has no acidic H, so it stays insoluble in NaOH.', liquidColor: 'rgba(220, 230, 255, 0.6)' }
  return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: true, foulSmell: false, color: 'oily-both', description: 'No reaction with Hinsberg. Oily layer appears with NaOH — original amine is insoluble.', liquidColor: 'rgba(255, 220, 150, 0.4)' }
}

function getCarbylamineReaction(amine: AmineDegree, chcl3Added: boolean, kohAdded: boolean): ReactionState {
  if (!chcl3Added && !kohAdded) {
    return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'empty', description: '', liquidColor: 'transparent' }
  }
  if (chcl3Added && !kohAdded) {
    return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'partial', description: 'CHCl₃ added but needs heating with alcoholic KOH for the test.', liquidColor: 'rgba(200, 220, 255, 0.25)' }
  }
  if (!chcl3Added && kohAdded) {
    return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'partial', description: 'KOH added but needs CHCl₃ for the carbylamine test.', liquidColor: 'rgba(200, 220, 255, 0.25)' }
  }
  // Both added — heat the mixture
  if (amine === '1°') {
    return {
      precipitateFormed: false,
      precipitateDissolved: false,
      oilyLayer: false,
      foulSmell: true,
      color: 'foul-smell',
      description: 'FOUL SMELL produced! An isocyanide (carbylamine) has formed — extremely offensive odor!',
      liquidColor: 'rgba(180, 255, 180, 0.4)'
    }
  }
  if (amine === '2°') {
    return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'no-reaction', description: 'No reaction. 2° amines do NOT give the carbylamine test.', liquidColor: 'rgba(200, 210, 240, 0.2)' }
  }
  return { precipitateFormed: false, precipitateDissolved: false, oilyLayer: false, foulSmell: false, color: 'no-reaction', description: 'No reaction. 3° amines do NOT give the carbylamine test.', liquidColor: 'rgba(200, 210, 240, 0.2)' }
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function createTestTubes(testType: TestType): TestTube[] {
  const amines = shuffleArray<AmineDegree>(['1°', '2°', '3°'])
  const getReaction = testType === 'hinsberg' ? getHinsbergReaction : getCarbylamineReaction
  return [
    { id: 'A', label: 'Test Tube A', amine: amines[0], reagent1Added: false, reagent2Added: false, reaction: getReaction(amines[0], false, false), liquidLevel: 0, fizzing: false, stinking: false },
    { id: 'B', label: 'Test Tube B', amine: amines[1], reagent1Added: false, reagent2Added: false, reaction: getReaction(amines[1], false, false), liquidLevel: 0, fizzing: false, stinking: false },
    { id: 'C', label: 'Test Tube C', amine: amines[2], reagent1Added: false, reagent2Added: false, reaction: getReaction(amines[2], false, false), liquidLevel: 0, fizzing: false, stinking: false },
  ]
}

// ─── Stink Lines Component ───────────────────────────────────────────────────

function StinkLines() {
  return (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-20 pointer-events-none z-30">
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute"
          style={{ left: `${15 + i * 25}%` }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: [-5, -25, -45],
            opacity: [0, 0.9, 0],
            x: [0, (i - 1) * 4, (i - 1) * 6],
          }}
          transition={{
            duration: 1.8,
            delay: i * 0.3,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        >
          <svg width="20" height="30" viewBox="0 0 20 30">
            <path d="M5 28 Q10 20 5 15 Q0 10 5 5 Q10 0 8 2" stroke="#84cc16" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M10 28 Q15 20 10 15 Q5 10 10 5 Q15 0 13 2" stroke="#a3e635" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
          </svg>
        </motion.div>
      ))}
      {/* Green gas cloud */}
      <motion.div
        className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-8 rounded-full"
        style={{ background: 'radial-gradient(ellipse, rgba(132,204,22,0.35) 0%, transparent 70%)' }}
        animate={{ scale: [0.8, 1.3, 0.9, 1.1], opacity: [0.4, 0.7, 0.3, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ─── Student Reaction Component ──────────────────────────────────────────────

function StudentReaction({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-6 right-6 z-50"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-4 border-2 border-lime-300 relative overflow-hidden"
            animate={{ rotate: [0, -2, 2, -1, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            {/* Student face SVG */}
            <svg width="64" height="64" viewBox="0 0 64 64">
              {/* Head */}
              <circle cx="32" cy="32" r="28" fill="#fde68a" stroke="#f59e0b" strokeWidth="2" />
              {/* Eyes - squinting */}
              <path d="M18 24 Q22 20 26 24" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M38 24 Q42 20 46 24" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              {/* Nose wrinkled */}
              <path d="M30 30 Q32 27 34 30" stroke="#d97706" strokeWidth="1.5" fill="none" />
              {/* Mouth - disgusted open */}
              <ellipse cx="32" cy="42" rx="8" ry="5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
              <path d="M24 39 Q32 36 40 39" stroke="#991b1b" strokeWidth="1" fill="none" />
              {/* Sweat drops */}
              <motion.circle cx="12" cy="20" r="2" fill="#60a5fa"
                animate={{ y: [0, 3, 0], opacity: [0.7, 0.3, 0.7] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
              <motion.circle cx="52" cy="22" r="1.5" fill="#60a5fa"
                animate={{ y: [0, 2, 0], opacity: [0.5, 0.2, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.2, delay: 0.3 }}
              />
              {/* Hand covering nose */}
              <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                <ellipse cx="32" cy="34" rx="14" ry="6" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
                {/* Fingers */}
                <rect x="20" y="30" width="4" height="8" rx="2" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" transform="rotate(-15 22 34)" />
                <rect x="26" y="28" width="3.5" height="9" rx="1.75" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" transform="rotate(-5 28 32)" />
                <rect x="32" y="28" width="3.5" height="9" rx="1.75" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" transform="rotate(5 34 32)" />
                <rect x="38" y="30" width="4" height="8" rx="2" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5" transform="rotate(15 40 34)" />
              </motion.g>
            </svg>
            {/* Speech bubble */}
            <motion.div
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-lime-100 text-lime-800 text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap border border-lime-300"
              animate={{ scale: [1, 1.1, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              💀 What is that smell?!
            </motion.div>
            {/* Stink cloud around student */}
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(132,204,22,0.15) 0%, transparent 60%)' }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Fizz Bubbles ────────────────────────────────────────────────────────────

function FizzBubbles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/70"
          style={{ width: 2 + Math.random() * 4, height: 2 + Math.random() * 4, left: `${15 + Math.random() * 70}%`, bottom: '10%' }}
          animate={{ y: [0, -40 - Math.random() * 40], opacity: [0.9, 0.4, 0], scale: [1, 1.3, 0.5] }}
          transition={{ duration: 0.8 + Math.random() * 0.8, delay: Math.random() * 0.6, repeat: 3, ease: 'easeOut' }}
        />
      ))}
    </div>
  )
}

// ─── Droplet Animation ───────────────────────────────────────────────────────

function DropletFall({ reagentColor, targetRect }: { reagentColor: string; targetRect: DOMRect | null }) {
  if (!targetRect) return null
  return (
    <motion.div
      className="fixed z-[100] pointer-events-none"
      style={{ left: targetRect.left + targetRect.width / 2 - 4, top: targetRect.top }}
      initial={{ y: 0, opacity: 1 }}
      animate={{ y: targetRect.height * 0.4, opacity: 0.3, scale: 0.6 }}
      transition={{ duration: 0.45, ease: [0.4, 0, 0.9, 0.6] }}
    >
      <svg width="8" height="14" viewBox="0 0 8 14">
        <path d="M4 0 C4 0 0 7 0 9.5 C0 11.7 1.8 14 4 14 C6.2 14 8 11.7 8 9.5 C8 7 4 0 4 0Z" fill={reagentColor} />
      </svg>
    </motion.div>
  )
}

// ─── Test Tube Visual ────────────────────────────────────────────────────────

function TestTubeVisual({ tube, onClick, active, tubeRef, testType }: {
  tube: TestTube
  onClick: () => void
  active: boolean
  tubeRef: React.RefObject<HTMLDivElement | null>
  testType: TestType
}) {
  const { reaction, liquidLevel } = tube
  const liquidHeightPct = liquidLevel === 0 ? 0 : liquidLevel === 1 ? 45 : 65

  return (
    <motion.div
      ref={tubeRef}
      className={`relative flex flex-col items-center cursor-pointer select-none ${active ? 'hover:scale-[1.03]' : ''}`}
      onClick={onClick}
      whileHover={active ? { y: -5 } : {}}
      whileTap={active ? { scale: 0.97 } : {}}
    >
      {/* Stink lines if foul smell */}
      {tube.stinking && <StinkLines />}

      {/* Tube Label */}
      <motion.div
        className={`text-xl font-black mb-2 px-5 py-1.5 rounded-xl transition-all duration-300 tracking-wide ${
          (tube.reagent1Added || tube.reagent2Added)
            ? tube.stinking ? 'bg-lime-100 text-lime-800 ring-2 ring-lime-400' : 'bg-emerald-100 text-emerald-800 shadow-md'
            : 'bg-gray-100 text-gray-500'
        }`}
        layout
      >
        {tube.id}
      </motion.div>

      {/* Test Tube SVG */}
      <div className="relative" style={{ width: 80, height: 200 }}>
        <svg viewBox="0 0 80 200" className="w-full h-full" style={{ overflow: 'visible' }}>
          <rect x={14} y={4} width={52} height={8} rx={4} fill="#e5e7eb" stroke="#d1d5db" strokeWidth={1.5} />
          <path d="M18 12 L18 155 Q18 185 40 185 Q62 185 62 155 L62 12" fill="rgba(255,255,255,0.08)" stroke="#d1d5db" strokeWidth={2} strokeLinecap="round" />

          {liquidLevel > 0 && (
            <motion.path
              d={`M20 ${175 - liquidHeightPct * 1.4} L20 155 Q20 183 40 183 Q60 183 60 155 L60 ${175 - liquidHeightPct * 1.4}`}
              fill={reaction.liquidColor}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          )}

          {liquidLevel > 0 && (
            <motion.ellipse cx={40} cy={175 - liquidHeightPct * 1.4} rx={20} ry={3} fill={reaction.liquidColor} stroke="rgba(255,255,255,0.3)" strokeWidth={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.3 }}
            />
          )}

          {/* Precipitate */}
          {reaction.precipitateFormed && !reaction.precipitateDissolved && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8, duration: 0.6, type: 'spring' }}>
              <ellipse cx={40} cy={173} rx={17} ry={6} fill="white" stroke="#e5e7eb" strokeWidth={0.5} />
              <ellipse cx={34} cy={171} rx={5} ry={3} fill="white" opacity={0.7} />
              <ellipse cx={47} cy={172} rx={4} ry={2.5} fill="white" opacity={0.6} />
            </motion.g>
          )}

          {/* Dissolving wisps */}
          {reaction.precipitateDissolved && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              {[0, 1, 2, 3].map(i => (
                <motion.circle key={i} cx={32 + i * 6} cy={170} r={2} fill="white" opacity={0.5}
                  animate={{ cy: [170, 150, 130], opacity: [0.6, 0.3, 0] }}
                  transition={{ duration: 2, delay: 0.8 + i * 0.3, repeat: 1, ease: 'easeOut' }}
                />
              ))}
            </motion.g>
          )}

          {/* Oily layer */}
          {reaction.oilyLayer && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              <ellipse cx={40} cy={175 - liquidHeightPct * 1.4 + 6} rx={18} ry={4} fill="#fcd34d" opacity={0.7} />
              <ellipse cx={40} cy={175 - liquidHeightPct * 1.4 + 6} rx={14} ry={2.5} fill="#fde68a" opacity={0.5} />
            </motion.g>
          )}

          {/* Green glow for foul smell */}
          {tube.stinking && (
            <motion.ellipse cx={40} cy={140} rx={25} ry={30} fill="rgba(132,204,22,0.12)"
              animate={{ opacity: [0.08, 0.2, 0.08], rx: [25, 30, 25] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}

          <rect x={24} y={20} width={2.5} height={100} rx={1.25} fill="rgba(255,255,255,0.35)" />
          <rect x={54} y={30} width={1.5} height={60} rx={0.75} fill="rgba(255,255,255,0.15)" />
        </svg>

        <FizzBubbles active={tube.fizzing} />

        {liquidLevel === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase rotate-[-90deg]">empty</span>
          </div>
        )}
      </div>

      {/* Reagent badges */}
      <div className="flex gap-1 mt-2 min-h-[22px] flex-wrap justify-center">
        <AnimatePresence>
          {tube.reagent1Added && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="text-[10px] px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold border border-amber-200">
              {testType === 'carbylamine' ? 'CHCl₃' : 'Hinsberg'}
            </motion.span>
          )}
          {tube.reagent2Added && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200">
              {testType === 'carbylamine' ? 'alc. KOH' : 'NaOH'}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Reaction description */}
      <AnimatePresence mode="wait">
        {(tube.reagent1Added || tube.reagent2Added) && reaction.description && (
          <motion.div key={reaction.description}
            initial={{ opacity: 0, y: 8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -4, height: 0 }}
            className={`mt-1 text-[11px] text-center max-w-[140px] leading-snug font-medium ${tube.stinking ? 'text-lime-700' : 'text-gray-500'}`}>
            {reaction.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Reagent Bottle ──────────────────────────────────────────────────────────

function ReagentBottle({ name, shortName, selected, onClick, color, accentColor, liquidColor }: {
  name: string; shortName: string; selected: boolean; onClick: () => void; color: string; accentColor: string; liquidColor: string
}) {
  return (
    <motion.div
      className={`relative flex flex-col items-center cursor-pointer p-3 rounded-2xl transition-all duration-300 ${selected ? `ring-[3px] ring-offset-2 shadow-xl scale-110 ${color}` : 'hover:bg-gray-50 hover:shadow-md'}`}
      onClick={onClick} whileHover={{ y: -5 }} whileTap={{ scale: 0.93 }}
    >
      <div className="relative" style={{ width: 70, height: 110 }}>
        <svg viewBox="0 0 70 110" className="w-full h-full">
          <rect x={24} y={0} width={22} height={12} rx={3} fill={selected ? '#374151' : '#9ca3af'} />
          <rect x={27} y={12} width={16} height={18} fill={selected ? '#4b5563' : '#d1d5db'} />
          <rect x={10} y={30} width={50} height={65} rx={6} fill={selected ? '#f9fafb' : '#ffffff'} stroke={selected ? accentColor : '#e5e7eb'} strokeWidth={selected ? 2.5 : 1.5} />
          <rect x={13} y={55} width={44} height={37} rx={4} fill={liquidColor} opacity={0.6} />
          <rect x={18} y={38} width={34} height={22} rx={3} fill="white" stroke="#e5e7eb" strokeWidth={0.5} />
          <text x={35} y={52} textAnchor="middle" fontSize={8} fontWeight="bold" fill={accentColor}>{shortName}</text>
          <rect x={15} y={35} width={2} height={30} rx={1} fill="rgba(255,255,255,0.5)" />
        </svg>
        {selected && (
          <motion.div className="absolute -top-2 -right-2" animate={{ y: [0, 3, 0], scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}>
            <Droplets className="w-5 h-5 text-blue-500" />
          </motion.div>
        )}
      </div>
      <div className={`mt-1 text-[11px] font-bold text-center leading-tight max-w-[100px] ${selected ? 'text-gray-800' : 'text-gray-400'}`}>{name}</div>
      {selected && (
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          className="mt-1 text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
          <Zap className="w-3 h-3" /> Ready to add
        </motion.div>
      )}
    </motion.div>
  )
}

// ─── Sound Toggle Button ─────────────────────────────────────────────────────

function SoundToggle({ className }: { className?: string }) {
  const [on, setOn] = useState(true)
  const handleClick = () => {
    const newState = soundEngine.toggle()
    setOn(newState)
  }
  return (
    <button onClick={handleClick} className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className || ''}`} title={on ? 'Mute sounds' : 'Unmute sounds'}>
      {on ? <Volume2 className="w-5 h-5 text-gray-500" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
    </button>
  )
}

// ─── Menu Screen ─────────────────────────────────────────────────────────────

function MenuScreen({ onSelect }: { onSelect: (t: TestType) => void }) {
  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-slate-50 via-emerald-50 to-cyan-50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.div className="max-w-lg text-center" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
        <motion.div className="mx-auto mb-6 w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-300/50"
          animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
          <FlaskConical className="w-12 h-12 text-white" />
        </motion.div>
        <h1 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">Amine Test Lab</h1>
        <p className="text-lg text-gray-400 mb-10">Choose Your Experiment</p>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Hinsberg */}
          <motion.div onClick={() => onSelect('hinsberg')}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/80 cursor-pointer text-left hover:shadow-2xl transition-shadow"
            whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Beaker className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Hinsberg Test</h3>
            <p className="text-sm text-gray-500 mb-3">Distinguish 1°, 2°, and 3° amines using Hinsberg Reagent and NaOH. Observe precipitate formation and dissolution.</p>
            <div className="flex items-center gap-1 text-amber-600 font-semibold text-sm">
              Start <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Carbylamine */}
          <motion.div onClick={() => onSelect('carbylamine')}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/80 cursor-pointer text-left hover:shadow-2xl transition-shadow"
            whileHover={{ y: -5, scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <div className="w-14 h-14 bg-gradient-to-br from-lime-400 to-green-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg relative">
              <Wind className="w-7 h-7 text-white" />
              <motion.div className="absolute -top-1 -right-1 text-xs" animate={{ y: [-2, -6, -2], opacity: [0.7, 0.3, 0.7] }} transition={{ repeat: Infinity, duration: 1.5 }}>💨</motion.div>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-2">Carbylamine Test</h3>
            <p className="text-sm text-gray-500 mb-3">Detect 1° amines with CHCl₃ and alcoholic KOH. Beware — the isocyanide produced has an extremely foul smell!</p>
            <div className="flex items-center gap-1 text-lime-600 font-semibold text-sm">
              Start <ChevronRight className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Intro Screen ────────────────────────────────────────────────────────────

function IntroScreen({ testType, onStart }: { testType: TestType; onStart: () => void }) {
  const isHinsberg = testType === 'hinsberg'

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.div className="max-w-lg text-center py-10" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.6 }}>
        <motion.div className={`mx-auto mb-6 w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl ${isHinsberg ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-300/50' : 'bg-gradient-to-br from-lime-400 to-green-500 shadow-lime-300/50'}`}
          animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
          {isHinsberg ? <Beaker className="w-14 h-14 text-white" /> : <Wind className="w-14 h-14 text-white" />}
        </motion.div>

        <h1 className="text-5xl font-black text-gray-800 mb-2">{isHinsberg ? 'Hinsberg Test' : 'Carbylamine Test'}</h1>
        <p className="text-xl text-emerald-600 font-semibold mb-1">Virtual Chemistry Lab</p>
        <p className="text-base text-gray-400 mb-10">{isHinsberg ? 'Identify amines through precipitation reactions' : 'Detect 1° amines — if you can handle the smell!'}</p>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-6 shadow-xl border border-white/80 text-left">
          <h2 className="text-lg font-bold text-gray-700 mb-5 flex items-center gap-2"><BookOpen className="w-5 h-5 text-emerald-500" /> How It Works</h2>
          <div className="space-y-4 text-sm text-gray-600">
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-black">1</span>
              <div><p className="font-semibold text-gray-700">Three Unknown Test Tubes</p><p className="text-gray-500">Tubes A, B, C each contain a different amine — 1°, 2°, or 3°.</p></div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-sm font-black">2</span>
              <div><p className="font-semibold text-gray-700">Add Reagents</p><p className="text-gray-500">{isHinsberg ? 'Add Hinsberg Reagent and NaOH to each tube.' : 'Add CHCl₃ and alcoholic KOH, then heat the mixture.'}</p></div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black">3</span>
              <div><p className="font-semibold text-gray-700">Observe the Reactions</p><p className="text-gray-500">{isHinsberg ? 'Precipitate formation, dissolution, oily layers.' : 'Foul smell means 1° amine. No reaction for 2° and 3°.'}</p></div>
            </div>
            <div className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-black">4</span>
              <div><p className="font-semibold text-gray-700">Identify & Submit</p><p className="text-gray-500">Assign each tube its correct amine degree.</p></div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-10 shadow-xl border border-white/80 text-left">
          <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><Eye className="w-5 h-5 text-blue-500" /> Reaction Key</h2>
          {isHinsberg ? (
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="font-black text-emerald-700 text-base w-10 shrink-0">1°</span>
                <div><p className="font-semibold text-emerald-800">+ Hinsberg → White precipitate</p><p className="text-emerald-600">+ NaOH → Precipitate <strong>dissolves</strong></p></div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="font-black text-amber-700 text-base w-10 shrink-0">2°</span>
                <div><p className="font-semibold text-amber-800">+ Hinsberg → White precipitate</p><p className="text-amber-600">+ NaOH → Precipitate <strong>remains</strong></p></div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <span className="font-black text-blue-700 text-base w-10 shrink-0">3°</span>
                <div><p className="font-semibold text-blue-800">+ Hinsberg → No reaction</p><p className="text-blue-600">+ NaOH → Oily layer separates</p></div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 p-3 bg-lime-50 rounded-xl border border-lime-100">
                <span className="font-black text-lime-700 text-base w-10 shrink-0">1°</span>
                <div><p className="font-semibold text-lime-800">+ CHCl₃ + alc. KOH + Heat →</p><p className="text-lime-700 font-bold">💀 Foul smell! (Isocyanide formed)</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-black text-gray-500 text-base w-10 shrink-0">2°</span>
                <div><p className="font-semibold text-gray-600">No reaction — no smell produced</p></div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="font-black text-gray-500 text-base w-10 shrink-0">3°</span>
                <div><p className="font-semibold text-gray-600">No reaction — no smell produced</p></div>
              </div>
            </div>
          )}
        </div>

        <motion.button onClick={onStart}
          className={`px-10 py-4 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all ${isHinsberg ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-300/40' : 'bg-gradient-to-r from-lime-500 to-green-500 shadow-lime-300/40'}`}
          whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
          Enter the Lab <ChevronRight className="inline w-5 h-5 ml-1" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Experiment Screen ───────────────────────────────────────────────────────

function ExperimentScreen({ testType, tubes, setTubes, onIdentify }: {
  testType: TestType; tubes: TestTube[]; setTubes: React.Dispatch<React.SetStateAction<TestTube[]>>; onIdentify: () => void
}) {
  const isHinsberg = testType === 'hinsberg'
  const [selectedReagent, setSelectedReagent] = useState<0 | 1 | null>(null) // 0 = reagent1, 1 = reagent2
  const [dropletTarget, setDropletTarget] = useState<string | null>(null)
  const [dropletRect, setDropletRect] = useState<DOMRect | null>(null)
  const [showInstruction, setShowInstruction] = useState(true)
  const [anyStinking, setAnyStinking] = useState(false)
  const tubeRefs = useRef<Record<string, HTMLDivElement | null>>({})

  const anyReagentAdded = tubes.some(t => t.reagent1Added || t.reagent2Added)

  const handleAddReagent = useCallback((tubeId: string) => {
    if (selectedReagent === null) return
    const tubeEl = tubeRefs.current[tubeId]
    if (tubeEl) setDropletRect(tubeEl.getBoundingClientRect())
    setDropletTarget(tubeId)

    soundEngine.playDrop()
    setTimeout(() => soundEngine.playPour(), 200)

    setTimeout(() => {
      setTubes(prev => prev.map(t => {
        if (t.id !== tubeId) return t
        const reagent1Added = selectedReagent === 0 ? true : t.reagent1Added
        const reagent2Added = selectedReagent === 1 ? true : t.reagent2Added
        const getReaction = isHinsberg ? getHinsbergReaction : getCarbylamineReaction
        const reaction = getReaction(t.amine, reagent1Added, reagent2Added)
        const newLevel = !t.reagent1Added && !t.reagent2Added ? 1 : 2
        const willFizz = reaction.precipitateFormed || reaction.foulSmell
        const willStink = reaction.foulSmell

        // Play appropriate sound
        setTimeout(() => {
          if (reaction.foulSmell) {
            soundEngine.playFoulSmell()
            setTimeout(() => soundEngine.playCough(), 400)
          } else if (reaction.precipitateFormed && !t.reaction.precipitateFormed) {
            soundEngine.playPrecipitate()
          } else if (reaction.precipitateDissolved && !t.reaction.precipitateDissolved) {
            soundEngine.playDissolve()
          } else if (reaction.color === 'no-reaction') {
            soundEngine.playNoReaction()
          } else {
            soundEngine.playFizz()
          }
        }, 100)

        if (willStink) {
          setAnyStinking(true)
          setTimeout(() => setAnyStinking(false), 5000)
        }

        return { ...t, reagent1Added, reagent2Added, reaction, liquidLevel: newLevel, fizzing: willFizz, stinking: willStink }
      }))
      setDropletTarget(null)
      setDropletRect(null)
    }, 500)

    setTimeout(() => {
      setTubes(prev => prev.map(t => t.id === tubeId ? { ...t, fizzing: false } : t))
    }, 2500)
  }, [selectedReagent, isHinsberg, setTubes])

  useEffect(() => {
    if (anyReagentAdded && showInstruction) {
      const t = setTimeout(() => setShowInstruction(false), 6000)
      return () => clearTimeout(t)
    }
  }, [anyReagentAdded, showInstruction])

  const reagent1Color = isHinsberg ? '#fbbf24' : '#a78bfa'
  const reagent2Color = isHinsberg ? '#60a5fa' : '#34d399'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-teal-50/50 flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isHinsberg ? 'bg-gradient-to-br from-amber-400 to-orange-500' : 'bg-gradient-to-br from-lime-400 to-green-500'}`}>
              {isHinsberg ? <Beaker className="w-4 h-4 text-white" /> : <Wind className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-tight">{isHinsberg ? 'Hinsberg Test' : 'Carbylamine Test'} Lab</h1>
              <p className="text-[10px] text-gray-400">Virtual Chemistry Experiment</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <button onClick={() => setShowInstruction(true)} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors">
              <Info className="w-3.5 h-3.5" /> Help
            </button>
            {anyReagentAdded && (
              <motion.button onClick={onIdentify}
                className={`px-5 py-2 text-white font-bold text-sm rounded-xl shadow-lg ${isHinsberg ? 'bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-200/50' : 'bg-gradient-to-r from-lime-500 to-green-500 shadow-lime-200/50'}`}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05, y: -1 }} whileTap={{ scale: 0.95 }}>
                Identify <ChevronRight className="inline w-4 h-4 ml-0.5" />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <AnimatePresence>
          {showInstruction && (
            <motion.div initial={{ opacity: 0, y: -15, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -15, height: 0 }} className="mb-6 w-full max-w-md">
              <div className="bg-white border border-emerald-200 rounded-2xl px-5 py-4 text-center text-sm shadow-lg">
                <div className="flex items-center justify-center gap-2 mb-2"><Zap className="w-4 h-4 text-emerald-500" /><span className="font-bold text-emerald-700">Instructions</span></div>
                {selectedReagent === null ? (
                  <p className="text-gray-600">Select a <strong>reagent bottle</strong>, then click a <strong>test tube</strong> to add it.</p>
                ) : (
                  <p className="text-gray-600">Now click a <strong>test tube</strong> to add <strong>{selectedReagent === 0 ? (isHinsberg ? 'Hinsberg Reagent' : 'CHCl₃') : (isHinsberg ? 'NaOH' : 'Alc. KOH')}</strong>.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reagent Shelf */}
        <div className="mb-8 w-full">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">Reagent Shelf</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex gap-6 sm:gap-10 justify-center">
            <ReagentBottle name={isHinsberg ? 'Hinsberg Reagent' : 'Chloroform'} shortName={isHinsberg ? 'C₆H₅SO₂Cl' : 'CHCl₃'}
              selected={selectedReagent === 0} onClick={() => setSelectedReagent(selectedReagent === 0 ? null : 0)}
              color={isHinsberg ? 'ring-amber-400 bg-amber-50' : 'ring-purple-400 bg-purple-50'}
              accentColor={isHinsberg ? '#d97706' : '#7c3aed'}
              liquidColor={isHinsberg ? 'rgba(251,191,36,0.3)' : 'rgba(167,139,250,0.3)'} />
            <ReagentBottle name={isHinsberg ? 'Aqueous NaOH' : 'Alcoholic KOH'} shortName={isHinsberg ? 'NaOH' : 'KOH'}
              selected={selectedReagent === 1} onClick={() => setSelectedReagent(selectedReagent === 1 ? null : 1)}
              color={isHinsberg ? 'ring-blue-400 bg-blue-50' : 'ring-emerald-400 bg-emerald-50'}
              accentColor={isHinsberg ? '#2563eb' : '#059669'}
              liquidColor={isHinsberg ? 'rgba(96,165,250,0.3)' : 'rgba(52,211,153,0.3)'} />
          </div>
        </div>

        <AnimatePresence>
          {dropletTarget && dropletRect && (
            <DropletFall reagentColor={selectedReagent === 0 ? reagent1Color : reagent2Color} targetRect={dropletRect} />
          )}
        </AnimatePresence>

        {/* Test Tubes */}
        <div className="mb-6 w-full">
          <div className="flex items-center gap-2 mb-5">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-[0.2em]">Unknown Amines</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <div className="flex gap-4 sm:gap-10 justify-center items-start">
            {tubes.map(tube => (
              <TestTubeVisual key={tube.id} tube={tube} onClick={() => handleAddReagent(tube.id)} active={selectedReagent !== null}
                tubeRef={(el) => { tubeRefs.current[tube.id] = el }} testType={testType} />
            ))}
          </div>
        </div>

        {/* Observation Log */}
        <motion.div className="w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100 mt-2"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2"><Beaker className="w-4 h-4 text-emerald-500" /> Observation Log</h3>
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1 custom-scrollbar">
            {tubes.every(t => !t.reagent1Added && !t.reagent2Added) ? (
              <div className="text-center py-6">
                <p className="text-sm text-gray-300 italic">Add reagents to see observations...</p>
                <p className="text-[10px] text-gray-200 mt-1">Tip: {isHinsberg ? 'Start with Hinsberg Reagent, then add NaOH' : 'Add both CHCl₃ and alc. KOH, then observe'}</p>
              </div>
            ) : (
              tubes.map(tube => (tube.reagent1Added || tube.reagent2Added) && (
                <motion.div key={tube.id + tube.reaction.description} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  className={`flex gap-2 items-start text-sm p-3 rounded-xl ${tube.stinking ? 'bg-lime-50 border border-lime-200' : 'bg-gray-50'}`}>
                  <TestTube2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tube.stinking ? 'text-lime-500' : 'text-gray-400'}`} />
                  <div><span className="font-bold text-gray-700">Tube {tube.id}:</span> <span className={tube.stinking ? 'text-lime-700 font-semibold' : 'text-gray-600'}>{tube.reaction.description}</span></div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </main>

      {/* Student reaction for foul smell */}
      <StudentReaction show={anyStinking} />
    </div>
  )
}

// ─── Identify Screen ─────────────────────────────────────────────────────────

function IdentifyScreen({ testType, tubes, onSubmit }: {
  testType: TestType; tubes: TestTube[]; onSubmit: (answers: Record<string, AmineDegree>) => void
}) {
  const isHinsberg = testType === 'hinsberg'
  const [answers, setAnswers] = useState<Record<string, AmineDegree>>({ A: '' as AmineDegree, B: '' as AmineDegree, C: '' as AmineDegree })
  const degrees: AmineDegree[] = ['1°', '2°', '3°']

  const handleSelect = (tubeId: string, degree: AmineDegree) => {
    const newAnswers = { ...answers }
    newAnswers[tubeId] = degree
    Object.keys(newAnswers).forEach(key => { if (key !== tubeId && newAnswers[key] === degree) newAnswers[key] = '' as AmineDegree })
    setAnswers(newAnswers)
  }

  const allSelected = Object.values(answers).every(a => a !== '')

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 shadow-sm">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center"><Eye className="w-4 h-4 text-white" /></div>
          <div><h1 className="text-base font-bold text-gray-800 leading-tight">Identify the Amines</h1><p className="text-[10px] text-gray-400">Based on your observations</p></div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto w-full">
        <motion.div className="w-full text-center mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <p className="text-gray-600">Assign each tube its correct amine degree.</p>
        </motion.div>
        <div className="w-full space-y-4 mb-8">
          {tubes.map((tube, i) => (
            <motion.div key={tube.id} className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-xl border border-gray-100"
              initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.12 }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-gray-800 text-xl">Test Tube {tube.id}</h3>
                <AnimatePresence mode="wait">
                  {answers[tube.id] && (
                    <motion.span key={answers[tube.id]} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="text-sm px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">{answers[tube.id]} Amine</motion.span>
                  )}
                </AnimatePresence>
              </div>
              <div className={`bg-gray-50 rounded-xl p-3 mb-4 text-xs flex items-start gap-2 ${tube.stinking ? 'bg-lime-50 border border-lime-100' : ''}`}>
                <TestTube2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${tube.stinking ? 'text-lime-500' : 'text-gray-400'}`} />
                <span className={tube.stinking ? 'text-lime-700' : 'text-gray-500'}>{tube.reaction.description || 'No reagents were added.'}</span>
              </div>
              <div className="flex gap-2">
                {degrees.map(degree => {
                  const isSelected = answers[tube.id] === degree
                  const degreeColors: Record<string, string> = { '1°': isHinsberg ? 'from-emerald-500 to-teal-500 shadow-emerald-200' : 'from-lime-500 to-green-500 shadow-lime-200', '2°': 'from-amber-500 to-orange-500 shadow-amber-200', '3°': 'from-blue-500 to-indigo-500 shadow-blue-200' }
                  return (
                    <motion.button key={degree} onClick={() => handleSelect(tube.id, degree)}
                      className={`flex-1 py-3 rounded-xl font-black text-sm transition-all ${isSelected ? `bg-gradient-to-r ${degreeColors[degree]} text-white shadow-lg` : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-500'}`}
                      whileHover={{ scale: isSelected ? 1 : 1.04 }} whileTap={{ scale: 0.94 }}>
                      {degree}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button onClick={() => onSubmit(answers)} disabled={!allSelected}
          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all ${allSelected ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-300/50 hover:shadow-2xl' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
          whileHover={allSelected ? { scale: 1.02, y: -2 } : {}} whileTap={allSelected ? { scale: 0.98 } : {}}>
          {allSelected ? 'Submit Answers' : 'Assign all tubes to continue'}
        </motion.button>
      </main>
    </motion.div>
  )
}

// ─── Results Screen ──────────────────────────────────────────────────────────

function ResultsScreen({ testType, tubes, answers, onReset }: {
  testType: TestType; tubes: TestTube[]; answers: Record<string, AmineDegree>; onReset: () => void
}) {
  const correct = tubes.filter(t => answers[t.id] === t.amine).length
  const total = tubes.length
  const perfect = correct === total

  useEffect(() => {
    if (perfect) soundEngine.playSuccess()
    else soundEngine.playError()
  }, [perfect])

  const isHinsberg = testType === 'hinsberg'

  return (
    <motion.div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-y-auto"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="max-w-md w-full text-center py-10" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <motion.div className="mb-6" initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, delay: 0.4 }}>
          {perfect ? (
            <div className="w-28 h-28 mx-auto bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-200/60 relative">
              <Award className="w-14 h-14 text-white" />
              <motion.div className="absolute inset-0 rounded-full border-4 border-yellow-300" animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} />
            </div>
          ) : (
            <div className={`w-28 h-28 mx-auto rounded-full flex items-center justify-center shadow-2xl ${correct >= 2 ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200/60' : 'bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-200/60'}`}>
              <span className="text-4xl font-black text-white">{correct}/{total}</span>
            </div>
          )}
        </motion.div>

        <h2 className="text-4xl font-black text-gray-800 mb-2">{perfect ? 'Perfect Score!' : correct >= 2 ? 'Great Job!' : 'Keep Practicing!'}</h2>
        <p className="text-gray-400 mb-8 text-lg">{perfect ? 'You correctly identified all three amines!' : `You got ${correct} out of ${total} correct.`}</p>

        <div className="space-y-4 mb-8">
          {tubes.map((tube, i) => {
            const isCorrect = answers[tube.id] === tube.amine
            return (
              <motion.div key={tube.id}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 shadow-md ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
                initial={{ x: -40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 + i * 0.2 }}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {isCorrect ? <CheckCircle2 className="w-7 h-7 text-white" /> : <XCircle className="w-7 h-7 text-white" />}
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold text-gray-800 text-lg">Test Tube {tube.id}</div>
                  <div className="text-sm text-gray-500">Your answer: <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>{answers[tube.id]}</span>
                    {!isCorrect && (<> &rarr; Correct: <span className="font-bold text-emerald-600">{tube.amine}</span></>)}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-xl border border-white/80 text-left"
          initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.3 }}>
          <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2 text-lg"><BookOpen className="w-5 h-5 text-emerald-500" /> Quick Recap</h3>
          {isHinsberg ? (
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong className="text-emerald-700">1° Amine:</strong> Forms sulfonamide with Hinsberg reagent. The sulfonamide has an acidic H on nitrogen, so it dissolves in NaOH.</p>
              <p><strong className="text-amber-700">2° Amine:</strong> Also forms sulfonamide with Hinsberg reagent. But this sulfonamide has NO acidic H on nitrogen, so it remains insoluble even in NaOH.</p>
              <p><strong className="text-blue-700">3° Amine:</strong> Does NOT react with Hinsberg reagent at all. With NaOH, the original amine forms an oily layer.</p>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-gray-600">
              <p><strong className="text-lime-700">1° Amine:</strong> Reacts with CHCl₃ and alcoholic KOH on heating to form isocyanide (carbylamine), which has an extremely offensive and intolerable foul smell. This is a diagnostic test for primary amines.</p>
              <p><strong className="text-gray-700">2° Amine:</strong> Does NOT give the carbylamine test. No isocyanide is formed and no foul smell is produced.</p>
              <p><strong className="text-gray-700">3° Amine:</strong> Does NOT give the carbylamine test either. No reaction occurs.</p>
            </div>
          )}
        </motion.div>

        <motion.button onClick={onReset}
          className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-2xl shadow-xl shadow-emerald-300/40 hover:shadow-2xl transition-all"
          whileHover={{ scale: 1.06, y: -2 }} whileTap={{ scale: 0.96 }}>
          <RotateCcw className="inline w-5 h-5 mr-2" /> Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [testType, setTestType] = useState<TestType>('hinsberg')
  const [tubes, setTubes] = useState<TestTube[]>([])
  const [answers, setAnswers] = useState<Record<string, AmineDegree>>({})

  const selectTest = useCallback((t: TestType) => {
    setTestType(t)
    setTubes(createTestTubes(t))
    setPhase('intro')
  }, [])

  const startExperiment = useCallback(() => { setPhase('experiment') }, [])
  const goToIdentify = useCallback(() => { setPhase('identify') }, [])
  const submitAnswers = useCallback((ans: Record<string, AmineDegree>) => { setAnswers(ans); setPhase('results') }, [])
  const resetGame = useCallback(() => { setPhase('menu'); setTubes([]); setAnswers({}) }, [])

  return (
    <AnimatePresence mode="wait">
      {phase === 'menu' && (
        <motion.div key="menu" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          <MenuScreen onSelect={selectTest} />
        </motion.div>
      )}
      {phase === 'intro' && (
        <motion.div key="intro" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          <IntroScreen testType={testType} onStart={startExperiment} />
        </motion.div>
      )}
      {phase === 'experiment' && (
        <motion.div key="experiment" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <ExperimentScreen testType={testType} tubes={tubes} setTubes={setTubes} onIdentify={goToIdentify} />
        </motion.div>
      )}
      {phase === 'identify' && (
        <motion.div key="identify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }}>
          <IdentifyScreen testType={testType} tubes={tubes} onSubmit={submitAnswers} />
        </motion.div>
      )}
      {phase === 'results' && (
        <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <ResultsScreen testType={testType} tubes={tubes} answers={answers} onReset={resetGame} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
