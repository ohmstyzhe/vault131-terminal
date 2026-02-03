export class Game {
  constructor(ui, audio) {
    this.ui = ui;
    this.audio = audio;

    this.state = "ID";
    this.user = "IZABELLA";
    this.allowedId = "101-317-76"; // change to your 8-digit
  }

  async start() {
    this.ui.clear();

    this.ui.print("VAULT 131 DATABASE | STATUS: LOCKED", "hdr");
    this.ui.print("STANDBY... AWAITING INPUT", "dim");
    this.ui.print("", "line");
    this.ui.print("VAULT 131 DATABASE", "hdr");
    this.ui.print("SECURITY: ENABLED", "hdr");
    this.ui.print("ENTER IDENTIFICATION:", "hdr");

    this.ui.setPlaceholder("ENTER ID");
    this.ui.focus();
  }

  async handleInput(value) {
    if (this.state === "ID") return this.handleId(value);
    if (this.state === "MENU") return this.handleMenu(value);

    this.ui.print("SYSTEM: UNKNOWN STATE", "warn");
  }

  async handleId(value) {
    const cleaned = value.replace(/\D/g, "");

    if (cleaned !== this.allowedId) {
      this.ui.print("ACCESS DENIED.", "warn");
      this.ui.print("TIP: ENTER 8-DIGIT ID", "dim");
      return;
    }

    this.state = "MENU";
    await this.ui.type("ACCESS GRANTED...", "ok", 14);
    await this.ui.type(`USER: ${this.user}`, "hdr", 10);
    this.ui.print("", "line");
    this.ui.print("1) OPEN VALENTINE HUB", "hdr");
    this.ui.print("2) SYSTEM STATUS", "hdr");
    this.ui.print("3) LOG OUT", "hdr");
    this.ui.setPlaceholder("TYPE 1 / 2 / 3");
  }

  async handleMenu(value) {
    const v = value.trim();

    if (v === "1") {
      await this.ui.type("OPENING VALENTINE HUB...", "ok", 12);
      this.ui.print("VALENTINE HUB: ONLINE", "hdr");
      this.ui.print("COUNTDOWN: ACTIVE", "hdr");
      this.ui.print("(your existing hub screen content can go here)", "dim");
      return;
    }

    if (v === "2") {
      this.ui.print("STATUS: OPERATIONAL", "ok");
      this.ui.print("POWER: STABLE", "ok");
      this.ui.print("DISPLAY: CRT MODE", "ok");
      return;
    }

    if (v === "3") {
      this.state = "ID";
      await this.ui.type("LOGGING OUT...", "dim", 12);
      await this.start();
      return;
    }

    this.ui.print("INVALID OPTION. TYPE 1 / 2 / 3.", "warn");
  }
}