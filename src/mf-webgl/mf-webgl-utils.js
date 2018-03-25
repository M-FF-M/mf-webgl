
/**
 * Create a shader program with user-defined shaders. You still have to call
 * gl.useProgram(). This method will automatically set the following attrubtes
 * on the returned program:
 * - the attributes set by initVertexPositionAndNormal()
 * - vertexColorAttribute: gl.getAttribLocation(shaderProgram, "aVertexColor");
 * - the attributes set by initProjectionAndModelView()
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {Array} shaders - an array containing the shaders to initialize
 * @return {WebGLProgram} the WebGLProgram with the shaders
 */
function createShaderProgram(gl, shaders) {
  const shaderProgram = initializeShaderProgram(gl, shaders);

  initVertexPositionAndNormal(gl, shaderProgram);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  initProjectionAndModelView(gl, shaderProgram);
  initNormal(gl, shaderProgram);

  initSimpleLighting(gl, shaderProgram);

  return shaderProgram;
}

/**
 * Create a shader program with user-defined shaders (using textures). You still have to call
 * gl.useProgram(). This method will automatically set the following attrubtes
 * on the returned program:
 * - the attributes set by initVertexPositionAndNormal()
 * - textureCoordAttribute: gl.getAttribLocation(shaderProgram, "aTextureCoord");
 * - the attributes set by initProjectionAndModelView()
 * - samplerUniform: gl.getUniformLocation(shaderProgram, "uSampler");
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {Array} shaders - an array containing the shaders to initialize
 * @return {WebGLProgram} the WebGLProgram with the shaders
 */
function createTextureShaderProgram(gl, shaders) {
  const shaderProgram = initializeShaderProgram(gl, shaders);

  initVertexPositionAndNormal(gl, shaderProgram);

  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  initProjectionAndModelView(gl, shaderProgram);
  initNormal(gl, shaderProgram);
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

  initSimpleLighting(gl, shaderProgram);

  return shaderProgram;
}

/**
 * Initialize a shader program
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {Array} shaders - an array containing the shaders to initialize
 * @return {WebGLProgram} the initialized WebGLProgram with the shaders
 */
function initializeShaderProgram(gl, shaders) {
  const shaderProgram = gl.createProgram();
  for (let i=0; i<shaders.length; i++) {
    const shader = loadShader(gl, shaders[i][0], shaders[i][1]);
    gl.attachShader(shaderProgram, shader);
  }

  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.warn("Could not initialise shaders");
  }

  return shaderProgram;
}

/**
 * Initialize the vertex position and normal attributes on a shader program.
 * This method will automatically set the following attrubtes on the program:
 * - vertexPositionAttribute: gl.getAttribLocation(shaderProgram, "aVertexPosition");
 * - vertexNormalAttribute: gl.getAttribLocation(shaderProgram, "aVertexNormal");
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {WebGLProgram} shaderProgram - the shader program
 */
function initVertexPositionAndNormal(gl, shaderProgram) {
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
}

/**
 * Initialize the simple lighting attributes on a shader program.
 * This method will automatically set the following attrubtes on the program:
 * - ambientColorUniform: gl.getUniformLocation(shaderProgram, "uAmbientColor");
 * - lightingDirectionUniform: gl.getUniformLocation(shaderProgram, "uLightingDirection");
 * - directionalColorUniform: gl.getUniformLocation(shaderProgram, "uDirectionalColor");
 * - useLightingUniform: gl.getUniformLocation(shaderProgram, "uUseLighting");
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {WebGLProgram} shaderProgram - the shader program
 */
function initSimpleLighting(gl, shaderProgram) {
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
  gl.enableVertexAttribArray(shaderProgram.ambientColorUniform);

  shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
  gl.enableVertexAttribArray(shaderProgram.lightingDirectionUniform);

  shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
  gl.enableVertexAttribArray(shaderProgram.directionalColorUniform);

  shaderProgram.useLightingUniform = gl.getUniformLocation(shaderProgram, "uUseLighting");
  gl.enableVertexAttribArray(shaderProgram.useLightingUniform);
}

/**
 * Initialize the projection and model view matrix attributes on a shader program.
 * This method will automatically set the following attrubtes on the program:
 * - pMatrixUniform: gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
 * - mvMatrixUniform: gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {WebGLProgram} shaderProgram - the shader program
 */
function initProjectionAndModelView(gl, shaderProgram) {
  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
}

/**
 * Initialize the normal matrix attributes on a shader program.
 * This method will automatically set the following attrubtes on the program:
 * - nMatrixUniform: gl.getUniformLocation(shaderProgram, "uNMatrix");
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {WebGLProgram} shaderProgram - the shader program
 */
function initNormal(gl, shaderProgram) {
  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
}

/**
 * Load a shader
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {string} shaderCode - the shader code to load
 * @param {string} shaderType - the shader type (x-shader/x-fragment or x-shader/x-vertex)
 * @return {WebGLShader} the loaded shader
 */
function loadShader(gl, shaderCode, shaderType) {
  let shader;
  if (shaderType === 'x-shader/x-fragment') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderType === 'x-shader/x-vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, shaderCode);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Unable to compile shaders. Shader info log:");
    console.log(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

export { loadShader, createShaderProgram, createTextureShaderProgram };
