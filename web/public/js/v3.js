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

    /* ---- Rotating words (hero + CTA; any [data-words] element) ---- */
    document.querySelectorAll("[data-words]").forEach(function (rot) {
      var words;
      try { words = JSON.parse(rot.getAttribute("data-words") || ""); } catch (e) { words = null; }
      if (!words || !words.length) return;
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
    });

    /* ---- Parallax figures ---- */
    document.querySelectorAll("[data-para]").forEach(function (frame) {
      var img = frame.querySelector("img");
      if (!img) return;
      gsap.fromTo(img, { yPercent: -7, scale: 1.14 }, {
        yPercent: 7, scale: 1.14, ease: "none",
        scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    /* ---- Brand Love image: track right as the page scrolls (desktop only) ---- */
    var rightSlideMedia = gsap.matchMedia();
    rightSlideMedia.add("(min-width: 901px)", function () {
      document.querySelectorAll("[data-scroll-right]").forEach(function (img) {
        var frame = img.closest(".media") || img;
        gsap.fromTo(img, {
          xPercent: -10,
          scale: 1.22,
          transformOrigin: "50% 50%"
        }, {
          xPercent: 10,
          scale: 1.22,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.65
          }
        });
      });
    });

    /* ---- Sticky process timeline ---- */
    var processTimeline = document.querySelector("[data-process-timeline]");
    if (processTimeline) {
      var processSteps = Array.prototype.slice.call(processTimeline.querySelectorAll("[data-process-step]"));
      var processProgress = processTimeline.querySelector("[data-process-progress]");
      var processMedia = gsap.matchMedia();

      processMedia.add("(min-width: 801px)", function () {
        if (processSteps[0]) processSteps[0].classList.add("is-active");

        if (processProgress) {
          gsap.to(processProgress, {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: processTimeline,
              start: "top 52%",
              end: "bottom 52%",
              scrub: 0.35
            }
          });
        }

        processSteps.forEach(function (step, index) {
          var node = step.querySelector(".pstep__node");
          if (node) {
            gsap.to(node, {
              "--step-fill": 1,
              ease: "none",
              scrollTrigger: {
                trigger: step,
                start: "top 52%",
                end: "top 34%",
                scrub: 0.3
              }
            });
          }
          ScrollTrigger.create({
            trigger: step,
            start: "top 58%",
            end: "bottom 42%",
            onEnter: function () { step.classList.add("is-active"); },
            onLeaveBack: function () {
              if (index > 0) step.classList.remove("is-active");
            }
          });
        });
      });
    }

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

  /* ---- Service artwork: pointer depth + touch-device entrance ---- */
  var serviceArt = document.querySelectorAll("[data-service-art]");
  if (serviceArt.length && !reduced) {
    if (window.matchMedia("(hover: hover)").matches) {
      serviceArt.forEach(function (art) {
        art.addEventListener("pointermove", function (event) {
          var rect = art.getBoundingClientRect();
          var x = (event.clientX - rect.left) / rect.width - 0.5;
          var y = (event.clientY - rect.top) / rect.height - 0.5;
          art.style.setProperty("--art-x", (x * 4).toFixed(2) + "deg");
          art.style.setProperty("--art-y", (y * -4).toFixed(2) + "deg");
        });
        art.addEventListener("pointerleave", function () {
          art.style.setProperty("--art-x", "0deg");
          art.style.setProperty("--art-y", "0deg");
        });
      });
    } else if ("IntersectionObserver" in window) {
      var artObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-seen");
            artObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.45 });
      serviceArt.forEach(function (art) { artObserver.observe(art); });
    }
  }

  /* ---- Video modal ---- */
  var openBtn = document.querySelector("[data-open-video]");
  var modal = document.querySelector("[data-video-modal]");
  var vid = modal ? modal.querySelector("video") : null;
  if (openBtn && modal && vid) {
    var frame = modal.querySelector(".vmodal__frame");
    var status = document.createElement("div");
    status.className = "vmodal__status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.innerHTML = '<span class="vmodal__spinner" aria-hidden="true"></span><span class="vmodal__message">Loading video…</span>';
    if (frame) frame.insertBefore(status, vid);
    var message = status.querySelector(".vmodal__message");
    var setVideoState = function (state, text) {
      modal.setAttribute("data-video-state", state);
      status.hidden = state === "ready";
      if (message && text) message.textContent = text;
    };
    var showLoading = function () { setVideoState("loading", "Loading video…"); };
    var showBuffering = function () { setVideoState("buffering", "Buffering video…"); };
    var showReady = function () { setVideoState("ready"); };
    var showError = function () { setVideoState("error", "The video could not load. Please check your connection and try again."); };

    vid.addEventListener("loadstart", showLoading);
    vid.addEventListener("waiting", showBuffering);
    vid.addEventListener("stalled", showBuffering);
    vid.addEventListener("canplay", showReady);
    vid.addEventListener("playing", showReady);
    vid.addEventListener("error", showError);

    var openModal = function () {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (lenis) lenis.stop();
      if (vid.error) showError();
      else if (vid.readyState >= 3) showReady();
      else showLoading();
      var p = vid.play();
      if (p && p.catch) p.catch(function () {
        if (!vid.error) setVideoState("error", "Playback did not start. Press play to try again.");
      });
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
