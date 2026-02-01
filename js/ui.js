export class UI {
  constructor(audio){
    this.audio = audio;

    this.crt = document.getElementById("crt");
    this.uiBar = document.getElementById("uiBar");
    this.uiStatus = document.getElementById("uiStatus");
    this.term = document.getElementById("terminal");
    this.input = document.getElementById("inputBox");
    this.hints = document.getElementById("hintContainer");
    this.volBtn = document.getElementById("volBtn");
    this.valScreen = document.getElementById("valScreen");
    this.powerDip = document.getElementById("powerDip");

    this.cursor = document.createElement("span");
    this.cursor.id = "cursor";
    this.term.appendChild(this.cursor);

    this._wireAudioBtn();
    this._wireBeepOnHover();
    this._wireTypingBeep();
  }

  _wireAudioBtn(){
    this.updateVolBtn();
    this.volBtn.addEventListener("click", ()=>{
      const on = this.audio.toggle();
      this.updateVolBtn();
      this.setStatus(on ? "AUDIO ENABLED" : "AUDIO MUTED");
      this.audio.beep(on ? 980 : 420, 0.05, 0.03);
    });
  }

  updateVolBtn(){
    this.volBtn.textContent = this.audio.audioOn ? "AUDIO: ON" : "AUDIO: OFF";
    this.volBtn.classList.toggle("on", this.audio.audioOn);
  }

  _wireBeepOnHover(){
    let last = 0;
    this.crt.addEventListener("pointerover", (e)=>{
      const btn = e.target.closest("button");
      if(!btn) return;
      const now = Date.now();
      if(now - last < 70) return;
      last = now;
      this.audio.hoverBeep();
    }, { passive:true });

    this.crt.addEventListener("click", (e)=>{
      const btn = e.target.closest("button");
      if(!btn) return;
      this.audio.clickBeep();
    }, { passive:true });
  }

  _wireTypingBeep(){
    this.input.addEventListener("keydown", (e)=>{
      const ignore = new Set(["Shift","Alt","Control","Meta","Tab","CapsLock","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Escape"]);
      if(ignore.has(e.key)) return;
      if(e.key === "Enter") return;
      this.audio.typeBeep();
    });
  }

  setStatus(t){ this.uiStatus.textContent = t; }
  setLocked(){ this.uiBar.textContent = "VAULT 131 DATABASE │ STATUS: LOCKED"; }
  setUnlocked(){ this.uiBar.textContent = "VAULT 131 DATABASE │ STATUS: OPERATIONAL │ USER: IZABELLA"; }

  clear(){
    this.term.innerHTML = "";
    this.term.appendChild(this.cursor);
  }

  showInput(ph=""){
    this.input.style.display = "block";
    this.input.placeholder = ph;
    this.input.value = "";
    this.input.focus();
  }

  hideInput(){ this.input.style.display = "none"; }

  showHints(buttons){
    this.hints.innerHTML = "";
    buttons.forEach(b => this.hints.appendChild(b));
  }

  hideHints(){
    this.hints.innerHTML = "";
  }

  showTerminal(){
    this.term.style.display = "block";
    this.input.style.display = "block";
    this.hints.style.display = "flex";
    if(this.valScreen){
      this.valScreen.style.display = "none";
      this.valScreen.setAttribute("aria-hidden","true");
    }
  }

  showValentine(){
    this.term.style.display = "none";
    this.input.style.display = "none";
    this.hints.style.display = "none";
    if(this.valScreen){
      this.valScreen.style.display = "block";
      this.valScreen.setAttribute("aria-hidden","false");
    }
  }

  powerDip(cb){
    if(!this.powerDip){ cb && cb(); return; }
    this.powerDip.classList.remove("powerDipOn");
    void this.powerDip.offsetWidth;
    this.powerDip.classList.add("powerDipOn");
    setTimeout(()=> cb && cb(), 420);
  }

  type(lines, speed=35, cb){
    let i=0;
    const next = ()=>{
      if(i >= lines.length){ cb && cb(); return; }
      const d = document.createElement("div");
      this.term.insertBefore(d, this.cursor);
      let j=0;

      const prePause = (Math.random()<0.18) ? (180 + Math.random()*240) : 0;

      setTimeout(()=>{
        const step = ()=>{
          if(j >= lines[i].length){
            i++;
            setTimeout(next, 260 + Math.random()*120);
            return;
          }
          d.textContent += lines[i][j++];
          // keep the classic terminal tick (only if audio ON)
          this.audio.beep(880, 0.012, 0.015);
          this.term.scrollTop = this.term.scrollHeight;
          setTimeout(step, speed + Math.random()*22);
        };
        step();
      }, prePause);
    };
    next();
  }
}