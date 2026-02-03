export class AudioSystem {
  constructor() {
    this.enabled = false;
    this.ctx = null;
    this.humOsc = null;
    this.humGain = null;
  }

  async init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    // soft CRT hum using an oscillator (no external audio files needed)
    this.humOsc = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();

    this.humOsc.type = "sine";
    this.humOsc.frequency.value = 55; // low hum

    this.humGain.gain.value = 0.0;

    this.humOsc.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);
    this.humOsc.start();
  }

  async toggle() {
    await this.init();

    this.enabled = !this.enabled;

    if (this.enabled) {
      // fade in
      this.humGain.gain.setTargetAtTime(0.035, this.ctx.currentTime, 0.08);
    } else {
      // fade out
      this.humGain.gain.setTargetAtTime(0.0, this.ctx.currentTime, 0.08);
    }

    return this.enabled;
  }

  async click() {
    // tiny “button click” blip
    if (!this.ctx) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "square";
    o.frequency.value = 900;
    g.gain.value = 0.03;
    o.connect(g); g.connect(this.ctx.destination);
    o.start();
    g.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.03);
    o.stop(this.ctx.currentTime + 0.06);
  }
}