(() => {
  const init = () => {
    const story = document.querySelector("[data-capability-story]");
    if (!story) return;

    const chapters = [...story.querySelectorAll("[data-cap-chapter]")];
    const artworks = [...story.querySelectorAll("[data-cap-art]")];
    const counter = story.querySelector("[data-cap-counter]");
    let active = story.dataset.capActive || chapters[0]?.dataset.capChapter || "";
    const exitTimers = new WeakMap();

    const activate = (num) => {
      if (!num || active === num) return;
      const previous = active;
      const previousIndex = chapters.findIndex((chapter) => chapter.dataset.capChapter === previous);
      const nextIndex = chapters.findIndex((chapter) => chapter.dataset.capChapter === num);
      const direction = nextIndex >= previousIndex ? "forward" : "backward";
      const oldArtwork = artworks.find((artwork) => artwork.dataset.capArt === previous);
      const newArtwork = artworks.find((artwork) => artwork.dataset.capArt === num);

      active = num;
      story.dataset.capActive = num;
      chapters.forEach((chapter) => chapter.classList.toggle("is-active", chapter.dataset.capChapter === num));

      if (oldArtwork && oldArtwork !== newArtwork) {
        const priorTimer = exitTimers.get(oldArtwork);
        if (priorTimer) window.clearTimeout(priorTimer);
        oldArtwork.classList.remove("is-active", "is-entering-forward", "is-entering-backward", "is-exiting-forward", "is-exiting-backward");
        oldArtwork.classList.add(`is-exiting-${direction}`);
        exitTimers.set(oldArtwork, window.setTimeout(() => {
          oldArtwork.classList.remove("is-exiting-forward", "is-exiting-backward");
        }, 900));
      }

      if (newArtwork && oldArtwork !== newArtwork) {
        const priorTimer = exitTimers.get(newArtwork);
        if (priorTimer) window.clearTimeout(priorTimer);
        newArtwork.classList.remove("is-active", "is-entering-forward", "is-entering-backward", "is-exiting-forward", "is-exiting-backward");
        newArtwork.classList.add(`is-entering-${direction}`);
        void newArtwork.offsetWidth;
        window.requestAnimationFrame(() => {
          newArtwork.classList.remove("is-entering-forward", "is-entering-backward");
          newArtwork.classList.add("is-active");
        });
      }
      const position = Math.max(0, chapters.findIndex((chapter) => chapter.dataset.capChapter === num));
      if (counter) counter.textContent = `${String(position + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
    };

    chapters.forEach((chapter) => {
      chapter.addEventListener("mouseenter", () => activate(chapter.dataset.capChapter));
      chapter.addEventListener("focusin", () => activate(chapter.dataset.capChapter));
    });

    if (window.gsap && window.ScrollTrigger && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      chapters.forEach((chapter) => {
        window.ScrollTrigger.create({
          trigger: chapter,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => activate(chapter.dataset.capChapter),
          onEnterBack: () => activate(chapter.dataset.capChapter),
        });
      });
    } else {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) activate(visible.target.dataset.capChapter);
      }, { rootMargin: "-35% 0px -35%", threshold: [0, .25, .5, .75] });
      chapters.forEach((chapter) => observer.observe(chapter));
    }

    const initial = chapters.find((chapter) => chapter.classList.contains("is-active"));
    if (initial) {
      story.dataset.capActive = initial.dataset.capChapter;
      const position = chapters.indexOf(initial);
      if (counter) counter.textContent = `${String(position + 1).padStart(2, "0")} / ${String(chapters.length).padStart(2, "0")}`;
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
