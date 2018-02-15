import {
  glMatrix,
  mat2, mat2d, mat3, mat4,
  quat,
  vec2, vec3, vec4,
} from './gl-matrix.js';

class MFWebGLModel {
  /**
   * Convert a JavaScript array to a WebGL buffer (Float32Array)
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {Array} array - the JavaScript array
   * @param {number} drawVar - e.g. gl.STATIC_DRAW
   * @return {WebGLBuffer} the WebGL buffer
   */
  static toGLBuffer_Float32(gl, array, drawVar) {
    const numItems = array.length;
    const itemSize = array[0].length;
    const bufferArr = [];
    for (let i=0; i<numItems; i++)
      for (let k=0; k<itemSize; k++)
        bufferArr.push(array[i][k]);
    const glBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bufferArr), drawVar);
    glBuffer.itemSize = itemSize;
    glBuffer.numItems = numItems;
    return glBuffer;
  }

  /**
   * Convert a JavaScript array to a WebGL buffer (Float32Array, gl.STATIC_DRAW)
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {Array} array - the JavaScript array
   * @return {WebGLBuffer} the WebGL buffer
   */
  static toGLBuffer_Float32_STATIC_DRAW(gl, array) {
    return MFWebGLModel.toGLBuffer_Float32(gl, array, gl.STATIC_DRAW);
  }

  /**
   * Create a new MFWebGLModel
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {Array} vertices - the vertices of the model
   * @param {Object} materialAttributes - an object containig rendering information
   */
  constructor(gl, vertices, materialAttributes) {
    this.gl = gl;
    this.vertices = vertices;
    this.materialAttributes = materialAttributes;
    this.vertexPositionBuffer = MFWebGLModel.toGLBuffer_Float32_STATIC_DRAW(this.gl, vertices);
    this.rotation = [0, null];
    this.translation = null;
  }

  /**
   * Apply the model transforms to a model view matrix
   * @param {mat4} mvMatrix - the model view matrix
   * @return the matrix with the applied transforms
   */
  applyModelTransforms(mvMatrix) {
    const tMatrix = mat4.create();
    mat4.copy(tMatrix, mvMatrix);
    if (this.translation !== null)
      mat4.translate(tMatrix, tMatrix, this.translation);
    if (this.rotation[0] !== 0)
      mat4.rotate(tMatrix, tMatrix, this.rotation[0], this.rotation[1]);
    return tMatrix;
  }

  /**
   * Set the rotation of this model
   * @param {Array} rotation - the new rotation with the angle in radians at index 0 and
   * the rotational axis as a vec3 at index 1
   */
  set rotate(rotation) {
    this.rotation = rotation;
  }

  /**
   * Set the position of this model
   * @param {Array} position - the new position as a vec3
   */
  set position(position) {
    this.translation = position;
  }
}

export { MFWebGLModel };
