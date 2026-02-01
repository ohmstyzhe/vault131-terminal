export class Game {
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    // CHANGE THIS to your 8-digit Vault ID
    this.VALID_ID = "13113100"; // <-- edit me

    this.state = "LOCK"; // LOCK | MENU | VAL | REWARD | STATS | MINI
    this.timer = null;
  }

  start(){
    this.showLock();
  }

  // ===== SCREENS =====

  showLock(){
    this.state = "LOCK";
    this.stopTimer();

    this.ui.setHeader("VAULT 131 DATABASE | STATUS: LOCKED");
    this.ui.setStatus("STANDBY… AWAITING INPUT");
    this.ui.clear();

    this.ui.html(`
      <div class="block">
        <div class="lockTitle">VAULT 131 DATABASE</div>
        <div class="hr"></div>
        <div class="lockLines">SECURITY: ENABLED
ENTER IDENTIFICATION:</div>
      </div>
    `);

    this.ui.showInput("ENTER ID");
  }

  showMenu(){
    this.state = "MENU";
    this.stopTimer();

    this.ui.setHeader("VAULT 131 DATABASE | STATUS: OPERATIONAL | USER: IZABELLA");
    this.ui.setStatus("VALENTINE ACCESS: ACTIVE");
    this.ui.clear();
    this.ui.hideInput();

    this.ui.html(`
      <div class="block">
        <div class="smallHdr">MAIN MENU</div>
        <div class="hr"></div>
        <div class="menuWrap">
          <button data-action="val">1) VALENTINE MODULE</button>
          <button data-action="stats">2) VAULT STATS</button>
          <button data-action="reward">3) REWARD QUIZ</button>
          <button data-action="mini">4) MINI GAMES</button>
          <button data-action="lock">5) LOCK TERMINAL</button>
        </div>
      </div>
    `);
  }

  showValentine(){
    this.state = "VAL";
    this.ui.setHeader("VAULT 131 DATABASE | STATUS: OPERATIONAL | USER: IZABELLA");
    this.ui.setStatus("VALENTINE ACCESS: ACTIVE");
    this.ui.hideInput();

    // build base UI (logo only exists here)
    this.ui.html(`
      <div class="valHub">
        <div class="valBg"></div>

        <div class="block">
          <div class="smallHdr">VAULT-TEC STATUS | VALENTINE ACCESS</div>
          <div class="hr"></div>
          <div class="valRow">
            <div class="block" style="margin:0;">
              <div class="smallHdr">COUNTDOWN</div>
              <div class="valBig" id="dLeft">-- DAYS</div>
              <div class="valSmall" id="tLeft">--:--:--</div>
            </div>
            <div class="block" style="margin:0;">
              <div class="smallHdr">COUNTDOWN TARGET</div>
              <div class="valSmall">02/14/2026 00:00</div>
              <div class="valSmall" style="opacity:.75;margin-top:6px;">Local time</div>
            </div>
          </div>
        </div>

        <div class="block">
          <div class="valSmall">This module is live.<br/>
          Countdown is active until Valentine’s Day.<br/>
          (Yes, this is extremely official.)</div>
        </div>

        <div class="block">
          <button data-action="menu">← RETURN TO MAIN MENU</button>
        </div>
      </div>
    `);

    this.startCountdown();
  }

  showPlaceholder(title){
    this.stopTimer();
    this.ui.hideInput();

    this.ui.html(`
      <div class="block">
        <div class="smallHdr">${title}</div>
        <div class="hr"></div>
        <div style="white-space:pre-wrap; line-height:1.4; font-size:16px; letter-spacing:0.6px;">
${title} MODULE LOADED
This will be built next.
Press RETURN to go back.
        </div>
      </div>
      <div class="block">
        <button data-action="menu">← RETURN TO MAIN MENU</button>
      </div>
    `);
  }

  // ===== INPUT HANDLERS =====

  handleSubmit(value){
    if(this.state !== "LOCK") return;

    const cleaned = value.replace(/\s+/g, "");

    if(cleaned === this.VALID_ID){
      this.ui.dip();
      this.showMenu();
      return;
    }

    // wrong ID: stay on lock screen + small hint
    this.ui.dip();
    this.ui.setStatus("ACCESS DENIED — TRY AGAIN");
  }

  handleClick(action){
    if(action === "lock"){
      this.showLock();
      return;
    }
    if(action === "menu"){
      this.showMenu();
      return;
    }

    // menu routes
    if(this.state === "MENU"){
      if(action === "val") return this.showValentine();
      if(action === "stats") return this.showPlaceholder("VAULT STATS");
      if(action === "reward") return this.showPlaceholder("REWARD QUIZ");
      if(action === "mini") return this.showPlaceholder("MINI GAMES");
    }

    // allow returning from other screens
    if(action === "val") return this.showValentine();
    if(action === "stats") return this.showPlaceholder("VAULT STATS");
    if(action === "reward") return this.showPlaceholder("REWARD QUIZ");
    if(action === "mini") return this.showPlaceholder("MINI GAMES");
  }

  // ===== COUNTDOWN =====

  startCountdown(){
    this.stopTimer();

    const target = new Date(2026, 1, 14, 0, 0, 0); // Feb(1) 14 2026 00:00 local
    const dEl = document.getElementById("dLeft");
    const tEl = document.getElementById("tLeft");

    const tick = () => {
      const now = new Date();
      let ms = target - now;
      if(ms < 0) ms = 0;

      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const rem = totalSeconds % 86400;

      const hrs = Math.floor(rem / 3600);
      const mins = Math.floor((rem % 3600) / 60);
      const secs = rem % 60;

      const pad = (n) => String(n).padStart(2, "0");

      if(dEl) dEl.textContent = `${days} DAYS`;
      if(tEl) tEl.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    tick();
    this.timer = setInterval(tick, 1000);
  }

  stopTimer(){
    if(this.timer){
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}