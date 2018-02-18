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

    this.cube = MFWebGLVMaterial.getObject(
        gl,
        [
            // Front face
            [ -1.0, -1.0,  1.0 ],
            [  1.0, -1.0,  1.0 ],
            [  1.0,  1.0,  1.0 ],
            [ -1.0,  1.0,  1.0 ],

            // Back face
            [ -1.0, -1.0, -1.0 ],
            [ -1.0,  1.0, -1.0 ],
            [  1.0,  1.0, -1.0 ],
            [  1.0, -1.0, -1.0 ],

            // Top face
            [ -1.0,  1.0, -1.0 ],
            [ -1.0,  1.0,  1.0 ],
            [  1.0,  1.0,  1.0 ],
            [  1.0,  1.0, -1.0 ],

            // Bottom face
            [ -1.0, -1.0, -1.0 ],
            [  1.0, -1.0, -1.0 ],
            [  1.0, -1.0,  1.0 ],
            [ -1.0, -1.0,  1.0 ],

            // Right face
            [  1.0, -1.0, -1.0 ],
            [  1.0,  1.0, -1.0 ],
            [  1.0,  1.0,  1.0 ],
            [  1.0, -1.0,  1.0 ],

            // Left face
            [ -1.0, -1.0, -1.0 ],
            [ -1.0, -1.0,  1.0 ],
            [ -1.0,  1.0,  1.0 ],
            [ -1.0,  1.0, -1.0 ]
        ],
        [
            [1.0, 0.0, 0.0, 1.0], // Front face
            [1.0, 0.0, 0.0, 1.0], // Front face
            [1.0, 0.0, 0.0, 1.0], // Front face
            [1.0, 0.0, 0.0, 1.0], // Front face

            [1.0, 1.0, 0.0, 1.0], // Back face
            [1.0, 1.0, 0.0, 1.0], // Back face
            [1.0, 1.0, 0.0, 1.0], // Back face
            [1.0, 1.0, 0.0, 1.0], // Back face

            [0.0, 1.0, 0.0, 1.0], // Top face
            [0.0, 1.0, 0.0, 1.0], // Top face
            [0.0, 1.0, 0.0, 1.0], // Top face
            [0.0, 1.0, 0.0, 1.0], // Top face

            [1.0, 0.5, 0.5, 1.0], // Bottom face
            [1.0, 0.5, 0.5, 1.0], // Bottom face
            [1.0, 0.5, 0.5, 1.0], // Bottom face
            [1.0, 0.5, 0.5, 1.0], // Bottom face

            [1.0, 0.0, 1.0, 1.0], // Right face
            [1.0, 0.0, 1.0, 1.0], // Right face
            [1.0, 0.0, 1.0, 1.0], // Right face
            [1.0, 0.0, 1.0, 1.0], // Right face

            [0.0, 0.0, 1.0, 1.0], // Left face
            [0.0, 0.0, 1.0, 1.0], // Left face
            [0.0, 0.0, 1.0, 1.0], // Left face
            [0.0, 0.0, 1.0, 1.0]  // Left face
        ],
        gl.TRIANGLE_STRIP,
        this.material,
        [
            [0, 1, 2],      [0, 2, 3],    // Front face
            [4, 5, 6],      [4, 6, 7],    // Back face
            [8, 9, 10],     [8, 10, 11],  // Top face
            [12, 13, 14],   [12, 14, 15], // Bottom face
            [16, 17, 18],   [16, 18, 19], // Right face
            [20, 21, 22],   [20, 22, 23]  // Left face
        ]
    );
    this.cube.position = [1.5, 0.0, -7.0];

    this.webgl.scene = new MFWebGLScene([this.triangle, this.cube]);
    this.camera = new MFWebGLCamera(/*MFWebGLCamera.ORTHOGRAPHIC, 6*/);
    this.webgl.camera = this.camera;
    this.webgl.camera.position = [-3.0, 2.0, 0.0];
    this.webgl.camera.lookAt = [0.0, 0.0, -7.0];
    this.webgl.addEventListener('render', this.renderCallback);

    this.webgl.render();
  }

  renderCallback(timeSinceStart, timeSinceLast) {
    //this.triangle.rotate = [MFWebGL.degToRad(360 * timeSinceStart / 1000.0), [0, 1, 0]];
    //this.cube.rotate = [MFWebGL.degToRad(120 * timeSinceStart / 1000.0), [1, 1, 1]];
  }
}

export default MFWebGLTutorial;
