(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-learning]");
  const config = window.SheltonPricingJourneyConfig;
  const pricingEngine = window.SheltonPricingEngine;
  const progressiveRange = window.SheltonProgressiveRange;
  if (!root || !config || !pricingEngine || !progressiveRange) return;

  const q = (selector, scope) => (scope || root).querySelector(selector);
  const qa = (selector, scope) => Array.from((scope || root).querySelectorAll(selector));
  const money = (value) => "$" + Math.round(Number(value) || 0).toLocaleString("en-US");
  const positive = (value) => Number(value) > 0 ? Number(value) : 0;
  const validLocation = (value) => /^\d{5}(?:-\d{4})?$/.test(String(value || "").trim());
  const makeId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    return "pricing-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  };

  const defaultState = () => ({
    operation: "",
    goods: [],
    specialtyNeeds: [],
    scale: {},
    finish: [],
    ownership: "",
    rentalCategory: "",
    rentalTier: "",
    rentalQuantity: "",
    inventory: { par: "", customization: "" },
    location: "",
    requestedPickups: "",
    returnWindow: "",
    access: "",
    leadIdempotencyKey: makeId()
  });

  let state = defaultState();
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(config.storageKey) || "null");
    if (saved && typeof saved === "object") {
      state = {
        ...defaultState(),
        ...saved,
        goods: Array.isArray(saved.goods) ? saved.goods : [],
        specialtyNeeds: [],
        scale: saved.scale && typeof saved.scale === "object" ? saved.scale : {},
        inventory: saved.inventory && typeof saved.inventory === "object" ? saved.inventory : { par: "", customization: "" }
      };
    }
  } catch {
    state = defaultState();
  }

  let latestResult = null;
  let latestRawResult = null;
  let estimateSignature = "";
  let estimateRequest = 0;
  let estimateLoading = false;
  let estimateTimer = 0;
  let pickerOpen = false;
  let pendingOperation = "";
  let scaleStep = 0;
  let scaleSequenceOperation = state.operation;
  let pendingInitialHash = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : "";
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches || false;

  const operationPicker = q("[data-operation-picker]");
  const operationTrigger = q("[data-operation-trigger]");
  const operationPanel = q("[data-operation-panel]");
  const operationValue = q("[data-operation-value]");
  const operationOptions = q("[data-operation-options]");
  const operationConfirmation = q("[data-operation-confirmation]");
  const operationConfirmationTitle = q("[data-operation-confirmation-title]");
  const operationConfirm = q("[data-operation-confirm]");
  const operationCancel = q("[data-operation-cancel]");
  const operationInput = q("[data-operation-input]");
  const goodsOptions = q("[data-goods-options]");
  const goodsLegend = q("[data-goods-legend]");
  const goodsHelp = q("[data-goods-help]");
  const programHeading = q("[data-program-heading]");
  const operationGuideLink = q("[data-operation-guide-link]");
  const scaleFields = q("[data-volume-estimator-fields]");
  const scaleStatus = q("[data-volume-estimator-status]");
  const scaleConversion = q("[data-volume-help-conversion]");
  const ownershipOptions = q("[data-ownership-options]");
  const inventoryDetails = q("[data-inventory-details]");
  const inventoryCategory = q("[data-inventory-category]");
  const inventoryTier = q("[data-inventory-tier]");
  const inventoryUnits = q("[data-inventory-units]");
  const locationInput = q("[data-location-input]");
  const rangeLocked = q("[data-range-locked]");
  const rangeRevealed = q("[data-range-revealed]");
  const unlockCopy = q("[data-unlock-copy]");
  const weeklyRange = q("[data-weekly-range]");
  const poundRange = q("[data-pound-range]");
  const rangeStage = q("[data-range-stage]");
  const guidanceTitle = q("[data-range-guidance-title]");
  const guidanceCopy = q("[data-range-guidance-copy]");
  const estimateDock = q("[data-estimate-dock]");
  const dockProgress = q("[data-dock-progress]");
  const dockRange = q("[data-dock-range]");
  const dockAction = q("[data-dock-action]");
  const clearAnswers = q("[data-clear-answers]");
  const clearAnswersStatus = q("[data-clear-answers-status]");
  const quoteForm = q("[data-quote-form]");
  const quoteError = q("[data-quote-error]");
  const quoteStatus = q("[data-quote-status]");
  const quoteSubmit = q("[data-quote-submit]");
  const quoteSubmitIdleLabel = quoteSubmit?.textContent || "Send to Shelton for Review";
  let clearAnswersArmed = false;
  let clearAnswersTimer = 0;
  let quoteInFlight = false;
  let quoteSubmissionController = null;

  const operationForState = () => config.operations.find((item) => item.id === state.operation) || null;
  const selectedGoods = () => state.goods.map((id) => config.goods[id]).filter(Boolean);
  const restoreRenderedChoiceFocus = (container, name, value) => {
    const replacement = qa(`input[name="${name}"]`, container).find((input) => input.value === value);
    replacement?.focus({ preventScroll: true });
  };
  const scaleSchema = () => config.scaleSchemas[state.operation] || [];
  const directFollowupIds = new Set([
    "weeklyRobes", "weeklyBlankets", "weeklyChefCoats", "weeklyAprons",
    "weeklyUniformTops", "weeklyPants", "weeklyJackets", "storage",
    "seasonality", "variability", "peakPattern"
  ]);
  const scaleEntryMeta = () => {
    const meta = config.scaleEntryModes?.[state.operation];
    if (!meta) return null;
    if (Array.isArray(meta.directGoods) && !meta.directGoods.some((id) => state.goods.includes(id))) return null;
    return meta;
  };
  const entryModeField = (meta) => ({
    id: "entryMode",
    label: "Which number do you know?",
    hint: "The estimator needs either normal operating activity or a measured weekly total to establish its first range.",
    type: "select",
    required: true,
    routing: true,
    options: [
      { value: "drivers", label: meta.driverLabel },
      { value: "direct", label: meta.directLabel }
    ]
  });
  const conditionalScaleFieldVisible = (field) => {
    if (field.id === "duvetPercent") return state.scale.bedSystem === "mixed";
    if (field.id === "memoryCarePercent") return state.scale.careType === "mixed";
    if (field.id === "averageBedrooms") return state.scale.bedroomBasis === "average";
    if (field.id === "totalBedrooms") return state.scale.bedroomBasis === "total";
    return true;
  };
  const fieldVisible = (field) => (
    (!Array.isArray(field.goods) || field.goods.some((id) => state.goods.includes(id)))
    && conditionalScaleFieldVisible(field)
  );
  const visibleScaleFields = () => {
    const fields = scaleSchema().filter(fieldVisible);
    const meta = scaleEntryMeta();
    if (!meta) return fields;
    const entry = entryModeField(meta);
    if (!state.scale.entryMode) return [entry];
    if (state.scale.entryMode === "direct") {
      const direct = fields.find((field) => field.id === meta.directField);
      const followups = fields.filter((field) => field.id !== meta.directField && directFollowupIds.has(field.id));
      const directRequired = direct ? {
        ...direct,
        required: true,
        routing: true,
        emptyAction: meta.directField === "totalWeeklyPieces" ? "Enter weekly pieces" : "Enter weekly pounds"
      } : null;
      return [entry, ...(directRequired ? [directRequired] : []), ...followups];
    }
    return [entry, ...fields.filter((field) => field.id !== meta.directField)];
  };

  const persist = () => {
    try {
      window.sessionStorage.setItem(config.storageKey, JSON.stringify(state));
    } catch {
      // The estimator remains usable when browser storage is unavailable.
    }
  };

  const invalidateEstimate = () => {
    estimateRequest += 1;
    estimateSignature = "";
    latestResult = null;
    latestRawResult = null;
  };

  const restoreInitialHash = () => {
    if (!pendingInitialHash) return;
    const target = document.getElementById(pendingInitialHash);
    if (!target) {
      pendingInitialHash = "";
      return;
    }
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: "instant", block: "start" });
        pendingInitialHash = "";
      });
    });
  };

  const modalPicker = () => false;

  const syncPickerSemantics = () => {
    const modal = modalPicker();
    if (!window.matchMedia("(max-width: 760px)").matches) estimateDock.classList.remove("is-suppressed");
    operationPanel.setAttribute("role", modal ? "dialog" : "region");
    if (modal) {
      operationPanel.setAttribute("aria-modal", "true");
      operationTrigger.setAttribute("aria-haspopup", "dialog");
    } else {
      operationPanel.removeAttribute("aria-modal");
      operationTrigger.removeAttribute("aria-haspopup");
    }
    document.body.classList.toggle("operation-picker-open", pickerOpen);
  };

  const clearOperationConfirmation = () => {
    pendingOperation = "";
    operationConfirmation.hidden = true;
  };

  const setPickerOpen = (open, options = {}) => {
    pickerOpen = Boolean(open);
    operationPanel.hidden = !pickerOpen;
    operationTrigger.setAttribute("aria-expanded", String(pickerOpen));
    operationPicker.classList.toggle("is-open", pickerOpen);
    if (pickerOpen) {
      syncPickerSemantics();
      clearOperationConfirmation();
      const selected = q('[data-operation-option="' + state.operation + '"]', operationOptions);
      const first = q("[data-operation-option]", operationOptions);
      window.setTimeout(() => (selected || first)?.focus(), 0);
    } else {
      clearOperationConfirmation();
      document.body.classList.remove("operation-picker-open");
      if (options.returnFocus) window.setTimeout(() => operationTrigger.focus({ preventScroll: true }), 0);
    }
  };

  const renderOperationOptions = () => {
    operationInput.replaceChildren(new Option("Choose the closest match", ""));
    operationOptions.replaceChildren();
    config.operations.forEach((operation) => {
      operationInput.appendChild(new Option(operation.label, operation.id));
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.operationOption = operation.id;
      button.setAttribute("aria-pressed", String(state.operation === operation.id));
      const number = document.createElement("span");
      number.className = "operation-picker__number";
      number.textContent = operation.number;
      const copy = document.createElement("span");
      copy.className = "operation-picker__option-copy";
      const strong = document.createElement("strong");
      strong.textContent = operation.label;
      copy.appendChild(strong);
      button.append(number, copy);
      operationOptions.appendChild(button);
    });
  };

  const syncOperation = () => {
    const operation = operationForState();
    operationInput.value = state.operation;
    operationValue.textContent = operation ? operation.label : "Choose the closest match";
    operationTrigger.classList.toggle("has-value", Boolean(operation));
    qa("[data-operation-option]", operationOptions).forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.operationOption === state.operation));
    });
  };

  const hasOperationDependentAnswers = () => Boolean(
    state.goods.length
    || state.specialtyNeeds.length
    || Object.keys(state.scale).length
    || state.finish.length
    || state.rentalCategory
    || state.rentalTier
    || state.rentalQuantity
  );

  const applyOperation = (operationId) => {
    if (operationId === state.operation) {
      setPickerOpen(false, { returnFocus: true });
      return;
    }
    state.operation = operationId;
    state.goods = [];
    state.specialtyNeeds = [];
    state.scale = {};
    state.finish = [];
    state.rentalCategory = "";
    state.rentalTier = "";
    state.rentalQuantity = "";
    scaleStep = 0;
    scaleSequenceOperation = operationId;
    invalidateEstimate();
    setPickerOpen(false, { returnFocus: true });
    renderAll();
  };

  const selectOperation = (operationId) => {
    if (operationId === state.operation || !state.operation || !hasOperationDependentAnswers()) {
      applyOperation(operationId);
      return;
    }
    const nextOperation = config.operations.find((item) => item.id === operationId);
    if (!nextOperation) return;
    pendingOperation = operationId;
    operationConfirmationTitle.textContent = "Change to " + nextOperation.label + "?";
    operationConfirmation.hidden = false;
    window.setTimeout(() => operationConfirm.focus(), 0);
  };

  const renderProgramContext = () => {
    const operation = operationForState();
    const industryAnchors = {
      hotel: "hotels",
      str: "short-term-rentals",
      spa: "spas",
      gym: "gyms",
      events: "events",
      restaurant: "restaurants",
      casino: "casinos",
      uniforms: "uniforms",
      wholesale: "wholesale"
    };
    const industryAnchor = operation ? industryAnchors[operation.id] : "industry-directory";
    operationGuideLink.setAttribute("href", "industries.html#" + (industryAnchor || "industry-directory"));
    operationGuideLink.setAttribute(
      "aria-label",
      operation
        ? "Explore " + operation.label + " in Who We Serve"
        : "Explore the programs in Who We Serve"
    );
    programHeading.textContent = operation
      ? "What should Shelton clean and return?"
      : "Start with the operation closest to yours.";
    goodsLegend.textContent = operation ? "Goods in this program" : "What should Shelton clean and return?";
  };

  const renderGoods = () => {
    const operation = operationForState();
    goodsOptions.replaceChildren();
    if (!operation) {
      goodsHelp.textContent = "Choose an operation first, then select every item that belongs in the program.";
      return;
    }
    goodsHelp.textContent = operation.id === "other"
      ? "Choose the closest goods. Shelton can refine the program with you during review."
      : "Select everything Shelton would pick up, process, and return in a normal service week.";
    operation.goods.forEach((id) => {
      const good = config.goods[id];
      if (!good) return;
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "checkbox";
      input.name = "goods";
      input.value = id;
      input.checked = state.goods.includes(id);
      const copy = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = good.label;
      copy.appendChild(strong);
      if (good.short) {
        const small = document.createElement("small");
        small.textContent = good.short;
        copy.appendChild(small);
      } else {
        copy.classList.add("is-label-only");
      }
      label.append(input, copy);
      goodsOptions.appendChild(label);
    });
  };

  const renderScale = () => {
    const operation = operationForState();
    const fields = visibleScaleFields();
    scaleFields.replaceChildren();
    scaleConversion.hidden = true;
    if (!operation) {
      scaleStep = 0;
      scaleSequenceOperation = "";
      const empty = document.createElement("div");
      empty.className = "volume-question volume-question--empty";
      const eyebrow = document.createElement("span");
      eyebrow.className = "volume-question__eyebrow";
      eyebrow.textContent = "Section 01 first";
      const prompt = document.createElement("p");
      prompt.textContent = "Choose the closest operation to open the first sizing question.";
      empty.append(eyebrow, prompt);
      scaleFields.appendChild(empty);
      scaleStatus.textContent = "No generic price is calculated before the operation is known.";
      return;
    }
    if (scaleSequenceOperation !== state.operation) {
      scaleStep = 0;
      scaleSequenceOperation = state.operation;
    }
    scaleStep = Math.max(0, Math.min(scaleStep, Math.max(0, fields.length - 1)));
    const field = fields[scaleStep];
    if (!field) {
      scaleStatus.textContent = "Select the goods in Section 01 to open the sizing questions that apply.";
      return;
    }

    const question = document.createElement("div");
    question.className = "volume-question";
    question.dataset.scaleQuestion = field.id;

    const questionHead = document.createElement("div");
    questionHead.className = "volume-question__head";
    const progress = document.createElement("span");
    progress.className = "volume-question__eyebrow";
    progress.textContent = "Question " + String(scaleStep + 1).padStart(2, "0") + " of " + String(fields.length).padStart(2, "0");
    const answered = document.createElement("span");
    answered.className = "volume-question__answered";
    const answeredCount = fields.filter(basicFieldValid).length;
    answered.textContent = answeredCount + (answeredCount === 1 ? " answer saved" : " answers saved");
    questionHead.append(progress, answered);

    const titleText = field.label + (field.required ? "" : " · optional");
    let fieldElement;
    if (field.type === "select") {
      const fieldset = document.createElement("fieldset");
      fieldset.className = "volume-choice-field";
      const legend = document.createElement("legend");
      legend.textContent = titleText;
      const choices = document.createElement("div");
      choices.className = "volume-choice-grid";
      if (field.options.length === 2) choices.classList.add("volume-choice-grid--two");
      field.options.forEach((item) => {
        const optionLabel = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "scale-" + field.id;
        input.value = item.value;
        input.dataset.scaleField = field.id;
        input.checked = state.scale[field.id] === item.value;
        const card = document.createElement("span");
        const strong = document.createElement("strong");
        strong.textContent = item.label;
        card.appendChild(strong);
        if (item.description) {
          const description = document.createElement("small");
          description.textContent = item.description;
          card.appendChild(description);
        }
        optionLabel.append(input, card);
        choices.appendChild(optionLabel);
      });
      fieldset.append(legend, choices);
      if (field.id !== "entryMode") {
        const hint = document.createElement("small");
        hint.className = "volume-choice-field__hint volume-question__why";
        const hintLabel = document.createElement("strong");
        hintLabel.textContent = "Why it matters";
        const hintCopy = document.createElement("span");
        hintCopy.textContent = field.hint;
        hint.append(hintLabel, hintCopy);
        fieldset.appendChild(hint);
      }
      fieldElement = fieldset;
    } else {
      const label = document.createElement("label");
      label.className = "calm-field volume-estimator__field";
      const title = document.createElement("span");
      title.textContent = titleText;
      const wrap = document.createElement("span");
      wrap.className = "number-field";
      const control = document.createElement("input");
      control.type = "number";
      control.inputMode = "decimal";
      control.min = String(field.min);
      control.max = String(field.max);
      control.step = String(field.step || 1);
      control.dataset.scaleField = field.id;
      control.value = state.scale[field.id] === undefined ? "" : state.scale[field.id];
      const unit = document.createElement("em");
      unit.textContent = field.unit;
      wrap.append(control, unit);
      label.append(title, wrap);
      const hint = document.createElement("small");
      hint.className = "volume-question__why";
      const hintLabel = document.createElement("strong");
      hintLabel.textContent = "Why it matters";
      const hintCopy = document.createElement("span");
      hintCopy.textContent = field.hint;
      hint.append(hintLabel, hintCopy);
      label.appendChild(hint);
      fieldElement = label;
    }

    const navigation = document.createElement("div");
    navigation.className = "volume-question__navigation";
    const back = document.createElement("button");
    back.type = "button";
    back.dataset.scaleBack = "";
    back.textContent = "Back";
    back.hidden = scaleStep === 0;
    const next = document.createElement("button");
    next.type = "button";
    next.dataset.scaleNext = "";
    const lastQuestion = scaleStep === fields.length - 1;
    const routeRequired = Boolean(field.routing);
    next.disabled = routeRequired && !basicFieldValid(field);
    next.textContent = routeRequired && !basicFieldValid(field)
      ? (field.emptyAction || "Choose a starting point")
      : lastQuestion
        ? "Finish section"
        : (basicFieldValid(field) ? "Next question" : "Skip for now");
    navigation.append(back, next);
    question.append(questionHead, fieldElement);
    if (operation.centralLocationRequired) {
      const requirement = document.createElement("p");
      requirement.className = "central-location-requirement";
      requirement.textContent = "Central location required";
      question.appendChild(requirement);
    }
    question.appendChild(navigation);
    scaleFields.appendChild(question);
    updateScaleStatus();
  };

  const basicFieldValid = (field) => {
    const value = state.scale[field.id];
    if (field.type === "select") return String(value || "").trim() !== "";
    const numeric = Number(value);
    return String(value ?? "").trim() !== "" && Number.isFinite(numeric) && numeric >= Number(field.min) && numeric <= Number(field.max);
  };

  const selectedCountRequirements = {
    weeklyRobes: ["robes"],
    weeklyBlankets: ["blankets"],
    weeklyTablecloths: ["tablecloths"],
    weeklyNapkins: ["napkins"],
    weeklyChefCoats: ["chefCoats"],
    weeklyAprons: ["aprons"],
    weeklyUniformTops: ["uniformShirts", "casinoUniforms"],
    weeklyPants: ["workwear"],
    weeklyJackets: ["jackets"]
  };

  const validateScale = () => {
    const operation = operationForState();
    if (!operation) return { ready: false, message: "Choose an operation in Section 01 first.", missing: [] };
    const fields = visibleScaleFields();
    const missing = [];
    fields.forEach((field) => {
      if (field.required && !basicFieldValid(field)) missing.push(field.label);
      const goodsIds = selectedCountRequirements[field.id] || [];
      if (goodsIds.some((id) => state.goods.includes(id)) && !positive(state.scale[field.id])) missing.push(field.label);
    });

    const anyPositive = (ids) => ids.some((id) => positive(state.scale[id]) > 0);
    if (state.operation === "events" && !anyPositive(["weeklyTablecloths", "weeklyNapkins", "totalWeeklyPieces"])) {
      missing.push("At least one weekly event-linen count");
    }
    if (state.operation === "uniforms" && !anyPositive(["weeklyUniformTops", "weeklyChefCoats", "weeklyPants", "weeklyJackets"])) {
      missing.push("At least one weekly garment count");
    }
    if (state.operation === "casino" && !anyPositive(["hotelRooms", "weeklyCovers", "weeklyTablecloths", "weeklyNapkins", "weeklyChefCoats", "weeklyUniformTops"])) {
      missing.push("At least one active casino program");
    }
    if (state.operation === "restaurant") {
      const dining = state.goods.some((id) => ["napkins", "tableLinens"].includes(id));
      const utilityOnly = state.goods.includes("barTowels") && !dining;
      if (dining && !anyPositive(["weeklyCovers", "knownVolume"])) missing.push("Weekly covers or measured linen pounds");
      if (utilityOnly && !positive(state.scale.knownVolume)) missing.push("Measured weekly utility-towel pounds");
      if (!dining && !state.goods.includes("barTowels") && !anyPositive(["weeklyChefCoats", "weeklyAprons"])) {
        missing.push("At least one weekly garment count");
      }
    }
    if (state.operation === "other") {
      if (!positive(state.scale.weeklyVolume)) missing.push("Approximate weekly volume");
      if (!state.scale.volumeUnit) missing.push("Volume unit");
    }

    const unique = Array.from(new Set(missing));
    return {
      ready: unique.length === 0 && state.goods.length > 0,
      missing: unique,
      message: unique.length ? "To refine: " + unique.slice(0, 3).join(", ") + (unique.length > 3 ? "…" : ".") : "Select at least one good in Section 01."
    };
  };

  function updateScaleStatus() {
    const validation = validateScale();
    const minimum = progressiveRange.minimumDriver(state);
    if (!minimum.ready) {
      scaleStatus.textContent = minimum.message;
    } else if (!validation.ready) {
      scaleStatus.textContent = "Early range available. " + validation.message;
    } else {
      scaleStatus.textContent = "The key sizing inputs are included. Optional details can continue to narrow the range.";
    }
  }

  const finishByGood = {
    sheets: "Pressed and folded",
    duvetCovers: "Pressed and folded",
    towels: "Folded",
    handTowels: "Folded",
    bathMats: "Folded",
    robes: "Cleaned and folded",
    blankets: "Cleaned and folded",
    faceCradleCovers: "Cleaned and folded",
    tablecloths: "Pressed and folded",
    napkins: "Pressed and folded",
    runners: "Pressed and folded",
    skirting: "Pressed and folded",
    chairCovers: "Pressed and folded",
    specialtyEventGoods: "Finished to item specification",
    chefCoats: "Pressed and returned on hangers",
    aprons: "Cleaned and folded",
    barTowels: "Folded",
    tableLinens: "Pressed and folded",
    casinoUniforms: "Pressed and returned on hangers",
    banquetLinens: "Pressed and folded",
    uniformShirts: "Pressed and returned on hangers",
    workwear: "Cleaned and folded",
    jackets: "Pressed and returned on hangers",
    shirts: "Pressed and returned on hangers",
    suits: "Pressed and returned on hangers",
    dresses: "Pressed and returned on hangers",
    specialtyGarments: "Finished to item specification",
    choirRobes: "Pressed and returned on hangers"
  };

  const finishForGoods = () => state.goods.map((id) => finishByGood[id] || "Cleaned and finished");

  const currentWeeklyPounds = () => {
    const measured = positive(state.scale.knownVolume);
    if (measured) return measured;
    if (state.scale.volumeUnit === "pounds" && positive(state.scale.weeklyVolume)) return positive(state.scale.weeklyVolume);
    return positive(latestResult?.weeklyPounds);
  };

  const renderFinish = () => {
    const operation = operationForState();
    const title = q("[data-finish-recommendation-title]");
    const list = q("[data-finish-goods-list]");
    const returnFormat = q("[data-return-format]");
    const returnTitle = q("[data-return-format-title]");
    const returnStatus = q("[data-return-format-status]");
    const returnOptions = qa("[data-return-format-option]", returnFormat);
    state.finish = finishForGoods();
    list.replaceChildren();
    if (!operation || !state.goods.length) {
      title.textContent = "Choose goods in Section 01 to see their finish and return format.";
      returnFormat.hidden = true;
      return;
    }
    title.textContent = "Finish by selected item";
    state.goods.forEach((id) => {
      const good = config.goods[id];
      if (!good) return;
      const item = document.createElement("li");
      const name = document.createElement("span");
      const finish = document.createElement("strong");
      name.textContent = good.label;
      finish.textContent = finishByGood[id] || "Cleaned and finished";
      item.append(name, finish);
      list.appendChild(item);
    });

    returnFormat.hidden = false;
    const weeklyPounds = currentWeeklyPounds();
    const format = weeklyPounds ? (weeklyPounds >= 500 ? "cart" : "bag") : "";
    returnOptions.forEach((option) => option.classList.toggle("is-selected", option.dataset.returnFormatOption === format));
    if (format === "cart") {
      returnTitle.textContent = "Linen cart return";
      returnStatus.textContent = "Selected automatically from the program volume.";
    } else if (format === "bag") {
      returnTitle.textContent = "Bag return";
      returnStatus.textContent = "Selected automatically from the program volume.";
    } else {
      returnTitle.textContent = "Set by program volume";
      returnStatus.textContent = "Enter a sizing detail in Section 02 and the return format will update automatically.";
    }
  };

  const renderOwnership = () => {
    ownershipOptions.replaceChildren();
    config.ownershipChoices.forEach((item) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "ownership";
      input.value = item.id;
      input.checked = state.ownership === item.id;
      const copy = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = item.label;
      const small = document.createElement("small");
      small.textContent = item.description;
      copy.append(strong, small);
      label.append(input, copy);
      ownershipOptions.appendChild(label);
    });
    const supplied = ["some", "supply"].includes(state.ownership);
    inventoryDetails.hidden = !supplied;
    renderRentalCategories();
    inventoryTier.value = state.rentalTier || "";
    inventoryUnits.value = state.rentalQuantity || "";
    qa("[data-inventory-par]").forEach((input) => {
      input.checked = input.value === state.inventory.par;
    });
    qa("[data-inventory-customization]").forEach((input) => {
      input.checked = input.value === state.inventory.customization;
    });
  };

  const rentalCategoryLabel = {
    sheets: "Sheets / bed linen",
    towels: "Towels / bath linen",
    robes: "Robes",
    blankets: "Blankets",
    "table linens": "Table / event linen",
    uniforms: "Uniforms / workwear"
  };

  const rentalCategoryForGood = (id) => ({
    sheets: "sheets",
    duvetCovers: "sheets",
    towels: "towels",
    handTowels: "towels",
    bathMats: "towels",
    barTowels: "towels",
    robes: "robes",
    blankets: "blankets",
    tablecloths: "table linens",
    napkins: "table linens",
    tableLinens: "table linens",
    banquetLinens: "table linens",
    chefCoats: "uniforms",
    aprons: "uniforms",
    casinoUniforms: "uniforms",
    uniformShirts: "uniforms",
    workwear: "uniforms",
    jackets: "uniforms"
  }[id] || "");

  const renderRentalCategories = () => {
    const values = Array.from(new Set(state.goods.map(rentalCategoryForGood).filter(Boolean)));
    inventoryCategory.replaceChildren(new Option("Choose the supplied item", ""));
    values.forEach((value) => inventoryCategory.appendChild(new Option(rentalCategoryLabel[value] || value, value)));
    if (!values.includes(state.rentalCategory)) state.rentalCategory = "";
    inventoryCategory.value = state.rentalCategory;
  };

  const completion = () => {
    const scale = validateScale().ready;
    return {
      program: Boolean(state.operation && state.goods.length),
      volume: scale,
      finish: Boolean(state.goods.length && state.finish.length),
      ownership: Boolean(state.ownership),
      route: validLocation(state.location)
    };
  };

  const minimumEstimate = () => progressiveRange.minimumDriver(state);
  const estimateReady = () => Boolean(minimumEstimate().ready);
  const currentPrecision = () => progressiveRange.precision(state, visibleScaleFields(), {
    locationValid: validLocation(state.location)
  });

  const stateForEngine = () => ({
    operation: state.operation,
    goods: state.goods.slice(),
    specialtyNeeds: state.specialtyNeeds.slice(),
    scale: { ...state.scale },
    finish: state.finish.slice(),
    ownership: state.ownership || "unsure",
    rentalCategory: state.rentalCategory,
    rentalTier: state.rentalTier,
    rentalQuantity: state.rentalQuantity,
    location: { type: /^\d{5}$/.test(state.location.trim()) ? "zip" : "city", value: state.location.trim() },
    requestedPickups: state.requestedPickups || ""
  });

  const estimateKey = () => JSON.stringify(stateForEngine());

  const renderProgress = () => {
    const completed = completion();
    Object.entries(completed).forEach(([key, value]) => {
      const label = q('[data-factor-state="' + key + '"]');
      if (!label) return;
      if (key === "program") {
        if (value) label.textContent = "Ready for sizing";
        else if (state.operation) label.textContent = "Choose at least one item";
        else label.textContent = "Required · start here";
      } else if (key === "volume") {
        if (!state.operation) label.textContent = "Choose an operation first";
        else if (value) label.textContent = "Included in your review";
        else if (estimateReady()) label.textContent = "Range open · keep refining";
        else label.textContent = "Add the first sizing answer";
      }
      else if (key === "finish") label.textContent = value ? "Finish ready" : "Choose goods in Section 01";
      else label.textContent = value ? "Included in your review" : "Optional";
      label.classList.toggle("is-complete", value);
    });

    if (state.operation || state.goods.length) {
      estimateDock.hidden = false;
      dockProgress.textContent = "Your planning range";
      if (!completed.program) {
        dockRange.textContent = "Choose at least one item to complete Section 01.";
        dockAction.textContent = "Finish section 01";
        dockAction.href = "#factor-program";
      } else if (!estimateReady()) {
        dockRange.textContent = minimumEstimate().message;
        dockAction.textContent = "Add first sizing answer";
        dockAction.href = "#factor-volume";
      } else if (estimateLoading) {
        dockRange.textContent = "Calculating your planning range…";
        dockAction.textContent = "View progress";
        dockAction.href = "#planning-range";
      } else if (latestResult && latestResult.range) {
        dockRange.textContent = Number(latestResult.range.weeklyLow) === Number(latestResult.range.weeklyHigh)
          ? money(latestResult.range.weeklyBase) + " / week"
          : money(latestResult.range.weeklyLow) + "–" + money(latestResult.range.weeklyHigh) + " / week";
        dockAction.textContent = "View planning range";
        dockAction.href = "#planning-range";
      } else {
        dockRange.textContent = "Shelton review path ready";
        dockAction.textContent = "View review";
        dockAction.href = "#planning-range";
      }
    } else {
      estimateDock.hidden = true;
    }
  };

  const rhythmDaysFor = (label) => {
    const text = String(label || "").toLowerCase();
    if (text.includes("weekday")) return [0, 1, 2, 3, 4];
    if (text.includes("three")) return [0, 2, 4];
    if (text.includes("twice")) return [1, 4];
    if (text.includes("once")) return [2];
    return [];
  };

  const renderRouteRecommendation = () => {
    const kicker = q("[data-rhythm-recommendation-kicker]");
    const label = q("[data-rhythm-recommendation-label]");
    const cadence = q("[data-rhythm-cadence]");
    const days = qa("[data-rhythm-day]");
    const toggle = q("[data-rhythm-toggle]");
    const overrides = q("[data-rhythm-overrides]");
    qa("[data-rhythm-input]").forEach((input) => {
      input.checked = state.requestedPickups ? input.value === state.requestedPickups : input.value === "recommended";
    });
    toggle.hidden = !latestResult || latestResult.rangeUnavailable;
    if (!latestResult || latestResult.rangeUnavailable) overrides.hidden = true;
    if (!latestResult) {
      kicker.textContent = estimateLoading ? "Calculating service rhythm" : "Recommendation pending";
      label.textContent = estimateReady() ? "Calculating the likely service rhythm." : minimumEstimate().message;
      cadence.dataset.rhythm = "pending";
      days.forEach((day) => day.classList.remove("is-active"));
      return;
    }
    kicker.textContent = latestResult.rangeUnavailable ? "Shelton route review" : "Planning recommendation";
    label.textContent = latestResult.rhythm.label;
    const active = rhythmDaysFor(latestResult.rhythm.label);
    days.forEach((day, index) => day.classList.toggle("is-active", active.includes(index)));
  };

  const renderResult = () => {
    renderProgress();
    renderRouteRecommendation();

    if (!estimateReady()) {
      rangeLocked.hidden = false;
      rangeRevealed.hidden = true;
      unlockCopy.textContent = minimumEstimate().message;
      return;
    }
    if (estimateLoading || !latestResult) {
      rangeLocked.hidden = false;
      rangeRevealed.hidden = true;
      unlockCopy.textContent = "Calculating your planning range…";
      return;
    }

    rangeLocked.hidden = true;
    rangeRevealed.hidden = false;
    rangeRevealed.classList.toggle("is-range-unavailable", latestResult.rangeUnavailable);

    if (latestResult.rangeUnavailable || !latestResult.range) {
      weeklyRange.textContent = "Shelton review";
      poundRange.textContent = "Pricing is confirmed after a quick program review.";
      rangeStage.textContent = "Personalized pricing review";
      guidanceTitle.textContent = "Your answers are ready to send";
      guidanceCopy.textContent = "Request a quote with the information you have. Shelton will confirm the remaining service details with you.";
    } else {
      const collapsed = Number(latestResult.range.weeklyLow) === Number(latestResult.range.weeklyHigh);
      weeklyRange.textContent = collapsed
        ? money(latestResult.range.weeklyBase)
        : money(latestResult.range.weeklyLow) + "–" + money(latestResult.range.weeklyHigh);
      poundRange.textContent = latestResult.unitPricing
        ? "$" + latestResult.unitPricing.poundLow.toFixed(2) + " / lb fixed recommended rate"
        : "Per-pound pricing is confirmed during review.";
      rangeStage.textContent = collapsed ? "Likely typical weekly amount" : "Typical weekly amount and quantity range";
      guidanceTitle.textContent = latestResult.manualReview || latestResult.warning.includes("REVIEW")
        ? "Let’s confirm this program"
        : latestResult.confidence?.explanation
          ? "What still matters"
          : "Ready for a conversation";
      guidanceCopy.textContent = latestResult.confidence?.explanation || "Shelton will confirm your goods and route before final pricing.";
    }
  };

  const refreshProgressiveResult = () => {
    if (!latestRawResult) {
      renderResult();
      return;
    }
    latestResult = progressiveRange.refine(latestRawResult, currentPrecision());
    renderResult();
  };

  const requestEstimate = async () => {
    window.clearTimeout(estimateTimer);
    if (!estimateReady()) {
      estimateRequest += 1;
      estimateLoading = false;
      latestResult = null;
      latestRawResult = null;
      renderResult();
      return;
    }
    const signature = estimateKey();
    if (signature === estimateSignature && (latestResult || estimateLoading)) {
      renderResult();
      return;
    }
    estimateSignature = signature;
    const requestId = ++estimateRequest;
    estimateLoading = true;
    latestResult = null;
    latestRawResult = null;
    renderResult();
    const result = await pricingEngine.calculatePlanningRange(stateForEngine());
    if (requestId !== estimateRequest) return;
    latestRawResult = result;
    latestResult = progressiveRange.refine(result, currentPrecision());
    estimateLoading = false;
    renderFinish();
    renderResult();
    restoreInitialHash();
  };

  const scheduleEstimate = (delay = 250) => {
    window.clearTimeout(estimateTimer);
    estimateTimer = window.setTimeout(requestEstimate, delay);
  };

  const renderAll = () => {
    syncOperation();
    renderGoods();
    renderProgramContext();
    renderScale();
    renderFinish();
    renderOwnership();
    locationInput.value = state.location;
    qa("[data-return-window]").forEach((input) => { input.checked = input.value === state.returnWindow; });
    qa("[data-access-input]").forEach((input) => { input.checked = input.value === state.access; });
    persist();
    requestEstimate();
  };

  const onStateChange = () => {
    invalidateEstimate();
    renderAll();
  };

  operationTrigger.addEventListener("click", () => setPickerOpen(!pickerOpen));
  operationOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-operation-option]");
    if (button) selectOperation(button.dataset.operationOption);
  });
  operationOptions.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const visible = qa("[data-operation-option]", operationOptions).filter((button) => !button.hidden);
    if (!visible.length) return;
    const index = Math.max(0, visible.indexOf(document.activeElement));
    let next = index;
    if (event.key === "ArrowDown") next = (index + 1) % visible.length;
    if (event.key === "ArrowUp") next = (index - 1 + visible.length) % visible.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = visible.length - 1;
    event.preventDefault();
    visible[next].focus();
  });
  operationConfirm.addEventListener("click", () => {
    if (pendingOperation) applyOperation(pendingOperation);
  });
  operationCancel.addEventListener("click", () => {
    clearOperationConfirmation();
    const current = q('[data-operation-option="' + state.operation + '"]', operationOptions);
    if (current && !current.hidden) current.focus();
    else q("[data-operation-option]", operationOptions)?.focus();
  });
  operationInput.addEventListener("change", () => selectOperation(operationInput.value));
  document.addEventListener("click", (event) => {
    if (pickerOpen && !event.target.closest("[data-operation-picker]")) setPickerOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && pickerOpen) {
      if (!operationConfirmation.hidden) {
        clearOperationConfirmation();
        const current = q('[data-operation-option="' + state.operation + '"]', operationOptions);
        (current || q("[data-operation-option]", operationOptions))?.focus();
      } else {
        setPickerOpen(false, { returnFocus: true });
      }
      return;
    }
    if (event.key === "Tab" && pickerOpen && modalPicker()) {
      const focusable = qa("button, input", operationPanel).filter((element) => (
        !element.disabled && !element.hidden && !element.closest("[hidden]")
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  window.addEventListener("resize", syncPickerSemantics);

  goodsOptions.addEventListener("change", (event) => {
    if (!event.target.matches('input[name="goods"]')) return;
    const id = event.target.value;
    state.goods = event.target.checked
      ? Array.from(new Set(state.goods.concat(id)))
      : state.goods.filter((item) => item !== id);
    const validGoods = operationForState() ? operationForState().goods : [];
    state.goods = state.goods.filter((item) => validGoods.includes(item));
    onStateChange();
    restoreRenderedChoiceFocus(goodsOptions, "goods", id);
  });

  scaleFields.addEventListener("input", (event) => {
    const id = event.target.dataset.scaleField;
    if (!id) return;
    state.scale[id] = event.target.value;
    invalidateEstimate();
    persist();
    updateScaleStatus();
    renderFinish();
    scheduleEstimate();
    const next = q("[data-scale-next]", scaleFields);
    const field = visibleScaleFields().find((item) => item.id === id);
    if (next && field) {
      const lastQuestion = scaleStep === visibleScaleFields().length - 1;
      const routeRequired = Boolean(field.routing);
      next.disabled = routeRequired && !basicFieldValid(field);
      next.textContent = routeRequired && !basicFieldValid(field)
        ? (field.emptyAction || "Choose a starting point")
        : lastQuestion
          ? "Finish section"
          : (basicFieldValid(field) ? "Next question" : "Skip for now");
    }
    const saved = q(".volume-question__answered", scaleFields);
    if (saved) {
      const answeredCount = visibleScaleFields().filter(basicFieldValid).length;
      saved.textContent = answeredCount + (answeredCount === 1 ? " answer saved" : " answers saved");
    }
  });
  scaleFields.addEventListener("change", (event) => {
    const id = event.target.dataset.scaleField;
    if (!id) return;
    state.scale[id] = event.target.value;
    if (id === "entryMode") {
      const meta = scaleEntryMeta();
      if (meta) {
        const keep = new Set(["entryMode"]);
        if (state.scale.entryMode === "direct") {
          keep.add(meta.directField);
          scaleSchema().forEach((field) => {
            if (directFollowupIds.has(field.id)) keep.add(field.id);
          });
        } else {
          scaleSchema().forEach((field) => {
            if (field.id !== meta.directField) keep.add(field.id);
          });
        }
        Object.keys(state.scale).forEach((key) => {
          if (!keep.has(key)) delete state.scale[key];
        });
      }
    }
    if (id === "bedroomBasis") {
      if (state.scale.bedroomBasis === "average") delete state.scale.totalBedrooms;
      if (state.scale.bedroomBasis === "total") delete state.scale.averageBedrooms;
    }
    if (id === "bedSystem" && state.scale[id] !== "mixed") delete state.scale.duvetPercent;
    if (id === "careType" && state.scale[id] !== "mixed") delete state.scale.memoryCarePercent;
    invalidateEstimate();
    persist();
    updateScaleStatus();
    renderFinish();
    requestEstimate();
  });
  scaleFields.addEventListener("click", (event) => {
    const back = event.target.closest("[data-scale-back]");
    const next = event.target.closest("[data-scale-next]");
    if (!back && !next) return;
    const fields = visibleScaleFields();
    if (next?.disabled) return;
    if (back) scaleStep = Math.max(0, scaleStep - 1);
    if (next && scaleStep >= fields.length - 1) {
      q("#factor-finish").scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      return;
    }
    if (next) scaleStep += 1;
    renderScale();
    const control = q("[data-scale-field]", scaleFields);
    if (control) window.setTimeout(() => control.focus(), 0);
  });

  ownershipOptions.addEventListener("change", (event) => {
    if (!event.target.matches('input[name="ownership"]')) return;
    state.ownership = event.target.value;
    if (!["some", "supply"].includes(state.ownership)) {
      state.rentalCategory = "";
      state.rentalTier = "";
      state.rentalQuantity = "";
    }
    onStateChange();
    restoreRenderedChoiceFocus(ownershipOptions, "ownership", state.ownership);
  });

  inventoryCategory.addEventListener("change", () => {
    state.rentalCategory = inventoryCategory.value;
    onStateChange();
  });
  inventoryTier.addEventListener("change", () => {
    state.rentalTier = inventoryTier.value;
    onStateChange();
  });
  inventoryUnits.addEventListener("input", () => {
    state.rentalQuantity = inventoryUnits.value;
    invalidateEstimate();
    persist();
    requestEstimate();
  });
  qa("[data-inventory-par]").forEach((input) => input.addEventListener("change", () => {
    state.inventory.par = input.value;
    persist();
    renderProgress();
  }));
  qa("[data-inventory-customization]").forEach((input) => input.addEventListener("change", () => {
    state.inventory.customization = input.value;
    persist();
    renderProgress();
  }));

  locationInput.addEventListener("input", () => {
    state.location = locationInput.value;
    persist();
    invalidateEstimate();
    requestEstimate();
  });
  qa("[data-return-window]").forEach((input) => input.addEventListener("change", () => {
    state.returnWindow = input.value;
    persist();
    refreshProgressiveResult();
  }));
  qa("[data-access-input]").forEach((input) => input.addEventListener("change", () => {
    state.access = input.value;
    persist();
    invalidateEstimate();
    requestEstimate();
  }));
  q("[data-rhythm-toggle]")?.addEventListener("click", () => {
    const overrides = q("[data-rhythm-overrides]");
    const open = overrides.hidden;
    overrides.hidden = !open;
    q("[data-rhythm-toggle]").setAttribute("aria-expanded", String(open));
  });
  qa("[data-rhythm-input]").forEach((input) => input.addEventListener("change", () => {
    state.requestedPickups = input.value === "recommended" ? "" : input.value;
    persist();
    invalidateEstimate();
    requestEstimate();
  }));

  const resetClearAnswersConfirmation = (message = "") => {
    window.clearTimeout(clearAnswersTimer);
    clearAnswersTimer = 0;
    clearAnswersArmed = false;
    clearAnswers.textContent = "Clear answers";
    delete clearAnswers.dataset.state;
    clearAnswersStatus.textContent = message;
  };

  clearAnswers.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !clearAnswersArmed) return;
    event.preventDefault();
    resetClearAnswersConfirmation("Clear canceled.");
  });

  clearAnswers.addEventListener("click", () => {
    if (!clearAnswersArmed) {
      clearAnswersArmed = true;
      clearAnswers.textContent = "Confirm clear";
      clearAnswers.dataset.state = "confirming";
      clearAnswersStatus.textContent = "Press Confirm clear again within six seconds to erase all estimator and contact answers.";
      clearAnswersTimer = window.setTimeout(() => resetClearAnswersConfirmation("Clear canceled."), 6000);
      return;
    }

    resetClearAnswersConfirmation();
    state = defaultState();
    scaleStep = 0;
    scaleSequenceOperation = "";
    estimateRequest += 1;
    window.clearTimeout(estimateTimer);
    estimateSignature = "";
    estimateLoading = false;
    latestResult = null;
    latestRawResult = null;
    pickerOpen = false;
    operationPanel.hidden = true;
    quoteForm.reset();
    qa("[aria-invalid]", quoteForm).forEach((control) => control.removeAttribute("aria-invalid"));
    quoteError.hidden = true;
    quoteStatus.hidden = true;
    quoteStatus.textContent = "";
    window.sessionStorage.removeItem(config.storageKey);
    renderAll();
    clearAnswersStatus.textContent = "All estimator and contact answers were cleared.";
  });

  const quoteContactValidation = () => {
    const form = new FormData(quoteForm);
    const name = String(form.get("name") || "").trim();
    const business = String(form.get("business") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const preferred = String(form.get("preferredContact") || "");
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneRequired = ["phone", "either"].includes(preferred);
    const controls = {
      name: quoteForm.elements.namedItem("name"),
      business: quoteForm.elements.namedItem("business"),
      email: quoteForm.elements.namedItem("email"),
      phone: quoteForm.elements.namedItem("phone"),
      preferred: q('[name="preferredContact"]', quoteForm)
    };
    const invalidControls = [];

    qa("[aria-invalid]", quoteForm).forEach((control) => control.removeAttribute("aria-invalid"));
    if (!name) invalidControls.push(controls.name);
    if (!business) invalidControls.push(controls.business);
    if (!emailValid) invalidControls.push(controls.email);
    if (!preferred) invalidControls.push(controls.preferred);
    if (phoneRequired && !phone) invalidControls.push(controls.phone);
    invalidControls.filter(Boolean).forEach((control) => control.setAttribute("aria-invalid", "true"));

    const valid = invalidControls.length === 0;
    quoteError.textContent = phoneRequired && !phone && name && business && emailValid
      ? "Add a phone number for your selected contact preference."
      : "Complete the required contact details and select how you prefer to be reached.";
    quoteError.hidden = valid;
    return { valid, firstInvalidControl: invalidControls.find(Boolean) || null };
  };

  quoteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (quoteInFlight) return;
    const honeypot = quoteForm.elements.namedItem("_gotcha");
    if (String(honeypot?.value || "").trim()) return;
    const validation = quoteContactValidation();
    if (!validation.valid) {
      validation.firstInvalidControl?.focus();
      return;
    }
    quoteInFlight = true;
    quoteSubmissionController = new AbortController();
    const configuredTimeout = Number.parseInt(quoteForm.dataset.submitTimeout || "15000", 10);
    const timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 15000;
    const timeoutId = window.setTimeout(() => quoteSubmissionController?.abort(), timeoutMs);
    const form = new FormData(quoteForm);
    const contact = {
      businessName: String(form.get("business") || "").trim(),
      contactName: String(form.get("name") || "").trim(),
      email: String(form.get("email") || "").trim(),
      phone: String(form.get("phone") || "").trim() || null,
      preferredContact: String(form.get("preferredContact") || "email"),
      location: state.location.trim() || null,
      notes: String(form.get("notes") || "").trim() || null
    };
    const snapshot = {
      schemaVersion: "website-pricing-spine.v3",
      estimatorVersion: pricingEngine.pricingRules.version,
      source: {
        host: window.location.host,
        page: window.location.pathname,
        campaign: new URLSearchParams(window.location.search).get("utm_campaign") || null
      },
      operation: state.operation,
      operationLabel: operationForState() ? operationForState().label : "",
      goods: state.goods.slice(),
      specialtyNeeds: state.specialtyNeeds.slice(),
      scale: { ...state.scale },
      finish: state.finish.slice(),
      ownership: state.ownership || "unsure",
      rental: {
        category: state.rentalCategory || null,
        tier: state.rentalTier || null,
        quantity: positive(state.rentalQuantity) || null,
        par: state.inventory.par || null,
        customization: state.inventory.customization || null
      },
      route: {
        location: state.location.trim() || null,
        requestedPickups: state.requestedPickups || null,
        access: state.access || null
      },
      publicRecommendation: latestResult ? {
        modelVersion: latestResult.rulesVersion,
        warning: latestResult.warning,
        range: latestResult.range,
        rhythm: latestResult.rhythm,
        model: latestResult.model,
        confidence: latestResult.confidence
      } : null
    };

    quoteSubmit.disabled = true;
    quoteSubmit.textContent = "Sending…";
    quoteStatus.hidden = false;
    quoteStatus.textContent = "Sending your program to Shelton for review.";
    try {
      const notification = new FormData(quoteForm);
      notification.set("company", contact.businessName);
      notification.set("operation", snapshot.operationLabel);
      notification.set("goods", selectedGoods().map((item) => item.label).join(", "));
      notification.set("pricing_journey", JSON.stringify(snapshot));
      const durableRequest = window.fetch(pricingEngine.apiUrl(pricingEngine.pricingRules.leadPath), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": state.leadIdempotencyKey
        },
        body: JSON.stringify({
          estimateToken: latestResult ? latestResult.estimateToken : null,
          idempotencyKey: state.leadIdempotencyKey,
          contact,
          journeySnapshot: snapshot
        }),
        signal: quoteSubmissionController.signal
      });
      const notificationRequest = window.fetch(quoteForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: notification,
        signal: quoteSubmissionController.signal
      });
      const [durableResult, notificationResult] = await Promise.allSettled([durableRequest, notificationRequest]);
      const durableAccepted = durableResult.status === "fulfilled" && durableResult.value.ok;
      const fallbackAccepted = notificationResult.status === "fulfilled" && notificationResult.value.ok;
      if (!durableAccepted && !fallbackAccepted) {
        const timedOut = [durableResult, notificationResult].some((result) =>
          result.status === "rejected" && result.reason?.name === "AbortError"
        );
        const submissionError = new Error("Review intake failed.");
        if (timedOut) submissionError.name = "AbortError";
        throw submissionError;
      }

      window.sessionStorage.removeItem(config.storageKey);
      window.location.assign(quoteForm.dataset.quoteSuccess || "thank-you.html");
    } catch (error) {
      quoteStatus.hidden = false;
      quoteStatus.textContent = error?.name === "AbortError"
        ? "The request took too long. Your answers are still here; please try again."
        : "We could not send the request. Your answers are still here; please try again.";
      quoteStatus.focus();
      quoteSubmit.disabled = false;
      quoteSubmit.textContent = quoteSubmitIdleLabel;
    } finally {
      window.clearTimeout(timeoutId);
      quoteSubmissionController = null;
      quoteInFlight = false;
    }
  });

  // Keep native validation as the no-script fallback, then opt into the
  // estimator's custom validation only after its submit guard is installed.
  quoteForm.noValidate = true;

  window.addEventListener("pagehide", () => quoteSubmissionController?.abort(), { once: true });

  if ("IntersectionObserver" in window) {
    const dockBlockers = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) dockBlockers.add(entry.target);
        else dockBlockers.delete(entry.target);
      });
      estimateDock.classList.toggle("is-suppressed", dockBlockers.size > 0);
    }, { threshold: 0.1 });
    observer.observe(q("[data-range-shell]"));
    observer.observe(quoteForm);
  }

  renderOperationOptions();
  renderAll();
  if (!estimateLoading) restoreInitialHash();
}());
