export class Game{
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    this.state = "login"; // login -> hub -> modules
    this.countdownTimer = null;
  }

  start(){
    // ALWAYS start at login screen
    this.showLogin();
  }

  handleInput(raw){
    const value = (raw || "").trim().toUpperCase();

    if (this.state === "login"){
      if (!value){
        this.ui.powerDip();
        this.ui.print(">> ERROR: ID REQUIRED");
        return;
      }
      // Accept anything non-empty (you can make this stricter later)
      this.ui.powerDip();
      this.showHub();
      return;
    }

    if (this.state === "hub"){
      // allow tap shortcuts
      if (value === "1") return this.showPlaceholder("COMPLETED", "MODULE INDEX COMPLETE.\nPRESS ENTER TO RETURN.");
      if (value === "2") return this.showPlaceholder("VAULT STATS", "VAULT STATS MODULE LOADED.\nPRESS ENTER TO RETURN.");
      if (value === "3") return this.showRewardQuiz();
      if (value === "4") return this.showPlaceholder("MINI GAMES", "MINI GAMES MODULE LOADED.\nPRESS ENTER TO RETURN.");
      if (value === "5") return this.showPlaceholder("MISSION LOG", "MISSION LOG MODULE LOADED.\nPRESS ENTER TO RETURN.");

      this.ui.powerDip();
      this.ui.print(">> INVALID SELECTION. ENTER 1–5.");
      return;
    }

    if (this.state === "placeholder"){
      // any ENTER returns
      return this.showHub();
    }

    if (this.state === "rewardQuiz"){
      // reward quiz flow
      return this.rewardHandle(value);
    }
  }

  showLogin(){
    this.stopCountdown();
    this.state = "login";

    this.ui.clear();
    this.ui.setStatus("STANDBY… AWAITING INPUT");
    this.ui.setInput("ENTER ID", true);

    this.ui.print([
      "VAULT 131 DATABASE",
      "SECURITY: ENABLED",
      "ENTER IDENTIFICATION:",
      "> "
    ]);

    this.ui.setHints([
      {label:"AUTO-FILL ID", value:"131-IZABELLA"},
    ]);
  }

  showHub(){
    this.state = "hub";
    this.ui.clear();
    this.ui.setStatus("VALENTINE ACCESS: ACTIVE");
    this.ui.setInput("ENTER SELECTION (1–5)", true);

    // Build the Valentine Hub HTML (includes watermark ONLY here)
    this.ui.renderHTML(`
      <div class="valHub">
        <div class="valBg"></div>

        <div class="valTopRow">
          <div class="valBlock">
            <div class="valTitle">VAULT-TEC STATUS | VALENTINE ACCESS</div>
            <div class="valCountdown">
              <div class="valBig" id="daysLeft">-- DAYS</div>
              <div class="valSmall" id="timeLeft">--:--:--</div>
            </div>
          </div>

          <div class="valBlock">
            <div class="valTitle">COUNTDOWN TARGET</div>
            <div class="valSmall" id="targetText">02/14/2026 00:00</div>
          </div>
        </div>

        <div class="valNote">
          This module is live.<br/>
          Countdown is active until Valentine’s Day.<br/>
          (Yes, this is extremely official.)
        </div>

        <div class="valMenu">
          <button type="button" data-pick="1">1) COMPLETED</button>
          <button type="button" data-pick="2">2) VAULT STATS</button>
          <button type="button" data-pick="3">3) REWARD QUIZ</button>
          <button type="button" data-pick="4">4) MINI GAMES</button>
          <button type="button" data-pick="5">5) MISSION LOG</button>
        </div>
      </div>
    `);

    // Hook hub buttons to input handler
    document.querySelectorAll("[data-pick]").forEach(btn => {
      btn.addEventListener("click", () => this.handleInput(btn.getAttribute("data-pick")));
    });

    this.startCountdown();
  }

  startCountdown(){
    this.stopCountdown();

    const target = new Date("2026-02-14T00:00:00"); // local time
    const targetText = document.getElementById("targetText");
    if (targetText) targetText.textContent = "02/14/2026 00:00";

    const tick = () => {
      const now = new Date();
      let diff = target.getTime() - now.getTime();
      if (diff < 0) diff = 0;

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const rem = totalSeconds % 86400;
      const hrs = Math.floor(rem / 3600);
      const mins = Math.floor((rem % 3600) / 60);
      const secs = rem % 60;

      const daysEl = document.getElementById("daysLeft");
      const timeEl = document.getElementById("timeLeft");

      if (daysEl) daysEl.textContent = `${days} DAYS`;
      if (timeEl) timeEl.textContent =
        `${String(hrs).padStart(2,"0")}:${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`;
    };

    tick();
    this.countdownTimer = setInterval(tick, 1000);
  }

  stopCountdown(){
    if (this.countdownTimer){
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  showPlaceholder(title, body){
    this.stopCountdown();
    this.state = "placeholder";
    this.ui.clear();
    this.ui.setStatus(title);
    this.ui.setInput("PRESS ENTER", true);

    this.ui.print([
      `${title} MODULE LOADED`,
      "",
      body
    ]);

    this.ui.setHints([
      {label:"RETURN", value:""},
    ]);
  }

  // =========================
  // REWARD QUIZ (REAL FLOW)
  // =========================
  showRewardQuiz(){
    this.stopCountdown();
    this.state = "rewardQuiz";
    this.rewardStep = 0;
    this.rewardAnswers = {};

    this.ui.clear();
    this.ui.setStatus("REWARD QUIZ");
    this.ui.setInput("ENTER OPTION", true);

    this.ui.print([
      "REWARD QUIZ MODULE LOADED",
      "Answer a few prompts… then your reward prints.",
      ""
    ]);

    this.askRewardStep();
  }

  askRewardStep(){
    const steps = [
      {
        q: "Pick the vibe:",
        options: [
          ["1", "COZY"],
          ["2", "CHAOTIC CUTE"],
          ["3", "ROMANTIC"],
          ["4", "ADVENTURE"]
        ]
      },
      {
        q: "Pick the snack:",
        options: [
          ["1", "SWEET"],
          ["2", "SALTY"],
          ["3", "BOTH"],
          ["4", "SURPRISE ME"]
        ]
      },
      {
        q: "Pick the activity:",
        options: [
          ["1", "MOVIE NIGHT"],
          ["2", "GAME NIGHT"],
          ["3", "DINNER DATE"],
          ["4", "LATE NIGHT DRIVE"]
        ]
      }
    ];

    const step = steps[this.rewardStep];

    // finished
    if (!step){
      return this.printReward();
    }

    this.ui.print([
      step.q,
      ...step.options.map(o => `${o[0]}) ${o[1]}`),
      ""
    ]);

    this.ui.setHints(step.options.map(o => ({ label: `${o[0]}) ${o[1]}`, value: o[0] })));
  }

  rewardHandle(value){
    if (!value){
      // Enter with empty returns to hub
      return this.showHub();
    }

    const allowed = ["1","2","3","4"];
    if (!allowed.includes(value)){
      this.ui.powerDip();
      this.ui.print(">> INVALID. ENTER 1–4.");
      return;
    }

    this.rewardAnswers[`s${this.rewardStep}`] = value;
    this.rewardStep += 1;
    this.ui.powerDip();
    this.askRewardStep();
  }

  printReward(){
    // Build a cute “reward” based on answers
    const vibe = this.rewardAnswers.s0;
    const snack = this.rewardAnswers.s1;
    const act = this.rewardAnswers.s2;

    const vibeWord = ({ "1":"COZY", "2":"CHAOTIC CUTE", "3":"ROMANTIC", "4":"ADVENTURE" })[vibe];
    const snackWord = ({ "1":"SWEET", "2":"SALTY", "3":"SWEET+SALTY", "4":"MYSTERY SNACK" })[snack];
    const actWord = ({ "1":"MOVIE NIGHT", "2":"GAME NIGHT", "3":"DINNER DATE", "4":"LATE NIGHT DRIVE" })[act];

    const rewards = [
      "Reward: 1 premium cuddle session + forehead kisses (non-negotiable).",
      "Reward: you pick the music for the next drive and I won’t skip a single song.",
      "Reward: snack delivery + blanket burrito mode + 1 romantic note read out loud.",
      "Reward: choice of dessert + I do the dishes (yes, really).",
      "Reward: 10-minute massage + ‘have a nice day’ smile bonus.",
      "Reward: you get to assign me one tiny mission for tomorrow."
    ];

    // small deterministic pick
    const idx = (parseInt(vibe)+parseInt(snack)+parseInt(act)) % rewards.length;

    this.ui.clear();
    this.ui.setStatus("REWARD QUIZ");
    this.ui.setInput("PRESS ENTER", true);

    this.ui.print([
      "REWARD QUIZ COMPLETE",
      "---------------------",
      `VIBE: ${vibeWord}`,
      `SNACK: ${snackWord}`,
      `ACTIVITY: ${actWord}`,
      "",
      rewards[idx],
      "",
      "Press ENTER to return."
    ]);

    this.ui.setHints([
      {label:"RETURN", value:""},
    ]);

    // treat as placeholder so ENTER returns
    this.state = "placeholder";
  }
}