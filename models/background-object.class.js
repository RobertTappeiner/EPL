/**
 * Represents a single background layer in the game world.
 * Background objects are positioned in world space and scroll
 * @property {number} width - Matches the canvas width (720px).
 * @property {number} height - Matches the canvas height (480px).
 * relative to the camera.
 * @extends MovableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a new background layer.
   * @param {string} imagePath - the image source/path of the background image.
   * @param {number} x - the horizontal position of the image on the canvas.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
