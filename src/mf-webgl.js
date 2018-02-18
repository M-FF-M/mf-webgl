import {
  glMatrix,
  mat2, mat2d, mat3, mat4,
  quat,
  vec2, vec3, vec4,
} from './gl-matrix.js';

/**
 * A class for making using WegGL easier
 */
class MFWebGL {
  /** FULLSCREEN mode flag - sets the canvas size to full screen */
  static get FULLSCREEN() { return 1; }
  /** FIXEDSIZE mode flag - sets a fixed canvas size */
  static get FIXEDSIZE() { return 2; }
  /** USERDEFINED mode flag - allows a dynamic, user defined canvas size */
  static get USERDEFINED() { return 3; }
  /** ADDTOBODY mode flag - adds the canvas to the body element */
  static get ADDTOBODY() { return 1 << 4; }
  /** ADDTOELEMENT mode flag - adds the canvas to a HTMLElement */
  static get ADDTOELEMENT() { return 2 << 4; }
  /** DONTADD mode flag - doesn't add the canvas to the DOM tree */
  static get DONTADD() { return 3 << 4; }

  /**
   * Converts degrees to radians
   * @param {number} degrees - an angle in degrees
   * @return {number} the same angle in radians
   */
  static degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Converts radians to degrees
   * @param {number} radians - an angle in radians
   * @return {number} the same angle in degrees
   */
  static radToDeg(radians) {
    return radians * 180 / Math.PI;
  }

  /**
   * Create a new MFWebGL instance
   * @param {number} mode - change the mode by using the flags FULLSCREEN, FIXEDSIZE, USERDEFINED,
   * ADDTOBODY, ADDTOELEMENT and DONTADD (combine with bitwise OR)
   * @param {number} width - the width of the canvas (in FIXEDSIZE and USERDEFINED mode)
   * @param {number} height - the height of the canvas (in FIXEDSIZE and USERDEFINED mode)
   * @param {HTMLElement} elem - the HTMLElement the canvas should be added to (in ADDTOELEMENT
   * mode)
   */
  constructor(mode = MFWebGL.FULLSCREEN | MFWebGL.ADDTOBODY, width = 500, height = 300,
              elem = null) {
    this.constructing = true;
    this.render = this.render.bind(this);
    this.resize = this.resize.bind(this);
    this.renderLoop = false;
    this.startTime = (new Date()).getTime();
    this.lastTime = this.startTime;
    this.mode = mode;
    const fl_b = this.mode & 0b11110000;
    this.canvas = document.createElement('canvas');
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
    this.resize();
    if (fl_b == MFWebGL.ADDTOBODY) {
      this.canvas.style.position = 'absolute';
      this.canvas.style.left = '0px';
      this.canvas.style.top = '0px';
      this.canvas.style.zIndex = '1';
      document.body.appendChild(this.canvas);
    } else if (fl_b == MFWebGL.ADDTOELEMENT && elem != null)
      elem.appendChild(this.canvas);
    this.gl = this.canvas.getContext("webgl");
    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
    this.renderListeners = [];
    this.wasResized = true;
    this.scene = null;
    this.camera = null;
    this.constructing = false;
  }

  /**
   * Add an event listener to this MFWebGL instance. The listeners will be called with
   * the following parameters:
   * - type 'render': (timeSinceStart, timeSinceLast) where timeSinceStart is the time in
   *   milliseconds since the last resetTimer() call and timeSinceLast is the time in
   *   milliseconds since the last frame (call to render())
   * @param {string} type - the type of event the listener wants to listen to. The follwing
   * parameters are possible: 'render'
   * @param {Function} listener - the event listener
   */
  addEventListener(type, listener) {
    if (type === 'render') this.renderListeners.push(listener);
  }

  /**
   * Reset the internal timer
   */
  resetTimer() {
    this.startTime = (new Date()).getTime();
    this.lastTime = this.startTime;
  }

  /**
   * Resize the canvas
   * @param {number} width - the new width of the canvas. This parameter has no effect if this
   * MFWebGL instance uses FULLSCREEN or FIXEDSIZE mode
   * @param {number} height - the new height of the canvas. This parameter has no effect if this
   * MFWebGL instance uses FULLSCREEN or FIXEDSIZE mode
   */
  resize(width, height) {
    const fl_a = this.mode & 0b1111;
    if (fl_a == MFWebGL.FULLSCREEN) {
      this.width = this.canvas.width = window.innerWidth;
      this.height = this.canvas.height = window.innerHeight;
    } else if (fl_a == MFWebGL.FIXEDSIZE) {
      this.canvas.width = this.width;
      this.canvas.height = this.height;
    } else if (typeof width === 'undefined') {
      this.width = this.canvas.width;
      this.height = this.canvas.height;
    } else {
      this.width = this.canvas.width = width;
      this.height = this.canvas.height = height;
    }
    this.wasResized = true;
    if (!this.constructing)
      this.render(true);
  }

  /**
   * Render the current scene in an infinte loop
   */
  animateRender() {
    if (!this.renderLoop) {
      this.renderLoop = true;
      this.render();
    }
  }

  /**
   * Stop the infinite rendering loop
   */
  stopRenderAnimation() {
    this.renderLoop = false;
  }

  /**
   * Returns the time that passed since the last call to timePassed() and since the last
   * call to resetTimer()
   * @return {Array} at index 0: the time in milliseconds since the last resetTimer() call,
   * at index 1: the time in milliseconds since the last timePassed() call
   */
  timePassed() {
    const timeNow = (new Date()).getTime();
    const retTime = timeNow - this.lastTime;
    this.lastTime = timeNow;
    return [timeNow - this.startTime, retTime];
  }

  /**
   * Render the current scene
   * @param {number} reqAniTimestamp - used to receive timestamps from requestAnimationFrame
   * @param {boolean} singleRender - set to true if you only want to render a single frame
   */
  render(reqAniTimestamp = 0.0, singleRender = false) {
    if (!singleRender && this.renderLoop)
      requestAnimationFrame(this.render);

    const time = this.timePassed();
    for (let i=0; i<this.renderListeners.length; i++)
      this.renderListeners[i](time[0], time[1]);

    if (this.scene === null || this.camera === null) {
      console.warn('Unable to render as no scene or no camera was specified!');
      return;
    }

    const gl = this.gl;
    let pMatrix = this.pMatrix, mvMatrix = this.mvMatrix;

    gl.viewportWidth = this.canvas.width;
    gl.viewportHeight = this.canvas.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (this.wasResized)
      this.pMatrix = pMatrix = this.camera.pMatrix(gl.viewportWidth, gl.viewportHeight);
    this.mvMatrix = mvMatrix = this.camera.mvMatrix();

    this.scene.render(mvMatrix, pMatrix);
    this.wasResized = false;
  }
}

export default MFWebGL;
