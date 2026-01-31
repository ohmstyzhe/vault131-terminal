/* ===============================
   audio.js — sound system
   (starts ONLY after user click)
   =============================== */

window.audioOn = false;
window.ctx = null;
window.hum = null;
window.gain = null;

window.ensureAudio = function ensureAudio(){
  if(window.ctx) return;

  window.ctx = new (window.AudioContext || window.webkitAudioContext)();
  window.hum = window.ctx.createOscillator();
  window.gain = window.ctx.createGain();

  hum.type = "sawtooth";
  hum.frequency.value = 60;

  gain.gain.value = 0; // start silent
  hum.connect(gain);
  gain.connect(ctx.destination);
  hum.start();
};

window.fadeInHum = function fadeInHum(){
  if(!ctx) return;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.6);
};

window.fadeOutHum = function fadeOutHum(){
  if(!ctx) return;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.15);
};

window.beep = function beep(freq = 880, dur = 0.03, vol = 0.03, wave = "sine"){
  if(!ctx || !audioOn) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = wave;
  o.frequency.value = freq;
  g.gain.value = vol;
  o.start();
  o.stop(ctx.currentTime + dur);
};

window.keyBeep = function keyBeep(kind = "normal"){
  if(!ctx || !audioOn) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "square";

  if(kind === "enter") o.frequency.value = 520;
  else if(kind === "backspace") o.frequency.value = 420;
  else o.frequency.value = 720;

  g.gain.value = 0.015;
  o.start();
  o.stop(ctx.currentTime + 0.02);
};

window.hoverBeep = function hoverBeep(){
  if(!ctx || !audioOn) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "sine";
  o.frequency.value = 640;
  g.gain.value = 0.018;
  o.start();
  o.stop(ctx.currentTime + 0.02);
};

window.updateVolBtn = function updateVolBtn(){
  const btn = document.getElementById("volBtn");
  if(!btn) return;
  btn.textContent = audioOn ? "AUDIO: ON" : "AUDIO: OFF";
  btn.classList.toggle("on", audioOn);
};

(function initAudioButton(){
  const btn = document.getElementById("volBtn");
  const uiStatus = document.getElementById("uiStatus");

  if(!btn) return;

  btn.addEventListener("click", async ()=>{
    ensureAudio();
    if(ctx && ctx.state === "suspended") {
      try { await ctx.resume(); } catch(_) {}
    }

    audioOn = !audioOn;
    updateVolBtn();

    if(audioOn){
      fadeInHum();
      if(uiStatus) uiStatus.textContent = "AUDIO ENABLED";
      beep(980, 0.05, 0.03);
    } else {
      fadeOutHum();
      if(uiStatus) uiStatus.textContent = "AUDIO MUTED";
      beep(420, 0.05, 0.02);
    }
  });
})();