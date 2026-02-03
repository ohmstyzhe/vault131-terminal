export class UI {
  constructor(audio) {
    this.audio = audio;

    this.output = document.getElementById("output");
    this.form = document.getElementById("inputForm");
    this.input = document.getElementById("terminalInput");
    this.audioBtn = document.getElementById("audioBtn");

    this.onSubmit = null;

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const v = this.input.value.trim();
      if (!v) return;
      this.print(`> ${v}`, "dim");
      this.input.value = "";
      if (this.onSubmit) this.onSubmit(v);
    });

    this.audioBtn.addEventListener("click", async () => {
      const enabled = await this.audio.toggle();
      await this.audio.click();
      this.audioBtn.textContent = enabled ? "AUDIO: ON" : "AUDIO: OFF";
      this.audioBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
      this.input.focus();
    });

    // focus convenience
    setTimeout(() => this.input.focus(), 50);
  }

  clear() {
    this.output.innerHTML = "";
  }

  print(text, cls = "line") {
    const p = document.createElement("p");
    p.className = `line ${cls}`;
    p.textContent = text;
    this.output.appendChild(p);
    this.output.scrollTop = this.output.scrollHeight;
  }

  async type(text, cls = "line", speed = 12) {
    const p = document.createElement("p");
    p.className = `line ${cls}`;
    this.output.appendChild(p);

    for (let i = 0; i < text.length; i++) {
      p.textContent += text[i];
      this.output.scrollTop = this.output.scrollHeight;
      await new Promise((r) => setTimeout(r, speed));
    }
  }

  setPlaceholder(text) {
    this.input.placeholder = text;
  }

  focus() {
    this.input.focus();
  }
}