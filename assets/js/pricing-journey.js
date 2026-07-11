(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-journey]");
  const config = window.SheltonPricingJourneyConfig;
  if (!root || !config) return;

  const searchParams = new URLSearchParams(window.location.search);
  const allowedConcepts = new Set(Object.keys(config.concepts));
  const requestedConcept = searchParams.get("concept");
  const concept = allowedConcepts.has(requestedConcept) ? requestedConcept : "label";
  const reducedMotion = searchParams.get("motion") === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const conceptPanels = Array.from(document.querySelectorAll("[data-concept-panel]"));
  const operationStage = document.querySelector("[data-operation-stage]");
  const operationChoices = document.querySelector("[data-operation-choices]");
  const operationSelection = document.querySelector("[data-operation-selection]");
  const operationSelectionLabel = document.querySelector("[data-operation-selection-label]");
  const announcer = document.querySelector("[data-journey-announcer]");
  const state = {
    concept,
    view: "landing",
    operation: null
  };

  root.dataset.motion = reducedMotion ? "reduce" : "standard";

  const announce = (message) => {
    if (announcer) announcer.textContent = message;
  };

  const activePanel = () => conceptPanels.find((panel) => panel.dataset.conceptPanel === state.concept);

  const renderConcept = () => {
    root.dataset.concept = state.concept;
    root.dataset.view = state.view;
    conceptPanels.forEach((panel) => {
      panel.hidden = panel.dataset.conceptPanel !== state.concept || state.view !== "landing";
    });
    document.querySelectorAll("[data-concept-link]").forEach((link) => {
      const active = link.dataset.conceptLink === state.concept;
      link.setAttribute("aria-current", active ? "page" : "false");
    });
    const number = document.querySelector("[data-concept-number]");
    if (number) number.textContent = config.concepts[state.concept].number;
  };

  const renderOperations = () => {
    if (!operationChoices || operationChoices.childElementCount) return;
    const fragment = document.createDocumentFragment();
    config.operations.forEach((operation) => {
      const button = document.createElement("button");
      const number = document.createElement("span");
      const label = document.createElement("strong");
      button.type = "button";
      button.className = "operation-choice";
      button.dataset.operationId = operation.id;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");
      button.tabIndex = operation.number === "01" ? 0 : -1;
      number.textContent = operation.number;
      label.textContent = operation.label;
      button.append(number, label);
      fragment.append(button);
    });
    operationChoices.append(fragment);
  };

  const selectOperation = (id, moveFocus = false) => {
    const operation = config.operations.find((item) => item.id === id);
    if (!operation) return;
    state.operation = id;
    operationChoices.querySelectorAll("[data-operation-id]").forEach((button) => {
      const selected = button.dataset.operationId === id;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (selected && moveFocus) button.focus();
    });
    operationSelection.hidden = false;
    operationSelectionLabel.textContent = operation.label;
    announce(`${operation.label} selected.`);
  };

  const openOperation = () => {
    const panel = activePanel();
    if (!panel || !operationStage) return;
    state.view = "transitioning";
    root.dataset.view = state.view;
    panel.classList.add("is-departing");
    const delay = reducedMotion ? 0 : 420;
    window.setTimeout(() => {
      panel.hidden = true;
      panel.classList.remove("is-departing");
      state.view = "operation";
      root.dataset.view = state.view;
      operationStage.hidden = false;
      operationStage.classList.add("is-arriving");
      const heading = operationStage.querySelector("h2");
      window.setTimeout(() => operationStage.classList.remove("is-arriving"), reducedMotion ? 0 : 560);
      heading?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      announce("Operation chapter ready. Choose the closest type of operation.");
    }, delay);
  };

  const returnToConcept = () => {
    state.view = "landing";
    root.dataset.view = state.view;
    operationStage.hidden = true;
    conceptPanels.forEach((panel) => {
      panel.hidden = panel.dataset.conceptPanel !== state.concept;
    });
    const button = activePanel()?.querySelector("[data-begin-journey]");
    button?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    announce(`${config.concepts[state.concept].label} restored.`);
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-begin-journey]")) {
      openOperation();
      return;
    }

    const choice = event.target.closest("[data-operation-id]");
    if (choice) {
      selectOperation(choice.dataset.operationId);
      return;
    }

    if (event.target.closest("[data-reset-concept]")) {
      returnToConcept();
      return;
    }

    if (event.target.closest("[data-operation-continue]")) {
      announce("Operation saved. The Goods chapter will continue in Checkpoint 2.");
    }
  });

  operationChoices?.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(operationChoices.querySelectorAll("[data-operation-id]"));
    const current = Math.max(0, buttons.indexOf(document.activeElement));
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (current + 1) % buttons.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (current - 1 + buttons.length) % buttons.length;
    event.preventDefault();
    selectOperation(buttons[next].dataset.operationId, true);
  });

  renderOperations();
  renderConcept();

  window.SheltonPricingJourney = {
    getState: () => ({ ...state }),
    openOperation,
    returnToConcept,
    selectOperation
  };
}());
