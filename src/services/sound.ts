// Web Audio API Synthesizer for traditional Vietnamese melodies and sound effects

class SoundService {
  private ctx: AudioContext | null = null;
  private isMusicPlaying: boolean = false;
  private musicInterval: any = null;
  public sfxEnabled: boolean = true;
  public musicEnabled: boolean = true;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Play a gentle tone
  public playTone(freq: number, type: OscillatorType = 'sine', duration: number = 0.2, gainLevel: number = 0.15) {
    if (!this.sfxEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  // Click UI sound
  public playClick() {
    this.playTone(523.25, 'triangle', 0.08, 0.1); // C5
  }

  // Coin collected
  public playCoin() {
    if (!this.sfxEnabled) return;
    this.playTone(987.77, 'sine', 0.1, 0.15); // B5
    setTimeout(() => {
      this.playTone(1318.51, 'sine', 0.2, 0.15); // E6
    }, 80);
  }

  // Correct answer chime (Vietnamese pentatonic festive arpeggio)
  public playCorrect() {
    if (!this.sfxEnabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.3, 0.15);
      }, idx * 90);
    });
  }

  // Wrong answer soft sound
  public playWrong() {
    if (!this.sfxEnabled) return;
    this.playTone(329.63, 'sawtooth', 0.2, 0.08); // E4
    setTimeout(() => {
      this.playTone(293.66, 'sawtooth', 0.3, 0.08); // D4
    }, 150);
  }

  // Quest Completed fanfare
  public playQuestComplete() {
    if (!this.sfxEnabled) return;
    const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.4, 0.2);
      }, idx * 100);
    });
  }

  // Cooking sizzling / bubbling sound
  public playBubble() {
    if (!this.sfxEnabled) return;
    const f = 400 + Math.random() * 300;
    this.playTone(f, 'sine', 0.08, 0.08);
  }

  // Footstep sound
  public playStep() {
    if (!this.sfxEnabled) return;
    this.playTone(180 + Math.random() * 40, 'triangle', 0.05, 0.04);
  }

  // Vietnamese Pentatonic Spring Melody loop (Điệu ngũ cung Bắc: Đồ - Rê - Mi - Sol - La)
  public startMusic() {
    if (this.isMusicPlaying || !this.musicEnabled) return;
    this.initCtx();
    this.isMusicPlaying = true;

    // Pentatonic scale frequencies: C4, D4, E4, G4, A4, C5, D5, E5
    const melody = [
      { note: 523.25, dur: 0.4 }, // C5
      { note: 587.33, dur: 0.4 }, // D5
      { note: 659.25, dur: 0.6 }, // E5
      { note: 587.33, dur: 0.3 }, // D5
      { note: 523.25, dur: 0.5 }, // C5
      { note: 440.00, dur: 0.4 }, // A4
      { note: 392.00, dur: 0.7 }, // G4
      { note: 440.00, dur: 0.4 }, // A4
      { note: 523.25, dur: 0.4 }, // C5
      { note: 659.25, dur: 0.5 }, // E5
      { note: 783.99, dur: 0.7 }, // G5
      { note: 659.25, dur: 0.4 }, // E5
      { note: 587.33, dur: 0.4 }, // D5
      { note: 523.25, dur: 0.8 }, // C5
    ];

    let noteIdx = 0;
    const playNext = () => {
      if (!this.isMusicPlaying || !this.musicEnabled) return;
      const m = melody[noteIdx];
      this.playTone(m.note, 'sine', m.dur, 0.04);
      noteIdx = (noteIdx + 1) % melody.length;
      this.musicInterval = setTimeout(playNext, m.dur * 1000 + 120);
    };

    playNext();
  }

  public stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicInterval) {
      clearTimeout(this.musicInterval);
      this.musicInterval = null;
    }
  }

  public toggleMusic(val?: boolean) {
    this.musicEnabled = val !== undefined ? val : !this.musicEnabled;
    if (this.musicEnabled) {
      this.startMusic();
    } else {
      this.stopMusic();
    }
    return this.musicEnabled;
  }

  public toggleSfx(val?: boolean) {
    this.sfxEnabled = val !== undefined ? val : !this.sfxEnabled;
    return this.sfxEnabled;
  }
}

export const sound = new SoundService();
