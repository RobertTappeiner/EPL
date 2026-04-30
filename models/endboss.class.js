/**
 * Represents one of the enemies in game, the final enemy.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /**
   * Defines the endboss's height and width and the vertical positioning.
   */
  height = 250;
  width = 160;
  y = 190;
  speed = 0;

  /**
   * Counter for the animation frame index. Used to restart the frame from index 0,
   * also used to loop the walking animation.
   */
  currentImg = 0;
  /**
   * Draws a hitbox around the endboss, used for collision-test purposes.
   */
  offset = { top: 60, left: 30, right: 10, bottom: 5 };

  /**
   * Image paths for the endbosse's idle animation.
   *  @type {string[]}
   */
  IMAGES_IDLE = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
  ];

  /**
   * * Image paths for the endbosse's alert animation.
   *  @type {string[]}
   */
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /**
   * * Image paths for the endbosse's walking animation.
   *  @type {string[]}
   */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /**
   * * Image paths for the endbosse's attack animation.
   *  @type {string[]}
   */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /**
   * * Image paths for the endbosse's hurt animation.
   *  @type {string[]}
   */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /**
   * * Image paths for the endbosse's dead animation.
   *  @type {string[]}
   */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Initializes the endboss enemy at the given position and sets up its patrol area.
   * The endboss moves between the defined left and right boundaries and plays
   * different sound effects according to his state.
   * The Endboss uses a simple state machine:
   * - idle → alert → walking → attacking
   * - hurt overrides any state temporarily
   * - dead finalizes the state and stops movement
   *
   * @param {number} x - the horizontal position from which the endboss spawn.
   * @param {number} sectionStart - the left border of movement, once he gets here, he goes right.
   * @param {number} sectionEnd - the right border of movement, once he gets here, he goes left.
   */
  constructor(x, sectionStart, sectionEnd) {
    super();
    this.loadImage("img/4_enemie_boss_chicken/1_walk/G1.png");
    this.x = x;
    this.sectionStart = sectionStart;
    this.sectionEnd = sectionEnd;
    this.otherDirection = false;
    this.speed = 20;
    this.isIdle = true;
    this.isAlert = false;
    this.isActive = false;
    this.isAttacking = false;
    this.isHurt = false;
    this.dead = false;
    this.hasEnteredArena = false;
    this.deadSoundPlayed = false;
    this.alertSoundPlayed = false;
    this.overlayTriggered = false;
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_ALERT);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_DEAD);
  }

  /**
   * Initializes the endboss's behavior loops.
   * Called by the world when the level starts to activate movement
   * and animation updates for this enemy.
   */
  start() {
    this.animate();
  }

  /**
   * Starts the endboss's update loops.
   * AThe interval is registered in the world so it can be stopped
   * when the game ends.
   */
  animate() {
    this.world.registerInterval(
      setInterval(() => {
        this.updateState();
      }, 150),
    );
  }

  /**
   * State update machine that updates the Endboss's current behaviour
   * flags according to a priority order.
   * Useful for detecting idle/alert/hurt etc. behavior in state-driven animations.
   *
   * Priority:
   * 1. dead
   * 2. hurt
   * 3. attacking
   * 4. alert
   * 5. active (walking/patrolling)
   * 6. idle (default fallback)
   *
   * The first matching state triggers its corresponding handler and
   * immediately returns, ensuring that only one state is processed per frame.
   * This prevents conflicting animations or overlapping behaviors.
   *
   * @returns - this method does not return a value.
   */
  updateState() {
    if (this.dead) {
      this.handleDeadState();
      return;
    }
    if (this.isHurt) {
      this.handleHurtState();
      return;
    }
    if (this.isAttacking) {
      this.handleAttackState();
      return;
    }
    if (this.isAlert) {
      this.handleAlertState();
      return;
    }
    if (this.isActive) {
      this.handleActiveState();
      return;
    }
    if (this.isIdle) {
      this.handleIdleState();
    }
  }

  /**
   * Plays the Endboss death animation and triggers the one-time
   * death sound. Once the animation finishes, the win overlay is
   * shown (only once) after a short delay.
   */
  handleDeadState() {
    const finished = this.playAnimationOnce(this.IMAGES_DEAD);
    audioManager.playOneTimeForObject(
      this,
      audioManager.endbossDeadSound,
      "deadSoundPlayed",
      0.4,
    );
    if (finished && !this.overlayTriggered) {
      this.overlayTriggered = true;
      setTimeout(() => toggleYouWonOverlay(true), 3000);
    }
  }

  /**
   * Plays the Endboss's hurt animation. Once the hurt animation
   * is finished, the Endboss exits the hurt state
   * and immediately starts an attack.
   */
  handleHurtState() {
    let finished = this.playAnimationOnce(this.IMAGES_HURT);
    if (finished) {
      this.isHurt = false;
      this.startAttack();
    }
  }

  /**
   * Plays the Endboss's attack animation. Once the attack animation
   * is finished, he enters the active state.
   */
  handleAttackState() {
    let finished = this.playAnimationOnce(this.IMAGES_ATTACK);
    if (finished) {
      this.isAttacking = false;
    }
  }

  /**
   * Plays the Endboss's alert animation once and triggers the alert sound.
   *When the animation finishes, the Endboss switches from alert
   * to active state and resets the animation index.
   */
  handleAlertState() {
    let finished = this.playAnimationOnce(this.IMAGES_ALERT);
    if (finished) {
      this.isAlert = false;
      this.isActive = true;
      this.currentImg = 0;
    }
    audioManager.playOneTimeForObject(
      this,
      audioManager.endbossAlertSound,
      "alertSoundPlayed",
      0.5,
    );
  }

  /**
   * Plays the waking animation. The Endboss moves within
   * its patrol boundaries.
   */
  handleActiveState() {
    this.handleMovementBoundaries();
    this.playWalkAnimation();
  }

  /**
   * Plays the idle animation.
   */
  handleIdleState() {
    this.playAnimation(this.IMAGES_IDLE);
  }

  /**
   * Plays the walk animation and sets the movement direction
   * according to the left and right boundaries.
   */
  playWalkAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
    if (!this.otherDirection) {
      this.moveLeft();
    } else {
      this.moveRight();
    }
  }

  /**
   * Keeps the Endboss within its patrol boundaries. Before entering the arena,
   * he moves only until reaching the entry point. Once inside, his direction
   * flips whenever he hits the left or right patrol limits.
   */
  handleMovementBoundaries() {
    if (!this.isActive) return;
    if (!this.hasEnteredArena) {
      if (this.x <= this.sectionEnd - this.width) {
        this.hasEnteredArena = true;
      }
      return;
    }
    //Left boundary
    if (this.x <= this.sectionStart) {
      this.x = this.sectionStart;
      this.otherDirection = true;
    }
    //Right boundary
    if (this.x + this.width >= this.sectionEnd) {
      this.x = this.sectionEnd - this.width;
      this.otherDirection = false;
    }
  }

  /**
   * Switches the Endboss from idle to alert state and resets
   * the animation index.
   */

  triggerAlert() {
    if (this.isIdle) {
      this.isIdle = false;
      this.isAlert = true;
      this.currentImg = 0;
    }
  }

  /**
   * Applies damage to the Endboss. If his energy reaches zero,
   * he dies. Otherwise he enters the hurt state, stops attacking
   * and moving, resets the animation index, and plays the hurt sound.
   */

  hurt() {
    super.hit();
    if (this.energy <= 0) {
      this.die();
      return;
    }
    this.isHurt = true;
    this.isAttacking = false;
    this.isActive = false;
    this.currentImg = 0;
    audioManager.playEndbossHurt();
  }

  /**
   * Sets the Endboss into the dead state and clears all other
   * active states. Resets the animation index.
   */

  die() {
    this.dead = true;
    this.isHurt = false;
    this.isAttacking = false;
    this.isActive = false;
    this.isAlert = false;
    this.currentImg = 0;
  }

  /**
   * Starts an attack by enabling the attack and active states
   * and resetting the animation index.
   */

  startAttack() {
    this.isAttacking = true;
    this.isActive = true;
    this.currentImg = 0;
  }
}
