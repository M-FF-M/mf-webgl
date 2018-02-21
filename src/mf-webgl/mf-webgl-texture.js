/**
 * Represents a WebGL texture
 */
class MFWebGLTexture {
  /** Flag for using nearest neighbor interpolation */
  static get NEAREST() { return 0; }
  /** Flag for using linear interpolation */
  static get LINEAR() { return 1; }
  /** Flag for using linear interpolation with mipmaps */
  static get LINEAR_MIPMAP() { return 2; }

  /**
   * Create a new texture
   * @param {WebGLRenderingContext} gl - the rendering context
   * @param {string} imgpath - the path to the image
   * @param {number} interpolationType - one of NEAREST, LINEAR, LINEAR_MIPMAP
   */
  constructor(gl, imgpath, interpolationType = MFWebGLTexture.NEAREST) {
    this.gl = gl;
    this.src = imgpath;
    this.interpolate = interpolationType;
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
    if (this.interpolate == MFWebGLTexture.NEAREST) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    } else if (this.interpolate == MFWebGLTexture.LINEAR) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    } else if (this.interpolate == MFWebGLTexture.LINEAR_MIPMAP) {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
      gl.generateMipmap(gl.TEXTURE_2D);
    }
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}

export { MFWebGLTexture };
