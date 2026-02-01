// js/game.js
import { startRewardQuiz } from "./reward.js";

function pad2(n) {
  return String(n).padStart(2, "0");
}

function getNextValentinesTarget() {
  // Always target Feb 14 of the next occurrence (this year or next year)
  const now = new Date();
  const year = now.getFullYear();
  const targetThisYear = new Date(year, 1, 14, 0, 0, 0); // Feb = 1
  return now <= targetThisYear ? targetThisYear : new Date(year + 1, 1, 14, 0, 0, 0);
}

function getCountdownParts(targetDate) {
  const now = new Date();
  let ms = targetDate.getTime() - now.getTime();
  if (ms < 0) ms = 0;

  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const rem = totalSeconds % 86400;
  const hours = Math.floor(rem / 3600);
  const mins = Math.floor((rem % 3600) / 60);
  const secs = rem % 60;

  return {
    days,
    timeText: `${pad2(hours)}:${pad2(mins)}:${pad2(secs)}`,
    targetText: `${pad2(targetDate.getMonth() + 1)}/${pad2(targetDate.getDate())}/${targetDate.getFullYear()} 00:00`,
  };
}

export class Game {
  constructor(ui, audio) {
    this.ui = ui;
    this.audio = audio;

    this.userName = "IZABELLA";

    this._hubInterval = null;
    this._target = getNextValentinesTarget();
  }

  start() {
    this.ui.setHeaderUnlocked(this.userName);
    this.ui.setStatus("STANDBY… AWAITING INPUT");

    // Start directly on hub for now
    this.showValentineHub();
  }

  stopHubTimer() {
    if (this._hubInterval) {
      clearInterval(this._hubInterval);
      this._hubInterval = null;
    }
  }

  showValentineHub() {
    this.stopHubTimer();

    const parts = getCountdownParts(this._target);

    this.ui.setHeaderUnlocked(this.userName);
    this.ui.setStatus("VALENTINE ACCESS: ACTIVE");

    this.ui.showValentineHub(
      {
        days: parts.days,
        timeText: parts.timeText,
        targetText: parts.targetText,
      },
      {
        onStats: () => this.showVaultStats(),
        onQuiz: () => this.showRewardQuiz(),
        onMiniGames: () => this.showMiniGames(),
        onMissionLog: () => this.showMissionLog(),
      }
    );

    // Live update the countdown every second while on hub
    this._hubInterval = setInterval(() => {
      const p = getCountdownParts(this._target);
      this.ui.updateValentineCountdown(p.days, p.timeText);
    }, 1000);
  }

  async showVaultStats() {
    this.stopHubTimer();
    this.ui.setStatus("VAULT STATS");
    this.ui.clear();
    this.ui.hideInput();
    this.ui.clearHints();

    await this.ui.type([
      "VAULT STATS MODULE LOADED",
      "",
      "STATUS: OPERATIONAL",
      "POWER: NOMINAL",
      "HEART RATE: (classified)",
      "",
      "Press ENTER to return.",
    ]);

    this.ui.showInput("PRESS ENTER");
    this.ui.onSubmit = () => {
      this.ui.onSubmit = null;
      this.showValentineHub();
    };
  }

  showRewardQuiz() {
    this.stopHubTimer();
    startRewardQuiz(this.ui, {
      onReturn: () => this.showValentineHub(),
    });
  }

  async showMiniGames() {
    this.stopHubTimer();
    this.ui.setStatus("MINI GAMES");
    this.ui.clear();
    this.ui.hideInput();
    this.ui.clearHints();

    await this.ui.type([
      "MINI GAMES MODULE LOADED",
      "",
      "We’ll build this next.",
      "Press ENTER to return.",
    ]);

    this.ui.showInput("PRESS ENTER");
    this.ui.onSubmit = () => {
      this.ui.onSubmit = null;
      this.showValentineHub();
    };
  }

  async showMissionLog() {
    this.stopHubTimer();
    this.ui.setStatus("MISSION LOG");
    this.ui.clear();
    this.ui.hideInput();
    this.ui.clearHints();

    await this.ui.type([
      "MISSION LOG MODULE LOADED",
      "",
      "MISSION 01: Secure Valentine (in progress)",
      "MISSION 02: Maintain cuteness (mandatory)",
      "",
      "Press ENTER to return.",
    ]);

    this.ui.showInput("PRESS ENTER");
    this.ui.onSubmit = () => {
      this.ui.onSubmit = null;
      this.showValentineHub();
    };
  }

  // If you still call this from somewhere else, keep it safe:
  handleInput(value) {
    // In this version, hub uses buttons + modules own input.
    // So we don't route numeric menu choices here right now.
  }
}