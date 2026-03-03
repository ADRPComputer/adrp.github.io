const menuButton = document.querySelector(".menu-btn");
const nav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const yearEl = document.getElementById("year");
const form = document.getElementById("contact-form");
const formNote = document.getElementById("form-note");
const whatsappFloat = document.querySelector(".whatsapp-float");

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    nav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (nav && nav.classList.contains("open")) {
      nav.classList.remove("open");
    }
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const animateCount = (el) => {
  const target = Number(el.dataset.count || 0);
  const duration = 1300;
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = String(Math.floor(target * eased));
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = String(target);
    }
  };

  requestAnimationFrame(update);
};

const counterObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.45 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const setActiveLink = () => {
  const offset = window.scrollY + 130;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute("id");
    if (!id) {
      return;
    }
    const matchingLink = document.querySelector(`.site-nav a[href="#${id}"]`);
    if (!matchingLink) {
      return;
    }
    if (offset >= top && offset < bottom) {
      navLinks.forEach((link) => link.classList.remove("active"));
      matchingLink.classList.add("active");
    }
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
setActiveLink();

if (form && formNote) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      formNote.textContent = "Please fill all required details correctly.";
      formNote.style.color = "#b91c1c";
      return;
    }

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const service = formData.get("service");
    const message = formData.get("message");
    const subject = encodeURIComponent(`Project Enquiry - ${service}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nService: ${service}\n\nProject Details:\n${message}`
    );

    formNote.textContent = "Opening your email app to send the enquiry...";
    formNote.style.color = "#0f5d4a";

    window.location.href = `mailto:info@adrp.in,adrpcomputer@gmail.com?subject=${subject}&body=${body}`;
    form.reset();
  });
}

if (whatsappFloat) {
  let lastY = window.scrollY;
  window.addEventListener(
    "scroll",
    () => {
      const currentY = window.scrollY;
      if (currentY > lastY && currentY > 220) {
        whatsappFloat.style.transform = "translateY(10px)";
        whatsappFloat.style.opacity = "0.9";
      } else {
        whatsappFloat.style.transform = "translateY(0)";
        whatsappFloat.style.opacity = "1";
      }
      lastY = currentY;
    },
    { passive: true }
  );
}
