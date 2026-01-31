/* ===============================
   ui.js — DOM, typewriter, helpers
   =============================== */

window.el = {
  crt: document.getElementById("crt"),
  uiBar: document.getElementById("uiBar"),
  uiStatus: document.getElementById("uiStatus"),
  term: document.getElementById("terminal"),
  input: document.getElementById("inputBox"),
  hints: document.getElementById("hintContainer"),
  dip: document.getElementById("powerDip")
};

if(!el.crt || !el.uiBar || !el.uiStatus || !el.term || !el.input || !el.hints || !el.dip){
  throw new Error("Missing required DOM IDs. Check index.html element ids.");
}

/* cursor */
window.cursor = document.createElement("span");
cursor.id = "cursor";
el.term.appendChild(cursor);

/* UI setters */
window.setLocked = function setLocked(){
  el.uiBar.textContent = "VAULT 131 DATABASE │ STATUS: LOCKED";
};

window.setUnlocked = function setUnlocked(){
  el.uiBar.textContent = "VAULT 131 DATABASE │ STATUS: OPERATIONAL │ USER: IZABELLA";
};

window.setStatus = function setStatus(text){
  el.uiStatus.textContent = text;
};

/* terminal helpers */
window.clearTerm = function clearTerm(){
  el.term.innerHTML = "";
  el.term.appendChild(cursor);
};

window.showInput = function showInput(ph=""){
  el.input.style.display = "block";
  el.input.placeholder = ph;
  el.input.value = "";
  el.input.focus();
};

window.hideInput = function hideInput(){
  el.input.style.display = "none";
};

/* typewriter */
window.typeLines = function typeLines(lines, speed = 35, cb){
  let i = 0;

  (function next(){
    if(i >= lines.length){ cb && cb(); return; }

    const d = document.createElement("div");
    el.term.insertBefore(d, cursor);

    let j = 0;
    const prePause = (Math.random() < 0.18) ? (180 + Math.random()*240) : 0;

    setTimeout(()=>{
      (function c(){
        if(j >= lines[i].length){
          i++;
          setTimeout(next, 260 + Math.random()*120);
          return;
        }
        d.textContent += lines[i][j++];
        if(window.beep) beep(880, 0.02, 0.02);
        el.term.scrollTop = el.term.scrollHeight;
        setTimeout(c, speed + Math.random()*25);
      })();
    }, prePause);
  })();
};

/* hint buttons */
window.showHints = function showHints(arr){
  el.hints.innerHTML = "";

  for(let i = window.hintUsed; i < 3; i++){
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = "HINT " + (i+1);

    b.onclick = ()=>{
      if(window.locked) return;
      setStatus("HINT MODULE: ACTIVE");
      typeLines(["HINT: " + arr[i]], 30, ()=> setStatus("AWAITING INPUT…"));
      window.hintUsed++;
      showHints(arr);
    };

    el.hints.appendChild(b);
  }
};

/* power dip animation */
window.powerDip = function powerDip(cb){
  el.dip.classList.remove("powerDipOn");
  void el.dip.offsetWidth;
  el.dip.classList.add("powerDipOn");

  setStatus("POWER FLUCTUATION… STABILIZING");
  setTimeout(()=>{
    setStatus("STABILITY: NOMINAL");
    cb && cb();
  }, 420);
};

/* global button hover/tap sound (works for dynamically created buttons too) */
(function attachButtonSounds(){
  let last = 0;
  function fire(){
    const now = Date.now();
    if(now - last < 90) return;
    last = now;
    if(window.hoverBeep) hoverBeep();
  }

  // desktop hover
  el.crt.addEventListener("mouseover", (e)=>{
    const b = e.target.closest("button");
    if(!b) return;
    if(!window.audioOn) return;
    fire();
  });

  // mobile tap/press
  el.crt.addEventListener("pointerdown", (e)=>{
    const b = e.target.closest("button");
    if(!b) return;
    if(!window.audioOn) return;
    fire();
  });
})();