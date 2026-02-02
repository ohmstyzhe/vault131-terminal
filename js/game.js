// game.js
export class Game {
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    // ===== CODES START =====
    this.ID = "101-317-76";        // riddle login
    this.NEXT_ID = "14-LOVE-READY"; // unlocks Valentine Hub
    this.FINAL_CODE = "531";        // briefcase code
    // ===== CODES END =====

    // ===== RIDDLES DATA START =====
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
    // ===== RIDDLES DATA END =====

    // ===== FINAL QUESTION START =====
    this.finalQ = {
      q:"FINAL AUTHORIZATION REQUIRED.\n\nThis number marks the day everything changed.\nWhat is the code?",
      a: this.FINAL_CODE,
      h:["There were flowers.","You went to the beach.","Someone was running late… for a good reason."]
    };
    // ===== FINAL QUESTION END =====

    // ===== LOADING TEXT START =====
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
    // ===== LOADING TEXT END =====

    // ===== STATE START =====
    this.stage = "login"; // login | riddle | final | done | hub | help
    this.r = 0;
    this.hintUsed = 0;
    this.timer = null;

    // UI actions (for hub buttons)
    this.ui.onAction = (action) => this.handleAction(action);
    // ===== STATE END =====
  }

  // ===== GAME START START =====
  start(){
    this.boot();
  }
  // ===== GAME START END =====

  // ===== LOGIN SCREEN START =====
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
  // ===== LOGIN SCREEN END =====

  // ===== HELP SCREEN START =====
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
  // ===== HELP SCREEN END =====

  // ===== RIDDLES FLOW START =====
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
  // ===== RIDDLES FLOW END =====

  // ===== FINAL FLOW START =====
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
  // ===== FINAL FLOW END =====

  // ===== HINTS START =====
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
  // ===== HINTS END =====

  // ===== FINAL SUCCESS / BRIEFCASE START =====
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
  // ===== FINAL SUCCESS / BRIEFCASE END =====


  // ============================================================
  // ===== VALENTINE HUB START (ONLY SECTION CHANGED) ============
  // ============================================================
  showValentineHub(){
    this.stage = "hub";
    this.ui.setHeaderUnlocked("IZABELLA");
    this.ui.setStatus("VALENTINE HUB: ONLINE");
    this.ui.clear();
    this.ui.hideInput();
    this.ui.clearHints();

    // NOTE:
    // This is ONLY markup/layout. All other game logic is unchanged.
    // Countdown still uses #vDays and #vTime (kept).

    this.ui.html(`
      <div class="valHub gliderHub">
        <div class="valBg gliderBg"></div>

        <!-- ===== GLIDER PANEL START ===== -->
        <div class="gliderPanel block">

          <!-- TOP BAR (matches circled reference area) -->
          <div class="gliderTop">
            <div class="gliderTitle">
              <span class="gliderStars">***</span>
              <span>GLIDER OPERATING SYSTEM</span>
              <span class="gliderStars">***</span>
            </div>

            <div class="gliderRight">
              <span class="gliderSpeaker" aria-hidden="true">🔊</span>
            </div>
          </div>

          <div class="gliderSub">
            <span>128k RAM — 83259 Bytes Free</span>
            <span class="gliderDivider">|</span>
            <span class="gliderSmall">VALENTINE LINK: ACTIVE</span>
          </div>

          <!-- GLOBE ROW -->
          <div class="globeRow" aria-label="Glider locations">
            <button class="globeBtn" data-action="hub_stats" title="SysInfo">
              <span class="globeIcon">🌐</span>
              <span class="globeLabel">SYSINFO</span>
            </button>

            <button class="globeBtn" data-action="hub_rewards" title="Rewards">
              <span class="globeIcon">🏅</span>
              <span class="globeLabel">REWARDS</span>
            </button>

            <button class="globeBtn" data-action="hub_minigames" title="G.A.M.E">
              <span class="globeIcon">🎮</span>
              <span class="globeLabel">G.A.M.E</span>
            </button>

            <button class="globeBtn" data-action="hub_mission" title="Mission">
              <span class="globeIcon">🧭</span>
              <span class="globeLabel">MISSION</span>
            </button>

            <button class="globeBtn" data-action="hub_back" title="Exit">
              <span class="globeIcon">⏎</span>
              <span class="globeLabel">EXIT</span>
            </button>
          </div>

          <!-- STATUS STRIP (countdown + target, compact) -->
          <div class="gliderStrip">
            <div class="stripCol">
              <div class="stripLabel">COUNTDOWN</div>
              <div class="stripBig" id="vDays">-- DAYS</div>
              <div class="stripSmall" id="vTime">--:--:--</div>
            </div>

            <div class="stripCol">
              <div class="stripLabel">TARGET</div>
              <div class="stripSmall">02/14/2026 00:00</div>
              <div class="stripSmall" style="opacity:.75;">(Local time)</div>
            </div>

            <div class="stripCol stripNote">
              <div class="stripLabel">NOTICE</div>
              <div class="stripSmall">This hub is live — counting down to Valentine’s Day.</div>
              <div class="stripSmall" style="opacity:.75;">(Yes, this is extremely official.)</div>
            </div>
          </div>

        </div>
        <!-- ===== GLIDER PANEL END ===== -->
      </div>
    `);

    this.startCountdown();
  }
  // ============================================================
  // ===== VALENTINE HUB END (ONLY SECTION CHANGED) ==============
  // ============================================================


  // ===== COUNTDOWN START =====
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
  // ===== COUNTDOWN END =====

  // ===== HUB BUTTON ACTIONS START =====
  handleAction(action){
    // Return to ID terminal
    if (action === "hub_back") return this.boot();

    // SYSINFO / VAULT STATS
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

    if (action === "hub_return"){
      return this.showValentineHub();
    }

    // rewards / minigames / mission placeholders
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
  // ===== HUB BUTTON ACTIONS END =====

  // ===== INPUT HANDLER START =====
  async handleInput(raw){
    const a = (raw || "").trim().toLowerCase();

    if (a === "help") return this.showHelp();
    if (this.stage === "help") return this.boot();

    // LOGIN
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
        // Valentine Hub ONLY (not default start)
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        return this.showValentineHub();
      }

      await this.ui.type(["✖ INVALID ID", "> "], 35);
      this.ui.setStatus("ACCESS DENIED");
      this.ui.showInput("ENTER ID");
      return;
    }

    // RIDDLES
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

    // FINAL
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
  // ===== INPUT HANDLER END =====
}