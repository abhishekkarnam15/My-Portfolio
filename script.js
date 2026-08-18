(() => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const brand = document.querySelector(".brand");
  const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
  const year = document.querySelector("#year");
  const revealElements = Array.from(document.querySelectorAll(".reveal"));
  const filterButtons = Array.from(document.querySelectorAll(".filter-button"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));
  const progressBar = document.querySelector(".scroll-progress");
  const networkCanvas = document.querySelector(".site-network");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const filterTimers = new WeakMap();

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const focusableNavItems = () => Array.from(document.querySelectorAll("#primary-navigation a"));

  const closeNavigation = (returnFocus = false) => {
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      if (returnFocus) {
        navToggle.focus();
      }
    }
  };

  if (brand) {
    brand.addEventListener("click", (event) => {
      event.preventDefault();
      closeNavigation();
      window.scrollTo({ top: 0, behavior: prefersReducedMotion.matches ? "auto" : "smooth" });
      history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        window.setTimeout(() => focusableNavItems()[0]?.focus(), 0);
      }
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeNavigation();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation(true);
    }
  });

  const updateProgress = () => {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
  };

  updateProgress();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);

  if (prefersReducedMotion.matches) {
    revealElements.forEach((element) => element.classList.add("visible"));
    document.querySelectorAll(".timeline").forEach((timeline) => timeline.classList.add("visible"));
  } else if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target;
          const group = element.closest(".stagger-group");
          if (group) {
            const visibleItems = Array.from(group.querySelectorAll(".reveal:not(.is-hidden)"));
            const index = Math.max(visibleItems.indexOf(element), 0);
            element.style.setProperty("--reveal-delay", `${Math.min(index * 120, 360)}ms`);
          }

          element.classList.add("visible");
          observer.unobserve(element);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    const timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.24 }
    );

    document.querySelectorAll(".timeline").forEach((timeline) => timelineObserver.observe(timeline));
  } else {
    revealElements.forEach((element) => element.classList.add("visible"));
    document.querySelectorAll(".timeline").forEach((timeline) => timeline.classList.add("visible"));
  }

  const sectionLinks = navLinks
    .map((link) => {
      const id = link.getAttribute("href");
      const section = id && id.startsWith("#") ? document.querySelector(id) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  const setActiveLink = () => {
    if (!sectionLinks.length) return;

    const headerOffset = 120;
    const scrollPosition = window.scrollY + headerOffset;
    const pageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let activeItem = sectionLinks[0];

    sectionLinks.forEach((item) => {
      if (item.section.offsetTop <= scrollPosition) {
        activeItem = item;
      }
    });

    if (pageBottom) {
      activeItem = sectionLinks[sectionLinks.length - 1];
    }

    navLinks.forEach((link) => link.classList.remove("active"));
    activeItem.link.classList.add("active");
  };

  let activeLinkFrame = 0;
  const requestActiveLinkUpdate = () => {
    if (activeLinkFrame) return;
    activeLinkFrame = window.requestAnimationFrame(() => {
      setActiveLink();
      activeLinkFrame = 0;
    });
  };

  setActiveLink();
  window.addEventListener("scroll", requestActiveLinkUpdate, { passive: true });
  window.addEventListener("resize", requestActiveLinkUpdate);

  const applyProjectFilter = (filter) => {
    body.classList.add("filtering");

    if (prefersReducedMotion.matches) {
      projectCards.forEach((card) => {
        const categories = (card.dataset.category || "").split(" ");
        const shouldShow = filter === "all" || categories.includes(filter);
        card.classList.toggle("is-hidden", !shouldShow);
        card.classList.remove("is-hiding", "is-filter-entering");
        if (shouldShow) card.classList.add("visible");
      });
      body.classList.remove("filtering");
      return;
    }

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      window.clearTimeout(filterTimers.get(card));

      if (!shouldShow) {
        card.classList.add("is-hiding");
        const hideTimer = window.setTimeout(() => {
          card.classList.add("is-hidden");
          card.classList.remove("is-hiding", "is-filter-entering");
        }, 180);
        filterTimers.set(card, hideTimer);
        return;
      }

      card.classList.remove("is-hidden", "is-hiding");
      card.classList.add("visible", "is-filter-entering");
      window.requestAnimationFrame(() => {
        card.classList.remove("is-filter-entering");
      });
    });

    window.setTimeout(() => body.classList.remove("filtering"), 260);
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter || "all";
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });
      applyProjectFilter(filter);
    });
  });

  const initSiteNetwork = () => {
    if (!networkCanvas || prefersReducedMotion.matches) return;

    const context = networkCanvas.getContext("2d");
    if (!context) return;

    let width = 0;
    let height = 0;
    let animationFrame = 0;
    const nodes = Array.from({ length: 22 }, (_, index) => ({
      x: (index * 47) % 100,
      y: (index * 29) % 100,
      vx: ((index % 3) - 1) * 0.018,
      vy: (((index + 1) % 3) - 1) * 0.014,
      pulse: index * 0.37
    }));

    const resizeCanvas = () => {
      const rect = networkCanvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      networkCanvas.width = Math.floor(width * ratio);
      networkCanvas.height = Math.floor(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 4 || node.x > 96) node.vx *= -1;
        if (node.y < 8 || node.y > 92) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          const a = nodes[i];
          const b = nodes[j];
          const ax = (a.x / 100) * width;
          const ay = (a.y / 100) * height;
          const bx = (b.x / 100) * width;
          const by = (b.y / 100) * height;
          const distance = Math.hypot(ax - bx, ay - by);

          if (distance < 190) {
            const alpha = (1 - distance / 190) * 0.2;
            context.strokeStyle = `rgba(159, 184, 207, ${alpha})`;
            context.beginPath();
            context.moveTo(ax, ay);
            context.lineTo(bx, by);
            context.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        const x = (node.x / 100) * width;
        const y = (node.y / 100) * height;
        const radius = 1.8 + Math.sin(time * 0.0015 + node.pulse) * 0.7;
        context.fillStyle = "rgba(159, 184, 207, 0.58)";
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      });

      animationFrame = window.requestAnimationFrame(draw);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    animationFrame = window.requestAnimationFrame(draw);

    prefersReducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        window.cancelAnimationFrame(animationFrame);
        context.clearRect(0, 0, width, height);
      } else {
        resizeCanvas();
        animationFrame = window.requestAnimationFrame(draw);
      }
    });
  };

  initSiteNetwork();
})();
