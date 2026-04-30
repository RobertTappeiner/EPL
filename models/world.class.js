/**
 * The World class represents the main game environment.
 * It is responsible for:
 *  - Rendering all game objects onto the canvas
 *  - Managing the camera and drawing loop
 *  - Initializing and orchestrating subsystems (collision, collectibles, bottles, enemy spawner)
 *  - Handling high-level game state such as the character, level, and UI bars
 *  - Running the main update loop and delegating logic to subsystems
 *
 * The World does NOT implement gameplay logic itself.
 * Instead, it delegates:
 *  - Collision logic → CollisionSystem
 *  - Collectible logic → CollectibleSystem
 *  - Bottle throwing & bottle collisions → BottleSystem
 *  - Enemy wave spawning → EnemySpawnerSystem
 *
 * The World acts as the central coordinator of the game.
 */
class World {
  /**
   * @property {Character} character - The main player character.
   * @property {Level} level - The current level configuration and its enemies, objects, and layout.
   * @property {CanvasRenderingContext2D} context - 2D rendering context used to draw the game.
   * @property {HTMLCanvasElement} canvas - The canvas element where the game is rendered.
   * @property {Keyboard} keyboard - Keyboard input handler for player controls.
   * @property {number} camera_x - Horizontal camera offset used for side-scrolling.
   *
   * @property {StatusBar} statusBar - UI bar showing the player's health.
   * @property {CoinBar} coinBar - UI bar showing collected coins.
   * @property {BottleBar} bottleBar - UI bar showing collected bottles.
   * @property {EndbossBar} endbossBar - UI bar showing the endboss's health.
   *
   * @property {ThrowableObject[]} throwableObjects - Active thrown bottles currently in the world.
   * @property {Separator[]} separators - Invisible collision boundaries used for level structure.
   * @property {number[]} intervals - IDs of active interval timers used by the game loop.
   */
  character = new Character();
  level = LEVEL_1;
  context;
  canvas;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  coinBar = new CoinBar();
  bottleBar = new BottleBar();
  endbossBar = new EndbossBar();
  throwableObjects = [];
  separators = [];
  intervals = [];

  /**
   * Creates a new World instance.
   *
   * @param {HTMLCanvasElement} canvas - The canvas on which the game is rendered.
   * @param {Keyboard} keyboard - The keyboard input handler.
   *
   * The constructor:
   *  - Stores references to the canvas, context, and keyboard
   *  - Instantiates the main subsystems (bottle, collectible, collision, enemy spawner)
   *  - Sets up vertical collision checks
   *  - Initializes world objects (character, enemies, clouds)
   */
  constructor(canvas, keyboard) {
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.bottleSystem = new BottleSystem(this);
    this.collectibleSystem = new CollectibleSystem(this);
    this.collisionSystem = new CollisionSystem(this);
    this.enemySpawner = new EnemySpawnerSystem(this);
    this.collisionSystem.setVerticalCollisionInterval();
    this.setWorld();
  }

  /**
   * Draws a single frame of the game world.
   * Clears the canvas, moves the camera, renders all world objects and HUD.
   */
  draw() {
    this.clearCanvas();
    this.moveCamera();
    this.drawWorldObjects();
    this.resetCamera();
    this.drawHUD();
    this.createDrawingLoop();
  }

  /**
   * Clears the entire canvas before drawing the next frame.
   */
  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Shifts the view horizontally based on the camera position.
   */
  moveCamera() {
    this.context.translate(this.camera_x, 0);
  }

  /**
   * Resets the view horizontally after world objects are drawn.
   */
  resetCamera() {
    this.context.translate(-this.camera_x, 0);
  }

  /**
   * Schedules the next frame of the drawing loop using requestAnimationFrame.
   */
  createDrawingLoop() {
    this.animationFrameId = requestAnimationFrame(() => this.draw());
  }

  /**
   * Draws all game objects that appear in the world,
   * such as the background, character, enemies, clouds,
   * thrown bottles, separators, coins, and bottles.
   */
  drawWorldObjects() {
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.throwableObjects);
    this.addObjectsToMap(this.level.separators);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
  }

  /**
   * Draws the heads-up display (HUD),
   * including the bottle, coin, health, and endboss bars.
   */
  drawHUD() {
    this.addToMap(this.bottleBar);
    this.addToMap(this.coinBar);
    this.addToMap(this.statusBar);
    this.addToMap(this.endbossBar);
  }

  /**
   * Sets up the world by giving all characters, enemies, and clouds
   * a reference to this world and starting their animations.
   */
  setWorld() {
    this.character.world = this;
    this.character.start();
    this.level.enemies.forEach((enemy) => {
      enemy.world = this;
      if (enemy.start) {
        enemy.start();
      }
    });
    this.level.clouds.forEach((cloud) => {
      cloud.world = this;
      cloud.start();
    });
  }

  /**
   * Stops the game by canceling the animation loop
   * and clearing all active interval timers.
   */
  stopGame() {
    cancelAnimationFrame(this.animationFrameId);
    this.stopIntervals();
  }

  /**
   * Stores an interval ID so it can be cleared later.
   * @param {number} id - The interval ID returned by setInterval.
   */
  registerInterval(id) {
    this.intervals.push(id);
  }

  /**
   * Stops all active interval timers stored in the intervals array
   * and then clears the array.
   */
  stopIntervals() {
    this.intervals.forEach((id) => clearInterval(id));
    this.intervals = [];
  }

  /**
   * Draws every object in the given array onto the canvas.
   * @param {Object[]} objects - A list of game objects to draw.
   */
  addObjectsToMap(objects) {
    objects.forEach((object) => {
      this.addToMap(object);
    });
  }

  /**
   * Draws a single game object on the canvas.
   * Handles flipping the image if the object faces the other direction.
   * @param {Object} mo - The game object to draw.
   */
  addToMap(mo) {
    if (mo.visible === false) return;
    this.context.save();
    if (mo.otherDirection && !mo.isSplashing) {
      this.flipImageBackwards(mo);
    } else {
      this.flipImageForwards(mo);
    }
    this.context.restore();
  }

  /**
   * Starts the main game loop.
   * Repeatedly checks collisions, handles bottle throws,
   * updates endboss logic, and manages enemy waves.
   */
  run() {
    this.registerInterval(
      setInterval(() => {
        this.checkCollisions();
        this.bottleSystem.checkThrowObjects();
        this.checkEndbossTrigger();
        this.updateEndbossBarVisibility();
        this.enemySpawner.checkChickenWaves();
      }, 200),
    );
  }

  /**
   * Checks all collision-related events in the game.
   * Handles enemy horizontal collisions, separator collisions,
   * and collecting coins, bottles, and bottle hit detection.
   */
  checkCollisions() {
    this.collisionSystem.checkEnemyHorizontalCollision();
    this.collisionSystem.checkSeparatorCollision();
    this.collectibleSystem.checkCoinCollect();
    this.collectibleSystem.checkBottleCollect();
    this.bottleSystem.checkBottleHitsEnemies();
  }

  /**
   * Updates the character's health bar to match the character's current energy.
   */
  updateHealthBar() {
    this.statusBar.setPercentage(this.character.energy);
  }

  /**
   * Updates the endboss health bar to match the endboss's current energy.
   */
  updateEndbossHealthBar() {
    this.endbossBar.setPercentage(this.level.endboss.energy);
  }

  /**
   * Removes the given enemy from the level's enemy array.
   * @param {Object} enemy - The enemy to remove.
   */
  removeDeadEnemy(enemy) {
    const index = this.level.enemies.indexOf(enemy);
    if (index > -1) {
      this.level.enemies.splice(index, 1);
    }
  }

  /**
   * Removes the given bottle splash animation from the throwableObjects array.
   * @param {Object} bottle - The bottle animation to remove.
   */
  removeBottleSplashAnimation(bottle) {
    const index = this.throwableObjects.indexOf(bottle);
    if (index > -1) {
      this.throwableObjects.splice(index, 1);
    }
  }

  /**
   * Draws the object's image normally (facing right).
   * @param {Object} mo - The game object to draw.
   */
  flipImageForwards(mo) {
    this.context.drawImage(mo.img, mo.x, mo.y, mo.width, mo.height);
  }

  /**
   * Flips the object's image horizontally so it faces left,
   * then draws it on the canvas.
   * @param {Object} mo - The game object to draw.
   */
  flipImageBackwards(mo) {
    this.context.translate(mo.x + mo.width, 0);
    this.context.scale(-1, 1);
    this.context.drawImage(mo.img, 0, mo.y, mo.width, mo.height);
  }

  /**
   * Checks if the character has reached the endboss area.
   * If the boss is still idle, this starts the boss fight
   * and spawns the first wave of chickens.
   */
  checkEndbossTrigger() {
    const boss = this.level.endboss;
    if (!boss) return;
    if (this.character.x >= 2800 && this.level.endboss.isIdle) {
      this.level.endboss.triggerAlert();
      this.enemySpawner.spawnEndFightChicken();
    }
  }

  /**
   * Shows or hides the endboss health bar depending on
   * whether the character is inside the boss section.
   */
  updateEndbossBarVisibility() {
    const endboss = this.level.endboss;
    const character = this.character;
    if (character.x >= 2100 && character.x < endboss.sectionEnd) {
      this.endbossBar.visible = true;
    } else {
      this.endbossBar.visible = false;
    }
  }

  /**
   * Creates a new bottle at the given position and adds it
   * to the level's bottles array.
   * @param {number} x - The bottle's x-position.
   * @param {number} y - The bottle's y-position.
   */
  spawnBottle(x, y) {
    let bottle = new Bottle(x, y);
    this.level.bottles.push(bottle);
  }

  /**
   * Checks if the character is inside the final section of the level.
   * @returns {boolean} True if the character is between 2200 and 2800 on the x-axis.
   */
  isFinalSection() {
    return this.character.x >= 2200 && this.character.x <= 2800;
  }
}
