export class Game {
  // =========================
  // CONSTRUCTOR START
  // =========================
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    // ====== CODES START ======
    this.ID = "101-317-76";        // riddle login
    this.NEXT_ID = "14-LOVE-READY"; // unlocks Valentine Hub
    this.FINAL_CODE = "531";        // briefcase code
    // ====== CODES END ======

    // ====== RIDDLES DATA START ======
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
    // ====== RIDDLES DATA END ======

    // ====== FINAL QUESTION START ======
    this.finalQ = {
      q:"FINAL AUTHORIZATION REQUIRED.\n\nThis number marks the day everything changed.\nWhat is the code?",
      a: this.FINAL_CODE,
      h:["There were flowers.","You went to the beach.","Someone was running late… for a good reason."]
    };
    // ====== FINAL QUESTION END ======

    // ====== LOADING TEXT START ======
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
    // ====== LOADING TEXT END ======

    // ====== STATE START ======
    this.stage = "login"; // login | riddle | final | done | hub
    this.r = 0;
    this.hintUsed = 0;

    this.timer = null;

    // UI actions (for hub buttons)
    this.ui.onAction = (action) => this.handleAction(action);
    // ====== STATE END ======
  }
  // =========================
  // CONSTRUCTOR END
  // =========================


  // =========================
  // START START
  // =========================
  start(){
    this.boot();
  }
  // =========================
  // START END
  // =========================


  // =========================
  // BOOT / LOGIN SCREEN START
  // =========================
  async boot(){
    this.stopCountdown();

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
  // =========================
  // BOOT / LOGIN SCREEN END
  // =========================


  // =========================
  // HELP SCREEN START
  // =========================
  async showHelp(){
    this.stopCountdown();
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
  // =========================
  // HELP SCREEN END
  // =========================


  // =========================
  // RIDDLES FLOW START
  // =========================
  async askRiddle(){
    this.stopCountdown();

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
    this.renderHints(current.h);
    this.ui.setStatus("AWAITING INPUT…");
  }

  async askFinal(){
    this.stopCountdown();

    this.stage = "final";
    this.hintUsed = 0;
    this.ui.clear();
    this.ui.setStatus("FINAL AUTHORIZATION");

    await this.ui.type([this.finalQ.q, "", "> "], 35);

    this.ui.showInput("ENTER CODE");
    this.renderHints(this.finalQ.h);
    this.ui.setStatus("AWAITING FINAL INPUT…");
  }

  renderHints(hArr){
    const remaining = hArr.slice(this.hintUsed, 3);
    this.ui.showHintButtons(remaining, async (idx) => {
      const realIndex = this.hintUsed + idx;
      const hint = hArr[realIndex];

      this.ui.setStatus("HINT MODULE: ACTIVE");
      await this.ui.type([`HINT: ${hint}`], 30);
      this.ui.setStatus("AWAITING INPUT…");

      this.hintUsed++;
      this.renderHints(hArr);
    });
  }
  // =========================
  // RIDDLES FLOW END
  // =========================


  // =========================
  // FINAL SUCCESS SCREEN START
  // =========================
  async showFinalSuccess(){
    this.stopCountdown();

    this.stage = "done";
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
  // =========================
  // FINAL SUCCESS SCREEN END
  // =========================


  // ==========================================================
  // VALENTINE HUB (GLIDER STYLE) START
  // NOTE: ONLY THIS SECTION IS “CHANGED UI”
  // ==========================================================
  showValentineHub(){
    this.stage = "hub";
    this.ui.setHeaderUnlocked("IZABELLA");
    this.ui.setStatus("VALENTINE HUB: ONLINE");
    this.ui.clear();
    this.ui.hideInput();
    this.ui.clearHints();

    // Glider-style layout (no images, only code + symbols)
    this.ui.html(`
      <div class="valHub gliderHud">

        <div class="gliderBar">
          <div class="gliderBarInner">
            <div class="gliderTitle">*** GLIDER OPERATING SYSTEM ***</div>
            <div class="gliderSub">128k RAM - 83259 Bytes Free</div>
          </div>
          <div class="gliderSpeaker" aria-hidden="true"></div>
        </div>

        <div class="gliderNavRow">
          <button class="navIcon" data-action="hub_stats">
            <span class="planet p1" aria-hidden="true"></span>
            <span class="label">SysInfo</span>
          </button>

          <button class="navIcon" data-action="hub_rewards">
            <span class="planet p2" aria-hidden="true"></span>
            <span class="label">Rewards</span>
          </button>

          <button class="navIcon" data-action="hub_minigames">
            <span class="planet p3" aria-hidden="true"></span>
            <span class="label">G.A.M.E</span>
          </button>

          <button class="navIcon" data-action="hub_mission">
            <span class="planet p4" aria-hidden="true"></span>
            <span class="label">Mission</span>
          </button>
        </div>

        <div class="gliderMain">
          <div class="gliderPanel">
            <div class="panelHdr">COUNTDOWN</div>
            <div class="panelBig" id="vDays">-- DAYS</div>
            <div class="panelSmall" id="vTime">--:--:--</div>
          </div>

          <div class="gliderPanel">
            <div class="panelHdr">TARGET</div>
            <div class="panelSmall">02/14/2026 00:00</div>
            <div class="panelSmall dim">Local time</div>
          </div>
        </div>

        <div class="gliderNote">
          This hub is live now — it’s counting down to Valentine’s Day.<br/>
          (Yes, this is extremely official.)
        </div>

        <div class="gliderModules">
          <div class="modulesHdr">MODULES</div>
          <div class="modulesGrid">
            <button data-action="hub_completed" disabled>1) COMPLETED</button>
            <button data-action="hub_stats">2) VAULT STATS</button>
            <button data-action="hub_rewards">3) REWARDS / QUIZ</button>
            <button data-action="hub_minigames">4) MINI GAMES</button>
            <button data-action="hub_mission">5) MISSION LOG</button>
          </div>
        </div>

        <div class="gliderBack">
          <button data-action="hub_back">← RETURN TO ID TERMINAL</button>
        </div>

      </div>
    `);

    this.startCountdown();
  }

  startCountdown(){
    this.stopCountdown();

    const target = new Date(2026, 1, 14, 0, 0, 0); // Feb 14 2026 00:00 local
    const dEl = document.getElementById("vDays");
    const tEl = document.getElementById("vTime");

    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const now = new Date();
      let ms = target - now;
      if (ms < 0) ms = 0;

      const totalSeconds = Math.floor(ms / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const rem = totalSeconds % 86400;

      const hrs = Math.floor(rem / 3600);
      const mins = Math.floor((rem % 3600) / 60);
      const secs = rem % 60;

      if (dEl) dEl.textContent = `${days} DAYS`;
      if (tEl) tEl.textContent = `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    tick();
    this.timer = setInterval(tick, 1000);
  }

  stopCountdown(){
    if (this.timer){
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  // ==========================================================
  // VALENTINE HUB (GLIDER STYLE) END
  // ==========================================================


  // =========================
  // HUB BUTTON ACTIONS START
  // NOTE: Behavior unchanged, just supports the new glider buttons too.
  // =========================
  handleAction(action){
    // Return to login terminal
    if (action === "hub_back") return this.boot();

    // Vault stats screen
    if (action === "hub_stats"){
      this.ui.setStatus("VAULT STATS: LOADING");
      this.ui.clear();
      this.ui.hideInput();
      this.ui.html(`
        <div class="block">
          <div class="valSmall" style="text-transform:uppercase; letter-spacing:1px;">VAULT STATS</div>
          <div style="margin-top:10px; line-height:1.35;">
            BUILD TIME: <b>3 DAYS</b><br/>
            MODULES: <b>TERMINAL + HUB</b><br/>
            AUDIO: <b>OPTIONAL</b><br/>
            USER: <b>IZABELLA</b><br/>
          </div>
        </div>
        <div class="block">
          <button data-action="hub_return">← BACK TO HUB</button>
        </div>
      `);
      return;
    }

    // Return back to hub
    if (action === "hub_return"){
      return this.showValentineHub();
    }

    // Placeholder modules
    if (action === "hub_rewards" || action === "hub_minigames" || action === "hub_mission"){
      this.ui.setStatus("MODULE: UNDER CONSTRUCTION");
      this.ui.clear();
      this.ui.hideInput();
      this.ui.html(`
        <div class="block">
          <div class="valSmall" style="text-transform:uppercase; letter-spacing:1px;">MODULE LOADED</div>
          <div style="margin-top:10px; line-height:1.35; opacity:.9;">
            This module is next.<br/>
            (We’ll build it clean, no random changes.)
          </div>
        </div>
        <div class="block">
          <button data-action="hub_return">← BACK TO HUB</button>
        </div>
      `);
      return;
    }
  }
  // =========================
  // HUB BUTTON ACTIONS END
  // =========================


  // =========================
  // INPUT HANDLER START
  // =========================
  async handleInput(raw){
    const a = (raw || "").trim().toLowerCase();

    if (a === "help") return this.showHelp();
    if (this.stage === "help") return this.boot();

    if (this.stage === "login"){
      this.ui.setStatus("VALIDATING…");

      if (a === this.ID.toLowerCase()){
        this.ui.setHeaderUnlocked("IZABELLA");
        this.ui.clear();
        await this.ui.type(["ID VERIFIED.","Welcome, Izabella.","Initializing test modules…"], 35);
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        this.r = 0;
        return this.askRiddle();
      }

      if (a === this.NEXT_ID.toLowerCase()){
        // This is your Valentine Hub ONLY (not default start)
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
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
        this.renderHints(current.h);
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
        this.renderHints(this.finalQ.h);
        this.ui.setStatus("AWAITING FINAL INPUT…");
        return;
      }
    }

    if (this.stage === "done"){
      return this.boot();
    }

    if (this.stage === "hub"){
      // hub uses buttons, not terminal input
      return;
    }
  }
  // =========================
  // INPUT HANDLER END
  // =========================
}