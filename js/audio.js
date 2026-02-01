export class AudioSystem{
  constructor(){
    this.enabled = false;

    // Optional: if you later add an audio file, put it in /assets and update this path.
    // Keep it safe even if missing.
    try{
      this.ambience = new Audio("assets/ambience.mp3");
      this.ambience.loop = true;
      this.ambience.volume = 0.35;
    }catch(e){
      this.ambience = null;
    }
  }

  async enable(){
    this.enabled = true;
    if (this.ambience){
      try{
        await this.ambience.play();
      }catch(e){
        // iOS may block until user gesture; the button click is that gesture.
      }
    }
  }

  disable(){
    this.enabled = false;
    if (this.ambience){
      try{ this.ambience.pause(); }catch(e){}
    }
  }

  async toggle(){
    if (this.enabled) this.disable();
    else await this.enable();
  }
}