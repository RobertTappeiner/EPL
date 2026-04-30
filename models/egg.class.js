/**
 * Represents a throwable egg object used by the Endboss.
 * The egg loads its base sprite, generates rotated animation frames.
 * @extends ThrowableObject
 */
class Egg extends ThrowableObject {
  EGG_ROTATION = [];

  /**
   * Creates a new egg projectile with its base image, size,
   * direction, rotation frames, and initial state.
   */
  constructor(x, y, direction) {
    super();
    this.loadImage("img/10_egg/egg_1.png");
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.otherDirection = direction;
    this.isThrown = false;
    this.isThrowableObject = true;
    this.rotationIndex = 0;
    this.generateRotationFrames();
    this.markForRemoval = false;
  }

  /**
   * Starts the egg's movement and rotation animation.
   */
  start() {
    this.throw();
    this.animate();
  }

  /**
   * Cycles through rotation frames while the egg is in flight.
   */
  animate() {
    this.world.registerInterval(
      setInterval(() => {
        if (this.isThrown && this.EGG_ROTATION.length > 0) {
          this.img = this.EGG_ROTATION[this.rotationIndex];
          this.rotationIndex =
            (this.rotationIndex + 1) % this.EGG_ROTATION.length;
        }
      }, 1000 / 60),
    );
  }

  /**
   * Loads the base egg image and builds all rotated animation frames.
   */
  generateRotationFrames() {
    const base = this.loadBaseEggImage();
    base.onload = () => this.buildRotationFrames(base);
  }

  /**
   * Loads and returns the base egg sprite used for rotation frames.
   * @returns {HTMLImageElement} The loaded base image.
   */
  loadBaseEggImage() {
    const img = new Image();
    img.src = "img/10_egg/egg_1.png";
    return img;
  }

  /**
   * Generates all rotated egg frames from the base image.
   * @param {HTMLImageElement} base - The original egg sprite.
   */
  buildRotationFrames(base) {
    const steps = 12;
    for (let i = 0; i < steps; i++) {
      const frame = this.createRotatedFrame(base, i, steps);
      this.EGG_ROTATION.push(frame);
    }
  }

  /**
   * Creates a single rotated egg frame for the animation.
   * @param {HTMLImageElement} base - The base egg image.
   * @param {number} index - The current rotation step.
   * @param {number} steps - Total number of rotation steps.
   * @returns {HTMLImageElement} The rotated frame.
   */
  createRotatedFrame(base, index, steps) {
    const c = document.createElement("canvas");
    c.width = this.width;
    c.height = this.height;
    const ctx = c.getContext("2d");
    ctx.translate(this.width / 2, this.height / 2);
    ctx.rotate((index * Math.PI * 2) / steps);
    ctx.drawImage(
      base,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    );
    const img = new Image();
    img.src = c.toDataURL();
    return img;
  }

  /**
   * Launches the egg forward, creating an arch.
   */
  throw() {
    this.isThrown = true;
    this.speedY = 10;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (this.otherDirection) {
        this.x -= 12;
      } else {
        this.x += 12;
      }
    }, 25);
    this.world.registerInterval(this.throwInterval);
  }
}
