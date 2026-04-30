/**
 * Base class for all drawable objects in the game.
 * Provides position, size, and image‑loading functionality that other
 * objects (characters, enemies, collectibles, UI elements) inherit.
 */
class DrawableObject {
  /**
   *  Default position and size of the drawable object.
   *  These values can be overridden by subclasses.
   */
  x = 80;
  y = 240;
  height = 150;
  width = 80;

  /**
   * The currently displayed image.
   * @type {HTMLImageElement}
   */
  img;

  /** 
   * Cache storing preloaded images, keyed by their file paths. 
   * Used to avoid reloading the same image multiple times.
   */
  imageCache = {};

  /**
   * Loads a single image and assigns it as the object's current sprite.
   * @param {string} path - File path of the image to load.
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /** 
   * Preloads multiple images and stores them in the image cache. 
   * Useful for animations or objects with multiple states. 
   * 
   * @param {string[]} arr - Array of image file paths to load. 
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
