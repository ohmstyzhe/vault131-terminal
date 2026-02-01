export class Game{
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    /* ===== CONFIG ===== */
    this.ID = "101-317-76";
    this.NEXT_ID = "14-LOVE-READY";
    this.FINAL_CODE = "531";

    // Admin shortcut: type this at the ID prompt to jump straight to the 531 screen
    this.OVERRIDE_ID = "OVERRIDE-531";

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

    /* ===== STATE ===== */
    this.stage = "login";
    this.rIndex = 0;
    this.hintUsed = 0;
  }

  start(){
    this._wireInput();
    this.boot();
  }

  _wireInput(){
    this.ui.input.addEventListener("keydown", async (e)=>{
      if(e.key !== "Enter") return;
      if(this.ui.locked) return;

      const raw = this.ui.input.value.trim();
      const a = raw.toLowerCase();

      this.ui.input.value = "";
      this.ui.hideInput();
      this.ui.clearHints();

      // Easter egg help
      if(a === "help"){
        await this.showHelp();
        return;
      }
      if(this.stage === "help"){
        this.boot();
        return;
      }

      if(this.stage === "login"){
        await this.handleLogin(raw, a);
        return;
      }

      if(this.stage === "riddle"){
        await this.handleRiddle(raw, a);
        return;
      }

      if(this.stage === "final"){
        await this.handleFinal(raw, a);
        return;
      }

      if(this.stage === "ready"){
        this.boot();
        return;
      }
    });
  }

  async boot(){
    this.stage = "login";
    this.rIndex = 0;
    this.hintUsed = 0;

    this.ui.setLockedHeader();
    this.ui.setStatus("STANDBY… AWAITING INPUT");
    this.ui.clear();

    await this.ui.typeLines([
      "VAULT 131 DATABASE",
      "SECURITY: ENABLED",
      "ENTER IDENTIFICATION:",
      "> "
    ], 35);

    this.ui.showInput("ENTER ID");
  }

  async handleLogin(raw, a){
    this.ui.setStatus("VALIDATING…");

    if(a === this.OVERRIDE_ID.toLowerCase()){
      this.ui.setUnlockedHeader("IZABELLA");
      await this.ui.loading(this.loadMsgs, this.loadDetails);
      await this.ui.powerDip();
      await this.showFinalSuccess(); // jump straight to 531 screen
      return;
    }

    if(a === this.ID.toLowerCase()){
      this.ui.setUnlockedHeader("IZABELLA");
      this.ui.clear();
      await this.ui.typeLines(["ID VERIFIED.","Welcome, Izabella.","Initializing test modules…"], 35);
      await this.ui.loading(this.loadMsgs, this.loadDetails);
      await this.ui.powerDip();
      this.rIndex = 0;
      await this.askRiddle();
      return;
    }

    if(a === this.NEXT_ID.toLowerCase()){
      await this.showReadyScene();
      return;
    }

    await this.ui.typeLines(["✖ INVALID ID", "> "], 35);
    this.ui.setStatus("ACCESS DENIED");
    this.ui.showInput("ENTER ID");
  }

  async askRiddle(){
    if(this.rIndex >= this.riddles.length){
      this.stage = "final";
      this.hintUsed = 0;
      this.ui.clear();
      this.ui.setStatus("FINAL AUTHORIZATION");
      await this.ui.typeLines([this.finalQ.q, "", "> "], 35);
      this._showHintButtons(this.finalQ.h);
      this.ui.showInput("ENTER CODE");
      this.ui.setStatus("AWAITING FINAL INPUT…");
      return;
    }

    this.stage = "riddle";
    this.hintUsed = 0;
    const r = this.riddles[this.rIndex];

    this.ui.clear();
    this.ui.setStatus(`TEST MODULE ${this.rIndex + 1}/5 LOADED`);
    await this.ui.typeLines([`RIDDLE ${this.rIndex + 1}: ${r.q}`, "", "> "], 35);

    this._showHintButtons(r.h);
    this.ui.showInput("TYPE ANSWER");
    this.ui.setStatus("AWAITING INPUT…");
  }

  _showHintButtons(hintsArr){
    const buildButtons = () => {
      this.ui.clearHints();

      const remaining = hintsArr.slice(this.hintUsed, 3);
      remaining.forEach((_, idx)=>{
        const label = `HINT ${this.hintUsed + idx + 1}`;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = label;
        btn.onclick = async ()=>{
          if(this.ui.locked) return;
          this.ui.setStatus("HINT MODULE: ACTIVE");
          await this.ui.typeLines([`HINT: ${hintsArr[this.hintUsed]}`], 30);
          this.ui.setStatus("AWAITING INPUT…");
          this.hintUsed++;
          buildButtons();
        };
        this.ui.hints.appendChild(btn);
      });
    };

    buildButtons();
  }

  async handleRiddle(raw, a){
    const r = this.riddles[this.rIndex];

    if(a === r.a.toLowerCase()){
      this.ui.setStatus("ANSWER ACCEPTED");
      await this.ui.typeLines(["✔ CORRECT."], 30);
      await this.ui.loading(this.loadMsgs, this.loadDetails);
      await this.ui.powerDip();
      this.rIndex++;
      await this.askRiddle();
      return;
    }

    this.ui.setStatus("ANSWER REJECTED");
    await this.ui.typeLines(["✖ TRY AGAIN", "> "], 30);
    this.ui.showInput("TYPE ANSWER");
    this._showHintButtons(r.h);
    this.ui.setStatus("AWAITING INPUT…");
  }

  async handleFinal(raw, a){
    if(raw === this.finalQ.a){
      this.ui.setStatus("CODE ACCEPTED");
      await this.ui.typeLines(["✔ AUTHORIZED."], 30);
      await this.ui.loading(this.loadMsgs, this.loadDetails);
      await this.ui.powerDip();
      await this.showFinalSuccess();
      return;
    }

    this.ui.setStatus("CODE INVALID");
    await this.ui.typeLines(["✖ INCORRECT CODE", "> "], 30);
    this.ui.showInput("ENTER CODE");
    this._showHintButtons(this.finalQ.h);
    this.ui.setStatus("AWAITING FINAL INPUT…");
  }

  async showReadyScene(){
    this.stage = "ready";
    this.ui.setUnlockedHeader("IZABELLA");
    this.ui.setStatus("NEXT ADVENTURE UNLOCKED");
    this.ui.clear();

    await this.ui.typeLines([
      "ACCESS ACCEPTED.",
      "",
      "Izabella — on the 14th, be ready to go out.",
      "Wear something nice.",
      "Do your hair and makeup.",
      "",
      "Expect to have some fun. 🙂",
      "",
      "Press ENTER to return to main menu."
    ], 35);

    this.ui.showInput("PRESS ENTER");
  }

  async showFinalSuccess(){
    this.stage = "done";
    this.ui.clear();
    this.ui.setStatus("AUTHORIZATION GRANTED");

    await this.ui.typeLines([
      "AUTHORIZATION GRANTED.",
      "",
      "CASE CODE:",
      ""
    ], 35);

    this.ui.addBigCode(this.FINAL_CODE);

    await new Promise(r => setTimeout(r, 520));

    this.ui.setStatus("POST-AUTH SEQUENCE");
    await this.ui.typeLines([
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

    this.ui.addButton("RETURN TO MAIN MENU", ()=> this.boot());
    this.ui.setStatus("SESSION COMPLETE");
  }

  async showHelp(){
    this.stage = "help";
    this.ui.clear();
    this.ui.setStatus("VAULT-TEC NOTICE");

    await this.ui.typeLines([
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
}