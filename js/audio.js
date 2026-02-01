export class AudioSystem {
  constructor(){
    this.ctx = null;
    this.hum = null;
    this.gain = null;
    this.audioOn = false;
  }

  ensure(){
    if(this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Hum (doesn't start audible until audio is ON)
    this.hum = this.ctx.createOscillator();
    this.gain = this.ctx.createGain();

    this.hum.type = "sawtooth";
    this.hum.frequency.value = 60;
    this.gain.gain.value = 0;

    this.hum.connect(this.gain);
    this.gain.connect(this.ctx.destination);
    this.hum.start();
  }

  toggle(){
    this.ensure();
    if(this.ctx.state === "suspended") this.ctx.resume();
    this.audioOn = !this.audioOn;

    if(this.audioOn) this.fadeInHum();
    else this.fadeOutHum();

    return this.audioOn;
  }

  fadeInHum(){
    if(!this.ctx) return;
    this.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gain.gain.linearRampToValueAtTime(0.02, this.ctx.currentTime + 0.6);
  }

  fadeOutHum(){
    if(!this.ctx) return;
    this.gain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.gain.gain.linearRampToValueAtTime(0.0, this.ctx.currentTime + 0.15);
  }

  beep(freq=880, dur=0.03, vol=0.03){
    if(!this.ctx || !this.audioOn) return;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.connect(g); g.connect(this.ctx.destination);
    o.frequency.value = freq;
    g.gain.value = vol;
    o.start();
    o.stop(this.ctx.currentTime + dur);
  }

  hoverBeep(){ this.beep(640, 0.02, 0.020); }
  clickBeep(){ this.beep(740, 0.03, 0.028); }
  typeBeep(){ this.beep(880, 0.012, 0.015); }
}