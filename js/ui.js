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

    this._countdownStop = null;

    this._bindAudioButton();
    this._bindInput();
    this._bindButtonHoverSounds();
  }

  /* ========= AUDIO BTN ========= */
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

  /* ========= INPUT ========= */
  _bindInput(){
    this.input.addEventListener("keydown", (e) => {
      // sound per keystroke (not Enter)
      if (e.key && e.key.length === 1) this.audio.typeBeep?.();

      if (e.key !== "Enter") return;
      if (this.locked) return;

      const raw = this.input.value.trim();
      this.input.value = "";
      this.hideInput();
      this.clearHints();

      if (this.onSubmit) this.onSubmit(raw);
    });
  }

  /* ========= HOVER BEEPS ========= */
  _bindButtonHoverSounds(){
    const fire = (el) => {
      if (!el) return;
      if (el.disabled) return;
      this.audio.hoverBeep?.();
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

  /* ========= BASIC UI ========= */
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
    this._stopCountdown();
    this.term.innerHTML = "";
    this.term.appendChild(this.cursor);
  }

  showInput(placeholder=""){
    this._stopCountdown();
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

  /* ========= TYPEWRITER ========= */
  type(lines, speed=35){
    this._stopCountdown();
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
            this.audio.beep?.(880, 0.02, 0.018);
            this.term.scrollTop = this.term.scrollHeight;
            setTimeout(tick, speed + Math.random()*25);
          };
          tick();
        }, prePause);
      };
      nextLine();
    });
  }

  /* ========= POWER DIP + LOADING ========= */
  powerDip(){
    this._stopCountdown();
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
    this._stopCountdown();
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
    this._stopCountdown();
    const big = document.createElement("div");
    big.className="bigCode";
    big.textContent = code;
    this.term.insertBefore(big, this.cursor);
    this.term.scrollTop = this.term.scrollHeight;
  }

  addButton(label, onClick, opts={}){
    const btn = document.createElement("button");
    btn.textContent = label;
    if (opts.disabled) btn.disabled = true;
    btn.onclick = onClick;
    this.term.insertBefore(btn, this.cursor);
    this.term.scrollTop = this.term.scrollHeight;
    return btn;
  }

  /* ==========================
     PIP-BOY VALENTINE HUB (Step 1)
     ========================== */

  showValentineHub({
    userName="IZABELLA",
    targetDate,         // Date object
    statsText="BUILD STATS: 3 DAYS • 1 TERMINAL • 999 HEARTBEATS",
    onTab = () => {}
  } = {}){
    this._stopCountdown();
    this.hideInput();
    this.clearHints();

    // Clear terminal area and render a full “hub”
    this.term.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "pipWrap";

    // Top
    const top = document.createElement("div");
    top.className = "pipTopBar";

    const leftStats = document.createElement("div");
    leftStats.className = "pipStats";
    leftStats.innerHTML = `
      <div class="pipStatBox"><span class="pipLabel">LVL</span> <span class="pipValue">14</span></div>
      <div class="pipStatBox"><span class="pipLabel">HP</span> <span class="pipValue">LOVE/LOVE</span></div>
      <div class="pipStatBox"><span class="pipLabel">AP</span> <span class="pipValue">MAX</span></div>
      <div class="pipStatBox"><span class="pipLabel">XP</span> <span class="pipValue">MAX</span></div>
    `;

    const rightBadge = document.createElement("div");
    rightBadge.className = "pipBadge";
    rightBadge.textContent = `USER: ${userName}`;

    top.appendChild(leftStats);
    top.appendChild(rightBadge);

    // Main panels
    const main = document.createElement("div");
    main.className = "pipMain";

    const left = document.createElement("div");
    left.className = "pipLeft";

    const seal = document.createElement("div");
    seal.className = "vaultSeal";
    seal.innerHTML = `
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(76,255,154,0.55)" stroke-width="6"/>
        <circle cx="100" cy="100" r="52" fill="none" stroke="rgba(76,255,154,0.35)" stroke-width="6"/>
        <path d="M45 108c18 22 40 33 55 33s37-11 55-33" fill="none" stroke="rgba(76,255,154,0.55)" stroke-width="6" stroke-linecap="round"/>
        <path d="M60 80c10-10 23-15 40-15s30 5 40 15" fill="none" stroke="rgba(76,255,154,0.35)" stroke-width="6" stroke-linecap="round"/>
      </svg>
    `;

    const title = document.createElement("div");
    title.className = "pipTitle";
    title.textContent = "LIVE VALENTINE’S COUNTDOWN";

    const countdown = document.createElement("div");
    countdown.className = "pipCountdown";
    countdown.textContent = "LOADING…";

    const sub = document.createElement("div");
    sub.className = "pipSub";
    sub.textContent = statsText;

    left.appendChild(seal);
    left.appendChild(title);
    left.appendChild(countdown);
    left.appendChild(sub);

    const right = document.createElement("div");
    right.className = "pipRight";

    const rt = document.createElement("div");
    rt.className = "pipPanelTitle";
    rt.textContent = "TERMINAL MENU";

    // Tabs / Buttons (5)
    const tabs = document.createElement("div");
    tabs.className = "pipTabs";

    const b1 = document.createElement("button");
    b1.textContent = "COMPLETED";
    b1.disabled = true;

    const b2 = document.createElement("button");
    b2.textContent = "STATS";
    b2.onclick = () => onTab("stats");

    const b3 = document.createElement("button");
    b3.textContent = "QUIZ";
    b3.onclick = () => onTab("quiz");

    const b4 = document.createElement("button");
    b4.textContent = "MINI-GAMES";
    b4.onclick = () => onTab("games");

    const b5 = document.createElement("button");
    b5.textContent = "MISSION LOG";
    b5.onclick = () => onTab("missions");

    tabs.appendChild(b1);
    tabs.appendChild(b2);
    tabs.appendChild(b3);
    tabs.appendChild(b4);
    tabs.appendChild(b5);

    const info = document.createElement("div");
    info.style.fontSize = "12px";
    info.style.letterSpacing = "1px";
    info.style.opacity = "0.9";
    info.textContent = "STATUS: UNDISCOVERED (until login code verified)";

    right.appendChild(rt);
    right.appendChild(info);
    right.appendChild(tabs);

    main.appendChild(left);
    main.appendChild(right);

    wrap.appendChild(top);
    wrap.appendChild(main);

    this.term.appendChild(wrap);

    // Start countdown loop
    this._countdownStop = this._startCountdown(countdown, targetDate);
  }

  _startCountdown(el, targetDate){
    if (!(targetDate instanceof Date)) {
      el.textContent = "INVALID TARGET DATE";
      return () => {};
    }

    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const now = new Date();
      let diff = targetDate.getTime() - now.getTime();
      if (diff < 0) diff = 0;

      const s = Math.floor(diff / 1000);
      const days = Math.floor(s / 86400);
      const hrs = Math.floor((s % 86400) / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = s % 60;

      el.textContent = `${days}D ${pad(hrs)}H ${pad(mins)}M ${pad(secs)}S`;
    };

    tick();
    const id = setInterval(tick, 1000);

    return () => clearInterval(id);
  }

  _stopCountdown(){
    if (this._countdownStop){
      this._countdownStop();
      this._countdownStop = null;
    }
  }
}