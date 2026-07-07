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

  const storyCarousel = document.querySelector("[data-story-carousel]");
  if (storyCarousel) {
    const slides = Array.from(storyCarousel.querySelectorAll("[data-story-slide]"));
    const dots = Array.from(storyCarousel.querySelectorAll("[data-story-dot]"));
    const previousButton = storyCarousel.querySelector("[data-story-prev]");
    const nextButton = storyCarousel.querySelector("[data-story-next]");
    const counter = storyCarousel.querySelector("[data-story-counter]");
    const caption = storyCarousel.querySelector("[data-story-current-caption]");
    let activeStoryIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let isStoryFlipped = false;

    const storyNumber = (value) => String(value).padStart(2, "0");
    const activeStorySlide = () => slides[activeStoryIndex];
    const visibleQueueCount = () => (window.matchMedia("(max-width: 980px)").matches ? 2 : 3);
    const storyLabel = (slide, action = "Flip story card for") => {
      const captionText = slide.dataset.storyCaption || slide.dataset.storyTitle || "story photo";
      return `${action} ${captionText}`;
    };
    const setStoryFlipped = (isFlipped) => {
      isStoryFlipped = isFlipped;
      storyCarousel.classList.toggle("is-flipped", isStoryFlipped);
      slides.forEach((slide, index) => {
        const isActive = index === activeStoryIndex;
        slide.classList.toggle("is-flipped", isActive && isStoryFlipped);
        slide.setAttribute("aria-pressed", String(isActive && isStoryFlipped));
        if (isActive) {
          slide.setAttribute("aria-label", storyLabel(slide, isStoryFlipped ? "Flip back to photo for" : "Flip story card for"));
        }
      });
    };
    const renderStorySlide = (index) => {
      if (!slides.length) return;
      activeStoryIndex = (index + slides.length) % slides.length;
      const maxQueue = visibleQueueCount();
      slides.forEach((slide, slideIndex) => {
        const offset = (slideIndex - activeStoryIndex + slides.length) % slides.length;
        const isActive = offset === 0;
        const isQueued = offset > 0 && offset <= maxQueue;
        slide.classList.toggle("is-active", isActive);
        slide.classList.toggle("is-queued", isQueued);
        slide.classList.toggle("is-queue-1", offset === 1 && isQueued);
        slide.classList.toggle("is-queue-2", offset === 2 && isQueued);
        slide.classList.toggle("is-queue-3", offset === 3 && isQueued);
        slide.setAttribute("aria-hidden", String(!isActive && !isQueued));
        slide.tabIndex = isActive || isQueued ? 0 : -1;
        if (!isActive) slide.setAttribute("aria-label", storyLabel(slide, "Show"));
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeStoryIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
      if (counter) counter.textContent = `${storyNumber(activeStoryIndex + 1)} / ${storyNumber(slides.length)}`;
      if (caption) caption.textContent = activeStorySlide()?.dataset.storyCaption || "";
      setStoryFlipped(false);
    };

    slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        if (index === activeStoryIndex) {
          setStoryFlipped(!isStoryFlipped);
        } else {
          renderStorySlide(index);
        }
      });
      slide.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          renderStorySlide(activeStoryIndex + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          renderStorySlide(activeStoryIndex - 1);
        }
      });
    });
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => renderStorySlide(index));
    });
    if (previousButton) previousButton.addEventListener("click", () => renderStorySlide(activeStoryIndex - 1));
    if (nextButton) nextButton.addEventListener("click", () => renderStorySlide(activeStoryIndex + 1));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setStoryFlipped(false);
    });
    window.addEventListener("resize", () => renderStorySlide(activeStoryIndex));
    renderStorySlide(activeStoryIndex);
  }

  const qualityFeature = document.querySelector("[data-quality-feature]");
  if (qualityFeature) {
    const qualityProfiles = {
      chef: {
        count: "01 / 05",
        title: "Chef coats that keep looking sharp.",
        copy: "Heavy-use chef coats can still leave our facility looking clean, white, and professional after hundreds of laundering cycles when processed properly."
      },
      sheets: {
        count: "02 / 05",
        title: "Linens that hold their feel.",
        copy: "Sheets and linens should stay consistent in feel, presentation, and usable life with proper cleaning and finishing."
      },
      towels: {
        count: "03 / 05",
        title: "Towels that come back soft, clean, and ready.",
        copy: "Better wash chemistry and handling help towels stay presentable for spas, gyms, hospitality, and wellness accounts."
      },
      events: {
        count: "04 / 05",
        title: "Event goods that are presentation-ready.",
        copy: "Tablecloths, napkins, runners, and specialty event goods need cleaning that handles stains, storage issues, and deadline pressure."
      },
      mold: {
        count: "05 / 05",
        title: "Specialty mold removal.",
        copy: "Shelton can remove mold from items many laundries cannot handle, including colored event goods and specialty pieces."
      }
    };
    const qualityProofs = {
      soil: {
        label: "Heavy Soil",
        copy: "Removes deep soil better so goods come back truly clean, not just processed."
      },
      wear: {
        label: "Long-Term Wear",
        copy: "Better cleaning and handling can help protect fibers, feel, and presentation over time."
      },
      mold: {
        label: "Mold & Mildew",
        copy: "Specialty removal for mold issues, including colored event goods and specialty pieces many laundries cannot safely handle."
      },
      presentation: {
        label: "Presentation",
        copy: "Clean, finished goods look better for guests, staff, and event setups."
      },
      cost: {
        label: "Replacement Cost",
        copy: "Better cleaning can reduce premature replacement, rejected items, and staff headaches."
      }
    };
    const qualityTiles = Array.from(qualityFeature.querySelectorAll("[data-quality-key]"));
    const proofButtons = Array.from(qualityFeature.querySelectorAll("[data-quality-proof]"));
    const qualityDetail = qualityFeature.querySelector("[data-quality-detail]");
    const proofPanel = qualityFeature.querySelector("[data-quality-proof-panel]");
    const renderQuality = (key) => {
      const profile = qualityProfiles[key] || qualityProfiles.chef;
      qualityFeature.dataset.qualityActive = key;
      qualityTiles.forEach((button) => {
        const isActive = button.dataset.qualityKey === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-selected", String(isActive));
        button.tabIndex = isActive ? 0 : -1;
      });
      if (!qualityDetail) return;
      setText(qualityDetail, "[data-quality-count]", profile.count);
      setText(qualityDetail, "[data-quality-title]", profile.title);
      setText(qualityDetail, "[data-quality-copy]", profile.copy);
    };
    const renderQualityProof = (key) => {
      const proof = qualityProofs[key] || qualityProofs.soil;
      proofButtons.forEach((button) => {
        const isActive = button.dataset.qualityProof === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      if (!proofPanel) return;
      setText(proofPanel, "[data-quality-proof-label]", proof.label);
      setText(proofPanel, "[data-quality-proof-copy]", proof.copy);
    };
    qualityTiles.forEach((button, index) => {
      button.addEventListener("click", () => renderQuality(button.dataset.qualityKey));
      button.addEventListener("keydown", (event) => {
        const keyMap = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
        if (event.key === "Home") {
          event.preventDefault();
          qualityTiles[0].focus();
          renderQuality(qualityTiles[0].dataset.qualityKey);
          return;
        }
        if (event.key === "End") {
          event.preventDefault();
          qualityTiles[qualityTiles.length - 1].focus();
          renderQuality(qualityTiles[qualityTiles.length - 1].dataset.qualityKey);
          return;
        }
        if (!keyMap[event.key]) return;
        event.preventDefault();
        const nextIndex = (index + keyMap[event.key] + qualityTiles.length) % qualityTiles.length;
        qualityTiles[nextIndex].focus();
        renderQuality(qualityTiles[nextIndex].dataset.qualityKey);
      });
    });
    proofButtons.forEach((button) => {
      button.addEventListener("click", () => renderQualityProof(button.dataset.qualityProof));
    });
    renderQuality(qualityTiles.find((button) => button.classList.contains("is-active"))?.dataset.qualityKey || "chef");
    renderQualityProof(proofButtons.find((button) => button.classList.contains("is-active"))?.dataset.qualityProof || "soil");
  }

  const programProfiles = {
    hotels: {
      label: "Hotels & Boutique Stays",
      summary: "A reliable linen flow for guest-facing rooms, housekeeping storage, occupancy swings, and the details that shape the stay.",
      items: ["Sheets", "Pillowcases", "Towels", "Bath mats", "Robes", "Guest-facing linens"],
      rhythm: "Recurring pickup and delivery based on occupancy, turn schedules, and storage space.",
      helps: "We help create a reliable linen flow so housekeeping is not stuck chasing towels, sorting bags, or guessing what is coming back.",
      finishing: "Folded, bundled, labeled, staged by property, or packed by item type.",
      flow: ["Pickup cadence", "Account sorting", "Finishing standards", "Route-ready return"],
      cta: "Build a hotel program",
      href: "quote.html?program=hotels"
    },
    str: {
      label: "Short-Term Rentals / Property Managers",
      summary: "A turnover-aware laundry program for property clusters, cleaning teams, guest-ready presentation, and separated owner goods.",
      items: ["Sheets", "Towels", "Bath mats", "Kitchen towels", "Robes", "Blankets", "Comforters", "Pool towels"],
      rhythm: "Route-based pickup tied to turns, checkouts, cleaning teams, and property clusters.",
      helps: "We help reduce laundry friction between cleaners, property managers, and guests with predictable packaging and account-specific handling.",
      finishing: "Property-labeled bundles, guest-ready folds, and owner goods separated by account or property.",
      flow: ["Checkout pickup", "Property labeling", "Guest-ready folds", "Cleaner-friendly return"],
      cta: "Build an STR program",
      href: "quote.html?program=str"
    },
    spa: {
      label: "Spas, Massage & Wellness",
      summary: "Soft, consistent treatment-room linens with handling that supports the calm, polished client experience.",
      items: ["Massage sheets", "Face cradle covers", "Towels", "Robes", "Blankets", "Wraps", "Wellness linens"],
      rhythm: "High-frequency pickup for towel and sheet-heavy accounts with consistent finishing and return packaging.",
      helps: "We help keep treatment rooms stocked with soft, clean, properly folded linens that feel aligned with the client experience.",
      finishing: "Stacked by room or use, towel bundles, sheet bundles, robe handling, and customer-owned or rental possibilities.",
      flow: ["Treatment-room volume", "Softness standards", "Use-based bundles", "Stocked return"],
      cta: "Build a spa program",
      href: "quote.html?program=spa"
    },
    fitness: {
      label: "Gyms, Yoga & Fitness Studios",
      summary: "A towel-forward route program built around class volume, locker-room pressure, and limited studio storage.",
      items: ["Workout towels", "Shower towels", "Hand towels", "Microfiber", "Specialty studio items"],
      rhythm: "Frequent route service built around class volume, towel usage, and studio storage.",
      helps: "We help fitness teams avoid towel shortages, inconsistent returns, and staff time wasted managing laundry.",
      finishing: "Towel bundles, account-labeled bags or carts, and rental or customer-owned towel programs.",
      flow: ["Usage planning", "Frequent pickup", "Towel bundles", "Storage-aware return"],
      cta: "Build a fitness program",
      href: "quote.html?program=fitness"
    },
    events: {
      label: "Event Linen Programs",
      summary: "Event-focused linen support for orders that need polished presentation, clear sorting, and dependable turnaround around event deadlines.",
      items: ["Tablecloths", "Napkins", "Runners", "Skirting", "Specialty event goods", "Event linens"],
      rhythm: "Event-based pickup and return tied to order dates, venue schedules, and seasonal volume.",
      helps: "We help event teams keep table linens and specialty goods clean, pressed, sorted, and ready for setup without last-minute guessing.",
      finishing: "Pressed, folded, grouped by order or venue, labeled for setup, and handled for specialty cleaning needs.",
      flow: ["Event deadline", "Specialty cleaning", "Order sorting", "Presentation-ready return"],
      cta: "Build an event linen program",
      href: "quote.html?program=events"
    },
    restaurants: {
      label: "Restaurants & Food Service",
      summary: "Recurring cleaning and finishing for dining-room and kitchen goods that need consistency through food, grease, and daily service volume.",
      items: ["Napkins", "Aprons", "Chef coats", "Bar towels", "Table linens", "Dining-room goods"],
      rhythm: "Recurring route service based on service nights, soil level, staff needs, and weekly volume.",
      helps: "We help restaurant teams keep napkins, aprons, chef coats, and bar towels clean and consistent through repeated use.",
      finishing: "Pressed or folded dining-room goods, hung or folded garments, sorted returns, and processing matched to food and grease staining.",
      flow: ["Recurring service", "Stain-aware wash", "Dining-room finish", "Consistent return"],
      cta: "Build a restaurant program",
      href: "quote.html?program=restaurants"
    },
    uniforms: {
      label: "Uniform Programs",
      summary: "Organized workwear support for teams that need clean, presentable garments without managing every handoff detail.",
      items: ["Chef coats", "Aprons", "Hospitality uniforms", "Casino uniforms", "Service uniforms", "Business uniforms"],
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
      items: ["Pressed sheets", "Comforters", "Household items", "Specialty laundry", "Large-item support"],
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
      setItems(programPanel, "[data-program-list='items']", profile.items);
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
      message: "I am interested in building a spa, massage, or wellness laundry program."
    },
    fitness: {
      industry: "gym",
      service: "towels",
      message: "I am interested in building a gym, yoga, or fitness towel program."
    },
    events: {
      industry: "event",
      service: "event",
      message: "I am interested in building an event linen program for tablecloths, napkins, runners, or specialty event goods."
    },
    restaurants: {
      industry: "restaurant",
      service: "event",
      message: "I am interested in building a restaurant or food service laundry program for napkins, aprons, bar towels, dining-room goods, or uniforms."
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
