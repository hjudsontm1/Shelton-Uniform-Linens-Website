(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-journey]");
  const config = window.SheltonPricingJourneyConfig;
  const vectors = window.SheltonPricingJourneyVectors;
  const pricingEngine = window.SheltonPricingDevelopmentRules;
  if (!root || !config || !vectors || !pricingEngine) return;

  const searchParams = new URLSearchParams(window.location.search);
  const quoteMode = searchParams.get("quote") === "fail" ? "fail" : "ready";
  const reducedMotion = searchParams.get("motion") === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const concept = "orb";
  const inlineMode = root.hasAttribute("data-inline-pricing-estimator");
  const storageKey = inlineMode ? `${config.storageKey}-inline` : config.storageKey;

  const conceptPanels = Array.from(document.querySelectorAll("[data-concept-panel]"));
  const flow = document.querySelector("[data-journey-flow]");
  const operationChoices = document.querySelector("[data-operation-choices]");
  const operationSelection = document.querySelector("[data-operation-selection]");
  const operationSelectionLabel = document.querySelector("[data-operation-selection-label]");
  const operationStage = document.querySelector("[data-operation-stage]");
  const goodsChoices = document.querySelector("[data-goods-choices]");
  const goodsScene = document.querySelector("[data-goods-scene]");
  const goodsEducation = document.querySelector("[data-goods-education] p");
  const goodsCapabilities = document.querySelector("[data-goods-capabilities]");
  const goodsError = document.querySelector("[data-goods-error]");
  const goodsCount = document.querySelector("[data-goods-count]");
  const scaleForm = document.querySelector("[data-scale-form]");
  const scaleFields = document.querySelector("[data-scale-fields]");
  const scaleScene = document.querySelector("[data-scale-scene]");
  const scaleError = document.querySelector("[data-scale-error]");
  const finishOptions = document.querySelector("[data-finish-options]");
  const specialtyOptions = document.querySelector("[data-specialty-options]");
  const specialtyFieldset = document.querySelector("[data-specialty-fieldset]");
  const finishScene = document.querySelector("[data-finish-scene]");
  const finishError = document.querySelector("[data-finish-error]");
  const ownershipOptions = document.querySelector("[data-ownership-options]");
  const ownershipError = document.querySelector("[data-ownership-error]");
  const locationForm = document.querySelector("[data-location-form]");
  const locationInput = document.querySelector("[data-location-input]");
  const locationError = document.querySelector("[data-location-error]");
  const programSummary = document.querySelector("[data-program-summary]");
  const programSummaryCount = document.querySelector("[data-program-summary-count]");
  const programSummaryList = document.querySelector("[data-program-summary-list]");
  const reviewScene = document.querySelector("[data-review-scene]");
  const reviewSelections = document.querySelector("[data-review-selections]");
  const resultSection = document.querySelector("[data-result]");
  const resultScene = document.querySelector("[data-result-scene]");
  const modelComparison = document.querySelector("[data-model-comparison]");
  const resultFactors = document.querySelector("[data-result-factors]");
  const quoteHandoff = document.querySelector("[data-quote-handoff]");
  const quoteForm = document.querySelector("[data-quote-form]");
  const quoteError = document.querySelector("[data-quote-error]");
  const quoteStatus = document.querySelector("[data-quote-status]");
  const quoteSubmit = document.querySelector("[data-quote-submit]");
  const quotePayloadWrap = document.querySelector("[data-quote-payload-wrap]");
  const quotePayload = document.querySelector("[data-quote-payload]");
  const announcer = document.querySelector("[data-journey-announcer]");

  const createInitialState = () => ({
    version: config.version,
    concept,
    view: "landing",
    activeChapter: "landing",
    completedChapters: [],
    operation: null,
    goods: [],
    focusedGood: null,
    scale: {},
    finish: [],
    specialtyNeeds: [],
    ownership: null,
    location: { type: null, value: "" },
    recommendation: null,
    contact: {},
    quoteStatus: "idle",
    quotePayload: null,
    developmentMode: true
  });

  const restoreState = () => {
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(storageKey));
      if (!stored || stored.version !== config.version) return createInitialState();
      const restored = { ...createInitialState(), ...stored, concept };
      if (!config.operations.some((item) => item.id === restored.operation)) {
        restored.operation = null;
        restored.goods = [];
        restored.completedChapters = [];
        restored.activeChapter = "operation";
      }
      if (restored.operation) {
        const allowedGoods = new Set(config.operations.find((item) => item.id === restored.operation).goods);
        restored.goods = restored.goods.filter((id) => allowedGoods.has(id));
      }
      return restored;
    } catch (error) {
      return createInitialState();
    }
  };

  let state = restoreState();
  root.dataset.motion = reducedMotion ? "reduce" : "standard";

  const announce = (message) => {
    if (announcer) announcer.textContent = message;
  };

  const activePanel = () => conceptPanels.find((panel) => panel.dataset.conceptPanel === state.concept);
  const activeOperation = () => config.operations.find((item) => item.id === state.operation);
  const isComplete = (chapter) => state.completedChapters.includes(chapter);

  const invalidateFrom = (chapter) => {
    const start = config.chapterOrder.indexOf(chapter);
    if (start < 0) return;
    config.chapterOrder.slice(start).forEach((item) => setComplete(item, false));
    if (start <= config.chapterOrder.indexOf("review")) {
      state.recommendation = null;
      state.quoteStatus = "idle";
      state.quotePayload = null;
    }
  };

  const setComplete = (chapter, complete = true) => {
    const chapters = new Set(state.completedChapters);
    if (complete) chapters.add(chapter);
    else chapters.delete(chapter);
    state.completedChapters = config.chapterOrder.filter((item) => chapters.has(item));
  };

  const saveState = () => {
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      // The journey remains fully usable when storage is unavailable.
    }
  };

  const renderConcept = () => {
    root.dataset.concept = state.concept;
    root.dataset.view = state.view;
    conceptPanels.forEach((panel) => {
      panel.hidden = panel.dataset.conceptPanel !== state.concept || state.view !== "landing";
    });
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

  const updateRailAffordance = (rail) => {
    if (!rail) return;
    const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
    rail.classList.toggle("has-overflow", maxScroll > 2);
    rail.classList.toggle("is-at-start", rail.scrollLeft <= 2);
    rail.classList.toggle("is-at-end", rail.scrollLeft >= maxScroll - 2);
  };

  const scheduleRailAffordance = (rail) => {
    if (!rail) return;
    window.requestAnimationFrame(() => updateRailAffordance(rail));
  };

  const renderOperationState = () => {
    const operation = activeOperation();
    operationChoices?.querySelectorAll("[data-operation-id]").forEach((button, index) => {
      const selected = button.dataset.operationId === state.operation;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected || (!state.operation && index === 0) ? 0 : -1;
    });
    if (operationSelection) operationSelection.hidden = !operation;
    if (operationSelectionLabel) operationSelectionLabel.textContent = operation?.label || "";
    document.querySelector("[data-operation-summary-label]").textContent = operation?.label || "";

    const editor = document.querySelector('[data-chapter-editor="operation"]');
    const summary = document.querySelector('[data-chapter-summary="operation"]');
    const editing = state.activeChapter === "operation" || !isComplete("operation");
    editor.hidden = !editing;
    summary.hidden = editing || !operation;
    if (editing && operation && operationStage) {
      const sceneGoods = operation.goods.slice(0, Math.min(4, operation.goods.length));
      vectors.renderScene(operationStage, {
        operation,
        goodsIds: sceneGoods,
        selectedIds: sceneGoods,
        selectedOnly: true,
        catalog: config.goods
      });
    } else if (operationStage) {
      operationStage.replaceChildren();
    }
  };

  const buildGoodsChoices = () => {
    const operation = activeOperation();
    if (!goodsChoices || !operation) return;
    if (goodsChoices.dataset.operation === operation.id) return;
    goodsChoices.replaceChildren();
    goodsChoices.dataset.operation = operation.id;
    const fragment = document.createDocumentFragment();
    operation.goods.forEach((id, index) => {
      const item = config.goods[id];
      const button = document.createElement("button");
      const number = document.createElement("span");
      const text = document.createElement("span");
      const label = document.createElement("strong");
      const detail = document.createElement("small");
      button.type = "button";
      button.className = "goods-choice";
      button.dataset.goodId = id;
      button.setAttribute("role", "checkbox");
      button.setAttribute("aria-checked", "false");
      number.className = "goods-choice__number";
      number.textContent = String(index + 1).padStart(2, "0");
      label.textContent = item.label;
      detail.textContent = item.short;
      text.append(label, detail);
      button.append(number, text);
      fragment.append(button);
    });
    goodsChoices.append(fragment);
  };

  const renderGoodsState = () => {
    const operation = activeOperation();
    const chapter = document.querySelector('[data-chapter="goods"]');
    chapter.hidden = !isComplete("operation") || !operation;
    if (chapter.hidden) return;

    buildGoodsChoices();
    scheduleRailAffordance(goodsChoices);
    goodsChoices.querySelectorAll("[data-good-id]").forEach((button) => {
      const selected = state.goods.includes(button.dataset.goodId);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });

    const focused = config.goods[state.focusedGood] || config.goods[state.goods[state.goods.length - 1]];
    goodsEducation.textContent = focused?.education || operation.context;
    goodsCapabilities.replaceChildren();
    (focused?.details || []).slice(0, 3).forEach((detail) => {
      const item = document.createElement("li");
      item.textContent = detail;
      goodsCapabilities.append(item);
    });
    vectors.renderScene(goodsScene, {
      operation,
      goodsIds: operation.goods,
      selectedIds: state.goods,
      selectedOnly: false,
      catalog: config.goods
    });
    goodsCount.textContent = String(state.goods.length);
    goodsError.hidden = true;

    const labels = state.goods.map((id) => config.goods[id].label);
    document.querySelector("[data-goods-summary-label]").textContent = labels.join(" · ");
    const editor = document.querySelector('[data-chapter-editor="goods"]');
    const summary = document.querySelector('[data-chapter-summary="goods"]');
    const editing = state.activeChapter === "goods" || !isComplete("goods");
    editor.hidden = !editing;
    summary.hidden = editing || !state.goods.length;
    if (!editing) goodsScene.replaceChildren();
  };

  const scaleValueLabel = (field, value) => {
    if (value === undefined || value === null || value === "") return "";
    if (field.type === "select") return field.options.find((item) => item.value === value)?.label || value;
    return `${value} ${field.unit || ""}`.trim();
  };

  const buildScaleFields = () => {
    const operation = activeOperation();
    const schema = config.scaleSchemas[operation?.id] || [];
    if (!operation || scaleFields.dataset.operation === operation.id) return schema;
    scaleFields.replaceChildren();
    scaleFields.dataset.operation = operation.id;

    schema.forEach((field) => {
      const label = document.createElement("label");
      const heading = document.createElement("span");
      const controlWrap = document.createElement("span");
      const hint = document.createElement("small");
      const id = `scale-${operation.id}-${field.id}`;
      label.className = "adaptive-field";
      heading.textContent = `${field.label}${field.required ? "" : " (optional)"}`;
      controlWrap.className = "adaptive-field__control";
      hint.id = `${id}-hint`;
      hint.textContent = field.hint;

      let control;
      if (field.type === "select") {
        control = document.createElement("select");
        const empty = document.createElement("option");
        empty.value = "";
        empty.textContent = "Choose one";
        control.append(empty);
        field.options.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.value;
          option.textContent = item.label;
          control.append(option);
        });
      } else {
        control = document.createElement("input");
        control.type = "number";
        control.inputMode = "numeric";
        control.min = String(field.min);
        control.max = String(field.max);
        control.step = String(field.step || 1);
        const decrement = document.createElement("button");
        const increment = document.createElement("button");
        decrement.type = "button";
        increment.type = "button";
        decrement.className = "scale-stepper scale-stepper--decrement";
        increment.className = "scale-stepper scale-stepper--increment";
        decrement.dataset.scaleStepper = "decrement";
        increment.dataset.scaleStepper = "increment";
        decrement.dataset.scaleTarget = field.id;
        increment.dataset.scaleTarget = field.id;
        decrement.setAttribute("aria-label", `Decrease ${field.label}`);
        increment.setAttribute("aria-label", `Increase ${field.label}`);
        decrement.textContent = "−";
        increment.textContent = "+";
        controlWrap.append(decrement, control);
        if (field.unit) {
          const unit = document.createElement("em");
          unit.textContent = field.unit;
          controlWrap.append(unit);
        }
        controlWrap.append(increment);
      }

      if (!controlWrap.contains(control)) controlWrap.append(control);
      control.id = id;
      control.name = field.id;
      control.dataset.scaleInput = field.id;
      control.required = field.required;
      control.setAttribute("aria-label", field.label);
      control.setAttribute("aria-describedby", `${hint.id} scale-error`);
      control.setAttribute("aria-errormessage", "scale-error");
      control.value = state.scale[field.id] ?? "";
      label.append(heading, controlWrap, hint);
      scaleFields.append(label);
    });
    return schema;
  };

  const renderScaleState = () => {
    const operation = activeOperation();
    const chapter = document.querySelector('[data-chapter="scale"]');
    chapter.hidden = !isComplete("goods") || !operation;
    if (chapter.hidden) return;

    const schema = buildScaleFields();
    const editor = document.querySelector('[data-chapter-editor="scale"]');
    const summary = document.querySelector('[data-chapter-summary="scale"]');
    const editing = state.activeChapter === "scale" || !isComplete("scale");
    editor.hidden = !editing;
    summary.hidden = editing;
    scaleError.hidden = true;

    const summaryParts = schema
      .map((field) => scaleValueLabel(field, state.scale[field.id]))
      .filter(Boolean)
      .slice(0, 3);
    document.querySelector("[data-scale-summary-label]").textContent = summaryParts.join(" · ");

    if (editing) {
      vectors.renderScene(scaleScene, {
        operation,
        goodsIds: state.goods,
        selectedIds: state.goods,
        selectedOnly: true,
        catalog: config.goods
      });
    } else {
      scaleScene.replaceChildren();
    }
  };

  const compatibleOptions = (items) => {
    const operation = activeOperation();
    return items.filter((item) => {
      const operationMatch = !item.operations || item.operations.includes(operation.id);
      const goodsMatch = item.goods.some((id) => state.goods.includes(id));
      return operationMatch && goodsMatch;
    });
  };

  const buildAdaptiveChoices = (container, items, type) => {
    const signature = `${state.operation}:${state.goods.join(",")}`;
    if (container.dataset.signature === signature) return;
    container.replaceChildren();
    container.dataset.signature = signature;
    items.forEach((item, index) => {
      const button = document.createElement("button");
      const number = document.createElement("span");
      const copy = document.createElement("span");
      const label = document.createElement("strong");
      const detail = document.createElement("small");
      button.type = "button";
      button.className = "adaptive-choice";
      button.dataset.choiceType = type;
      button.dataset.choiceId = item.id;
      button.setAttribute("role", "checkbox");
      button.setAttribute("aria-checked", "false");
      number.textContent = String(index + 1).padStart(2, "0");
      label.textContent = item.label;
      detail.textContent = item.description;
      copy.append(label, detail);
      button.append(number, copy);
      container.append(button);
    });
  };

  const renderFinishState = () => {
    const operation = activeOperation();
    const chapter = document.querySelector('[data-chapter="finish"]');
    chapter.hidden = !isComplete("scale") || !operation;
    if (chapter.hidden) return;

    const compatibleFinish = compatibleOptions(config.finishOptions);
    const compatibleSpecialty = compatibleOptions(config.specialtyOptions);
    state.finish = state.finish.filter((id) => compatibleFinish.some((item) => item.id === id));
    state.specialtyNeeds = state.specialtyNeeds.filter((id) => compatibleSpecialty.some((item) => item.id === id));
    buildAdaptiveChoices(finishOptions, compatibleFinish, "finish");
    buildAdaptiveChoices(specialtyOptions, compatibleSpecialty, "specialty");
    scheduleRailAffordance(finishOptions);
    scheduleRailAffordance(specialtyOptions);
    specialtyFieldset.hidden = compatibleSpecialty.length === 0;

    document.querySelectorAll('[data-choice-type="finish"]').forEach((button) => {
      const selected = state.finish.includes(button.dataset.choiceId);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });
    document.querySelectorAll('[data-choice-type="specialty"]').forEach((button) => {
      const selected = state.specialtyNeeds.includes(button.dataset.choiceId);
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
    });

    const editor = document.querySelector('[data-chapter-editor="finish"]');
    const summary = document.querySelector('[data-chapter-summary="finish"]');
    const editing = state.activeChapter === "finish" || !isComplete("finish");
    editor.hidden = !editing;
    summary.hidden = editing;
    finishError.hidden = true;

    const labels = [
      ...state.finish.map((id) => config.finishOptions.find((item) => item.id === id)?.label),
      ...state.specialtyNeeds.map((id) => config.specialtyOptions.find((item) => item.id === id)?.label)
    ].filter(Boolean);
    document.querySelector("[data-finish-summary-label]").textContent = labels.join(" · ");

    if (editing) {
      vectors.renderScene(finishScene, {
        operation,
        goodsIds: state.goods,
        selectedIds: state.goods,
        selectedOnly: true,
        returnOptions: state.finish,
        catalog: config.goods
      });
    } else {
      finishScene.replaceChildren();
    }
  };

  const buildOwnershipChoices = () => {
    if (ownershipOptions.childElementCount) return;
    config.ownershipChoices.forEach((item, index) => {
      const button = document.createElement("button");
      const number = document.createElement("span");
      const copy = document.createElement("span");
      const label = document.createElement("strong");
      const model = document.createElement("em");
      const detail = document.createElement("small");
      button.type = "button";
      button.className = "ownership-choice";
      button.dataset.ownershipId = item.id;
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");
      button.tabIndex = index === 0 ? 0 : -1;
      number.textContent = String(index + 1).padStart(2, "0");
      label.textContent = item.label;
      model.textContent = item.model;
      detail.textContent = item.description;
      copy.append(label, model, detail);
      button.append(number, copy);
      ownershipOptions.append(button);
    });
  };

  const renderOwnershipState = () => {
    const chapter = document.querySelector('[data-chapter="ownership"]');
    chapter.hidden = !isComplete("finish");
    if (chapter.hidden) return;
    buildOwnershipChoices();

    ownershipOptions.querySelectorAll("[data-ownership-id]").forEach((button, index) => {
      const selected = button.dataset.ownershipId === state.ownership;
      button.classList.toggle("is-selected", selected);
      button.setAttribute("aria-checked", String(selected));
      button.tabIndex = selected || (!state.ownership && index === 0) ? 0 : -1;
    });
    const choice = config.ownershipChoices.find((item) => item.id === state.ownership);
    document.querySelector("[data-ownership-summary-label]").textContent = choice?.label || "";
    ownershipError.hidden = true;
    const editor = document.querySelector('[data-chapter-editor="ownership"]');
    const summary = document.querySelector('[data-chapter-summary="ownership"]');
    const editing = state.activeChapter === "ownership" || !isComplete("ownership");
    editor.hidden = !editing;
    summary.hidden = editing || !choice;
  };

  const renderLocationState = () => {
    const chapter = document.querySelector('[data-chapter="location"]');
    chapter.hidden = !isComplete("ownership");
    if (chapter.hidden) return;
    const editor = document.querySelector('[data-chapter-editor="location"]');
    const summary = document.querySelector('[data-chapter-summary="location"]');
    const editing = state.activeChapter === "location" || !isComplete("location");
    editor.hidden = !editing;
    summary.hidden = editing || !state.location.value;
    locationInput.value = state.location.value || "";
    locationError.hidden = true;
    document.querySelector("[data-location-summary-label]").textContent = state.location.value || "";
  };

  const finishLabels = () => [
    ...state.finish.map((id) => config.finishOptions.find((item) => item.id === id)?.label),
    ...state.specialtyNeeds.map((id) => config.specialtyOptions.find((item) => item.id === id)?.label)
  ].filter(Boolean);

  const reviewRows = () => {
    const operation = activeOperation();
    const ownership = config.ownershipChoices.find((item) => item.id === state.ownership);
    return [
      { chapter: "operation", number: "01", label: "Operation", value: operation?.label || "" },
      { chapter: "goods", number: "02", label: "Goods", value: state.goods.map((id) => config.goods[id].label).join(" · ") },
      { chapter: "scale", number: "03", label: "Operating signals", value: document.querySelector("[data-scale-summary-label]").textContent },
      { chapter: "finish", number: "04", label: "Finish and care", value: finishLabels().join(" · ") },
      { chapter: "ownership", number: "05", label: "Inventory ownership", value: ownership?.label || "" },
      { chapter: "location", number: "06", label: "Location", value: state.location.value }
    ];
  };

  const buildReviewSelections = () => {
    reviewSelections.replaceChildren();
    reviewRows().forEach((item) => {
      const article = document.createElement("article");
      const number = document.createElement("span");
      const copy = document.createElement("div");
      const label = document.createElement("small");
      const value = document.createElement("strong");
      const edit = document.createElement("button");
      number.textContent = item.number;
      label.textContent = item.label;
      value.textContent = item.value;
      edit.type = "button";
      edit.dataset.editChapter = item.chapter;
      edit.textContent = "Edit";
      edit.setAttribute("aria-label", `Edit ${item.label}`);
      copy.append(label, value);
      article.append(number, copy, edit);
      reviewSelections.append(article);
    });
  };

  const renderReviewState = () => {
    const operation = activeOperation();
    const chapter = document.querySelector('[data-chapter="review"]');
    chapter.hidden = !isComplete("location") || !operation || ["result", "handoff"].includes(state.activeChapter);
    if (chapter.hidden) return;
    const editor = document.querySelector('[data-chapter-editor="review"]');
    const summary = document.querySelector('[data-chapter-summary="review"]');
    const editing = state.activeChapter === "review" || !isComplete("review");
    editor.hidden = !editing;
    summary.hidden = editing;
    document.querySelector("[data-review-summary-label]").textContent = `${operation.label} · ${state.goods.length} ${state.goods.length === 1 ? "good" : "goods"}`;
    if (editing) {
      buildReviewSelections();
      vectors.renderScene(reviewScene, {
        operation,
        goodsIds: state.goods,
        selectedIds: state.goods,
        selectedOnly: true,
        returnOptions: state.finish,
        catalog: config.goods
      });
    } else {
      reviewScene.replaceChildren();
    }
  };

  const formatMoney = (value) => `$${Number(value).toLocaleString("en-US")}`;

  const buildModelComparison = (recommendation) => {
    modelComparison.replaceChildren();
    recommendation.comparisons.forEach((item) => {
      const article = document.createElement("article");
      const marker = document.createElement("span");
      const title = document.createElement("h4");
      const range = document.createElement("strong");
      const detail = document.createElement("p");
      marker.textContent = item.recommended ? "Recommended" : "Compare";
      title.textContent = item.label;
      range.textContent = `${formatMoney(item.weeklyLow)}-${formatMoney(item.weeklyHigh)} / week`;
      detail.textContent = {
        cog: "Service is planned around inventory the customer already owns.",
        hybrid: "Owned goods and selected supplied inventory are planned together.",
        rental: "The planning range includes a development inventory-supply factor."
      }[item.id];
      article.classList.toggle("is-recommended", item.recommended);
      article.dataset.modelId = item.id;
      article.append(marker, title, range, detail);
      modelComparison.append(article);
    });
  };

  const renderResultState = () => {
    const recommendation = state.recommendation;
    const visible = isComplete("review") && recommendation && ["result", "handoff"].includes(state.activeChapter);
    resultSection.hidden = !visible;
    if (!visible) {
      resultScene.replaceChildren();
      return;
    }
    document.querySelector("[data-result-warning]").textContent = recommendation.warning;
    document.querySelector("[data-result-positioning]").textContent = recommendation.positioning;
    document.querySelector("[data-result-weekly]").textContent = `${formatMoney(recommendation.range.weeklyLow)}-${formatMoney(recommendation.range.weeklyHigh)}`;
    document.querySelector("[data-result-monthly]").textContent = `${formatMoney(recommendation.range.monthlyLow)}-${formatMoney(recommendation.range.monthlyHigh)} projected per month`;
    document.querySelector("[data-result-rhythm]").textContent = recommendation.rhythm.label;
    document.querySelector("[data-result-rhythm-reason]").textContent = recommendation.rhythm.reason;
    document.querySelector("[data-result-model]").textContent = recommendation.model.label;
    document.querySelector("[data-result-model-reason]").textContent = recommendation.model.reason;
    document.querySelector("[data-result-confidence]").textContent = recommendation.confidence.level;
    document.querySelector("[data-result-confidence-copy]").textContent = recommendation.confidence.explanation;
    resultFactors.replaceChildren();
    recommendation.factors.forEach((factor) => {
      const item = document.createElement("li");
      item.textContent = factor;
      resultFactors.append(item);
    });
    buildModelComparison(recommendation);
    vectors.renderScene(resultScene, {
      operation: activeOperation(),
      goodsIds: state.goods,
      selectedIds: state.goods,
      selectedOnly: true,
      returnOptions: state.finish,
      catalog: config.goods
    });
  };

  const buildQuotePayload = () => ({
    preview: true,
    endpointIntegrated: false,
    journeyVersion: config.version,
    pricingRulesVersion: state.recommendation?.rulesVersion || null,
    operation: state.operation,
    operationLabel: activeOperation()?.label || "",
    goods: [...state.goods],
    scale: { ...state.scale },
    finish: [...state.finish],
    specialtyNeeds: [...state.specialtyNeeds],
    ownership: state.ownership,
    location: { ...state.location },
    recommendation: state.recommendation ? {
      rhythm: state.recommendation.rhythm.label,
      model: state.recommendation.model.id,
      weeklyRange: [state.recommendation.range.weeklyLow, state.recommendation.range.weeklyHigh]
    } : null,
    contact: { ...state.contact }
  });

  const renderQuoteState = () => {
    const visible = state.activeChapter === "handoff" && isComplete("review");
    quoteHandoff.hidden = !visible;
    if (!visible) return;
    Object.entries(state.contact).forEach(([name, value]) => {
      const input = quoteForm.elements.namedItem(name);
      if (input && input.value !== value) input.value = value;
    });
    quoteSubmit.disabled = state.quoteStatus === "loading";
    quoteSubmit.firstChild.textContent = state.quoteStatus === "loading" ? "Preparing payload " : "Prepare quote payload ";
    quoteError.hidden = true;
    quoteStatus.hidden = state.quoteStatus === "idle";
    quoteStatus.dataset.status = state.quoteStatus;
    quoteStatus.textContent = {
      loading: "Preparing the development payload. No network request is being made.",
      failure: "The development handoff could not be prepared. Your program and contact details remain available; try again when ready.",
      ready: "Quote payload ready for endpoint integration. Nothing has been submitted."
    }[state.quoteStatus] || "";
    quotePayloadWrap.hidden = state.quoteStatus !== "ready" || !state.quotePayload;
    quotePayload.textContent = state.quotePayload ? JSON.stringify(state.quotePayload, null, 2) : "";
  };

  const renderThread = () => {
    document.querySelectorAll("[data-thread-step]").forEach((item) => {
      const chapter = item.dataset.threadStep;
      const current = state.activeChapter === chapter;
      item.classList.toggle("is-current", current);
      item.classList.toggle("is-complete", isComplete(chapter));
      if (current) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
  };

  const addSummaryItem = (term, description) => {
    const wrapper = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = term;
    dd.textContent = description;
    wrapper.append(dt, dd);
    programSummaryList.append(wrapper);
  };

  const renderProgramSummary = () => {
    const operation = activeOperation();
    const count = [
      Boolean(operation),
      Boolean(state.goods.length),
      isComplete("scale"),
      isComplete("finish"),
      isComplete("ownership"),
      isComplete("location")
    ].filter(Boolean).length;
    programSummary.hidden = count === 0 || state.view !== "flow" || ["result", "handoff"].includes(state.activeChapter);
    programSummaryCount.textContent = String(count);
    programSummaryList.replaceChildren();
    if (operation) addSummaryItem("Operation", operation.label);
    if (state.goods.length) addSummaryItem("Goods", state.goods.map((id) => config.goods[id].label).join(" · "));
    if (isComplete("scale")) addSummaryItem("Scale", document.querySelector("[data-scale-summary-label]").textContent);
    if (isComplete("finish")) addSummaryItem("Finish", state.finish.map((id) => config.finishOptions.find((item) => item.id === id)?.label).filter(Boolean).join(" · "));
    if (isComplete("ownership")) addSummaryItem("Ownership", config.ownershipChoices.find((item) => item.id === state.ownership)?.label || "");
    if (isComplete("location")) addSummaryItem("Location", state.location.value);
  };

  const renderFlow = () => {
    if (flow) flow.hidden = state.view !== "flow";
    if (state.view !== "flow") {
      programSummary.hidden = true;
      return;
    }
    renderOperationState();
    renderGoodsState();
    renderScaleState();
    renderFinishState();
    renderOwnershipState();
    renderLocationState();
    renderReviewState();
    renderResultState();
    renderQuoteState();
    if (["result", "handoff"].includes(state.activeChapter)) {
      document.querySelectorAll("[data-chapter]").forEach((chapter) => {
        chapter.hidden = true;
      });
    }
    renderThread();
    renderProgramSummary();
  };

  const render = () => {
    renderConcept();
    renderFlow();
    saveState();
  };

  const focusChapter = (chapter) => {
    const target = chapter === "result"
      ? resultSection
      : chapter === "handoff"
        ? quoteHandoff
        : document.querySelector(`[data-chapter="${chapter}"]`);
    if (!target) return;
    const heading = target.matches("[data-result], [data-quote-handoff]")
      ? target.querySelector("h2")
      : target.querySelector('[data-chapter-editor]:not([hidden]) h2[tabindex="-1"]');
    const positionChapter = () => {
      heading?.focus({ preventScroll: true });
      window.requestAnimationFrame(() => {
        const headerHeight = document.querySelector(".journey-private-bar, .site-nav")?.getBoundingClientRect().height || 0;
        const threadHeight = document.querySelector(".program-thread")?.getBoundingClientRect().height || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - threadHeight - 20;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: reducedMotion ? "auto" : "smooth" });
      });
    };
    window.setTimeout(positionChapter, reducedMotion ? 0 : 40);
  };

  const centerRailChoice = (rail, choice) => {
    if (!rail || !choice) return;
    const left = choice.offsetLeft - ((rail.clientWidth - choice.offsetWidth) / 2);
    rail.scrollTo({
      left: Math.max(0, left),
      behavior: reducedMotion ? "auto" : "smooth"
    });
  };

  const openOperation = () => {
    const panel = activePanel();
    if (!panel || !flow) return;
    root.dataset.view = "transitioning";
    panel.classList.add("is-departing");
    window.setTimeout(() => {
      panel.classList.remove("is-departing");
      state.view = "flow";
      state.activeChapter = "operation";
      render();
      const initialOperation = root.dataset.initialOperation;
      if (initialOperation && config.operations.some((item) => item.id === initialOperation)) {
        selectOperation(initialOperation);
      }
      focusChapter("operation");
      announce("Operation chapter ready. Choose the closest type of operation.");
    }, reducedMotion ? 0 : 420);
  };

  const selectOperation = (id, moveFocus = false) => {
    const operation = config.operations.find((item) => item.id === id);
    if (!operation) return;
    const previous = state.operation;
    const removed = previous && previous !== id
      ? state.goods.filter((goodId) => !operation.goods.includes(goodId))
      : [];

    if (previous && previous !== id) {
      state.goods = state.goods.filter((goodId) => operation.goods.includes(goodId));
      state.focusedGood = state.goods.includes(state.focusedGood) ? state.focusedGood : null;
      invalidateFrom("goods");
      state.scale = {};
      state.finish = [];
      state.specialtyNeeds = [];
      state.ownership = null;
      state.location = { type: null, value: "" };
      goodsChoices.dataset.operation = "";
      scaleFields.dataset.operation = "";
      finishOptions.dataset.signature = "";
      specialtyOptions.dataset.signature = "";
    }

    state.operation = id;
    render();
    const selectedButton = operationChoices.querySelector(`[data-operation-id="${id}"]`);
    if (moveFocus) selectedButton?.focus();
    centerRailChoice(operationChoices, selectedButton);

    const message = removed.length
      ? `${operation.label} selected. ${removed.length} incompatible goods removed; compatible goods were preserved.`
      : `${operation.label} selected.`;
    announce(message);
  };

  const completeOperation = () => {
    if (!state.operation) {
      announce("Choose an operation before continuing.");
      operationChoices.querySelector('[tabindex="0"]')?.focus();
      return;
    }
    setComplete("operation");
    state.activeChapter = "goods";
    render();
    focusChapter("goods");
    announce(`Operation saved as ${activeOperation().label}. Goods chapter ready.`);
  };

  const toggleGood = (id) => {
    const operation = activeOperation();
    if (!operation?.goods.includes(id)) return;
    if (state.goods.includes(id)) {
      state.goods = state.goods.filter((item) => item !== id);
      if (state.focusedGood === id) state.focusedGood = state.goods[state.goods.length - 1] || null;
    } else {
      state.goods = [...state.goods, id];
      state.focusedGood = id;
    }
    invalidateFrom("goods");
    render();
    announce(`${config.goods[id].label} ${state.goods.includes(id) ? "selected" : "removed"}. ${state.goods.length} goods selected.`);
  };

  const completeGoods = () => {
    if (!state.goods.length) {
      goodsError.hidden = false;
      goodsChoices.querySelector("button")?.focus();
      announce("Select at least one good to continue.");
      return;
    }
    setComplete("goods");
    invalidateFrom("scale");
    state.activeChapter = "scale";
    render();
    focusChapter("scale");
    announce("Goods saved. Scale and operating-rhythm inputs are ready.");
  };

  const validateScale = () => {
    const schema = config.scaleSchemas[state.operation] || [];
    let valid = true;
    schema.forEach((field) => {
      const control = scaleFields.querySelector(`[data-scale-input="${field.id}"]`);
      const value = state.scale[field.id];
      let fieldValid = !field.required || (value !== undefined && value !== null && value !== "");
      if (fieldValid && field.type === "number" && value !== "" && value !== undefined) {
        const numeric = Number(value);
        fieldValid = Number.isFinite(numeric) && numeric >= field.min && numeric <= field.max;
      }
      control?.setAttribute("aria-invalid", String(!fieldValid));
      control?.closest(".adaptive-field")?.classList.toggle("has-error", !fieldValid);
      if (!fieldValid) valid = false;
    });
    scaleError.hidden = valid;
    return valid;
  };

  const completeScale = () => {
    if (!validateScale()) {
      scaleFields.querySelector('[aria-invalid="true"]')?.focus();
      announce("Complete the required operating details before continuing.");
      return;
    }
    setComplete("scale");
    invalidateFrom("finish");
    state.activeChapter = "finish";
    render();
    focusChapter("finish");
    announce("Operating details saved. Finish and return options are ready.");
  };

  const toggleAdaptiveChoice = (type, id) => {
    const key = type === "finish" ? "finish" : "specialtyNeeds";
    const current = new Set(state[key]);
    if (current.has(id)) current.delete(id);
    else current.add(id);
    state[key] = [...current];
    invalidateFrom("finish");
    render();
    const source = type === "finish" ? config.finishOptions : config.specialtyOptions;
    const label = source.find((item) => item.id === id)?.label || id;
    announce(`${label} ${current.has(id) ? "selected" : "removed"}.`);
  };

  const completeFinish = () => {
    if (!state.finish.length) {
      finishError.hidden = false;
      finishOptions.querySelector("button")?.focus();
      announce("Select at least one finish or return state.");
      return;
    }
    setComplete("finish");
    invalidateFrom("ownership");
    state.activeChapter = "ownership";
    render();
    focusChapter("ownership");
    announce("Finish and return details saved. Inventory ownership is ready.");
  };

  const selectOwnership = (id, moveFocus = false) => {
    const choice = config.ownershipChoices.find((item) => item.id === id);
    if (!choice) return;
    state.ownership = id;
    invalidateFrom("ownership");
    render();
    if (moveFocus) ownershipOptions.querySelector(`[data-ownership-id="${id}"]`)?.focus();
    announce(`${choice.label} selected.`);
  };

  const completeOwnership = () => {
    if (!state.ownership) {
      ownershipError.hidden = false;
      ownershipOptions.querySelector('[tabindex="0"]')?.focus();
      announce("Choose the closest ownership situation before continuing.");
      return;
    }
    setComplete("ownership");
    invalidateFrom("location");
    state.activeChapter = "location";
    render();
    focusChapter("location");
    announce("Ownership saved. Location is ready.");
  };

  const completeLocation = () => {
    const value = state.location.value.trim();
    const isZip = /^\d{5}$/.test(value);
    const isCity = /^[A-Za-z][A-Za-z .'-]{1,79}$/.test(value);
    const valid = isZip || isCity;
    locationInput.setAttribute("aria-invalid", String(!valid));
    locationError.hidden = valid;
    if (!valid) {
      locationInput.focus();
      announce("Enter a five-digit ZIP code or a city name.");
      return;
    }
    state.location = { type: isZip ? "zip" : "city", value };
    setComplete("location");
    state.activeChapter = "review";
    render();
    focusChapter("review");
    announce("Location saved. Your program inputs are ready to review.");
  };

  const completeReview = () => {
    state.recommendation = pricingEngine.calculatePlanningRange(state, pricingEngine.pricingRules);
    setComplete("review");
    state.activeChapter = "result";
    state.quoteStatus = "idle";
    state.quotePayload = null;
    render();
    focusChapter("result");
    announce(`Development recommendation ready. ${state.recommendation.rhythm.label}; ${state.recommendation.model.label}.`);
  };

  const openQuoteHandoff = () => {
    state.activeChapter = "handoff";
    state.quoteStatus = "idle";
    render();
    focusChapter("handoff");
    announce("Exact-quote handoff ready. Add only the missing contact details.");
  };

  const returnToResult = () => {
    state.activeChapter = "result";
    render();
    focusChapter("result");
    announce("Returned to the development result.");
  };

  const validateQuoteContact = () => {
    let valid = true;
    Array.from(quoteForm.elements).forEach((control) => {
      if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) return;
      const radioValid = control.type !== "radio" || Boolean(quoteForm.elements.namedItem(control.name)?.value);
      const controlValid = (!control.required || control.value.trim() !== "") && radioValid;
      const emailValid = control.type !== "email" || control.value === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(control.value);
      const finalValid = controlValid && emailValid;
      control.setAttribute("aria-invalid", String(!finalValid));
      if (!finalValid) valid = false;
    });
    quoteError.hidden = valid;
    return valid;
  };

  const prepareQuotePayload = () => {
    if (!validateQuoteContact()) {
      quoteForm.querySelector('[aria-invalid="true"]')?.focus();
      announce("Complete the required contact details before preparing the payload.");
      return;
    }
    state.quoteStatus = "loading";
    state.quotePayload = null;
    render();
    announce("Preparing the development payload. No network request is being made.");
    window.setTimeout(() => {
      if (quoteMode === "fail") {
        state.quoteStatus = "failure";
        render();
        announce("The development payload could not be prepared. Your answers remain available.");
        return;
      }
      state.quotePayload = buildQuotePayload();
      state.quoteStatus = "ready";
      render();
      quoteStatus.focus?.({ preventScroll: true });
      announce("Quote payload ready for endpoint integration. Nothing has been submitted.");
    }, reducedMotion ? 80 : 650);
  };

  const editChapter = (chapter) => {
    if (!config.chapterOrder.includes(chapter)) return;
    invalidateFrom(chapter);
    state.activeChapter = chapter;
    state.view = "flow";
    render();
    focusChapter(chapter);
    announce(`${chapter.charAt(0).toUpperCase() + chapter.slice(1)} reopened for editing.`);
  };

  const adjustScaleValue = (button) => {
    const control = scaleFields.querySelector(`[data-scale-input="${button.dataset.scaleTarget}"]`);
    if (!(control instanceof HTMLInputElement)) return;
    const step = Number(control.step || 1);
    const min = Number(control.min || 0);
    const max = Number(control.max || Number.MAX_SAFE_INTEGER);
    const current = control.value === "" ? min : Number(control.value);
    const direction = button.dataset.scaleStepper === "increment" ? 1 : -1;
    control.value = String(Math.min(max, Math.max(min, current + (step * direction))));
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.focus();
  };

  const startOver = () => {
    state = createInitialState();
    try {
      window.sessionStorage.removeItem(storageKey);
    } catch (error) {
      // Clearing the in-memory state is sufficient when storage is unavailable.
    }
    render();
    const button = activePanel()?.querySelector("[data-begin-journey]");
    if (inlineMode) {
      activePanel()?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    }
    button?.focus({ preventScroll: true });
    announce(`${config.concepts[state.concept].label} restored. Your private selections were cleared.`);
  };

  document.addEventListener("click", (event) => {
    const stepper = event.target.closest("[data-scale-stepper]");
    if (stepper) return adjustScaleValue(stepper);

    if (event.target.closest("[data-begin-journey]")) return openOperation();

    const operationChoice = event.target.closest("[data-operation-id]");
    if (operationChoice) return selectOperation(operationChoice.dataset.operationId);

    const goodsChoice = event.target.closest("[data-good-id]");
    if (goodsChoice) return toggleGood(goodsChoice.dataset.goodId);

    const adaptiveChoice = event.target.closest("[data-choice-type]");
    if (adaptiveChoice) return toggleAdaptiveChoice(adaptiveChoice.dataset.choiceType, adaptiveChoice.dataset.choiceId);

    const ownershipChoice = event.target.closest("[data-ownership-id]");
    if (ownershipChoice) return selectOwnership(ownershipChoice.dataset.ownershipId);

    if (event.target.closest("[data-operation-continue]")) return completeOperation();
    if (event.target.closest("[data-goods-continue]")) return completeGoods();
    if (event.target.closest("[data-finish-continue]")) return completeFinish();
    if (event.target.closest("[data-ownership-continue]")) return completeOwnership();
    if (event.target.closest("[data-build-result]")) return completeReview();
    if (event.target.closest("[data-exact-quote]")) return openQuoteHandoff();
    if (event.target.closest("[data-return-result]")) return returnToResult();
    if (event.target.closest("[data-start-over]")) return startOver();

    const edit = event.target.closest("[data-edit-chapter]");
    if (edit) editChapter(edit.dataset.editChapter);
  });

  scaleForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    completeScale();
  });

  scaleFields?.addEventListener("input", (event) => {
    const control = event.target.closest("[data-scale-input]");
    if (!control) return;
    state.scale[control.dataset.scaleInput] = control.value;
    invalidateFrom("scale");
    control.setAttribute("aria-invalid", "false");
    control.closest(".adaptive-field")?.classList.remove("has-error");
    scaleError.hidden = true;
    saveState();
  });

  locationForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    completeLocation();
  });

  locationInput?.addEventListener("input", () => {
    state.location.value = locationInput.value;
    state.location.type = null;
    invalidateFrom("location");
    locationInput.setAttribute("aria-invalid", "false");
    locationError.hidden = true;
    saveState();
  });

  quoteForm?.addEventListener("input", (event) => {
    const control = event.target.closest("input[name], select[name], textarea[name]");
    if (!control) return;
    state.contact[control.name] = control.value;
    state.quoteStatus = "idle";
    state.quotePayload = null;
    control.setAttribute("aria-invalid", "false");
    quoteError.hidden = true;
    saveState();
  });

  quoteForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    prepareQuotePayload();
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

  [operationChoices, goodsChoices, finishOptions, specialtyOptions].forEach((rail) => {
    rail?.addEventListener("scroll", () => updateRailAffordance(rail), { passive: true });
  });
  window.addEventListener("resize", () => {
    [operationChoices, goodsChoices, finishOptions, specialtyOptions].forEach(scheduleRailAffordance);
  });

  ownershipOptions?.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(ownershipOptions.querySelectorAll("[data-ownership-id]"));
    const current = Math.max(0, buttons.indexOf(document.activeElement));
    let next = current;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = buttons.length - 1;
    if (["ArrowDown", "ArrowRight"].includes(event.key)) next = (current + 1) % buttons.length;
    if (["ArrowUp", "ArrowLeft"].includes(event.key)) next = (current - 1 + buttons.length) % buttons.length;
    event.preventDefault();
    selectOwnership(buttons[next].dataset.ownershipId, true);
  });

  renderOperations();
  render();
  [operationChoices, goodsChoices, finishOptions, specialtyOptions].forEach(scheduleRailAffordance);
  if (state.view === "flow") focusChapter(state.activeChapter);

  window.SheltonPricingJourney = {
    getState: () => JSON.parse(JSON.stringify(state)),
    openOperation,
    selectOperation,
    completeOperation,
    toggleGood,
    completeGoods,
    completeScale,
    toggleAdaptiveChoice,
    completeFinish,
    selectOwnership,
    completeOwnership,
    completeLocation,
    completeReview,
    openQuoteHandoff,
    prepareQuotePayload,
    editChapter,
    startOver
  };
}());
