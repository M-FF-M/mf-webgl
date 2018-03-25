import { MFWebGLLighting } from '../mf-webgl-lighting.js';
import {
  glMatrix,
  mat2, mat2d, mat3, mat4,
  quat,
  vec2, vec3, vec4,
} from '../../gl-matrix.js';

/**
 * Makes simple lighting possible. This class only supports ambient lighting and
 * one directional light.
 */
class MFWebGLSimpleLighting extends MFWebGLLighting {
  /**
   * Create a new MFWebGLSimpleLighting instance
   * @param {vec3} ambientColor - the ambient light's color (rgb, from 0.0 to 1.0)
   * @param {vec3} directionalColor - the directional light's color (rgb, from 0.0 to 1.0)
   * @param {vec3} lightingDirection - the directional light's direction
   */
  constructor(ambientColor, directionalColor, lightingDirection) {
    super();
    this.ambientColor = ambientColor;
    this.directionalColor = directionalColor;
    const adjustedLD = vec3.create();
    vec3.normalize(adjustedLD, lightingDirection);
    vec3.scale(adjustedLD, adjustedLD, -1);
    this.lightingDirection = adjustedLD;
    this.useLighting = true;
  }

  /**
   * turn the lighting off
   */
  turnOff() {
    this.useLighting = false;
  }

  /**
   * turn the lighting on
   */
  turnOn() {
    this.useLighting = true;
  }
}

export { MFWebGLSimpleLighting };
