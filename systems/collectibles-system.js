/**
 * Handles collecting coins and bottles in the world.
 * Checks when the character touches a collectible
 * and updates the correct UI bar.
 */
class CollectibleSystem {
  constructor(world) {
    this.world = world;
  }

  /**
   * Checks if the character touches any coins.
   * If so, the coin is collected.
   */
  checkCoinCollect() {
    this.world.level.coins.forEach((coin) => {
      if (this.world.character.isColliding(coin)) {
        this.collectItem(coin);
      }
    });
  }

  /**
   * Checks if the character touches any bottles.
   * If the character has room for more bottles,
   * the bottle is collected and the count increases.
   */
  checkBottleCollect() {
    this.world.level.bottles.forEach((bottle) => {
      if (this.world.character.isColliding(bottle)) {
        if (this.world.character.bottleCount < this.world.character.maxBottle) {
          this.collectItem(bottle);
          this.world.character.manageBottleCount(+1);
        }
      }
    });
  }

  /**
   * Handles collecting a coin or bottle.
   * Updates the correct UI bar and plays a sound effect,
   * then removes the item from the world.
   * @param {Object} item - The collectible item.
   */
  collectItem(item) {
    const type = item.type;
    if (type === "coin") {
      this.world.coinBar.setPercentage(this.world.coinBar.percentage + 20);
      audioManager.playOneShot(audioManager.collectCoinSound, 0.2);
    }
    if (type == "bottle") {
      this.world.bottleBar.setPercentage(this.world.bottleBar.percentage + 20);
      audioManager.playOneShot(audioManager.collectBottleSound, 0.2);
    }
    this.removeCollectibleItem(item);
  }

  /**
   * Removes the collected item from the level's arrays.
   * @param {Object} item - The item to remove.
   */
  removeCollectibleItem(item) {
    const type = item.type;
    if (type === "coin") {
      this.world.level.coins = this.world.level.coins.filter((c) => c !== item);
    }
    if (type === "bottle") {
      this.world.level.bottles = this.world.level.bottles.filter(
        (b) => b !== item,
      );
    }
  }
}
