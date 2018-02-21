/**
 * Represents a WebGL object (consisting of a model and a material)
 */
class MFWebGLObject {
  /**
   * Create a new MFWebGLObject
   * @param {MFWebGLModel} model - the model for this object
   * @param {MFWebGLMaterial} material - the material for this object
   */
  constructor(model, material) {
    this.model = model;
    this.material = material;
  }

  /**
   * Set the rotation of this object
   * @param {Array} rotation - the new rotation with the angle in radians at index 0 and
   * the rotational axis as a vec3 at index 1
   */
  set rotate(rotation) {
    this.model.rotate = rotation;
  }

  /**
   * Set the position of this object
   * @param {Array} position - the new position as a vec3
   */
  set position(position) {
    this.model.position = position;
  }

  /**
   * Render this object
   * @param {mat4} mvMatrix - the model view matrix
   * @param {mat4} pMatrix - the projection matrix
   */
  render(mvMatrix, pMatrix) {
    this.material.render(this.model, mvMatrix, pMatrix);
  }
}

export { MFWebGLObject };
