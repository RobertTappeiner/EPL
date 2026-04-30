/**
 * Reacts to orientation changes and window resizing
 */
window
  .matchMedia("(orientation: portrait)")
  .addEventListener("change", checkOrientation);
window.addEventListener("resize", checkOrientation);

/**
 * Checks the device orientation and screen size.
 * Shows or hides the orientation warning depending on whether the game
 * is being viewed in portrait mode on a small screen.
 */
function checkOrientation() {
  const portrait = window.matchMedia("(orientation: portrait)").matches;
  if (window.innerWidth >= 1030) {
    showOrientationWarning(false);
    return;
  }
  if (portrait) {
    showOrientationWarning(true);
  } else {
    showOrientationWarning(false);
  }
}

/**
 * Shows or hides the orientation warning overlay.
 * @param {boolean} isPortrait - Whether the device is currently in portrait mode.
 */
function showOrientationWarning(isPortrait) {
  const container = document.getElementById("orientation_warning");
  if (isPortrait) {
    container.style.display = "flex";
  } else {
    container.style.display = "none";
  }
}

/**
 * Changes the information displayed in the game's information pannel (game controls or game story)
 */
function toggleInfoPannel() {
  const gameStory = document.getElementById("game_story_container");
  const gameControls = document.getElementById("game_controls_container");
  gameStory.classList.toggle("d-none");
  gameControls.classList.toggle("d-none");
}

/**
 * Displays the start screen overlay containing the information panel.
 * From here the user can start the game.
 */
function showStartScreen() {
  const overlay = document.getElementById("start_screen");
  const game = document.getElementById("game_wrapper");
  overlay.classList.remove("d-none");
  game.classList.add("d-none");
}

/**
 * Toggles the visibility of one of the two ending overlays.
 * It visible when the user has lost the game.
 * Plays a suggesive sound effects and offers the posibility to restart or quit the game.
 * @param {boolean} show - if show is true, the overlay is being displayed
 */
function toggleYouLostOverlay(show) {
  const overlay = document.getElementById("overlay_you_lost");
  if (show) {
    overlay.classList.remove("d-none");
    audioManager.backgroundMusic.pause();
    audioManager.backgroundMusic.currentTime = 0;
    audioManager.playOneShot(audioManager.youLost, 0.3);
  } else {
    overlay.classList.add("d-none");
  }
}

/**
 * Toggles the visibility of one of the two ending overlays.
 * It visible when the user has won the game.
 * Plays a suggesive sound effects and offers the posibility to restart or quit the game.
 * @param {boolean} show - if show is true, the overlay is being displayed
 */
function toggleYouWonOverlay(show) {
  const overlay = document.getElementById("overlay_you_won");
  if (show) {
    if(world) world.stopGame();
    overlay.classList.remove("d-none");
    audioManager.backgroundMusic.pause();
    audioManager.backgroundMusic.currentTime = 0;
    audioManager.stopCharacterSnoreSound();
    audioManager.endbossDeadSound.pause();
    audioManager.endbossDeadSound.currentTime = 0;
    audioManager.playOneShot(audioManager.youWon, 0.3);
  } else {
    overlay.classList.add("d-none");
  }
}
