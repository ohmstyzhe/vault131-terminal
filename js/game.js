export class Game {
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    // ===== CODES =====
    // Main riddle login ID (the one she gets to START the riddles)
    this.VALID_ID = "101-317-76";

    // After finishing everything, this is the NEW code she uses to open the Valentine Hub
    this.NEXT_ID = "14-LOVE-READY";

    // Briefcase code shown at the end
    this.FINAL_CODE = "531";

    // ===== STATE =====
    // LOCK | RIDDLE | FINAL | DONE | VAL | PLACEHOLDER
    this.state = "LOCK";

    this.rIndex = 0;
    this.hintUsed = 0;
    this.hintLog = [];

    this.timer = null;

    // Riddles (5)
    this.riddles = [
      {
        q:"I move without legs and follow you everywhere.",
        a:"shadow",
        h:[
          "You see me when light hits you.",
          "I copy your shape perfectly.",
          "I disappear in darkness."
        ]
      },
      {
        q:"The more you take, the more you leave behind.",
        a:"footsteps",
        h:[
          "You make me without noticing.",
          "I mark where you’ve been.",
          "I vanish if you stop walking."
        ]
      },
      {
        q:"I speak without a mouth and hear without ears.",
        a:"echo",
        h:[
          "I repeat what you say.",
          "I live in empty spaces.",
          "You hear me after you call out."
        ]
      },
      {
        q:"I’m always coming, but I never arrive.",
        a:"tomorrow",
        h:[
          "You can’t hold me in your hands.",
          "I’m always one day away.",
          "It becomes today… then it’s gone."
        ]
      },
      {
        q:"I have keys but open no locks. I have space but no room. You can enter, but you can’t go outside. What am I?",
        a:"keyboard",
        h:[
          "Think: terminal.",
          "You’re using me right now.",
          "Keys + space + enter = me."
        ]
      }
    ];

    // Final question
    this.finalQ = {
      q:
`FINAL AUTHORIZATION REQUIRED.

This number marks the day everything changed.
What is the code?`,
      a: this.FINAL_CODE,
      h:[
        "There were flowers.",
        "You went to the beach.",
        "Someone was running late… for a good reason."
      ]
    };
  }

  start(){
    // Always start at the ID prompt (main menu)
    this.showLock();
  }

  // =========================
  // UTIL
  // =========================
  normalize(str){
    // removes spaces + dashes + weird characters, uppercase for stable compare
    return (str || "")
      .toString()
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "");
  }

  // =========================
  // SCREEN: LOCK / ID PROMPT
  // =========================
  showLock(){
    this.state = "LOCK";
    this.stopTimer();

    this.rIndex = 0;
    this.hintUsed = 0;
    this.hintLog = [];

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

  // =========================
  // RIDDLES
  // =========================
  showRiddle(){
    this.state = "RIDDLE";
    this.stopTimer();

    const r = this.riddles[this.rIndex];
    this.ui.setHeader("VAULT 131 DATABASE | STATUS: OPERATIONAL | USER: IZABELLA");
    this.ui.setStatus(`TEST MODULE ${this.rIndex + 1}/5 LOADED`);
    this.ui.clear();

    const hintSection = this.renderHints(r.h);
    const hintLog = this.renderHintLog();

    this.ui.html(`
      <div class="block">
        <div class="smallHdr">RIDDLE ${this.rIndex + 1}</div>
        <div class="hr"></div>
        <div style="white-space:pre-wrap; line-height:1.45; font-size:16px; letter-spacing:0.6px;">
${r.q}

&gt;
        </div>
      </div>

      ${hintSection}

      ${hintLog}

      <div class="block" style="opacity:.85;">
        <div class="valSmall">Type the answer and press ENTER.</div>
      </div>
    `);

    this.ui.showInput("TYPE ANSWER");
  }

  showFinal(){
    this.state = "FINAL";
    this.stopTimer();

    this.hintUsed = 0;
    this.hintLog = [];

    this.ui.setHeader("VAULT 131 DATABASE | STATUS: OPERATIONAL | USER: IZABELLA");
    this.ui.setStatus("FINAL AUTHORIZATION");
    this.ui.clear();

    const hintSection = this.renderHints(this.finalQ.h);
    const hintLog = this.renderHintLog();

    this.ui.html(`
      <div class="block">
        <div class="smallHdr">FINAL AUTHORIZATION</div>
        <div class="hr"></div>
        <div style="white-space:pre-wrap; line-height:1.45; font-size:16px; letter-spacing:0.6px;">
${this.finalQ.q}

&gt;
        </div>
      </div>

      ${hintSection}

      ${hintLog}

      <div class="block" style="opacity:.85;">
        <div class="valSmall">Enter the code and press ENTER.</div>
      </div>
    `);

    this.ui.showInput("ENTER CODE");
  }

  showBriefcaseCode(){
    this.state = "DONE";
    this.stopTimer();

    this.ui.setHeader("VAULT 131 DATABASE | STATUS: OPERATIONAL | USER: IZABELLA");
    this.ui.setStatus("AUTHORIZATION GRANTED");
    this.ui.clear();
    this.ui.hideInput();

    this.ui.html(`
      <div class="block">
        <div class="smallHdr">AUTHORIZATION GRANTED</div>
        <div class="hr"></div>
        <div style="white-space:pre-wrap; line-height:1.45; font-size:16px; letter-spacing:0.6px;">
CASE CODE:
        </div>
        <div class="bigCode">${this.FINAL_CODE}</div>
      </div>

      <div class="block">
        <div class="valSmall" style="line-height:1.45;">
Use it to open the briefcase.<br><br>
NEXT ACCESS UNLOCKED:<br>
<b>${this.NEXT_ID}</b><br><br>
Reload the page (or just go back) and enter that code at the ID prompt.
        </div>
      </div>

      <div class="block">
        <button data-action="lock">← RETURN TO ID SCREEN</button>
      </div>
    `);
  }

  // =========================
  // VALENTINE HUB (14-LOVE-READY)
  // =========================
  showValentineHub(){
    this.state = "VAL";

    this.ui.setHeader("VAULT 131 DATABASE | STATUS: OPERATIONAL | USER: IZABELLA");
    this.ui.setStatus("VALENTINE MODULE: ACTIVE");
    this.ui.clear();
    this.ui.hideInput();

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
            <button data-action="hub_info">INFO</button>
            <button data-action="hub_reward">REWARD QUIZ</button>
            <button data-action="hub_mini">MINI GAMES</button>
            <button data-action="hub_log">MISSION LOG</button>
          </div>
        </div>

        <div class="block">
          <button data-action="lock">← RETURN TO ID SCREEN</button>
        </div>
      </div>
    `);

    this.startCountdown();
  }

  showPlaceholder(title){
    this.state = "PLACEHOLDER";
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
        <button data-action="val">← RETURN TO VALENTINE HUB</button>
      </div>
    `);
  }

  // =========================
  // HINTS
  // =========================
  renderHints(hArr){
    const left = 3 - this.hintUsed;
    if(left <= 0) return "";

    // show remaining hint buttons (up to 3 total)
    let btns = "";
    for(let i=0; i<left; i++){
      btns += `<button data-action="hint_${i}">HINT ${this.hintUsed + i + 1}</button>`;
    }

    return `
      <div class="block">
        <div class="smallHdr">HINTS</div>
        <div class="hr"></div>
        <div class="menuWrap">${btns}</div>
      </div>
    `;
  }

  renderHintLog(){
    if(!this.hintLog.length) return "";
    const lines = this.hintLog.map((t, idx) => `HINT ${idx+1}: ${t}`).join("\n");
    return `
      <div class="block" style="opacity:.9;">
        <div class="smallHdr">HINT LOG</div>
        <div class="hr"></div>
        <div style="white-space:pre-wrap; line-height:1.45; font-size:14px;">
${lines}
        </div>
      </div>
    `;
  }

  useHint(which){
    const currentHints = (this.state === "FINAL") ? this.finalQ.h : this.riddles[this.rIndex].h;

    if(this.hintUsed >= 3) return;
    const hintText = currentHints[this.hintUsed];
    if(!hintText) return;

    this.hintLog.push(hintText);
    this.hintUsed++;

    // rerender same screen
    this.ui.dip();
    if(this.state === "FINAL") this.showFinal();
    else this.showRiddle();
  }

  // =========================
  // INPUT
  // =========================
  handleSubmit(value){
    const raw = value || "";
    const norm = this.normalize(raw);

    // LOCK: accept either main ID or NEXT_ID
    if(this.state === "LOCK"){
      const valid = this.normalize(this.VALID_ID);
      const next = this.normalize(this.NEXT_ID);

      if(norm === valid){
        this.ui.dip();
        this.rIndex = 0;
        this.hintUsed = 0;
        this.hintLog = [];
        this.showRiddle();
        return;
      }

      if(norm === next){
        this.ui.dip();
        this.showValentineHub();
        return;
      }

      this.ui.dip();
      this.ui.setStatus("ACCESS DENIED — TRY AGAIN");
      this.ui.showInput("ENTER ID");
      return;
    }

    // RIDDLE
    if(this.state === "RIDDLE"){
      const r = this.riddles[this.rIndex];
      const ans = (raw || "").trim().toLowerCase();

      if(ans === r.a.toLowerCase()){
        this.ui.dip();
        this.ui.setStatus("ANSWER ACCEPTED");
        // move next after a small beat
        setTimeout(() => {
          this.rIndex++;
          this.hintUsed = 0;
          this.hintLog = [];

          if(this.rIndex >= this.riddles.length){
            this.showFinal();
          }else{
            this.showRiddle();
          }
        }, 250);
      }else{
        this.ui.dip();
        this.ui.setStatus("ANSWER REJECTED — TRY AGAIN");
        this.showRiddle();
      }
      return;
    }

    // FINAL
    if(this.state === "FINAL"){
      if(raw.trim() === this.finalQ.a){
        this.ui.dip();
        this.ui.setStatus("CODE ACCEPTED");
        setTimeout(() => this.showBriefcaseCode(), 250);
      }else{
        this.ui.dip();
        this.ui.setStatus("CODE INVALID — TRY AGAIN");
        this.showFinal();
      }
      return;
    }
  }

  // Click routes (buttons)
  handleClick(action){
    // always allow returning to lock (ID screen)
    if(action === "lock"){
      this.showLock();
      return;
    }

    if(action === "val"){
      this.showValentineHub();
      return;
    }

    // hints
    if(action && action.startsWith("hint_")){
      this.useHint(action);
      return;
    }

    // hub modules
    if(action === "hub_info") return this.showPlaceholder("INFO");
    if(action === "hub_reward") return this.showPlaceholder("REWARD QUIZ");
    if(action === "hub_mini") return this.showPlaceholder("MINI GAMES");
    if(action === "hub_log") return this.showPlaceholder("MISSION LOG");
  }

  // =========================
  // COUNTDOWN (VAL HUB)
  // =========================
  startCountdown(){
    this.stopTimer();

    const target = new Date(2026, 1, 14, 0, 0, 0); // Feb(1) 14 2026 00:00 local
    const dEl = document.getElementById("dLeft");
    const tEl = document.getElementById("tLeft");

    const pad = (n) => String(n).padStart(2, "0");

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