let canvas;
let world;
let keyboard = new Keyboard();
let audioManager = new AudioManager();
/**
 * Initializes the game, is called at onload in <body>.
 */
function init() {
  canvas = document.getElementById("canvas");
  initMobileControls();
  showStartScreen();
}

/**
 * Starts the game by created a new World instance.
 * The world is being drawn and the adjacent functions are beind run.
 */
function startGame() {
  world = new World(canvas, keyboard);
  world.draw();
  world.run();
}

/**
 * Removes the start overlay and shows the main game overlay.
 * Initializes the level containing the character, enemies, collectibles and bacground objects.
 * Marks that the user has interacted with the page (allowing audio playback),
 * and starts background music only if global sound is enabled.
 */
function startGameFlow() {
  const overlay = document.getElementById("start_screen");
  const game = document.getElementById("game_wrapper");
  overlay.classList.add("d-none");
  game.classList.remove("d-none");
  initLevel();
  startGame();
  audioManager.userHasInteracted = true;
  if (audioManager.soundIsOn) {
    audioManager.toggleBackgroundMusic(true);
  }
}

/**
 * Hides the end-of-game overlays showing the start overlay.
 * Resets all audio effects and background music, without altering the global mute state.
 * Stops all game loops from within the world object.
 */
function stopGameFlow() {
  toggleYouLostOverlay(false);
  toggleYouWonOverlay(false);
  if (world) {
    world.stopGame();
  }
  audioManager.resetAllAudio();
  showStartScreen();
}

/**
 * Restarts the game after it has ended (hides all overlays and resets audio only if global sound
 * is enabled).
 * Reinitializes the level and starts a fresh game session.
 */
function restartGame() {
  toggleYouLostOverlay(false);
  toggleYouWonOverlay(false);
  if (world) {
    world.stopGame();
  }
  audioManager.resetAllAudio();
  initLevel();
  startGame();
  if (audioManager.soundIsOn) {
    audioManager.toggleBackgroundMusic(true);
  }
}

/**
 * Attaches event listeners to the keyboard on keypress.
 * Prevents default behaviour of keys outside the game loop.
 */
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowUp") {
    keyboard.UP = true;
    event.preventDefault();
  }
  if (event.code === "ArrowDown") {
    keyboard.DOWN = true;
    event.preventDefault();
  }
  if (event.code === "ArrowLeft") {
    keyboard.LEFT = true;
    event.preventDefault();
  }
  if (event.code === "ArrowRight") {
    keyboard.RIGHT = true;
    event.preventDefault();
  }
  if (event.code === "Space") {
    keyboard.SPACE = true;
    event.preventDefault();
  }
  if (event.code === "KeyD") {
    keyboard.THROW = true;
    event.preventDefault();
  }
});

/**
 * Attaches event listeners to the keyboard on keyup.
 * Prevents default behaviour of keys outside the game loop.
 */
document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowUp") {
    keyboard.UP = false;
    event.preventDefault();
  }
  if (event.code === "ArrowDown") {
    keyboard.DOWN = false;
    event.preventDefault();
  }
  if (event.code === "ArrowLeft") {
    keyboard.LEFT = false;
    event.preventDefault();
  }
  if (event.code === "ArrowRight") {
    keyboard.RIGHT = false;
    event.preventDefault();
  }
  if (event.code === "Space") {
    keyboard.SPACE = false;
    event.preventDefault();
  }
  if (event.code === "KeyD") {
    keyboard.THROW = false;
    event.preventDefault();
  }
});

/**
 * Creates the setup for mobile controls of the buttons
 * @param {string} id - The DOM element ID of the button.
 * @param {string} key - The property name on the Keyboard object.
 */
function setUpTouchButtons(id, key) {
  const btn = document.getElementById(id);

  btn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    keyboard[key] = true;
    navigator.vibrate?.(30);
  });
  btn.addEventListener("touchend", (e) => {
    e.preventDefault();
    keyboard[key] = false;
  });
}

/**
 * Initializes touch controls for mobile devices.
 * Connects on‑screen buttons to their corresponding keyboard actions.
 */
function initMobileControls() {
  setUpTouchButtons("btn_right", "RIGHT");
  setUpTouchButtons("btn_left", "LEFT");
  setUpTouchButtons("btn_jump", "SPACE");
  setUpTouchButtons("btn_throw", "THROW");
}
