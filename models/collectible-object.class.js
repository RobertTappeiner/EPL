/**
 * Base class for all collectible items in the game (coins and bottles).
 * Provides position, size, image loading, and a configurable hitbox for
 * collision detection.
 * @extends DrawableObject
 */
class CollectibleObject extends DrawableObject {
  /**
   * Optional hitbox offsets to fine‑tune collision boundaries.
   * These values shrink or expand the default bounding box.
   */
  offset = { top: 0, bottom: 0, left: 0, right: 0 };
  /**
   * Creates a collectible object at the given position and size,
   * loads its images, and sets the initial sprite.
   *
   * @param {number} x - Horizontal position on the canvas.
   * @param {number} y - Vertical position on the canvas.
   * @param {number} width - Width of the collectible.
   * @param {number} height - Height of the collectible.
   * @param {string[]} images - Array of image paths for the collectible.
   * @param {string} type - Identifier used to distinguish collectible types.
   */
  constructor(x, y, width, height, images, type) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.loadImages(images);
    this.img = this.imageCache[images[0]];
  }

  /**
   *  Returns the collectible's hitbox, adjusted by the offset values.
   *  Used for collision detection with the character.
   *
   *  @returns {{left: number, right: number, top: number, bottom: number}}
   *  The adjusted hitbox boundaries.
   */
  getHitbox() {
    return {
      left: this.x + this.offset.left,
      right: this.x + this.width - this.offset.right,
      top: this.y + this.offset.top,
      bottom: this.y + this.height - this.offset.bottom,
    };
  }
}
