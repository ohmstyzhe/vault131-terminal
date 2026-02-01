export class UI{
  constructor(audio){
    this.audio = audio;
    this.terminal = document.getElementById("terminal");
    this.statusEl = document.getElementById("uiStatus");
    this.input = document.getElementById("inputBox");
    this.hints = document.getElementById("hintContainer");
    this.onSubmit = null;

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter"){
        const v = (this.input.value || "").trim();
        this.input.value = "";
        if (this.onSubmit) this.onSubmit(v);
      }
    });
  }

  setStatus(text){
    this.statusEl.textContent = text;
  }

  setAudioLabel(on){
    const b = document.getElementById("volBtn");
    b.textContent = on ? "AUDIO: ON" : "AUDIO: OFF";
  }

  clear(){
    this.terminal.innerHTML = "";
    this.hints.innerHTML = "";
  }

  print(lines = []){
    // lines can be string or array of strings
    if (typeof lines === "string") lines = [lines];
    for (const line of lines){
      const div = document.createElement("div");
      div.textContent = line;
      this.terminal.appendChild(div);
    }
    this.scrollToBottom();
  }

  setInput(placeholder = "ENTER", show = true){
    this.input.placeholder = placeholder;
    this.input.style.display = show ? "block" : "none";
    if (show) setTimeout(() => this.input.focus(), 0);
  }

  setHints(buttons = []){
    this.hints.innerHTML = "";
    buttons.forEach(({label, value}) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => {
        if (this.onSubmit) this.onSubmit(value);
      });
      this.hints.appendChild(btn);
    });
  }

  // Render a “screen” as HTML (for the Valentine Hub layout)
  renderHTML(html){
    this.terminal.innerHTML = html;
    this.scrollToBottom();
  }

  scrollToBottom(){
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  powerDip(){
    const dip = document.getElementById("powerDip");
    dip.classList.remove("powerDipOn");
    void dip.offsetWidth;
    dip.classList.add("powerDipOn");
  }
}