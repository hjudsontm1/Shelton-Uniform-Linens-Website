(() => {
  document.documentElement.classList.add("js-enabled");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setText = (root, selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };
  const setItems = (root, selector, items, tagName = "li") => {
    const list = root.querySelector(selector);
    if (!list) return;
    const nodes = items.map((item) => {
      const node = document.createElement(tagName);
      node.textContent = item;
      return node;
    });
    list.replaceChildren(...nodes);
  };

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

  const insightPanels = document.querySelectorAll(".insight-popout");
  insightPanels.forEach((panel) => {
    panel.addEventListener("toggle", () => {
      if (!panel.open) return;
      insightPanels.forEach((otherPanel) => {
        if (otherPanel !== panel) otherPanel.removeAttribute("open");
      });
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    insightPanels.forEach((panel) => panel.removeAttribute("open"));
  });

  const programProfiles = {
    hotels: {
      label: "Hotels & Boutique Stays",
      summary: "A reliable linen flow for guest-facing rooms, housekeeping storage, occupancy swings, and the details that shape the stay.",
      textiles: ["Sheets", "Pillowcases", "Towels", "Bath mats", "Robes", "Guest-facing linens"],
      rhythm: "Recurring pickup and delivery based on occupancy, turn schedules, and storage space.",
      helps: "We help create a reliable linen flow so housekeeping is not stuck chasing towels, sorting bags, or guessing what is coming back.",
      finishing: "Folded, bundled, labeled, staged by property, or packed by textile type.",
      flow: ["Pickup cadence", "Account sorting", "Finishing standards", "Route-ready return"],
      cta: "Build a hotel program",
      href: "quote.html?program=hotels"
    },
    str: {
      label: "Short-Term Rentals / Property Managers",
      summary: "A turnover-aware laundry program for property clusters, cleaning teams, guest-ready presentation, and separated owner goods.",
      textiles: ["Sheets", "Towels", "Bath mats", "Kitchen towels", "Robes", "Blankets", "Comforters", "Pool towels"],
      rhythm: "Route-based pickup tied to turns, checkouts, cleaning teams, and property clusters.",
      helps: "We help reduce laundry friction between cleaners, property managers, and guests with predictable packaging and account-specific handling.",
      finishing: "Property-labeled bundles, guest-ready folds, and owner goods separated by account or property.",
      flow: ["Checkout pickup", "Property labeling", "Guest-ready folds", "Cleaner-friendly return"],
      cta: "Build an STR program",
      href: "quote.html?program=str"
    },
    spa: {
      label: "Spas, Massage & Wellness",
      summary: "Soft, consistent treatment-room textiles with handling that supports the calm, polished client experience.",
      textiles: ["Massage sheets", "Face cradle covers", "Towels", "Robes", "Blankets", "Wraps", "Wellness linens"],
      rhythm: "High-frequency pickup for towel and sheet-heavy accounts with consistent finishing and return packaging.",
      helps: "We help keep treatment rooms stocked with soft, clean, properly folded textiles that feel aligned with the client experience.",
      finishing: "Stacked by room or use, towel bundles, sheet bundles, robe handling, and customer-owned or rental possibilities.",
      flow: ["Treatment-room volume", "Softness standards", "Use-based bundles", "Stocked return"],
      cta: "Build a spa program",
      href: "quote.html?program=spa"
    },
    fitness: {
      label: "Gyms, Yoga & Fitness Studios",
      summary: "A towel-forward route program built around class volume, locker-room pressure, and limited studio storage.",
      textiles: ["Workout towels", "Shower towels", "Hand towels", "Microfiber", "Specialty studio items"],
      rhythm: "Frequent route service built around class volume, towel usage, and studio storage.",
      helps: "We help fitness teams avoid towel shortages, inconsistent returns, and staff time wasted managing laundry.",
      finishing: "Towel bundles, account-labeled bags or carts, and rental or customer-owned towel programs.",
      flow: ["Usage planning", "Frequent pickup", "Towel bundles", "Storage-aware return"],
      cta: "Build a fitness program",
      href: "quote.html?program=fitness"
    },
    events: {
      label: "Restaurants, Events & F&B",
      summary: "Presentation textile support for dining rooms, event orders, chef wear, bar programs, and seasonal volume swings.",
      textiles: ["Napkins", "Tablecloths", "Chef coats", "Aprons", "Bar towels", "Event linens"],
      rhythm: "Recurring restaurant service, event-based turns, seasonal changes, and rush needs.",
      helps: "We help food, beverage, and event teams keep presentation textiles clean, pressed, and ready for service.",
      finishing: "Pressed napkins and tablecloths, folded or hung uniforms, event-order grouping, and labeled returns.",
      flow: ["Service calendar", "Pressed finishing", "Event grouping", "Ready-for-service return"],
      cta: "Build an event or F&B program",
      href: "quote.html?program=events"
    },
    uniforms: {
      label: "Uniform Programs",
      summary: "Organized workwear support for teams that need clean, presentable garments without managing every handoff detail.",
      textiles: ["Chef coats", "Aprons", "Hospitality uniforms", "Casino uniforms", "Service uniforms", "Business uniforms"],
      rhythm: "Recurring pickup and delivery based on staff count, soil level, and presentation needs.",
      helps: "We help uniform programs stay organized, clean, and presentable without forcing the customer to manage every detail.",
      finishing: "Hung, folded, employee or account grouping, route-ready returns, and specialty cleaning when needed.",
      flow: ["Staff count", "Garment grouping", "Hung or folded finish", "Route-ready return"],
      cta: "Build a uniform program",
      href: "quote.html?program=uniforms"
    },
    wholesale: {
      label: "Wholesale Dry Cleaners",
      summary: "Behind-the-scenes production support for cleaners that need linen finishing or large-item processing capacity.",
      textiles: ["Pressed sheets", "Comforters", "Household items", "Specialty laundry", "Large-item support"],
      rhythm: "Scheduled wholesale route or drop-off support.",
      helps: "We provide behind-the-scenes production capacity for cleaners that need reliable linen finishing or large-item support.",
      finishing: "Pressed, folded, bagged, and labeled by cleaner or customer order.",
      flow: ["Cleaner intake", "Wholesale processing", "Order labels", "Finished return"],
      cta: "Discuss wholesale support",
      href: "quote.html?program=wholesale"
    }
  };

  const programButtons = document.querySelectorAll("[data-program-key]");
  const programPanel = document.querySelector("#program-detail-panel");
  let programTimer;
  const renderProgram = (key, shouldScroll = false) => {
    const profile = programProfiles[key] || programProfiles.hotels;
    if (!programPanel) return;

    const commit = () => {
      programButtons.forEach((button) => {
        const isActive = button.dataset.programKey === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-expanded", String(isActive));
      });
      setText(programPanel, "[data-program-field='title']", profile.label);
      setText(programPanel, "[data-program-field='summary']", profile.summary);
      setText(programPanel, "[data-program-field='rhythm']", profile.rhythm);
      setText(programPanel, "[data-program-field='helps']", profile.helps);
      setText(programPanel, "[data-program-field='finishing']", profile.finishing);
      setItems(programPanel, "[data-program-list='textiles']", profile.textiles);
      setItems(programPanel, "[data-program-list='flow']", profile.flow, "span");

      const cta = programPanel.querySelector("[data-program-field='href']");
      if (cta) {
        cta.textContent = profile.cta;
        cta.href = profile.href;
      }

      programPanel.classList.remove("is-updating");
      programPanel.setAttribute("aria-busy", "false");
      if (shouldScroll && window.matchMedia("(max-width: 700px)").matches) {
        programPanel.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    };

    window.clearTimeout(programTimer);
    programPanel.setAttribute("aria-busy", "true");
    if (prefersReducedMotion) {
      commit();
    } else {
      programPanel.classList.add("is-updating");
      programTimer = window.setTimeout(commit, 120);
    }
  };

  programButtons.forEach((button) => {
    button.addEventListener("click", () => renderProgram(button.dataset.programKey, true));
  });

  const processProfiles = {
    wash: {
      kicker: "Wash",
      title: "Matched programs for different textile types.",
      copy: "Soil level, softness, presentation, and consistency all matter. Shelton starts by understanding what each account sends in and what standard it needs back.",
      points: ["Sort by textile type and account needs.", "Match processing to guest-facing or operational use.", "Keep repeatability at the center of the program."],
      caption: "Matched programs for different textile types.",
      className: "machine-preview--wash"
    },
    finish: {
      kicker: "Finish",
      title: "Pressed, folded, hung, or bundled depending on the account.",
      copy: "Finishing is where a textile program starts to feel custom. A napkin, towel, robe, sheet, and uniform should not all come back the same way.",
      points: ["Press flatwork when presentation matters.", "Fold towel and sheet inventory for fast restocking.", "Hang or group garments when workwear needs structure."],
      caption: "Finishing adapts to textile type and presentation needs.",
      className: "machine-preview--finish"
    },
    pack: {
      kicker: "Pack",
      title: "Account-specific packaging keeps goods usable on arrival.",
      copy: "Returns can be grouped by property, department, room, employee, event order, or textile type so your team spends less time sorting.",
      points: ["Bundle by the way your team works.", "Label and separate goods when accounts need precision.", "Keep customer-owned goods organized from pickup through return."],
      caption: "Packaging turns clean goods into ready-to-use inventory.",
      className: "machine-preview--pack"
    },
    route: {
      kicker: "Route",
      title: "Pickup and delivery cadence built around your operation.",
      copy: "A route plan should match real pressure points: turns, occupancy, class volume, service nights, staff count, storage, and seasonal swings.",
      points: ["Plan recurring service around volume and space.", "Adjust cadence as accounts grow or seasonality changes.", "Keep returns route-ready for the next shift, class, room, or event."],
      caption: "Route service closes the loop between pickup and return.",
      className: "machine-preview--route"
    }
  };

  const processButtons = document.querySelectorAll("[data-process-key]");
  const processPanel = document.querySelector("#process-panel");
  const machinePreview = document.querySelector("[data-machine-preview]");
  const renderProcess = (key) => {
    const profile = processProfiles[key] || processProfiles.wash;
    if (!processPanel) return;

    processButtons.forEach((button) => {
      const isActive = button.dataset.processKey === key;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
      if (isActive) processPanel.setAttribute("aria-labelledby", button.id);
    });
    setText(processPanel, "[data-process-kicker]", profile.kicker);
    setText(processPanel, "[data-process-title]", profile.title);
    setText(processPanel, "[data-process-copy]", profile.copy);
    setItems(processPanel, "[data-process-list='points']", profile.points);
    setText(document, "[data-process-caption]", profile.caption);
    if (machinePreview) machinePreview.className = `machine-preview ${profile.className}`;
  };

  processButtons.forEach((button, index) => {
    button.addEventListener("click", () => renderProcess(button.dataset.processKey));
    button.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const offset = event.key === "ArrowRight" ? 1 : -1;
      const next = processButtons[(index + offset + processButtons.length) % processButtons.length];
      next.focus();
      renderProcess(next.dataset.processKey);
    });
  });

  const ownershipProfiles = {
    rental: {
      title: "Rental Program",
      copy: "Shelton supplies and manages textile inventory for accounts that want a more complete program. This can help reduce upfront purchasing, simplify replacements, and keep recurring service more predictable.",
      points: ["Useful for recurring linen, towel, robe, and wellness programs.", "Can support hotels, STRs, spas, towel-heavy accounts, and gyms.", "Helps formalize par levels and replacement planning over time."]
    },
    cog: {
      title: "Customer-Owned Goods",
      copy: "If you already own your linens, towels, uniforms, or event goods, Shelton can clean, finish, package, and route them back according to your account's needs.",
      points: ["Applies to hotels, STRs, spas, towel accounts, event linens, uniforms, and other commercial textile accounts.", "Keeps customer inventory separated and handled by account expectations.", "Works well when you have established goods but need better finishing, packaging, and route support."]
    }
  };
  const ownershipButtons = document.querySelectorAll("[data-ownership-key]");
  const ownershipPanel = document.querySelector("#ownership-panel");
  const renderOwnership = (key) => {
    const profile = ownershipProfiles[key] || ownershipProfiles.rental;
    if (!ownershipPanel) return;
    ownershipButtons.forEach((button) => {
      const isActive = button.dataset.ownershipKey === key;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
    setText(ownershipPanel, "[data-ownership-title]", profile.title);
    setText(ownershipPanel, "[data-ownership-copy]", profile.copy);
    setItems(ownershipPanel, "[data-ownership-list]", profile.points);
  };
  ownershipButtons.forEach((button) => {
    button.addEventListener("click", () => renderOwnership(button.dataset.ownershipKey));
  });

  const params = new URLSearchParams(window.location.search);
  const industry = params.get("industry");
  const service = params.get("service");
  const request = params.get("request");
  const program = params.get("program");
  const industrySelect = document.querySelector("#industry-select");
  const serviceSelect = document.querySelector("#service-select");
  const messageField = document.querySelector("#message-field");
  const programQuoteMap = {
    hotels: {
      industry: "hotel",
      service: "linen",
      message: "I am interested in building a hotel or boutique stay linen program."
    },
    str: {
      industry: "str",
      service: "linen",
      message: "I am interested in building a short-term rental or property management laundry program."
    },
    spa: {
      industry: "spa",
      service: "towels",
      message: "I am interested in building a spa, massage, or wellness textile program."
    },
    fitness: {
      industry: "gym",
      service: "towels",
      message: "I am interested in building a gym, yoga, or fitness towel program."
    },
    events: {
      industry: "restaurant",
      service: "event",
      message: "I am interested in building a restaurant, event, or F&B linen program."
    },
    uniforms: {
      industry: "uniform",
      service: "uniforms",
      message: "I am interested in building a uniform cleaning and finishing program."
    },
    wholesale: {
      industry: "wholesale",
      service: "wholesale",
      message: "I am interested in discussing wholesale laundry or finishing support."
    }
  };
  const programQuote = programQuoteMap[program];
  if (programQuote) {
    if (industrySelect) industrySelect.value = programQuote.industry;
    if (serviceSelect) serviceSelect.value = programQuote.service;
    if (messageField && !messageField.value) messageField.value = programQuote.message;
  }
  if (industrySelect && industry) industrySelect.value = industry;
  if (serviceSelect && service) serviceSelect.value = service;
  if (messageField && request === "plant-tour") {
    messageField.value = "I would like to schedule a plant tour and discuss a commercial laundry account.";
  }

  const form = document.querySelector("#quote-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.disabled = true;
    if (status) status.textContent = "Sending quote request...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error("Request failed");
      window.location.href = "thank-you.html";
    } catch {
      if (status) status.textContent = "We could not send the request just now. Please try again.";
      if (submit) submit.disabled = false;
    }
  });
})();
