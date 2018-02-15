import {
  glMatrix,
  mat2, mat2d, mat3, mat4,
  quat,
  vec2, vec3, vec4,
} from './gl-matrix.js';

import { MFWebGLObject } from './mf-webgl-object.js';
import { MFWebGLTutMaterial } from './mf-webgl-tut-material.js';
import { MFWebGLModel } from './mf-webgl-model.js';
import { MFWebGLScene } from './mf-webgl-scene.js';

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
    /**/ this.triangleRot = 0;
    this.lastTime = (new Date()).getTime();
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
    this.init();
    this.constructing = false;
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
    if (!this.constructing)
      this.render(true);
  }

  /**
   * Initialize all required attributes and variables
   */
  init() {
    this.material = new MFWebGLTutMaterial(this.gl);

    this.triangle = MFWebGLTutMaterial.getObject(
        this.gl,
        [
            [  0.0,  1.0,  0.0 ],
            [ -1.0, -1.0,  0.0 ],
            [  1.0, -1.0,  0.0 ]
        ],
        [
            [ 1.0, 0.0, 0.0, 1.0 ],
            [ 0.0, 1.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0, 1.0 ]
        ],
        this.gl.TRIANGLES,
        this.material
    );
    this.triangle.position = [-1.5, 0.0, -7.0];

    this.square = MFWebGLTutMaterial.getObject(
        this.gl,
        [
            [  1.0,  1.0,  0.0 ],
            [ -1.0,  1.0,  0.0 ],
            [  1.0, -1.0,  0.0 ],
            [ -1.0, -1.0,  0.0 ]
        ],
        [
            [ 0.5, 0.5, 1.0, 1.0 ],
            [ 0.5, 0.5, 1.0, 1.0 ],
            [ 0.5, 0.5, 1.0, 1.0 ],
            [ 0.5, 0.5, 1.0, 1.0 ]
        ],
        this.gl.TRIANGLE_STRIP,
        this.material
    );
    this.square.position = [1.5, 0.0, -7.0];

    this.scene = new MFWebGLScene([this.triangle, this.square]);

    this.mvMatrix = mat4.create();
    this.pMatrix = mat4.create();
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
   * Returns the time that passed since the last call to timePassed()
   * @return {number} the time in milliseconds
   */
  timePassed() {
    const timeNow = (new Date()).getTime();
    const retTime = timeNow - this.lastTime;
    this.lastTime = timeNow;
    return retTime;
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

    const gl = this.gl, pMatrix = this.pMatrix, mvMatrix = this.mvMatrix,
        triangle = this.triangle;

    gl.viewportWidth = this.canvas.width;
    gl.viewportHeight = this.canvas.height;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
    mat4.identity(mvMatrix);

    triangle.rotate = [MFWebGL.degToRad(this.triangleRot), [0, 1, 0]];

    this.scene.render(mvMatrix, pMatrix);

    this.triangleRot += 360 * time / 1000.0;
  }
}

export default MFWebGL;
