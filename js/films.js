document.querySelectorAll(".bom-movie").forEach((card) => {
  const video = card.querySelector("video"),
    button = card.querySelector(".bom-play"),
    duration = card.querySelector(".bom-duration"),
    error = card.querySelector(".bom-error");
  button.hidden = false;
  button.addEventListener("click", () => {
    button.hidden = true;
    duration.hidden = true;
    video.play().catch(() => {
      button.hidden = false;
      error.hidden = false;
    });
  });
  video.addEventListener("play", () => {
    document.querySelectorAll(".bom-movie video").forEach((other) => {
      if (other !== video) other.pause();
    });
    button.hidden = true;
    duration.hidden = true;
    error.hidden = true;
  });
  video.addEventListener("ended", () => {
    button.hidden = false;
    duration.hidden = false;
  });
  video.addEventListener("error", () => {
    error.hidden = false;
  });
});
