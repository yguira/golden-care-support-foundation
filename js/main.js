(() => {
  "use strict";

  const config = window.GCSF_CONFIG || {};
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");

  const setMenu = (open) => {
    nav?.classList.toggle("is-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    const label = menuButton?.querySelector(".sr-only");
    if (label) label.textContent = open ? "Close navigation" : "Open navigation";
  };

  menuButton?.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  window.addEventListener("scroll", () => header?.classList.toggle("is-scrolled", window.scrollY > 10), { passive: true });

  document.querySelectorAll(".comparison").forEach((comparison) => {
    const range = comparison.querySelector(".comparison__range");
    range?.addEventListener("input", () => comparison.style.setProperty("--position", `${range.value}%`));
  });

  document.querySelectorAll("[data-delay]").forEach((element) => {
    element.style.setProperty("--delay", `${element.dataset.delay}ms`);
  });

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const serviceArea = document.getElementById("service-area");
  if (serviceArea && config.serviceArea) serviceArea.textContent = config.serviceArea;

  const emailLink = document.getElementById("contact-email");
  if (emailLink && config.email) {
    emailLink.textContent = config.email;
    emailLink.href = `mailto:${config.email}`;
  } else if (emailLink) {
    emailLink.removeAttribute("href");
  }

  const phoneLink = document.getElementById("contact-phone");
  if (phoneLink && config.phone) {
    phoneLink.textContent = config.phone;
    phoneLink.href = `tel:${config.phone.replace(/[^+\d]/g, "")}`;
  } else if (phoneLink) {
    phoneLink.removeAttribute("href");
  }

  const donateLink = document.getElementById("donate-link");
  if (donateLink && config.donationUrl) {
    donateLink.href = config.donationUrl;
    donateLink.target = "_blank";
    donateLink.rel = "noopener noreferrer";
  }

  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    status?.classList.remove("is-error");

    if (!config.email) {
      if (status) {
        status.textContent = "The form preview is ready. Add the official email address in js/site-config.js to activate email requests.";
        status.classList.add("is-error");
      }
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const contact = String(data.get("contact") || "").trim();
    const reason = String(data.get("reason") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`[Website] ${reason} — ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nContact: ${contact}\nReason: ${reason}\n\nMessage:\n${message}`);
    window.location.href = `mailto:${config.email}?subject=${subject}&body=${body}`;
    if (status) status.textContent = "Your email app should open with the request prepared.";
  });
})();
