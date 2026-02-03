export class Game {
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    // ===== CODES =====
    this.ID = "101-317-76";          // starts riddles
    this.NEXT_ID = "14-LOVE-READY";  // opens Valentine Hub
    this.FINAL_CODE = "531";         // briefcase code

    // ===== DATA =====
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
      a:this.FINAL_CODE,
      h:["There were flowers.","You went to the beach.","Someone was running late… for a good reason."]
    };

    // ===== STATE =====
    this.stage = "login"; // login | riddle | final | ready | hub
    this.r = 0;
    this.hintUsed = 0;

    this.timer = null;
  }

  start(){
    this.boot();
  }

  // ==========================
  // MAIN / TYPEWRITER SCREENS
  // ==========================
  async boot(){
    this.stage = "login";
    this.r = 0;
    this.hintUsed = 0;
    this.stopTimer();

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
    this.ui.clearHints();
  }

  async askRiddle(){
    if(this.r >= this.riddles.length){
      return this.askFinal();
    }

    this.stage = "riddle";
    this.hintUsed = 0;

    const cur = this.riddles[this.r];

    this.ui.clear();
    this.ui.setStatus(`TEST MODULE ${this.r+1}/5 LOADED`);

    await this.ui.type([
      `RIDDLE ${this.r+1}: ${cur.q}`,
      "",
      "> "
    ], 35);

    this.ui.showInput("TYPE ANSWER");
    this.renderHints(cur.h);
    this.ui.setStatus("AWAITING INPUT…");
  }

  async askFinal(){
    this.stage = "final";
    this.hintUsed = 0;

    this.ui.clear();
    this.ui.setStatus("FINAL AUTHORIZATION");

    await this.ui.type([
      this.finalQ.q,
      "",
      "> "
    ], 35);

    this.ui.showInput("ENTER CODE");
    this.renderHints(this.finalQ.h);
    this.ui.setStatus("AWAITING FINAL INPUT…");
  }

  async showFinalSuccess(){
    this.stage = "ready";
    this.ui.clearHints();
    this.ui.hideInput();

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

    this.ui.addButton("RETURN TO ID SCREEN", () => this.boot());
    this.ui.setStatus("SESSION COMPLETE");
  }

  // ==========================
  // HINTS (buttons)
  // ==========================
  renderHints(hArr){
    const remaining = hArr.slice(this.hintUsed, 3);
    this.ui.showHintButtons(remaining, async (idx) => {
      // idx is 0.. based on remaining array
      const realIndex = this.hintUsed + idx;
      const hint = hArr[realIndex];
      if(!hint) return;

      this.ui.setStatus("HINT MODULE: ACTIVE");
      await this.ui.type([`HINT: ${hint}`], 30);
      this.ui.setStatus("AWAITING INPUT…");

      this.hintUsed++;
      this.renderHints(hArr);
    });
  }

  // ==========================
  // VALENTINE HUB (HUD screen)
  // ==========================
  showValentineHub(){
    this.stage = "hub";
    this.ui.clearHints();
    this.ui.hideInput();
    this.ui.clear();
    this.stopTimer();

    this.ui.setHeaderUnlocked("IZABELLA");
    this.ui.setStatus("VALENTINE MODULE: ACTIVE");

    // HUD layout (HTML) — ONLY THIS screen uses ui.html
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
          <div class="smallHdr">MODULES</div>
          <div class="hr"></div>
          <div class="menuWrap">
            <button disabled>✓ COMPLETED</button>
            <button data-action="info">INFO</button>
            <button data-action="reward">REWARD QUIZ</button>
            <button data-action="mini">MINI GAMES</button>
            <button data-action="log">MISSION LOG</button>
          </div>
        </div>

        <div class="block">
          <button data-action="back">← RETURN TO ID SCREEN</button>
        </div>
      </div>
    `);

    // Hook the hub buttons using event delegation
    this.ui.bindActions?.((action) => this.handleClick(action));

    this.startCountdown();
  }

  handleClick(action){
    if(action === "back"){
      this.boot();
      return;
    }
    if(action === "info"){
      this.ui.setStatus("INFO MODULE (NEXT)");
      return;
    }
    if(action === "reward"){
      this.ui.setStatus("REWARD QUIZ (NEXT)");
      return;
    }
    if(action === "mini"){
      this.ui.setStatus("MINI GAMES (NEXT)");
      return;
    }
    if(action === "log"){
      this.ui.setStatus("MISSION LOG (NEXT)");
      return;
    }
  }

  startCountdown(){
    this.stopTimer();
    const target = new Date(2026, 1, 14, 0, 0, 0); // Feb 14, 2026 00:00 local

    const dEl = document.getElementById("dLeft");
    const tEl = document.getElementById("tLeft");

    const pad = (n) => String(n).padStart(2, "0");

    const tick = () => {
      const now = new Date();
      let ms = target - now;
      if(ms < 0) ms = 0;

      const total = Math.floor(ms / 1000);
      const days = Math.floor(total / 86400);
      const rem = total % 86400;
      const hrs = Math.floor(rem / 3600);
      const mins = Math.floor((rem % 3600) / 60);
      const secs = rem % 60;

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

  // ==========================
  // INPUT HANDLING
  // ==========================
  async handleInput(raw){
    const a = (raw || "").trim().toLowerCase();

    if(this.stage === "login"){
      this.ui.setStatus("VALIDATING…");

      if(a === this.ID.toLowerCase()){
        this.ui.setHeaderUnlocked("IZABELLA");
        this.ui.clear();
        await this.ui.type(["ID VERIFIED.","Welcome, Izabella.","Initializing test modules…"], 35);
        // go to riddle 1
        this.r = 0;
        return this.askRiddle();
      }

      if(a === this.NEXT_ID.toLowerCase()){
        // go to hub
        return this.showValentineHub();
      }

      await this.ui.type(["✖ INVALID ID", "> "], 35);
      this.ui.setStatus("ACCESS DENIED");
      this.ui.showInput("ENTER ID");
      return;
    }

    if(this.stage === "riddle"){
      const cur = this.riddles[this.r];
      if(a === cur.a.toLowerCase()){
        this.ui.setStatus("ANSWER ACCEPTED");
        await this.ui.type(["✔ CORRECT."], 30);
        this.r++;
        return this.askRiddle();
      } else {
        this.ui.setStatus("ANSWER REJECTED");
        await this.ui.type(["✖ TRY AGAIN", "> "], 30);
        this.ui.showInput("TYPE ANSWER");
        this.renderHints(cur.h);
        this.ui.setStatus("AWAITING INPUT…");
        return;
      }
    }

    if(this.stage === "final"){
      if(raw.trim() === this.finalQ.a){
        this.ui.setStatus("CODE ACCEPTED");
        await this.ui.type(["✔ AUTHORIZED."], 30);
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

    // hub ignores input box because it's hidden
  }
}