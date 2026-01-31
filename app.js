/* ===============================
   VAULT 131 TERMINAL — app.js
   =============================== */

/* ========= AUDIO (DO NOT START UNTIL CLICK) ========= */
let ctx = null, hum = null, gain = null;
let audioOn = false;

function ensureAudio(){
  if(ctx) return;
  ctx = new (window.AudioContext||window.webkitAudioContext)();
  hum = ctx.createOscillator();
  gain = ctx.createGain();
  hum.type = "sawtooth";
  hum.frequency.value = 60;
  gain.gain.value = 0; // start silent
  hum.connect(gain);
  gain.connect(ctx.destination);
  hum.start();
}

function fadeInHum(){
  if(!ctx) return;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.6);
}

function fadeOutHum(){
  if(!ctx) return;
  gain.gain.cancelScheduledValues(ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.15);
}

// typing beep (already in your build)
function beep(){
  if(!ctx || !audioOn) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "sine";
  o.frequency.value = 880;
  g.gain.value = 0.03;
  o.start();
  o.stop(ctx.currentTime + 0.03);
}

// soft keypress sound while typing
function keyBeep(type = "normal"){
  if(!ctx || !audioOn) return;

  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);

  o.type = "square";

  if(type === "enter") o.frequency.value = 520;
  else if(type === "backspace") o.frequency.value = 420;
  else o.frequency.value = 720;

  g.gain.value = 0.015;

  o.start();
  o.stop(ctx.currentTime + 0.02);
}

// softer hover/tap beep
function hoverBeep(){
  if(!ctx || !audioOn) return;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.connect(g); g.connect(ctx.destination);
  o.type = "sine";
  o.frequency.value = 640;
  g.gain.value = 0.018;
  o.start();
  o.stop(ctx.currentTime + 0.02);
}

/* ========= ELEMENTS ========= */
const crt = document.getElementById("crt");
const uiBar = document.getElementById("uiBar");
const uiStatus = document.getElementById("uiStatus");
const term = document.getElementById("terminal");
const input = document.getElementById("inputBox");
const hints = document.getElementById("hintContainer");
const dip = document.getElementById("powerDip");
const volBtn = document.getElementById("volBtn");

/* ========= AUDIO BUTTON ========= */
function updateVolBtn(){
  if(!volBtn) return;
  volBtn.textContent = audioOn ? "AUDIO: ON" : "AUDIO: OFF";
  volBtn.classList.toggle("on", audioOn);
}

if(volBtn){
  volBtn.addEventListener("click", ()=>{
    ensureAudio();
    if(ctx.state === "suspended") ctx.resume();

    audioOn = !audioOn;
    updateVolBtn();

    if(audioOn){
      fadeInHum();
      setStatus("AUDIO ENABLED");
    }else{
      fadeOutHum();
      setStatus("AUDIO MUTED");
    }
  });
}

/* ========= BUTTON HOVER/TAP BEEP (EVENT DELEGATION) =========
   Works for dynamically-created buttons (HINT 1/2/3 etc.)
   - Desktop: mouseover
   - Mobile: pointerdown (tap)
*/
let lastHoverSoundAt = 0;
function rateLimitedHoverBeep(){
  const now = Date.now();
  if(now - lastHoverSoundAt < 80) return; // prevent spam
  lastHoverSoundAt = now;
  hoverBeep();
}

document.addEventListener("mouseover", (e)=>{
  const b = e.target.closest("#crt button");
  if(!b) return;
  // ignore while audio still off to avoid confusion
  if(!audioOn) return;
  rateLimitedHoverBeep();
});

document.addEventListener("pointerdown", (e)=>{
  const b = e.target.closest("#crt button");
  if(!b) return;
  if(!audioOn) return;
  rateLimitedHoverBeep();
});

/* ========= CURSOR ========= */
const cursor = document.createElement("span");
cursor.id="cursor";
term.appendChild(cursor);

/* ========= TYPEWRITER ========= */
function type(lines, speed=35, cb){
  let i=0;
  (function next(){
    if(i>=lines.length){ cb && cb(); return; }

    const d = document.createElement("div");
    term.insertBefore(d, cursor);

    let j=0;
    const prePause = (Math.random()<0.18) ? (180 + Math.random()*240) : 0;

    setTimeout(()=>{
      (function c(){
        if(j>=lines[i].length){
          i++;
          setTimeout(next, 260 + Math.random()*120);
          return;
        }
        d.textContent += lines[i][j++];
        beep();
        term.scrollTop = term.scrollHeight;
        setTimeout(c, speed + Math.random()*25);
      })();
    }, prePause);
  })();
}

/* ========= UI STATES ========= */
function setLocked(){
  uiBar.textContent = "VAULT 131 DATABASE │ STATUS: LOCKED";
}
function setUnlocked(){
  uiBar.textContent = "VAULT 131 DATABASE │ STATUS: OPERATIONAL │ USER: IZABELLA";
}
function setStatus(text){
  uiStatus.textContent = text;
}

/* ========= DATA ========= */
const ID = "101-317-76";
const NEXT_ID = "14-LOVE-READY";
const FINAL_CODE = "531";

// Optional “skip to end” admin PIN (change this to whatever you want)
const ADMIN_PIN = "131-OVERRIDE";

const riddles = [
  { q:"I move without legs and follow you everywhere.",
    a:"shadow",
    h:["You see me when light hits you.","I copy your shape perfectly.","I disappear in darkness."] },

  { q:"The more you take, the more you leave behind.",
    a:"footsteps",
    h:["You make me without noticing.","I mark where you’ve been.","I vanish if you stop walking."] },

  { q:"I speak without a mouth and hear without ears.",
    a:"echo",
    h:["I repeat what you say.","I live in empty spaces.","You hear me after you call out."] },

  { q:"I’m always coming, but I never arrive.",
    a:"tomorrow",
    h:["You can’t hold me in your hands.","I’m always one day away.","It becomes today… then it’s gone."] },

  { q:"I have keys but open no locks. I have space but no room. You can enter, but you can’t go outside. What am I?",
    a:"keyboard",
    h:["Think: terminal.","You’re using me right now.","Keys + space + enter = me."] }
];

const finalQ = {
  q:"FINAL AUTHORIZATION REQUIRED.\n\nThis number marks the day everything changed.\nWhat is the code?",
  a: FINAL_CODE,
  h:["There were flowers.","You went to the beach.","Someone was running late… for a good reason."]
};

const loadMsgs = [
  "ACCESSING VAULT RECORDS…",
  "DECRYPTING MEMORY SECTORS…",
  "VERIFYING EMOTIONAL STABILITY…",
  "CHECKING RADIATION LEVELS…",
  "SYNCING PERSONAL DATA…",
  "VAULT-TEC PROTOCOL ACTIVE…",
  "AUTHORIZATION PENDING…",
  "BUFFERING… PLEASE WAIT…"
];

const loadDetails = [
  "LINK: VAULTNET/131 :: HANDSHAKE OK",
  "CACHE: REBUILDING INDEX TABLES",
  "SECURITY: HASHING CREDENTIALS",
  "I/O: CALIBRATING CONSOLE INPUT",
  "SYS: SCANNING FOR ANOMALIES",
  "MEM: FLUSHING TEMP BUFFERS",
  "DATA: CHECKSUM VALIDATION PASS",
  "COMMS: SIGNAL STRENGTH STABLE",
  "CORE: SPINNING UP MODULES",
  "VAULT-TEC: INTEGRITY 100%"
];

/* ========= STATE ========= */
let stage = "login";
let r = 0;
let hintUsed = 0;
let locked = false;

/* ========= HELPERS ========= */
function clear(){
  term.innerHTML="";
  term.appendChild(cursor);
}

function showInput(ph=""){
  input.style.display="block";
  input.placeholder=ph;
  input.value="";
  input.focus();
}

function hideInput(){
  input.style.display="none";
}

function showHints(arr){
  hints.innerHTML="";
  for(let i=hintUsed;i<3;i++){
    const b = document.createElement("button");
    b.textContent = "HINT " + (i+1);
    b.onclick = ()=>{
      if(locked) return;
      setStatus("HINT MODULE: ACTIVE");
      type(["HINT: " + arr[i]], 30, ()=> setStatus("AWAITING INPUT…"));
      hintUsed++;
      showHints(arr);
    };
    hints.appendChild(b);
  }
}

/* ========= POWER DIP ========= */
function powerDip(cb){
  dip.classList.remove("powerDipOn");
  void dip.offsetWidth; // restart animation
  dip.classList.add("powerDipOn");
  setStatus("POWER FLUCTUATION… STABILIZING");
  setTimeout(()=>{
    setStatus("STABILITY: NOMINAL");
    cb && cb();
  }, 420);
}

/* ========= LOADING BAR + RAD FLICKER ========= */
function loading(cb){
  locked = true;
  hideInput();
  hints.innerHTML = "";

  setStatus("PROCESSING… PLEASE WAIT");

  const track = document.createElement("div");
  const fill = document.createElement("div");
  track.className="loadTrack";
  fill.className="loadFill";
  track.appendChild(fill);

  const msg = document.createElement("div");
  msg.className="loadMsg";

  const detail = document.createElement("div");
  detail.className="loadDetail";

  term.insertBefore(track, cursor);
  term.insertBefore(msg, cursor);
  term.insertBefore(detail, cursor);

  let p=0, mi=0, di=0;
  msg.textContent = loadMsgs[Math.floor(Math.random()*loadMsgs.length)];
  detail.textContent = loadDetails[Math.floor(Math.random()*loadDetails.length)];

  crt.classList.add("radFlicker");

  const msgI = setInterval(()=>{
    msg.textContent = loadMsgs[mi++ % loadMsgs.length];
  }, 650);

  const detI = setInterval(()=>{
    detail.textContent = loadDetails[di++ % loadDetails.length];
  }, 520);

  const t = setInterval(()=>{
    p += 2 + Math.floor(Math.random()*6);
    if(p>100) p=100;
    fill.style.width = p + "%";
    term.scrollTop = term.scrollHeight;

    if(p>=100){
      clearInterval(t);
      clearInterval(msgI);
      clearInterval(detI);

      setTimeout(()=>{
        track.remove(); msg.remove(); detail.remove();
        locked = false;
        crt.classList.remove("radFlicker");
        setStatus("READY");
        cb && cb();
      }, 240);
    }
  }, 60);
}

/* ========= EASTER EGG ========= */
function showHelp(){
  stage = "help";
  clear();
  setStatus("VAULT-TEC NOTICE");
  type([
    "VAULT-TEC INTERNAL MEMO // DO NOT DISTRIBUTE",
    "------------------------------------------",
    "",
    "If you are reading this, you are doing great.",
    "You are safe here.",
    "",
    "OPERATOR TIP:",
    "- HINT buttons are limited to 3 per question.",
    "- Answers are NOT case sensitive.",
    "",
    "To continue: press ENTER to return.",
  ], 30, ()=> showInput("PRESS ENTER"));
}

/* ========= SCENES ========= */
function boot(){
  stage="login";
  r=0;
  hintUsed=0;
  locked=false;

  setLocked();
  setStatus("STANDBY… AWAITING INPUT");
  clear();

  type([
    "VAULT 131 DATABASE",
    "SECURITY: ENABLED",
    "ENTER IDENTIFICATION:",
    "> "
  ], 35, ()=> showInput("ENTER ID"));
}

function askRiddle(){
  if(r >= riddles.length){
    stage="final";
    hintUsed=0;
    clear();
    setStatus("FINAL AUTHORIZATION");
    type([finalQ.q, "", "> "], 35, ()=>{
      showInput("ENTER CODE");
      showHints(finalQ.h);
      setStatus("AWAITING FINAL INPUT…");
    });
    return;
  }

  stage="riddle";
  hintUsed=0;
  clear();
  setStatus(`TEST MODULE ${r+1}/5 LOADED`);
  type([`RIDDLE ${r+1}: ${riddles[r].q}`, "", "> "], 35, ()=>{
    showInput("TYPE ANSWER");
    showHints(riddles[r].h);
    setStatus("AWAITING INPUT…");
  });
}

function showReadyScene(){
  stage="ready";
  setUnlocked();
  setStatus("NEXT ADVENTURE UNLOCKED");
  clear();
  type([
    "ACCESS ACCEPTED.",
    "",
    "Izabella — on the 14th, be ready to go out.",
    "Wear something nice.",
    "Do your hair and makeup.",
    "",
    "Expect to have some fun. 🙂",
    "",
    "Press ENTER to return to main menu."
  ], 35, ()=> showInput("PRESS ENTER"));
}

function showFinalSuccess(){
  clear();
  setStatus("AUTHORIZATION GRANTED");
  type([
    "AUTHORIZATION GRANTED.",
    "",
    "CASE CODE:",
    ""
  ], 35, ()=>{
    const big = document.createElement("div");
    big.className="bigCode";
    big.textContent = FINAL_CODE;
    term.insertBefore(big, cursor);
    term.scrollTop = term.scrollHeight;

    setTimeout(()=>{
      setStatus("POST-AUTH SEQUENCE");
      type([
        "",
        "Use it to open the briefcase on the bed.",
        "",
        "NEXT ACCESS UNLOCKED.",
        `NEW LOGIN CODE: ${NEXT_ID}`,
        "",
        "To use it:",
        "1) Reload this page",
        "2) At the ID prompt, enter that code",
        "",
        "Happy Valentine’s Day, Izabella.",
        "I love you so much — I hope you enjoy today.",
      ], 32, ()=>{
        const btn = document.createElement("button");
        btn.textContent = "RETURN TO MAIN MENU";
        btn.onclick = boot;
        term.insertBefore(btn, cursor);
        term.scrollTop = term.scrollHeight;
        setStatus("SESSION COMPLETE");
      });
    }, 520);
  });
}

/* ========= INPUT ========= */
input.addEventListener("keydown", (e)=>{
  if(e.key !== "Enter") return;
  if(locked) return;

  const raw = (input.value || "").trim();
  const a = raw.toLowerCase();

  input.value = "";
  hideInput();
  hints.innerHTML = "";

  // help easter egg anywhere
  if(a === "help"){ showHelp(); return; }
  if(stage === "help"){ boot(); return; }

  if(stage === "login"){
    setStatus("VALIDATING…");

    // ADMIN PIN: jump straight to the final "531" screen (no riddles)
    if(a === ADMIN_PIN.toLowerCase()){
      setUnlocked();
      setStatus("OVERRIDE ACCEPTED");
      clear();
      type(["OVERRIDE VERIFIED.", "Skipping test modules…"], 32, ()=>{
        loading(()=> powerDip(()=> showFinalSuccess()));
      });
      return;
    }

    if(a === ID.toLowerCase()){
      setUnlocked();
      clear();
      type(["ID VERIFIED.","Welcome, Izabella.","Initializing test modules…"], 35, ()=>{
        loading(()=> powerDip(()=> { r=0; askRiddle(); }));
      });
      return;
    }

    if(a === NEXT_ID.toLowerCase()){
      showReadyScene();
      return;
    }

    type(["✖ INVALID ID", "> "], 35, ()=>{
      setStatus("ACCESS DENIED");
      showInput("ENTER ID");
    });
    return;
  }

  if(stage === "riddle"){
    if(a === riddles[r].a.toLowerCase()){
      setStatus("ANSWER ACCEPTED");
      type(["✔ CORRECT."], 30, ()=>{
        loading(()=> powerDip(()=>{ r++; askRiddle(); }));
      });
    } else {
      setStatus("ANSWER REJECTED");
      type(["✖ TRY AGAIN", "> "], 30, ()=>{
        showInput("TYPE ANSWER");
        showHints(riddles[r].h);
        setStatus("AWAITING INPUT…");
      });
    }
    return;
  }

  if(stage === "final"){
    if(raw === finalQ.a){
      setStatus("CODE ACCEPTED");
      type(["✔ AUTHORIZED."], 30, ()=>{
        loading(()=> powerDip(()=> showFinalSuccess()));
      });
    } else {
      setStatus("CODE INVALID");
      type(["✖ INCORRECT CODE", "> "], 30, ()=>{
        showInput("ENTER CODE");
        showHints(finalQ.h);
        setStatus("AWAITING FINAL INPUT…");
      });
    }
    return;
  }

  if(stage === "ready"){
    boot();
    return;
  }
});

/* Start */
updateVolBtn();
boot();