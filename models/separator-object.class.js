/**
 * Represents a separator object used to divide the level into difficulty
 * segments. Separators act as invisible or visible obstacles placed at
 * specific x-positions in the world. They do not move, but their presence
 * marks transitions between gameplay sections:
 *
 * - Segment 1 (before the first separator): fewer enemies
 * - Segment 2 (between separator 1 and 2): increased difficulty
 * - Segment 3 (after the second separator): final fight with the Endboss
 *
 * Each separator has its own hitbox offset to control collision boundaries.
 *
 * @extends MovableObject
 */
class SeparatorObject extends MovableObject {
  offset = { top: 10, left: 40, right: 40, bottom: 0 };

  constructor(path, x, y, width, height) {
    super();
    this.loadImage(path);
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
  }
}
