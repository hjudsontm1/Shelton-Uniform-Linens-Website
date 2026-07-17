(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const data = window.SheltonProgramsData || { services: [], industries: [] };
  const services = new Map((data.services || []).map((service) => [service.id, service]));
  const industries = new Map((data.industries || []).map((industry) => [industry.id, industry]));
  const tabs = Array.from(document.querySelectorAll("[data-service-id]"));
  const panel = document.querySelector("#service-atlas-panel");

  if (!tabs.length || !panel || !services.size) return;

  const output = {
    index: panel.querySelector("[data-service-index]"),
    title: panel.querySelector("[data-service-title]"),
    summary: panel.querySelector("[data-service-summary]"),
    care: panel.querySelector("[data-service-care-rows]"),
    goods: panel.querySelector("[data-service-goods]"),
    industries: panel.querySelector("[data-service-industries]"),
    quote: panel.querySelector("[data-service-quote]")
  };

  const careDetails = {
    "linens-bedding": [
      ["sparkle", "Soil and stain treatment", "Soil, fabric, color, and repeated use shape treatment before linens and bedding reach finishing."],
      ["layers", "Presentation finishing", "Sheets and table linen can return pressed or consistently folded for a presentation-ready result."],
      ["droplet", "Color retention", "Colored table linens can follow a care plan that considers fabric, stain history, and repeated cleaning."],
      ["shield", "Customer-owned inventory", "When the goods are yours, cleaning and finishing decisions support presentation, usable life, and replacement pressure."],
      ["package", "Cart-ready or labeled return", "Goods can be folded, bundled, labeled, or staged around the way the account stores and distributes them."]
    ],
    "towels-wellness": [
      ["droplet", "Soil and odor treatment", "Repeated-use towels need processing built around body oils, moisture, odor, and commercial turnover."],
      ["layers", "Presentation finishing", "Towels, sheets, and robes can return consistently folded, bundled, or prepared for the way staff restocks them."],
      ["sparkle", "Color and fabric care", "Colored towels, robes, and treatment goods can follow a care plan shaped by material, use, and appearance standards."],
      ["shield", "Customer-owned inventory", "For goods the account already owns, care and handling can be planned around usable life and replacement pressure."],
      ["package", "Account-ready return", "Return format is chosen for treatment rooms, locker areas, towel stations, and storage constraints."]
    ],
    "uniforms-chef-coats": [
      ["sparkle", "Stain and heavy-soil treatment", "Chef wear and workwear are treated with food, grease, soil pattern, fabric, and repeated wear in mind."],
      ["hanger", "Presentation finishing", "Pressing and finishing support a consistent staff presentation across recurring service."],
      ["droplet", "Color and fabric care", "Uniform color, trim, construction, and repeated commercial use help shape the care plan."],
      ["shield", "Customer-owned inventory", "When the uniforms belong to the account, care decisions can support appearance and usable life over repeated wear."],
      ["package", "Organized garment return", "Garments can return on hangers, in poly, or organized by department, location, or account preference."]
    ],
    "event-linens": [
      ["droplet", "Lower-pH cleaning to help limit color loss", "For colored event linens, a lower-pH wash approach can help limit color loss across repeated cleaning."],
      ["sparkle", "Difficult spot treatment", "Food, beverage, wax, makeup, and post-event soil are reviewed against fabric and presentation needs."],
      ["shield", "Specialty mold treatment", "Affected colored or stored goods can be reviewed for an account-specific treatment path before replacement."],
      ["hanger", "Presentation finishing", "Tablecloths, runners, napkins, and specialty goods can return pressed, folded, or hung."],
      ["package", "Customer-owned inventory", "Event companies and venues can keep the inventory they own while Shelton cleans, finishes, sorts, and returns it for the next production."]
    ],
    "specialty-cleaning": [
      ["sparkle", "Soil and stain context", "Unique soil and difficult spots are reviewed against material, condition, intended use, and presentation needs."],
      ["hanger", "Presentation finishing", "Specialty pieces can return pressed, hung, folded, or packaged according to how the account uses them."],
      ["droplet", "Color retention", "Colored and specialty goods can follow a care plan shaped by fabric, stain history, and repeated cleaning."],
      ["shield", "Specialty mold treatment", "Mold-affected goods can be reviewed for a deliberate treatment path before replacement becomes the only option."],
      ["package", "Customer-owned inventory", "Account-owned specialty pieces can be cleaned, finished, and returned around their use and replacement pressure."]
    ],
    "wholesale-support": [
      ["sparkle", "Soil and stain support", "Wholesale work can be scoped around soil, stain, fabric, and the partner's established quality standard."],
      ["hanger", "Presentation finishing", "Pressing, folding, and packaging can extend a partner's production capacity without changing the customer-facing relationship."],
      ["droplet", "Color and specialty care", "Colored, specialty, or presentation-sensitive batches can be separated into an appropriate care path."],
      ["layers", "Customer-owned production capacity", "Overflow and recurring production can be planned around goods already owned by the partner or its customers."],
      ["package", "Batch and account separation", "Finished work can return organized to the specifications established for each wholesale account."]
    ]
  };

  const icons = {
    droplet: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.8S6 9.5 6 14a6 6 0 0 0 12 0c0-4.5-6-11.2-6-11.2Z"/><path d="M9 15.2c.4 1.4 1.4 2.2 3 2.5"/></svg>',
    sparkle: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 1.2 4.1L17 9l-3.8 1.9L12 15l-1.2-4.1L7 9l3.8-1.9L12 3Z"/><path d="m18.5 14 .7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7.7-2.3Z"/><path d="m5 3 .5 1.5L7 5l-1.5.5L5 7l-.5-1.5L3 5l1.5-.5L5 3Z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 5 6v5c0 4.6 2.7 8 7 10 4.3-2 7-5.4 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    hanger: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 6.5a2 2 0 1 1 2.8 1.8L12 9v1"/><path d="m3 18 9-7 9 7H3Z"/></svg>',
    package: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 7 8-4 8 4v10l-8 4-8-4V7Z"/><path d="m4 7 8 4 8-4M12 11v10M8 5l8 4"/></svg>',
    layers: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/></svg>'
  };

  function renderList(target, values) {
    if (!target) return;
    target.replaceChildren();
    values.forEach((value) => {
      const item = document.createElement("li");
      item.textContent = value;
      target.appendChild(item);
    });
  }

  function renderCareRows(serviceId) {
    if (!output.care) return;
    output.care.replaceChildren();

    (careDetails[serviceId] || []).forEach(([icon, label, body], index) => {
      const details = document.createElement("details");
      details.className = "service-care-row";
      details.open = index === 0;

      const summary = document.createElement("summary");
      summary.innerHTML = '<span class="service-care-row__icon">' + icons[icon] + '</span><span class="service-care-row__label"></span><span class="service-care-row__toggle" aria-hidden="true"></span>';
      summary.querySelector(".service-care-row__label").textContent = label;

      const content = document.createElement("div");
      content.className = "service-care-row__body";
      const paragraph = document.createElement("p");
      paragraph.textContent = body;
      content.appendChild(paragraph);

      details.append(summary, content);
      details.addEventListener("toggle", () => {
        if (!details.open) return;
        output.care.querySelectorAll("details[open]").forEach((row) => {
          if (row !== details) row.open = false;
        });
      });
      output.care.appendChild(details);
    });
  }

  function quoteUrl(service) {
    const target = (data.quotePrefill && data.quotePrefill.target) || "quote.html";
    const params = new URLSearchParams(service.quotePrefillValues || {});
    params.set("source", "services");
    return target + "?" + params.toString();
  }

  function setActiveService(serviceId, options) {
    const service = services.get(serviceId);
    const activeTab = tabs.find((tab) => tab.dataset.serviceId === serviceId);
    if (!service || !activeTab) return;

    tabs.forEach((tab) => {
      const active = tab === activeTab;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    panel.setAttribute("aria-labelledby", activeTab.id);
    const position = tabs.indexOf(activeTab) + 1;
    if (output.index) output.index.textContent = "Service " + String(position).padStart(2, "0") + " / " + String(tabs.length).padStart(2, "0");
    if (output.title) output.title.textContent = service.title;
    if (output.summary) output.summary.textContent = service.shortSummary;

    renderCareRows(serviceId);
    renderList(output.goods, service.commonItems || []);
    renderList(output.industries, (service.relatedIndustryIds || []).map((id) => industries.get(id)).filter(Boolean).map((industry) => industry.title));
    if (output.quote) output.quote.href = quoteUrl(service);

    if (!options || options.updateHistory !== false) {
      window.history.replaceState(null, "", "#" + serviceId);
    }
  }

  tabs.forEach((tab, tabIndex) => {
    tab.addEventListener("click", () => setActiveService(tab.dataset.serviceId));
    tab.addEventListener("keydown", (event) => {
      let nextIndex = tabIndex;
      if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (tabIndex + 1) % tabs.length;
      if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (tabIndex - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      if (nextIndex === tabIndex && !["Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const nextTab = tabs[nextIndex];
      setActiveService(nextTab.dataset.serviceId);
      nextTab.focus();
    });
  });

  const aliases = {
    linen: "linens-bedding",
    towels: "towels-wellness",
    uniforms: "uniforms-chef-coats",
    event: "event-linens",
    wholesale: "wholesale-support"
  };
  const requested = window.location.hash.slice(1);
  const initial = services.has(requested) ? requested : aliases[requested] || tabs[0].dataset.serviceId;
  setActiveService(initial, { updateHistory: Boolean(requested) });

  const reveals = document.querySelectorAll(".service-reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    reveals.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    reveals.forEach((item) => observer.observe(item));
  }
})();
