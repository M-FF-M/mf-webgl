import { MFWebGL, MFWebGLScene, MFWebGLCamera, MFWebGLVMaterial } from './src/index.js';

class MFWebGLTutorial {
  constructor() {
    this.renderCallback = this.renderCallback.bind(this);

    this.webgl = new MFWebGL();

    const gl = this.webgl.gl;
    this.material = new MFWebGLVMaterial(gl);

    this.triangle = MFWebGLVMaterial.getObject(
        gl,
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
        gl.TRIANGLES,
        this.material
    );
    this.triangle.position = [-1.5, 0.0, -7.0];

    this.square = MFWebGLVMaterial.getObject(
        gl,
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
        gl.TRIANGLE_STRIP,
        this.material
    );
    this.square.position = [1.5, 0.0, -7.0];

    this.webgl.scene = new MFWebGLScene([this.triangle, this.square]);
    this.camera = new MFWebGLCamera();
    this.webgl.camera = this.camera;
    this.webgl.addEventListener('render', this.renderCallback);

    this.webgl.render();
  }

  renderCallback(timeSinceStart, timeSinceLast) {
    //this.triangle.rotate = [MFWebGL.degToRad(360 * timeSinceStart / 1000.0), [0, 1, 0]];
  }
}

export default MFWebGLTutorial;
