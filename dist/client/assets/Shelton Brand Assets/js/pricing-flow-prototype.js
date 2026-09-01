(function () {
  "use strict";

  const flow = document.querySelector("[data-pricing-flow]");
  if (!flow) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = {
    model: null,
    operation: null,
    modelComplete: false,
    operationComplete: false,
    heroSource: false,
    heroGoods: []
  };

  const labels = {
    model: {
      hybrid: "Hybrid Program",
      "customer-owned": "Customer-Owned Goods",
      rental: "Rental Program",
      recommend: "Recommend for Me"
    },
    operation: {
      hotel: "Hotel / Boutique Stay",
      str: "STR / Property Manager",
      spa: "Spa / Wellness",
      gym: "Gym / Fitness",
      event: "Event / Venue / Convention Center",
      restaurant: "Restaurant / Food Service",
      casino: "Casino / Entertainment",
      uniform: "Uniform Account",
      wholesale: "Wholesale Dry Cleaning",
      other: "Other / Not Sure",
      "not-sure": "Not Sure"
    }
  };

  const modelStep = flow.querySelector('[data-flow-step="model"]');
  const operationStep = flow.querySelector('[data-flow-step="operation"]');
  const goodsPreview = flow.querySelector("[data-goods-preview]");
  const heroCarryover = flow.querySelector("[data-hero-carryover]");
  const goodsCarryover = flow.querySelector("[data-goods-carryover]");
  const announcer = flow.querySelector("[data-flow-announcer]");

  const goodsLabels = {
    sheets: "Sheets",
    towels: "Towels",
    robes: "Robes",
    blankets: "Blankets",
    "mixed-program": "Mixed Program",
    "duvet-covers": "Duvet Covers",
    "bath-mats": "Bath Mats",
    "face-cradle-covers": "Face Cradle Covers",
    "hand-towels": "Hand Towels",
    mops: "Mops",
    tablecloths: "Tablecloths",
    napkins: "Napkins",
    runners: "Runners",
    skirting: "Skirting",
    "chef-coats": "Chef Coats",
    aprons: "Aprons",
    "table-linens": "Table Linens",
    uniforms: "Uniforms",
    "banquet-linens": "Banquet Linens",
    "uniform-shirts": "Uniform Shirts",
    workwear: "Workwear",
    jackets: "Jackets",
    shirts: "Shirts",
    suits: "Suits",
    dresses: "Dresses",
    "specialty-garments": "Specialty Garments"
  };

  const formatGoods = (goods) => goods
    .map((item) => goodsLabels[item] || String(item).replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()))
    .filter(Boolean);

  const readHeroState = () => {
    const params = new URLSearchParams(window.location.search);
    let stored = null;
    try {
      stored = JSON.parse(window.sessionStorage.getItem("sheltonPricingHeroState") || "null");
    } catch (error) {
      stored = null;
    }
    const operation = params.get("operation") || stored?.operation || "";
    const rawGoods = params.get("goods")
      ? params.get("goods").split(",")
      : Array.isArray(stored?.goods) ? stored.goods : [];
    if (!labels.operation[operation]) return null;
    return {
      operation,
      goods: rawGoods.map((item) => String(item).trim()).filter(Boolean),
      goodsLabels: Array.isArray(stored?.goodsLabels) && stored.goodsLabels.length ? stored.goodsLabels : formatGoods(rawGoods)
    };
  };

  const setAnnouncement = (message) => {
    if (announcer) announcer.textContent = message;
  };

  const setChoice = (groupName, value) => {
    const group = flow.querySelector(`[data-choice-group="${groupName}"]`);
    if (!group || !labels[groupName]?.[value]) return;
    const changedOperation = groupName === "operation" && state.operation && state.operation !== value;
    state[groupName] = value;
    if (changedOperation) {
      state.heroSource = false;
      state.heroGoods = [];
      renderHeroCarryover();
      renderGoodsCarryover();
    }
    group.querySelectorAll("[data-choice-value]").forEach((button) => {
      const selected = button.dataset.choiceValue === value;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
      const choiceState = button.querySelector(".pflow-choice-state");
      if (choiceState) choiceState.textContent = selected ? "Selected" : "Select";
      const operationState = button.querySelector("em");
      if (operationState) operationState.textContent = selected ? "Selected" : "Select";
    });
    const continueButton = flow.querySelector(`[data-continue="${groupName}"]`);
    if (continueButton) continueButton.disabled = false;
    setAnnouncement(`${labels[groupName][value]} selected.`);
  };

  const renderHeroCarryover = () => {
    if (!heroCarryover) return;
    if (!state.heroSource || !state.operation) {
      heroCarryover.hidden = true;
      heroCarryover.replaceChildren();
      return;
    }
    heroCarryover.hidden = false;
    heroCarryover.innerHTML = `
      <span>Carried from Pricing page</span>
      <strong>${labels.operation[state.operation]}</strong>
      <small>${state.heroGoods.length ? state.heroGoods.join(" · ") : "Goods can be adjusted in the next step."}</small>
    `;
  };

  const renderGoodsCarryover = () => {
    if (!goodsCarryover) return;
    if (!state.heroGoods.length) {
      goodsCarryover.hidden = true;
      goodsCarryover.replaceChildren();
      const heading = goodsPreview?.querySelector("h2");
      if (heading) heading.textContent = "Continue with your goods.";
      return;
    }
    goodsCarryover.hidden = false;
    goodsCarryover.innerHTML = `
      <span>Already selected</span>
      <strong>${state.heroGoods.join(" · ")}</strong>
      <small>You can refine volume, finish, and ownership next.</small>
    `;
    const heading = goodsPreview?.querySelector("h2");
    if (heading) heading.textContent = "Continue from the goods you selected.";
  };

  const syncOperationSummary = () => {
    if (!operationStep || !state.operation) return;
    const active = operationStep.querySelector("[data-step-active]");
    const summary = operationStep.querySelector("[data-step-summary]");
    const summaryValue = operationStep.querySelector('[data-summary-value="operation"]');
    const continueButton = flow.querySelector('[data-continue="operation"]');
    operationStep.hidden = false;
    operationStep.dataset.state = state.operationComplete ? "complete" : "active";
    operationStep.classList.toggle("is-active", !state.operationComplete);
    if (active) active.hidden = state.operationComplete;
    if (summary) summary.hidden = !state.operationComplete;
    if (summaryValue) summaryValue.textContent = labels.operation[state.operation];
    if (continueButton) continueButton.disabled = false;
    flow.querySelectorAll('[data-choice-group="operation"] [data-choice-value]').forEach((button) => {
      const selected = button.dataset.choiceValue === state.operation;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
      const operationState = button.querySelector("em");
      if (operationState) operationState.textContent = selected ? "Selected" : "Select";
    });
  };

  const focusAndGuide = (heading) => {
    if (!heading) return;
    const behavior = reducedMotion ? "auto" : "smooth";
    window.setTimeout(() => {
      heading.scrollIntoView({ behavior, block: "start" });
      heading.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 80);
  };

  const revealStep = (step) => {
    if (!step) return;
    step.hidden = false;
    step.dataset.state = "active";
    step.classList.add("is-active", "is-revealing");
    window.setTimeout(() => step.classList.remove("is-revealing"), reducedMotion ? 0 : 560);
  };

  const collapseStep = (step, type) => {
    if (!step || !state[type]) return;
    const active = step.querySelector("[data-step-active]");
    const summary = step.querySelector("[data-step-summary]");
    const summaryValue = step.querySelector(`[data-summary-value="${type}"]`);
    if (summaryValue) summaryValue.textContent = labels[type][state[type]];
    step.classList.add("is-condensing");
    step.dataset.state = "condensing";

    window.setTimeout(() => {
      if (active) active.hidden = true;
      if (summary) summary.hidden = false;
      step.classList.remove("is-active", "is-condensing");
      step.dataset.state = "complete";
    }, reducedMotion ? 0 : 380);
  };

  const openStep = (type) => {
    const step = type === "model" ? modelStep : operationStep;
    const otherStep = type === "model" ? operationStep : modelStep;
    if (!step) return;

    const active = step.querySelector("[data-step-active]");
    const summary = step.querySelector("[data-step-summary]");
    if (summary) summary.hidden = true;
    if (active) active.hidden = false;
    step.hidden = false;
    step.dataset.state = "active";
    step.classList.add("is-active");
    step.classList.remove("is-condensing");

    if (otherStep && otherStep.dataset.state === "active") {
      const otherType = type === "model" ? "operation" : "model";
      const otherActive = otherStep.querySelector("[data-step-active]");
      const otherSummary = otherStep.querySelector("[data-step-summary]");
      if (state[`${otherType}Complete`]) {
        if (otherActive) otherActive.hidden = true;
        if (otherSummary) otherSummary.hidden = false;
        otherStep.dataset.state = "complete";
      } else if (type === "model") {
        otherStep.hidden = true;
        otherStep.dataset.state = "locked";
      }
      otherStep.classList.remove("is-active");
    }

    goodsPreview.hidden = true;
    focusAndGuide(step.querySelector("h2"));
  };

  const completeModel = () => {
    if (!state.model) return;
    state.modelComplete = true;
    collapseStep(modelStep, "model");
    window.setTimeout(() => {
      if (state.operationComplete) {
        const operationActive = operationStep.querySelector("[data-step-active]");
        const operationSummary = operationStep.querySelector("[data-step-summary]");
        operationStep.hidden = false;
        operationStep.dataset.state = "complete";
        operationStep.classList.remove("is-active", "is-revealing", "is-condensing");
        if (operationActive) operationActive.hidden = true;
        if (operationSummary) operationSummary.hidden = false;
        goodsPreview.hidden = false;
        focusAndGuide(goodsPreview.querySelector("h2"));
        setAnnouncement("Model updated. Your completed operation was preserved.");
      } else {
        revealStep(operationStep);
        focusAndGuide(operationStep.querySelector("h2"));
        setAnnouncement("Model complete. Operation chapter ready.");
      }
    }, reducedMotion ? 0 : 410);
  };

  const completeOperation = () => {
    if (!state.operation) return;
    state.operationComplete = true;
    state.heroSource = false;
    collapseStep(operationStep, "operation");
    window.setTimeout(() => {
      goodsPreview.hidden = false;
      renderGoodsCarryover();
      focusAndGuide(goodsPreview.querySelector("h2"));
      setAnnouncement("Operation complete. Goods chapter follows.");
    }, reducedMotion ? 0 : 410);
  };

  const applyHeroState = () => {
    const heroState = readHeroState();
    if (!heroState) return;
    state.operation = heroState.operation;
    state.operationComplete = true;
    state.heroSource = true;
    state.heroGoods = heroState.goodsLabels;
    syncOperationSummary();
    renderHeroCarryover();
    renderGoodsCarryover();
    setAnnouncement(`${labels.operation[state.operation]} carried from the Pricing page.`);
  };

  flow.addEventListener("click", (event) => {
    const choice = event.target.closest("[data-choice-value]");
    if (choice) {
      const group = choice.closest("[data-choice-group]");
      if (group) setChoice(group.dataset.choiceGroup, choice.dataset.choiceValue);
      return;
    }

    const continueButton = event.target.closest("[data-continue]");
    if (continueButton && !continueButton.disabled) {
      if (continueButton.dataset.continue === "model") completeModel();
      if (continueButton.dataset.continue === "operation") completeOperation();
      return;
    }

    const editButton = event.target.closest("[data-edit-step]");
    if (editButton) {
      openStep(editButton.dataset.editStep);
      return;
    }

    const backButton = event.target.closest("[data-back-to]");
    if (backButton) openStep(backButton.dataset.backTo);
  });

  flow.addEventListener("keydown", (event) => {
    const choice = event.target.closest('[role="radio"][data-choice-value]');
    if (!choice || !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    const group = choice.closest("[data-choice-group]");
    if (!group) return;
    const choices = Array.from(group.querySelectorAll('[role="radio"][data-choice-value]'));
    const currentIndex = choices.indexOf(choice);
    let nextIndex = currentIndex;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = choices.length - 1;
    if (["ArrowRight", "ArrowDown"].includes(event.key)) nextIndex = (currentIndex + 1) % choices.length;
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) nextIndex = (currentIndex - 1 + choices.length) % choices.length;
    event.preventDefault();
    choices[nextIndex].focus();
    setChoice(group.dataset.choiceGroup, choices[nextIndex].dataset.choiceValue);
  });

  flow.querySelectorAll("[data-choice-group]").forEach((group) => {
    group.querySelectorAll('[role="radio"][data-choice-value]').forEach((button, index) => {
      button.tabIndex = index === 0 ? 0 : -1;
    });
  });

  applyHeroState();

  window.SheltonPricingFlowPrototype = {
    getState: () => ({ ...state }),
    openStep
  };
}());
