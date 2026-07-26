(function () {
  "use strict";

  const data = window.SheltonProgramsData;
  const servicesMount = document.querySelector("[data-public-services]");
  const serviceStage = document.querySelector("[data-public-service-stage]");
  const industriesMount = document.querySelector("[data-public-industries]");
  const industryStage = document.querySelector("[data-public-industry-stage]");
  const capabilitiesMount = document.querySelector("[data-public-capabilities]");
  const modelsMount = document.querySelector("[data-public-models]");

  if (!data || !servicesMount || !serviceStage || !industriesMount || !industryStage) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const serviceById = new Map(data.services.map((service) => [service.id, service]));
  const industryById = new Map(data.industries.map((industry) => [industry.id, industry]));
  const capabilityById = new Map(data.capabilities.map((capability) => [capability.id, capability]));
  const modelById = new Map(data.accountModels.map((model) => [model.id, model]));

  const serviceImages = {
    "linens-bedding": "assets/images/industry-hotel.jpg",
    "towels-wellness": "assets/images/industry-spa.jpg",
    "uniforms-chef-coats": "assets/images/industry-uniform.jpg",
    "event-linens": "assets/images/industry-event.jpg",
    "specialty-cleaning": "assets/images/process-ironer.jpg",
    "wholesale-support": "assets/images/industry-wholesale.jpg"
  };

  const industryImages = {
    hotels: "assets/images/industry-hotel.jpg",
    "str-property-managers": "assets/images/industry-str.jpg",
    "spa-wellness": "assets/images/industry-spa.jpg",
    "gyms-fitness": "assets/images/industry-gym.jpg",
    "events-convention-centers": "assets/images/industry-event.jpg",
    "restaurants-food-service": "assets/images/industry-event.jpg",
    "uniform-accounts": "assets/images/industry-uniform.jpg",
    "casinos-entertainment": "assets/images/industry-casino.jpg",
    "wholesale-cleaners": "assets/images/industry-wholesale.jpg"
  };

  const serviceAliases = {
    "linens-bedding": ["linen", "hospitality-laundry", "str-laundry"],
    "towels-wellness": ["towels", "spa-wellness-laundry", "fitness-towel-service"],
    "uniforms-chef-coats": ["uniforms", "uniform-programs", "restaurant-laundry"],
    "event-linens": ["event", "event-linen-programs"],
    "specialty-cleaning": ["specialty"],
    "wholesale-support": ["wholesale"]
  };

  const serviceHashMap = new Map();
  data.services.forEach((service) => {
    serviceHashMap.set(service.id, service.id);
    (serviceAliases[service.id] || []).forEach((alias) => serviceHashMap.set(alias, service.id));
  });
  const capabilityHashMap = new Map([["route", "route-return"]]);

  const create = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const replaceList = (mount, items) => {
    mount.replaceChildren();
    items.forEach((item) => mount.append(create("li", "", item)));
  };

  const setText = (selector, text) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  };

  const jumpToElement = (element, block = "start") => {
    if (!element) return;
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    element.scrollIntoView({ block, behavior: "auto" });
    root.style.scrollBehavior = previousBehavior;
  };

  const serviceQuoteUrl = (service) => {
    const value = service.quotePrefillValues?.service || "not-sure";
    return `quote.html?service=${encodeURIComponent(value)}`;
  };

  const industryQuoteUrl = (industry) => {
    const value = industry.quotePrefillValues?.industry || "other";
    return `quote.html?industry=${encodeURIComponent(value)}`;
  };

  let activeServiceId = data.services[0]?.id || null;
  let activeIndustryId = data.industries[0]?.id || null;
  let serviceRenderToken = 0;
  let industryRenderToken = 0;

  const updateServiceStage = (service) => {
    const image = serviceStage.querySelector("[data-service-image]");
    const quoteLink = serviceStage.querySelector("[data-service-quote]");
    const relatedMount = serviceStage.querySelector("[data-service-industries]");
    const serviceIndex = data.services.findIndex((item) => item.id === service.id) + 1;

    if (image) {
      image.src = serviceImages[service.id] || "assets/images/hero-editorial-textiles.jpg";
      image.alt = `${service.title} commercial laundry service`;
    }
    setText("[data-service-caption]", service.title);
    setText("[data-service-number]", `Service ${String(serviceIndex).padStart(2, "0")}`);
    setText("[data-service-title]", service.title);
    setText("[data-service-summary]", service.shortSummary);
    replaceList(serviceStage.querySelector("[data-service-items]"), service.commonItems.slice(0, 6));
    replaceList(serviceStage.querySelector("[data-service-problems]"), service.problemsSolved.slice(0, 5));

    if (quoteLink) quoteLink.href = serviceQuoteUrl(service);
    if (relatedMount) {
      relatedMount.replaceChildren();
      service.relatedIndustryIds.slice(0, 4).forEach((industryId) => {
        const industry = industryById.get(industryId);
        if (!industry) return;
        const link = create("a", "", industry.title);
        link.href = `#${industry.id}`;
        relatedMount.append(link);
      });
    }
  };

  const selectService = (serviceId, options = {}) => {
    const service = serviceById.get(serviceId);
    if (!service) return;
    activeServiceId = service.id;
    servicesMount.querySelectorAll("[data-service-id]").forEach((button) => {
      const selected = button.dataset.serviceId === service.id;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    const token = ++serviceRenderToken;
    const render = () => {
      if (token !== serviceRenderToken) return;
      updateServiceStage(service);
      serviceStage.classList.remove("is-changing");
      if (options.reveal && window.matchMedia("(max-width: 900px)").matches) {
        serviceStage.scrollIntoView({
          block: "start",
          behavior: reducedMotion ? "auto" : "smooth"
        });
      }
    };

    if (reducedMotion || options.immediate) {
      render();
    } else {
      serviceStage.classList.add("is-changing");
      window.setTimeout(render, 120);
    }

    if (options.updateHash) {
      window.history.replaceState(null, "", `#${service.id}`);
    }
  };

  const renderServices = () => {
    servicesMount.replaceChildren();
    data.services.forEach((service, index) => {
      const item = create("li", "service-index-item");
      item.id = service.id;
      (serviceAliases[service.id] || []).forEach((alias) => {
        const proxy = create("span", "program-anchor-proxy");
        proxy.id = alias;
        proxy.setAttribute("aria-hidden", "true");
        item.append(proxy);
      });

      const button = create("button", "service-index-button");
      button.type = "button";
      button.dataset.serviceId = service.id;
      button.setAttribute("aria-controls", "service-detail-stage");
      button.setAttribute("aria-pressed", "false");

      const number = create("span", "service-index-button__number", String(index + 1).padStart(2, "0"));
      const copy = create("span", "service-index-button__copy");
      copy.append(
        create("span", "service-index-button__title", service.title),
        create("span", "service-index-button__summary", service.shortSummary)
      );
      const arrow = create("span", "service-index-button__arrow", "->");
      arrow.setAttribute("aria-hidden", "true");
      button.append(number, copy, arrow);
      button.addEventListener("click", () => selectService(service.id, { updateHash: true, reveal: true }));
      item.append(button);
      servicesMount.append(item);
    });
    serviceStage.id = "service-detail-stage";
    selectService(activeServiceId, { immediate: true });
  };

  const updateIndustryStage = (industry) => {
    const image = industryStage.querySelector("[data-industry-image]");
    const quoteLink = industryStage.querySelector("[data-industry-quote]");
    const relatedMount = industryStage.querySelector("[data-industry-services]");
    const industryIndex = data.industries.findIndex((item) => item.id === industry.id) + 1;

    if (image) {
      image.src = industryImages[industry.id] || "assets/images/hero-editorial-textiles.jpg";
      image.alt = `${industry.title} commercial laundry program`;
    }
    setText("[data-industry-number]", `Industry ${String(industryIndex).padStart(2, "0")}`);
    setText("[data-industry-title]", industry.title);
    setText("[data-industry-summary]", industry.shortSummary);
    setText("[data-industry-goods]", industry.typicalGoods.slice(0, 5).join(" / "));
    setText("[data-industry-needs]", industry.operatingNeeds.slice(0, 4).join(" / "));
    if (quoteLink) quoteLink.href = industryQuoteUrl(industry);

    if (relatedMount) {
      relatedMount.replaceChildren();
      industry.relatedServiceIds.slice(0, 4).forEach((serviceId) => {
        const service = serviceById.get(serviceId);
        if (!service) return;
        const link = create("a", "", service.title);
        link.href = `#${service.id}`;
        relatedMount.append(link);
      });
    }
  };

  const selectIndustry = (industryId, options = {}) => {
    const industry = industryById.get(industryId);
    if (!industry) return;
    activeIndustryId = industry.id;
    industriesMount.querySelectorAll("[data-industry-id]").forEach((button) => {
      const selected = button.dataset.industryId === industry.id;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    const token = ++industryRenderToken;
    const render = () => {
      if (token !== industryRenderToken) return;
      updateIndustryStage(industry);
      industryStage.classList.remove("is-changing");
      if (options.reveal && window.matchMedia("(max-width: 900px)").matches) {
        industryStage.scrollIntoView({
          block: "start",
          behavior: reducedMotion ? "auto" : "smooth"
        });
      }
    };

    if (reducedMotion || options.immediate) {
      render();
    } else {
      industryStage.classList.add("is-changing");
      window.setTimeout(render, 120);
    }

    if (options.updateHash) {
      window.history.replaceState(null, "", `#${industry.id}`);
    }
  };

  const renderIndustries = () => {
    industriesMount.replaceChildren();
    data.industries.forEach((industry, index) => {
      const item = create("li", "");
      item.id = industry.id;
      const button = create("button", "");
      button.type = "button";
      button.dataset.industryId = industry.id;
      button.setAttribute("aria-controls", "industry-detail-stage");
      button.setAttribute("aria-pressed", "false");
      button.append(
        create("span", "industry-index__number", String(index + 1).padStart(2, "0")),
        create("span", "industry-index__title", industry.title)
      );
      button.addEventListener("click", () => selectIndustry(industry.id, { updateHash: true, reveal: true }));
      item.append(button);
      industriesMount.append(item);
    });
    industryStage.id = "industry-detail-stage";
    selectIndustry(activeIndustryId, { immediate: true });
  };

  const renderCapabilities = () => {
    if (!capabilitiesMount) return;
    const publicCapabilityIds = [
      "cleaning-quality",
      "linen-appearance-feel",
      "customer-owned-goods-protection",
      "color-retention",
      "stain-treatment",
      "finishing",
      "route-return"
    ];
    capabilitiesMount.replaceChildren();
    publicCapabilityIds.forEach((capabilityId, index) => {
      const capability = capabilityById.get(capabilityId);
      if (!capability) return;
      const details = create("details", "standards-ledger__item");
      details.id = capability.id;
      if (index === 0) details.open = true;
      const summary = create("summary", "");
      const toggle = create("span", "standards-ledger__toggle", "+");
      toggle.setAttribute("aria-hidden", "true");
      summary.append(
        create("span", "standards-ledger__number", String(index + 1).padStart(2, "0")),
        create("span", "standards-ledger__title", capability.title),
        create("span", "standards-ledger__summary", capability.shortSummary),
        toggle
      );
      const detail = create("p", "standards-ledger__detail", capability.fullDetail);
      details.append(summary, detail);
      capabilitiesMount.append(details);
    });
  };

  const renderModels = () => {
    if (!modelsMount) return;
    modelsMount.replaceChildren();
    data.accountModels.forEach((model, index) => {
      const article = create("article", "program-model");
      article.id = model.id;
      article.classList.toggle("is-primary", model.id === "customer-owned-goods");
      article.append(
        create("span", "program-model__number", String(index + 1).padStart(2, "0")),
        create("h3", "", model.title),
        create("p", "", model.shortSummary)
      );
      modelsMount.append(article);
    });
  };

  const applyHash = () => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (!hash) return;
    const serviceId = serviceHashMap.get(hash);
    if (serviceId) {
      selectService(serviceId, { immediate: true });
      window.requestAnimationFrame(() => jumpToElement(document.getElementById(serviceId)));
      return;
    }
    if (industryById.has(hash)) {
      selectIndustry(hash, { immediate: true });
      window.requestAnimationFrame(() => jumpToElement(document.getElementById("industries")));
      return;
    }
    const capabilityId = capabilityHashMap.get(hash) || (capabilityById.has(hash) ? hash : null);
    if (capabilityId) {
      const capability = document.getElementById(capabilityId);
      if (capability instanceof HTMLDetailsElement) capability.open = true;
      window.requestAnimationFrame(() => jumpToElement(capability));
      return;
    }
    if (modelById.has(hash)) {
      window.requestAnimationFrame(() => jumpToElement(document.getElementById(hash), "center"));
    }
  };

  renderServices();
  renderIndustries();
  renderCapabilities();
  renderModels();
  applyHash();
  window.addEventListener("hashchange", applyHash);

  window.SheltonProgramsPage = {
    selectService,
    selectIndustry,
    getSelection: () => ({ service: activeServiceId, industry: activeIndustryId })
  };
}());
