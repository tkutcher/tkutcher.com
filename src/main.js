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

const readingLists = document.querySelectorAll("[data-reading-list]");

if (readingLists.length) {
  const createCoverPlaceholder = (title) => {
    const placeholder = document.createElement("span");
    placeholder.className = "reading-card__placeholder";
    placeholder.setAttribute("aria-hidden", "true");
    placeholder.textContent = title
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
    return placeholder;
  };

  const createReadingCard = (book) => {
    const card = document.createElement("article");
    card.className = "reading-card";

    const cover = document.createElement("div");
    cover.className = "reading-card__cover";

    if (book.coverUrl) {
      const image = document.createElement("img");
      image.src = book.coverUrl;
      image.alt = `${book.title} book cover`;
      image.width = 400;
      image.height = 600;
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("error", () => {
        image.replaceWith(createCoverPlaceholder(book.title));
      });
      cover.append(image);
    } else {
      cover.append(createCoverPlaceholder(book.title));
    }

    const status = document.createElement("span");
    status.className = `reading-card__status reading-card__status--${book.status}`;
    status.textContent = book.status === "currently-reading" ? "Currently reading" : "Read";
    cover.append(status);

    const body = document.createElement("div");
    body.className = "reading-card__body";

    const title = document.createElement("h3");
    title.textContent = book.title;
    body.append(title);

    if (book.author) {
      const author = document.createElement("p");
      author.textContent = book.author;
      body.append(author);
    }

    card.append(cover, body);
    return card;
  };

  readingLists.forEach(async (container) => {
    try {
      const response = await fetch(container.dataset.readingSource);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const readingList = await response.json();
      const requestedLimit = Number.parseInt(container.dataset.readingLimit || "", 10);
      const readingListUrl =
        response.url || new URL(container.dataset.readingSource, window.location.href).href;
      const selectedBooks = Number.isFinite(requestedLimit)
        ? readingList.books.slice(0, requestedLimit)
        : readingList.books;
      const books = selectedBooks.map((book) => ({
        ...book,
        coverUrl: book.coverUrl ? new URL(book.coverUrl, readingListUrl).href : "",
      }));

      container.replaceChildren(...books.map(createReadingCard));

      const carousel = container.closest("[data-reading-carousel]");
      if (carousel) {
        const previousButton = carousel.querySelector("[data-carousel-previous]");
        const nextButton = carousel.querySelector("[data-carousel-next]");
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        const updateCarouselControls = () => {
          const maximumScroll = Math.max(0, container.scrollWidth - container.clientWidth);
          previousButton.disabled = container.scrollLeft <= 4;
          nextButton.disabled = container.scrollLeft >= maximumScroll - 4;
        };

        const moveCarousel = (direction) => {
          container.scrollBy({
            left: direction * Math.max(container.clientWidth * 0.8, 240),
            behavior: reducedMotion.matches ? "auto" : "smooth",
          });
        };

        previousButton.addEventListener("click", () => moveCarousel(-1));
        nextButton.addEventListener("click", () => moveCarousel(1));
        container.addEventListener("scroll", updateCarouselControls, { passive: true });
        window.addEventListener("resize", updateCarouselControls);
        updateCarouselControls();
      }
    } catch {
      const message = document.createElement("p");
      message.className = "reading-list__message";
      message.textContent = "The reading list is unavailable right now.";
      container.replaceChildren(message);
    }
  });
}

document.querySelectorAll("[data-sports-carousel]").forEach((carousel) => {
  const section = carousel.closest(".sports-section");
  const previousButton = section?.querySelector("[data-sports-carousel-previous]");
  const nextButton = section?.querySelector("[data-sports-carousel-next]");

  if (!previousButton || !nextButton) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const updateControls = () => {
    const maximumScroll = Math.max(0, carousel.scrollWidth - carousel.clientWidth);
    previousButton.disabled = carousel.scrollLeft <= 4;
    nextButton.disabled = carousel.scrollLeft >= maximumScroll - 4;
  };

  const moveCarousel = (direction) => {
    const card = carousel.querySelector(".race-card");
    const gap = Number.parseFloat(window.getComputedStyle(carousel).columnGap) || 16;
    const distance = card ? card.getBoundingClientRect().width + gap : carousel.clientWidth * 0.85;
    carousel.scrollBy({
      left: direction * distance,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  };

  previousButton.addEventListener("click", () => moveCarousel(-1));
  nextButton.addEventListener("click", () => moveCarousel(1));
  carousel.addEventListener("scroll", updateControls, { passive: true });
  window.addEventListener("resize", updateControls);
  updateControls();
});
