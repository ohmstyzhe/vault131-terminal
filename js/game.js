/* ===============================
   game.js — flow, riddles, loading
   =============================== */

/* ========= DATA ========= */
window.ID = "101-317-76";
window.NEXT_ID = "14-LOVE-READY";
window.FINAL_CODE = "531";

/* Optional: admin shortcut to jump to final screen */
window.ADMIN_PIN = "131-OVERRIDE";

window.riddles = [
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

window.finalQ = {
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
window.stage = "login";
window.r = 0;
window.hintUsed = 0;
window.locked = false;

/* ========= LOADING BAR + RAD FLICKER ========= */
window.loading = function loading(cb){
  locked = true;
  hideInput();
  el.hints.innerHTML = "";
  setStatus("PROCESSING… PLEASE WAIT");

  const track = document.createElement("div");
  const fill = document.createElement("div");
  track.className = "loadTrack";
  fill.className = "loadFill";
  track.appendChild(fill);

  const msg = document.createElement("div");
  msg.className = "loadMsg";

  const detail = document.createElement("div");
  detail.className = "loadDetail";

  el.term.insertBefore(track, cursor);
  el.term.insertBefore(msg, cursor);
  el.term.insertBefore(detail, cursor);

  let p = 0, mi = 0, di = 0;
  msg.textContent = loadMsgs[Math.floor(Math.random()*loadMsgs.length)];
  detail.textContent = loadDetails[Math.floor(Math.random()*loadDetails.length)];

  el.crt.classList.add("radFlicker");

  const msgI = setInterval(()=>{ msg.textContent = loadMsgs[mi++ % loadMsgs.length]; }, 650);
  const detI = setInterval(()=>{ detail.textContent = loadDetails[di++ % loadDetails.length]; }, 520);

  const t = setInterval(()=>{
    p += 2 + Math.floor(Math.random()*6);
    if(p > 100) p = 100;
    fill.style.width = p + "%";
    el.term.scrollTop = el.term.scrollHeight;

    if(p >= 100){
      clearInterval(t); clearInterval(msgI); clearInterval(detI);
      setTimeout(()=>{
        track.remove(); msg.remove(); detail.remove();
        locked = false;
        el.crt.classList.remove("radFlicker");
        setStatus("READY");
        cb && cb();
      }, 240);
    }
  }, 60);
};

/* ========= SCENES ========= */
window.boot = function boot(){
  stage = "login";
  r = 0;
  hintUsed = 0;
  locked = false;

  setLocked();
  setStatus("STANDBY… AWAITING INPUT");
  clearTerm();

  typeLines([
    "VAULT 131 DATABASE",
    "SECURITY: ENABLED",
    "ENTER IDENTIFICATION:",
    "> "
  ], 35, ()=> showInput("ENTER ID"));
};

window.askRiddle = function askRiddle(){
  if(r >= riddles.length){
    stage = "final";
    hintUsed = 0;
    clearTerm();
    setStatus("FINAL AUTHORIZATION");

    typeLines([finalQ.q, "", "> "], 35, ()=>{
      showInput("ENTER CODE");
      showHints(finalQ.h);
      setStatus("AWAITING FINAL INPUT…");
    });
    return;
  }

  stage = "riddle";
  hintUsed = 0;
  clearTerm();
  setStatus(`TEST MODULE ${r+1}/5 LOADED`);

  typeLines([`RIDDLE ${r+1}: ${riddles[r].q}`, "", "> "], 35, ()=>{
    showInput("TYPE ANSWER");
    showHints(riddles[r].h);
    setStatus("AWAITING INPUT…");
  });
};

window.showReadyScene = function showReadyScene(){
  stage = "ready";
  setUnlocked();
  setStatus("NEXT ADVENTURE UNLOCKED");
  clearTerm();

  typeLines([
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
};

window.showFinalSuccess = function showFinalSuccess(){
  clearTerm();
  setStatus("AUTHORIZATION GRANTED");

  typeLines([
    "AUTHORIZATION GRANTED.",
    "",
    "CASE CODE:",
    ""
  ], 35, ()=>{
    const big = document.createElement("div");
    big.className = "bigCode";
    big.textContent = FINAL_CODE;
    el.term.insertBefore(big, cursor);
    el.term.scrollTop = el.term.scrollHeight;

    setTimeout(()=>{
      setStatus("POST-AUTH SEQUENCE");
      typeLines([
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
        "I love you so much — I hope you enjoy today."
      ], 32, ()=>{
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = "RETURN TO MAIN MENU";
        btn.onclick = boot;
        el.term.insertBefore(btn, cursor);
        el.term.scrollTop = el.term.scrollHeight;
        setStatus("SESSION COMPLETE");
      });
    }, 520);
  });
};

/* ========= HELP EASTER EGG ========= */
window.showHelp = function showHelp(){
  stage = "help";
  clearTerm();
  setStatus("VAULT-TEC NOTICE");

  typeLines([
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
    "To continue: press ENTER to return."
  ], 30, ()=> showInput("PRESS ENTER"));
};

/* ========= INPUT HANDLER (includes typing sound) ========= */
el.input.addEventListener("keydown", (e)=>{
  if(locked) return;

  // typing sounds while user is typing in the input
  if(window.audioOn && window.keyBeep){
    if(e.key === "Enter") keyBeep("enter");
    else if(e.key === "Backspace") keyBeep("backspace");
    else if(e.key.length === 1) keyBeep("normal");
  }

  if(e.key !== "Enter") return;

  const raw = (el.input.value || "").trim();
  const a = raw.toLowerCase();

  el.input.value = "";
  hideInput();
  el.hints.innerHTML = "";

  if(a === "help"){ showHelp(); return; }
  if(stage === "help"){ boot(); return; }

  if(stage === "login"){
    setStatus("VALIDATING…");

    if(a === ADMIN_PIN.toLowerCase()){
      setUnlocked();
      clearTerm();
      typeLines(["OVERRIDE VERIFIED.", "Skipping test modules…"], 32, ()=>{
        loading(()=> powerDip(()=> showFinalSuccess()));
      });
      return;
    }

    if(a === ID.toLowerCase()){
      setUnlocked();
      clearTerm();
      typeLines(["ID VERIFIED.","Welcome, Izabella.","Initializing test modules…"], 35, ()=>{
        loading(()=> powerDip(()=> { r=0; askRiddle(); }));
      });
      return;
    }

    if(a === NEXT_ID.toLowerCase()){
      showReadyScene();
      return;
    }

    typeLines(["✖ INVALID ID", "> "], 35, ()=>{
      setStatus("ACCESS DENIED");
      showInput("ENTER ID");
    });
    return;
  }

  if(stage === "riddle"){
    if(a === riddles[r].a.toLowerCase()){
      setStatus("ANSWER ACCEPTED");
      typeLines(["✔ CORRECT."], 30, ()=>{
        loading(()=> powerDip(()=>{
          r++;
          askRiddle();
        }));
      });
    } else {
      setStatus("ANSWER REJECTED");
      typeLines(["✖ TRY AGAIN", "> "], 30, ()=>{
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
      typeLines(["✔ AUTHORIZED."], 30, ()=>{
        loading(()=> powerDip(()=> showFinalSuccess()));
      });
    } else {
      setStatus("CODE INVALID");
      typeLines(["✖ INCORRECT CODE", "> "], 30, ()=>{
        showInput("ENTER CODE");
        showHints(finalQ.h);
        setStatus("AWAITING FINAL INPUT…");
      });
    }
    return;
  }

  if(stage === "ready"){
    boot();
  }
});