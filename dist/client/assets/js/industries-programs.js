(() => {
  const programs = {
    hotels: {
      eyebrow: "01 · HOSPITALITY PROGRAM",
      title: "Hotels & Boutique Stays",
      lead: "A guest-ready linen program shaped around occupancy, turn schedules, storage, and presentation.",
      image: "assets/images/industry-hotel.jpg",
      imageAlt: "Fresh hotel towels and bed linens prepared for guest rooms",
      goods: "Sheets, duvet covers, bath towels, robes, and table linen.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Agree on service days, volume, handoff location, and return format.",
      collect: "Shelton picks up contained goods from the designated commercial handoff point.",
      process: "Goods remain account-organized through sorting, cleaning, finishing, and quality review.",
      return: "Clean goods arrive folded, bundled, carted, or sorted to the account’s agreed standard.",
      routeNote: "Route frequency and turnaround are planned around property volume and operating schedule.",
      quality: [
        "Material- and use-aware cleaning",
        "Stain attention and controlled finishing",
        "Inspection before organized return",
      ],
      quoteHref: "quote.html?industry=hotel&service=linen",
      quoteLabel: "Request a hotel program quote",
    },
    "short-term-rentals": {
      eyebrow: "02 · HOSPITALITY PROGRAM",
      title: "Short-Term Rentals & Property Managers",
      lead: "Centralized linen support for operators who need dependable turns across changing reservation schedules.",
      image: "assets/images/industry-str.jpg",
      imageAlt: "Folded white linens arranged in a short-term rental bedroom",
      goods: "Bed linen, bath towels, kitchen linen, and guest-ready bundles.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Set a central commercial handoff point, service rhythm, and property-ready pack standard.",
      collect: "Used goods are consolidated for scheduled pickup rather than collected house to house.",
      process: "Loads are sorted, cleaned, finished, inspected, and kept organized for the operator.",
      return: "Fresh goods come back folded or packed to support fast, repeatable property turns.",
      routeNote: "Service is built for commercial operators with a practical central handoff location.",
      quality: [
        "Consistent wash and finish standards",
        "Account-organized processing",
        "Property-ready folding and packing",
      ],
      quoteHref: "quote.html?industry=str&service=linen",
      quoteLabel: "Request a rental program quote",
    },
    gyms: {
      eyebrow: "03 · WELLNESS PROGRAM",
      title: "Gyms & Fitness Centers",
      lead: "A towel program calibrated to class schedules, member traffic, storage, and daily replenishment.",
      image: "assets/images/industry-gym.jpg",
      imageAlt: "Neatly rolled fitness towels in a modern gym",
      goods: "Workout towels, bath towels, mats, and select staff garments.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Map member volume, peak days, storage space, and the desired towel presentation.",
      collect: "Soiled goods are contained at the agreed handoff point for scheduled route pickup.",
      process: "Towels are sorted, cleaned, dried, inspected, and prepared for the next service cycle.",
      return: "Clean inventory returns folded, bundled, or carted to match the facility’s workflow.",
      routeNote: "Par levels and service frequency can be adjusted around class and member demand.",
      quality: [
        "Load separation by use and material",
        "Reliable finishing for a clean hand feel",
        "Inspection before every return",
      ],
      quoteHref: "quote.html?industry=gym&service=towels",
      quoteLabel: "Request a fitness program quote",
    },
    spas: {
      eyebrow: "04 · WELLNESS PROGRAM",
      title: "Spas & Wellness",
      lead: "A presentation-conscious program for treatment rooms, robes, towels, and appointment-driven demand.",
      image: "assets/images/industry-spa.jpg",
      imageAlt: "Soft folded towels arranged in a tranquil spa treatment room",
      goods: "Treatment linens, bath towels, hand towels, robes, and wraps.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Align service with treatment volume, preferred folds, storage, and room-reset timing.",
      collect: "Used goods are contained and collected from the designated commercial handoff point.",
      process: "Items are sorted by type, carefully cleaned, finished, and checked for presentation.",
      return: "Finished goods return folded or bundled to support efficient treatment-room resets.",
      routeNote: "Pickup cadence can flex with appointment volume and seasonal demand.",
      quality: [
        "Fabric-aware wash selection",
        "Finish standards suited to guest-facing use",
        "Visual inspection before return",
      ],
      quoteHref: "quote.html?industry=spa&service=towels",
      quoteLabel: "Request a spa program quote",
    },
    events: {
      eyebrow: "05 · EVENTS PROGRAM",
      title: "Event Companies & Venues",
      lead: "Deadline-aware linen care for venues, planners, caterers, and teams working toward a fixed event date.",
      image: "assets/images/industry-event.jpg",
      imageAlt: "Dressed event tables prepared with formal white linen",
      goods: "Tablecloths, napkins, runners, overlays, skirting, and select uniforms.",
      models: "Customer-owned and project-based service.",
      plan: "Confirm quantities, fabric and color mix, event date, handoff, and required return time.",
      collect: "Goods are received as a clearly identified event batch at the agreed route or plant handoff.",
      process: "Each batch is sorted, stain-reviewed, cleaned, finished, and checked against the order.",
      return: "Finished pieces are folded, hung, or packed to support staging and setup.",
      routeNote: "Timing is agreed in advance so the service plan reflects the event deadline.",
      quality: [
        "Batch organization by event",
        "Targeted stain attention",
        "Finish and count review before return",
      ],
      quoteHref: "quote.html?industry=event&service=event",
      quoteLabel: "Request an event program quote",
    },
    restaurants: {
      eyebrow: "06 · FOOD SERVICE PROGRAM",
      title: "Restaurants & Food Service",
      lead: "Practical linen and garment care built around service windows, food soils, volume, and back-of-house flow.",
      image: "assets/images/industry-event.jpg",
      imageAlt: "Restaurant table linen and service settings prepared for guests",
      goods: "Table linen, napkins, aprons, chef wear, bar towels, and service garments.",
      models: "Customer-owned, rental, or hybrid.",
      plan: "Set par levels, route timing, item mix, collection point, and the preferred return format.",
      collect: "Used goods are contained by the team and collected from the designated service location.",
      process: "Loads are sorted by item and soil profile, then cleaned, finished, and inspected.",
      return: "Clean goods return folded, bundled, or hung for efficient restocking before service.",
      routeNote: "Service frequency is planned around covers, operating days, and storage capacity.",
      quality: [
        "Soil-aware cleaning choices",
        "Controlled finishing for table and staff use",
        "Organized inspection and return",
      ],
      quoteHref: "quote.html?industry=restaurant&service=event",
      quoteLabel: "Request a restaurant program quote",
    },
    uniforms: {
      eyebrow: "07 · WORKFORCE PROGRAM",
      title: "Uniform Accounts",
      lead: "A managed garment-care program organized around roles, departments, wearer counts, and shift patterns.",
      image: "assets/images/industry-uniform.jpg",
      imageAlt: "Clean work uniforms arranged for an organized return",
      goods: "Work shirts, pants, jackets, aprons, chef wear, and role-specific garments.",
      models: "Customer-owned garment care and selected program structures.",
      plan: "Document staff count, departments, garment mix, identification needs, and service rhythm.",
      collect: "Worn garments are contained and picked up from the assigned workplace handoff point.",
      process: "Items are account-organized, cleaned with garment needs in mind, finished, and checked.",
      return: "Garments return folded, hung, bundled, or department-sorted as agreed.",
      routeNote: "The program is sized around staffing, changes, and the site’s operating pattern.",
      quality: [
        "Garment-appropriate cleaning",
        "Finish standards suited to workplace wear",
        "Account and department organization",
      ],
      quoteHref: "quote.html?industry=uniform&service=uniforms",
      quoteLabel: "Request a uniform program quote",
    },
    casinos: {
      eyebrow: "08 · WORKFORCE PROGRAM",
      title: "Casinos & Entertainment",
      lead: "Coordinated textile care for properties balancing hospitality, dining, gaming, and workforce needs.",
      image: "assets/images/industry-casino.jpg",
      imageAlt: "Hospitality linens prepared inside a large resort property",
      goods: "Guest linen, food-and-beverage textiles, uniforms, towels, and department-specific goods.",
      models: "Customer-owned, rental, or hybrid by program.",
      plan: "Map departments, volume, access points, service windows, storage, and return standards.",
      collect: "Goods are consolidated by the property and collected at agreed commercial handoff points.",
      process: "Distinct item groups remain organized through sorting, cleaning, finishing, and review.",
      return: "Clean inventory returns by department in the agreed folded, carted, bundled, or hung format.",
      routeNote: "Route and program planning account for round-the-clock operations and multiple departments.",
      quality: [
        "Program-specific processing",
        "Controlled finishing across mixed goods",
        "Department-organized quality review",
      ],
      quoteHref: "quote.html?industry=casino&service=uniforms",
      quoteLabel: "Request a casino program quote",
    },
    wholesale: {
      eyebrow: "09 · PARTNER PROGRAM",
      title: "Wholesale Dry Cleaners & Laundry Partners",
      lead: "Processing support for commercial partners who need dependable capacity and an accountable regional relationship.",
      image: "assets/images/industry-wholesale.jpg",
      imageAlt: "Large stacks of commercially finished white textiles",
      goods: "Program-specific commercial textile batches agreed during discovery.",
      models: "Partner processing and volume-based service structures.",
      plan: "Define item mix, expected volume, batch identification, handoff, finish, and service schedule.",
      collect: "Partner goods transfer through an agreed route, dock, or plant handoff process.",
      process: "Batches remain partner-organized through the specified wash, finish, and review workflow.",
      return: "Completed goods transfer back in the agreed count, pack, cart, or delivery format.",
      routeNote: "Capacity and turnaround are confirmed against the actual item and volume profile.",
      quality: [
        "Documented partner specifications",
        "Batch organization through processing",
        "Review against agreed return standards",
      ],
      quoteHref: "quote.html?industry=wholesale&service=wholesale",
      quoteLabel: "Request a wholesale program quote",
    },
    specialty: {
      eyebrow: "10 · SPECIALTY PROGRAM",
      title: "Specialty Commercial Accounts",
      lead: "A discovery-led path for commercial textile needs that do not fit a standard category or service pattern.",
      image: "assets/images/process-folding.jpg",
      imageAlt: "Commercial laundry team finishing and folding textiles",
      goods: "Specialty textile items reviewed for material, use, volume, finish, and handling needs.",
      models: "Customer-owned and project-specific structures.",
      plan: "Begin with an item and process review before confirming suitability, scope, and timing.",
      collect: "If the program is a fit, establish a safe commercial handoff and identification method.",
      process: "Approved goods follow a documented sorting, cleaning, finishing, and quality workflow.",
      return: "Items return in the agreed format with handling expectations defined before service begins.",
      routeNote: "Specialty requests are evaluated individually; service is confirmed only after review.",
      quality: [
        "Item review before program approval",
        "Documented handling expectations",
        "Quality checks suited to the agreed scope",
      ],
      quoteHref: "quote.html?industry=other&service=not-sure",
      quoteLabel: "Request a specialty program quote",
    },
  };

  const drawer = document.querySelector("#program-drawer");
  const triggers = document.querySelectorAll("[data-program]");

  if (!drawer || !triggers.length) return;

  const fields = {
    eyebrow: drawer.querySelector("[data-drawer-eyebrow]"),
    title: drawer.querySelector("[data-drawer-title]"),
    lead: drawer.querySelector("[data-drawer-lead]"),
    image: drawer.querySelector("[data-drawer-image]"),
    goods: drawer.querySelector("[data-drawer-goods]"),
    models: drawer.querySelector("[data-drawer-models]"),
    plan: drawer.querySelector("[data-drawer-plan]"),
    collect: drawer.querySelector("[data-drawer-collect]"),
    process: drawer.querySelector("[data-drawer-process]"),
    return: drawer.querySelector("[data-drawer-return]"),
    routeNote: drawer.querySelector("[data-drawer-route-note]"),
    quality: drawer.querySelector("[data-drawer-quality]"),
    quote: drawer.querySelector("[data-drawer-quote]"),
  };

  const closeButton = drawer.querySelector("[data-drawer-close]");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeTrigger = null;
  let closeTimer = null;

  const fillDrawer = (program) => {
    fields.eyebrow.textContent = program.eyebrow;
    fields.title.textContent = program.title;
    fields.lead.textContent = program.lead;
    fields.image.src = program.image;
    fields.image.alt = program.imageAlt;
    fields.goods.textContent = program.goods;
    fields.models.textContent = program.models;
    fields.plan.textContent = program.plan;
    fields.collect.textContent = program.collect;
    fields.process.textContent = program.process;
    fields.return.textContent = program.return;
    fields.routeNote.textContent = program.routeNote;
    fields.quality.replaceChildren(
      ...program.quality.map((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        return listItem;
      }),
    );
    fields.quote.href = program.quoteHref;
    fields.quote.querySelector("span").textContent = program.quoteLabel;
  };

  const openDrawer = (programId, trigger) => {
    const program = programs[programId];
    if (!program) return;

    window.clearTimeout(closeTimer);
    fillDrawer(program);
    activeTrigger = trigger;

    if (!drawer.open) drawer.showModal();
    document.body.classList.add("program-drawer-open");
    drawer.scrollTop = 0;
    window.requestAnimationFrame(() => {
      drawer.classList.add("is-open");
      drawer.focus({ preventScroll: true });
    });
  };

  const finishClose = () => {
    if (drawer.open) drawer.close();
    document.body.classList.remove("program-drawer-open");
    activeTrigger?.focus({ preventScroll: true });
  };

  const closeDrawer = () => {
    if (!drawer.open) return;
    drawer.classList.remove("is-open");

    if (prefersReducedMotion.matches) {
      finishClose();
      return;
    }

    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(finishClose, 360);
  };

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => openDrawer(trigger.dataset.program, trigger));
  });

  closeButton?.addEventListener("click", closeDrawer);

  drawer.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !drawer.open) return;
    event.preventDefault();
    closeDrawer();
  });

  drawer.addEventListener("click", (event) => {
    if (event.target !== drawer) return;
    const bounds = drawer.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right) closeDrawer();
  });

  drawer.addEventListener("close", () => {
    drawer.classList.remove("is-open");
    document.body.classList.remove("program-drawer-open");
  });
})();

(() => {
  const directory = document.querySelector(".serve-directory");
  const directoryShell = document.querySelector(".serve-directory-shell");
  const siteNavigation = document.querySelector(".site-nav");
  const links = Array.from(directory?.querySelectorAll('a[href^="#"]') || []);
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if (!directory || !directoryShell || !siteNavigation || !links.length || !sections.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const compactDirectory = window.matchMedia("(max-width: 1180px)");
  let activeId = sections[0].id;
  let frameRequested = false;
  let wasDocked = false;
  let wasCompact = compactDirectory.matches;

  const setActiveLink = (nextId, { center = false } = {}) => {
    if (!nextId) return;
    activeId = nextId;

    links.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${nextId}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });

    if (!center || !compactDirectory.matches) return;
    const activeLink = links.find((link) => link.getAttribute("href") === `#${nextId}`);
    if (!activeLink) return;

    const nextLeft = activeLink.offsetLeft - (directory.clientWidth - activeLink.offsetWidth) / 2;
    directory.scrollTo({
      left: Math.max(0, nextLeft),
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  };

  const updateDirectory = () => {
    frameRequested = false;
    const docked = directoryShell.getBoundingClientRect().top <= 0 && window.scrollY > 0;
    document.body.classList.toggle("has-directory-header", docked);
    directory.classList.toggle("is-docked", docked);

    const readingLine = (docked ? directory.offsetHeight : siteNavigation.offsetHeight) + 40;
    let nextId = sections[0].id;
    let nextTop = Number.NEGATIVE_INFINITY;

    sections.forEach((section) => {
      const sectionTop = section.getBoundingClientRect().top;
      if (sectionTop <= readingLine && sectionTop > nextTop + 2) {
        nextId = section.id;
        nextTop = sectionTop;
      }
    });

    const hashedLink = links.find((link) => link.getAttribute("href") === location.hash);
    const hashedSection = hashedLink
      ? document.querySelector(hashedLink.getAttribute("href"))
      : null;
    const nextSection = document.querySelector(`#${nextId}`);
    if (hashedSection && nextSection) {
      const hashTop = hashedSection.getBoundingClientRect().top;
      const candidateTop = nextSection.getBoundingClientRect().top;
      if (Math.abs(hashTop - candidateTop) <= 2) nextId = hashedSection.id;
    }

    const closingSection = document.querySelector(".serve-fit");
    if (closingSection?.getBoundingClientRect().top <= readingLine) {
      nextId = sections[sections.length - 1].id;
    }

    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24) {
      nextId = sections[sections.length - 1].id;
    }

    const compactChanged = compactDirectory.matches !== wasCompact;
    const dockingChanged = docked !== wasDocked;
    if (nextId !== activeId || compactChanged || dockingChanged) {
      setActiveLink(nextId, { center: docked });
    }

    wasDocked = docked;
    wasCompact = compactDirectory.matches;
  };

  const requestDirectoryUpdate = () => {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(updateDirectory);
  };

  links.forEach((link) => {
    link.addEventListener("click", () => {
      const nextId = link.getAttribute("href").slice(1);
      setActiveLink(nextId, { center: true });
    });
  });

  window.addEventListener("scroll", requestDirectoryUpdate, { passive: true });
  window.addEventListener("resize", requestDirectoryUpdate);
  window.addEventListener("load", requestDirectoryUpdate, { once: true });
  updateDirectory();
})();
