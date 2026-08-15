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
  const heroCanvas = document.querySelector(".hero-network");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const closeNavigation = () => {
    body.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
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
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeNavigation();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNavigation();
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

  if ("IntersectionObserver" in window && navLinks.length) {
    const sectionMap = new Map(
      navLinks
        .map((link) => {
          const id = link.getAttribute("href");
          return id && id.startsWith("#") ? [document.querySelector(id), link] : null;
        })
        .filter(Boolean)
    );

    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!visible) return;

        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = sectionMap.get(visible.target);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      },
      { threshold: [0.24, 0.42, 0.62], rootMargin: "-18% 0px -58% 0px" }
    );

    sectionMap.forEach((_, section) => {
      if (section) activeObserver.observe(section);
    });
  }

  const applyProjectFilter = (filter) => {
    body.classList.add("filtering");

    projectCards.forEach((card) => {
      const categories = (card.dataset.category || "").split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) {
        card.classList.add("visible");
      }
    });

    window.setTimeout(() => body.classList.remove("filtering"), 240);
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

  const initHeroNetwork = () => {
    if (!heroCanvas || prefersReducedMotion.matches) return;

    const context = heroCanvas.getContext("2d");
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
      const rect = heroCanvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width, 1);
      height = Math.max(rect.height, 1);
      heroCanvas.width = Math.floor(width * ratio);
      heroCanvas.height = Math.floor(height * ratio);
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

  initHeroNetwork();
})();
