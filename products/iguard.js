/* =========================================================
   iGuard Kids page: heading pop + scroll reveal + modal + download routing
========================================================= */
(function () {
  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // -------------------------------
  // Pop-in headings (letter split)
  // -------------------------------
  function splitToLetters(el) {
    const text = (el.textContent || "").trim();
    if (!text) return;

    el.textContent = "";
    const frag = document.createDocumentFragment();

    for (const ch of text) {
      const span = document.createElement("span");
      span.className = ch === " " ? "letter space" : "letter";
      span.textContent = ch === " " ? "\u00A0" : ch;
      frag.appendChild(span);
    }
    el.appendChild(frag);
  }

  // Split headings that use class "js-pop-heading"
  document
    .querySelectorAll(".js-pop-heading")
    .forEach((h) => splitToLetters(h));

  // Optional: smaller heading on WHAT WE DO can still pop
  document.querySelectorAll(".popSmall").forEach((h) => {
    if (!h.querySelector(".letter")) splitToLetters(h);
  });

  // -------------------------------
  // Scroll reveal (fade in on view)
  // -------------------------------
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in-view");
        });
      },
      { threshold: 0.12 },
    );
    reveals.forEach((el) => io.observe(el));
  }

  // -------------------------------
  // Download button: detect browser
  // -------------------------------
  // ✅ Paste your real iGuard store links here:
  const LINKS = {
    chrome: "PASTE_IGUARD_CHROME_STORE_LINK",
    firefox: "PASTE_IGUARD_FIREFOX_ADDONS_LINK",
  };

  function detectBrowser() {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("firefox")) return "firefox";
    if (ua.includes("chrome") || ua.includes("chromium") || ua.includes("edg"))
      return "chrome";
    return "chrome";
  }

  function openStore() {
    const key = detectBrowser();
    const url = LINKS[key] || LINKS.chrome;

    if (!url || url.includes("PASTE_")) {
      alert(
        "Paste your iGuard Kids Chrome/Firefox store links inside products/iguard.js first.",
      );
      return;
    }
    window.open(url, "_blank", "noopener");
  }

  const dl = document.getElementById("iguardDownloadBtn");
  if (dl) dl.addEventListener("click", openStore);

  // -------------------------------
  // Screenshots modal (pop out)
  // -------------------------------
  const modal = document.getElementById("igModal");
  const modalImg = document.getElementById("igModalImg");
  const modalTitle = document.getElementById("igModalTitle");
  const modalDesc = document.getElementById("igModalDesc");
  const shotBtns = document.querySelectorAll("[data-shot]");

  function openModal({ img, title, desc }) {
    if (!modal || !modalImg) return;

    modalImg.src = img;
    modalTitle.textContent = title || "";
    modalDesc.textContent = desc || "";

    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    if (modalImg) modalImg.src = "";

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  shotBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal({
        img: btn.getAttribute("data-img"),
        title: btn.getAttribute("data-title"),
        desc: btn.getAttribute("data-desc"),
      });
    });
  });

  if (modal) {
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.matches("[data-close]")) closeModal();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
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
