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
    this.dir = [0, 0, -1];
    this.cameraRotation = mat4.create();
    this.lookMatrix = mat4.create();
    mat4.lookAt(this.lookMatrix, this.position, this.lookAt, this.tilt);
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
    mat4.copy(mvMatrix, this.lookMatrix);
    mat4.mul(mvMatrix, this.cameraRotation, mvMatrix);
    return mvMatrix;
  }

  /**
   * Set the way the camera is looking
   * @param {vec3} from - the camera position
   * @param {vec3} to - the position the camera is looking at
   * @param {vec3} tilt - the tilt, that is to say: a vector pointing to the top
   */
  setLookFromToTilt(from, to, tilt) {
    this.position = [from[0], from[1], from[2]];
    this.lookAt = [to[0], to[1], to[2]];
    this.tilt = [tilt[0], tilt[1], tilt[2]];
    const ab = vec3.create();
    vec3.sub(this.dir, this.lookAt, this.position);
    vec3.cross(ab, this.tilt, this.dir);
    vec3.cross(this.tilt, this.dir, ab);
    mat4.lookAt(this.lookMatrix, this.position, this.lookAt, this.tilt);
    mat4.identity(this.cameraRotation);
  }

  /**
   * Set the way the camera is looking
   * @param {vec3} from - the camera position
   * @param {vec3} to - the position the camera is looking at
   */
  setLookFromTo(from, to) {
    this.position = [from[0], from[1], from[2]];
    this.lookAt = [to[0], to[1], to[2]];
    const ab = vec3.create();
    vec3.sub(this.dir, this.lookAt, this.position);
    vec3.cross(ab, this.tilt, this.dir);
    vec3.cross(this.tilt, this.dir, ab);
    mat4.lookAt(this.lookMatrix, this.position, this.lookAt, this.tilt);
    mat4.identity(this.cameraRotation);
  }

  /**
   * Set the camera position
   * @param {number} x - the new x coordinate
   * @param {number} y - the new y coordinate
   * @param {number} z - the new z coordinate
   */
  setPosition(x, y, z) {
    this.position = [x, y, z];
    const ab = vec3.create();
    vec3.sub(this.dir, this.lookAt, this.position);
    vec3.cross(ab, this.tilt, this.dir);
    vec3.cross(this.tilt, this.dir, ab);
    mat4.lookAt(this.lookMatrix, this.position, this.lookAt, this.tilt);
    mat4.identity(this.cameraRotation);
  }

  /**
   * Set the position the camera is looking at
   * @param {number} x - the new x coordinate
   * @param {number} y - the new y coordinate
   * @param {number} z - the new z coordinate
   */
  setLookAt(x, y, z) {
    this.lookAt = [x, y, z];
    const ab = vec3.create();
    vec3.sub(this.dir, this.lookAt, this.position);
    vec3.cross(ab, this.tilt, this.dir);
    vec3.cross(this.tilt, this.dir, ab);
    mat4.lookAt(this.lookMatrix, this.position, this.lookAt, this.tilt);
    mat4.identity(this.cameraRotation);
  }

  /**
   * Set a new vector pointing to the top
   * @param {number} x - the new x coordinate
   * @param {number} y - the new y coordinate
   * @param {number} z - the new z coordinate
   */
  setTilt(x, y, z) {
    this.tilt = [x, y, z];
    const ab = vec3.create();
    vec3.sub(this.dir, this.lookAt, this.position);
    vec3.cross(ab, this.tilt, this.dir);
    vec3.cross(this.tilt, this.dir, ab);
    mat4.lookAt(this.lookMatrix, this.position, this.lookAt, this.tilt);
    mat4.identity(this.cameraRotation);
  }

  /**
   * Rotate the camera to the right
   * @param {number} delta - the rotation angle in radians
   */
  lookRight(delta) {
    const rotm = mat4.create();
    mat4.rotateY(rotm, rotm, delta);
    mat4.mul(this.cameraRotation, rotm, this.cameraRotation);
  }

  /**
   * Rotate the camera to the left
   * @param {number} delta - the rotation angle in radians
   */
  lookLeft(delta) {
    const rotm = mat4.create();
    mat4.rotateY(rotm, rotm, -delta);
    mat4.mul(this.cameraRotation, rotm, this.cameraRotation);
  }

  /**
   * Rotate the camera up
   * @param {number} delta - the rotation angle in radians
   */
  lookUp(delta) {
    const rotm = mat4.create();
    mat4.rotateX(rotm, rotm, -delta);
    mat4.mul(this.cameraRotation, rotm, this.cameraRotation);
  }

  /**
   * Rotate the camera down
   * @param {number} delta - the rotation angle in radians
   */
  lookDown(delta) {
    const rotm = mat4.create();
    mat4.rotateX(rotm, rotm, delta);
    mat4.mul(this.cameraRotation, rotm, this.cameraRotation);
  }

  /**
   * Tilt the camera to the left
   * @param {number} delta - the rotation angle in radians
   */
  tiltLeft(delta) {
    const rotm = mat4.create();
    mat4.rotateZ(rotm, rotm, -delta);
    mat4.mul(this.cameraRotation, rotm, this.cameraRotation);
  }

  /**
   * Tilt the camera to the right
   * @param {number} delta - the rotation angle in radians
   */
  tiltRight(delta) {
    const rotm = mat4.create();
    mat4.rotateZ(rotm, rotm, delta);
    mat4.mul(this.cameraRotation, rotm, this.cameraRotation);
  }

  /**
   * Used internally to move the camera
   * @param {vec3} tmp - the direction the camera should move in
   */
  moveCam(tmp) {
    const rInv = mat4.create();
    mat4.invert(rInv, this.cameraRotation);
    const lMatr = mat4.create();
    const lookAtB = vec3.create();
    vec3.sub(lookAtB, this.lookAt, this.position);
    mat4.lookAt(lMatr, [0, 0, 0], lookAtB, this.tilt);
    const lInv = mat4.create();
    mat4.invert(lInv, lMatr);

    vec3.transformMat4(tmp, tmp, rInv);
    vec3.transformMat4(tmp, tmp, lInv);
    vec3.add(this.position, this.position, tmp);
    vec3.add(this.lookAt, this.lookAt, tmp);

    mat4.lookAt(this.lookMatrix, this.position, this.lookAt, this.tilt);
  }

  /**
   * Move the camera to the right
   * @param {number} delta - the distance the camera should be moved
   */
  moveRight(delta) {
    const tmp = [1, 0, 0];
    vec3.scale(tmp, tmp, delta);
    this.moveCam(tmp);
  }

  /**
   * Move the camera to the left
   * @param {number} delta - the distance the camera should be moved
   */
  moveLeft(delta) {
    const tmp = [-1, 0, 0];
    vec3.scale(tmp, tmp, delta);
    this.moveCam(tmp);
  }

  /**
   * Move the camera up
   * @param {number} delta - the distance the camera should be moved
   */
  moveUp(delta) {
    const tmp = [0, 1, 0];
    vec3.scale(tmp, tmp, delta);
    this.moveCam(tmp);
  }

  /**
   * Move the camera down
   * @param {number} delta - the distance the camera should be moved
   */
  moveDown(delta) {
    const tmp = [0, -1, 0];
    vec3.scale(tmp, tmp, delta);
    this.moveCam(tmp);
  }

  /**
   * Move the camera forward
   * @param {number} delta - the distance the camera should be moved
   */
  moveForward(delta) {
    const tmp = [0, 0, -1];
    vec3.scale(tmp, tmp, delta);
    this.moveCam(tmp);
  }

  /**
   * Move the camera back
   * @param {number} delta - the distance the camera should be moved
   */
  moveBack(delta) {
    const tmp = [0, 0, 1];
    vec3.scale(tmp, tmp, delta);
    this.moveCam(tmp);
  }
}

export { MFWebGLCamera };
