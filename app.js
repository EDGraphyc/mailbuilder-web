/* MailBuilder — Shared JS */

const APP_URL = "https://mailbuilder-pi.vercel.app";

/* ── Nav: scroll effect + mobile menu ── */
function initNav() {
  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobile-menu");

  if (!nav) return;

  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 20);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (burger && mobileMenu) {
    burger.addEventListener("click", () => {
      const open = burger.classList.toggle("open");
      mobileMenu.style.display = open ? "flex" : "none";
    });
  }

  // Mark active link
  const path = location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll(".nav-link[data-path]").forEach(a => {
    const p = a.dataset.path;
    if (p === path || (p !== "/" && path.startsWith(p))) {
      a.classList.add("active");
    }
  });
}

/* ── Scroll reveal ── */
function initReveal() {
  const els = document.querySelectorAll(".rv, .rl, .rr");
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("vis"); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ── FAQ accordion ── */
function initFaq() {
  document.querySelectorAll(".faq-q").forEach(btn => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.toggle("open");
      answer.classList.toggle("open", isOpen);
    });
  });
}

/* ── Filter tabs (plantillas) ── */
function initFilter() {
  document.querySelectorAll(".filter-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const group = tab.closest(".filter-tabs");
      group.querySelectorAll(".filter-tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      const cat = tab.dataset.cat;
      document.querySelectorAll(".tmpl-card").forEach(card => {
        const show = cat === "all" || card.dataset.cat === cat;
        card.style.display = show ? "" : "none";
      });
    });
  });
}

/* ── Pricing toggle (mensual / anual) ── */
function initPricing() {
  const toggle = document.getElementById("price-toggle");
  if (!toggle) return;
  toggle.addEventListener("change", () => {
    const annual = toggle.checked;
    document.querySelectorAll("[data-monthly]").forEach(el => {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
    });
    document.querySelectorAll("[data-note-monthly]").forEach(el => {
      el.textContent = annual ? el.dataset.noteAnnual : el.dataset.noteMonthly;
    });
  });
}

/* ── Counter animation ── */
function animateCounters() {
  document.querySelectorAll(".count-up").forEach(el => {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    const duration = 1600;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target < 100 ? (eased * target).toFixed(target % 1 ? 1 : 0) : Math.round(eased * target).toLocaleString();
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

/* ── Hero: animated typing effect on subheadline ── */
function initHeroAnim() {
  const words = document.querySelector(".hero-rotate-words");
  if (!words) return;
  const items = words.querySelectorAll("span");
  let i = 0;
  const cycle = () => {
    items.forEach(s => s.classList.remove("show"));
    items[i].classList.add("show");
    i = (i + 1) % items.length;
  };
  cycle();
  setInterval(cycle, 2800);
}

/* CTA links: point to the app */
function initCtaLinks() {
  document.querySelectorAll("a[data-cta]").forEach(a => {
    a.href = APP_URL + (a.dataset.cta || "/login");
  });
}

/* ── Boot ── */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initReveal();
  initFaq();
  initFilter();
  initPricing();
  initHeroAnim();
  initCtaLinks();

  // Counter animation on first scroll-in
  const numEls = document.querySelectorAll(".count-up");
  if (numEls.length) {
    const obs = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { animateCounters(); obs.disconnect(); }
    }, { threshold: 0.3 });
    numEls.forEach(el => obs.observe(el));
  }
});
