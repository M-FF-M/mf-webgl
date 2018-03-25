import { createShaderProgram } from '../mf-webgl-utils.js';
import { MFWebGLMaterial } from '../mf-webgl-material.js';
import { MFWebGLModel } from '../mf-webgl-model.js';
import { MFWebGLObject } from '../mf-webgl-object.js';
import {
  glMatrix,
  mat2, mat2d, mat3, mat4,
  quat,
  vec2, vec3, vec4,
} from '../../gl-matrix.js';

const vertexShaderSource = `
  attribute vec3 aVertexPosition;
  attribute vec3 aVertexNormal;
  attribute vec4 aVertexColor;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;
  uniform mat3 uNMatrix;

  uniform vec3 uAmbientColor;

  uniform vec3 uLightingDirection;
  uniform vec3 uDirectionalColor;

  uniform bool uUseLighting;

  varying vec4 vColor;
  varying vec3 vLightWeighting;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vColor = aVertexColor;

    if (!uUseLighting) {
      vLightWeighting = vec3(1.0, 1.0, 1.0);
    } else {
      vec3 transformedNormal = uNMatrix * aVertexNormal;
      float directionalLightWeighting = max(dot(transformedNormal, uLightingDirection), 0.0);
      vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting;
    }
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec4 vColor;
  varying vec3 vLightWeighting;

  void main(void) {
    gl_FragColor = vec4(vColor.rgb * vLightWeighting, vColor.a);
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

/**
 * This material assigns vertex colors (that will be interpolated for each triangle) with simple lighting
 */
class MFWebGLVMaterial extends MFWebGLMaterial {
  /**
   * Creates a MFWebGLObject with the given vertices and colors using this material
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {Array} vertices - an array with the vertices
   * @param {Array} normals - an array with the vertex normals
   * @param {Array} colors - an array with the vertex colors
   * @param {number} triangleType - the triangle type, e.g. gl.TRIANGLES or gl.TRIANGLE_STRIP
   * @param {MFWebGLVMaterial} material - optional: the MFWebGLVMaterial object to use
   * @param {Array} triangleVertices - optional: an array specifying which vertices should
   * form triangles. This array should contain arrays of size 3 containing the vertex indices
   * @return {MFWebGLObject} the corresponding MFWebGLObject
   */
  static getObject(gl, vertices, normals, colors, triangleType, material = null, triangleVertices = null) {
    if (material === null)
      material = new MFWebGLVMaterial(gl);

    const matInfo = {
      vertexColorBuffer: MFWebGLModel.toGLBuffer_Float32_STATIC_DRAW(gl, colors),
      triangleType,
      drawInOrder: true
    };
    if (triangleVertices !== null) {
      matInfo.drawInOrder = false;
      matInfo.vertexIndexBuffer = MFWebGLModel.toGLBuffer_Uint16_STATIC_DRAW(gl, triangleVertices);
    }
    const model = new MFWebGLModel(gl, vertices, normals, matInfo);
    return new MFWebGLObject(model, material);
  }

  /**
   * Create a new MFWebGLVMaterial
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
   * @param {MFWebGLSimpleLighting} light - the lighting to apply
   * @return {Array} an array containing the model view matrix at index 0 and the projection matrix
   * at index 1
   */
  render(model, mvMatrix, pMatrix, light) {
    const gl = this.gl, shaderProgram = this.shaderProgram, attr = model.materialAttributes;

    gl.useProgram(shaderProgram);

    let stdMvMatrix = mat4.create();
    stdMvMatrix = model.applyModelTransforms(stdMvMatrix);
    const mvClone = mat4.clone(mvMatrix);
    mvMatrix = mat4.create();
    mat4.multiply(mvMatrix, mvClone, stdMvMatrix);
    const normalMatrix = mat3.create();
    mat3.normalFromMat4(normalMatrix, stdMvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute,
        model.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, model.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute,
        model.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, attr.vertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, attr.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    if (!attr.drawInOrder) gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attr.vertexIndexBuffer);

    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
    gl.uniform3fv(shaderProgram.ambientColorUniform, light.ambientColor);
    gl.uniform3fv(shaderProgram.directionalColorUniform, light.directionalColor);
    gl.uniform3fv(shaderProgram.lightingDirectionUniform, light.lightingDirection);
    gl.uniform1i(shaderProgram.useLightingUniform, light.useLighting);

    if (attr.drawInOrder) {
      gl.drawArrays(attr.triangleType, 0, model.vertexPositionBuffer.numItems);
    } else {
      gl.drawElements(gl.TRIANGLES, attr.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    return [mvMatrix, pMatrix];
  }
}

export { vertexShaderSource, fragmentShaderSource, initShaders, MFWebGLVMaterial };
