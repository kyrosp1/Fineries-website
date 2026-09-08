/* ============================================================
   FINERIES DIGITAL — V2 home page motion
   Lenis smooth scroll + GSAP ScrollTrigger.
   Split-text reveals · rotating hero line · parallax · marquee
   floating service previews · magnetic buttons · custom cursor
   ============================================================ */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined";
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  /* ---- Lucide ---- */
  if (window.lucide) lucide.createIcons();

  /* ---- Image fallback: hide broken photos gracefully ---- */
  document.querySelectorAll(".img-frame img").forEach(function (img) {
    img.addEventListener("error", function () {
      img.closest(".img-frame").classList.add("img-failed");
    });
  });

  /* ---- Lenis smooth scroll ---- */
  var lenis = null;
  if (!reduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (hasGsap) lenis.on("scroll", ScrollTrigger.update);
  }

  /* ---- Nav: glass on scroll, hide on scroll-down ---- */
  var nav = document.querySelector(".nav2");
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 30);
    if (y > 400 && y > lastY + 6) nav.classList.add("is-hidden");
    else if (y < lastY - 6 || y < 400) nav.classList.remove("is-hidden");
    lastY = y;
  }, { passive: true });

  /* ---- Mobile menu ---- */
  var burger = document.querySelector(".nav2__burger");
  var mobile = document.querySelector(".nav2__mobile");
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) nav.classList.add("is-scrolled");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { mobile.classList.remove("open"); });
    });
  }

  /* ---- Tiny split helper: wraps lines for mask reveals ---- */
  function maskLines(el) {
    var lines = el.querySelectorAll(".line-mask .line-inner");
    return lines.length ? lines : null;
  }

  if (hasGsap && !reduced) {

    /* ================= HERO INTRO (home) ================= */
    if (document.querySelector(".hero2")) {
      var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(".nav2__inner", { y: -30, opacity: 0, duration: 0.9 }, 0.1)
        .from(".hero2__meta", { opacity: 0, y: 16, duration: 0.8 }, 0.25);

      var heroLines = maskLines(document.querySelector(".hero2__title"));
      if (heroLines) {
        tl.from(heroLines, { yPercent: 115, duration: 1.15, stagger: 0.09 }, 0.35);
      }
      tl.from(".hero2__thumb", { y: 60, opacity: 0, duration: 1, stagger: 0.1 }, 0.7)
        .from(".hero2__lead", { opacity: 0, y: 24, duration: 0.9 }, 0.9)
        .from(".hero2__actions > *", { opacity: 0, y: 20, duration: 0.7, stagger: 0.08 }, 1.0)
        .from(".hero2 .marquee", { opacity: 0, duration: 1 }, 1.2);
    }

    /* ================= PAGE HERO INTRO (inner pages) ================= */
    var ph = document.querySelector(".ph");
    if (ph) {
      var ptl = gsap.timeline({ defaults: { ease: "power4.out" } });
      ptl.from(".nav2__inner", { y: -30, opacity: 0, duration: 0.9 }, 0.1)
         .from(ph.querySelectorAll(".meta-label, .ph__title, .ph__kicker, .ph__lead, .ph__actions"), {
           opacity: 0, y: 34, duration: 0.95, stagger: 0.1
         }, 0.3);
    }

    /* ================= HERO ROTATOR ================= */
    var rot = document.getElementById("rotator");
    if (rot) {
      var phrases = [
        'BRANDS PEOPLE <span class="hl-blue">LOVE.</span>',
        'PRODUCTS PEOPLE <span class="hl-blue">TRUST.</span>',
        'CONTENT PEOPLE <span class="hl-blue">CAN&rsquo;T SCROLL PAST.</span>'
      ];
      var pi = 0;
      setInterval(function () {
        gsap.to(rot, {
          yPercent: -60, opacity: 0, duration: 0.45, ease: "power3.in",
          onComplete: function () {
            pi = (pi + 1) % phrases.length;
            rot.innerHTML = phrases[pi];
            gsap.fromTo(rot,
              { yPercent: 60, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 0.55, ease: "power3.out" });
          }
        });
      }, 3400);
    }

    /* ================= GENERIC LINE REVEALS ================= */
    document.querySelectorAll("[data-reveal-lines]").forEach(function (block) {
      var lines = maskLines(block);
      if (!lines) return;
      gsap.from(lines, {
        yPercent: 115,
        duration: 1.05,
        stagger: 0.09,
        ease: "power4.out",
        scrollTrigger: { trigger: block, start: "top 82%" }
      });
    });

    /* fade-up for smaller elements */
    document.querySelectorAll("[data-fade]").forEach(function (el) {
      gsap.from(el, {
        opacity: 0, y: 34, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      });
    });

    /* staggered children */
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      gsap.from(group.children, {
        opacity: 0, y: 40, duration: 0.85, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 85%" }
      });
    });

    /* ================= STATS COUNT-UP ================= */
    document.querySelectorAll(".stat2__num [data-count]").forEach(function (el) {
      var target = parseInt(el.getAttribute("data-count"), 10);
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
        onUpdate: function () { el.textContent = Math.round(obj.v); }
      });
    });

    /* ================= PHILOSOPHY WORD SCRUB ================= */
    var philo = document.querySelector(".philo__lines");
    if (philo) {
      var words = philo.querySelectorAll(".word");
      gsap.fromTo(words,
        { color: "#C6C7D2" },
        {
          color: "#14141D",
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: philo,
            start: "top 78%",
            end: "bottom 45%",
            scrub: 0.6
          }
        });
    }

    /* ================= PARALLAX IMAGES ================= */
    document.querySelectorAll("[data-parallax]").forEach(function (frame) {
      var img = frame.querySelector("img");
      if (!img) return;
      gsap.fromTo(img,
        { yPercent: -8, scale: 1.16 },
        {
          yPercent: 8,
          scale: 1.16,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    /* ================= SERVICE ROW PREVIEWS ================= */
    var preview = document.querySelector(".srow-preview");
    var svcList = document.querySelector("[data-svc-list]");
    if (preview && svcList && window.matchMedia("(hover: hover) and (min-width: 1025px)").matches) {
      var imgs = preview.querySelectorAll("img");
      var xTo = gsap.quickTo(preview, "x", { duration: 0.4, ease: "power3" });
      var yTo = gsap.quickTo(preview, "y", { duration: 0.4, ease: "power3" });

      svcList.addEventListener("mousemove", function (e) {
        xTo(e.clientX + 30);
        yTo(e.clientY - 150);
      });
      svcList.querySelectorAll(".s2__item").forEach(function (row) {
        row.addEventListener("mouseenter", function () {
          var key = row.getAttribute("data-preview");
          imgs.forEach(function (im) { im.classList.toggle("on", im.getAttribute("data-key") === key); });
          gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" });
        });
      });
      svcList.addEventListener("mouseleave", function () {
        gsap.to(preview, { opacity: 0, scale: 0.85, duration: 0.3, ease: "power3.in" });
      });
    }

    /* ================= GIANT CTA REVEAL ================= */
    var cta = document.querySelector(".cta2__title");
    if (cta) {
      var ctaLines = maskLines(cta);
      if (ctaLines) {
        gsap.from(ctaLines, {
          yPercent: 110, duration: 1.1, stagger: 0.1, ease: "power4.out",
          scrollTrigger: { trigger: cta, start: "top 80%" }
        });
      }
    }

    /* ================= MAGNETIC BUTTONS ================= */
    if (window.matchMedia("(hover: hover)").matches) {
      document.querySelectorAll(".btn2").forEach(function (btn) {
        var bx = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3" });
        var by = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3" });
        btn.addEventListener("mousemove", function (e) {
          var r = btn.getBoundingClientRect();
          bx((e.clientX - r.left - r.width / 2) * 0.25);
          by((e.clientY - r.top - r.height / 2) * 0.35);
        });
        btn.addEventListener("mouseleave", function () { bx(0); by(0); });
      });
    }
  } else {
    /* reduced motion / no GSAP: show everything */
    document.documentElement.classList.add("reduced-motion");
    var rotEl = document.getElementById("rotator");
    if (rotEl) rotEl.innerHTML = 'BRANDS PEOPLE <span class="hl-blue">LOVE.</span>';
  }

  /* ================= CUSTOM CURSOR ================= */
  var dot = document.querySelector(".cursor-dot");
  if (dot && !reduced && window.matchMedia("(hover: hover)").matches && hasGsap) {
    var dx = gsap.quickTo(dot, "left", { duration: 0.18, ease: "power2" });
    var dy = gsap.quickTo(dot, "top", { duration: 0.18, ease: "power2" });
    window.addEventListener("mousemove", function (e) {
      dot.classList.add("on");
      dx(e.clientX);
      dy(e.clientY);
    });
    document.querySelectorAll("a, button, .s2__item").forEach(function (el) {
      el.addEventListener("mouseenter", function () { dot.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { dot.classList.remove("grow"); });
    });
  }

  /* ---- Work filters ---- */
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    var fcards = document.querySelectorAll("[data-cat]");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip2");
      if (!btn) return;
      filterBar.querySelectorAll(".chip2").forEach(function (b) { b.classList.remove("on"); });
      btn.classList.add("on");
      var f = btn.getAttribute("data-filter");
      fcards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-cat").split(" ").indexOf(f) !== -1;
        c.style.display = show ? "" : "none";
      });
      if (hasGsap) ScrollTrigger.refresh();
    });
  }

  /* ---- Enquiry form → mailto compose ---- */
  var form = document.querySelector("[data-mailto-form]");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = new FormData(form);
      var body = [];
      d.forEach(function (v, k) { if (v) body.push(k + ": " + v); });
      window.location.href = "mailto:info@fineries.net?subject=" +
        encodeURIComponent("Project Brief — " + (d.get("Name") || "New Enquiry")) +
        "&body=" + encodeURIComponent(body.join("\n"));
    });
  }

  /* ---- Footer year ---- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
