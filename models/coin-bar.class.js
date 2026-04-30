/**
 * Represents the status of the collectible object 'coin'.
 * It updates its state according to the number of collected coins.
 * @extends DrawableObject
 */
class CoinBar extends DrawableObject {
    /**
     * Array of strings containing images paths for the coin bar [0% to 100%];
     */
    IMAGES_COIN = [
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png',
    'img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png'
   ];

   /**
    * Creates the bottle bar UI element and positions it on the canvas.
    * It also initializes its default image (0% fill).
    */
   constructor(){
    super();
    this.loadImages(this.IMAGES_COIN);
    this.setPercentage(0);
    this.x = 0;
    this.y = 40;
    this.width = 250;
    this.height = 60;
   }

   /**
    * Updates the bar's fill level by displaying the image corresponding to the percentage.
    * @param {number} percentage - the current coin percentage of the bar
    */
   setPercentage(percentage){
    this.percentage = Math.min(percentage, 100);
    let images = this.IMAGES_COIN;
    let path = images[this.resolveImageIndex()];
    this.img = this.imageCache[path];
   }

   /**
    * Sets the image index corresponding to the percentage of the bar.
    * @returns {number} - the index of the image to display from the array with image paths.
    */
   resolveImageIndex(){
    if(this.percentage == 100) {
        return 5;
    } else if(this.percentage > 80){
        return 4;
    } else if(this.percentage > 60){
        return 3;
    } else if(this.percentage > 40){
        return 2;
    } else if(this.percentage > 20){
        return 1;
    } else {
        return 0;
    }
   }
}