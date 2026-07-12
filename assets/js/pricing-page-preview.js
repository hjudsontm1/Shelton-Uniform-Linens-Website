(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-page]");
  if (!root) return;

  const factors = [
    ["Goods", "The type of item changes handling, finishing, inspection, packaging, and replacement concerns.", ["Flatwork, towels, garments, and specialty event goods move through different workflows.", "Higher presentation requirements can add finishing work.", "Fragile, costly, or branded goods need more careful account controls."]],
    ["Volume", "Volume matters, but predictability and concentration matter too.", ["Steady recurring work is different from spike-heavy event work.", "Known pounds or pieces make planning clearer.", "Concentrated volume is easier to handle than scattered exceptions."]],
    ["Soil level", "Heavy food, odor, makeup, oil, or event stains can change treatment and inspection needs.", ["Soil affects chemistry, time, rewash risk, and quality control.", "Not every pound requires the same work.", "High-soil accounts can need different sorting and pre-treatment discipline."]],
    ["Finishing", "Pressed, hanging, folded, bagged, bundled, or linen-cart return formats carry different labor.", ["Presentation goods often need more controlled finishing.", "Return format affects staging and route handoff.", "The account should reflect how goods need to look when staff receive them."]],
    ["Sorting", "Department, property, item, or account labeling adds operational value and handling time.", ["Sorting can reduce customer staff time.", "It also changes production and packing requirements.", "More account-specific separation can be worth it when it prevents confusion on site."]],
    ["Route burden", "Location, pickup points, access, timing, and delivery complexity all shape the work.", ["A clean route is different from hard access or tight delivery windows.", "Final feasibility requires Shelton review.", "Dock access, parking, stairs, and staging expectations can change the real service cost."]]
  ];

  const market = [
    ["Laundromat", "Self-service or basic machine access.", "Lowest-service option; usually not built for recurring commercial accounts.", ["No account structure", "No route accountability", "Customer handles the operational burden"]],
    ["Consumer Wash & Fold", "Helpful for simple personal laundry.", "May cost less, but usually lacks commercial finishing, route support, and account structure.", ["Useful for simple personal laundry", "Limited commercial controls", "Usually not built around recurring account standards"]],
    ["Shelton Commercial", "Route-based service with quality, finishing, and account support.", "Built for customers who need more than basic wash service.", ["Commercial route support", "Fit-based scope", "Quality and finishing included in the comparison"]],
    ["Traditional Linen Rental", "Large recurring inventory and route structure.", "Often strong for standardized needs, but not always flexible around customer-owned goods.", ["Strong recurring inventory structure", "Less flexible when owned goods matter", "Can be a larger-provider fit for standardized accounts"]],
    ["Luxury / Highly Customized", "High-touch specialty service.", "Appropriate for demanding boutique needs; can be above what many operations require.", ["Specialty handling", "High-touch expectations", "Often above the practical need for many accounts"]]
  ];

  const quality = [
    {
      id: "chef",
      label: "Chef coats",
      title: "Heavy soil treatment protects appearance and repeat-use value.",
      body: "Chef coats are not basic white laundry. Grease, heat, repeated wear, white retention, pressing, and hung-in-poly return can all change what the account requires.",
      points: ["Stain and heavy-soil treatment", "White retention and pressing", "Professional presentation on return"]
    },
    {
      id: "linen",
      label: "Sheets and linens",
      title: "Presentation quality affects both guest experience and replacement pressure.",
      body: "Sheets and hospitality linens need a consistent look and feel. Better processing can help reduce premature discard pressure, even when final replacement outcomes depend on use and inventory.",
      points: ["Feel and presentation", "White retention and finishing", "Less staff time spent sorting rejects"]
    },
    {
      id: "event",
      label: "Event linens",
      title: "Customer-owned event inventory can be expensive to replace.",
      body: "Tablecloths, runners, napkins, and specialty goods may need stain treatment, color awareness, pressing, folding, hanging, or protection after high-stakes events.",
      points: ["Color and stain awareness", "Specialty mold concerns where relevant", "Protection for valuable inventory"]
    },
    {
      id: "towel",
      label: "Towels",
      title: "Repeated-use towels need consistency, odor control, and practical return.",
      body: "Towels often look simple, but volume, odor, soil, softness, bagging, bundling, and restocking pressure can change the account.",
      points: ["Odor and soil control", "Consistent softness and presentation", "Bundled or bagged return options"]
    }
  ];

  const models = [
    {
      id: "cog",
      label: "Customer-Owned Goods",
      title: "You own the inventory. Shelton handles the commercial processing.",
      body: "This can fit operations that already have goods and want cleaning, finishing, packaging, and return without converting every item to rental.",
      points: ["Customer inventory remains customer-owned", "Quality can affect replacement pressure", "Useful for established inventories"]
    },
    {
      id: "hybrid",
      label: "Hybrid",
      title: "Owned goods and supplied goods can work together.",
      body: "Hybrid can make sense when the customer owns some inventory but needs Shelton to supply selected recurring categories.",
      points: ["Keeps useful owned inventory in play", "Adds supplied support where needed", "Flexible when needs vary by item"]
    },
    {
      id: "rental",
      label: "Rental",
      title: "Shelton supplies and manages selected recurring inventory.",
      body: "Rental can fit customers who prefer not to own all goods or need a managed recurring inventory structure. The scope reflects both inventory and service.",
      points: ["Shelton-supplied inventory", "Recurring managed structure", "Useful for predictable goods needs"]
    },
    {
      id: "recommend",
      label: "Not sure?",
      title: "The estimator can recommend a starting model.",
      body: "If the model is unclear, begin with operation and goods. Shelton can use those answers to suggest Customer-Owned Goods, Hybrid, or Rental as a planning direction.",
      points: ["No jargon required up front", "Recommendation depends on the account", "Final structure is reviewed with Shelton"]
    }
  ];

  const state = {
    factor: 0,
    market: 2,
    quality: 0,
    model: 0
  };

  const doc = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const updateScrollProgress = () => {
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / max));
    doc.style.setProperty("--pricing-scroll-progress", progress.toFixed(4));
  };

  const updatePointerWash = (event) => {
    if (reducedMotion) return;
    const x = `${Math.round((event.clientX / window.innerWidth) * 100)}%`;
    const y = `${Math.round((event.clientY / window.innerHeight) * 100)}%`;
    doc.style.setProperty("--pricing-pointer-x", x);
    doc.style.setProperty("--pricing-pointer-y", y);
  };

  const observeSections = () => {
    const sections = Array.from(root.querySelectorAll("section"));
    if (!("IntersectionObserver" in window)) {
      sections.forEach((section) => section.classList.add("is-in-view"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-in-view", entry.isIntersecting);
      });
    }, { rootMargin: "-18% 0px -36%", threshold: 0.08 });
    sections.forEach((section) => observer.observe(section));
  };

  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  root.addEventListener("pointermove", updatePointerWash, { passive: true });
  updateScrollProgress();
  observeSections();

  const buildTabs = (wrap, items, activeIndex, prefix, onClick) => {
    if (!wrap) return;
    wrap.replaceChildren();
    items.forEach((item, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `${prefix}-tab`;
      button.dataset.index = String(index);
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(index === activeIndex));
      button.classList.toggle("is-active", index === activeIndex);

      const number = document.createElement("span");
      const label = document.createElement("strong");
      number.textContent = String(index + 1).padStart(2, "0");
      label.textContent = Array.isArray(item) ? item[0] : item.label;
      button.append(number, label);

      if (prefix === "market") {
        const small = document.createElement("small");
        small.textContent = item[1];
        button.append(small);
      }

      button.addEventListener("click", () => onClick(index));
      wrap.append(button);
    });
  };

  const setActiveTab = (wrap, activeIndex) => {
    if (!wrap) return;
    wrap.querySelectorAll("[role='tab']").forEach((button) => {
      const active = Number(button.dataset.index) === activeIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
  };

  const renderList = (points) => points.map((point) => `<li>${point}</li>`).join("");

  const renderFactor = () => {
    const item = factors[state.factor];
    const detail = root.querySelector("[data-factor-detail]");
    const label = root.querySelector("[data-factor-visual-label]");
    if (label) label.textContent = item[0];
    if (detail) detail.innerHTML = `<h3>${item[0]}</h3><p>${item[1]}</p><ul>${renderList(item[2])}</ul>`;
    setActiveTab(root.querySelector("[data-factor-list]"), state.factor);
  };

  const renderMarket = () => {
    const item = market[state.market];
    const detail = root.querySelector("[data-market-detail]");
    if (detail) detail.innerHTML = `<h3>${item[0]}</h3><p>${item[2]}</p><ul>${renderList(item[3] || [])}</ul>`;
    setActiveTab(root.querySelector("[data-market-list]"), state.market);
  };

  const renderQuality = () => {
    const item = quality[state.quality];
    const detail = root.querySelector("[data-quality-detail]");
    const object = root.querySelector("[data-quality-object]");
    if (object) object.dataset.quality = item.id;
    if (detail) detail.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p><ul>${renderList(item.points)}</ul>`;
    setActiveTab(root.querySelector("[data-quality-list]"), state.quality);
  };

  const renderModel = () => {
    const item = models[state.model];
    const detail = root.querySelector("[data-model-detail]");
    const visual = root.querySelector("[data-model-visual]");
    if (visual) visual.dataset.model = item.id;
    if (detail) detail.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p><ul>${renderList(item.points)}</ul>`;
    setActiveTab(root.querySelector("[data-model-list]"), state.model);
  };

  buildTabs(root.querySelector("[data-factor-list]"), factors, state.factor, "factor", (index) => {
    state.factor = index;
    renderFactor();
  });
  buildTabs(root.querySelector("[data-market-list]"), market, state.market, "market", (index) => {
    state.market = index;
    renderMarket();
  });
  buildTabs(root.querySelector("[data-quality-list]"), quality, state.quality, "quality", (index) => {
    state.quality = index;
    renderQuality();
  });
  buildTabs(root.querySelector("[data-model-list]"), models, state.model, "model", (index) => {
    state.model = index;
    renderModel();
  });

  renderFactor();
  renderMarket();
  renderQuality();
  renderModel();

  window.SheltonPricingPagePreview = {
    getState: () => ({ ...state })
  };
}());
