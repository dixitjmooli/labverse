// ─── Sound Engine (Web Audio API synthesized SFX) ────────────────────────────
// Shared across all experiments. No external audio files needed.

export type ReactionVisual =
  | "precipitate" | "color-change" | "silver-mirror" | "foul-smell"
  | "fruity-smell" | "antiseptic-smell" | "effervescence" | "turbidity"
  | "oily-layer" | "no-reaction" | "dissolve" | "decolorize" | "dye";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;
  private getCtx(): AudioContext {
    if (!this.ctx) this.ctx = new AudioContext();
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }
  toggle() { this.enabled = !this.enabled; return this.enabled; }
  isEnabled() { return this.enabled; }

  playDrop() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(800, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.15);
      g.gain.setValueAtTime(0.12, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.2);
    } catch { /* */ }
  }
  playPour() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), bs = c.sampleRate * 0.4, b = c.createBuffer(1, bs, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < bs; i++) {
        const t = i / c.sampleRate;
        d[i] = (Math.random() * 2 - 1) * 0.04 * Math.sin(t * Math.PI);
      }
      const s = c.createBufferSource(); s.buffer = b;
      const f = c.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 600;
      const g = c.createGain();
      g.gain.setValueAtTime(0.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.4);
      s.connect(f); f.connect(g); g.connect(c.destination);
      s.start();
    } catch { /* */ }
  }
  playFizz() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), bs = c.sampleRate * 1, b = c.createBuffer(1, bs, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < bs; i++) {
        const t = i / c.sampleRate;
        d[i] = (Math.random() * 2 - 1) * 0.06 * Math.sin(t * Math.PI);
      }
      const s = c.createBufferSource(); s.buffer = b;
      const f = c.createBiquadFilter(); f.type = "bandpass"; f.frequency.value = 2000;
      const g = c.createGain();
      g.gain.setValueAtTime(0.2, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1);
      s.connect(f); f.connect(g); g.connect(c.destination);
      s.start();
    } catch { /* */ }
  }
  playPrecipitate() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx();
      for (let i = 0; i < 4; i++) {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "triangle";
        const st = c.currentTime + i * 0.08;
        o.frequency.setValueAtTime(1200 + i * 200, st);
        o.frequency.exponentialRampToValueAtTime(400, st + 0.1);
        g.gain.setValueAtTime(0.06, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.12);
        o.connect(g); g.connect(c.destination);
        o.start(st); o.stop(st + 0.12);
      }
    } catch { /* */ }
  }
  playDissolve() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(300, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(900, c.currentTime + 0.5);
      g.gain.setValueAtTime(0.08, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.6);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.6);
    } catch { /* */ }
  }
  playFoulSmell() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx();
      const o1 = c.createOscillator(), g1 = c.createGain();
      o1.type = "sawtooth";
      o1.frequency.setValueAtTime(80, c.currentTime);
      o1.frequency.linearRampToValueAtTime(50, c.currentTime + 0.8);
      g1.gain.setValueAtTime(0.1, c.currentTime);
      g1.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 1);
      o1.connect(g1); g1.connect(c.destination);
      o1.start(); o1.stop(c.currentTime + 1);
      setTimeout(() => {
        const o2 = c.createOscillator(), g2 = c.createGain();
        o2.type = "square";
        o2.frequency.setValueAtTime(220, c.currentTime);
        g2.gain.setValueAtTime(0.05, c.currentTime);
        g2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
        o2.connect(g2); g2.connect(c.destination);
        o2.start(); o2.stop(c.currentTime + 0.3);
      }, 200);
    } catch { /* */ }
  }
  playFruitySmell() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx();
      [523, 659, 784, 1047].forEach((fr, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = fr;
        const st = c.currentTime + i * 0.1;
        g.gain.setValueAtTime(0.08, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.3);
        o.connect(g); g.connect(c.destination);
        o.start(st); o.stop(st + 0.3);
      });
    } catch { /* */ }
  }
  playEffervescence() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), bs = c.sampleRate * 0.8, b = c.createBuffer(1, bs, c.sampleRate), d = b.getChannelData(0);
      for (let i = 0; i < bs; i++) {
        const t = i / c.sampleRate;
        d[i] = (Math.random() * 2 - 1) * 0.08 * (1 - t / 0.8);
      }
      const s = c.createBufferSource(); s.buffer = b;
      const f = c.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 3000;
      const g = c.createGain();
      g.gain.setValueAtTime(0.2, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.8);
      s.connect(f); f.connect(g); g.connect(c.destination);
      s.start();
    } catch { /* */ }
  }
  playPop() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(600, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.1);
      g.gain.setValueAtTime(0.15, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.15);
    } catch { /* */ }
  }
  playNoReaction() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), o = c.createOscillator(), g = c.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(150, c.currentTime);
      o.frequency.exponentialRampToValueAtTime(60, c.currentTime + 0.2);
      g.gain.setValueAtTime(0.08, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.25);
    } catch { /* */ }
  }
  playSuccess() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx();
      [523, 659, 784].forEach((fr, i) => {
        const o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = fr;
        const st = c.currentTime + i * 0.15;
        g.gain.setValueAtTime(0.1, st);
        g.gain.exponentialRampToValueAtTime(0.001, st + 0.4);
        o.connect(g); g.connect(c.destination);
        o.start(st); o.stop(st + 0.4);
      });
    } catch { /* */ }
  }
  playError() {
    if (!this.enabled) return;
    try {
      const c = this.getCtx(), o = c.createOscillator(), g = c.createGain();
      o.type = "square"; o.frequency.value = 150;
      g.gain.setValueAtTime(0.07, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.3);
      o.connect(g); g.connect(c.destination);
      o.start(); o.stop(c.currentTime + 0.3);
    } catch { /* */ }
  }
}

// Singleton — one engine shared across the whole app.
export const sfx = new SoundEngine();

export function playReactionSound(visual: ReactionVisual, smellType?: string) {
  if (visual === "foul-smell") { sfx.playFoulSmell(); return; }
  if (smellType === "foul") { sfx.playFoulSmell(); return; }
  if (smellType === "fruity") { sfx.playFruitySmell(); return; }
  if (smellType === "antiseptic") { sfx.playPop(); return; }
  if (visual === "effervescence") { sfx.playEffervescence(); return; }
  if (visual === "precipitate") { sfx.playPrecipitate(); return; }
  if (visual === "dissolve") { sfx.playDissolve(); return; }
  if (visual === "silver-mirror") { sfx.playPrecipitate(); return; }
  if (visual === "no-reaction") { sfx.playNoReaction(); return; }
  sfx.playFizz();
}
