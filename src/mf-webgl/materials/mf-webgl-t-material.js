import { createTextureShaderProgram } from '../mf-webgl-utils.js';
import { MFWebGLMaterial } from '../mf-webgl-material.js';
import { MFWebGLModel } from '../mf-webgl-model.js';
import { MFWebGLObject } from '../mf-webgl-object.js';

const vertexShaderSource = `
  attribute vec3 aVertexPosition;
  attribute vec2 aTextureCoord;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  varying vec2 vTextureCoord;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
    vTextureCoord = aTextureCoord;
  }
`;

const fragmentShaderSource = `
  precision mediump float;

  varying vec2 vTextureCoord;

  uniform sampler2D uSampler;

  void main(void) {
    gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
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
  const shaderProgram = createTextureShaderProgram(gl, shaders);

  return shaderProgram;
}

/**
 * This material uses textures
 */
class MFWebGLTMaterial extends MFWebGLMaterial {
  /**
   * Creates a MFWebGLObject with the given vertices and a texture using this material
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {Array} vertices - an array with the vertices
   * @param {Array} texpos - an array with the vertex texture coordinates, that is to say,
   * which texture coordinates the vertices map to
   * @param {number} triangleType - the triangle type, e.g. gl.TRIANGLES or gl.TRIANGLE_STRIP
   * @param {MFWebGLTexture} texture - the texture to use
   * @param {MFWebGLTMaterial} material - optional: the MFWebGLTMaterial object to use
   * @param {Array} triangleVertices - optional: an array specifying which vertices should
   * form triangles. This array should contain arrays of size 3 containing the vertex indices
   * @return {MFWebGLObject} the corresponding MFWebGLObject
   */
  static getObject(gl, vertices, texpos, triangleType, texture,
      material = null, triangleVertices = null) {
    if (material === null)
      material = new MFWebGLTMaterial(gl);

    const matInfo = {
      vertexTexCoordBuffer: MFWebGLModel.toGLBuffer_Float32_STATIC_DRAW(gl, texpos),
      triangleType,
      texture: texture.texture,
      drawInOrder: true
    };
    if (triangleVertices !== null) {
      matInfo.drawInOrder = false;
      matInfo.vertexIndexBuffer = MFWebGLModel.toGLBuffer_Uint16_STATIC_DRAW(gl, triangleVertices);
    }
    const model = new MFWebGLModel(gl, vertices, matInfo);
    return new MFWebGLObject(model, material);
  }

  /**
   * Create a new MFWebGLTMaterial
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

    gl.bindBuffer(gl.ARRAY_BUFFER, attr.vertexTexCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, attr.vertexTexCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, attr.texture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    if (attr.drawInOrder) {
      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

      gl.drawArrays(attr.triangleType, 0, model.vertexPositionBuffer.numItems);
    } else {
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, attr.vertexIndexBuffer);

      gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
      gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

      gl.drawElements(gl.TRIANGLES, attr.vertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    }

    return [mvMatrix, pMatrix];
  }
}

export { vertexShaderSource, fragmentShaderSource, initShaders, MFWebGLTMaterial };
