(() => {
  const init = () => {
    const story = document.querySelector("[data-capability-story]");
    if (!story) return;

    const chapters = [...story.querySelectorAll("[data-cap-chapter]")];
    const artworks = [...story.querySelectorAll("[data-cap-art]")];
    const counter = story.querySelector("[data-cap-counter]");
    let active = story.dataset.capActive || chapters[0]?.dataset.capChapter || "";
    const exitTimers = new WeakMap();
    // Sequenced stage swap: the current artwork animates fully OUT before the next
    // animates IN (elegant, non-overlapping). EXIT_MS ~ the exit's visible duration.
    const EXIT_MS = 470;
    let enterTimer = null;
    let shownArt = artworks.find((artwork) => artwork.classList.contains("is-active")) || null;

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

      if (newArtwork && newArtwork !== shownArt) {
        if (enterTimer) { window.clearTimeout(enterTimer); enterTimer = null; }
        const leaving = shownArt;

        // 1) Send the currently shown artwork out of the stage.
        if (leaving) {
          const priorTimer = exitTimers.get(leaving);
          if (priorTimer) window.clearTimeout(priorTimer);
          leaving.classList.remove("is-active", "is-entering-forward", "is-entering-backward");
          leaving.classList.add(`is-exiting-${direction}`);
          exitTimers.set(leaving, window.setTimeout(() => {
            leaving.classList.remove("is-exiting-forward", "is-exiting-backward");
          }, 900));
        }

        // 2) Pre-position the incoming artwork off-stage (hidden), then bring it in
        //    only AFTER the outgoing one has cleared.
        const priorNewTimer = exitTimers.get(newArtwork);
        if (priorNewTimer) window.clearTimeout(priorNewTimer);
        newArtwork.classList.remove("is-active", "is-exiting-forward", "is-exiting-backward", "is-entering-forward", "is-entering-backward");
        newArtwork.classList.add(`is-entering-${direction}`);
        void newArtwork.offsetWidth;

        const target = newArtwork;
        enterTimer = window.setTimeout(() => {
          // is-entering was painted EXIT_MS ago, so we can flip straight to is-active
          // and the base transition animates it in (no rAF needed — avoids getting
          // stuck if the tab is backgrounded mid-transition).
          target.classList.remove("is-entering-forward", "is-entering-backward");
          target.classList.add("is-active");
          shownArt = target;
          enterTimer = null;
        }, leaving ? EXIT_MS : 0);
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
