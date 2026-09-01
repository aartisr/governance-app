export interface VoiceOption {
  name: string;
  lang: string;
  default: boolean;
}

type BoundaryCallback = (charIndex: number, text: string) => void;
type EndCallback = () => void;

class AudioNarrator {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private speechRate: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private isBgmPlaying: boolean = false;
  private bgmOscillators: OscillatorNode[] = [];
  private bgmGainNode: GainNode | null = null;
  private keepAliveInterval: any = null;
  private onBoundaryCb: BoundaryCallback | null = null;
  private onEndCb: EndCallback | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.initVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  private initVoices() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.availableVoices = voices;
    
    // Select a premium natural or high-clarity English voice if available
    const preferred = voices.find(v => 
      (v.name.includes('Natural') || v.name.includes('Google US English') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Karen') || v.name.includes('Serena')) && (v.lang.startsWith('en') || v.lang === 'en_US')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferred && !this.selectedVoice) {
      this.selectedVoice = preferred;
    }
  }

  public getVoices(): VoiceOption[] {
    if (!this.synth) return [];
    const voices = this.synth.getVoices();
    return voices
      .filter(v => v.lang.startsWith('en') || v.lang.startsWith('en-'))
      .map(v => ({
        name: v.name,
        lang: v.lang,
        default: v === this.selectedVoice
      }));
  }

  public setVoiceByName(name: string) {
    const voice = this.availableVoices.find(v => v.name === name);
    if (voice) {
      this.selectedVoice = voice;
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stop();
      this.stopBgm();
    }
  }

  public setRate(rate: number) {
    this.speechRate = Math.min(Math.max(rate, 0.75), 1.75);
  }

  private startKeepAlive() {
    this.stopKeepAlive();
    // Chrome bug workaround: speechSynthesis stops after ~15s without keepalive
    this.keepAliveInterval = setInterval(() => {
      if (this.synth && this.synth.speaking) {
        this.synth.pause();
        this.synth.resume();
      }
    }, 10000);
  }

  private stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  public speak(
    text: string, 
    options?: {
      onEnd?: () => void;
      onBoundary?: (charIndex: number, text: string) => void;
    }
  ) {
    if (!this.synth || this.isMuted) {
      if (options?.onEnd) {
        // Compute realistic duration based on word count
        const words = text.split(/\s+/).length;
        const estimatedMs = Math.max(3000, (words / (2.2 * this.speechRate)) * 1000);
        setTimeout(options.onEnd, estimatedMs);
      }
      return;
    }

    try {
      this.stop(); // Stop prior speech cleanly

      const utterance = new SpeechSynthesisUtterance(text);
      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }
      utterance.rate = this.speechRate;
      utterance.pitch = 1.02; // Warm, authoritative presenter pitch
      utterance.volume = 1.0;

      this.onEndCb = options?.onEnd || null;
      this.onBoundaryCb = options?.onBoundary || null;

      utterance.onboundary = (event) => {
        if (this.onBoundaryCb) {
          this.onBoundaryCb(event.charIndex, text);
        }
      };

      utterance.onend = () => {
        this.stopKeepAlive();
        this.currentUtterance = null;
        if (this.onEndCb) {
          const cb = this.onEndCb;
          this.onEndCb = null;
          cb();
        }
      };

      utterance.onerror = (e) => {
        // Interrupted is expected when user seeks or pauses
        if (e.error !== 'interrupted' && e.error !== 'canceled') {
          console.warn('Speech error:', e);
        }
        this.stopKeepAlive();
        this.currentUtterance = null;
        if (this.onEndCb) {
          const cb = this.onEndCb;
          this.onEndCb = null;
          cb();
        }
      };

      this.currentUtterance = utterance;
      this.startKeepAlive();
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis invocation failed:', err);
      this.stopKeepAlive();
      if (options?.onEnd) options.onEnd();
    }
  }

  public stop() {
    this.stopKeepAlive();
    this.onEndCb = null;
    this.onBoundaryCb = null;
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.currentUtterance = null;
  }

  public playSoundEffect(type: 'click' | 'chime' | 'success' | 'alert') {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.035);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      } else if (type === 'chime') {
        // Nobel chapter intro chord (C Major 9)
        [523.25, 659.25, 783.99, 987.77, 1174.66].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.05);
          gain.gain.setValueAtTime(0.07, now + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 1.1);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.05);
          osc.stop(now + i * 0.05 + 1.15);
        });
      } else if (type === 'success') {
        // Pareto gain triumph fanfare
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.09, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 1.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 1.35);
        });
      }
    } catch (e) {
      // Audio context may require user gesture
    }
  }

  public startAmbientBgm() {
    if (this.isBgmPlaying || this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.012, now);
      masterGain.connect(ctx.destination);
      this.bgmGainNode = masterGain;

      // Warm acoustic drone frequencies (C2, G2, E3, B3)
      const freqs = [65.41, 98.00, 164.81, 246.94];
      this.bgmOscillators = freqs.map(freq => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(masterGain);
        osc.start(now);
        return osc;
      });

      this.isBgmPlaying = true;
    } catch (e) {
      // ignore
    }
  }

  public stopBgm() {
    if (!this.isBgmPlaying) return;
    try {
      this.bgmOscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.bgmOscillators = [];
      if (this.bgmGainNode) {
        this.bgmGainNode.disconnect();
        this.bgmGainNode = null;
      }
      this.isBgmPlaying = false;
    } catch (e) {}
  }
}

export const narrator = new AudioNarrator();

