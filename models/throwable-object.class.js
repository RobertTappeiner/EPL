/**
 * Represents a throwable bottle object used by the character.
 * A ThrowableObject can be thrown in either direction, rotates while
 * flying, and plays a splash animation when it hits the ground or an enemy.
 *
 * The class loads two animation sets:
 * - THROWABLE_BOTTLE_IMG: rotation frames while the bottle is in the air
 * - THROWABLE_BOTTLE_SPLASH_IMG: splash frames after impact
 *
 * Each bottle has a fixed size and uses hitbox offsets inherited from
 * MovableObject. The `isThrown` and `isSplashing` flags control which
 * animation should play during the update cycle.
 *
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Counter for the animation frame index. Used to restart the frame from index 0,
   * also used to loop the walking animation.
   */
  currentImg = 0;

  /**
   * * Image paths for the bottle rotating animation.
   *  @type {string[]}
   */
  THROWABLE_BOTTLE_IMG = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * * Image paths for the bottle splash animation.
   *  @type {string[]}
   */
  THROWABLE_BOTTLE_SPLASH_IMG = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  constructor(x, y, direction) {
    super().loadImage(
      "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    );
    this.x = x;
    this.y = y;
    this.height = 80;
    this.width = 60;
    this.isThrown = false;
    this.isSplashing = false;
    this.otherDirection = direction;
    this.loadImages(this.THROWABLE_BOTTLE_IMG);
    this.loadImages(this.THROWABLE_BOTTLE_SPLASH_IMG);
  }

  /**
   * Starts the throwable bottle's behavior by triggering the throw
   * movement and beginning its rotation animation. This is the entry
   * point for activating a newly created ThrowableObject.
   * Called by the world when the level starts to activate movement
   * and animation updates for the bottle.
   */
  start() {
    this.throw();
    this.animate();
  }

  /**
   * Plays the bottle's rotation animation while it is in the air.
   * The animation runs at 60 FPS and only updates when the bottle
   * is currently marked as thrown.
   */
  animate() {
    this.world.registerInterval(
      setInterval(() => {
        if (this.isThrown) {
          this.playAnimation(this.THROWABLE_BOTTLE_IMG);
        }
      }, 1000 / 60),
    );
  }

  /**
   * Initiates the bottle's throw movement. Sets the thrown state,
   * applies upward velocity, activates gravity, and moves the bottle
   * horizontally based on the character's facing direction.
   *
   * The horizontal movement runs on a short interval to simulate
   * fast projectile motion.
   */
  throw() {
    this.isThrown = true;
    this.hasHit = false;
    this.speedY = 10;
    this.applyGravity();
    this.throwInterval = setInterval(() => {
      if (this.otherDirection) {
        this.x -= 10;
      } else if (!this.otherDirection) {
        this.x += 10;
      }
    }, 25);
    this.world.registerInterval(this.throwInterval);
  }

  /**
 * Plays the splash animation after the bottle hits an enemy. 
 * The animation runs at a slower interval to display
 * the splash frames in sequence while the bottle is in the
 * splashing state.
 */
  playSplashAnimation() {
    this.world.registerInterval(
      setInterval(() => {
        if (this.isSplashing) {
          this.playAnimation(this.THROWABLE_BOTTLE_SPLASH_IMG);
        }
      }, 100),
    );
  }
}
