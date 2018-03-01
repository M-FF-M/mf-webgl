/**
 * A texture loader
 */
class MFWebGLTextureLoader {
  /**
   * Create a new MFWebGLTextureLoader
   */
  constructor() {
    this.infodiv = document.createElement('div');
    this.infodiv.style.position = 'fixed';
    this.infodiv.style.right = '0.2em';
    this.infodiv.style.bottom = '0.2em';
    this.infodiv.style.padding = '0.5em';
    this.infodiv.style.borderRadius = '0.25em';
    this.infodiv.style.backgroundColor = '#fffde7';
    this.infodiv.style.color = '#2e7d32';
    this.infodiv.style.fontFamily = 'Muli, \'Segoe UI\', Roboto, sans-serif';
    this.infoSpan = document.createElement('span');
    this.infoSpan.innerHTML = 'Texture loader: loading&hellip; 0/0';
    this.infodiv.appendChild(this.infoSpan);
    this.texturesTotal = 0;
    this.texturesProcessed = 0;
    this.textureError = 0;
    this.started = false;
    this.visible = true;
    document.body.appendChild(this.infodiv);
    this.handleLoadedImage = this.handleLoadedImage.bind(this);
    this.handleErrorImage = this.handleErrorImage.bind(this);
    this.hide = this.hide.bind(this);
    this.loadListeners = [];
  }

  /**
   * Add an event listener to this texture loader
   * @param {string} type - the type of the event listener, currently only 'load' is available
   * @param {Function} func - the event listener that will be called when all textures have
   * been loaded
   */
  addEventListener(type, func) {
    if (type === 'load')
      this.loadListeners.push(func);
  }

  /**
   * Hide the texture loader
   */
  hide() {
    if (this.visible) {
      this.visible = false;
      document.body.removeChild(this.infodiv);
    }
  }

  /**
   * Update the information that is displayed to the user
   */
  updateDisplay() {
    this.infoSpan.innerHTML =
        `Texture loader: loading&hellip; ${this.texturesProcessed}/${this.texturesTotal}`;
    if (this.started && this.texturesProcessed === this.texturesTotal) {
      let br = document.createElement('br');
      let infotxt = document.createElement('span');
      infotxt.innerHTML = `Loading finished. ${this.textureError} error(s).`;
      this.infodiv.appendChild(br);
      this.infodiv.appendChild(infotxt);
      for (let i=0; i<this.loadListeners.length; i++)
        window.setTimeout(() => this.loadListeners[i](), 1000);
      window.setTimeout(() => this.hide(), 5000);
    }
  }

  /**
   * Start this texture loader
   */
  start() {
    this.started = true;
    this.updateDisplay();
  }

  /**
   * Add a new texture to load
   * @param {string} str - the path to the texture (image file)
   */
  addTexture(str) {
    let img = new Image();
    img.addEventListener('load', () => this.handleLoadedImage());
    img.addEventListener('error', () => this.handleErrorImage(str));
    img.src = str;
    this.texturesTotal++;
    this.updateDisplay();
  }

  /**
   * Used internally when an image has been loaded
   */
  handleLoadedImage() {
    this.texturesProcessed++;
    this.updateDisplay();
  }

  /**
   * Used internally when an error occurred
   */
  handleErrorImage(file) {
    this.texturesProcessed++;
    this.textureError++;
    let br = document.createElement('br');
    let infotxt = document.createElement('span');
    infotxt.innerHTML = `Could not load: ${file}.`;
    this.infodiv.appendChild(br);
    this.infodiv.appendChild(infotxt);
    this.updateDisplay();
  }
}

export { MFWebGLTextureLoader };
