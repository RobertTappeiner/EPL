/**
 * Handles all bottle‑related actions in the game,
 * such as throwing bottles and checking bottle collisions.
 */
class BottleSystem {
  constructor(world) {
    this.world = world;
  }

  /**
   * Creates a new thrown bottle at the character's position.
   * @returns {ThrowableObject} The newly created bottle.
   */
  createThrowBottle() {
    return new ThrowableObject(
      this.world.character.x + 40,
      this.world.character.y + 10,
      this.world.character.otherDirection,
    );
  }

  /**
   * Checks if the player is trying to throw a bottle.
   * If so, creates the bottle, starts its movement,
   * and adds it to the world's throwableObjects array.
   */
  checkThrowObjects() {
    if (this.world.keyboard.THROW && this.world.character.bottleCount > 0) {
      this.world.character.manageBottleCount(-1);
      const bottle = this.createThrowBottle();
      bottle.world = this.world;
      bottle.start();
      this.world.throwableObjects.push(bottle);
      audioManager.playOneShot(audioManager.throwBottleSound, 0.3);
    }
  }

  /**
   * Checks all thrown bottles to see if they hit any enemies.
   * If a collision is found, the correct hit handler is called.
   */
  checkBottleHitsEnemies() {
    this.world.throwableObjects.forEach((bottle) => {
      if (bottle.hasHit) return;
      this.world.level.enemies.forEach((enemy) => {
        if (bottle.hasHit) return;
        if (!bottle.isColliding(enemy)) return;
        this.handleBottleEnemyCollision(bottle, enemy);
      });
    });
  }

  /**
   * Handles what happens when a bottle hits an enemy.
   * Applies different logic for the endboss and regular enemies.
   */
  handleBottleEnemyCollision(bottle, enemy) {
    if (enemy instanceof Endboss) {
      this.handleBottleHitEndboss(bottle, enemy);
      this.world.updateEndbossHealthBar();
    }
    if (enemy instanceof Chicken || enemy instanceof SmallChicken) {
      this.handleBottleHitRegularEnemy(bottle, enemy);
    }
    audioManager.playOneShot(audioManager.bottleCollisionSound, 0.3);
  }

  /**
   * Handles a bottle hitting a regular enemy.
   * Marks the bottle as used, kills the enemy,
   * plays the splash animation, and schedules removal.
   */
  handleBottleHitRegularEnemy(bottle, enemy) {
    bottle.hasHit = true;
    this.killRegularEnemy(enemy);
    this.stopBottleMovement(bottle);
    this.startBottleSplash(bottle);
    this.scheduleBottleRemoval(bottle);
  }

  /**
   * Removes a regular enemy by setting its energy to zero
   * and removing it from the world's enemies array.
   */
  killRegularEnemy(enemy) {
    enemy.energy = 0;
    this.world.removeDeadEnemy(enemy);
  }

  /**
   * Stops the bottle's movement by clearing its speed,
   * disabling gravity, and stopping its throw interval.
   */
  stopBottleMovement(bottle) {
    bottle.speedY = 0;
    bottle.acceleration = 0;
    clearInterval(bottle.throwInterval);
  }

  /**
   * Starts the bottle splash animation after a collision.
   */
  startBottleSplash(bottle) {
    bottle.isSplashing = true;
    bottle.isThrown = false;
    bottle.img = bottle.imageCache[bottle.THROWABLE_BOTTLE_SPLASH_IMG[0]];
    bottle.playSplashAnimation();
  }

  /**
   * Removes the bottle splash animation after a short delay.
   */
  scheduleBottleRemoval(bottle) {
    setTimeout(() => {
      this.world.removeBottleSplashAnimation(bottle);
    }, 200);
  }

  /**
   * Handles a bottle hitting the endboss.
   * Applies damage, plays the splash animation,
   * and schedules bottle removal.
   */
  handleBottleHitEndboss(bottle, endboss) {
    bottle.hasHit = true;
    this.applyEndbossDamage(endboss);
    this.stopBottleMovement(bottle);
    this.startBottleSplash(bottle);
    this.scheduleBottleRemoval(bottle);
  }

  /**
   * Applies damage to the endboss and checks if it has died.
   */
  applyEndbossDamage(endboss) {
    endboss.hurt();
    if (endboss.isDead()) {
      this.handleEndbossDeath();
    }
  }

  /**
   * Removes the endboss from the world when it dies.
   */
  handleEndbossDeath(endboss) {
    this.world.removeDeadEnemy(endboss);
  }
}
