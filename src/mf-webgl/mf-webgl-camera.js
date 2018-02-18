import {
  glMatrix,
  mat2, mat2d, mat3, mat4,
  quat,
  vec2, vec3, vec4,
} from '../gl-matrix.js';

/**
 * Represents a camera for rendering the scene
 */
class MFWebGLCamera {
  /** Flag for creating a perspective camera */
  static get PERSPECTIVE() { return 0; }
  /** Flag for creating an orthographic camera */
  static get ORTHOGRAPHIC() { return 1; }

  /**
   * Create a new MFWebGLCamera
   * @param {number} type - the camera type, PERSPECTIVE or ORTHOGRAPHIC
   * @param {number} viewAngle - the angle for the vertical field of view in degrees, or, if
   * the type is set to ORTHOGRAPHIC, the height of the visible area
   * @param {number} near - objects that are closer to the camera than near will not be rendered
   * @param {number} far - objects that are further away from the camera than far will not
   * be rendered
   */
  constructor(type = MFWebGLCamera.PERSPECTIVE, viewAngle = Math.PI/4, near = 0.1, far = 100.0) {
    this.type = type;
    this.viewAngle = viewAngle;
    this.near = near;
    this.far = far;
    this.position = [0, 0, 0];
    this.lookAt = [0, 0, -1];
    this.tilt = [0, 1, 0];
  }

  /**
   * Get the projection matrix for this camera
   * @param {number} vWidth - the width of the viewport
   * @param {number} vHeight - the height of the viewport
   * @return {mat4} - the projection matrix
   */
  pMatrix(vWidth, vHeight) {
    const pMatrix = mat4.create();
    if (this.type == MFWebGLCamera.PERSPECTIVE)
      mat4.perspective(pMatrix, this.viewAngle, vWidth / vHeight, this.near, this.far);
    else if (this.type == MFWebGLCamera.ORTHOGRAPHIC)
      mat4.ortho(pMatrix, ((-this.viewAngle/2)/vHeight)*vWidth, ((this.viewAngle/2)/vHeight)*vWidth,
          -this.viewAngle/2, this.viewAngle/2, this.near, this.far);
    return pMatrix;
  }

  /**
   * Get the model view matrix for this camera
   * @return {mat4} - the model view matrix
   */
  mvMatrix() {
    const mvMatrix = mat4.create();
    mat4.lookAt(mvMatrix, this.position, this.lookAt, this.tilt);
    return mvMatrix;
  }
}

export { MFWebGLCamera };
