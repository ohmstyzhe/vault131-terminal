export class Game {
  /* =========================
     CONSTRUCTOR START
     ========================= */
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    /* =========================
       CODES START
       ========================= */
    this.ID = "101-317-76";        // riddle login
    this.NEXT_ID = "14-LOVE-READY"; // unlocks Valentine Hub
    this.FINAL_CODE = "531";        // briefcase code
    /* =========================
       CODES END
       ========================= */

    /* =========================
       RIDDLES DATA START
       ========================= */
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
    /* =========================
       RIDDLES DATA END
       ========================= */

    /* =========================
       FINAL QUESTION START
       ========================= */
    this.finalQ = {
      q:"FINAL AUTHORIZATION REQUIRED.\n\nThis number marks the day everything changed.\nWhat is the code?",
      a: this.FINAL_CODE,
      h:["There were flowers.","You went to the beach.","Someone was running late… for a good reason."]
    };
    /* =========================
       FINAL QUESTION END
       ========================= */

    /* =========================
       LOADING LINES START
       ========================= */
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
    /* =========================
       LOADING LINES END
       ========================= */

    /* =========================
       STATE START
       ========================= */
    this.stage = "login"; // login | riddle | final | done | hub
    this.r = 0;
    this.hintUsed = 0;
    this.timer = null;

    // UI actions (for hub buttons)
    this.ui.onAction = (action) => this.handleAction(action);
    /* =========================
       STATE END
       ========================= */
  }
  /* =========================
     CONSTRUCTOR END
     ========================= */


  /* =========================
     GAME START START
     ========================= */
  start(){
    this.boot();
  }
  /* =========================
     GAME START END
     ========================= */


  /* =========================
     BOOT / LOGIN SCREEN START
     ========================= */
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
  /* =========================
     BOOT / LOGIN SCREEN END
     ========================= */


  /* =========================
     HELP SCREEN START
     ========================= */
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
  /* =========================
     HELP SCREEN END
     ========================= */


  /* =========================
     RIDDLE FLOW START
     ========================= */
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
  /* =========================
     RIDDLE FLOW END
     ========================= */


  /* =========================
     FINAL SUCCESS SCREEN START
     ========================= */
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
  /* =========================
     FINAL SUCCESS SCREEN END
     ========================= */


  /* ============================================================
     VALENTINE HUB (GLIDER STYLE) START
     - ONLY THIS SECTION IS “THE REDESIGN”
     - no external planet images; uses inline SVG icons
     ============================================================ */

  _gliderIcon(type){
    // Small, simple “code-made” icons (SVG). No files needed.
    // Keep these minimal so it stays fast on iPad.
    const common = `viewBox="0 0 64 64" aria-hidden="true" focusable="false"`;
    const ring = `<circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="3"/>`;
    const scan = `<path d="M12 24h40M12 32h40M12 40h40" stroke="currentColor" stroke-width="3" opacity=".65"/>`;

    if (type === "globe"){
      return `<svg ${common}><circle cx="32" cy="32" r="22" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M10 32h44" stroke="currentColor" stroke-width="3" opacity=".7"/>
        <path d="M32 10c7 7 7 37 0 44" stroke="currentColor" stroke-width="3" opacity=".7"/>
        <path d="M32 10c-7 7-7 37 0 44" stroke="currentColor" stroke-width="3" opacity=".7"/>
      </svg>`;
    }

    if (type === "pin"){
      return `<svg ${common}><path d="M32 56s16-16 16-28A16 16 0 0 0 16 28c0 12 16 28 16 28z"
        fill="none" stroke="currentColor" stroke-width="3"/><circle cx="32" cy="28" r="5" fill="currentColor"/></svg>`;
    }

    if (type === "plus"){
      return `<svg ${common}>${ring}<path d="M32 18v28M18 32h28" stroke="currentColor" stroke-width="4"/></svg>`;
    }

    if (type === "info"){
      return `<svg ${common}>${ring}<path d="M32 28v18" stroke="currentColor" stroke-width="4"/>
        <circle cx="32" cy="20" r="3" fill="currentColor"/></svg>`;
    }

    if (type === "gift"){
      return `<svg ${common}>
        <path d="M14 28h36v28H14z" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M32 28v28" stroke="currentColor" stroke-width="3"/>
        <path d="M14 36h36" stroke="currentColor" stroke-width="3" opacity=".7"/>
        <path d="M22 28c-4 0-7-3-7-7 0-4 3-7 7-7 6 0 10 14 10 14s-4-14-10-14z" opacity="0"/>
        <path d="M32 28s-3-14-10-14c-3 0-6 2-6 6s3 8 8 8" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M32 28s3-14 10-14c3 0 6 2 6 6s-3 8-8 8" fill="none" stroke="currentColor" stroke-width="3"/>
      </svg>`;
    }

    if (type === "exit"){
      return `<svg ${common}>${ring}
        <path d="M28 20h8v24h-8" fill="none" stroke="currentColor" stroke-width="3"/>
        <path d="M28 32H14" stroke="currentColor" stroke-width="3"/>
        <path d="M18 26l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="3"/>
      </svg>`;
    }

    // default “scan planet”
    return `<svg ${common}>${ring}${scan}</svg>`;
  }

  showValentineHub(){
    this.stage = "hub";
    this.ui.setHeaderUnlocked("IZABELLA");
    this.ui.setStatus("VALENTINE HUB: ONLINE");
    this.ui.clear();
    this.ui.hideInput();
    this.ui.clearHints();

    this.ui.html(`
      <div class="valHub gliderHub">
        <div class="valBg"></div>

        <!-- GLIDER TOP PANEL -->
        <div class="gliderPanel">
          <div class="gliderTopRow">
            <div class="gliderTitle">
              <div class="gliderLine">*** GLIDER OPERATING SYSTEM ***</div>
              <div class="gliderLine gliderSub">128k RAM - <span class="gliderDim">83259 Bytes Free</span></div>
            </div>

            <div class="gliderRight">
              <div class="gliderSpeaker" title="Audio status">
                <span class="gliderSpeakerIcon">🔊</span>
              </div>
              <div class="gliderCountdown">
                <div class="gliderCDTop"><span id="vDays">-- DAYS</span></div>
                <div class="gliderCDBot"><span id="vTime">--:--:--</span></div>
              </div>
            </div>
          </div>

          <!-- GLIDER “WORLD/NETWORK” ROW -->
          <div class="gliderWorldRow" aria-hidden="true">
            <div class="gliderWorldItem">
              <div class="gliderWorldIcon">${this._gliderIcon("globe")}</div>
              <div class="gliderWorldLbl">Network</div>
            </div>
            <div class="gliderWorldItem">
              <div class="gliderWorldIcon">${this._gliderIcon("scan")}</div>
              <div class="gliderWorldLbl">Global</div>
            </div>
            <div class="gliderWorldItem">
              <div class="gliderWorldIcon">${this._gliderIcon("scan")}</div>
              <div class="gliderWorldLbl">USA</div>
            </div>
            <div class="gliderWorldItem">
              <div class="gliderWorldIcon">${this._gliderIcon("scan")}</div>
              <div class="gliderWorldLbl">Europe</div>
            </div>
            <div class="gliderWorldItem">
              <div class="gliderWorldIcon">${this._gliderIcon("scan")}</div>
              <div class="gliderWorldLbl">Oceania</div>
            </div>
            <div class="gliderWorldItem">
              <div class="gliderWorldIcon">${this._gliderIcon("scan")}</div>
              <div class="gliderWorldLbl">Net 2.0</div>
            </div>
            <div class="gliderWorldItem">
              <div class="gliderWorldIcon">${this._gliderIcon("pin")}</div>
              <div class="gliderWorldLbl">G.A.M.E</div>
            </div>
          </div>
        </div>

        <!-- GLIDER DOCK (THE CLICK OPTIONS) -->
        <div class="gliderDock">
          <button class="gliderTile" data-action="hub_stats">
            <div class="gliderTileIcon">${this._gliderIcon("info")}</div>
            <div class="gliderTileTxt">SysInfo</div>
          </button>

          <button class="gliderTile" data-action="hub_rewards">
            <div class="gliderTileIcon">${this._gliderIcon("gift")}</div>
            <div class="gliderTileTxt">Rewards</div>
          </button>

          <button class="gliderTile" data-action="hub_minigames">
            <div class="gliderTileIcon">${this._gliderIcon("plus")}</div>
            <div class="gliderTileTxt">G.A.M.E</div>
          </button>

          <button class="gliderTile" data-action="hub_mission">
            <div class="gliderTileIcon">${this._gliderIcon("pin")}</div>
            <div class="gliderTileTxt">Mission</div>
          </button>

          <button class="gliderTile" data-action="hub_back">
            <div class="gliderTileIcon">${this._gliderIcon("exit")}</div>
            <div class="gliderTileTxt">Exit</div>
          </button>
        </div>

        <!-- FOOTER LINE (like the reference has status text) -->
        <div class="gliderFooterLine">
          TARGET: 02/14/2026 00:00 (Local time)
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

  /* ============================================================
     VALENTINE HUB (GLIDER STYLE) END
     ============================================================ */


  /* =========================
     ACTION HANDLER START
     ========================= */
  handleAction(action){
    // Keep it simple for now: placeholders
    if (action === "hub_back") return this.boot();

    /* =========================
       VALENTINE HUB: SYSINFO SCREEN START
       (still Valentine Hub feature)
       ========================= */
    if (action === "hub_stats"){
      this.ui.setStatus("SYSINFO: LOADING");
      this.ui.clear();
      this.ui.hideInput();
      this.ui.html(`
        <div class="valHub gliderHub">
          <div class="valBg"></div>

          <div class="gliderPanel">
            <div class="gliderTopRow">
              <div class="gliderTitle">
                <div class="gliderLine">*** SYSTEM INFORMATION ***</div>
                <div class="gliderLine gliderSub">VAULT 131 / USER: IZABELLA</div>
              </div>
            </div>

            <div class="gliderInfoBody">
              <div class="gliderInfoRow"><span class="k">BUILD TIME</span><span class="v">3 DAYS</span></div>
              <div class="gliderInfoRow"><span class="k">MODULES</span><span class="v">TERMINAL + HUB</span></div>
              <div class="gliderInfoRow"><span class="k">AUDIO</span><span class="v">OPTIONAL</span></div>
              <div class="gliderInfoRow"><span class="k">TARGET</span><span class="v">02/14/2026 00:00</span></div>
            </div>
          </div>

          <div class="gliderDock gliderDockSmall">
            <button class="gliderTile" data-action="hub_return">
              <div class="gliderTileIcon">${this._gliderIcon("exit")}</div>
              <div class="gliderTileTxt">Back</div>
            </button>
          </div>
        </div>
      `);
      return;
    }
    /* =========================
       VALENTINE HUB: SYSINFO SCREEN END
       ========================= */

    if (action === "hub_return"){
      return this.showValentineHub();
    }

    /* =========================
       VALENTINE HUB: PLACEHOLDER MODULES START
       ========================= */
    if (action === "hub_rewards" || action === "hub_minigames" || action === "hub_mission"){
      this.ui.setStatus("MODULE: UNDER CONSTRUCTION");
      this.ui.clear();
      this.ui.hideInput();
      this.ui.html(`
        <div class="valHub gliderHub">
          <div class="valBg"></div>

          <div class="gliderPanel">
            <div class="gliderTopRow">
              <div class="gliderTitle">
                <div class="gliderLine">*** MODULE LOADED ***</div>
                <div class="gliderLine gliderSub">STATUS: UNDER CONSTRUCTION</div>
              </div>
            </div>

            <div class="gliderInfoBody">
              <div class="gliderDim" style="line-height:1.4;">
                This module is next.<br/>
                (We’ll build it clean, no random changes.)
              </div>
            </div>
          </div>

          <div class="gliderDock gliderDockSmall">
            <button class="gliderTile" data-action="hub_return">
              <div class="gliderTileIcon">${this._gliderIcon("exit")}</div>
              <div class="gliderTileTxt">Back</div>
            </button>
          </div>
        </div>
      `);
      return;
    }
    /* =========================
       VALENTINE HUB: PLACEHOLDER MODULES END
       ========================= */
  }
  /* =========================
     ACTION HANDLER END
     ========================= */


  /* =========================
     INPUT HANDLER START
     ========================= */
  async handleInput(raw){
    const a = (raw || "").trim().toLowerCase();

    if (a === "help") return this.showHelp();
    if (this.stage === "help") return this.boot();

    /* =========================
       LOGIN INPUT START
       ========================= */
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
    /* =========================
       LOGIN INPUT END
       ========================= */

    /* =========================
       RIDDLE INPUT START
       ========================= */
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
    /* =========================
       RIDDLE INPUT END
       ========================= */

    /* =========================
       FINAL INPUT START
       ========================= */
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
    /* =========================
       FINAL INPUT END
       ========================= */

    if (this.stage === "done"){
      return this.boot();
    }

    if (this.stage === "hub"){
      // hub uses buttons, not terminal input
      return;
    }
  }
  /* =========================
     INPUT HANDLER END
     ========================= */
}