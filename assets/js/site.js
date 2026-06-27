(() => {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#primary-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("is-open", !isOpen);
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const params = new URLSearchParams(window.location.search);
  const industry = params.get("industry");
  const service = params.get("service");
  const request = params.get("request");
  const industrySelect = document.querySelector("#industry-select");
  const serviceSelect = document.querySelector("#service-select");
  const messageField = document.querySelector("#message-field");
  if (industrySelect && industry) industrySelect.value = industry;
  if (serviceSelect && service) serviceSelect.value = service;
  if (messageField && request === "plant-tour") {
    messageField.value = "I would like to schedule a plant tour and discuss a commercial laundry account.";
  }

  const form = document.querySelector("#quote-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    const endpoint = form.dataset.endpoint && form.dataset.endpoint.trim();
    const isLocalPreview = ["localhost", "127.0.0.1", ""].includes(window.location.hostname) || window.location.protocol === "file:";
    const status = form.querySelector(".form-status");

    if (!endpoint) {
      if (isLocalPreview) {
        event.preventDefault();
        if (status) {
          status.textContent = "Preview mode: the form is ready, but needs a live form endpoint or Netlify Forms deployment before it sends.";
        }
      }
      return;
    }

    event.preventDefault();
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.disabled = true;
    if (status) status.textContent = "Sending quote request...";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      if (status) status.textContent = "Thanks. Your quote request has been sent.";
    } catch {
      if (status) status.textContent = "The form could not send yet. Please add the final endpoint or deploy with Netlify Forms.";
    } finally {
      if (submit) submit.disabled = false;
    }
  });
})();