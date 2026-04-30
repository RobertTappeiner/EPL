/**
 * Represents one of the enemies in game, a small chick.
 * @extends MovableObject
 */
class SmallChicken extends MovableObject {
  /**
   * Defines the chick's height and width, the vertical positioning
   * and the initial walking direction.
   */
  height = 55;
  width = 40;
  y = 365;
  direction = "left";

  /**
   * Counter for the animation frame index. Used to restart the frame from index 0,
   * also used to loop the walking animation.
   */
  currentImg = 0;

  /**
   * * Image paths for the chick's walking animation.
   *  @type {string[]}
   */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
  ];

  /**
   * * Image paths for the chick's dead state.
   *  @type {string[]}
   */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  /**
   * Initializes a chick enemy at the given position and sets up its patrol area.
   * The chick moves between the defined left and right boundaries and plays a
   * death sound only once when killed. Also loads the walking and dead animations.
   *
   * @param {number} x - the horizontal position from which the chick spawn
   * @param {number} sectionStart - the left border of movement, once they get here, the go right.
   * @param {number} sectionEnd - the right border of movement, once they get here, the go left.
   */
  constructor(x, sectionStart, sectionEnd) {
    super().loadImage("img/3_enemies_chicken/chicken_small/1_walk/1_w.png");
    this.x = x;
    this.sectionStart = sectionStart;
    this.sectionEnd = sectionEnd;
    this.speed = -(0.25 + Math.random() * 0.25);
    this.otherDirection = false;
    this.deadSoundPlayed = false;
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Initializes the chicken's behavior loops.
   * Called by the world when the level starts to activate movement
   * and animation updates for this enemy.
   */
  start() {
    this.animate();
  }

  /**
   * Starts the chick's update loops.
   * One interval handles movement and state changes,
   * and another handles animation frames.
   * All intervals are registered in the world so they can be stopped
   * when the game ends.
   */
  animate() {
    this.world.registerInterval(
      setInterval(() => {
        this.handleMovementBoundaries();
        this.handleDeathState();
        this.handleMovement();
      }, 1000 / 60),
    );

    this.world.registerInterval(
      setInterval(() => {
        this.handleAnimation();
      }, 100),
    );
  }

  /**
   * Enforces the chick's patrol boundaries.
   * Once they reach the left of right limit, they change the walking direction.
   */
  handleMovementBoundaries() {
    //Left boundary
    if (this.x <= this.sectionStart) {
      this.x = this.sectionStart;
      this.speed = Math.abs(this.speed);
      this.otherDirection = true;
    }
    //Right boundary
    if (this.x + this.width > this.sectionEnd) {
      this.x = this.sectionEnd - this.width;
      this.speed = -Math.abs(this.speed);
      this.otherDirection = false;
    }
  }

  /**
   * Checks the state of the chicken.
   * If dead, it stops the movement of the chicken and plays an
   * appropriate sound effect.
   */
  handleDeathState() {
    if (this.isDead()) {
      this.speed = 0;
      audioManager.playOneTimeForObject(
        this,
        audioManager.smallChickenDeadSound,
        "deadSoundPlayed",
        0.3,
      );
    }
  }

  /**
   * Moves the chicken horizontally by applying its current speed.
   */
  handleMovement() {
    this.x += this.speed;
  }

  /**
   * Plays the appropriate animation based on the chicken's state.
   * If the chicken is dead, the death animation is shown; otherwise,
   * the walking animation is played.
   */
  handleAnimation() {
    if (this.isDead()) {
      this.playAnimation(this.IMAGES_DEAD);
    } else {
      this.playAnimation(this.IMAGES_WALKING);
    }
  }
}
