/**
 * Represents the status of the endbosse's energy level.
 * It updates its state according to the number of hits the endboss gets.
 * @extends DrawableObject
 */
class EndbossBar extends DrawableObject {
  /**
   * Array of strings containing images paths for the health bar.
   */
  IMAGES_ENDBOSS_BAR_FULL = [
    "img/7_statusbars/2_statusbar_endboss/green/green0.png",
    "img/7_statusbars/2_statusbar_endboss/green/green20.png",
    "img/7_statusbars/2_statusbar_endboss/green/green40.png",
    "img/7_statusbars/2_statusbar_endboss/green/green60.png",
    "img/7_statusbars/2_statusbar_endboss/green/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green/green100.png",
  ];

  /**
   * Creates the status bar UI element and positions it on the canvas.
   * It also initializes its default image (100% fill).
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_ENDBOSS_BAR_FULL);
    this.setPercentage(100);
    this.x = 720 - this.width - 170;
    this.y = 80;
    this.width = 250;
    this.height = 60;
    this.visible = false;
  }

  /**
   * Updates the bar's fill level by displaying the image corresponding to the percentage
   * @param {number} percentage - the current health percentage of the status bar
   */
  setPercentage(percentage) {
    this.percentage = Math.min(percentage, 100);
    let images = this.IMAGES_ENDBOSS_BAR_FULL;
    let path = images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Sets the image index corresponding to the percentage of the bar.
   * @returns {number} - the index of the image to display from the array with image paths.
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
