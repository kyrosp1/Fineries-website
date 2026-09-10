(() => {
  const init = () => {
    const story = document.querySelector("[data-capability-story]");
    if (!story) return;

    const chapters = [...story.querySelectorAll("[data-cap-chapter]")];
    const artworks = [...story.querySelectorAll("[data-cap-art]")];
    const counter = story.querySelector("[data-cap-counter]");
    let active = "";

    const activate = (num) => {
      if (!num || active === num) return;
      active = num;
      story.dataset.capActive = num;
      chapters.forEach((chapter) => chapter.classList.toggle("is-active", chapter.dataset.capChapter === num));
      artworks.forEach((artwork) => artwork.classList.toggle("is-active", artwork.dataset.capArt === num));
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

    activate(chapters[0]?.dataset.capChapter);
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
