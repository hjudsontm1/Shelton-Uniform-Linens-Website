(function () {
  "use strict";

  const flow = document.querySelector("[data-pricing-flow]");
  if (!flow) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = {
    model: null,
    operation: null,
    modelComplete: false,
    operationComplete: false
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
      event: "Event Company / Venue / Convention Center",
      restaurant: "Restaurant / Food Service",
      uniform: "Uniform Account",
      wholesale: "Wholesale Cleaner",
      other: "Other",
      "not-sure": "Not Sure"
    }
  };

  const modelStep = flow.querySelector('[data-flow-step="model"]');
  const operationStep = flow.querySelector('[data-flow-step="operation"]');
  const goodsPreview = flow.querySelector("[data-goods-preview]");
  const announcer = flow.querySelector("[data-flow-announcer]");

  const setAnnouncement = (message) => {
    if (announcer) announcer.textContent = message;
  };

  const setChoice = (groupName, value) => {
    const group = flow.querySelector(`[data-choice-group="${groupName}"]`);
    if (!group || !labels[groupName]?.[value]) return;
    state[groupName] = value;
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
    collapseStep(operationStep, "operation");
    window.setTimeout(() => {
      goodsPreview.hidden = false;
      focusAndGuide(goodsPreview.querySelector("h2"));
      setAnnouncement("Operation complete. Goods chapter follows.");
    }, reducedMotion ? 0 : 410);
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

  window.SheltonPricingFlowPrototype = {
    getState: () => ({ ...state }),
    openStep
  };
}());
