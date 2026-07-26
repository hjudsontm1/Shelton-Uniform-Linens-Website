(function () {
  "use strict";

  var data = window.SheltonProgramsData;
  var page = document.querySelector(".services-experience-page");

  if (!data || !page) return;

  var serviceImages = {
    "linens-bedding": {
      src: "assets/images/process-ironer.jpg",
      alt: "Commercial linens moving through professional flatwork finishing",
      label: "Flatwork and linen finishing"
    },
    "towels-wellness": {
      src: "assets/images/process-folding.jpg",
      alt: "Fresh commercial towels folded for return",
      label: "Towel finishing and return"
    },
    "uniforms-chef-coats": {
      src: "assets/images/industry-uniform.jpg",
      alt: "Commercial uniforms arranged for professional cleaning and finishing",
      label: "Uniform and garment programs"
    },
    "event-linens": {
      src: "assets/images/industry-event.jpg",
      alt: "Event linens prepared for presentation and service",
      label: "Event presentation goods"
    },
    "specialty-cleaning": {
      src: "assets/images/process-washers.jpg",
      alt: "Commercial cleaning equipment used for account-specific processing",
      label: "Specialty cleaning programs"
    },
    "wholesale-support": {
      src: "assets/images/industry-wholesale.jpg",
      alt: "Wholesale laundry production and finishing support",
      label: "Wholesale production support"
    }
  };

  var industryImages = {
    hotels: { src: "assets/images/industry-hotel.jpg", alt: "Hotel room prepared with clean guest linens", label: "Hospitality linen flow" },
    "str-property-managers": { src: "assets/images/industry-str.jpg", alt: "Short-term rental bedroom prepared for a guest turnover", label: "Centralized turnover support" },
    "spa-wellness": { src: "assets/images/industry-spa.jpg", alt: "Spa treatment room prepared with clean soft goods", label: "Treatment-room soft goods" },
    "gyms-fitness": { src: "assets/images/industry-gym.jpg", alt: "Fitness studio supported by recurring towel service", label: "Towel-heavy route service" },
    "events-convention-centers": { src: "assets/images/industry-event.jpg", alt: "Event tables prepared with presentation linens", label: "Deadline-driven event care" },
    "restaurants-food-service": { src: "assets/images/hero-editorial-textiles.jpg", alt: "Commercial dining linens and uniforms prepared for service", label: "Kitchen and dining goods" },
    "uniform-accounts": { src: "assets/images/industry-uniform.jpg", alt: "Work uniforms prepared for organized commercial return", label: "Organized workwear programs" },
    "casinos-entertainment": { src: "assets/images/industry-casino.jpg", alt: "Casino and entertainment venue supported by high-volume laundry service", label: "Multi-department volume" },
    "wholesale-cleaners": { src: "assets/images/industry-wholesale.jpg", alt: "Wholesale cleaning production floor", label: "Behind-the-scenes capacity" }
  };

  var legacyHashes = {
    linen: "linens-bedding",
    towels: "towels-wellness",
    uniforms: "uniforms-chef-coats",
    event: "event-linens",
    specialty: "specialty-cleaning",
    wholesale: "wholesale-support",
    hotel: "hotels",
    str: "str-property-managers",
    spa: "spa-wellness",
    gym: "gyms-fitness",
    restaurant: "restaurants-food-service",
    casino: "casinos-entertainment"
  };

  var serviceLookup = indexById(data.services || []);
  var industryLookup = indexById(data.industries || []);
  var serviceTabs = Array.prototype.slice.call(document.querySelectorAll("[data-service-id]"));
  var industryTabs = Array.prototype.slice.call(document.querySelectorAll("[data-industry-id]"));
  var servicePanel = document.getElementById("service-atlas-panel");
  var industryPanel = document.getElementById("industry-rhythm-panel");

  function indexById(items) {
    return items.reduce(function (lookup, item) {
      lookup[item.id] = item;
      return lookup;
    }, {});
  }

  function setText(selector, value) {
    var node = document.querySelector(selector);
    if (node) node.textContent = value || "";
  }

  function renderList(selector, items, limit) {
    var list = document.querySelector(selector);
    if (!list) return;
    list.textContent = "";
    (items || []).slice(0, limit || items.length).forEach(function (item) {
      var li = document.createElement("li");
      li.textContent = item;
      list.appendChild(li);
    });
  }

  function relatedTitles(ids, lookup, limit) {
    return (ids || [])
      .map(function (id) { return lookup[id] && lookup[id].title; })
      .filter(Boolean)
      .slice(0, limit || 4)
      .join(" · ");
  }

  function quoteUrl(values) {
    var params = new URLSearchParams();
    Object.keys(values || {}).forEach(function (key) {
      params.set(key, values[key]);
    });
    params.set("source", "services");
    return "quote.html?" + params.toString();
  }

  function replaceImage(image, imageData) {
    if (!image || !imageData) return;
    image.alt = imageData.alt;
    if (image.getAttribute("src") === imageData.src) return;

    image.dataset.pendingSrc = imageData.src;
    var preload = new Image();
    preload.onload = function () {
      if (image.dataset.pendingSrc === imageData.src) {
        image.src = imageData.src;
        delete image.dataset.pendingSrc;
      }
    };
    preload.src = imageData.src;
  }

  function setActiveTab(tabs, activeId) {
    tabs.forEach(function (tab) {
      var selected = tab.dataset.serviceId === activeId || tab.dataset.industryId === activeId;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }

  function selectService(id, options) {
    var service = serviceLookup[id];
    if (!service || !servicePanel) return;

    var index = (data.services || []).findIndex(function (item) { return item.id === id; });
    var imageData = serviceImages[id];
    setActiveTab(serviceTabs, id);
    servicePanel.setAttribute("aria-labelledby", id);
    setText("[data-service-index]", "Service " + String(index + 1).padStart(2, "0") + " / " + String(data.services.length).padStart(2, "0"));
    setText("[data-service-title]", service.title);
    setText("[data-service-summary]", service.shortSummary);
    setText("[data-service-care-lead]", service.careLead);
    setText("[data-service-figure-label]", imageData ? imageData.label : service.title);
    setText("[data-service-industries]", relatedTitles(service.relatedIndustryIds, industryLookup, 4));
    renderList("[data-service-goods]", service.commonItems, 5);
    renderList("[data-service-return]", (service.finishingOptions || []).concat(service.returnFormats || []), 5);
    renderList("[data-service-care]", service.carePriorities, 3);
    replaceImage(document.querySelector("[data-service-image]"), imageData);

    var quote = document.querySelector("[data-service-quote]");
    if (quote) quote.href = quoteUrl(service.quotePrefillValues);
    if (!options || options.updateHash !== false) updateHash(id);
  }

  function selectIndustry(id, options) {
    var industry = industryLookup[id];
    if (!industry || !industryPanel) return;

    var index = (data.industries || []).findIndex(function (item) { return item.id === id; });
    var imageData = industryImages[id];
    setActiveTab(industryTabs, id);
    industryPanel.setAttribute("aria-labelledby", id);
    setText("[data-industry-number]", "Account " + String(index + 1).padStart(2, "0") + " / " + String(data.industries.length).padStart(2, "0"));
    setText("[data-industry-short-label]", imageData ? imageData.label : industry.title);
    setText("[data-industry-title]", industry.title);
    setText("[data-industry-summary]", industry.shortSummary);
    setText("[data-industry-goods]", (industry.typicalGoods || []).slice(0, 6).join(" · "));
    setText("[data-industry-services]", relatedTitles(industry.relatedServiceIds, serviceLookup, 4));
    renderList("[data-industry-needs]", (industry.operatingNeeds || []).concat(industry.commonPainPoints || []), 5);
    replaceImage(document.querySelector("[data-industry-image]"), imageData);

    var quote = document.querySelector("[data-industry-quote]");
    if (quote) {
      quote.href = quoteUrl(industry.quotePrefillValues);
      quote.textContent = "Build this program";
    }
    if (!options || options.updateHash !== false) updateHash(id);
  }

  function updateHash(id) {
    if (!window.history || !window.history.replaceState) return;
    window.history.replaceState(null, "", window.location.pathname + window.location.search + "#" + id);
  }

  function bindTabs(tabs, select, idKey) {
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        select(tab.dataset[idKey]);
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex = index;
        if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
        else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = tabs.length - 1;
        else return;

        event.preventDefault();
        tabs[nextIndex].focus();
        select(tabs[nextIndex].dataset[idKey]);
      });
    });
  }

  function applyHash() {
    var raw = window.location.hash.replace(/^#/, "");
    var id = legacyHashes[raw] || raw;
    if (serviceLookup[id]) selectService(id, { updateHash: false });
    if (industryLookup[id]) selectIndustry(id, { updateHash: false });
  }

  function preloadImages() {
    Object.keys(serviceImages).concat(Object.keys(industryImages)).forEach(function (id) {
      var item = serviceImages[id] || industryImages[id];
      if (!item) return;
      var image = new Image();
      image.src = item.src;
    });
  }

  function revealSections() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll(".service-reveal"));
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      nodes.forEach(function (node) { node.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    nodes.forEach(function (node) { observer.observe(node); });
  }

  bindTabs(serviceTabs, selectService, "serviceId");
  bindTabs(industryTabs, selectIndustry, "industryId");
  preloadImages();
  applyHash();
  revealSections();
  window.addEventListener("hashchange", applyHash);
}());
