const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  const closeNavigation = () => {
    navToggle.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("is-open");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    siteNav.classList.toggle("is-open", !isOpen);
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeNavigation();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navToggle.getAttribute("aria-expanded") === "true") {
      closeNavigation();
      navToggle.focus();
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

const bookViewer = document.querySelector("[data-book-viewer]");

if (bookViewer) {
  const pages = bookViewer.dataset.pages.split(",").map((page) => page.trim());
  const leftPage = bookViewer.querySelector("[data-book-left]");
  const rightPage = bookViewer.querySelector("[data-book-right]");
  const previousButton = bookViewer.querySelector("[data-book-previous]");
  const nextButton = bookViewer.querySelector("[data-book-next]");
  const count = bookViewer.querySelector("[data-book-count]");
  let pageIndex = 0;
  let isSinglePage = window.matchMedia("(max-width: 35rem)").matches;

  const renderBook = () => {
    const step = isSinglePage ? 1 : 2;
    const visibleEnd = Math.min(pageIndex + step, pages.length);

    leftPage.src = pages[pageIndex];
    leftPage.alt = `Ceremony program page ${pageIndex + 1}`;

    if (rightPage) {
      const rightIndex = Math.min(pageIndex + 1, pages.length - 1);
      rightPage.src = pages[rightIndex];
      rightPage.alt = `Ceremony program page ${rightIndex + 1}`;
      rightPage.closest(".book-page").hidden = isSinglePage || rightIndex === pageIndex;
    }

    count.textContent = isSinglePage
      ? `${pageIndex + 1} / ${pages.length}`
      : `${pageIndex + 1}–${visibleEnd} / ${pages.length}`;
    previousButton.disabled = pageIndex === 0;
    nextButton.disabled = visibleEnd >= pages.length;
  };

  previousButton.addEventListener("click", () => {
    pageIndex = Math.max(0, pageIndex - (isSinglePage ? 1 : 2));
    renderBook();
  });

  nextButton.addEventListener("click", () => {
    pageIndex = Math.min(pages.length - 1, pageIndex + (isSinglePage ? 1 : 2));
    renderBook();
  });

  bookViewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      previousButton.click();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      nextButton.click();
    }
  });

  window.matchMedia("(max-width: 35rem)").addEventListener("change", (event) => {
    isSinglePage = event.matches;
    pageIndex = isSinglePage ? pageIndex : pageIndex - (pageIndex % 2);
    renderBook();
  });

  renderBook();
}
