(function () {
  "use strict";

  const data = window.SheltonProgramsData;
  const catalog = document.querySelector("[data-service-catalog]");
  if (!data || !catalog) return;

  const isPreview = document.body.dataset.catalogMode !== "live";
  const prototypeIds = new Set(["linens-bedding", "event-linens"]);
  const serviceAliases = {
    "linens-bedding": ["linen", "hospitality-laundry", "str-laundry"],
    "towels-wellness": ["towels", "spa-wellness-laundry", "fitness-towel-service"],
    "uniforms-chef-coats": ["uniforms", "uniform-programs", "restaurant-laundry"],
    "event-linens": ["event", "event-linen-programs"],
    "specialty-cleaning": ["specialty"],
    "wholesale-support": ["wholesale"]
  };
  const visualByService = {
    "linens-bedding": {
      src: "assets/images/process-ironer.jpg",
      alt: "Finished white sheets and towels beside commercial ironing equipment",
      position: "center"
    },
    "event-linens": {
      src: "assets/images/industry-event.jpg",
      alt: "Pressed event table linens and napkins arranged for presentation",
      position: "center"
    }
  };

  const industryById = new Map(data.industries.map((industry) => [industry.id, industry]));
  const capabilityById = new Map(data.capabilities.map((capability) => [capability.id, capability]));
  const modelById = new Map(data.accountModels.map((model) => [model.id, model]));
  const serviceHashMap = new Map();
  data.services.forEach((service) => {
    serviceHashMap.set(service.id, service.id);
    (serviceAliases[service.id] || []).forEach((alias) => serviceHashMap.set(alias, service.id));
  });
  let openServiceId = null;
  let lastTrigger = null;
  let closeTimer = null;

  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const joinTitles = (ids, lookup) => ids
    .map((id) => lookup.get(id)?.title)
    .filter(Boolean);

  const appendDotRail = (parent, items, className) => {
    const rail = create("p", className);
    items.forEach((item, index) => {
      if (index) rail.append(create("span", "catalog-dot", "·"));
      rail.append(document.createTextNode(item));
    });
    parent.append(rail);
  };

  const buildTopic = (title, intro, items) => {
    const topic = create("details", "service-topic");
    const summary = create("summary");
    summary.append(create("span", "service-topic__title", title), create("span", "service-topic__mark", "+"));
    const body = create("div", "service-topic__body");
    if (intro) body.append(create("p", "", intro));
    if (items?.length) {
      const list = create("ul");
      items.forEach((item) => list.append(create("li", "", item)));
      body.append(list);
    }
    topic.append(summary, body);
    topic.addEventListener("toggle", () => {
      topic.querySelector(".service-topic__mark").textContent = topic.open ? "−" : "+";
    });
    summary.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      topic.open = !topic.open;
    });
    return topic;
  };

  const buildFolio = (service, index) => {
    const folio = create("section", "service-folio");
    folio.id = `${service.id}-details`;
    folio.hidden = true;
    folio.setAttribute("aria-labelledby", `${service.id}-folio-title`);
    folio.setAttribute("tabindex", "-1");

    const visual = create("figure", "service-folio__visual");
    const visualData = visualByService[service.id];
    const image = create("img");
    image.src = visualData.src;
    image.alt = visualData.alt;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    image.style.objectPosition = visualData.position;
    visual.append(image, create("figcaption", "", service.title));

    const overview = create("div", "service-folio__overview");
    overview.append(create("p", "service-folio__index", `Service ${String(index + 1).padStart(2, "0")}`));
    const title = create("h3", "", service.title);
    title.id = `${service.id}-folio-title`;
    overview.append(title, create("p", "service-folio__lead", service.shortSummary));

    const outcomes = create("ol", "service-outcomes");
    service.problemsSolved.slice(0, 3).forEach((outcome, outcomeIndex) => {
      const item = create("li");
      item.append(create("span", "", String(outcomeIndex + 1).padStart(2, "0")), create("strong", "", outcome));
      outcomes.append(item);
    });
    overview.append(outcomes);

    const industries = joinTitles(service.relatedIndustryIds, industryById);
    const related = create("div", "service-folio__related");
    related.append(create("p", "service-folio__label", "Commonly used by"));
    appendDotRail(related, industries, "service-folio__industry-rail");
    overview.append(related);

    const action = create("a", "service-folio__action", "Discuss this service");
    const params = new URLSearchParams({ ...service.quotePrefillValues, source: isPreview ? "services-industries-preview" : "services" });
    action.href = `${data.quotePrefill.target}?${params.toString()}`;
    overview.append(action);

    const topics = create("div", "service-folio__topics");
    const capabilities = service.cleaningCapabilities
      .map((id) => capabilityById.get(id))
      .filter(Boolean);
    const models = joinTitles(service.accountModels, modelById);
    const handlingItems = service.commonItems;
    const differenceItems = capabilities.map((capability) => capability.shortSummary);
    const returnItems = [...service.finishingOptions, ...service.returnFormats];
    const routeCapability = capabilityById.get("route-return");
    if (routeCapability) returnItems.push(routeCapability.shortSummary);

    topics.append(
      buildTopic("What We Handle", "Representative goods for this service include:", handlingItems),
      buildTopic("What Shelton Does Differently", service.problemsSolved.join(" · "), differenceItems),
      buildTopic("How It Returns", "Finishing and return standards are shaped around the account.", returnItems),
      buildTopic("Who Uses This Service", `Common account models: ${models.join(" · ")}`, industries)
    );

    const close = create("button", "service-folio__close", "Close details");
    close.type = "button";
    close.dataset.closeService = service.id;
    close.setAttribute("aria-label", `Close ${service.title} details`);

    folio.append(visual, overview, topics, close);
    return folio;
  };

  const renderCatalog = () => {
    const fragment = document.createDocumentFragment();
    data.services.forEach((service, index) => {
      const entry = create("article", "service-entry");
      entry.id = service.futureAnchor;
      entry.dataset.serviceId = service.id;
      entry.setAttribute("aria-labelledby", `${service.id}-title`);
      (serviceAliases[service.id] || []).forEach((alias) => {
        const proxy = create("span", "catalog-anchor-alias");
        proxy.id = alias;
        proxy.setAttribute("aria-hidden", "true");
        entry.append(proxy);
      });

      const number = create("p", "service-entry__number", String(index + 1).padStart(2, "0"));
      const main = create("div", "service-entry__main");
      const title = create("h3", "", service.title);
      title.id = `${service.id}-title`;
      main.append(title, create("p", "service-entry__summary", service.shortSummary));
      appendDotRail(main, service.commonItems.slice(0, 6), "service-entry__goods");

      const context = create("div", "service-entry__context");
      context.append(create("p", "service-entry__label", "Commonly used by"));
      appendDotRail(context, joinTitles(service.relatedIndustryIds, industryById), "service-entry__industries");

      const control = create("div", "service-entry__control");
      if (prototypeIds.has(service.id)) {
        const button = create("button", "service-entry__toggle");
        button.type = "button";
        button.dataset.openService = service.id;
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-controls", `${service.id}-details`);
        button.append(create("span", "", "Explore details"), create("span", "service-entry__arrow", "↓"));
        control.append(button);
      } else if (isPreview) {
        const note = create("span", "service-entry__scope", "Overview only in this review");
        control.append(note);
      } else {
        entry.classList.add("service-entry--overview-only");
      }

      entry.append(number, main, context);
      if (control.childElementCount) entry.append(control);
      fragment.append(entry);
      if (prototypeIds.has(service.id)) fragment.append(buildFolio(service, index));
    });
    catalog.append(fragment);
  };

  const getEntry = (serviceId) => catalog.querySelector(`[data-service-id="${serviceId}"]`);
  const getFolio = (serviceId) => document.getElementById(`${serviceId}-details`);
  const getTrigger = (serviceId) => catalog.querySelector(`[data-open-service="${serviceId}"]`);

  const scrollWithNavOffset = (element, { smooth = false } = {}) => {
    if (!element) return;
    const navHeight = document.querySelector(".site-nav")?.getBoundingClientRect().height || 0;
    const top = Math.max(0, window.scrollY + element.getBoundingClientRect().top - navHeight - 16);
    window.scrollTo({
      top,
      behavior: smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "auto"
    });
  };

  const scheduleAnchorScroll = (element) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => scrollWithNavOffset(element));
    });
  };

  const closeService = (serviceId, { restoreFocus = false, immediate = false } = {}) => {
    const folio = getFolio(serviceId);
    const entry = getEntry(serviceId);
    const trigger = getTrigger(serviceId);
    if (!folio || folio.hidden) return;
    window.clearTimeout(closeTimer);
    trigger?.setAttribute("aria-expanded", "false");
    entry?.classList.remove("is-open");
    folio.classList.remove("is-visible");
    folio.classList.add("is-closing");
    const finish = () => {
      folio.hidden = true;
      folio.classList.remove("is-closing");
      if (openServiceId === serviceId) openServiceId = null;
      if (restoreFocus) trigger?.focus({ preventScroll: true });
    };
    if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) finish();
    else closeTimer = window.setTimeout(finish, 220);
  };

  const openService = (serviceId, { focus = true, updateHistory = true, guideViewport = true } = {}) => {
    if (!prototypeIds.has(serviceId)) return;
    if (openServiceId && openServiceId !== serviceId) closeService(openServiceId, { immediate: true });
    const folio = getFolio(serviceId);
    const entry = getEntry(serviceId);
    const trigger = getTrigger(serviceId);
    if (!folio || !entry || !trigger) return;

    window.clearTimeout(closeTimer);
    openServiceId = serviceId;
    lastTrigger = trigger;
    trigger.setAttribute("aria-expanded", "true");
    entry.classList.add("is-open");
    folio.hidden = false;
    folio.classList.remove("is-closing");
    requestAnimationFrame(() => folio.classList.add("is-visible"));

    if (updateHistory && window.location.hash !== `#${serviceId}`) {
      window.history.pushState({ serviceId }, "", `#${serviceId}`);
    }
    if (guideViewport) {
      const entryTop = entry.getBoundingClientRect().top;
      const navHeight = document.querySelector(".site-nav")?.getBoundingClientRect().height || 0;
      if (entryTop < navHeight + 16 || entryTop > window.innerHeight * 0.48) {
        scrollWithNavOffset(entry, { smooth: true });
      }
    }
    if (focus) window.setTimeout(() => folio.focus({ preventScroll: true }), 60);
  };

  const syncFromLocation = ({ initial = false } = {}) => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (hash === "industries" || hash === "services") {
      if (openServiceId) closeService(openServiceId, { immediate: true });
      scheduleAnchorScroll(document.getElementById("service-catalog"));
      return;
    }
    const serviceId = serviceHashMap.get(hash);
    if (prototypeIds.has(serviceId)) {
      openService(serviceId, { focus: !initial, updateHistory: false, guideViewport: false });
      scheduleAnchorScroll(getEntry(serviceId));
    } else if (serviceId) {
      if (openServiceId) closeService(openServiceId, { immediate: true });
      scheduleAnchorScroll(getEntry(serviceId));
    } else if (openServiceId) {
      closeService(openServiceId, { immediate: true });
    }
  };

  catalog.addEventListener("click", (event) => {
    const openButton = event.target.closest("[data-open-service]");
    if (openButton) {
      const serviceId = openButton.dataset.openService;
      if (openServiceId === serviceId) {
        closeService(serviceId, { restoreFocus: true });
        window.history.pushState({}, "", window.location.pathname + window.location.search);
      } else {
        openService(serviceId);
      }
      return;
    }

    const closeButton = event.target.closest("[data-close-service]");
    if (closeButton) {
      const serviceId = closeButton.dataset.closeService;
      closeService(serviceId, { restoreFocus: true });
      window.history.pushState({}, "", window.location.pathname + window.location.search);
    }
  });

  window.addEventListener("popstate", () => syncFromLocation());
  window.addEventListener("hashchange", () => syncFromLocation());

  renderCatalog();
  syncFromLocation({ initial: true });
}());
