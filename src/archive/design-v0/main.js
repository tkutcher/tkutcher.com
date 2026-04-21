window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

const rotatingWord = document.querySelector("[data-rotating-word]");

if (rotatingWord) {
  const words = (rotatingWord.dataset.words || "")
    .split(",")
    .map((word) => word.trim())
    .filter(Boolean);

  let currentIndex = 0;

  if (words.length > 0) {
    rotatingWord.textContent = words[currentIndex];

    window.setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
      rotatingWord.classList.add("is-switching");

      window.setTimeout(() => {
        rotatingWord.textContent = words[currentIndex];
        rotatingWord.classList.remove("is-switching");
      }, 180);
    }, 2400);
  }
}
