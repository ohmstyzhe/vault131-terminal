export class Game {
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    // ====== CONFIG ======
    this.ID = "101-317-76";
    this.NEXT_ID = "14-LOVE-READY";
    this.FINAL_CODE = "531";

    // admin skip (change anytime)
    this.OVERRIDE_ID = "ADMIN-531";

    // ====== CONTENT ======
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

    // ====== STATE ======
    this.stage = "login";
    this.r = 0;
    this.hintUsed = 0;

    // live countdown updater
    this._countdownTimer = null;
  }

  start(){
    this.boot();
  }

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
    if (this.r >= this.riddles.length){
      return this.askFinal();
    }

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

  async showFinalSuccess(){
    this._stopCountdown();

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

  /* ===== Step 1 hub ===== */
  _nextValentinesDate(){
    // Next Feb 14 (local time)
    const now = new Date();
    const year = now.getFullYear();
    let target = new Date(year, 1, 14, 0, 0, 0); // Feb = 1
    if (now > target) target = new Date(year + 1, 1, 14, 0, 0, 0);
    return target;
  }

  _format2(n){ return String(n).padStart(2, "0"); }

  _countdownModel(){
    const now = new Date();
    const target = this._nextValentinesDate();
    let diff = Math.max(0, target.getTime() - now.getTime());

    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);

    const hrs = Math.floor(diff / (1000*60*60));
    diff -= hrs * (1000*60*60);

    const mins = Math.floor(diff / (1000*60));
    diff -= mins * (1000*60);

    const secs = Math.floor(diff / 1000);

    return {
      days,
      timeText: `${this._format2(hrs)}:${this._format2(mins)}:${this._format2(secs)}`,
      targetText: `FEB 14, ${target.getFullYear()} (LOCAL TIME)`
    };
  }

  _startCountdownRerender(){
    this._stopCountdown();
    this._countdownTimer = setInterval(() => {
      if (this.stage !== "valentine") return;
      const model = this._countdownModel();
      // Re-render hub so the numbers tick live
      this.ui.showValentineHub(model, this._hubHandlers());
    }, 1000);
  }

  _stopCountdown(){
    if (this._countdownTimer){
      clearInterval(this._countdownTimer);
      this._countdownTimer = null;
    }
  }

  _hubHandlers(){
    return {
      onStats: () => this.showVaultStats(),
      onQuiz: () => this.showRewardQuiz(),
      onMiniGames: () => this.showMiniGames(),
      onMissionLog: () => this.showMissionLog(),
    };
  }

  async showValentineHub(){
    this.stage = "valentine";
    this.ui.setHeaderUnlocked("IZABELLA");
    this.ui.setStatus("VALENTINE ACCESS: ACTIVE");

    const model = this._countdownModel();
    this.ui.showValentineHub(model, this._hubHandlers());
    this._startCountdownRerender();
  }

  async showVaultStats(){
    this._stopCountdown();
    this.stage = "subpage";
    this.ui.clear();
    this.ui.setStatus("VAULT STATS");

    await this.ui.type([
      "VAULT-TEC DIAGNOSTICS REPORT",
      "----------------------------",
      "",
      "BUILD TIME: 3 DAYS",
      "LINES OF ROMANCE: HIGH",
      "SYSTEM INTEGRITY: 100%",
      "RISK LEVEL: ACCEPTABLE (PROBABLY)",
      "",
      "NOTE:",
      "This system was built to ask one very important question.",
      "",
    ], 28);

    this.ui.addButton("BACK", () => this.showValentineHub());
  }

  async showRewardQuiz(){
    this._stopCountdown();
    this.stage = "subpage";
    this.ui.clear();
    this.ui.setStatus("REWARD QUIZ");

    await this.ui.type([
      "REWARD QUIZ LOADED.",
      "",
      "This section can be expanded next:",
      "- 3 questions",
      "- each correct answer grants a reward",
      "",
      "(We can build this right after the hub is stable.)",
      ""
    ], 28);

    this.ui.addButton("BACK", () => this.showValentineHub());
  }

  async showMiniGames(){
    this._stopCountdown();
    this.stage = "subpage";
    this.ui.clear();
    this.ui.setStatus("MINI GAMES");

    await this.ui.type([
      "MINI GAMES MODULE",
      "-----------------",
      "",
      "Ideas we can add:",
      "- 'Hack the Terminal' (guess the word)",
      "- 'Memory Match' (tiny sequence game)",
      "- 'Vault Lottery' (random cute reward)",
      ""
    ], 28);

    this.ui.addButton("BACK", () => this.showValentineHub());
  }

  async showMissionLog(){
    this._stopCountdown();
    this.stage = "subpage";
    this.ui.clear();
    this.ui.setStatus("MISSION LOG");

    await this.ui.type([
      "MISSION LOG // VAULT 131",
      "------------------------",
      "",
      "• OBJECTIVE: Secure Valentine (Primary)",
      "• METHOD: Excessive effort (Approved)",
      "• STATUS: In progress…",
      "",
      "We can make this a multi-page 'terminal' log next.",
      ""
    ], 28);

    this.ui.addButton("BACK", () => this.showValentineHub());
  }

  /* ===== Input router ===== */
  async handleInput(raw){
    const a = (raw || "").trim().toLowerCase();

    if (a === "help") return this.showHelp();
    if (this.stage === "help") return this.boot();

    if (this.stage === "login"){
      this.ui.setStatus("VALIDATING…");

      // admin skip
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

      // ✅ Step 1 entry point (your “Ask her to be my valentine” hub)
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