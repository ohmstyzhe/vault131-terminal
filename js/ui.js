export class UI {
  constructor(audio){
    this.audio = audio;
    this.terminal = document.getElementById("terminal");
    this.input = document.getElementById("inputBox");
    this.uiBar = document.getElementById("uiBar");
    this.uiStatus = document.getElementById("uiStatus");
    this.volBtn = document.getElementById("volBtn");
    this.powerDip = document.getElementById("powerDip");

    this.onSubmit = null;
    this.onClick = null;

    // button: audio toggle (first click unlocks audio on iOS)
    this.volBtn.addEventListener("click", async () => {
      await this.audio.toggle();
      this.volBtn.textContent = this.audio.enabled ? "AUDIO: ON" : "AUDIO: OFF";
      this.dip();
    });

    // submit on Enter
    this.input.addEventListener("keydown", (e) => {
      if(e.key === "Enter"){
        const v = (this.input.value || "").trim();
        this.input.value = "";
        if(this.onSubmit) this.onSubmit(v);
      }
    });

    // click delegation for menu/buttons
    this.terminal.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if(!btn) return;
      const action = btn.getAttribute("data-action");
      if(this.onClick) this.onClick(action);
    });
  }

  setHeader(text){ this.uiBar.textContent = text; }
  setStatus(text){ this.uiStatus.textContent = text; }

  clear(){
    this.terminal.innerHTML = "";
  }

  html(markup){
    this.terminal.innerHTML = markup;
    this.scrollBottom();
  }

  append(text){
    const pre = document.createElement("div");
    pre.style.whiteSpace = "pre-wrap";
    pre.textContent = text;
    this.terminal.appendChild(pre);
    this.scrollBottom();
  }

  showInput(placeholder=""){
    this.input.style.display = "block";
    this.input.placeholder = placeholder;
    // iOS focus sometimes needs a tiny delay
    setTimeout(() => this.input.focus(), 40);
  }

  hideInput(){
    this.input.style.display = "none";
    this.input.blur();
  }

  dip(){
    this.powerDip.classList.remove("powerDipOn");
    // restart animation
    void this.powerDip.offsetWidth;
    this.powerDip.classList.add("powerDipOn");
  }

  scrollBottom(){
    this.terminal.scrollTop = this.terminal.scrollHeight;
  }
}