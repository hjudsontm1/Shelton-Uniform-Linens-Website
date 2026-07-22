(function () {
  "use strict";

  const builder = document.querySelector("[data-pricing-builder]");
  const config = window.SheltonPricingBuilderConfig;
  if (!builder || !config) return;

  const state = {
    ...config.initialState,
    goods: [...config.initialState.goods],
    finishing: [...config.initialState.finishing],
    specialtyNeeds: [...config.initialState.specialtyNeeds]
  };

  const modelById = new Map(config.models.map((model) => [model.id, model]));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const compactManifest = window.matchMedia("(max-width: 760px)").matches;
  const progress = builder.querySelector("[data-pricing-progress]");
  const questionCanvas = builder.querySelector("[data-pricing-question]");
  const manifest = builder.querySelector("[data-pricing-manifest]");
  const stepCount = builder.querySelector("[data-pricing-step-count]");
  const backButton = builder.querySelector("[data-pricing-back]");
  const continueButton = builder.querySelector("[data-pricing-continue]");
  const stepView = builder.querySelector("[data-pricing-step-view]");
  const resultView = builder.querySelector("[data-pricing-result]");
  const resultFields = builder.querySelector("[data-pricing-result-fields]");
  const adjustButton = builder.querySelector("[data-pricing-adjust]");
  const announcer = builder.querySelector("[data-pricing-announcer]");
  let transitionTimer = null;

  if (compactManifest) manifest.removeAttribute("open");

  const create = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const currentStepDefinition = () => config.steps[state.currentStep - 1];

  const formatManifestValue = (field) => {
    if (field === "model") {
      return state.model ? modelById.get(state.model)?.manifestLabel || "—" : "—";
    }
    const value = state[field];
    if (Array.isArray(value)) return value.length ? value.join(", ") : "—";
    return value || "—";
  };

  const renderManifest = () => {
    if (!manifest) return;
    manifest.querySelectorAll("[data-manifest-field]").forEach((valueNode) => {
      valueNode.textContent = formatManifestValue(valueNode.dataset.manifestField);
    });
  };

  const renderProgress = () => {
    if (!progress.childElementCount) {
      config.steps.forEach((step) => {
        const item = create("li", "pricing-progress__step");
        item.dataset.progressStep = String(step.number);
        item.append(create("span", "pricing-progress__label", step.label));
        progress.append(item);
      });
    }

    progress.querySelectorAll("[data-progress-step]").forEach((item) => {
      const number = Number(item.dataset.progressStep);
      item.classList.toggle("is-complete", number < state.currentStep);
      item.classList.toggle("is-current", number === state.currentStep);
      if (number === state.currentStep) {
        item.setAttribute("aria-current", "step");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  };

  const createModelChoice = (model) => {
    const button = create("button", "pricing-model-choice");
    button.type = "button";
    button.dataset.modelId = model.id;
    button.setAttribute("aria-pressed", String(state.model === model.id));
    button.classList.toggle("is-selected", state.model === model.id);
    button.classList.toggle("pricing-model-choice--featured", model.featured);

    if (model.featured) {
      button.append(create("span", "pricing-model-choice__eyebrow", "Primary starting point"));
    }

    const stateLabel = create(
      "span",
      "pricing-model-choice__state",
      state.model === model.id ? "Selected" : "Select"
    );
    const title = create("span", "pricing-model-choice__title", model.label);
    const description = create("span", "pricing-model-choice__description", model.description);
    button.append(stateLabel, title, description);
    return button;
  };

  const createModelStep = (step) => {
    const content = create("div", "pricing-question-content pricing-question-content--model");
    const intro = create("header", "pricing-question-intro");
    intro.append(
      create("p", "pricing-question-intro__step", "Step 01"),
      create("h2", "", step.title),
      create("p", "", "Choose the account model that best matches how you want inventory handled.")
    );
    content.append(intro);

    const choices = create("div", "pricing-model-choices");
    config.models.filter((model) => !model.assistive).forEach((model) => {
      choices.append(createModelChoice(model));
    });
    content.append(choices);

    const assistive = config.models.find((model) => model.assistive);
    if (assistive) {
      const assistiveButton = create(
        "button",
        "pricing-model-assist",
        assistive.label
      );
      assistiveButton.type = "button";
      assistiveButton.dataset.modelId = assistive.id;
      assistiveButton.setAttribute("aria-pressed", String(state.model === assistive.id));
      assistiveButton.classList.toggle("is-selected", state.model === assistive.id);
      content.append(assistiveButton);
    }

    return content;
  };

  const createPlaceholderStep = (step) => {
    const content = create("div", "pricing-question-content pricing-question-content--placeholder");
    const intro = create("header", "pricing-question-intro");
    intro.append(
      create("p", "pricing-question-intro__step", `Step ${String(step.number).padStart(2, "0")}`),
      create("h2", "", step.title),
      create("p", "", config.placeholderCopy)
    );
    content.append(intro);
    const marker = create("div", "pricing-placeholder-marker");
    marker.setAttribute("aria-hidden", "true");
    marker.append(create("span"), create("span"), create("span"));
    content.append(marker);
    return content;
  };

  const createStepContent = () => {
    const step = currentStepDefinition();
    return step.kind === "model" ? createModelStep(step) : createPlaceholderStep(step);
  };

  const canContinue = () => {
    if (state.currentStep === 1) return Boolean(state.model);
    return state.currentStep < config.steps.length;
  };

  const updateControls = () => {
    backButton.disabled = state.currentStep === 1;
    continueButton.disabled = !canContinue();
    continueButton.textContent = state.currentStep === config.steps.length
      ? "Result pending"
      : "Continue →";
  };

  const announceStep = () => {
    if (!announcer) return;
    const step = currentStepDefinition();
    announcer.textContent = `Step ${step.number} of ${config.steps.length}: ${step.title}`;
  };

  const commitStepRender = (animate) => {
    questionCanvas.replaceChildren(createStepContent());
    questionCanvas.dataset.step = currentStepDefinition().id;
    if (animate && !reducedMotion) {
      questionCanvas.classList.add("is-unfolding");
      window.setTimeout(() => questionCanvas.classList.remove("is-unfolding"), 420);
    }
    renderProgress();
    renderManifest();
    updateControls();
    stepCount.textContent = `Step ${String(state.currentStep).padStart(2, "0")} / ${String(config.steps.length).padStart(2, "0")}`;
    announceStep();
  };

  const renderStep = ({ animate = true } = {}) => {
    window.clearTimeout(transitionTimer);
    if (!animate || reducedMotion || !questionCanvas.firstElementChild) {
      questionCanvas.classList.remove("is-leaving");
      commitStepRender(false);
      return;
    }

    questionCanvas.classList.add("is-leaving");
    transitionTimer = window.setTimeout(() => {
      questionCanvas.classList.remove("is-leaving");
      commitStepRender(true);
    }, 150);
  };

  const selectModel = (modelId) => {
    if (!modelById.has(modelId)) return;
    state.model = modelId;
    questionCanvas.querySelectorAll("[data-model-id]").forEach((button) => {
      const isSelected = button.dataset.modelId === modelId;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
      const stateLabel = button.querySelector(".pricing-model-choice__state");
      if (stateLabel) stateLabel.textContent = isSelected ? "Selected" : "Select";
    });
    renderManifest();
    updateControls();
    const selected = modelById.get(modelId);
    if (announcer) announcer.textContent = `${selected.label} selected.`;
  };

  const moveToStep = (nextStep) => {
    const bounded = Math.max(1, Math.min(config.steps.length, nextStep));
    if (bounded === state.currentStep) return;
    state.currentStep = bounded;
    renderStep();
  };

  const renderResultShell = () => {
    resultFields.replaceChildren();
    config.resultShell.fields.forEach((field) => {
      const row = create("div", "pricing-result__row");
      row.append(create("dt", "", field.label), create("dd", "", field.value));
      resultFields.append(row);
    });
  };

  const showResultPreview = () => {
    renderResultShell();
    stepView.hidden = true;
    resultView.hidden = false;
    builder.dataset.view = "result";
    resultView.focus();
  };

  const showStepView = () => {
    resultView.hidden = true;
    stepView.hidden = false;
    builder.dataset.view = "steps";
    renderStep({ animate: false });
    questionCanvas.focus({ preventScroll: true });
  };

  questionCanvas.addEventListener("click", (event) => {
    const modelButton = event.target.closest("[data-model-id]");
    if (modelButton) selectModel(modelButton.dataset.modelId);
  });
  questionCanvas.addEventListener("keydown", (event) => {
    const modelButton = event.target.closest("[data-model-id]");
    const isSelectionKey = event.key === "Enter" || event.key === " " || event.key === "Spacebar";
    if (!modelButton || !isSelectionKey) return;
    event.preventDefault();
    selectModel(modelButton.dataset.modelId);
  });

  backButton.addEventListener("click", () => moveToStep(state.currentStep - 1));
  continueButton.addEventListener("click", () => {
    if (!canContinue()) return;
    moveToStep(state.currentStep + 1);
  });
  adjustButton.addEventListener("click", showStepView);

  window.pricingBuilderState = state;
  window.SheltonPricingBuilder = {
    getState: () => ({
      ...state,
      goods: [...state.goods],
      finishing: [...state.finishing],
      specialtyNeeds: [...state.specialtyNeeds]
    }),
    showResultPreview
  };

  config.manifestFields.forEach((field) => {
    const value = manifest.querySelector(`[data-manifest-field="${field.key}"]`);
    if (value) value.textContent = "—";
  });

  renderStep({ animate: false });

  const params = new URLSearchParams(window.location.search);
  if (params.get("preview") === "result") showResultPreview();
}());
