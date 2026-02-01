export class Game {
  constructor(ui, audio){
    this.ui = ui;
    this.audio = audio;

    this.ID = "101-317-76";
    this.NEXT_ID = "14-LOVE-READY";
    this.FINAL_CODE = "531";
    this.OVERRIDE_ID = "ADMIN-531";

    this.stage = "login";
    this._countdownTimer = null;

    this.loadMsgs = [
      "ACCESSING VAULT RECORDS…",
      "DECRYPTING MEMORY SECTORS…",
      "VERIFYING EMOTIONAL STABILITY…",
      "SYNCING PERSONAL DATA…",
      "VAULT-TEC PROTOCOL ACTIVE…"
    ];

    this.loadDetails = [
      "LINK: VAULTNET/131 :: HANDSHAKE OK",
      "SECURITY: HASHING CREDENTIALS",
      "CORE: SPINNING UP MODULES",
      "VAULT-TEC: INTEGRITY 100%"
    ];
  }

  start(){
    this.boot();
  }

  _stopCountdown(){
    if (this._countdownTimer){
      clearInterval(this._countdownTimer);
      this._countdownTimer = null;
    }
  }

  async boot(){
    this._stopCountdown();
    this.stage = "login";

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

  _getValentineTarget(){
    const now = new Date();
    const year = now.getFullYear();

    // target Feb 14, 00:00:00 local time
    let target = new Date(year, 1, 14, 0, 0, 0);

    // if already past Feb 14 this year, use next year
    if (now.getTime() > target.getTime()){
      target = new Date(year + 1, 1, 14, 0, 0, 0);
    }
    return target;
  }

  _getCountdownModel(){
    const now = new Date();
    const target = this._getValentineTarget();
    let diff = Math.max(0, target.getTime() - now.getTime());

    const totalSec = Math.floor(diff / 1000);
    const days = Math.floor(totalSec / 86400);
    const rem = totalSec % 86400;

    const hh = String(Math.floor(rem / 3600)).padStart(2, "0");
    const mm = String(Math.floor((rem % 3600) / 60)).padStart(2, "0");
    const ss = String(rem % 60).padStart(2, "0");

    const month = String(target.getMonth() + 1).padStart(2,"0");
    const day = String(target.getDate()).padStart(2,"0");

    return {
      days,
      timeText: `${hh}:${mm}:${ss}`,
      targetText: `${month}/${day}/${target.getFullYear()} 00:00`
    };
  }

  async showValentineHub(){
    this._stopCountdown();
    this.stage = "valHub";

    this.ui.setHeaderUnlocked("IZABELLA");
    this.ui.setStatus("VALENTINE ACCESS: ACTIVE");

    const model = this._getCountdownModel();

    this.ui.showValentineHub(model, {
      onStats: () => this.showVaultStats(),
      onQuiz: () => this.showRewardQuiz(),
      onMiniGames: () => this.showMiniGames(),
      onMissionLog: () => this.showMissionLog(),
    });

    // live update every second
    this._countdownTimer = setInterval(() => {
      if (this.stage !== "valHub") return;
      const m = this._getCountdownModel();
      this.ui.updateValentineCountdown(m.days, m.timeText);
    }, 1000);
  }

  async showVaultStats(){
    this._stopCountdown();
    this.stage = "subscreen";
    this.ui.clear();
    this.ui.setStatus("VAULT STATS");

    await this.ui.type([
      "VAULT 131: SYSTEM DIAGNOSTICS",
      "-----------------------------",
      "Build time: 3 days",
      "Coffee consumed: classified",
      "Emotional intent: 100%",
      "Bug count: aggressively reduced",
      "",
      "Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async showRewardQuiz(){
    this._stopCountdown();
    this.stage = "subscreen";
    this.ui.clear();
    this.ui.setStatus("REWARD QUIZ");

    await this.ui.type([
      "REWARD QUIZ MODULE LOADED",
      "",
      "This will be the cute rewards thing.",
      "We’ll build it next.",
      "",
      "Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async showMiniGames(){
    this._stopCountdown();
    this.stage = "subscreen";
    this.ui.clear();
    this.ui.setStatus("MINI GAMES");

    await this.ui.type([
      "MINI GAMES MODULE LOADED",
      "",
      "This will be your little game menu.",
      "We’ll build it next.",
      "",
      "Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async showMissionLog(){
    this._stopCountdown();
    this.stage = "subscreen";
    this.ui.clear();
    this.ui.setStatus("MISSION LOG");

    await this.ui.type([
      "MISSION LOG // VAULT 131",
      "------------------------",
      "1) Secure Valentine Access",
      "2) Deliver reward sequence",
      "3) Execute mission: romance",
      "",
      "Press ENTER to return."
    ], 30);

    this.ui.showInput("PRESS ENTER");
  }

  async handleInput(raw){
    const a = (raw || "").trim().toLowerCase();

    if (this.stage === "login"){
      this.ui.setStatus("VALIDATING…");

      if (a === this.OVERRIDE_ID.toLowerCase()){
        this.ui.setHeaderUnlocked("IZABELLA");
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        // you can route override wherever you want later
        return this.showValentineHub();
      }

      if (a === this.ID.toLowerCase()){
        this.ui.setHeaderUnlocked("IZABELLA");
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        // keep your riddle flow later if you want — for now send to hub
        return this.showValentineHub();
      }

      if (a === this.NEXT_ID.toLowerCase()){
        await this.ui.loading(this.loadMsgs, this.loadDetails);
        await this.ui.powerDip();
        return this.showValentineHub();
      }

      await this.ui.type(["✖ INVALID ID", "> "], 35);
      this.ui.setStatus("ACCESS DENIED");
      this.ui.showInput("ENTER ID");
      return;
    }

    // any subscreen returns to hub on ENTER
    if (this.stage === "subscreen"){
      return this.showValentineHub();
    }

    // hub ignores enter (optional)
    if (this.stage === "valHub"){
      return;
    }
  }
}