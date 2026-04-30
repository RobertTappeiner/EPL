let LEVEL_1;

/**
 * Initializes the first game level.
 * Creates all level-specific entities including enemies, background layers,
 * obstacles, collectibles, and environmental objects.
 */
function initLevel() {
    LEVEL_1 =  new Level (
    [
        new SmallChicken(300, 50, 1000),
        new Chicken(500, 50, 1000),
        new SmallChicken(800, 50, 1000),
        new Chicken(900, 50, 1000),

        new SmallChicken(1200, 1150,  2200),
        new SmallChicken(1300, 1150,  2200),
        new Chicken(1500, 1150, 2200),
        new SmallChicken(1800, 1150,  2200),
        new Chicken(1950, 1150, 2200), 

        new Endboss(3280, 2600, 3200) 
    ],
    [
        new Cloud(3200),
        new Cloud(3200),
        new Cloud(3200),
        new Cloud(3200),
        new Cloud(3200),
        new Cloud(3200),
        new Cloud(3200),
        new Cloud(3200),
        new Cloud(3200)
    ],
    [
        new BackgroundObject('img/5_background/layers/air.png', -720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', -720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', -720),

        new BackgroundObject('img/5_background/layers/air.png', 0),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 0),

        new BackgroundObject('img/5_background/layers/air.png', 720),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720),

        new BackgroundObject('img/5_background/layers/air.png', 720*2),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720*2),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720*2),

        new BackgroundObject('img/5_background/layers/air.png', 720 * 3),
        new BackgroundObject('img/5_background/layers/3_third_layer/2.png', 720 * 3),
        new BackgroundObject('img/5_background/layers/2_second_layer/2.png', 720 * 3),
        new BackgroundObject('img/5_background/layers/1_first_layer/2.png', 720 * 3),

        new BackgroundObject('img/5_background/layers/air.png', 720* 4),
        new BackgroundObject('img/5_background/layers/3_third_layer/1.png', 720* 4),
        new BackgroundObject('img/5_background/layers/2_second_layer/1.png', 720* 4),
        new BackgroundObject('img/5_background/layers/1_first_layer/1.png', 720* 4),

    ],
    [   
        new SeparatorObject('img/5_background/start.png', -8, 280, 80, 140),
        new SeparatorObject('img/5_background/small_cactus.png', 1000, 300, 160, 140),
        new SeparatorObject('img/5_background/big_cactus.png', 2200, 330, 140, 120),
        
    ], 
    [   
        new Coin (260, 220),
        new Coin(300, 200),
        new Coin(340, 180),
        new Coin(380, 190),
        new Coin(420, 210),

        new Coin(950, 210),
        new Coin(1100, 210),

        new Coin(1400, 140),
        new Coin(1400, 180),
        new Coin(1460, 140),
        new Coin(1460, 180),
        new Coin(1520, 140),
        new Coin(1520, 180),

        new Coin(2000, 160),
        new Coin(2200, 200)
    ],
    [
        new Bottle(600, 370),
        new Bottle(660, 370),

        new Bottle(1780, 370),
        new Bottle(1830, 370),
        new Bottle(1870, 370),
        new Bottle(2800, 370),
    ]
);
}
