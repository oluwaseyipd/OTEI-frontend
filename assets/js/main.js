// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const closeMobileMenu = document.getElementById("closeMobileMenu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

mobileMenuBtn.addEventListener("click", () => {
  mobileMenu.classList.remove("hidden");
});

closeMobileMenu.addEventListener("click", () => {
  mobileMenu.classList.add("hidden");
});

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navigation Dots Functionality
const navDots = document.querySelectorAll(".nav-dot");
const sections = ["home", "about", "speakers", "schedule", "sponsors", "venue"];

navDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    navDots.forEach((d) => d.classList.remove("active"));
    dot.classList.add("active");

    const section = document.getElementById(sections[index]);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// Combined scroll event listener
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const scrollPosition = scrollY + 200;

  // Navigation dots and links logic
  sections.forEach((sectionId, index) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        navDots.forEach((d) => d.classList.remove("active"));
        navDots[index].classList.add("active");

        // Update nav links
        document.querySelectorAll(".nav-link").forEach((link) => {
          link.classList.remove("text-red-600", "font-medium");
          if (link.dataset.section === sectionId) {
            link.classList.add("text-red-600", "font-medium");
          }
        });
      }
    }
  });

  // Hero background, schedule, and navbar logic
  const heroBackground = document.getElementById("heroBackground");
  const aboutSection = document.getElementById("about");
  const scheduleSection = document.getElementById("schedule");
  const scheduleOverlay = document.querySelector(".schedule-gradient-overlay");
  const navbar = document.getElementById("navbar");

  if (heroBackground && aboutSection) {
    const aboutTop = aboutSection.offsetTop;

    // Hero background logic
    if (scrollY > 50) {
      heroBackground.classList.add("hero-fixed-bg");
    } else {
      heroBackground.classList.remove("hero-fixed-bg");
    }

    if (scrollY >= aboutTop - window.innerHeight * 0.3) {
      heroBackground.style.opacity = "0";
      heroBackground.style.transition = "opacity 0.5s ease-out";
    } else {
      heroBackground.style.opacity = "1";
      heroBackground.style.transition = "opacity 0.5s ease-in";
    }
  }

  // Schedule gradient logic
  if (scheduleSection && scheduleOverlay) {
    const scheduleTop = scheduleSection.offsetTop;
    const scheduleHeight = scheduleSection.offsetHeight;
    const scheduleMiddle = scheduleTop + scheduleHeight / 2;

    if (scrollY >= scheduleMiddle - window.innerHeight * 0.5) {
      scheduleOverlay.classList.add("active");
    } else {
      scheduleOverlay.classList.remove("active");
    }
  }

  // Fixed navbar logic
  if (navbar) {
    if (scrollY > 50) {
      navbar.classList.add("navbar-fixed");
      document.body.classList.add("navbar-fixed-active");
    } else {
      navbar.classList.remove("navbar-fixed");
      document.body.classList.remove("navbar-fixed-active");
    }
  }
});

// Framer Motion Animations
const { animate, inView } = Motion;

// Animate hero content on load
animate(
  ".hero-title",
  { opacity: [0, 1], y: [50, 0] },
  { duration: 1, delay: 0.2 },
);

animate("nav", { opacity: [0, 1], y: [-20, 0] }, { duration: 0.8 });

// Animate About section on scroll
inView("#about", () => {
  animate("#about h2", { opacity: [0, 1], x: [-50, 0] }, { duration: 0.8 });

  animate(
    "#about p",
    { opacity: [0, 1], y: [30, 0] },
    { duration: 0.6, delay: 0.2 },
  );
});

// Recalculate heights on window resize
window.addEventListener("resize", function () {
  const heroSection = document.getElementById("home");
  if (heroSection) {
    heroSection.offsetHeight;
  }
});
