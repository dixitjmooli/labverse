'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlaskConical, Beaker, Droplets, TestTube2, CheckCircle2, XCircle, RotateCcw, BookOpen, Award, ChevronRight, Info, Zap, Eye, Volume2, VolumeX, Wind, ArrowLeft } from 'lucide-react'
import { ALL_TESTS, TEST_CATEGORIES, type TestDef, type ReactionResult, type ReactionVisual } from '@/lib/test-definitions'

// ─── Types ───────────────────────────────────────────────────────────────────

type GamePhase = 'menu' | 'intro' | 'experiment' | 'identify' | 'results'

interface TubeState {
  id: string
  unknownType: string
  r1Added: boolean
  r2Added: boolean
  reaction: ReactionResult
  liquidLevel: number
  fizzing: boolean
  stinking: boolean
}

// ─── Sound Engine ────────────────────────────────────────────────────────────

class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled = true
  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext()
    if (this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }
  toggle() { this.enabled = !this.enabled; return this.enabled }
  isEnabled() { return this.enabled }

  playDrop() {
    if (!this.enabled) return
    try { const c = this.getCtx(), o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(800, c.currentTime); o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15); g.gain.setValueAtTime(0.12, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.2) } catch { /* */ }
  }
  playPour() {
    if (!this.enabled) return
    try { const c = this.getCtx(), bs = c.sampleRate * 0.4, b = c.createBuffer(1, bs, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < bs; i++) { const t = i / c.sampleRate; d[i] = (Math.random() * 2 - 1) * 0.04 * Math.sin(t * Math.PI) } const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 600; const g = c.createGain(); g.gain.setValueAtTime(0.15, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4); s.connect(f); f.connect(g); g.connect(c.destination); s.start() } catch { /* */ }
  }
  playFizz() {
    if (!this.enabled) return
    try { const c = this.getCtx(), bs = c.sampleRate * 1, b = c.createBuffer(1, bs, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < bs; i++) { const t = i / c.sampleRate; d[i] = (Math.random() * 2 - 1) * 0.06 * Math.sin(t * Math.PI) } const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2000; const g = c.createGain(); g.gain.setValueAtTime(0.2, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1); s.connect(f); f.connect(g); g.connect(c.destination); s.start() } catch { /* */ }
  }
  playPrecipitate() {
    if (!this.enabled) return
    try { const c = this.getCtx(); for (let i = 0; i < 4; i++) { const o = c.createOscillator(), g = c.createGain(); o.type = 'triangle'; const st = c.currentTime + i * 0.08; o.frequency.setValueAtTime(1200 + i * 200, st); o.frequency.exponentialRampToValueAtTime(400, st + 0.1); g.gain.setValueAtTime(0.06, st); g.gain.exponentialRampToValueAtTime(0.001, st + 0.12); o.connect(g); g.connect(c.destination); o.start(st); o.stop(st + 0.12) } } catch { /* */ }
  }
  playDissolve() {
    if (!this.enabled) return
    try { const c = this.getCtx(), o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(300, c.currentTime); o.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.5); g.gain.setValueAtTime(0.08, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.6) } catch { /* */ }
  }
  playFoulSmell() {
    if (!this.enabled) return
    try { const c = this.getCtx(); const o1 = c.createOscillator(), g1 = c.createGain(); o1.type = 'sawtooth'; o1.frequency.setValueAtTime(80, c.currentTime); o1.frequency.linearRampToValueAtTime(50, c.currentTime + 0.8); g1.gain.setValueAtTime(0.1, c.currentTime); g1.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1); o1.connect(g1); g1.connect(c.destination); o1.start(); o1.stop(c.currentTime + 1); setTimeout(() => { const o2 = c.createOscillator(), g2 = c.createGain(); o2.type = 'square'; o2.frequency.setValueAtTime(220, c.currentTime); g2.gain.setValueAtTime(0.05, c.currentTime); g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3); o2.connect(g2); g2.connect(c.destination); o2.start(); o2.stop(c.currentTime + 0.3) }, 200) } catch { /* */ }
  }
  playFruitySmell() {
    if (!this.enabled) return
    try { const c = this.getCtx(); [523, 659, 784, 1047].forEach((fr, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = fr; const st = c.currentTime + i * 0.1; g.gain.setValueAtTime(0.08, st); g.gain.exponentialRampToValueAtTime(0.001, st + 0.3); o.connect(g); g.connect(c.destination); o.start(st); o.stop(st + 0.3) }) } catch { /* */ }
  }
  playEffervescence() {
    if (!this.enabled) return
    try { const c = this.getCtx(), bs = c.sampleRate * 0.8, b = c.createBuffer(1, bs, c.sampleRate), d = b.getChannelData(0); for (let i = 0; i < bs; i++) { const t = i / c.sampleRate; d[i] = (Math.random() * 2 - 1) * 0.08 * (1 - t / 0.8) } const s = c.createBufferSource(); s.buffer = b; const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 3000; const g = c.createGain(); g.gain.setValueAtTime(0.2, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8); s.connect(f); f.connect(g); g.connect(c.destination); s.start() } catch { /* */ }
  }
  playPop() {
    if (!this.enabled) return
    try { const c = this.getCtx(), o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(600, c.currentTime); o.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.1); g.gain.setValueAtTime(0.15, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.15) } catch { /* */ }
  }
  playNoReaction() {
    if (!this.enabled) return
    try { const c = this.getCtx(), o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(150, c.currentTime); o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.2); g.gain.setValueAtTime(0.08, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.25) } catch { /* */ }
  }
  playSuccess() {
    if (!this.enabled) return
    try { const c = this.getCtx(); [523, 659, 784].forEach((fr, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = fr; const st = c.currentTime + i * 0.15; g.gain.setValueAtTime(0.1, st); g.gain.exponentialRampToValueAtTime(0.001, st + 0.4); o.connect(g); g.connect(c.destination); o.start(st); o.stop(st + 0.4) }) } catch { /* */ }
  }
  playError() {
    if (!this.enabled) return
    try { const c = this.getCtx(), o = c.createOscillator(), g = c.createGain(); o.type = 'square'; o.frequency.value = 150; g.gain.setValueAtTime(0.07, c.currentTime); g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3); o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + 0.3) } catch { /* */ }
  }
}

const sfx = new SoundEngine()

function playReactionSound(visual: ReactionVisual, smellType?: string) {
  if (visual === 'foul-smell') { sfx.playFoulSmell(); return }
  if (smellType === 'foul') { sfx.playFoulSmell(); return }
  if (smellType === 'fruity') { sfx.playFruitySmell(); return }
  if (smellType === 'antiseptic') { sfx.playPop(); return }
  if (visual === 'effervescence') { sfx.playEffervescence(); return }
  if (visual === 'precipitate') { sfx.playPrecipitate(); return }
  if (visual === 'dissolve') { sfx.playDissolve(); return }
  if (visual === 'silver-mirror') { sfx.playPrecipitate(); return }
  if (visual === 'no-reaction') { sfx.playNoReaction(); return }
  sfx.playFizz()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shuffleArr<T>(arr: T[]): T[] {
  const s = [...arr]; for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]] } return s
}

function createTubes(test: TestDef): TubeState[] {
  const types = shuffleArr(test.unknownTypes)
  return types.map((t, i) => ({
    id: String.fromCharCode(65 + i),
    unknownType: t,
    r1Added: false,
    r2Added: false,
    reaction: test.getReaction(t, false, false),
    liquidLevel: 0,
    fizzing: false,
    stinking: false,
  }))
}

// ─── Visual Effect Components ────────────────────────────────────────────────

function StinkLines({ color = '#84cc16' }: { color?: string }) {
  return (
    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-20 pointer-events-none z-30">
      {[0, 1, 2].map(i => (
        <motion.div key={i} className="absolute" style={{ left: `${15 + i * 25}%` }}
          animate={{ y: [-5, -25, -45], opacity: [0, 0.9, 0], x: [0, (i - 1) * 4, (i - 1) * 6] }}
          transition={{ duration: 1.8, delay: i * 0.3, repeat: Infinity, ease: 'easeOut' }}>
          <svg width="20" height="30" viewBox="0 0 20 30">
            <path d="M5 28 Q10 20 5 15 Q0 10 5 5 Q10 0 8 2" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
            <path d="M10 28 Q15 20 10 15 Q5 10 10 5 Q15 0 13 2" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
          </svg>
        </motion.div>
      ))}
      <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2 w-14 h-8 rounded-full"
        style={{ background: `radial-gradient(ellipse, ${color}55 0%, transparent 70%)` }}
        animate={{ scale: [0.8, 1.3, 0.9, 1.1], opacity: [0.4, 0.7, 0.3, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
    </div>
  )
}

function FizzBubbles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full bg-white/70"
          style={{ width: 2 + Math.random() * 3, height: 2 + Math.random() * 3, left: `${15 + Math.random() * 70}%`, bottom: '10%' }}
          animate={{ y: [0, -30 - Math.random() * 30], opacity: [0.8, 0.3, 0], scale: [1, 1.2, 0.5] }}
          transition={{ duration: 0.7 + Math.random() * 0.5, delay: Math.random() * 0.5, repeat: 3, ease: 'easeOut' }} />
      ))}
    </div>
  )
}

function GasBubbles({ active }: { active: boolean }) {
  if (!active) return null
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-full border border-white/50 bg-white/10"
          style={{ width: 4 + Math.random() * 6, height: 4 + Math.random() * 6, left: `${20 + Math.random() * 60}%`, bottom: '15%' }}
          animate={{ y: [0, -50 - Math.random() * 40], opacity: [0.7, 0] }}
          transition={{ duration: 1.2 + Math.random() * 0.6, delay: Math.random() * 0.8, repeat: 4, ease: 'easeOut' }} />
      ))}
    </div>
  )
}

function StudentReaction({ show, type }: { show: boolean; type: 'foul' | 'fruity' | 'antiseptic' | null }) {
  const isFoul = type === 'foul'
  const msg = isFoul ? '💀 What is that smell?!' : type === 'antiseptic' ? '😷 That antiseptic smell!' : '😊 Sweet fruity smell!'
  const faceColor = isFoul ? '#fde68a' : type === 'antiseptic' ? '#e0e7ff' : '#fce7f3'
  const borderColor = isFoul ? 'border-lime-300' : type === 'antiseptic' ? 'border-indigo-300' : 'border-pink-300'
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="fixed bottom-6 right-6 z-50" initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ type: 'spring', stiffness: 200 }}>
          <motion.div className={`bg-white rounded-2xl shadow-2xl p-3 border-2 ${borderColor} relative overflow-hidden`}
            animate={isFoul ? { rotate: [0, -2, 2, -1, 1, 0] } : {}} transition={{ repeat: Infinity, duration: 1.5 }}>
            <div className="flex flex-col items-center">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill={faceColor} stroke="#d1d5db" strokeWidth="1.5" />
                {isFoul ? (
                  <>
                    <path d="M16 20 Q20 17 24 20" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <path d="M32 20 Q36 17 40 20" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                    <ellipse cx="28" cy="38" rx="7" ry="4" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                    <motion.g animate={{ y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                      <ellipse cx="28" cy="30" rx="12" ry="5" fill={faceColor} stroke="#d1d5db" strokeWidth="0.8" />
                    </motion.g>
                  </>
                ) : (
                  <>
                    <circle cx="20" cy="22" r="2" fill="#1f2937" />
                    <circle cx="36" cy="22" r="2" fill="#1f2937" />
                    <path d="M20 34 Q28 42 36 34" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                  </>
                )}
              </svg>
              <motion.div className={`text-[10px] font-bold px-2 py-0.5 rounded-lg mt-1 ${isFoul ? 'bg-lime-100 text-lime-800' : 'bg-pink-100 text-pink-800'}`}
                animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>
                {msg}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Test Tube Visual ────────────────────────────────────────────────────────

function TubeVisual({ tube, test, onClick, active, tubeRef }: {
  tube: TubeState; test: TestDef; onClick: () => void; active: boolean; tubeRef: React.RefObject<HTMLDivElement | null>
}) {
  const { reaction, liquidLevel } = tube
  const lPct = liquidLevel === 0 ? 0 : liquidLevel === 1 ? 45 : 65
  const isSmell = reaction.visual === 'foul-smell' || reaction.visual === 'fruity-smell' || reaction.visual === 'antiseptic-smell'
  const stinkColor = reaction.smellType === 'foul' ? '#84cc16' : reaction.smellType === 'antiseptic' ? '#818cf8' : '#f472b6'

  return (
    <motion.div ref={tubeRef} className={`relative flex flex-col items-center cursor-pointer select-none ${active ? 'hover:scale-[1.03]' : ''}`}
      onClick={onClick} whileHover={active ? { y: -5 } : {}} whileTap={active ? { scale: 0.97 } : {}}>
      {(isSmell || tube.stinking) && <StinkLines color={stinkColor} />}
      <motion.div className={`text-lg font-black mb-2 px-4 py-1.5 rounded-xl transition-all duration-300 ${
        (tube.r1Added || tube.r2Added) ? (isSmell ? 'bg-lime-100 text-lime-800 ring-2 ring-lime-400' : reaction.visual !== 'no-reaction' ? 'bg-emerald-100 text-emerald-800 shadow-md' : 'bg-gray-100 text-gray-500') : 'bg-gray-100 text-gray-500'
      }`} layout>{tube.id}</motion.div>

      <div className="relative" style={{ width: 80, height: 190 }}>
        <svg viewBox="0 0 80 190" className="w-full h-full" style={{ overflow: 'visible' }}>
          <rect x={14} y={4} width={52} height={8} rx={4} fill="#e5e7eb" stroke="#d1d5db" strokeWidth={1.5} />
          <path d="M18 12 L18 148 Q18 178 40 178 Q62 178 62 148 L62 12" fill="rgba(255,255,255,0.08)" stroke="#d1d5db" strokeWidth={2} strokeLinecap="round" />
          {liquidLevel > 0 && (
            <motion.path d={`M20 ${168 - lPct * 1.3} L20 148 Q20 176 40 176 Q60 176 60 148 L60 ${168 - lPct * 1.3}`}
              fill={reaction.liquidColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
          )}
          {liquidLevel > 0 && <motion.ellipse cx={40} cy={168 - lPct * 1.3} rx={20} ry={3} fill={reaction.liquidColor} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />}
          {/* Precipitate */}
          {(reaction.visual === 'precipitate' || reaction.visual === 'decolorize') && reaction.precipitateColor && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7, duration: 0.5, type: 'spring' }}>
              <ellipse cx={40} cy={166} rx={16} ry={5} fill={reaction.precipitateColor} opacity={0.9} />
            </motion.g>
          )}
          {/* Silver mirror coating */}
          {reaction.visual === 'silver-mirror' && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 1 }}>
              <rect x={19} y={40} width={5} height={90} rx={2} fill="rgba(192,192,192,0.4)" />
              <rect x={56} y={40} width={5} height={90} rx={2} fill="rgba(192,192,192,0.3)" />
              <rect x={22} y={50} width={36} height={3} rx={1} fill="rgba(192,192,192,0.2)" />
              <ellipse cx={40} cy={145} rx={18} ry={8} fill="rgba(192,192,192,0.25)" />
            </motion.g>
          )}
          {/* Turbidity */}
          {reaction.visual === 'turbidity' && (
            <motion.rect x={20} y={50} width={40} height={110} rx={10}
              fill="rgba(255,255,255,0.5)" initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.7, 0.5] }}
              transition={{ duration: reaction.turbiditySpeed === 'immediate' ? 0.5 : 2, ease: 'easeOut' }} />
          )}
          {/* Oily layer */}
          {reaction.visual === 'oily-layer' && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <ellipse cx={40} cy={168 - lPct * 1.3 + 6} rx={17} ry={3.5} fill="#fcd34d" opacity={0.7} />
            </motion.g>
          )}
          {/* Dye color glow */}
          {reaction.visual === 'dye' && (
            <motion.rect x={20} y={50} width={40} height={110} rx={10}
              fill={reaction.liquidColor} initial={{ opacity: 0 }} animate={{ opacity: [0.3, 0.6, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }} />
          )}
          {/* Smell glow */}
          {(isSmell) && (
            <motion.ellipse cx={40} cy={130} rx={25} ry={28} fill={reaction.liquidColor}
              animate={{ opacity: [0.08, 0.2, 0.08], rx: [25, 30, 25] }} transition={{ repeat: Infinity, duration: 2 }} />
          )}
          <rect x={24} y={20} width={2.5} height={90} rx={1.25} fill="rgba(255,255,255,0.35)" />
        </svg>
        <FizzBubbles active={tube.fizzing} />
        {(reaction.visual === 'effervescence') && <GasBubbles active />}
        {liquidLevel === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-gray-300 text-[10px] font-bold tracking-widest uppercase rotate-[-90deg]">empty</span>
          </div>
        )}
      </div>

      <div className="flex gap-1 mt-1.5 min-h-[20px] flex-wrap justify-center">
        <AnimatePresence>
          {tube.r1Added && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[9px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full font-semibold border border-amber-200">{test.reagents[0].shortName}</motion.span>}
          {tube.r2Added && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-[9px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-semibold border border-blue-200">{test.reagents[1].shortName}</motion.span>}
        </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {(tube.r1Added || tube.r2Added) && reaction.description && (
          <motion.div key={reaction.description} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            className={`mt-0.5 text-[10px] text-center max-w-[130px] leading-snug font-medium ${isSmell ? (reaction.smellType === 'foul' ? 'text-lime-700' : 'text-pink-700') : 'text-gray-500'}`}>
            {reaction.description}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ─── Reagent Bottle ──────────────────────────────────────────────────────────

function Bottle({ reagent, selected, onClick }: { reagent: TestDef['reagents'][0]; selected: boolean; onClick: () => void }) {
  return (
    <motion.div className={`relative flex flex-col items-center cursor-pointer p-2.5 rounded-2xl transition-all ${selected ? `ring-[3px] ring-offset-2 shadow-xl scale-110 ${reagent.bgColor} ${reagent.ringColor}` : 'hover:bg-gray-50 hover:shadow-md'}`}
      onClick={onClick} whileHover={{ y: -5 }} whileTap={{ scale: 0.93 }}>
      <div className="relative" style={{ width: 64, height: 100 }}>
        <svg viewBox="0 0 70 110" className="w-full h-full">
          <rect x={24} y={0} width={22} height={12} rx={3} fill={selected ? '#374151' : '#9ca3af'} />
          <rect x={27} y={12} width={16} height={18} fill={selected ? '#4b5563' : '#d1d5db'} />
          <rect x={10} y={30} width={50} height={65} rx={6} fill={selected ? '#f9fafb' : '#fff'} stroke={selected ? reagent.accentColor : '#e5e7eb'} strokeWidth={selected ? 2.5 : 1.5} />
          <rect x={13} y={55} width={44} height={37} rx={4} fill={reagent.liquidColor} opacity={0.6} />
          <rect x={18} y={38} width={34} height={22} rx={3} fill="white" stroke="#e5e7eb" strokeWidth={0.5} />
          <text x={35} y={52} textAnchor="middle" fontSize={7} fontWeight="bold" fill={reagent.accentColor}>{reagent.shortName}</text>
        </svg>
        {selected && <motion.div className="absolute -top-1 -right-1" animate={{ y: [0, 3, 0], scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}><Droplets className="w-4 h-4 text-blue-500" /></motion.div>}
      </div>
      <div className={`mt-0.5 text-[10px] font-bold text-center leading-tight max-w-[90px] ${selected ? 'text-gray-800' : 'text-gray-400'}`}>{reagent.name}</div>
      {selected && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] text-emerald-600 font-semibold"><Zap className="inline w-3 h-3" /> Ready</motion.div>}
    </motion.div>
  )
}

function SoundToggle() {
  const [on, setOn] = useState(true)
  return <button onClick={() => { setOn(sfx.toggle()) }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title={on ? 'Mute' : 'Unmute'}>
    {on ? <Volume2 className="w-5 h-5 text-gray-500" /> : <VolumeX className="w-5 h-5 text-gray-400" />}
  </button>
}

// ─── Menu Screen ─────────────────────────────────────────────────────────────

function MenuScreen({ onSelect }: { onSelect: (t: TestDef) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-cyan-50/50 p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div className="text-center mb-10" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.div className="mx-auto mb-4 w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl" animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
            <FlaskConical className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-gray-800 tracking-tight">Amine Test Lab</h1>
          <p className="text-lg text-gray-400 mt-1">Class 12 CBSE Organic Chemistry — Interactive Simulations</p>
          <p className="text-sm text-gray-300 mt-1">{ALL_TESTS.length} tests across {TEST_CATEGORIES.length} categories</p>
        </motion.div>

        {TEST_CATEGORIES.map(cat => {
          const tests = ALL_TESTS.filter(t => t.category === cat.name)
          if (!tests.length) return null
          return (
            <motion.div key={cat.name} className="mb-8" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{cat.emoji}</span>
                <h2 className="text-lg font-bold text-gray-700">{cat.name}</h2>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tests.map(test => (
                  <motion.div key={test.id} onClick={() => onSelect(test)}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-md border border-white/80 cursor-pointer text-left hover:shadow-xl transition-shadow"
                    whileHover={{ y: -3, scale: 1.01 }} whileTap={{ scale: 0.97 }}>
                    <div className={`w-10 h-10 bg-gradient-to-br ${test.gradient} rounded-xl flex items-center justify-center mb-3 shadow-md text-lg`}>
                      {test.emoji}
                    </div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">{test.name}</h3>
                    <p className="text-[11px] text-gray-400 leading-snug line-clamp-2">{test.desc}</p>
                    <div className="mt-2 flex items-center gap-1 text-emerald-600 font-semibold text-[11px]">
                      Start <ChevronRight className="w-3 h-3" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Intro Screen ────────────────────────────────────────────────────────────

function IntroScreen({ test, onStart, onBack }: { test: TestDef; onStart: () => void; onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 overflow-y-auto p-4">
      <div className="max-w-lg mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm mb-6"><ArrowLeft className="w-4 h-4" /> Back to Tests</button>

        <motion.div className="text-center" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <motion.div className={`mx-auto mb-4 w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl bg-gradient-to-br ${test.gradient}`}
            animate={{ rotate: [0, 3, -3, 0] }} transition={{ repeat: Infinity, duration: 5 }}>
            <span className="text-3xl">{test.emoji}</span>
          </motion.div>
          <h1 className="text-3xl font-black text-gray-800 mb-1">{test.name}</h1>
          <p className="text-sm text-gray-400 mb-8">{test.desc}</p>

          <div className="bg-white/90 rounded-2xl p-5 mb-5 shadow-lg text-left">
            <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-emerald-500" /> How It Works</h2>
            <div className="space-y-3">
              {test.introSteps.map((s, i) => (
                <div key={i} className="flex gap-3 items-start text-sm">
                  <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">{i + 1}</span>
                  <div><p className="font-semibold text-gray-700">{s.title}</p><p className="text-gray-500 text-xs">{s.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl p-5 mb-8 shadow-lg text-left">
            <h2 className="font-bold text-gray-700 mb-3 flex items-center gap-2"><Eye className="w-4 h-4 text-blue-500" /> Reaction Key</h2>
            <div className="space-y-2">
              {test.reactionKey.map((k, i) => (
                <div key={i} className={`p-2.5 rounded-xl ${k.color}`}>
                  <span className={`font-black text-sm ${k.textColor}`}>{k.type}:</span>
                  {k.results.map((r, j) => <p key={j} className={`text-xs ${k.textColor} ml-4`}>{r}</p>)}
                </div>
              ))}
            </div>
          </div>

          <motion.button onClick={onStart}
            className={`px-8 py-3.5 bg-gradient-to-r ${test.gradient} text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
            whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
            Enter the Lab <ChevronRight className="inline w-5 h-5 ml-1" />
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Experiment Screen ───────────────────────────────────────────────────────

function ExperimentScreen({ test, tubes, setTubes, onIdentify, onBack }: {
  test: TestDef; tubes: TubeState[]; setTubes: React.Dispatch<React.SetStateAction<TubeState[]>>; onIdentify: () => void; onBack: () => void
}) {
  const [sel, setSel] = useState<0 | 1 | null>(null)
  const [showHelp, setShowHelp] = useState(true)
  const [smellReaction, setSmellReaction] = useState<'foul' | 'fruity' | 'antiseptic' | null>(null)
  const tubeRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const anyAdded = tubes.some(t => t.r1Added || t.r2Added)

  const handleAdd = useCallback((tubeId: string) => {
    if (sel === null) return
    sfx.playDrop()
    setTimeout(() => sfx.playPour(), 150)
    setTimeout(() => {
      setTubes(prev => prev.map(t => {
        if (t.id !== tubeId) return t
        const r1 = sel === 0 ? true : t.r1Added
        const r2 = sel === 1 ? true : t.r2Added
        const reaction = test.getReaction(t.unknownType, r1, r2)
        const newLevel = !t.r1Added && !t.r2Added ? 1 : 2
        const willFizz = ['precipitate', 'color-change', 'effervescence', 'foul-smell', 'fruity-smell', 'antiseptic-smell', 'silver-mirror', 'decolorize', 'dye'].includes(reaction.visual)
        const isSmell = reaction.visual === 'foul-smell' || reaction.visual === 'fruity-smell' || reaction.visual === 'antiseptic-smell' || reaction.smellType
        setTimeout(() => playReactionSound(reaction.visual, reaction.smellType), 100)
        if (isSmell) {
          const smell = reaction.smellType || (reaction.visual === 'foul-smell' ? 'foul' : reaction.visual === 'fruity-smell' ? 'fruity' : 'antiseptic') as 'foul' | 'fruity' | 'antiseptic'
          setSmellReaction(smell)
          setTimeout(() => setSmellReaction(null), 4000)
        }
        return { ...t, r1Added: r1, r2Added: r2, reaction, liquidLevel: newLevel, fizzing: willFizz, stinking: isSmell }
      }))
    }, 400)
    setTimeout(() => { setTubes(prev => prev.map(t => ({ ...t, fizzing: false }))) }, 2500)
  }, [sel, test, setTubes])

  useEffect(() => {
    if (anyAdded && showHelp) { const t = setTimeout(() => setShowHelp(false), 5000); return () => clearTimeout(t) }
  }, [anyAdded, showHelp])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50/30 to-teal-50/50 flex flex-col">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-3 py-2.5 sticky top-0 z-40 shadow-sm">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-gray-100"><ArrowLeft className="w-4 h-4 text-gray-400" /></button>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center bg-gradient-to-br ${test.gradient}`}><span className="text-sm">{test.emoji}</span></div>
            <div><h1 className="text-sm font-bold text-gray-800 leading-tight">{test.name}</h1><p className="text-[9px] text-gray-400">{test.category}</p></div>
          </div>
          <div className="flex items-center gap-2">
            <SoundToggle />
            {anyAdded && (
              <motion.button onClick={onIdentify}
                className={`px-4 py-1.5 bg-gradient-to-r ${test.gradient} text-white font-bold text-xs rounded-xl shadow-lg`}
                initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                Identify <ChevronRight className="inline w-3 h-3" />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-4 max-w-5xl mx-auto w-full">
        <AnimatePresence>
          {showHelp && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4 w-full max-w-sm">
              <div className="bg-white border border-emerald-200 rounded-xl px-4 py-3 text-center text-xs shadow-md">
                {sel === null ? '👆 Select a reagent bottle, then click a test tube' : `🧪 Click a tube to add ${sel === 0 ? test.reagents[0].name : test.reagents[1].name}`}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 w-full">
          <div className="flex items-center gap-2 mb-3"><div className="h-px flex-1 bg-gray-200" /><span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Reagents</span><div className="h-px flex-1 bg-gray-200" /></div>
          <div className="flex gap-6 sm:gap-10 justify-center">
            {test.reagents.map((r, i) => <Bottle key={r.id} reagent={r} selected={sel === i} onClick={() => setSel(sel === i ? null : i as 0 | 1)} />)}
          </div>
        </div>

        <div className="mb-6 w-full">
          <div className="flex items-center gap-2 mb-3"><div className="h-px flex-1 bg-gray-200" /><span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Unknown Samples</span><div className="h-px flex-1 bg-gray-200" /></div>
          <div className="flex gap-4 sm:gap-8 justify-center items-start">
            {tubes.map(tube => <TubeVisual key={tube.id} tube={tube} test={test} onClick={() => handleAdd(tube.id)} active={sel !== null} tubeRef={(el) => { tubeRefs.current[tube.id] = el }} />)}
          </div>
        </div>

        <div className="w-full max-w-lg bg-white/90 rounded-2xl p-4 shadow-xl border border-gray-100">
          <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-2"><Beaker className="w-3.5 h-3.5 text-emerald-500" /> Observations</h3>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 custom-scrollbar">
            {tubes.every(t => !t.r1Added && !t.r2Added) ? (
              <p className="text-xs text-gray-300 italic text-center py-4">Add reagents to see observations...</p>
            ) : tubes.map(tube => (tube.r1Added || tube.r2Added) && tube.reaction.description && (
              <motion.div key={tube.id + tube.reaction.description} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                className={`flex gap-2 text-xs p-2 rounded-lg ${tube.stinking ? 'bg-lime-50' : 'bg-gray-50'}`}>
                <TestTube2 className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${tube.stinking ? 'text-lime-500' : 'text-gray-400'}`} />
                <span><b>Tube {tube.id}:</b> {tube.reaction.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <StudentReaction show={!!smellReaction} type={smellReaction} />
    </div>
  )
}

// ─── Identify Screen ─────────────────────────────────────────────────────────

function IdentifyScreen({ test, tubes, onSubmit }: { test: TestDef; tubes: TubeState[]; onSubmit: (a: Record<string, string>) => void }) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const handleSelect = (tubeId: string, type: string) => {
    const a = { ...answers, [tubeId]: type }
    Object.keys(a).forEach(k => { if (k !== tubeId && a[k] === type) delete a[k] })
    setAnswers(a)
  }
  const allSelected = tubes.every(t => answers[t.id])
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col p-4">
      <div className="max-w-lg mx-auto w-full flex flex-col items-center justify-center flex-1">
        <motion.div className="w-full text-center mb-6" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <h2 className="text-2xl font-black text-gray-800">Identify the Unknowns</h2>
          <p className="text-sm text-gray-400">Assign each tube its correct type based on observations.</p>
        </motion.div>
        <div className="w-full space-y-4 mb-8">
          {tubes.map((tube, i) => (
            <motion.div key={tube.id} className="bg-white/90 rounded-2xl p-4 shadow-lg border border-gray-100" initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-black text-gray-800 text-lg">Tube {tube.id}</h3>
                {answers[tube.id] && <span className="text-xs px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-full font-bold">{answers[tube.id]}</span>}
              </div>
              <div className="bg-gray-50 rounded-lg p-2 mb-3 text-[11px] text-gray-500 flex items-start gap-1.5">
                <TestTube2 className="w-3 h-3 mt-0.5 flex-shrink-0 text-gray-400" />
                {tube.reaction.description || 'No reagents added.'}
              </div>
              <div className="flex gap-2">
                {test.unknownTypes.map(type => {
                  const isSel = answers[tube.id] === type
                  return (
                    <motion.button key={type} onClick={() => handleSelect(tube.id, type)}
                      className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${isSel ? `bg-gradient-to-r ${test.gradient} text-white shadow-lg` : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                      whileHover={{ scale: isSel ? 1 : 1.03 }} whileTap={{ scale: 0.95 }}>
                      {type}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
        <motion.button onClick={() => onSubmit(answers)} disabled={!allSelected}
          className={`w-full py-3.5 rounded-2xl font-bold text-lg shadow-xl transition-all ${allSelected ? `bg-gradient-to-r ${test.gradient} text-white shadow-emerald-300/40 hover:shadow-2xl` : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
          whileHover={allSelected ? { scale: 1.02, y: -2 } : {}} whileTap={allSelected ? { scale: 0.98 } : {}}>
          {allSelected ? 'Submit Answers' : 'Assign all tubes to continue'}
        </motion.button>
      </div>
    </div>
  )
}

// ─── Results Screen ──────────────────────────────────────────────────────────

function ResultsScreen({ test, tubes, answers, onReset }: { test: TestDef; tubes: TubeState[]; answers: Record<string, string>; onReset: () => void }) {
  const correct = tubes.filter(t => answers[t.id] === t.unknownType).length
  const total = tubes.length
  const perfect = correct === total

  useEffect(() => { if (perfect) sfx.playSuccess(); else sfx.playError() }, [perfect])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-md w-full text-center py-8">
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 200, delay: 0.3 }}>
          {perfect ? (
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-200/60 relative">
              <Award className="w-12 h-12 text-white" />
            </div>
          ) : (
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center shadow-2xl ${correct >= 2 ? 'bg-gradient-to-br from-emerald-400 to-teal-500' : 'bg-gradient-to-br from-orange-400 to-red-500'}`}>
              <span className="text-3xl font-black text-white">{correct}/{total}</span>
            </div>
          )}
        </motion.div>

        <h2 className="text-3xl font-black text-gray-800 mt-4 mb-2">{perfect ? 'Perfect Score!' : correct >= 2 ? 'Great Job!' : 'Keep Practicing!'}</h2>
        <p className="text-gray-400 mb-6">{perfect ? 'All correct!' : `${correct} out of ${total} correct.`}</p>

        <div className="space-y-3 mb-6">
          {tubes.map((tube, i) => {
            const isCorrect = answers[tube.id] === tube.unknownType
            return (
              <motion.div key={tube.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 shadow-sm ${isCorrect ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}
                initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 + i * 0.15 }}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isCorrect ? 'bg-emerald-500' : 'bg-red-500'}`}>
                  {isCorrect ? <CheckCircle2 className="w-6 h-6 text-white" /> : <XCircle className="w-6 h-6 text-white" />}
                </div>
                <div className="text-left">
                  <div className="font-bold text-gray-800">Tube {tube.id}</div>
                  <div className="text-xs text-gray-500">Your answer: <span className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>{answers[tube.id]}</span>
                    {!isCorrect && <> &rarr; <span className="font-bold text-emerald-600">{tube.unknownType}</span></>}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="bg-white/90 rounded-2xl p-4 mb-6 shadow-lg text-left">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2 text-sm"><BookOpen className="w-4 h-4 text-emerald-500" /> Quick Recap</h3>
          <div className="space-y-2 text-xs text-gray-600">
            {test.recap.map((r, i) => <p key={i}>{r}</p>)}
          </div>
        </div>

        <motion.button onClick={onReset}
          className={`px-8 py-3.5 bg-gradient-to-r ${test.gradient} text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all`}
          whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}>
          <RotateCcw className="inline w-5 h-5 mr-2" /> Try Again
        </motion.button>
      </div>
    </div>
  )
}

// ─── Main App ────────────────────────────────────────────────────────────────

export default function Home() {
  const [phase, setPhase] = useState<GamePhase>('menu')
  const [test, setTest] = useState<TestDef | null>(null)
  const [tubes, setTubes] = useState<TubeState[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const selectTest = useCallback((t: TestDef) => { setTest(t); setPhase('intro') }, [])
  const start = useCallback(() => { if (test) { setTubes(createTubes(test)); setPhase('experiment') } }, [test])
  const identify = useCallback(() => setPhase('identify'), [])
  const submit = useCallback((a: Record<string, string>) => { setAnswers(a); setPhase('results') }, [])
  const reset = useCallback(() => { setPhase('menu'); setTubes([]); setAnswers({}) }, [])
  const back = useCallback(() => { if (phase === 'experiment') setPhase('intro'); else if (phase === 'intro') setPhase('menu') }, [phase])

  return (
    <AnimatePresence mode="wait">
      {phase === 'menu' && <motion.div key="menu" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><MenuScreen onSelect={selectTest} /></motion.div>}
      {phase === 'intro' && test && <motion.div key="intro" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><IntroScreen test={test} onStart={start} onBack={back} /></motion.div>}
      {phase === 'experiment' && test && <motion.div key="exp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><ExperimentScreen test={test} tubes={tubes} setTubes={setTubes} onIdentify={identify} onBack={back} /></motion.div>}
      {phase === 'identify' && test && <motion.div key="id" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><IdentifyScreen test={test} tubes={tubes} onSubmit={submit} /></motion.div>}
      {phase === 'results' && test && <motion.div key="res" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}><ResultsScreen test={test} tubes={tubes} answers={answers} onReset={reset} /></motion.div>}
    </AnimatePresence>
  )
}
