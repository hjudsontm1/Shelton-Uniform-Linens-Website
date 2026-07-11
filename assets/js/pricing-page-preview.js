(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-page]");
  if (!root) return;

  const storageKey = "sheltonPricingHeroState";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const operations = [
    {
      id: "hotel",
      label: "Hotel / Boutique Stay",
      helper: "Hotels usually price around rooms, turns, presentation goods, storage, and pickup/return rhythm.",
      goods: ["Sheets", "Towels", "Robes", "Blankets", "Mixed Program"],
      visual: "Hospitality program"
    },
    {
      id: "str",
      label: "STR / Property Manager",
      helper: "STR programs often depend on centralized staging, property turns, seasonality, and clean-goods storage.",
      goods: ["Sheets", "Towels", "Duvet Covers", "Bath Mats", "Mixed Program"],
      visual: "Turnover staging"
    },
    {
      id: "spa",
      label: "Spa / Wellness",
      helper: "Spa pricing is shaped by appointments, treatment-room volume, towels, robes, feel, and compact storage.",
      goods: ["Towels", "Sheets", "Robes", "Face Cradle Covers", "Mixed Program"],
      visual: "Soft-goods care"
    },
    {
      id: "gym",
      label: "Gym / Fitness",
      helper: "Fitness programs usually center on towel volume, odor control, peak use, and consistent restocking.",
      goods: ["Towels", "Hand Towels", "Bath Mats", "Mops", "Mixed Program"],
      visual: "Towel volume"
    },
    {
      id: "event",
      label: "Event / Venue / Convention Center",
      helper: "Event linen pricing can change with presentation standards, stains, deadlines, color retention, and protection.",
      goods: ["Tablecloths", "Napkins", "Runners", "Skirting", "Mixed Program"],
      visual: "Event return"
    },
    {
      id: "restaurant",
      label: "Restaurant / Food Service",
      helper: "Restaurants combine recurring kitchen soil, dining-room presentation, staff goods, and service consistency.",
      goods: ["Chef Coats", "Aprons", "Napkins", "Table Linens", "Mixed Program"],
      visual: "Kitchen and dining"
    },
    {
      id: "casino",
      label: "Casino / Entertainment",
      helper: "Casino programs can span departments, shifts, banquets, uniforms, restaurants, and presentation goods.",
      goods: ["Uniforms", "Chef Coats", "Banquet Linens", "Towels", "Mixed Program"],
      visual: "Department sorting"
    },
    {
      id: "uniform",
      label: "Uniform Account",
      helper: "Uniform pricing is influenced by headcount, shifts, finishing, departments, and organized return.",
      goods: ["Uniform Shirts", "Chef Coats", "Workwear", "Jackets", "Mixed Program"],
      visual: "Garment return"
    },
    {
      id: "wholesale",
      label: "Wholesale Dry Cleaning",
      helper: "Wholesale support is shaped by batch volume, turnaround, finishing capacity, and specialty handling.",
      goods: ["Shirts", "Suits", "Dresses", "Specialty Garments", "Mixed Program"],
      visual: "Wholesale finishing"
    },
    {
      id: "other",
      label: "Other / Not Sure",
      helper: "Start with the closest goods. Shelton can help shape the right questions for unusual commercial programs.",
      goods: ["Towels", "Table Linens", "Uniforms", "Robes", "Mixed Program"],
      visual: "Custom program"
    }
  ];

  const factors = [
    ["Goods", "The type of item changes handling, finishing, inspection, packaging, and replacement concerns.", ["Flatwork, towels, garments, and specialty event goods move through different workflows.", "Higher presentation requirements can add finishing work."]],
    ["Volume", "Volume matters, but it is not the only pricing signal. Predictability and concentration can matter too.", ["Steady recurring work is different from spike-heavy event work.", "Known pounds or pieces improve planning accuracy."]],
    ["Soil level", "Heavy food, odor, makeup, oil, or event stains can change treatment and inspection needs.", ["Soil affects chemistry, time, rewash risk, and quality control.", "Not every pound requires the same work."]],
    ["Finishing", "Pressed, hanging, folded, bagged, bundled, or linen-cart return formats carry different labor.", ["Presentation goods often need more controlled finishing.", "Return format affects staging and route handoff."]],
    ["Sorting", "Department, property, item, or account labeling adds operational value and handling time.", ["Sorting can reduce customer staff time.", "It also changes production and packing requirements."]],
    ["Route burden", "Location, pickup points, access, timing, and delivery complexity all shape the real program.", ["A clean route is different from hard access or tight delivery windows.", "Final route feasibility requires Shelton review."]]
  ];

  const market = [
    ["Laundromat", "Self-service or basic machine access.", "Lowest-service option; usually not a managed commercial program."],
    ["Consumer Wash & Fold", "Helpful for simple personal laundry.", "May cost less, but usually lacks commercial finishing, route support, and account structure."],
    ["Shelton Commercial Program", "Route-based commercial service with quality, finishing, and program support.", "Built to compete where the customer needs more than basic wash service."],
    ["Traditional Linen Rental", "Large commercial inventory and route programs.", "Often strong for standardized recurring needs, but not always flexible around customer-owned goods."],
    ["Luxury / Highly Customized", "High-touch specialty programs.", "Appropriate for demanding boutique needs; can be above what many operations require."]
  ];

  const quality = [
    {
      id: "chef",
      label: "Chef coats",
      title: "Heavy soil treatment protects appearance and repeat-use value.",
      body: "Chef coats are not basic white laundry. Grease, heat, repeated wear, white retention, pressing, and hung-in-poly return can all change what the program requires.",
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
      body: "Towels often look simple, but volume, odor, soil, softness, bagging, bundling, and restocking pressure can shape the economics of the account.",
      points: ["Odor and soil control", "Consistent softness and presentation", "Bundled or bagged return options"]
    }
  ];

  const models = [
    {
      id: "cog",
      label: "Customer-Owned Goods",
      title: "You own the inventory. Shelton handles the commercial processing.",
      body: "This can fit operations that already have goods and want cleaning, finishing, packaging, and return without converting every item to rental.",
      points: ["Customer inventory remains customer-owned", "Quality can affect replacement pressure", "Useful for established goods programs"]
    },
    {
      id: "hybrid",
      label: "Hybrid",
      title: "Owned goods and supplied goods can work together.",
      body: "Hybrid programs can make sense when the customer owns some inventory but needs Shelton to supply selected recurring categories.",
      points: ["Keeps useful owned inventory in play", "Adds supplied support where needed", "Flexible when needs vary by item"]
    },
    {
      id: "rental",
      label: "Rental",
      title: "Shelton supplies and manages selected recurring inventory.",
      body: "Rental can fit customers who prefer not to own all goods or need a managed recurring inventory structure. Pricing reflects both inventory and service.",
      points: ["Shelton-supplied inventory", "Recurring managed structure", "Useful for predictable goods needs"]
    },
    {
      id: "recommend",
      label: "Not sure?",
      title: "The estimator can recommend a starting model.",
      body: "If the model is unclear, begin with operation and goods. Shelton can use those answers to suggest Customer-Owned Goods, Hybrid, or Rental as a planning direction.",
      points: ["No jargon required up front", "Recommendation depends on the program", "Final structure is reviewed with Shelton"]
    }
  ];

  const state = {
    operation: null,
    goods: [],
    factor: 0,
    market: 2,
    quality: 0,
    model: 0
  };

  const operationWrap = root.querySelector("[data-operation-options]");
  const goodsWrap = root.querySelector("[data-goods-options]");
  const goodsFieldset = root.querySelector("[data-goods-fieldset]");
  const helper = root.querySelector("[data-hero-helper]");
  const status = root.querySelector("[data-hero-status]");
  const submit = root.querySelector("[data-hero-submit]");
  const visualGoods = root.querySelector("[data-hero-visual-goods]");
  const visualCaption = root.querySelector("[data-hero-visual-caption]");
  const transitionGoods = root.querySelector("[data-transition-goods]");
  const estimateSummary = root.querySelector("[data-estimate-summary]");
  const estimateLink = root.querySelector("[data-estimate-link]");
  const announcer = document.querySelector("[data-pricing-announcer]");

  const announce = (message) => {
    if (announcer) announcer.textContent = message;
  };

  const slug = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const activeOperation = () => operations.find((item) => item.id === state.operation);

  const selectedGoodsLabels = () => state.goods
    .map((id) => activeOperation()?.goods.find((item) => slug(item) === id))
    .filter(Boolean);

  const saveHeroState = () => {
    const payload = {
      source: "pricing-hero",
      operation: state.operation,
      operationLabel: activeOperation()?.label || "",
      goods: state.goods,
      goodsLabels: selectedGoodsLabels(),
      timestamp: new Date().toISOString()
    };
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(payload));
    } catch (error) {
      // The URL handoff still carries non-sensitive operation/goods keys.
    }
    return payload;
  };

  const estimatorHref = () => {
    const params = new URLSearchParams();
    params.set("source", "pricing-hero");
    if (state.operation) params.set("operation", state.operation);
    if (state.goods.length) params.set("goods", state.goods.join(","));
    return `estimate-preview.html?${params.toString()}`;
  };

  const updateSummary = () => {
    const operation = activeOperation();
    const goodsLabels = selectedGoodsLabels();
    const hasState = Boolean(operation && goodsLabels.length);
    submit.disabled = !hasState;
    estimateSummary.hidden = !hasState;
    if (hasState) {
      const goodsText = goodsLabels.join(" · ");
      status.textContent = `${operation.label}: ${goodsText}`;
      estimateSummary.innerHTML = `<span>Continue with</span><strong>${operation.label}</strong><small>${goodsText}</small>`;
      transitionGoods.textContent = goodsText;
      estimateLink.textContent = "Continue My Estimate";
      estimateLink.href = estimatorHref();
    } else if (operation) {
      status.textContent = `${operation.label} selected. Choose at least one primary good.`;
      transitionGoods.textContent = operation.visual;
      estimateLink.textContent = "Launch Interactive Estimator";
      estimateLink.href = estimatorHref();
    } else {
      status.textContent = "Select an operation to reveal likely goods.";
      transitionGoods.textContent = "Program planning range";
      estimateLink.textContent = "Launch Interactive Estimator";
      estimateLink.href = "estimate-preview.html";
    }
  };

  const renderHeroVisual = () => {
    const operation = activeOperation();
    const goodsLabels = selectedGoodsLabels();
    visualGoods.replaceChildren();
    const count = Math.max(3, Math.min(5, goodsLabels.length || 4));
    Array.from({ length: count }).forEach(() => {
      const mark = document.createElement("span");
      mark.className = "hero-good-mark";
      visualGoods.append(mark);
    });
    visualCaption.textContent = goodsLabels.length
      ? `${operation.label} · ${goodsLabels.join(" · ")}`
      : operation
        ? `${operation.visual}: choose the goods to continue.`
        : "Choose an operation to shape the program.";
  };

  const renderOperations = () => {
    operationWrap.replaceChildren();
    operations.forEach((operation, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "operation-choice";
      button.dataset.operation = operation.id;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");
      button.tabIndex = index === 0 ? 0 : -1;
      button.textContent = operation.label;
      operationWrap.append(button);
    });
  };

  const renderGoods = () => {
    const operation = activeOperation();
    goodsWrap.replaceChildren();
    goodsFieldset.disabled = !operation;
    if (!operation) return;
    operation.goods.forEach((good) => {
      const id = slug(good);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "goods-choice";
      button.dataset.good = id;
      button.setAttribute("aria-pressed", String(state.goods.includes(id)));
      button.textContent = good;
      goodsWrap.append(button);
    });
  };

  const renderHero = () => {
    operationWrap.querySelectorAll("[data-operation]").forEach((button, index) => {
      const selected = button.dataset.operation === state.operation;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected || (!state.operation && index === 0) ? 0 : -1;
    });
    goodsWrap.querySelectorAll("[data-good]").forEach((button) => {
      const selected = state.goods.includes(button.dataset.good);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    helper.textContent = activeOperation()?.helper || "Choose your operation. The goods and pricing signals will adjust immediately.";
    renderHeroVisual();
    updateSummary();
  };

  const selectOperation = (id) => {
    const operation = operations.find((item) => item.id === id);
    if (!operation) return;
    state.operation = id;
    state.goods = [];
    renderGoods();
    renderHero();
    announce(`${operation.label} selected. Relevant goods are now available.`);
  };

  const toggleGood = (id) => {
    if (state.goods.includes(id)) {
      state.goods = state.goods.filter((item) => item !== id);
    } else {
      state.goods = [...state.goods, id];
    }
    renderHero();
    announce(state.goods.length ? `${selectedGoodsLabels().join(", ")} selected.` : "Goods selection cleared.");
  };

  const resetHero = () => {
    state.operation = null;
    state.goods = [];
    renderGoods();
    renderHero();
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch (error) {
      // In-memory reset is enough when storage is unavailable.
    }
    announce("Pricing hero selections cleared.");
  };

  const buildTabs = (wrap, items, activeIndex, prefix, onClick) => {
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
    wrap.querySelectorAll("[role='tab']").forEach((button) => {
      const active = Number(button.dataset.index) === activeIndex;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
  };

  const renderFactor = () => {
    const item = factors[state.factor];
    const detail = root.querySelector("[data-factor-detail]");
    root.querySelector("[data-factor-visual-label]").textContent = item[0];
    detail.innerHTML = `<h3>${item[0]}</h3><p>${item[1]}</p><ul>${item[2].map((point) => `<li>${point}</li>`).join("")}</ul>`;
    setActiveTab(root.querySelector("[data-factor-list]"), state.factor);
  };

  const renderMarket = () => {
    const item = market[state.market];
    const detail = root.querySelector("[data-market-detail]");
    detail.innerHTML = `<h3>${item[0]}</h3><p>${item[2]}</p>`;
    setActiveTab(root.querySelector("[data-market-list]"), state.market);
  };

  const renderQuality = () => {
    const item = quality[state.quality];
    const detail = root.querySelector("[data-quality-detail]");
    const object = root.querySelector("[data-quality-object]");
    object.dataset.quality = item.id;
    detail.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p><ul>${item.points.map((point) => `<li>${point}</li>`).join("")}</ul>`;
    setActiveTab(root.querySelector("[data-quality-list]"), state.quality);
  };

  const renderModel = () => {
    const item = models[state.model];
    const detail = root.querySelector("[data-model-detail]");
    const visual = root.querySelector("[data-model-visual]");
    visual.dataset.model = item.id;
    detail.innerHTML = `<h3>${item.title}</h3><p>${item.body}</p><ul>${item.points.map((point) => `<li>${point}</li>`).join("")}</ul>`;
    setActiveTab(root.querySelector("[data-model-list]"), state.model);
  };

  operationWrap.addEventListener("click", (event) => {
    const button = event.target.closest("[data-operation]");
    if (button) selectOperation(button.dataset.operation);
  });

  operationWrap.addEventListener("keydown", (event) => {
    const button = event.target.closest("[data-operation]");
    if (!button || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const choices = Array.from(operationWrap.querySelectorAll("[data-operation]"));
    let index = choices.indexOf(button);
    if (event.key === "Home") index = 0;
    if (event.key === "End") index = choices.length - 1;
    if (event.key === "ArrowRight") index = (index + 1) % choices.length;
    if (event.key === "ArrowLeft") index = (index - 1 + choices.length) % choices.length;
    event.preventDefault();
    choices[index].focus();
    selectOperation(choices[index].dataset.operation);
  });

  goodsWrap.addEventListener("click", (event) => {
    const button = event.target.closest("[data-good]");
    if (button) toggleGood(button.dataset.good);
  });

  root.querySelector("[data-hero-estimator]").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!state.operation || !state.goods.length) return;
    saveHeroState();
    window.location.href = estimatorHref();
  });

  root.querySelector("[data-hero-reset]").addEventListener("click", resetHero);
  root.querySelector("[data-final-reset]").addEventListener("click", () => {
    resetHero();
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
  });

  estimateLink.addEventListener("click", () => {
    if (state.operation || state.goods.length) saveHeroState();
  });

  renderOperations();
  renderGoods();
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
  renderHero();
  renderFactor();
  renderMarket();
  renderQuality();
  renderModel();

  window.SheltonPricingPagePreview = {
    getState: () => ({ ...state, goodsLabels: selectedGoodsLabels() })
  };
}());
