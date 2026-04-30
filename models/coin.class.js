/**
 * Represents a collectible bottle object that the player can pick up.
 * @extends CollectibleObject
 */
class Coin extends CollectibleObject {
  /**
   * Array of strings containing the path to the coin image.
   * @type {string[]}
   */
  static COIN_IMAGES = ["img/8_coin/coin_1.png"];

  /**
   * Sets the main parameters of the coin (horizonal position, vertical position, width, height, type).
   * The offset is used for testing purposes to draw a hitbox.
   * @param {number} x - the horizontal position on the canvas
   * @param {number} y - the vertical position on the canvas
   */
  constructor(x, y) {
    super(x, y, 80, 80, Coin.COIN_IMAGES, "coin");
    this.offset = { top: 20, bottom: 20, left: 20, right: 20 };
  }
}
