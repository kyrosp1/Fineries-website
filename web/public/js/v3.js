/* ============================================================
   FINERIES DIGITAL — V3 motion
   Lenis smooth scroll + GSAP. Rotating hero word, reveals,
   counters, magnetic buttons, custom cursor, nav behaviour.
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);
  if (reduced) document.documentElement.classList.add("reduced-motion");

  if (window.lucide) lucide.createIcons();

  /* ---- image fallback ---- */
  document.querySelectorAll(".media img").forEach(function (img) {
    img.addEventListener("error", function () {
      var m = img.closest(".media");
      if (m) m.classList.add("is-failed");
    });
  });

  /* ---- Lenis ---- */
  var lenis = null;
  if (!reduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGsap) lenis.on("scroll", ScrollTrigger.update);
  }

  /* ---- Nav ---- */
  var nav = document.querySelector(".nav3");
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-solid", y > 40);
      if (y > 500 && y > lastY + 6) nav.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 500) nav.classList.remove("is-hidden");
    }
    lastY = y;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu (full-screen overlay) ---- */
  var burger = document.querySelector(".nav3__burger");
  var mobile = document.querySelector(".mnav");
  if (burger && mobile) {
    function openMenu() {
      mobile.classList.add("open");
      mobile.setAttribute("aria-hidden", "false");
      burger.setAttribute("aria-expanded", "true");
      document.body.classList.add("mnav-open");
    }
    function closeMenu() {
      mobile.classList.remove("open");
      mobile.setAttribute("aria-hidden", "true");
      burger.setAttribute("aria-expanded", "false");
      document.body.classList.remove("mnav-open");
    }
    burger.addEventListener("click", openMenu);
    mobile.querySelectorAll("[data-mnav-close]").forEach(function (el) {
      el.addEventListener("click", closeMenu);
    });
    mobile.querySelectorAll(".mnav__links a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobile.classList.contains("open")) closeMenu();
    });
  }

  /* ---- Reveals (IntersectionObserver — not rAF-dependent) ---- */
  var rvEls = document.querySelectorAll("[data-rv], [data-rv-stagger]");
  if (!reduced && "IntersectionObserver" in window && rvEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add("in"); });
  }

  if (hasGsap && !reduced) {

    /* ---- Rotating hero word ---- */
    var rot = document.getElementById("hero-rot");
    if (rot) {
      var words;
      try { words = JSON.parse(rot.getAttribute("data-words") || ""); } catch (e) { words = null; }
      if (!words || !words.length) words = ["brands", "products", "content"];
      var i = 0;
      setInterval(function () {
        gsap.to(rot, {
          yPercent: -55, opacity: 0, duration: 0.4, ease: "power3.in",
          onComplete: function () {
            i = (i + 1) % words.length;
            rot.textContent = words[i];
            gsap.fromTo(rot, { yPercent: 55, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
          }
        });
      }, 2600);
    }

    /* ---- Parallax figures ---- */
    document.querySelectorAll("[data-para]").forEach(function (frame) {
      var img = frame.querySelector("img");
      if (!img) return;
      gsap.fromTo(img, { yPercent: -7, scale: 1.14 }, {
        yPercent: 7, scale: 1.14, ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* ---- Magnetic ---- */
    if (window.matchMedia("(hover: hover)").matches) {
      document.querySelectorAll(".btn3, .circ, .hero3__watch .play").forEach(function (btn) {
        var bx = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3" });
        var by = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3" });
        btn.addEventListener("mousemove", function (e) {
          var r = btn.getBoundingClientRect();
          bx((e.clientX - r.left - r.width / 2) * 0.22);
          by((e.clientY - r.top - r.height / 2) * 0.3);
        });
        btn.addEventListener("mouseleave", function () { bx(0); by(0); });
      });
    }
  }

  /* ---- Custom cursor (one brand colour at a time; cycles on hover) ---- */
  var cur = document.querySelector(".cur");
  if (cur && !reduced && hasGsap && window.matchMedia("(hover: hover)").matches) {
    var brandCursor = ["#08BCB3", "#3C4099", "#C01891", "#FFC80C"]; // teal, blue, magenta, gold
    var bi = 0;
    var cx = gsap.quickTo(cur, "left", { duration: 0.16, ease: "power2" });
    var cy = gsap.quickTo(cur, "top", { duration: 0.16, ease: "power2" });
    window.addEventListener("mousemove", function (e) { cur.classList.add("on"); cx(e.clientX); cy(e.clientY); });
    // hover grow/colour-change effect removed for now
    void brandCursor; void bi;
  }

  /* ---- Video modal ---- */
  var openBtn = document.querySelector("[data-open-video]");
  var modal = document.querySelector("[data-video-modal]");
  var vid = modal ? modal.querySelector("video") : null;
  if (openBtn && modal && vid) {
    var openModal = function () {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
      var p = vid.play();
      if (p && p.catch) p.catch(function () {});
    };
    var closeModal = function () {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lenis) lenis.start();
      vid.pause();
    };
    openBtn.addEventListener("click", openModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.hasAttribute("data-close-video")) closeModal();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---- Footer year ---- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
