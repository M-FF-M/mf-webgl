/**
 * Represents a (surface) material for a WebGL object
 */
class MFWebGLMaterial {
  /**
   * Create a new MFWebGLMaterial
   * @param {WebGLRenderingContext} gl - the rendering context
   */
  constructor(gl) {
    this.gl = gl;
    this.shaderProgram = null;
    this.mvMatrixStack = [];
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
    return [mvMatrix, pMatrix];
  }
}

export { MFWebGLMaterial };
