import React, { useEffect, useState, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isMuted: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction to satisfy browser security
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public startAmbient() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      if (this.ambientOsc) {
        this.ambientGain!.gain.setValueAtTime(0.04, this.ctx.currentTime);
        return;
      }

      // Create low frequency structural rumble (ambient architecture drone)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A1 note
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(55.5, this.ctx.currentTime); // Detuned low hum

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(80, this.ctx.currentTime);

      gainNode.gain.setValueAtTime(0.04, this.ctx.currentTime); // keep it extremely subtle

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(this.ctx.destination);

      osc1.start();
      osc2.start();

      this.ambientOsc = osc1; // reference one for tracking
      this.ambientGain = gainNode;
    } catch (e) {
      console.warn("AudioContext failed to start:", e);
    }
  }

  public stopAmbient() {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(0, this.ctx.currentTime);
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAmbient();
    } else {
      this.startAmbient();
    }
  }

  public playHover() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Small luxury bell synth
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, this.ctx.currentTime); // High B5 note
    
    gain.gain.setValueAtTime(0.008, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    // Clean modern UI tick
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

// Global instance to share across components
export const audioService = new SoundSynthesizer();

export const SoundController: React.FC = () => {
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    const nextState = !muted;
    setMuted(nextState);
    audioService.setMute(nextState);
  };

  useEffect(() => {
    // Add hover sound handlers to buttons and links
    const handleHover = () => audioService.playHover();
    const handleClick = () => audioService.playClick();

    const addAudioTriggers = () => {
      const elements = document.querySelectorAll('a, button, .project-card, [role="button"]');
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('click', handleClick);
        el.addEventListener('mouseenter', handleHover);
        el.addEventListener('click', handleClick);
      });
    };

    addAudioTriggers();

    const observer = new MutationObserver(addAudioTriggers);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      const elements = document.querySelectorAll('a, button, .project-card, [role="button"]');
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleHover);
        el.removeEventListener('click', handleClick);
      });
    };
  }, [muted]);

  return (
    <div className="fixed bottom-6 right-6 z-[9997] flex items-center gap-3">
      {/* Soundwave animation */}
      {!muted && (
        <div className="flex items-end gap-[3px] h-4 px-2">
          <div className="w-[2px] bg-primary/70 animate-[bounce_0.8s_infinite] h-2"></div>
          <div className="w-[2px] bg-primary/70 animate-[bounce_0.8s_infinite_0.2s] h-4"></div>
          <div className="w-[2px] bg-primary/70 animate-[bounce_0.8s_infinite_0.4s] h-3"></div>
          <div className="w-[2px] bg-primary/70 animate-[bounce_0.8s_infinite_0.1s] h-1.5"></div>
        </div>
      )}
      
      <button
        onClick={toggleMute}
        className="w-12 h-12 rounded-full border border-primary/20 bg-dark/40 backdrop-blur-md flex items-center justify-center text-primary hover:text-white hover:border-primary hover:shadow-premium-glow transition-all duration-300 pointer-events-auto"
        aria-label={muted ? "Unmute site audio" : "Mute site audio"}
      >
        {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
    </div>
  );
};
