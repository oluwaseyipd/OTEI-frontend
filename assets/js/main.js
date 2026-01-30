// JavaScript for OTEI Frontend

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
const sections = [
  "home",
  "about",
  "speakers",
  "schedule",
  "volunteer",
  "partnership",
];

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

        // Update nav links (desktop and mobile)
        document
          .querySelectorAll(".nav-link, .mobile-nav-link")
          .forEach((link) => {
            link.classList.remove("active");
            if (link.dataset.section === sectionId) {
              link.classList.add("active");
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

// Floating Shapes Navigation
document.querySelectorAll(".floating-shape[data-nav]").forEach((shape) => {
  shape.addEventListener("click", function () {
    const targetSection = this.dataset.nav;
    const section = document.getElementById(targetSection);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
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

// Volunteer Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const volunteerForm = document.getElementById("volunteerForm");

  if (volunteerForm) {
    volunteerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(volunteerForm);
      const data = {};

      // Process regular fields
      for (let [key, value] of formData.entries()) {
        if (key === "availability[]") {
          if (!data.availability) data.availability = [];
          data.availability.push(value);
        } else {
          data[key] = value;
        }
      }

      // Validate required fields
      const requiredFields = [
        "fullName",
        "ageRange",
        "email",
        "phone",
        "location",
        "volunteerArea",
        "motivation",
        "available",
        "briefing",
        "terms",
      ];
      let isValid = true;

      requiredFields.forEach((field) => {
        const input = volunteerForm.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === "") {
          isValid = false;
          input.style.borderColor = "#ff6b35";
          input.style.boxShadow = "0 0 0 2px rgba(255, 107, 53, 0.2)";
        } else {
          input.style.borderColor = "";
          input.style.boxShadow = "";
        }
      });

      // Check radio buttons for availability
      if (!data.available) {
        isValid = false;
        const availableSection = volunteerForm
          .querySelector('input[name="available"]')
          .closest("div")
          .closest("div");
        availableSection.style.borderColor = "#ff6b35";
      }

      if (!data.briefing) {
        isValid = false;
        const briefingSection = volunteerForm
          .querySelector('input[name="briefing"]')
          .closest("div")
          .closest("div");
        briefingSection.style.borderColor = "#ff6b35";
      }

      if (!isValid) {
        // Show error message
        showFormMessage("Please fill in all required fields.", "error");
        return;
      }

      // Simulate form submission
      showFormMessage(
        "Thank you! Your volunteer application has been submitted. We'll contact you within 48 hours.",
        "success",
      );

      // Reset form
      volunteerForm.reset();

      // In a real application, you would send the data to your server:
      // fetch('/api/volunteer', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
    });
  }
});

// Form message display function
function showFormMessage(message, type) {
  const existingMessage = document.querySelector(".form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `form-message p-4 rounded-lg font-montserrat text-center mb-4 ${
    type === "success"
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200"
  }`;
  messageDiv.textContent = message;

  const form = document.getElementById("volunteerForm");
  if (form) {
    form.parentNode.insertBefore(messageDiv, form);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Add smooth scroll to volunteer section
function smoothScrollToVolunteer() {
  const volunteerSection = document.getElementById("volunteer");
  if (volunteerSection) {
    volunteerSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}

// Sponsor Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const sponsorForm = document.getElementById("sponsorForm");

  if (sponsorForm) {
    sponsorForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(sponsorForm);
      const data = {};

      // Process regular fields and checkboxes
      for (let [key, value] of formData.entries()) {
        if (key === "interests[]") {
          if (!data.interests) data.interests = [];
          data.interests.push(value);
        } else {
          data[key] = value;
        }
      }

      // Validate required fields
      const requiredFields = [
        "orgName",
        "orgType",
        "officeAddress",
        "contactName",
        "jobTitle",
        "contactEmail",
        "contactPhone",
        "sponsorTier",
        "confirmation",
      ];
      let isValid = true;

      requiredFields.forEach((field) => {
        const input = sponsorForm.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === "") {
          isValid = false;
          input.style.borderColor = "#ff6b35";
          input.style.boxShadow = "0 0 0 2px rgba(255, 107, 53, 0.2)";
        } else {
          input.style.borderColor = "";
          input.style.boxShadow = "";
        }
      });

      if (!isValid) {
        // Show error message
        showSponsorFormMessage("Please fill in all required fields.", "error");
        return;
      }

      // Simulate form submission
      showSponsorFormMessage(
        "Thank you! Your sponsorship application has been submitted. Our partnerships team will contact you within 48 hours.",
        "success",
      );

      // Reset form
      sponsorForm.reset();

      // In a real application, you would send the data to your server:
      // fetch('/api/sponsor', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
    });
  }
});

// Sponsor form message display function
function showSponsorFormMessage(message, type) {
  const existingMessage = document.querySelector(".sponsor-form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `sponsor-form-message p-4 rounded-lg font-montserrat text-center mb-4 ${
    type === "success"
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200"
  }`;
  messageDiv.textContent = message;

  const form = document.getElementById("sponsorForm");
  if (form) {
    form.parentNode.insertBefore(messageDiv, form);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}

// Exhibitor Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const exhibitorForm = document.getElementById("exhibitorForm");

  if (exhibitorForm) {
    exhibitorForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(exhibitorForm);
      const data = {};

      // Process form fields
      for (let [key, value] of formData.entries()) {
        data[key] = value;
      }

      // Validate required fields
      const requiredFields = [
        "businessName",
        "industryCategory",
        "businessDescription",
        "contactPersonName",
        "contactEmail",
        "contactPhone",
        "exhibitionPackage",
        "powerInternet",
        "complianceDeclaration",
        "termsAgreement",
      ];
      let isValid = true;

      requiredFields.forEach((field) => {
        const input = exhibitorForm.querySelector(`[name="${field}"]`);
        if (!data[field] || data[field].trim() === "") {
          isValid = false;
          input.style.borderColor = "#ff6b35";
          input.style.boxShadow = "0 0 0 2px rgba(255, 107, 53, 0.2)";
        } else {
          input.style.borderColor = "";
          input.style.boxShadow = "";
        }
      });

      if (!isValid) {
        // Show error message
        showExhibitorFormMessage(
          "Please fill in all required fields.",
          "error",
        );
        return;
      }

      // Simulate form submission
      showExhibitorFormMessage(
        "Thank you! Your exhibition registration has been submitted. Our events team will contact you within 48 hours.",
        "success",
      );

      // Reset form
      exhibitorForm.reset();

      // In a real application, you would send the data to your server:
      // fetch('/api/exhibitor', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
    });
  }
});

// Exhibitor form message display function
function showExhibitorFormMessage(message, type) {
  const existingMessage = document.querySelector(".exhibitor-form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `exhibitor-form-message p-4 rounded-lg font-montserrat text-center mb-4 ${
    type === "success"
      ? "bg-green-100 text-green-800 border border-green-200"
      : "bg-red-100 text-red-800 border border-red-200"
  }`;
  messageDiv.textContent = message;

  const form = document.getElementById("exhibitorForm");
  if (form) {
    form.parentNode.insertBefore(messageDiv, form);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 5000);
  }
}
