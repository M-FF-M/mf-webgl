import {
  MFWebGL, MFWebGLScene, MFWebGLCamera, MFWebGLVMaterial, MFWebGLTMaterial, MFWebGLTexture
} from './src/index.js';

class MFWebGLTutorial {
  constructor() {
    this.renderCallback = this.renderCallback.bind(this);

    this.webgl = new MFWebGL();
    this.webgl.autoResizing = true;
    this.webgl.autoCameraMove = true;

    const gl = this.webgl.gl;
    this.materialv = new MFWebGLVMaterial(gl);
    this.materialt = new MFWebGLTMaterial(gl);

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
        this.materialv
    );
    this.triangle.position = [-1.5, 0.0, -7.0];

    this.cube = MFWebGLTMaterial.getObject(
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
            /*[1.0, 0.0, 0.0, 1.0], // Front face
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
            [0.0, 0.0, 1.0, 1.0]  // Left face*/

            // Front face
            [ 0.0, 0.0 ],
            [ 1.0, 0.0 ],
            [ 1.0, 1.0 ],
            [ 0.0, 1.0 ],

            // Back face
            [ 1.0, 0.0 ],
            [ 1.0, 1.0 ],
            [ 0.0, 1.0 ],
            [ 0.0, 0.0 ],

            // Top face
            [ 0.0, 1.0 ],
            [ 0.0, 0.0 ],
            [ 1.0, 0.0 ],
            [ 1.0, 1.0 ],

            // Bottom face
            [ 1.0, 1.0 ],
            [ 0.0, 1.0 ],
            [ 0.0, 0.0 ],
            [ 1.0, 0.0 ],

            // Right face
            [ 1.0, 0.0 ],
            [ 1.0, 1.0 ],
            [ 0.0, 1.0 ],
            [ 0.0, 0.0 ],

            // Left face
            [ 0.0, 0.0 ],
            [ 1.0, 0.0 ],
            [ 1.0, 1.0 ],
            [ 0.0, 1.0 ]
        ],
        gl.TRIANGLE_STRIP,
        new MFWebGLTexture(gl, 'texture.png', MFWebGLTexture.LINEAR_MIPMAP),
        this.materialt,
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
    this.webgl.camera.setLookFromTo([-3.0, 0.0, 0.0], [0.0, 0.0, -7.0]);
    //this.webgl.camera.setRotationMode(MFWebGLCamera.FREE_ROTATION);
    this.webgl.addEventListener('render', this.renderCallback);

    this.webgl.render();
    window.setTimeout(() => this.webgl.render(), 1000);
  }

  renderCallback(timeSinceStart, timeSinceLast) {
    //this.triangle.rotate = [MFWebGL.degToRad(360 * timeSinceStart / 1000.0), [0, 1, 0]];
    //this.cube.rotate = [MFWebGL.degToRad(120 * timeSinceStart / 1000.0), [1, 1, 1]];
  }
}

export default MFWebGLTutorial;
