/**
 * Represents a game level and stores all objects that belong to it.
 *
 * A level contains enemies, clouds, background objects, separators,
 * collectibles (coins and bottles), and the Endboss. The horizontal
 * end position of the level is fixed.
 */
class Level {
  enemies;
  clouds;
  backgroundObjects;
  separators;
  coins;
  bottles;
  endboss;
  level_end_x = 2800;

  /**
   * Creates a new level with the given objects and automatically
   * identifies the Endboss from the enemy list.
   */
  constructor(enemies, clouds, backgroundObjects, separators, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.separators = separators;
    this.coins = coins;
    this.bottles = bottles;
    this.endboss = enemies.find((e) => e instanceof Endboss);
  }
}
