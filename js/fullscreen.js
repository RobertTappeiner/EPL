document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("fullscreen-div");
  const button = document.getElementById("toggle-fullscreen");
  const icon = document.getElementById("fullscreen-icon");

  function onFullscreenChange() {
    if (document.fullscreenElement === container) {
      icon.src = "/img/screen/fullscreen_exit.png"; // exit icon
    } else {
      icon.src = "/img/screen/fullscreen.png"; // fullscreen icon
    }
  }

  container.addEventListener("fullscreenchange", onFullscreenChange);

  button.addEventListener("click", async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await container.requestFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  });
});
