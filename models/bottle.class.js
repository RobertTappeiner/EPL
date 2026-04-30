/**
 * Represents a collectible bottle object that the player can pick up.
 * @extends CollectibleObject
 */
class Bottle extends CollectibleObject {
    /**
     * Array of strings containing the path to the bottle image.
     * @type {string[]}
     */
    static BOTTLE_IMAGES = [
        'img/6_salsa_bottle/1_salsa_bottle_on_ground.png'
    ];

    /**
     * Sets the main parameters of the bottle (horizonal position, vertical position, width, height, type).
     * The offset is used for testing purposes to draw a hitbox.
     * @param {number} x - the horizontal position on the canvas
     * @param {number} y - the vertical position on the canvas
     */
    constructor(x, y){
        super(x, y, 60, 60, Bottle.BOTTLE_IMAGES, 'bottle');
        this.offset = { top: 10, bottom: 8, left: 20, right: 10  };
    }
}