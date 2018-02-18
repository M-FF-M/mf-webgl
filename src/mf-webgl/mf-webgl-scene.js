/**
 * Represents a scene containing WebGL objects
 */
class MFWebGLScene {
  /**
   * Create a new MFWebGLScene
   * @param {Array} objects - the objects to add to the scene (together with the materials)
   */
  constructor(objects) {
    this.objects = [];
    for (let i=0; i<objects.length; i++)
      this.objects.push(objects[i]);
  }

  /**
   * Add an object to the scene
   * @param {MFWebGLObject} object - the object to add
   */
  add(object) {
    this.objects.push(object);
  }

  /**
   * Render the scene
   * @param {mat4} mvMatrix - the model view matrix
   * @param {mat4} pMatrix - the projection matrix
   */
  render(mvMatrix, pMatrix) {
    for (let i=0; i<this.objects.length; i++)
      this.objects[i].render(mvMatrix, pMatrix);
  }
}

export { MFWebGLScene };
