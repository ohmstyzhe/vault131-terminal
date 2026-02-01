export class AudioSystem {
  constructor(){
    this.enabled = false;
    this.ctx = null;
    this.osc = null;
    this.gain = null;
  }

  async ensure(){
    if(this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioCtx();
    this.gain = this.ctx.createGain();
    this.gain.gain.value = 0.00001; // start silent
    this.gain.connect(this.ctx.destination);

    // simple “terminal hum” oscillator (no external files needed)
    this.osc = this.ctx.createOscillator();
    this.osc.type = "sine";
    this.osc.frequency.value = 55;
    this.osc.connect(this.gain);
    this.osc.start();
  }

  async toggle(){
    await this.ensure();

    if(this.ctx.state === "suspended"){
      await this.ctx.resume();
    }

    this.enabled = !this.enabled;
    this.gain.gain.value = this.enabled ? 0.015 : 0.00001;
  }
}