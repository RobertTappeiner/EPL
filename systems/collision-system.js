/**
 * Handles all collision checks between the character,
 * enemies, and separators in the world.
 */
class CollisionSystem {
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks horizontal collisions between the character and enemies.
   * This method is called inside World.checkCollisions(), which runs at about 5 FPS
   * through the world's run() loop.
   * If the character touches an enemy from the side, they take damage.
   */
  checkEnemyHorizontalCollision() {
    this.world.level.enemies.forEach((enemy) => {
      if (
        enemy.energy > 0 &&
        this.world.character.isColliding(enemy) &&
        !this.world.character.isCollidingFromAbove(enemy) &&
        !this.world.character.isHurt()
      ) {
        this.world.character.hit();
        this.world.updateHealthBar();
      }
    });
  }

  /**
   * Checks if the character lands on top of an enemy.
   * Runs at 60 FPS for smooth and responsive stomp detection.
   * If the character hits an enemy from above, the enemy is defeated.
   */
  checkVerticalEnemyCollisions() {
    this.world.level.enemies.forEach((enemy) => {
      if (
        enemy.energy > 0 &&
        this.world.character.isColliding(enemy) &&
        this.world.character.isCollidingFromAbove(enemy)
      ) {
        this.handleEnemyStomp(enemy);
        setTimeout(() => this.world.removeDeadEnemy(enemy), 500);
      }
    });
  }

  /**
   * Handles the logic when the character stomps an enemy.
   * The enemy is defeated, the character bounces upward,
   * and in the final section small chickens spawn bottles when they die.
   */
  handleEnemyStomp(enemy) {
    enemy.energy = 0;
    this.world.character.speedY = 25;
    if (this.world.isFinalSection() && enemy instanceof SmallChicken) {
      this.world.spawnBottle(enemy.x, enemy.y);
    }
  }

  /**
   * Starts the 60 FPS interval that checks vertical enemy collisions.
   * This keeps stomp detection smooth and responsive.
   */
  setVerticalCollisionInterval() {
    this.world.registerInterval(
      setInterval(() => {
        this.checkVerticalEnemyCollisions();
      }, 1000 / 60),
    );
  }

  /**
   * Checks collisions between the character and separators.
   * Runs at about 5 FPS. If the character touches a separator,
   * they take damage unless already hurt.
   */
  checkSeparatorCollision() {
    this.world.level.separators.forEach((separator) => {
      if (
        (this.world.character.isColliding(separator) ||
          this.world.character.isCollidingFromAbove(separator)) &&
        !this.world.character.isHurt()
      ) {
        this.world.character.hit();
        this.world.updateHealthBar();
      }
    });
  }
}
