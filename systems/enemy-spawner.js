/**
 * Handles spawning and managing the small chicks
 * that appear during the endboss fight.
 */
class EnemySpawnerSystem {
  constructor(world) {
    this.world = world;
    this.endFightChickens = [];
    this.chickensPerWave = 3;
  }

  /**
   * Spawns a full wave of end‑fight ckicks.
   * Creates spacing between them and spawns one chick at each position.
   */
  spawnEndFightChicken() {
    const positions = this.createSpacingBetweenChickens();
    positions.forEach((x) => {
      const chicken = this.createEndFightChicken(x);
      this.registerEndFightChicken(chicken);
    });
  }

  /**
   * Creates a single end‑fight chick at the given x‑position.
   * Sets its world reference, starting position, and animation.
   * @param {number} x - The x‑position where the chick should spawn.
   * @returns {SmallChicken} The newly created ckick.
   */
  createEndFightChicken(x) {
    const chicken = new SmallChicken(x, 2400, 2800);
    chicken.y = 365;
    chicken.world = this.world;
    chicken.start();
    return chicken;
  }

  /**
   * Adds the chick to both the internal tracking array
   * and the world's enemies array.
   * @param {SmallChicken} chicken - The chick to be added to the arrays.
   */
  registerEndFightChicken(chicken) {
    this.endFightChickens.push(chicken);
    this.world.level.enemies.push(chicken);
  }

  /**
   * Creates random x‑positions for a wave of chicks,
   * making sure they are not too close to each other.
   *
   * The method works like this:
   * - It chooses random x‑positions inside a fixed spawn range.
   * - Each new position must be at least `minDistance` away from all
   *   previously chosen positions.
   * - If a random position is too close, it tries again (up to 50 attempts).
   * - The number of positions created depends on `chickensPerWave`.
   *
   * @returns {number[]} An array of x‑positions for spawning chickens.
   */
  createSpacingBetweenChickens() {
    const minDistance = 40;
    const usedPositions = [];
    const spawnStart = 2400;
    const spawnWidth = 400;
    for (let i = 0; i < this.chickensPerWave; i++) {
      let x;
      let attempts = 0;
      do {
        x = spawnStart + Math.random() * spawnWidth;
        attempts++;
      } while (
        usedPositions.some((prevX) => Math.abs(prevX - x) < minDistance) &&
        attempts < 50
      );
      usedPositions.push(x);
    }
    return usedPositions;
  }

  /**
   * Checks if all end‑fight chickens are defeated.
   * If none are alive, a new wave is spawned.
   */
  checkChickenWaves() {
    const alive = this.endFightChickens.filter((c) => c.energy > 0);
    if (alive.length === 0) {
      this.spawnEndFightChicken();
    }
  }
}
