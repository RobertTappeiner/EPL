/**
 * Represents the main charachter in the game.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /**
   * Defines the character's height and width, the vertical
   * positioning and speed.
   */
  height = 250;
  width = 110;
  y = 180;
  speed = 10;

  /**
   * Reference to the current game world instance.
   * Assigned externally after character creation.
   * @type {World}
   */
  world;

  /**
   * Animation frame counters and indices used for various animation states.
   * These values are incremented and reset to control frame progression.
   * @type {number}
   */
  currentImg = 0;
  jumpingIndex = 0;
  longIdleIndex = 0;
  idleIndex = 0;
  longIdleDelay = 0;
  idleDelay = 0;
  bottleCount = 0;
  maxBottle = 6;

  /**
   * Image paths for the character's long idle animation.
   *  @type {string[]}
   */
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
  ];

  /**
   * Image paths for the character's idle animation.
   *  @type {string[]}
   */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /**
   * Image paths for the character's walking animation.
   *  @type {string[]}
   */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /**
   * Image paths for the character's jump animation.
   *  @type {string[]}
   */
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  /**
   * Image paths for the character's hurt animation.
   *  @type {string[]}
   */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /**
   * Image paths for the character's dead animation.
   *  @type {string[]}
   */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /**
   * Creates a new character instance, initializes animation states,
   * loads all required sprite images, and prepares collision offsets.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/1_idle/idle/I-1.png");
    this.offset = { top: 100, bottom: 10, left: 10, right: 30 };
    this.longIdleTimer = this.calculateIdleTimer(10);
    this.isInIdleState = false;
    this.wasIdleLastFrame = false;
    this.deathAnimationStarted = false;
    this.deathAnimationPlayed = false;
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Initializes the character's behavior loops.
   * Called by the world when the level starts to activate movement
   * and animation updates for the character.
   */
  start() {
    this.physicsLoop();
    this.animate();
    this.applyGravity();
  }

  /**
   * Starts the physics update loop for the character.
   * Runs at 60 FPS and updates movement, jump handling, and camera position.
   */
  physicsLoop() {
    this.world.registerInterval(
      setInterval(() => {
        this.handleMovement();
        this.handleJump();
        this.updateCamera();
      }, 1000 / 60),
    );
  }

  /**
   * Starts the animation update loop for the character.
   * Runs at 50 FPS and updates the aniamtion states (hurt, dead, jump, walking and idle).
   */
  animate() {
    this.world.registerInterval(
      setInterval(() => {
        this.handleAnimationState();
      }, 50),
    );
  }

  /**
   * Handles horizontal character movement based on keyboard input.
   * Moves the character left or right if the corresponding key is pressed
   * and the character remains within the level boundaries.
   */
  handleMovement() {
    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      if (!this.isAboveGround()) {
      }
    }
    if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      if (!this.isAboveGround()) {
      }
    }
  }

  /**
   * Initiates a jump when the SPACE key is pressed and the character is on the ground,
   * and plays the jump sound effect.
   */
  handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
      audioManager.playRestartable(audioManager.characterJumpSound, 0.2);
    }
  }

  /**
   * Moves the camera position horizonally according to the character's x-coordinate.
   * Keeps the character centered on the screen by applying a fixed offset
   */
  updateCamera() {
    this.world.camera_x = -this.x + 80;
  }

  /**
   * Determines and executes the appropriate animation state for the character.
   * Prioritizes hurt, dead, jump and walking animation before going into the idle animation.
   */
  handleAnimationState() {
    if (this.handleHurtAnimation()) return;
    if (this.handleDeadAnimation()) return;
    if (this.handleJumpAnimation()) return;
    if (this.handleWalkAnimation()) return;
    this.handleIdleAnimations();
  }

  /**
   * Handles the hurt animation state.
   * Plays the hurt animation if the character is damaged and resets idle-related timers.
   * @returns {boolean} True if the hurt animation was triggered, otherwise false.
   */
  handleHurtAnimation() {
    if (!this.isHurt()) return false;
    this.exitIdleStateIfNeeded();
    this.playHurtAnimation();
    this.longIdleTimer.reset();
    return true;
  }

  /**
   * Plays the hurt animation sequence.
   */
  playHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
  }

  /**
   * Handles the death animation state.
   * Plays the death animation and triggers the end screen once the animation finishes.
   * @returns {boolean} True if the death animation was triggered, otherwise false.
   */
  handleDeadAnimation() {
    if (!this.isDead()) return false;
    this.playDeadAnimation();
    this.triggerEndScreenIfFinished();
    return true;
  }

  /**
   * Plays the death animation sequence.
   * Initializes the animation on the first frame and freezes character movement.
   */
  playDeadAnimation() {
    if (!this.deathAnimationStarted) {
      this.currentImg = 0;
      this.deathAnimationStarted = true;
    }
    this.playAnimation(this.IMAGES_DEAD);
    this.speed = 0;
    this.speedY = 0;
  }

  /**
   * Triggers the "You Lost" overlay once the death animation reaches its final frame.
   */
  triggerEndScreenIfFinished() {
    const lastFrame = this.IMAGES_DEAD.length - 1;
    if (this.currentImg === lastFrame && !this.deathAnimationPlayed) {
      this.deathAnimationPlayed = true;
      setTimeout(() => toggleYouLostOverlay(true), 3000);
    }
  }

  /**
   * Handles the jump animation state.
   * Plays the appropriate jump animation frames.
   * @returns {boolean} True if the jump animation was triggered, otherwise false.
   */
  handleJumpAnimation() {
    if (!this.isAboveGround()) {
      this.jumpingIndex = 0;
      return false;
    }
    this.exitIdleStateIfNeeded();
    this.smoothJumpAnimation();
    this.longIdleTimer.reset();
    return true;
  }

  /**
   * Handles the walking animation state.
   * Plays the walking animation when the character moves left or right.
   * @returns {boolean} True if the walking animation was triggered, otherwise false.
   */
  handleWalkAnimation() {
    if (!this.world.keyboard.RIGHT && !this.world.keyboard.LEFT) {
      return false;
    }
    this.exitIdleStateIfNeeded();
    this.playAnimation(this.IMAGES_WALKING);
    this.longIdleTimer.reset();
    return true;
  }

  /**
   * Handles all idle-related animations, including normal idle, long idle, and throw-idle transitions.
   * Uses a time-driven animation system to determine which idle animation sequence to play.
   * @returns {boolean} Always returns true once idle handling is executed.
   */
  handleIdleAnimations() {
    this.prepareIdleFrame();
    this.enterIdleState();
    this.longIdleTimer.start();
    if (this.isThrowing()) {
      this.handleThrowDuringIdle();
    } else if (this.longIdleTimer.hasReached()) {
      this.smoothLongIdleAnimation();
    } else {
      this.smoothIdleAnimation();
    }
    return true;
  }

  /**
   * Sets the first idle frame if the character was not idle last frame.
   */
  prepareIdleFrame() {
    if (!this.wasIdleLastFrame) {
      this.img = this.imageCache[this.IMAGES_IDLE[0]];
    }
  }

  /**
   * Marks the character as being in an idle state.
   */
  enterIdleState() {
    this.wasIdleLastFrame = true;
    this.isInIdleState = true;
  }

  /**
   * Exits idle state and resets idle-related counters if currently idle.
   */
  exitIdleStateIfNeeded() {
    if (this.isInIdleState) {
      this.resetIdleState();
      this.isInIdleState = false;
      this.wasIdleLastFrame = false;
    }
  }

  /**
   * Checks whether the player is pressing the throw key.
   * @returns {boolean}
   */
  isThrowing() {
    return this.world.keyboard.THROW;
  }

  /**
   * Handles idle-to-throw transition and resets idle timers.
   */
  handleThrowDuringIdle() {
    this.exitIdleStateIfNeeded();
    this.smoothIdleAnimation();
    this.longIdleTimer.reset();
  }

  /**
   * Resets all idle animation counters and stops snoring audio.
   */
  resetIdleState() {
    this.idleDelay = 0;
    this.idleIndex = 0;
    this.longIdleDelay = 0;
    this.longIdleIndex = 0;
    audioManager.stopCharacterSnoreSound();
  }

  /**
   * Plays the correct jump animation frame based on vertical speed.
   */
  smoothJumpAnimation() {
    if (this.speedY > 0) {
      this.manageIndexInterval(0, 3);
    } else if (this.speedY < 0 && this.isAboveGround()) {
      this.manageIndexInterval(4, 6);
    } else if (!this.isAboveGround()) {
      this.manageIndexInterval(7, 8);
    } else {
      this.img = this.imageCache[this.IMAGES_JUMPING[0]];
    }
  }

  /**
   * Advances the jump animation index within a given frame range.
   */
  manageIndexInterval(start, end) {
    if (this.jumpingIndex < start) {
      this.jumpingIndex = start;
    } else if (this.jumpingIndex <= end) {
      this.img = this.imageCache[this.IMAGES_JUMPING[this.jumpingIndex]];
      this.jumpingIndex++;
    } else {
      this.jumpingIndex = end;
      this.img = this.imageCache[this.IMAGES_JUMPING[end]];
    }
  }

  /**
   * Plays the standard idle animation using a timed frame delay.
   */
  smoothIdleAnimation() {
    this.idleDelay++;
    if (this.idleDelay < 8) {
      return;
    }
    this.idleDelay = 0;
    if (this.idleIndex < this.IMAGES_IDLE.length) {
      this.img = this.imageCache[this.IMAGES_IDLE[this.idleIndex]];
      this.idleIndex++;
    } else {
      this.idleIndex = 0;
    }
  }

  /**
   * Plays the long idle animation and triggers snoring audio.
   */
  smoothLongIdleAnimation() {
    this.longIdleDelay++;
    if (this.longIdleDelay < 10) {
      return;
    }
    this.longIdleDelay = 0;
    if (this.longIdleIndex < this.IMAGES_LONG_IDLE.length) {
      this.img = this.imageCache[this.IMAGES_LONG_IDLE[this.longIdleIndex]];
      this.longIdleIndex++;
    } else {
      this.longIdleIndex = 0;
    }
    audioManager.playCharacterSnoreSound();
  }

  /**
   * Adjusts the bottle count within allowed limits and updates the UI bar.
   */
  manageBottleCount(delta) {
    let newCount = this.bottleCount + delta;
    if (newCount > this.maxBottle) {
      newCount = this.maxBottle;
    }
    if (newCount < 0) {
      newCount = 0;
    }
    this.bottleCount = newCount;
    this.world.bottleBar.setPercentage(
      (this.bottleCount / this.maxBottle) * 100,
    );
  }
}
