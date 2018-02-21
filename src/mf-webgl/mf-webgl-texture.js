/**
 * Represents a WebGL texture
 */
class MFWebGLTexture {
  /**
   * Create a new texture
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {string} imgpath - the path to the image
   */
  constructor(gl, imgpath) {
    this.gl = gl;
    this.src = imgpath;
    this.texture = this.gl.createTexture();
    this.texture.image = new Image();
    this.handleLoadedImage = this.handleLoadedImage.bind(this);
    this.texture.image.addEventListener('load', () => this.handleLoadedImage());

    this.texture.image.src = this.src;
  }

  /**
   * Will be called internally when the texture image has been loaded
   */
  handleLoadedImage() {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}

export { MFWebGLTexture };
