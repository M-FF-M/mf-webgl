
/**
 * Create a shader program with user-defined shaders. You still have to call
 * gl.useProgram(). This method will automatically set the following attrubtes
 * on the returned program:
 * - vertexPositionAttribute: gl.getAttribLocation(shaderProgram, "aVertexPosition");
 * - vertexColorAttribute: gl.getAttribLocation(shaderProgram, "aVertexColor");
 * - pMatrixUniform: gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
 * - mvMatrixUniform: gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {Array} shaders - an array containing the shaders to initialize
 * @return {WebGLProgram} the WebGLProgram with the shaders
 */
function createShaderProgram(gl, shaders) {
  const shaderProgram = gl.createProgram();
  for (let i=0; i<shaders.length; i++) {
    const shader = loadShader(gl, shaders[i][0], shaders[i][1]);
    gl.attachShader(shaderProgram, shader);
  }

  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.warn("Could not initialise shaders");
  }

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");

  return shaderProgram;
}

/**
 * Create a shader program with user-defined shaders (using textures). You still have to call
 * gl.useProgram(). This method will automatically set the following attrubtes
 * on the returned program:
 * - vertexPositionAttribute: gl.getAttribLocation(shaderProgram, "aVertexPosition");
 * - textureCoordAttribute: gl.getAttribLocation(shaderProgram, "aTextureCoord");
 * - pMatrixUniform: gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
 * - mvMatrixUniform: gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
 * - samplerUniform: gl.getUniformLocation(shaderProgram, "uSampler");
 * @param {WebGLRenderingContext} gl - the rendering context
 * @param {Array} shaders - an array containing the shaders to initialize
 * @return {WebGLProgram} the WebGLProgram with the shaders
 */
function createTextureShaderProgram(gl, shaders) {
  const shaderProgram = gl.createProgram();
  for (let i=0; i<shaders.length; i++) {
    const shader = loadShader(gl, shaders[i][0], shaders[i][1]);
    gl.attachShader(shaderProgram, shader);
  }

  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    console.warn("Could not initialise shaders");
  }

  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uProjectionMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uModelViewMatrix");
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

  return shaderProgram;
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
