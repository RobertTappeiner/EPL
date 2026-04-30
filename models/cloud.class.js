/**
 * Represents the clouds in the background layer.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /**
   * Defines each cloud's height, width and vertical positioning
   */
  y = 10;
  width = 350;
  height = 300;

  /**
   * Initializes the cloud by loading its image and placing it at a
   * random horizontal position within the level's width.
   * @param {number} levelEnd - The maximum horizontal boundary used to
   *                            randomize the cloud's starting position.
   */
  constructor(levelEnd) {
    super().loadImage("img/5_background/layers/4_clouds/1.png");
    this.levelEnd = levelEnd;
    this.x = Math.random() * this.levelEnd;
  }

  /**
   * Activates the object's behavior loop.
   * Called by the world when the level starts to begin animation
   * and movement updates for this object.
   */
  start() {
    this.animate();
  }

  /**
   * Starts the cloud's update loop.
   * The interval moves the could to the left and resets its position
 * to the right side of the level once it leaves the screen.
   */
  animate() {
    this.world.registerInterval(
      setInterval(() => {
        this.moveLeft();
        if (this.x + this.width < 10) {
          this.x = this.levelEnd;
        }
      }, 1000 / 40),
    );
  }
}
