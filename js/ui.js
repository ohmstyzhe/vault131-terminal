export class UI{
  constructor(audio){
    this.audio = audio;

    this.crt = document.getElementById("crt");
    this.uiBar = document.getElementById("uiBar");
    this.uiStatus = document.getElementById("uiStatus");
    this.term = document.getElementById("terminal");
    this.input = document.getElementById("inputBox");
    this.hints = document.getElementById("hintContainer");
    this.dip = document.getElementById("powerDip");
    this.volBtn = document.getElementById("volBtn");

    this.locked = false;

    this.cursor = document.createElement("span");
    this.cursor.id = "cursor";
    this.term.appendChild(this.cursor);

    this._wireAudioButton();
    this._wireHoverSounds();
    this._wireTypingSounds();
    this._updateVolBtn();
  }

  _wireAudioButton(){
    this.volBtn.addEventListener("click", async ()=>{
      const on = await this.audio.toggle();
      this._updateVolBtn();
      this.setStatus(on ? "AUDIO ENABLED" : "AUDIO MUTED");
    });
  }

  _wireHoverSounds(){
    // event delegation so dynamically created buttons work too
    this.crt.addEventListener("pointerenter", (e)=>{
      const btn = e.target.closest("button");
      if(!btn) return;
      // only when audio enabled + after user interaction
      this.audio.hover();
    }, true);
  }

  _wireTypingSounds(){
    this.input.addEventListener("keydown", (e)=>{
      // only play for “normal keys” (letters/numbers/backspace)
      if(e.key === "Enter") return;
      if(e.key.length === 1 || e.key === "Backspace") this.audio.key();
    });
  }

  _updateVolBtn(){
    this.volBtn.textContent = this.audio.enabled ? "AUDIO: ON" : "AUDIO: OFF";
    this.volBtn.classList.toggle("on", this.audio.enabled);
  }

  /* ===== basics ===== */
  clear(){
    this.term.innerHTML = "";
    this.term.appendChild(this.cursor);
  }

  setStatus(text){
    this.uiStatus.textContent = text;
  }

  setLockedHeader(){
    this.uiBar.textContent = "VAULT 131 DATABASE │ STATUS: LOCKED";
  }

  setUnlockedHeader(user="IZABELLA"){
    this.uiBar.textContent = `VAULT 131 DATABASE │ STATUS: OPERATIONAL │ USER: ${user}`;
  }

  showInput(placeholder=""){
    this.input.style.display = "block";
    this.input.placeholder = placeholder;
    this.input.value = "";
    this.input.focus();
  }

  hideInput(){
    this.input.style.display = "none";
  }

  setHints(hintArr, onHintClick){
    this.hints.innerHTML = "";
    hintArr.forEach((label)=>{
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.onclick = () => onHintClick(label);
      this.hints.appendChild(b);
    });
  }

  clearHints(){
    this.hints.innerHTML = "";
  }

  addButton(text, onClick){
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = text;
    b.onclick = onClick;
    this.term.insertBefore(b, this.cursor);
    this._scrollBottom();
    return b;
  }

  addBigCode(codeText){
    const d = document.createElement("div");
    d.className = "bigCode";
    d.textContent = codeText;
    this.term.insertBefore(d, this.cursor);
    this._scrollBottom();
  }

  _scrollBottom(){
    this.term.scrollTop = this.term.scrollHeight;
  }

  /* ===== typewriter ===== */
  typeLines(lines, speed=35){
    return new Promise((resolve)=>{
      let i = 0;

      const nextLine = () => {
        if(i >= lines.length){ resolve(); return; }

        const lineEl = document.createElement("div");
        this.term.insertBefore(lineEl, this.cursor);

        let j = 0;
        const prePause = (Math.random() < 0.18) ? (180 + Math.random()*240) : 0;

        setTimeout(()=>{
          const tick = () => {
            if(j >= lines[i].length){
              i++;
              setTimeout(nextLine, 260 + Math.random()*120);
              return;
            }
            lineEl.textContent += lines[i][j++];
            this.audio.beep();
            this._scrollBottom();
            setTimeout(tick, speed + Math.random()*25);
          };
          tick();
        }, prePause);
      };

      nextLine();
    });
  }

  /* ===== effects ===== */
  powerDip(){
    return new Promise((resolve)=>{
      this.dip.classList.remove("powerDipOn");
      void this.dip.offsetWidth;
      this.dip.classList.add("powerDipOn");
      this.setStatus("POWER FLUCTUATION… STABILIZING");
      setTimeout(()=>{
        this.setStatus("STABILITY: NOMINAL");
        resolve();
      }, 420);
    });
  }

  loading(loadMsgs, loadDetails){
    return new Promise((resolve)=>{
      this.locked = true;
      this.hideInput();
      this.clearHints();

      this.setStatus("PROCESSING… PLEASE WAIT");

      const track = document.createElement("div");
      const fill = document.createElement("div");
      track.className = "loadTrack";
      fill.className = "loadFill";
      track.appendChild(fill);

      const msg = document.createElement("div");
      msg.className = "loadMsg";

      const detail = document.createElement("div");
      detail.className = "loadDetail";

      this.term.insertBefore(track, this.cursor);
      this.term.insertBefore(msg, this.cursor);
      this.term.insertBefore(detail, this.cursor);

      let p=0, mi=0, di=0;
      msg.textContent = loadMsgs[Math.floor(Math.random()*loadMsgs.length)];
      detail.textContent = loadDetails[Math.floor(Math.random()*loadDetails.length)];

      this.crt.classList.add("radFlicker");

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
        this._scrollBottom();

        if(p>=100){
          clearInterval(t);
          clearInterval(msgI);
          clearInterval(detI);

          setTimeout(()=>{
            track.remove(); msg.remove(); detail.remove();
            this.locked = false;
            this.crt.classList.remove("radFlicker");
            this.setStatus("READY");
            resolve();
          }, 240);
        }
      }, 60);
    });
  }
}