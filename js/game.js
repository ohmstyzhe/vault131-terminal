export class Game {
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    // ====== CONFIG ======
    this.ID = "101-317-76";
    this.NEXT_ID = "14-LOVE-READY";
    this.FINAL_CODE = "531";

    // Admin skip to final success screen
    this.OVERRIDE_ID = "ADMIN-531";

    // ====== STATE ======
    this.stage = "login";
    this.r = 0;
    this.hintUsed = 0;

    // Step 1 countdown updater
    this._countdownTimer = null;

    this.riddles = [
      { q:"I move without legs and follow you everywhere.", a:"shadow",
        h:["You see me when light hits you.","I copy your shape perfectly.","I disappear in darkness."] },
      { q:"The more you take, the more you leave behind.", a:"footsteps",
        h:["You make me without noticing.","I mark where you’ve been.","I vanish if you stop walking."] },
      { q:"I speak without a mouth and hear without ears.", a:"echo",
        h:["I repeat what you say.","I live in empty spaces.","You hear me after you call out."] },
      { q:"I’m always coming, but I never arrive.", a:"tomorrow",
        h:["You can’t hold me in your hands.","I’m always one day away.","It becomes today… then it’s gone."] },
      { q:"I have keys but open no locks. I have space but no room. You can enter, but you can’t go outside. What am I?",
        a:"keyboard",
        h:["Think: terminal.","You’re using me right now.","Keys + space + enter = me."] }
    ];

    this.finalQ = {
      q:"FINAL AUTHORIZATION REQUIRED.\n\nThis number marks the day everything changed.\nWhat is the code?",
      a: this.FINAL_CODE,
      h:["There were flowers.","You went to the beach.","Someone was running late… for a good reason."]
    };

    this.loadMsgs = [
      "ACCESSING VAULT RECORDS…",
      "DECRYPTING MEMORY SECTORS…",
      "VERIFYING EMOTIONAL STABILITY…",
      "CHECKING RADIATION LEVELS…",
      "SYNCING PERSONAL DATA…",
      "VAULT-TEC PROTOCOL ACTIVE…",
      "AUTHORIZATION PENDING…",
      "BUFFERING… PLEASE WAIT…"
    ];

    this.loadDetails = [
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
  }

  start(){ this.boot(); }

  async boot(){
    this._stopCountdown();
    this.stage = "login";
    this.r = 0;
    this.hintUsed = 0;

    this.ui.setHeaderLocked();
    this.ui.setStatus("STANDBY… AWAITING INPUT");
    this.ui.clear();

    await this.ui.type([
      "VAULT 131 DATABASE",
      "SECURITY: ENABLED",
      "ENTER IDENTIFICATION:",
      "> "
    ], 35);

    this.ui.showInput("ENTER ID");
  }

  async showHelp(){
    this.stage = "help";
    this.ui.clear();
    this.ui.setStatus("VAULT-TEC NOTICE");

    await this.ui.type([
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
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async askRiddle(){
    if (this.r >= this.riddles.length) return this.askFinal();

    this.stage = "riddle";
    this.hintUsed = 0;
    this.ui.clear();
    this.ui.setStatus(`TEST MODULE ${this.r+1}/5 LOADED`);

    const current = this.riddles[this.r];

    await this.ui.type([`RIDDLE ${this.r+1}: ${current.q}`, "", "> "], 35);

    this.ui.showInput("TYPE ANSWER");
    this._renderHints(current.h);
    this.ui.setStatus("AWAITING INPUT…");
  }

  async askFinal(){
    this.stage = "final";
    this.hintUsed = 0;
    this.ui.clear();
    this.ui.setStatus("FINAL AUTHORIZATION");

    await this.ui.type([this.finalQ.q, "", "> "], 35);

    this.ui.showInput("ENTER CODE");
    this._renderHints(this.finalQ.h);
    this.ui.setStatus("AWAITING FINAL INPUT…");
  }

  _renderHints(hArr){
    const remaining = hArr.slice(this.hintUsed, this.hintUsed + (3 - this.hintUsed));
    this.ui.showHintButtons(remaining, async (idx) => {
      const realIndex = this.hintUsed + idx;
      const hint = hArr[realIndex];

      this.ui.setStatus("HINT MODULE: ACTIVE");
      await this.ui.type([`HINT: ${hint}`], 30);
      this.ui.setStatus("AWAITING INPUT…");

      this.hintUsed++;
      this._renderHints(hArr);
    });
  }

  /* =========================
     STEP 1: Valentine HUB
     Unlocks when entering NEXT_ID
     ========================= */
  async showValentineHub(){
    this._stopCountdown();
    this.stage = "hub";

    this.ui.setHeaderUnlocked("IZABELLA");
    this.ui.setStatus("VALENTINE MODULE: LOCKED UNTIL 02/14");
    this.ui.clear();
    this.ui.hideInput();
    this.ui.clearHints();

    // Build hub panel
    const hub = document.createElement("div");
    hub.className = "hub";

    const top = document.createElement("div");
    top.className = "hubTop";

    const title = document.createElement("div");
    title.className = "hubTitle";
    title.textContent = "VAULT-TEC STATUS │ VALENTINE ACCESS";

    const cd = document.createElement("div");
    cd.className = "hubCountdown";
    cd.innerHTML = `
      <div>LIVE COUNTDOWN</div>
      <div class="big" id="vdayClock">--:--:--</div>
      <div id="vdaySub">Calculating…</div>
    `;

    top.appendChild(title);
    top.appendChild(cd);

    const body = document.createElement("div");
    body.className = "hubBody";

    const note = document.createElement("div");
    note.className = "smallNote";
    note.textContent =
      "This module remains undiscovered until Valentine’s Day. Explore sub-menus at your own risk.";

    const btns = document.createElement("div");
    btns.className = "hubButtons";

    const b1 = document.createElement("button");
    b1.textContent = "1) COMPLETED";
    b1.disabled = true;

    const b2 = document.createElement("button");
    b2.textContent = "2) VAULT STATS";

    const b3 = document.createElement("button");
    b3.textContent = "3) REWARD QUIZ";

    const b4 = document.createElement("button");
    b4.textContent = "4) MINI GAMES";

    const b5 = document.createElement("button");
    b5.className = "span2";
    b5.textContent = "5) MISSION LOG";

    btns.appendChild(b1);
    btns.appendChild(b2);
    btns.appendChild(b3);
    btns.appendChild(b4);
    btns.appendChild(b5);

    body.appendChild(note);
    body.appendChild(btns);

    hub.appendChild(top);
    hub.appendChild(body);

    this.ui.mount(hub);

    // Wire buttons
    b2.onclick = () => this.showVaultStats();
    b3.onclick = () => this.showRewardQuiz();
    b4.onclick = () => this.showMiniGames();
    b5.onclick = () => this.showMissionLog();

    // Start countdown
    this._startCountdown();
    this.ui.setStatus("VALENTINE HUB ONLINE");
  }

  _startCountdown(){
    const clock = document.getElementById("vdayClock");
    const sub = document.getElementById("vdaySub");
    if (!clock || !sub) return;

    const getTarget = () => {
      const now = new Date();
      const year = now.getFullYear();
      // Feb is month 1 (0-based)
      let target = new Date(year, 1, 14, 0, 0, 0, 0);
      if (now > target) target = new Date(year + 1, 1, 14, 0, 0, 0, 0);
      return target;
    };

    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const now = new Date();
      const target = getTarget();
      let ms = target - now;
      if (ms < 0) ms = 0;

      const s = Math.floor(ms / 1000);
      const days = Math.floor(s / 86400);
      const hrs = Math.floor((s % 86400) / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = Math.floor(s % 60);

      clock.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
      sub.textContent = `${days} DAYS REMAINING`;

      // Optional: when hits 0, you can unlock extra stuff later
      // if (ms === 0) this.ui.setStatus("VALENTINE DAY: ACTIVE");
    };

    tick();
    this._countdownTimer = setInterval(tick, 1000);
  }

  _stopCountdown(){
    if (this._countdownTimer){
      clearInterval(this._countdownTimer);
      this._countdownTimer = null;
    }
  }

  // HUB SUBSCREENS
  async showVaultStats(){
    this._stopCountdown();
    this.stage = "hub_stats";
    this.ui.clear();
    this.ui.setStatus("VAULT STATS");

    await this.ui.type([
      "== VAULT-TEC DIAGNOSTICS ==",
      "",
      "BUILD TIME: 3 DAYS",
      "RIDDLE MODULES: 5",
      "FINAL AUTH: ENABLED",
      "AUDIO SYSTEM: ACTIVE (USER CONTROLLED)",
      "HOVER FX: ENABLED",
      "TYPING FX: ENABLED",
      "",
      "NOTE: Operator Shaun refuses to stop being extra.",
      "",
      "> Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async showRewardQuiz(){
    this._stopCountdown();
    this.stage = "hub_quiz";
    this.ui.clear();
    this.ui.setStatus("REWARD QUIZ");

    await this.ui.type([
      "REWARD QUIZ INITIALIZING…",
      "",
      "Coming next:",
      "- 3 quick questions",
      "- each correct answer = 1 reward token",
      "",
      "I’ll wire the full quiz after you pick the rewards list.",
      "",
      "> Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async showMiniGames(){
    this._stopCountdown();
    this.stage = "hub_games";
    this.ui.clear();
    this.ui.setStatus("MINI GAMES");

    await this.ui.type([
      "MINI GAMES: OFFLINE (FOR NOW)",
      "",
      "Ideas we can add fast:",
      "- 'Hacking' word match (Fallout style)",
      "- Memory sequence (beeps + flashes)",
      "- Tiny riddle sprint for bonus rewards",
      "",
      "> Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async showMissionLog(){
    this._stopCountdown();
    this.stage = "hub_log";
    this.ui.clear();
    this.ui.setStatus("MISSION LOG");

    await this.ui.type([
      "MISSION LOG // VAULT 131",
      "------------------------",
      "",
      "[✓] Secure Access Credentials",
      "[✓] Initialize Test Modules",
      "[✓] Retrieve Case Code",
      "[ ] Activate Valentine Hub",
      "[ ] Complete Mission Objectives",
      "",
      "OPERATOR NOTE:",
      "When you see this, you’ve unlocked something special.",
      "",
      "> Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async showFinalSuccess(){
    this.ui.clear();
    this.ui.setStatus("AUTHORIZATION GRANTED");

    await this.ui.type([
      "AUTHORIZATION GRANTED.",
      "",
      "CASE CODE:",
      ""
    ], 35);

    this.ui.showBigCode(this.FINAL_CODE);

    await new Promise(r => setTimeout(r, 520));

    this.ui.setStatus("POST-AUTH SEQUENCE");
    await this.ui.type([
      "",
      "Use it to open the briefcase on the bed.",
      "",
      "NEXT ACCESS UNLOCKED.",
      `NEW LOGIN CODE: ${this.NEXT_ID}`,
      "",
      "To use it:",
      "1) Reload this page",
      "2) At the ID prompt, enter that code",
      "",
      "Happy Valentine’s Day, Izabella.",
      "I love you so much — I hope you enjoy today."
    ], 32);

    this.ui.addButton("RETURN TO MAIN MENU", () => this.boot());
    this.ui.setStatus("SESSION COMPLETE");
  }

  async handleInput(raw){
    const a = (raw || "").trim().toLowerCase();

    if (a === "help") return this.showHelp();
    if (this.stage === "help") return this.boot();

    // Any hub sub-screen returns to hub on ENTER
    if (this.stage.startsWith("hub_")){
      return this.showValentineHub();
    }

    if (this.stage === "hub"){
      // ENTER also returns to main menu (optional)
      return this.boot();
    }

    if (this.stage === "login"){
      this.ui.setStatus("VALIDATING…");

      if (a === this.OVERRIDE_ID.toLowerCase()){
        this.ui.setHeaderUnlocked("IZABELLA");
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        return this.showFinalSuccess();
      }

      if (a === this.ID.toLowerCase()){
        this.ui.setHeaderUnlocked("IZABELLA");
        this.ui.clear();
        await this.ui.type(["ID VERIFIED.","Welcome, Izabella.","Initializing test modules…"], 35);
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        this.r = 0;
        return this.askRiddle();
      }

      // ✅ STEP 1: NEW HUB UNLOCK
      if (a === this.NEXT_ID.toLowerCase()){
        return this.showValentineHub();
      }

      await this.ui.type(["✖ INVALID ID", "> "], 35);
      this.ui.setStatus("ACCESS DENIED");
      this.ui.showInput("ENTER ID");
      return;
    }

    if (this.stage === "riddle"){
      const current = this.riddles[this.r];
      if (a === current.a.toLowerCase()){
        this.ui.setStatus("ANSWER ACCEPTED");
        await this.ui.type(["✔ CORRECT."], 30);
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        this.r++;
        return this.askRiddle();
      } else {
        this.ui.setStatus("ANSWER REJECTED");
        await this.ui.type(["✖ TRY AGAIN", "> "], 30);
        this.ui.showInput("TYPE ANSWER");
        this._renderHints(current.h);
        this.ui.setStatus("AWAITING INPUT…");
        return;
      }
    }

    if (this.stage === "final"){
      if (raw === this.finalQ.a){
        this.ui.setStatus("CODE ACCEPTED");
        await this.ui.type(["✔ AUTHORIZED."], 30);
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        return this.showFinalSuccess();
      } else {
        this.ui.setStatus("CODE INVALID");
        await this.ui.type(["✖ INCORRECT CODE", "> "], 30);
        this.ui.showInput("ENTER CODE");
        this._renderHints(this.finalQ.h);
        this.ui.setStatus("AWAITING FINAL INPUT…");
        return;
      }
    }
  }
}