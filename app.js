/* ============================
   MENU TOGGLE LOGIC
============================ */
const menuToggle = document.getElementById("menuToggle");
const menuOverlay = document.getElementById("menuOverlay");
const menuBackdrop = document.getElementById("menuBackdrop");
const menuLinks = document.querySelectorAll("[data-menu-link]");
const yearEl = document.getElementById("year");

// Set footer year automatically
yearEl.textContent = new Date().getFullYear();

let isMenuOpen = false;

/**
 * Open the menu overlay
 */
function openMenu() {
  isMenuOpen = true;

  menuOverlay.classList.add("open");
  menuOverlay.setAttribute("aria-hidden", "false");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute("aria-label", "Close menu");

  // Switch hamburger icon to X icon
  const icon = menuToggle.querySelector(".icon");
  icon.classList.remove("iconHamburger");
  icon.classList.add("iconX");

  // Prevent background scrolling when menu is open
  document.body.style.overflow = "hidden";
}

/**
 * Close the menu overlay
 */
function closeMenu() {
  isMenuOpen = false;

  menuOverlay.classList.remove("open");
  menuOverlay.setAttribute("aria-hidden", "true");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open menu");

  // Switch X icon back to hamburger
  const icon = menuToggle.querySelector(".icon");
  icon.classList.remove("iconX");
  icon.classList.add("iconHamburger");

  document.body.style.overflow = "";
}

/**
 * Toggle menu overlay
 */
function toggleMenu() {
  if (isMenuOpen) closeMenu();
  else openMenu();
}

// Click hamburger / X button
menuToggle.addEventListener("click", toggleMenu);

// Click outside (backdrop) closes
menuBackdrop.addEventListener("click", closeMenu);

// Clicking any menu link closes the menu
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// ESC key closes menu
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isMenuOpen) {
    closeMenu();
  }
});

/* ============================
   OPTIONAL: NAV SHADOW ON SCROLL
   (Nice "flow" feel as you scroll)
============================ */
const topbar = document.getElementById("topbar");

window.addEventListener("scroll", () => {
  // Add subtle shadow after a little scroll
  if (window.scrollY > 10) {
    topbar.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
  } else {
    topbar.style.boxShadow = "none";
  }
});

// ============================
// ABOUT: Heading word-wrapping + letter-pop (prevents broken words)
// ============================

(function () {
  function buildHeading(el) {
    if (!el || el.dataset.split === "1") return;

    const text = (el.textContent || "").trim();
    el.textContent = "";

    // Split into words (keeps your landing-style behavior)
    const words = text.split(/\s+/);
    let letterIndex = 0;

    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word"; // you already have .word { white-space: nowrap; } in CSS :contentReference[oaicite:3]{index=3}

      for (const ch of word) {
        const letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = ch;
        letter.style.setProperty("--i", letterIndex);
        wordSpan.appendChild(letter);
        letterIndex++;
      }

      el.appendChild(wordSpan);

      // Add a gap between words (so it can wrap only between words)
      if (wIdx < words.length - 1) {
        const gap = document.createElement("span");
        gap.className = "letter space"; // matches your letter styling + spacing rule
        gap.textContent = " ";
        gap.style.setProperty("--i", letterIndex);
        el.appendChild(gap);
        letterIndex++;
      }
    });

    el.dataset.split = "1";
  }

  document.querySelectorAll(".js-pop-heading").forEach(buildHeading);

  // ============================
  // Scroll reveal (keep yours)
  // ============================
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("in-view"));
    return;
  }

  // Stagger fade items inside about
  document.querySelectorAll("#about").forEach((root) => {
    const fadeItems = root.querySelectorAll(".reveal.fade");
    fadeItems.forEach((el, idx) =>
      el.style.setProperty("--d", `${idx * 90}ms`),
    );
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

// ============================
// PRODUCTS: word-safe gradient letter headings + scroll reveals
// ============================
(function () {
  // Build heading with word wrappers so words never split mid-line
  function buildWordSafeLetters(el) {
    if (!el || el.dataset.split === "1") return;

    const text = (el.textContent || "").trim();
    el.textContent = "";

    const words = text.split(/\s+/);
    let i = 0;

    words.forEach((word, wIdx) => {
      const w = document.createElement("span");
      w.className = "word";

      for (const ch of word) {
        const letter = document.createElement("span");
        letter.className = "letter";
        letter.textContent = ch;
        letter.style.setProperty("--i", i++);
        w.appendChild(letter);
      }

      el.appendChild(w);

      if (wIdx < words.length - 1) {
        const gap = document.createElement("span");
        gap.className = "gap";
        gap.textContent = " ";
        el.appendChild(gap);
      }
    });

    el.dataset.split = "1";
  }

  document.querySelectorAll(".js-pop-heading").forEach(buildWordSafeLetters);

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    document
      .querySelectorAll(".reveal")
      .forEach((el) => el.classList.add("in-view"));
    return;
  }

  // stagger fade items inside products
  const products = document.getElementById("products");
  if (products) {
    const fadeItems = products.querySelectorAll(".reveal.fade");
    fadeItems.forEach((el, idx) =>
      el.style.setProperty("--d", `${idx * 90}ms`),
    );
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
  );

  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();

/* ============================
   CONTACT: fade stagger + video play only in-section
============================ */
(function () {
  const contact = document.getElementById("contact");
  if (!contact) return;

  // Stagger fade items inside contact (matches your other sections)
  const fadeItems = contact.querySelectorAll(".reveal.fade");
  fadeItems.forEach((el, idx) => el.style.setProperty("--d", `${idx * 90}ms`));

  const vid = document.getElementById("suggestionVideo");
  if (!vid) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Never autoplay for reduced motion users
  if (prefersReduced) {
    try {
      vid.pause();
      vid.currentTime = 0;
    } catch {}
    return;
  }

  let isActive = false;

  async function playVideo() {
    if (isActive) return;
    isActive = true;
    try {
      // ensure it's ready-ish
      vid.muted = true;
      vid.playsInline = true;
      await vid.play();
      // loop while active
      vid.loop = true;
    } catch {
      // autoplay can be blocked in some cases; user can still click (link)
    }
  }

  function stopVideo() {
    if (!isActive) return;
    isActive = false;
    try {
      vid.pause();
      // reset so it "stops" visually when you leave
      vid.currentTime = 0;
    } catch {}
  }

  // Observe the contact section visibility and play/pause accordingly
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        // start when a decent chunk of the section is visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
          playVideo();
        } else {
          stopVideo();
        }
      }
    },
    { threshold: [0, 0.2, 0.35, 0.6], rootMargin: "0px 0px -10% 0px" },
  );

  io.observe(contact);

  // If the user switches tabs, stop the loop
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopVideo();
  });
})();

/* ============================
   SUPPORT: orbit animation + fade stagger
============================ */
(function () {
  const support = document.getElementById("support");
  if (!support) return;

  // Stagger fades inside support (matches your other sections)
  const fadeItems = support.querySelectorAll(".reveal.fade");
  fadeItems.forEach((el, idx) => el.style.setProperty("--d", `${idx * 90}ms`));

  const orbit = document.getElementById("supportOrbit");
  if (!orbit) return;

  const items = Array.from(orbit.querySelectorAll("[data-orbit-item]"));
  if (!items.length) return;

  const prefersReduced =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mqGrid = window.matchMedia("(max-width: 520px)");

  let paused = false;
  let rafId = null;
  let last = 0;
  let angle = 0;

  // speed: radians per second (adjust if you want faster/slower)
  const SPEED = 0.45;

  function setGridMode(on) {
    if (on) orbit.classList.add("is-grid");
    else orbit.classList.remove("is-grid");
  }

  function layout() {
    // Radius based on container size
    const rect = orbit.getBoundingClientRect();
    const size = Math.min(rect.width, rect.height || rect.width);
    const radius = size * 0.28; // how far out the icons sit

    const n = items.length;

    items.forEach((item, i) => {
      const base = (Math.PI * 2 * i) / n;
      const a = base + angle;

      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;

      item.style.setProperty("--x", `${x.toFixed(2)}px`);
      item.style.setProperty("--y", `${y.toFixed(2)}px`);

      // counter-rotate so logos stay upright
      item.style.setProperty("--r", `${(-a * 180) / Math.PI}deg`);
    });
  }

  function tick(t) {
    if (!last) last = t;
    const dt = (t - last) / 1000;
    last = t;

    if (!paused) angle += SPEED * dt;

    layout();
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    stop();
    last = 0;
    rafId = requestAnimationFrame(tick);
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function enableOrDisable() {
    const gridMode = mqGrid.matches;

    setGridMode(gridMode);

    // If reduced motion or grid mode, do not animate
    if (prefersReduced || gridMode) {
      paused = true;
      stop();

      // Clear orbit transforms in grid mode
      if (gridMode) {
        items.forEach((item) => {
          item.style.removeProperty("--x");
          item.style.removeProperty("--y");
          item.style.removeProperty("--r");
        });
      } else {
        // Reduced motion desktop: keep a nice static circle layout
        paused = true;
        layout();
      }
      return;
    }

    paused = false;
    start();
  }

  // Pause on hover (over the orbit or any item)
  function pause() {
    paused = true;
  }
  function resume() {
    if (!prefersReduced && !mqGrid.matches) paused = false;
  }

  orbit.addEventListener("mouseenter", pause);
  orbit.addEventListener("mouseleave", resume);
  items.forEach((item) => {
    item.addEventListener("mouseenter", pause);
    item.addEventListener("mouseleave", resume);
  });

  // Re-layout on resize
  window.addEventListener("resize", () => layout());

  // Watch grid breakpoint
  if (mqGrid.addEventListener)
    mqGrid.addEventListener("change", enableOrDisable);
  else mqGrid.addListener(enableOrDisable);

  enableOrDisable();
})();
