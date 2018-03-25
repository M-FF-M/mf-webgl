import {
  MFWebGL, MFWebGLScene, MFWebGLCamera, MFWebGLVMaterial, MFWebGLTMaterial, MFWebGLTexture,
  MFWebGLTextureLoader, MFWebGLSimpleLighting
} from './src/index.js';

class MFWebGLTutorial {
  constructor() {
    this.renderCallback = this.renderCallback.bind(this);
    this.loadCallback = this.loadCallback.bind(this);
    this.textureLoader = new MFWebGLTextureLoader();
    this.textureLoader.addEventListener('load', this.loadCallback);

    this.webgl = new MFWebGL();

    const gl = this.webgl.gl;
    this.materialv = new MFWebGLVMaterial(gl);
    this.materialt = new MFWebGLTMaterial(gl);

    this.triangle = MFWebGLVMaterial.getObject(
        gl,
        [   // vertices
            [  0.0,  1.0,  0.0 ],
            [ -1.0, -1.0,  0.0 ],
            [  1.0, -1.0,  0.0 ]
        ],
        [   // vertex normals
            [ 0.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0 ],
            [ 0.0, 0.0, 1.0 ]
        ],
        [   // vertex colors
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
        [   // vertices
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
        [   // vertex normals
            // Front face
            [  0.0,  0.0,  1.0 ],
            [  0.0,  0.0,  1.0 ],
            [  0.0,  0.0,  1.0 ],
            [  0.0,  0.0,  1.0 ],

            // Back face
            [  0.0,  0.0, -1.0 ],
            [  0.0,  0.0, -1.0 ],
            [  0.0,  0.0, -1.0 ],
            [  0.0,  0.0, -1.0 ],

            // Top face
            [  0.0,  1.0,  0.0 ],
            [  0.0,  1.0,  0.0 ],
            [  0.0,  1.0,  0.0 ],
            [  0.0,  1.0,  0.0 ],

            // Bottom face
            [  0.0, -1.0,  0.0 ],
            [  0.0, -1.0,  0.0 ],
            [  0.0, -1.0,  0.0 ],
            [  0.0, -1.0,  0.0 ],

            // Right face
            [  1.0,  0.0,  0.0 ],
            [  1.0,  0.0,  0.0 ],
            [  1.0,  0.0,  0.0 ],
            [  1.0,  0.0,  0.0 ],

            // Left face
            [ -1.0,  0.0,  0.0 ],
            [ -1.0,  0.0,  0.0 ],
            [ -1.0,  0.0,  0.0 ],
            [ -1.0,  0.0,  0.0 ]
        ],
        [   // texture coordinates
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
    this.textureLoader.addTexture('texture.png');
    this.cube.position = [1.5, 0.0, -7.0];
    //this.cube.rotate = [MFWebGL.degToRad(45), [0, 1, 0]];

    this.webgl.scene = new MFWebGLScene([this.triangle, this.cube]);
    this.webgl.scene.setLighting(new MFWebGLSimpleLighting(
      [  0.5,  0.5,  0.5 ], // ambient color
      [  0.8,  0.8,  0.8 ], // directional color
      [  0.8, -1.0, -0.2 ]  // light direction
    ));
    this.camera = new MFWebGLCamera(/*MFWebGLCamera.ORTHOGRAPHIC, 6*/);
    this.webgl.camera = this.camera;
    this.webgl.camera.setLookFromTo([-3.0, 2.0, 0.0], [0.0, 0.0, -7.0]);
    //this.webgl.camera.setRotationMode(MFWebGLCamera.FREE_ROTATION);
    this.webgl.addEventListener('render', this.renderCallback);

    this.textureLoader.start();
  }

  loadCallback() {
    this.webgl.autoResizing = true;
    this.webgl.autoCameraMove = true;

    this.webgl.render();
  }

  renderCallback(timeSinceStart, timeSinceLast) {
    //this.triangle.rotate = [MFWebGL.degToRad(360 * timeSinceStart / 1000.0), [0, 1, 0]];
    //this.cube.rotate = [MFWebGL.degToRad(120 * timeSinceStart / 1000.0), [1, 1, 1]];
  }
}

export default MFWebGLTutorial;
