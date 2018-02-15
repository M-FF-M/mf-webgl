import { createShaderProgram } from './mf-webgl-utils.js';
import { MFWebGLMaterial } from './mf-webgl-material.js';
import { MFWebGLModel } from './mf-webgl-model.js';
import { MFWebGLObject } from './mf-webgl-object.js';

const vertexShaderSource = `
  attribute vec3 aVertexPosition;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec4 vColor;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec4 vColor;

  void main(void) {
    gl_FragColor = vColor;
  }
`;

/**
 * Initalize shaders
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {Array} shaders - an array containing the shaders to initialize
 * @return {WebGLProgram} the WebGLProgram with the shaders
 */
function initShaders(gl, shaders = [ [vertexShaderSource, 'x-shader/x-vertex'],
                                     [fragmentShaderSource, 'x-shader/x-fragment'] ]) {
  const shaderProgram = createShaderProgram(gl, shaders);

  return shaderProgram;
}

class MFWebGLTutMaterial extends MFWebGLMaterial {
  /**
   * Creates a MFWebGLObject with the given vertices and colors using this material
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {Array} vertices - an array with the vertices
   * @param {Array} colors - an array with the vertex colors
   * @param {number} triangleType - the triangle type, e.g. gl.TRIANGLES or gl.TRIANGLE_STRIP
   * @param {MFWebGLTutMaterial} material - optional: the MFWebGLTutMaterial object to use
   * @return {MFWebGLObject} the corresponding MFWebGLObject
   */
  static getObject(gl, vertices, colors, triangleType, material = null) {
    if (material === null)
      material = new MFWebGLTutMaterial(gl);

    const matInfo = {
      vertexColorBuffer: MFWebGLModel.toGLBuffer_Float32_STATIC_DRAW(gl, colors),
      triangleType
    };
    const model = new MFWebGLModel(gl, vertices, matInfo);
    return new MFWebGLObject(model, material);
  }

  /**
   * Create a new MFWebGLTutMaterial
   * @param {WebGLRenderingContext} gl - the rendering context
   */
  constructor(gl) {
    super(gl);
    this.shaderProgram = initShaders(gl);
  }

  /**
   * Render a MFWebGLModel with this material
   * @param {MFWebGLModel} model - the model to render
   * @param {mat4} mvMatrix - the model view matrix
   * @param {mat4} pMatrix - the projection matrix
   * @return {Array} an array containing the model view matrix at index 0 and the projection matrix
   * at index 1
   */
  render(model, mvMatrix, pMatrix) {
    const gl = this.gl, shaderProgram = this.shaderProgram, attr = model.materialAttributes;

    gl.useProgram(shaderProgram);

    mvMatrix = model.applyModelTransforms(mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        model.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, attr.vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, attr.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.drawArrays(attr.triangleType, 0, model.vertexPositionBuffer.numItems);

    return [mvMatrix, pMatrix];
  }
}

export { vertexShaderSource, fragmentShaderSource, initShaders, MFWebGLTutMaterial };
