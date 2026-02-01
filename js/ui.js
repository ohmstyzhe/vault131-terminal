export class UI {
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

    this.onSubmit = null;
    this.locked = false;

    this.cursor = document.createElement("span");
    this.cursor.id = "cursor";
    this.term.appendChild(this.cursor);

    this._bindAudioButton();
    this._bindInput();
    this._bindButtonHoverSounds();
  }

  _bindAudioButton(){
    this._updateVolBtn();
    this.volBtn.addEventListener("click", () => {
      const on = this.audio.toggle();
      this._updateVolBtn();
      this.setStatus(on ? "AUDIO ENABLED" : "AUDIO MUTED");
    });
  }

  _updateVolBtn(){
    this.volBtn.textContent = this.audio.audioOn ? "AUDIO: ON" : "AUDIO: OFF";
    this.volBtn.classList.toggle("on", this.audio.audioOn);
  }

  _bindInput(){
    this.input.addEventListener("keydown", (e) => {
      if (e.key && e.key.length === 1) this.audio.typeBeep();

      if (e.key !== "Enter") return;
      if (this.locked) return;

      const raw = this.input.value.trim();
      this.input.value = "";
      this.hideInput();
      this.clearHints();

      if (this.onSubmit) this.onSubmit(raw);
    });
  }

  _bindButtonHoverSounds(){
    const fire = (el) => {
      if (!el || el.disabled) return;
      this.audio.hoverBeep();
    };

    this.crt.addEventListener("mouseover", (e) => {
      const btn = e.target.closest("button");
      if (btn) fire(btn);
    });

    this.crt.addEventListener("touchstart", (e) => {
      const btn = e.target.closest("button");
      if (btn) fire(btn);
    }, { passive:true });
  }

  /* ===== basic UI helpers ===== */
  setHeaderLocked(){
    this.uiBar.textContent = "VAULT 131 DATABASE │ STATUS: LOCKED";
  }
  setHeaderUnlocked(user="IZABELLA"){
    this.uiBar.textContent = `VAULT 131 DATABASE │ STATUS: OPERATIONAL │ USER: ${user}`;
  }
  setStatus(text){
    this.uiStatus.textContent = text;
  }

  clear(){
    this.term.innerHTML = "";
    this.term.appendChild(this.cursor);
  }

  showInput(placeholder=""){
    this.input.style.display = "block";
    this.input.placeholder = placeholder;
    this.input.focus();
  }
  hideInput(){
    this.input.style.display = "none";
  }

  clearHints(){
    this.hints.innerHTML = "";
  }

  showHintButtons(hintsArr, onHint){
    this.clearHints();
    hintsArr.forEach((_, idx) => {
      const b = document.createElement("button");
      b.textContent = `HINT ${idx + 1}`;
      b.onclick = () => onHint(idx);
      this.hints.appendChild(b);
    });
  }

  /* ===== typewriter ===== */
  type(lines, speed=35){
    return new Promise((resolve) => {
      let i=0;
      const nextLine = () => {
        if (i >= lines.length) return resolve();
        const d = document.createElement("div");
        this.term.insertBefore(d, this.cursor);

        let j=0;
        const prePause = (Math.random() < 0.18) ? (180 + Math.random()*240) : 0;

        setTimeout(() => {
          const tick = () => {
            if (j >= lines[i].length){
              i++;
              this.term.scrollTop = this.term.scrollHeight;
              setTimeout(nextLine, 260 + Math.random()*120);
              return;
            }
            d.textContent += lines[i][j++];
            this.audio.beep(880, 0.03, 0.02);
            this.term.scrollTop = this.term.scrollHeight;
            setTimeout(tick, speed + Math.random()*25);
          };
          tick();
        }, prePause);
      };
      nextLine();
    });
  }

  /* ===== power dip + loading ===== */
  powerDip(){
    return new Promise((resolve) => {
      this.dip.classList.remove("powerDipOn");
      void this.dip.offsetWidth;
      this.dip.classList.add("powerDipOn");

      this.setStatus("POWER FLUCTUATION… STABILIZING");
      setTimeout(() => {
        this.setStatus("STABILITY: NOMINAL");
        resolve();
      }, 420);
    });
  }

  loading(loadMsgs, loadDetails){
    return new Promise((resolve) => {
      this.locked = true;
      this.hideInput();
      this.clearHints();
      this.setStatus("PROCESSING… PLEASE WAIT");

      const track = document.createElement("div");
      const fill = document.createElement("div");
      track.className="loadTrack";
      fill.className="loadFill";
      track.appendChild(fill);

      const msg = document.createElement("div");
      msg.className="loadMsg";

      const detail = document.createElement("div");
      detail.className="loadDetail";

      this.term.insertBefore(track, this.cursor);
      this.term.insertBefore(msg, this.cursor);
      this.term.insertBefore(detail, this.cursor);

      this.crt.classList.add("radFlicker");

      let p=0, mi=0, di=0;
      msg.textContent = loadMsgs[Math.floor(Math.random()*loadMsgs.length)];
      detail.textContent = loadDetails[Math.floor(Math.random()*loadDetails.length)];

      const msgI = setInterval(()=> msg.textContent = loadMsgs[mi++ % loadMsgs.length], 650);
      const detI = setInterval(()=> detail.textContent = loadDetails[di++ % loadDetails.length], 520);

      const t = setInterval(()=>{
        p += 2 + Math.floor(Math.random()*6);
        if(p>100) p=100;
        fill.style.width = p + "%";
        this.term.scrollTop = this.term.scrollHeight;

        if(p>=100){
          clearInterval(t); clearInterval(msgI); clearInterval(detI);

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

  showBigCode(code){
    const big = document.createElement("div");
    big.className="bigCode";
    big.textContent = code;
    this.term.insertBefore(big, this.cursor);
    this.term.scrollTop = this.term.scrollHeight;
  }

  addButton(label, onClick, opts={}){
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.onclick = onClick;
    if (opts.disabled) btn.disabled = true;
    this.term.insertBefore(btn, this.cursor);
    this.term.scrollTop = this.term.scrollHeight;
    return btn;
  }

  /* ===== Step 1 hub renderer ===== */
  showValentineHub(model, handlers){
    this.clear();
    this.hideInput();
    this.clearHints();

    const wrap = document.createElement("div");
    wrap.className = "valHub";

    const bg = document.createElement("div");
    bg.className = "valBg";
    wrap.appendChild(bg);

    const top = document.createElement("div");
    top.className = "valTopRow";

    const left = document.createElement("div");
    left.className = "valBlock";

    const title = document.createElement("div");
    title.className = "valTitle";
    title.textContent = "VAULT-TEC STATUS | VALENTINE ACCESS";
    left.appendChild(title);

    const cd = document.createElement("div");
    cd.className = "valCountdown";

    const big = document.createElement("div");
    big.className = "valBig";
    big.textContent = model.days + " DAYS";
    cd.appendChild(big);

    const small = document.createElement("div");
    small.className = "valSmall";
    small.textContent = model.timeText; // HH:MM:SS
    cd.appendChild(small);

    left.appendChild(cd);

    const right = document.createElement("div");
    right.className = "valBlock";

    const rtitle = document.createElement("div");
    rtitle.className = "valTitle";
    rtitle.textContent = "COUNTDOWN TARGET";
    right.appendChild(rtitle);

    const rsmall = document.createElement("div");
    rsmall.className = "valSmall";
    rsmall.textContent = model.targetText;
    right.appendChild(rsmall);

    top.appendChild(left);
    top.appendChild(right);

    const note = document.createElement("div");
    note.className = "valNote";
    note.textContent =
      "This module has been unlocked. Choose a menu option below. (Yes, this is extremely official.)";

    const menu = document.createElement("div");
    menu.className = "valMenu";

    const b1 = document.createElement("button");
    b1.textContent = "1) COMPLETED";
    b1.disabled = true;

    const b2 = document.createElement("button");
    b2.textContent = "2) VAULT STATS";
    b2.onclick = handlers.onStats;

    const b3 = document.createElement("button");
    b3.textContent = "3) REWARD QUIZ";
    b3.onclick = handlers.onQuiz;

    const b4 = document.createElement("button");
    b4.textContent = "4) MINI GAMES";
    b4.onclick = handlers.onMiniGames;

    const b5 = document.createElement("button");
    b5.textContent = "5) MISSION LOG";
    b5.onclick = handlers.onMissionLog;

    menu.append(b1,b2,b3,b4,b5);

    wrap.appendChild(top);
    wrap.appendChild(note);
    wrap.appendChild(menu);

    this.term.insertBefore(wrap, this.cursor);
    this.term.scrollTop = 0;
  }
}