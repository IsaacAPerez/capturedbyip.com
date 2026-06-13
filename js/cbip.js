/* ============================================================
   CAPTUREDBYIP — interactions
   Nav, scroll progress, reveals, cursor glow, card spotlight.
   All motion respects prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(pointer: fine)").matches;

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector(".cbip-burger");
  var navLinks = document.querySelector(".cbip-nav-links");
  function closeNav(restoreFocus) {
    navLinks.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    if (restoreFocus) burger.focus();
  }
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { closeNav(true); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navLinks.classList.contains("is-open")) closeNav(true);
    });
  }

  /* ---------- Nav: solid-on-scroll + hide-on-scroll-down ---------- */
  var nav = document.querySelector(".cbip-nav");
  var lastY = window.scrollY;
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle("is-scrolled", y > 24);
      if (!navLinks || !navLinks.classList.contains("is-open")) {
        if (y > lastY && y > 240) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
      }
    }
    /* progress bar */
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (h > 0 ? y / h : 0) + ")";
    }
    lastY = y;
    ticking = false;
  }
  var progress = document.querySelector(".cbip-progress");
  window.addEventListener(
    "scroll",
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Card spotlight (pointer-follow red wash) ---------- */
  if (fine && !reduce) {
    document.querySelectorAll(".cbip-card, .cbip-price-card").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      }, { passive: true });
    });
  }

  /* ---------- Hero cursor glow ---------- */
  var glow = document.querySelector(".cbip-glow");
  var hero = document.querySelector(".cbip-hero, .cbip-price-hero");
  if (glow && hero && fine && !reduce) {
    var gx = window.innerWidth / 2, gy = 220, cx = gx, cy = gy, raf = null, active = false;
    function loop() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px," + cy + "px) translate(-50%,-50%)";
      raf = requestAnimationFrame(loop);
    }
    hero.addEventListener("pointermove", function (e) {
      gx = e.clientX; gy = e.clientY;
      glow.style.opacity = "1";
      if (!active) { active = true; loop(); }
    }, { passive: true });
    hero.addEventListener("pointerleave", function () {
      glow.style.opacity = "0";
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      active = false;
    }, { passive: true });
  }

  /* ---------- Stat count-up ---------- */
  var counts = document.querySelectorAll("[data-count]");
  if (counts.length && !reduce && "IntersectionObserver" in window) {
    var cio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          cio.unobserve(e.target);
          var el = e.target;
          var target = parseFloat(el.getAttribute("data-count"));
          var suffix = el.getAttribute("data-suffix") || "";
          var prefix = el.getAttribute("data-prefix") || "";
          var dur = 1300, start = null;
          function step(ts) {
            if (!start) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            var v = target * eased;
            el.textContent = prefix + (target % 1 === 0 ? Math.round(v) : v.toFixed(1)) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 }
    );
    counts.forEach(function (el) { cio.observe(el); });
  }

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (t) {
        e.preventDefault();
        t.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      }
    });
  });
})();
