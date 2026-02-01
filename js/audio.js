export class AudioSystem {
  constructor(){
    this.ctx = null;
    this.hum = null;
    this.gain = null;
    this.audioOn = false;

    const unlock = () => {
      this.ensure();
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("touchstart", unlock);
    };
    window.addEventListener("pointerdown", unlock, { once:false });
    window.addEventListener("touchstart", unlock, { once:false });
  }

  ensure(){
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.hum = this.ctx.createOscillator();
    this.gain = this.ctx.createGain();

    this.hum.type = "sawtooth";
    this.hum.frequency.value = 60;
    this.gain.gain.value = 0;

    this.hum.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.hum.start();
  }

  setOn(on){
    this.ensure();
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.audioOn = !!on;

    const t = this.ctx.currentTime;
    this.gain.gain.cancelScheduledValues(t);
    this.gain.gain.linearRampToValueAtTime(this.audioOn ? 0.02 : 0.0, t + (this.audioOn ? 0.6 : 0.15));
  }

  toggle(){
    this.setOn(!this.audioOn);
    return this.audioOn;
  }

  beep(freq=880, dur=0.03, vol=0.03){
    if (!this.ctx || !this.audioOn) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);

    o.frequency.value = freq;
    g.gain.value = vol;

    o.start();
    o.stop(this.ctx.currentTime + dur);
  }

  hoverBeep(){ this.beep(640, 0.02, 0.018); }
  clickBeep(){ this.beep(720, 0.03, 0.02); }
  typeBeep(){ this.beep(920, 0.015, 0.016); }
}