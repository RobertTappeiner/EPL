/**
 * Manages all game audio, including background music, sound effects,
 * one‑shot SFX, restartable sounds, ambient loops, and sound pools.
 * Provides a centralized interface for playing, pausing, and resetting audio.
 */

class AudioManager {
  /** * Creates a new AudioManager instance and initializes all audio categories:
   * - background music
   * - restartable character sounds
   * - one‑shot sound effects (coin, bottle, collisions, win/lose)
   * - enemy death and alert sounds
   * - sound‑pool‑based repeated SFX (hurt sounds)
   * - ambient looped sounds
   * */
  constructor() {
    const savedState = localStorage.getItem("soundIsOn"); //now
    this.soundIsOn = savedState !== null ? JSON.parse(savedState) : true;

    //1.Background music
    this.backgroundMusic = new Audio("audio/background_music2.mp3");
    this.backgroundMusic.loop = true;

    //2. Restartable sound
    this.characterJumpSound = new Audio("audio/pepe_jump.mp3");

    //3.One-shot sound effects SFX (cloneNode)
    this.collectCoinSound = new Audio("audio/collect_coin.mp3");
    this.collectBottleSound = new Audio("audio/collect_bottle.mp3");
    this.throwBottleSound = new Audio("audio/throw_object.mp3");
    this.bottleCollisionSound = new Audio("audio/bottle_hit.mp3");
    this.youLost = new Audio("audio/you_lost.mp3");
    this.youWon = new Audio("audio/you_won.mp3");

    //4.One-time SFX per instance and time flag with boolean
    this.bigChickenDeadSound = new Audio("audio/chicken_dead.mp3");
    this.smallChickenDeadSound = new Audio("audio/chicken_dead2.mp3");
    this.endbossDeadSound = new Audio("audio/endboss_dead.mp3");
    this.endbossAlertSound = new Audio("audio/endboss_alert2.mp3");

    //6.Repeated SFX (sound pool)
    this.endbossHurtSound = new Audio("audio/endboss_hurt.mp3");
    this.playEndbossHurt = this.createSoundPool(this.endbossHurtSound, 5);
    this.characterHurtSound = new Audio("audio/pepe_hurt2.mp3");
    this.playCharacterHurt = this.createSoundPool(this.characterHurtSound, 5);

    //6. looped ambient SFX category.
    this.characterSnoreSound = new Audio("audio/pepe_snore.mp3");

    // Apply saved mute state
    if (this.soundIsOn) {
      this.unmuteAll();
    } else {
      this.muteAll();
    }
  }

  /**
   * Enables or disables background music only. Does not affect other sound effects.
   * @param {boolean} isOn - if true, the background music can be heard.
   */
  toggleBackgroundMusic(isOn) {
    this.soundIsOn = isOn;
    if (isOn) {
      this.backgroundMusic.play();
    } else {
      this.backgroundMusic.pause();
    }
  }

  /**
   * Creates a sound pool for rapidly repeated sound effects.
   * Generates multiple cloned Audio nodes and returns a function that
   * plays them in a rotating sequence, allowing overlapping playback.
   *
   * @param {HTMLAudioElement} sound - The base audio element to clone.
   * @param {number} [size=5] - Number of audio clones to include in the pool.
   * @returns {function(number=1): void} A function that plays the next sound
   * in the pool at the given volume.
   */
  createSoundPool(sound, size = 5) {
    const pool = [];
    for (let i = 0; i < size; i++) {
      pool.push(sound.cloneNode());
    }
    let index = 0;
    return (volume = 1) => {
      if (!this.soundIsOn) return;
      const s = pool[index];
      index = (index + 1) % size;
      s.currentTime = 0;
      s.volume = volume;
      s.play();
    };
  }

  /**
   * Plays a one‑shot sound effect.
   * Clones the provided audio node so the sound can overlap with itself
   * and plays it at the given volume.
   *
   * @param {HTMLAudioElement} sound - The base audio element to clone and play.
   * @param {number} [volume=1] - Playback volume for this instance.
   */
  playOneShot(sound, volume = 1) {
    if (!this.soundIsOn) return;
    const s = sound.cloneNode();
    s.volume = volume;
    s.play();
  }

  /**
   * Plays a sound effect only once per game event or entity.
   * Uses a boolean flag to prevent repeated playback and ensures
   * the sound always starts from the beginning.
   *
   * @param {HTMLAudioElement} sound - The audio element to play.
   * @param {string} flagName - The name of the boolean flag controlling playback.
   * @param {number} [volume=1] - Playback volume for this instance.
   */
  playOneTime(sound, flagName, volume = 1) {
    if (this[flagName] || !this.soundIsOn) return;
    this[flagName] = true;
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play();
  }

  /**
   * Plays a sound effect only once for a specific object.
   * Uses a flag stored on the object to prevent repeated playback,
   * ensuring the sound triggers a single time per entity or event.
   *
   * @param {Object} obj - The object that holds the playback flag.
   * @param {HTMLAudioElement} sound - The audio element to play.
   * @param {string} flagName - The name of the boolean flag on the object.
   * @param {number} [volume=1] - Playback volume for this instance.
   */
  playOneTimeForObject(obj, sound, flagName, volume = 1) {
    if (obj[flagName] || !this.soundIsOn) return;
    obj[flagName] = true;
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play();
  }

  /**
   * Plays a restartable sound effect.
   * Always resets the audio to the beginning before playback,
   * ensuring the sound restarts cleanly even if triggered rapidly.
   *
   * @param {HTMLAudioElement} sound - The audio element to restart and play.
   * @param {number} [volume=1] - Playback volume for this instance.
   */
  playRestartable(sound, volume = 1) {
    if (!this.soundIsOn) return;
    sound.pause();
    sound.currentTime = 0;
    sound.volume = volume;
    sound.play();
  }

  /**
   * Plays a looping ambient sound.
   * Ensures the audio is set to loop and starts playback if it is not
   * already playing, allowing continuous background ambience.
   *
   * @param {HTMLAudioElement} sound - The audio element to loop.
   * @param {number} [volume=1] - Playback volume for this instance.
   */
  playLoopedSound(sound, volume = 1) {
    if (!this.soundIsOn) return;
    sound.loop = true;
    sound.volume = volume;
    if (sound.paused) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  /**
   * Stops the looping ambient sound and rewinds it to the beginning.
   * @param {HTMLAudioElement} sound - The audio element to loop.
   */
  stopLoopedSound(sound) {
    if (!sound.paused) {
      sound.pause();
      sound.currentTime = 0;
    }
  }

  /**
   * Starts playing the loop sound specific to the character snoring.
   * Uses the looped‑sound system to ensure continuous ambient playback.
   */
  playCharacterSnoreSound() {
    this.playLoopedSound(this.characterSnoreSound, 0.4);
  }

  /**
   * Stops playing the loop sound specific to the character snoring
   * and rewinds it from the beginning.
   */
  stopCharacterSnoreSound() {
    this.stopLoopedSound(this.characterSnoreSound);
  }

  /**
   * Mutes all game audio.
   * Disables sound playback globally, pauses active ambient loops,
   * and rewinds them so they restart cleanly when unmuted.
   */
  muteAll() {
    this.soundIsOn = false;
    this.backgroundMusic.pause();
    this.characterSnoreSound.pause();
    this.characterSnoreSound.currentTime = 0;
  }

  /**
   * Unmutes all game audio.
   * Re-enables sound playback and resumes the background music.
   * Restores the background music volume and plays it only if the user
   * has interacted with the page (to comply with autoplay restrictions).
   */
  unmuteAll() {
    this.soundIsOn = true;
    this.backgroundMusic.volume = 0.1;
    if (this.userHasInteracted) {
      this.backgroundMusic.play();
    }
  }

  /**
   * Toggles the global sound state.
   * Switches between muted and unmuted modes by delegating to
   * the corresponding audio control methods.
   */
  toggleSound() {
    this.soundIsOn = !this.soundIsOn;

    if (this.soundIsOn) {
      this.unmuteAll();
    } else {
      this.muteAll();
    }

    // save state
    localStorage.setItem("soundIsOn", JSON.stringify(this.soundIsOn));

    // update button icon
    const btn = document.getElementById("soundBtn");
    if (btn) {
      btn.src = this.soundIsOn
        ? "./img/btn_sound.png"
        : "./img/btn_nosound.png";
    }
  }

  /**
   * Resets all audio states in the game.
   * Stops and rewinds background and ambient sounds, clears sound‑pool playback,
   * resets one‑time sound flags, and re‑enables global audio.
   * Used when restarting or stopping the game.
   */
  resetAllAudio() {
    this.backgroundMusic.pause();
    this.backgroundMusic.currentTime = 0;
    this.characterSnoreSound.pause();
    this.characterSnoreSound.currentTime = 0;
    if (this.hurtSoundPool) {
      this.hurtSoundPool.forEach((s) => {
        s.pause();
        s.currentTime = 0;
      });
    }
    this.endbossAlertSoundPlayed = false;
    this.endbossDeadSoundPlayed = false;
  }
}
