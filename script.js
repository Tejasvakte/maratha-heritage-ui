// Core UI behavior
const body = document.body;
const header = document.querySelector(".site-header");
const progressBar = document.getElementById("scroll-progress-bar");
const hero = document.querySelector(".hero");
const backdrop = document.querySelector(".page-backdrop");
const cursorGlow = document.querySelector(".cursor-glow");
const revealItems = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");
const navToggle = document.getElementById("nav-toggle");
const navMenu = document.getElementById("nav-menu");
const year = document.getElementById("year");
const interactiveElements = document.querySelectorAll("a, button, .glass-card, .gallery-card");

let ticking = false;

const updateScrollState = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;
  header.classList.toggle("scrolled", scrollTop > 18);

  if (hero) {
    hero.style.setProperty("--hero-shift", `${Math.min(scrollTop, 500)}px`);
  }

  if (backdrop) {
    backdrop.style.transform = `scale(1.08) translateY(${Math.min(scrollTop * 0.04, 26)}px)`;
  }

  ticking = false;
};

const onScroll = () => {
  if (ticking) return;
  ticking = true;
  window.requestAnimationFrame(updateScrollState);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.15,
    rootMargin: "0px 0px -70px 0px",
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const activeId = entry.target.id;
      navLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("active", isActive);
      });
    });
  },
  {
    threshold: 0.45,
    rootMargin: "-20% 0px -35% 0px",
  }
);

sections.forEach((section) => sectionObserver.observe(section));

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

document.addEventListener("click", (event) => {
  if (!navMenu.classList.contains("open")) return;
  if (navMenu.contains(event.target) || navToggle.contains(event.target)) return;

  navMenu.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
});

year.textContent = new Date().getFullYear();

// Lightweight premium cursor glow for desktop devices
if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursorGlow.classList.add("active");
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });

  document.addEventListener("mouseleave", () => {
    cursorGlow.classList.remove("active");
  });

  interactiveElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      cursorGlow.classList.add("hovering");
    });

    element.addEventListener("mouseleave", () => {
      cursorGlow.classList.remove("hovering");
    });
  });
}

// Premium load-in
window.addEventListener("load", () => {
  window.requestAnimationFrame(() => {
    body.classList.remove("loading");
    body.classList.add("is-ready");
  });
});

updateScrollState();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", updateScrollState);
