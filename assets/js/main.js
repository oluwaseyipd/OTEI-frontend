// Mobile Menu Toggle with Hamburger to X Animation
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

mobileMenuBtn.addEventListener("click", () => {
  const isMenuOpen = !mobileMenu.classList.contains("hidden");

  if (isMenuOpen) {
    // Close menu
    mobileMenu.classList.add("hidden");
    mobileMenuBtn.classList.remove("active");
    document.body.classList.remove("mobile-menu-open");
    document.body.style.overflow = "auto";
  } else {
    // Open menu
    mobileMenu.classList.remove("hidden");
    mobileMenuBtn.classList.add("active");
    document.body.classList.add("mobile-menu-open");
    document.body.style.overflow = "hidden";
  }
});

mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    mobileMenuBtn.classList.remove("active");
    document.body.classList.remove("mobile-menu-open");
    document.body.style.overflow = "auto";
  });
});

// Close mobile menu when clicking outside
mobileMenu.addEventListener("click", (e) => {
  if (e.target === mobileMenu) {
    mobileMenu.classList.add("hidden");
    mobileMenuBtn.classList.remove("active");
    document.body.classList.remove("mobile-menu-open");
    document.body.style.overflow = "auto";
  }
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

// Speaker Progress Bar Animation on Scroll
const speakerContainers = document.querySelectorAll(".speaker-image-container");

const speakerObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add a small delay to make the animation more noticeable
        setTimeout(() => {
          entry.target.classList.add("progress-active");
        }, 200);
      }
    });
  },
  {
    threshold: 0.3, // Trigger when 30% of the speaker image is visible
    rootMargin: "-50px 0px", // Trigger slightly after the image starts appearing
  },
);

speakerContainers.forEach((container) => {
  speakerObserver.observe(container);
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

// Registration Form Handling
document.addEventListener("DOMContentLoaded", function () {
  const registrationForm = document.getElementById("registrationForm");
  const accessibilityYes = document.getElementById("accessibilityYes");
  const accessibilityNo = document.getElementById("accessibilityNo");
  const accessibilityDetails = document.getElementById("accessibilityDetails");

  // Handle accessibility details visibility with smooth transition
  if (accessibilityYes && accessibilityNo && accessibilityDetails) {
    accessibilityYes.addEventListener("change", function () {
      if (this.checked) {
        accessibilityDetails.classList.remove("hidden");
        // Small delay to ensure the element is visible before animation
        setTimeout(() => {
          accessibilityDetails.classList.add("show");
        }, 10);
      }
    });

    accessibilityNo.addEventListener("change", function () {
      if (this.checked) {
        accessibilityDetails.classList.remove("show");
        // Wait for animation to complete before hiding
        setTimeout(() => {
          accessibilityDetails.classList.add("hidden");
          accessibilityDetails.value = "";
        }, 400);
      }
    });
  }

  // Handle participant category limit (max 3)
  const participantCheckboxes = document.querySelectorAll(
    'input[name="participantCategory"]',
  );
  participantCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", function () {
      const checkedBoxes = document.querySelectorAll(
        'input[name="participantCategory"]:checked',
      );
      if (checkedBoxes.length > 3) {
        this.checked = false;
        showRegistrationMessage(
          "You can select a maximum of 3 participant categories.",
          "error",
        );
      }
    });
  });

  if (registrationForm) {
    registrationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(registrationForm);
      const data = {};

      // Process form fields
      for (let [key, value] of formData.entries()) {
        if (key === "participantCategory" || key === "interestAreas") {
          if (!data[key]) data[key] = [];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      }

      // Validation
      let isValid = true;
      const errors = [];

      // Required fields validation
      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "phone",
        "gender",
        "city",
        "organizationName",
        "role",
        "fullAttendance",
        "hearAbout",
        "agreeUpdates",
        "physicalEvent",
      ];

      requiredFields.forEach((field) => {
        if (!data[field] || data[field].trim() === "") {
          isValid = false;
          errors.push(`${field} is required`);
          const input = registrationForm.querySelector(`[name="${field}"]`);
          if (input) {
            input.classList.add("error");
          }
        }
      });

      // Participant category validation (at least 1, max 3)
      if (!data.participantCategory || data.participantCategory.length === 0) {
        isValid = false;
        errors.push("Please select at least one participant category");
      } else if (data.participantCategory.length > 3) {
        isValid = false;
        errors.push("Please select maximum 3 participant categories");
      }

      // Interest areas validation (at least 1)
      if (!data.interestAreas || data.interestAreas.length === 0) {
        isValid = false;
        errors.push("Please select at least one interest area");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (data.email && !emailRegex.test(data.email)) {
        isValid = false;
        errors.push("Please enter a valid email address");
      }

      if (!isValid) {
        showRegistrationMessage(
          "Please fix the following errors: " + errors.join(", "),
          "error",
        );
        return;
      }

      // Show loading state
      document.body.classList.add("form-loading");
      const submitBtn = registrationForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        showRegistrationMessage(
          "Thank you for registering! Your registration has been submitted successfully. You will receive a confirmation email shortly.",
          "success",
        );

        // Reset form
        registrationForm.reset();
        document.body.classList.remove("form-loading");
        submitBtn.disabled = false;

        // Remove error classes
        document.querySelectorAll(".error").forEach((el) => {
          el.classList.remove("error");
        });

        // Scroll to success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 2000);

      // In a real application, you would send the data to your server:
      // fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data)
      // });
    });
  }
});

// Registration form message display function
function showRegistrationMessage(message, type) {
  const existingMessage = document.querySelector(".registration-form-message");
  if (existingMessage) {
    existingMessage.remove();
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = `registration-form-message p-4 rounded-lg font-montserrat text-center mb-4 ${
    type === "success"
      ? "form-success"
      : "bg-red-100 text-red-800 border border-red-200"
  }`;
  messageDiv.textContent = message;

  const form = document.getElementById("registrationForm");
  if (form) {
    form.parentNode.insertBefore(messageDiv, form);

    // Remove message after 7 seconds
    setTimeout(() => {
      messageDiv.remove();
    }, 7000);
  }
}

// Timeline Animation for Schedule Section
document.addEventListener("DOMContentLoaded", function () {
  // Timeline intersection observer for animation
  const timelineItems = document.querySelectorAll(
    "#schedule .relative.flex.items-center",
  );

  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 200);
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  // Apply initial styles and observe timeline items
  timelineItems.forEach((item, index) => {
    item.style.opacity = "0";
    item.style.transform = "translateY(30px)";
    item.style.transition = "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
    timelineObserver.observe(item);
  });

  // Enhanced hover effects for timeline cards
  const timelineCards = document.querySelectorAll(
    "#schedule .bg-white\\/95, #schedule .bg-gradient-to-r",
  );

  timelineCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-8px) scale(1.02)";
      card.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) scale(1)";
      card.style.boxShadow = "";
    });
  });

  // Timeline dots pulse effect on scroll
  const timelineDots = document.querySelectorAll(
    "#schedule .absolute.left-1\\/2.transform.-translate-x-1\\/2",
  );

  timelineDots.forEach((dot) => {
    const dotObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = "pulse 2s infinite";
          }
        });
      },
      { threshold: 0.5 },
    );

    dotObserver.observe(dot);
  });
});
