export class AudioSystem{
  constructor(){
    this.ctx = null;
    this.humOsc = null;
    this.humGain = null;
    this.enabled = false;
  }

  ensure(){
    if(this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    this.humOsc = this.ctx.createOscillator();
    this.humGain = this.ctx.createGain();

    this.humOsc.type = "sawtooth";
    this.humOsc.frequency.value = 60;
    this.humGain.gain.value = 0;

    this.humOsc.connect(this.humGain);
    this.humGain.connect(this.ctx.destination);
    this.humOsc.start();
  }

  async toggle(){
    this.ensure();
    if(this.ctx.state === "suspended") await this.ctx.resume();
    this.enabled = !this.enabled;

    if(this.enabled) this.fadeHumIn();
    else this.fadeHumOut();

    return this.enabled;
  }

  fadeHumIn(){
    if(!this.ctx) return;
    const t = this.ctx.currentTime;
    this.humGain.gain.cancelScheduledValues(t);
    this.humGain.gain.linearRampToValueAtTime(0.02, t + 0.6);
  }

  fadeHumOut(){
    if(!this.ctx) return;
    const t = this.ctx.currentTime;
    this.humGain.gain.cancelScheduledValues(t);
    this.humGain.gain.linearRampToValueAtTime(0.0, t + 0.15);
  }

  // small utility beep
  _tone(freq=880, dur=0.03, vol=0.03){
    if(!this.ctx || !this.enabled) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.frequency.value = freq;
    g.gain.value = vol;
    o.start();
    o.stop(this.ctx.currentTime + dur);
  }

  // used for typewriter printing
  beep(){
    this._tone(880, 0.03, 0.03);
  }

  // used for hover over buttons
  hover(){
    this._tone(640, 0.02, 0.018);
  }

  // used when user types in the input box
  key(){
    this._tone(920, 0.015, 0.015);
  }
}