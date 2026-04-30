/**
 * Base class for all movable game objects. Provides shared functionality
 * such as movement, gravity, animations, collision detection, hitbox
 * calculation, and damage handling. Characters, enemies, projectiles,
 * and the Endboss all inherit these core movement mechanics.
 *
 * Key features:
 * - Horizontal movement (left/right)
 * - Vertical movement via gravity and jumping
 * - Looping and one‑time animations
 * - Collision detection (standard and from above)
 * - Hitbox calculation with configurable offsets
 * - Damage, hurt state timing, and death checks
 * - Utility for creating idle timers
 */
class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;
  previousY = 0;
  offset = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  };

  /**
   * Plays a looping animation by cycling through the given image arrays.
   * @param {string[]} images - the animation frame paths, stored in arrays.
   */
  playAnimation(images) {
    let i = this.currentImg % images.length;
    let path = images[i];
    this.img = this.imageCache[path];
    this.currentImg++;
  }

  /**
   * Cicles through the image animations and plays them once.
   * Once the animation reaches the last image in the array,
   * the animation freezes on that frame and returns true.
   * @param {string[]} images - The animation frame paths, stored in arrays.
   * @returns {boolean} -  True when the animation has finished.
   */
  playAnimationOnce(images) {
    let i = this.currentImg;
    this.img = this.imageCache[images[i]];
    this.currentImg++;
    if (this.currentImg >= images.length) {
      this.currentImg = images.length - 1;
      return true;
    }
    return false;
  }

  /**
   * Moves the object to the left by subtracting its horizontal speed
   * from its x‑position.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Moves the object to the right by adding its horizontal speed
   * to its x‑position.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Applies gravity to the object by updating its vertical position
   * at a fixed interval. As long as the object is above the ground
   * or still moving upward, its y‑position is adjusted based on its
   * current vertical speed, which decreases over time due to gravity.
   */
  applyGravity() {
    this.world.registerInterval(
      setInterval(() => {
        this.previousY = this.y;
        if (this.isAboveGround() || this.speedY > 0) {
          this.y -= this.speedY;
          this.speedY -= this.acceleration;
        }
      }, 1000 / 25),
    );
  }

  /**
   * Checks whether the object should be considered above the ground.
   * Throwable objects are not allowed to land on the ground, so gravity keeps
   * affecting them until they collide with something. If they don't collide,
   * they fall and disappear from the canvas.
   * All other objects are above ground as long as their y-position is higher than the
   * ground level (y < 180).
   * @returns {boolean} True if gravity should continue to apply.
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return true;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Initiates an upward movement by assigning a positive vertical
   * speed. Gravity will gradually reduce this speed until the object
   * reaches the peak of its jump.
   * The peak of the jump is reached when the vertical speed (speedY) decreases to 0.
   * After the peack of the jump is reached, the object begins falling again.
   */
  jump() {
    this.speedY = 25;
  }

  /**
   * Checks whether this object's hitbox overlaps with another object's
   * hitbox. This is a standard axis-aligned bounding box (AABB) collision
   * check used for all horizontal and vertical collisions.
   * @param {MovableObject} mo - The other object to test against.
   * @returns {boolean} True if the two hitboxes overlap.
   */
  isColliding(mo) {
    const a = this.getHitbox();
    const b = mo.getHitbox();
    return (
      a.right > b.left &&
      a.left < b.right &&
      a.bottom > b.top &&
      a.top < b.bottom
    );
  }

  /**
   * Checks whether this object is colliding with another object
   * specifically from above. This is used for stomp-style collisions,
   * where the player lands on top of an enemy.
   *
   * The method verifies that:
   * - the object is currently falling,
   * - it was positioned above the other object in the previous frame,
   * - their hitboxes now overlap vertically,
   * - and they overlap horizontally.
   *
   * @param {MovableObject} mo - The object being checked against.
   * @returns {boolean} True if the collision happened from above.
   */
  isCollidingFromAbove(mo) {
    const a = this.getHitbox();
    const b = mo.getHitbox();
    const isFalling = this.speedY < 0;
    const prevBottom = this.previousY + this.height - this.offset.bottom;
    const wasAboveBefore = prevBottom <= b.top;
    const isNowOverlappingVertically = a.bottom >= b.top;
    const horizontallyOverlapping = a.right > b.left && a.left < b.right;
    return (
      isFalling &&
      wasAboveBefore &&
      isNowOverlappingVertically &&
      horizontallyOverlapping
    );
  }

  /**
   *  Returns the object's hitbox, adjusted by the offset values.
   *  Used for collision detection.
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

  /**
   * Reduces the object's energy when it takes damage. If the energy
   * reaches 0, the object is considered dead. Otherwise, the time of
   * the last hit is stored, and the character plays a hurt sound.
   */
  hit() {
    this.energy -= 5;
    if (this.energy <= 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
      if (this instanceof Character) {
        audioManager.playCharacterHurt(0.3);
      }
    }
  }

  /**
   * Checks whether the object has no energy left.
   * @returns {boolean} True if the object is dead.
   */
  isDead() {
    return this.energy === 0;
  }

  /**
   * Checks whether the object is currently in a hurt state.
   * An object is considered hurt for one second after taking damage,
   * unless it is already dead.
   * @returns {boolean} True if the object is still within the hurt duration.
   */
  isHurt() {
    if (this.isDead()) return false;
    let timePassed = new Date().getTime() - this.lastHit;
    timePassed = timePassed / 1000;
    return timePassed < 1;
  }

  /**
   * Creates a simple timer that can track whether a given number of
   * seconds has passed. Useful for detecting idle behavior or delays
   * in time-driven animations.
   *
   * @param {number} seconds - The duration the timer should wait for.
   * @returns {object} An object with start(), hasReached(), and reset() methods.
   */
  calculateIdleTimer(seconds) {
    const threshold = seconds * 1000;
    let startTime = null;
    return {
      start() {
        if (startTime === null) {
          startTime = Date.now();
        }
      },
      hasReached() {
        if (startTime === null) return false;
        return Date.now() - startTime >= threshold;
      },
      reset() {
        startTime = null;
      },
    };
  }
}
