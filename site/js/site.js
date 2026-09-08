/* ============================================================
   FINERIES DIGITAL — shared site behaviour
   Sticky nav · mobile menu · scroll reveals · work filters
   ============================================================ */
(function () {
  "use strict";

  /* ---- Lucide icons ---- */
  if (window.lucide) lucide.createIcons();

  /* ---- Sticky nav: solid after scroll ---- */
  var nav = document.querySelector(".nav");
  if (nav && !nav.classList.contains("nav--light")) {
    var onScroll = function () {
      nav.classList.toggle("nav--solid", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---- Mobile menu ---- */
  var burger = document.querySelector(".nav__burger");
  var mobile = document.querySelector(".nav__mobile");
  if (burger && mobile) {
    burger.addEventListener("click", function () {
      var open = mobile.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      if (open && nav) nav.classList.add("nav--solid");
    });
    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Work filters (work.html) ---- */
  var filterBar = document.querySelector("[data-filters]");
  if (filterBar) {
    var cards = document.querySelectorAll("[data-cat]");
    filterBar.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip-btn");
      if (!btn) return;
      filterBar.querySelectorAll(".chip-btn").forEach(function (b) {
        b.classList.remove("chip-btn--on");
      });
      btn.classList.add("chip-btn--on");
      var f = btn.getAttribute("data-filter");
      cards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-cat").split(" ").indexOf(f) !== -1;
        c.style.display = show ? "" : "none";
      });
    });
  }

  /* ---- Hero word swap (premium) ---- */
  var nounEl = document.getElementById("hero-noun");
  var verbEl = document.getElementById("hero-verb");
  var nouns  = ["brands", "products", "content"];
  var verbs  = ["love", "trust", "can\u2019t scroll past"];
  var colors = ["var(--gold)", "var(--gold)", "var(--gold)"];
  var idx = 0;

  if (nounEl && verbEl) {
    setInterval(function () {
      // Step 1: Animate noun out
      nounEl.classList.add("out");

      // Stagger: verb exits 100ms later for a cascading feel
      setTimeout(function () {
        verbEl.classList.add("out");
      }, 100);

      // Step 2: After exit completes, swap text
      setTimeout(function () {
        idx = (idx + 1) % nouns.length;

        // Swap noun
        nounEl.textContent = nouns[idx];
        nounEl.classList.remove("out");
        nounEl.classList.add("in");

        // Swap verb (slightly staggered)
        setTimeout(function () {
          verbEl.textContent = verbs[idx];
          verbEl.style.color = colors[idx];
          verbEl.classList.remove("out");
          verbEl.classList.add("in");

          // Step 3: Animate verb in on next frame
          requestAnimationFrame(function () {
            requestAnimationFrame(function () {
              verbEl.classList.remove("in");
            });
          });
        }, 80);

        // Step 3: Animate noun in on next frame
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            nounEl.classList.remove("in");
          });
        });
      }, 580);
    }, 3200);
  }

  /* ---- Footer year ---- */
  var yr = document.querySelector("[data-year]");
  if (yr) yr.textContent = new Date().getFullYear();
})();
