(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-learning]");
  const config = window.SheltonPricingJourneyConfig;
  const calculator = window.SheltonPricingDevelopmentRules;
  if (!root || !config || !calculator) return;

  const storageKey = "shelton-pricing-learning-v2";
  const factorLabels = {
    program: "the operation/goods mix",
    volume: "weekly poundage",
    finish: "finish and return",
    ownership: "inventory ownership",
    route: "location and route"
  };

  const defaultState = () => ({
    operation: "",
    goods: [],
    volumeMethod: "known",
    volumePounds: "",
    volumePieces: "",
    scale: {},
    goodsScale: {},
    finish: [],
    specialtyNeeds: [],
    ownership: "",
    inventory: {
      suppliedUnits: "",
      par: "",
      customization: ""
    },
    location: "",
    serviceRhythm: "recommended",
    returnWindow: "",
    access: ""
  });

  const readState = () => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey));
      if (!saved || typeof saved !== "object") return defaultState();
      return {
        ...defaultState(),
        ...saved,
        goods: Array.isArray(saved.goods) ? saved.goods : [],
        scale: saved.scale && typeof saved.scale === "object" ? saved.scale : {},
        goodsScale: saved.goodsScale && typeof saved.goodsScale === "object" ? saved.goodsScale : {},
        volumeMethod: saved.volumeMethod === "help" ? "help" : "known",
        volumePounds: saved.volumePounds || (saved.volumeMethod === "pounds" ? saved.volumeValue : ""),
        volumePieces: saved.volumePieces || (saved.volumeMethod === "pieces" ? saved.volumeValue : ""),
        finish: Array.isArray(saved.finish) ? saved.finish : [],
        specialtyNeeds: Array.isArray(saved.specialtyNeeds) ? saved.specialtyNeeds : [],
        inventory: saved.inventory && typeof saved.inventory === "object" ? saved.inventory : defaultState().inventory
      };
    } catch (error) {
      return defaultState();
    }
  };

  let state = readState();
  let latestResult = null;
  let estimatorSignature = "";
  let finishRecommendationState = { ready: false, hasProgram: false, ids: [] };
  let rhythmPanelOpen = state.serviceRhythm !== "recommended";
  let operationPanelOpen = false;
  const pieceBillingCopy = "Those pieces are charged on a per piece basis.";
  const rhythmOptionLabels = {
    weekly: "Once weekly",
    twiceWeekly: "Twice weekly",
    threeWeekly: "Three times weekly",
    weekday: "Weekdays",
    event: "Event-driven"
  };
  const rhythmCadenceDays = {
    weekly: [2],
    twiceWeekly: [0, 3],
    threeWeekly: [0, 2, 4],
    weekday: [0, 1, 2, 3, 4],
    event: [1, 4]
  };

  const operationInput = root.querySelector("[data-operation-input]");
  const operationPicker = root.querySelector("[data-operation-picker]");
  const operationTrigger = root.querySelector("[data-operation-trigger]");
  const operationPanel = root.querySelector("[data-operation-panel]");
  const operationSearch = root.querySelector("[data-operation-search]");
  const operationOptions = root.querySelector("[data-operation-options]");
  const operationEmpty = root.querySelector("[data-operation-empty]");
  const operationValue = root.querySelector("[data-operation-value]");
  const goodsOptions = root.querySelector("[data-goods-options]");
  const goodsHelp = root.querySelector("[data-goods-help]");
  const specialtyFieldset = root.querySelector("[data-specialty-fieldset]");
  const specialtyOptions = root.querySelector("[data-specialty-options]");
  const finishRecommendationTitle = root.querySelector("[data-finish-recommendation-title]");
  const finishRecommendationCopy = root.querySelector("[data-finish-recommendation-copy]");
  const finishRecommendationBasis = root.querySelector("[data-finish-recommendation-basis]");
  const finishOperation = root.querySelector("[data-finish-operation]");
  const finishGoods = root.querySelector("[data-finish-goods]");
  const finishVolume = root.querySelector("[data-finish-volume]");
  const ownershipOptions = root.querySelector("[data-ownership-options]");
  const inventoryDetails = root.querySelector("[data-inventory-details]");
  const inventoryUnits = root.querySelector("[data-inventory-units]");
  const inventoryParInputs = Array.from(root.querySelectorAll("[data-inventory-par]"));
  const inventoryCustomizationInputs = Array.from(root.querySelectorAll("[data-inventory-customization]"));
  const poundVolumeField = root.querySelector("[data-pound-volume-field]");
  const pieceVolumeField = root.querySelector("[data-piece-volume-field]");
  const poundVolumeInput = root.querySelector("[data-pound-volume-input]");
  const pieceVolumeInput = root.querySelector("[data-piece-volume-input]");
  const volumeBillingNote = root.querySelector("[data-volume-billing-note]");
  const volumeDirect = root.querySelector("[data-volume-direct]");
  const volumeEstimator = root.querySelector("[data-volume-estimator]");
  const volumeEstimatorContext = root.querySelector("[data-volume-estimator-context]");
  const volumeEstimatorFields = root.querySelector("[data-volume-estimator-fields]");
  const volumeEstimatorStatus = root.querySelector("[data-volume-estimator-status]");
  const volumeHelpConversion = root.querySelector("[data-volume-help-conversion]");
  const locationInput = root.querySelector("[data-location-input]");
  const rhythmInputs = Array.from(root.querySelectorAll("[data-rhythm-input]"));
  const rhythmUseRecommendation = rhythmInputs.find((input) => input.value === "recommended");
  const rhythmToggle = root.querySelector("[data-rhythm-toggle]");
  const rhythmOverrides = root.querySelector("[data-rhythm-overrides]");
  const rhythmOverrideNote = root.querySelector("[data-rhythm-override-note]");
  const rhythmRecommendationKicker = root.querySelector("[data-rhythm-recommendation-kicker]");
  const rhythmCadence = root.querySelector("[data-rhythm-cadence]");
  const rhythmDays = Array.from(root.querySelectorAll("[data-rhythm-day]"));
  const returnWindowInputs = Array.from(root.querySelectorAll("[data-return-window]"));
  const accessInputs = Array.from(root.querySelectorAll("[data-access-input]"));
  const rhythmRecommendationLabel = root.querySelector("[data-rhythm-recommendation-label]");
  const rhythmRecommendationReason = root.querySelector("[data-rhythm-recommendation-reason]");
  const completedCount = root.querySelector("[data-completed-count]");
  const progressDots = Array.from(root.querySelectorAll("[data-progress-dots] li"));
  const rangeLocked = root.querySelector("[data-range-locked]");
  const rangeRevealed = root.querySelector("[data-range-revealed]");
  const unlockCopy = root.querySelector("[data-unlock-copy]");
  const weeklyRange = root.querySelector("[data-weekly-range]");
  const monthlyRange = root.querySelector("[data-monthly-range]");
  const rangeStage = root.querySelector("[data-range-stage]");
  const guidanceTitle = root.querySelector("[data-range-guidance-title]");
  const guidanceCopy = root.querySelector("[data-range-guidance-copy]");
  const confidenceLabel = root.querySelector("[data-confidence-label]");
  const rhythmLabel = root.querySelector("[data-rhythm-label]");
  const modelLabel = root.querySelector("[data-model-label]");
  const rangeBreakdown = root.querySelector("[data-range-breakdown]");
  const processingRange = root.querySelector("[data-processing-range]");
  const inventoryRangeRow = root.querySelector("[data-inventory-range-row]");
  const inventoryRange = root.querySelector("[data-inventory-range]");
  const rangeReview = root.querySelector("[data-range-review]");
  const rangeReviewCopy = root.querySelector("[data-range-review-copy]");
  const rangeAssumptions = root.querySelector("[data-range-assumptions]");
  const estimateDock = root.querySelector("[data-estimate-dock]");
  const dockProgress = root.querySelector("[data-dock-progress]");
  const dockRange = root.querySelector("[data-dock-range]");
  const dockAction = root.querySelector("[data-dock-action]");
  const quoteForm = root.querySelector("[data-quote-form]");
  const quoteError = root.querySelector("[data-quote-error]");
  const quoteStatus = root.querySelector("[data-quote-status]");
  const clearAnswers = root.querySelector("[data-clear-answers]");

  const createChoice = (type, name, value, label, checked, description) => {
    const wrapper = document.createElement("label");
    const input = document.createElement("input");
    const visual = document.createElement("span");
    input.type = type;
    input.name = name;
    input.value = value;
    input.checked = checked;
    visual.textContent = label;
    if (description) {
      const small = document.createElement("small");
      small.textContent = description;
      visual.appendChild(small);
    }
    wrapper.append(input, visual);
    return wrapper;
  };

  const selectedRadioValue = (inputs) => inputs.find((input) => input.checked)?.value || "";

  const syncRadioInputs = (inputs, value) => {
    inputs.forEach((input) => {
      input.checked = input.value === (value || "");
    });
  };

  const filterOperationOptions = (query = "") => {
    const normalized = query.trim().toLowerCase();
    let visibleCount = 0;
    operationOptions.querySelectorAll("[data-operation-option]").forEach((button) => {
      const matches = !normalized || button.dataset.search.includes(normalized);
      button.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    operationEmpty.hidden = visibleCount > 0;
  };

  const syncOperationPicker = () => {
    const operation = config.operations.find((item) => item.id === operationInput.value);
    operationValue.textContent = operation?.label || "Choose the closest match";
    operationTrigger.classList.toggle("has-value", Boolean(operation));
    operationOptions.querySelectorAll("[data-operation-option]").forEach((button) => {
      button.setAttribute("aria-selected", String(button.dataset.value === operationInput.value));
    });
  };

  const setOperationPanelOpen = (open) => {
    operationPanelOpen = Boolean(open);
    operationPanel.hidden = !operationPanelOpen;
    operationTrigger.setAttribute("aria-expanded", String(operationPanelOpen));
    operationPicker.classList.toggle("is-open", operationPanelOpen);
    if (operationPanelOpen) {
      requestAnimationFrame(() => operationSearch.focus());
    } else {
      operationSearch.value = "";
      filterOperationOptions();
    }
  };

  const renderOperations = () => {
    operationOptions.replaceChildren();
    config.operations.forEach((operation) => {
      const option = document.createElement("option");
      option.value = operation.id;
      option.textContent = operation.label;
      operationInput.appendChild(option);

      const button = document.createElement("button");
      const index = document.createElement("span");
      const label = document.createElement("strong");
      button.type = "button";
      button.setAttribute("role", "option");
      button.dataset.operationOption = "";
      button.dataset.value = operation.id;
      button.dataset.search = operation.label.toLowerCase();
      index.textContent = String(operationOptions.children.length + 1).padStart(2, "0");
      label.textContent = operation.label;
      button.append(index, label);
      operationOptions.appendChild(button);
    });
    operationInput.value = state.operation;
    syncOperationPicker();
  };

  const renderGoods = () => {
    goodsOptions.replaceChildren();
    const operation = config.operations.find((item) => item.id === state.operation);
    if (!operation) {
      goodsHelp.textContent = "Select an operation to see the goods most often included in that kind of program.";
      return;
    }

    goodsHelp.textContent = "Choose every type that regularly moves through the program.";
    state.goods = state.goods.filter((id) => operation.goods.includes(id));
    operation.goods.forEach((id) => {
      const item = config.goods[id];
      if (!item) return;
      const choice = createChoice("checkbox", "goods", id, item.label, state.goods.includes(id));
      goodsOptions.appendChild(choice);
    });
  };

  const compatibleSpecialtyOptions = () => config.specialtyOptions.filter((item) => {
    const operationMatches = !item.operations?.length || item.operations.includes(state.operation);
    const goodsMatch = !item.goods?.length || state.goods.some((goodId) => item.goods.includes(goodId));
    return operationMatches && goodsMatch;
  });

  const renderSpecialty = () => {
    const available = compatibleSpecialtyOptions();
    const availableIds = new Set(available.map((item) => item.id));
    state.specialtyNeeds = state.specialtyNeeds.filter((id) => availableIds.has(id));
    specialtyOptions.replaceChildren();
    available.forEach((item) => {
      specialtyOptions.appendChild(createChoice(
        "checkbox",
        "specialty",
        item.id,
        item.label,
        state.specialtyNeeds.includes(item.id),
        item.description
      ));
    });
    specialtyFieldset.hidden = !state.operation || !state.goods.length || !available.length;
  };

  const renderOwnership = () => {
    ownershipOptions.replaceChildren();
    config.ownershipChoices.forEach((item) => {
      const choice = createChoice("radio", "ownership", item.id, item.label, state.ownership === item.id, item.description);
      ownershipOptions.appendChild(choice);
    });
    const needsInventory = state.ownership === "some" || state.ownership === "supply";
    inventoryDetails.hidden = !needsInventory;
    inventoryUnits.value = state.inventory.suppliedUnits || "";
    syncRadioInputs(inventoryParInputs, state.inventory.par);
    syncRadioInputs(inventoryCustomizationInputs, state.inventory.customization);
  };

  const positiveNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  };

  const helpProfile = () => config.helpEstimateProfiles?.[state.operation] || null;

  const billingUnitForGood = (goodId) => {
    const billing = config.billingUnits || {};
    const operationBilling = billing.byOperation?.[state.operation] || {};
    return operationBilling.goods?.[goodId]
      || operationBilling.default
      || billing.byGood?.[goodId]
      || billing.default
      || "pounds";
  };

  const hasPieceBilledGoods = () => state.goods.some((goodId) => billingUnitForGood(goodId) === "pieces");
  const hasPoundBilledGoods = () => state.goods.some((goodId) => billingUnitForGood(goodId) === "pounds");
  const pieceBilledGoods = () => state.goods.filter((goodId) => billingUnitForGood(goodId) === "pieces");
  const poundBilledGoods = () => state.goods.filter((goodId) => billingUnitForGood(goodId) === "pounds");
  const billingCopyForSelection = () => hasPoundBilledGoods()
    ? `${pieceBillingCopy} Other selected goods are charged by weight, so both measures stay separate.`
    : pieceBillingCopy;

  const estimateBasis = (basis) => {
    switch (basis) {
      case "weeklyTurns":
        return positiveNumber(state.scale.weeklyTurns);
      case "appointments":
        return positiveNumber(state.scale.appointments);
      case "eventsPerMonth":
        return positiveNumber(state.scale.eventsPerMonth) / calculator.pricingRules.monthlyWeeks;
      case "employees":
        return positiveNumber(state.scale.employees);
      case "weeklyCovers":
        return positiveNumber(state.scale.weeklyCovers);
      case "banquetEvents":
        return positiveNumber(state.scale.banquetEvents) / calculator.pricingRules.monthlyWeeks;
      case "choirMembers":
        return positiveNumber(state.scale.choirMembers);
      case "servicesAndEvents":
        return positiveNumber(state.scale.weeklyServices)
          + positiveNumber(state.scale.specialEventsPerMonth) / calculator.pricingRules.monthlyWeeks;
      case "weekly":
        return 1;
      default:
        return 0;
    }
  };

  const helpEstimatedVolume = () => {
    const profile = helpProfile();
    const empty = { pounds: 0, pieces: 0, pieceCounts: {}, complete: false };
    if (!profile || !state.goods.length) return empty;

    let pounds = 0;
    let pieces = 0;
    const pieceCounts = {};
    for (const goodId of state.goods) {
      const driverId = profile.goods[goodId];
      const driver = config.helpEstimateDrivers?.[driverId];
      const quantity = positiveNumber(state.goodsScale[goodId]);
      const basis = driver ? estimateBasis(driver.basis) : 0;
      if (!driver || quantity <= 0 || basis <= 0) return empty;
      const weeklyCount = quantity * basis;
      if (billingUnitForGood(goodId) === "pieces") {
        pieces += weeklyCount;
        pieceCounts[goodId] = weeklyCount;
      } else {
        pounds += weeklyCount * (calculator.pricingRules.goodsWeights[goodId] || 1);
      }
    }

    return { pounds, pieces, pieceCounts, complete: pounds > 0 || pieces > 0 };
  };

  const planningPounds = () => state.volumeMethod === "help"
    ? helpEstimatedVolume().pounds
    : positiveNumber(state.volumePounds);
  const planningPieces = () => state.volumeMethod === "help"
    ? helpEstimatedVolume().pieces
    : positiveNumber(state.volumePieces);
  const planningPieceCounts = () => {
    if (state.volumeMethod === "help") return helpEstimatedVolume().pieceCounts;
    const goods = pieceBilledGoods();
    const count = planningPieces();
    if (!goods.length || !count) return {};
    const each = count / goods.length;
    return Object.fromEntries(goods.map((goodId) => [goodId, each]));
  };
  const planningLoad = () => planningPounds() + Object.entries(planningPieceCounts()).reduce(
    (sum, [goodId, value]) => sum + Number(value || 0) * (calculator.pricingRules.goodsWeights[goodId] || 1),
    0
  );

  const finishOption = (id) => config.finishOptions.find((item) => item.id === id);

  const finishOptionMatchesGoods = (id) => {
    const option = finishOption(id);
    return Boolean(option && (!option.goods?.length || state.goods.some((goodId) => option.goods.includes(goodId))));
  };

  const recommendFinishIds = (pounds) => {
    const ids = [];
    const add = (id) => {
      if (!ids.includes(id) && finishOptionMatchesGoods(id)) ids.push(id);
    };
    const matches = (id) => finishOptionMatchesGoods(id);
    const presentationGoods = new Set(["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods", "tableLinens", "banquetLinens"]);
    const towelGoods = new Set(["towels", "handTowels", "bathMats", "barTowels", "faceCradleCovers"]);
    const hasFoldedGoods = matches("folded");
    const hasGarmentGoods = matches("hanging");
    const hasPresentationGoods = state.goods.some((goodId) => presentationGoods.has(goodId));
    const towelOnly = state.goods.length > 0 && state.goods.every((goodId) => towelGoods.has(goodId));

    if (hasFoldedGoods) add("folded");
    if (hasGarmentGoods || hasPresentationGoods) add("pressed");
    if (hasGarmentGoods) add("hanging");

    if (state.operation === "wholesale" && hasGarmentGoods) {
      add("poly");
    } else if ((["hotel", "casino"].includes(state.operation) || pounds >= 1000) && matches("linenCart")) {
      add("linenCart");
    } else if (towelOnly && pounds > 0 && pounds < 350) {
      add("bagged");
    } else if (["str", "events", "casino", "uniforms", "worship"].includes(state.operation)) {
      add("labeled");
    } else if (hasFoldedGoods) {
      add("bundled");
    }

    if (!ids.length) {
      const fallback = config.finishOptions.find((item) => finishOptionMatchesGoods(item.id));
      if (fallback) ids.push(fallback.id);
    }

    return ids.slice(0, 4);
  };

  const selectedGoodsSummary = () => {
    const labels = state.goods.map((id) => config.goods[id]?.label).filter(Boolean);
    if (labels.length <= 2) return labels.join(" and ");
    return `${labels[0]}, ${labels[1]}, and ${labels.length - 2} more`;
  };

  const finishVolumeBasis = () => {
    const pounds = planningPounds();
    const pieces = planningPieces();
    const qualifier = state.volumeMethod === "help" ? "Approximately " : "";
    const parts = [];
    if (pounds > 0) parts.push(`${Math.round(pounds).toLocaleString("en-US")} lb / week`);
    if (pieces > 0) parts.push(`${Math.round(pieces).toLocaleString("en-US")} pieces / week`);
    return `${qualifier}${parts.join(" + ")}`;
  };

  const finishRecommendation = () => {
    const operation = config.operations.find((item) => item.id === state.operation);
    const hasProgram = Boolean(operation && state.goods.length);
    if (!hasProgram) {
      return {
        ready: false,
        hasProgram: false,
        ids: [],
        title: "We’ll recommend how finished goods should come back.",
        copy: operation
          ? "Choose the goods that regularly move through the program, then add weekly pounds or pieces in Section 02."
          : "Choose an operation and goods in Section 01, then add weekly pounds or pieces in Section 02."
      };
    }

    const load = planningLoad();
    const ids = recommendFinishIds(load);
    const labels = ids.map((id) => finishOption(id)?.label).filter(Boolean);
    const recommendation = labels.join(" + ");
    const ready = planningPounds() > 0 || planningPieces() > 0;
    const volume = ready ? finishVolumeBasis() : "Add pounds or pieces in Section 02";
    return {
      ready,
      hasProgram: true,
      ids,
      operation: operation.label,
      goods: selectedGoodsSummary(),
      volume,
      title: ready
        ? `We recommend ${recommendation}.`
        : `Likely starting point: ${recommendation}.`,
      copy: ready
        ? `Based on this account’s type of work, selected goods, and ${volume.toLowerCase()}, this combination balances presentation, staff handling, and practical return.`
        : "This early direction comes from the type of work and goods selected above. Add weekly pounds or pieces in Section 02 to confirm the packaging and return method."
    };
  };

  const renderFinishRecommendation = () => {
    const recommendation = finishRecommendation();
    finishRecommendationState = recommendation;
    state.finish = recommendation.ids.slice();
    finishRecommendationTitle.textContent = recommendation.title;
    finishRecommendationCopy.textContent = recommendation.copy;
    finishRecommendationBasis.hidden = !recommendation.hasProgram;
    if (recommendation.hasProgram) {
      finishOperation.textContent = recommendation.operation;
      finishGoods.textContent = recommendation.goods;
      finishVolume.textContent = recommendation.volume;
    } else {
      finishOperation.textContent = "";
      finishGoods.textContent = "";
      finishVolume.textContent = "";
    }
  };

  const scaleField = (id) => (config.scaleSchemas?.[state.operation] || []).find((field) => field.id === id);

  const requiredBaseFields = () => {
    const profile = helpProfile();
    const required = new Set();
    if (!profile) return required;
    const requiredByBasis = {
      weeklyTurns: ["weeklyTurns"],
      appointments: ["appointments"],
      eventsPerMonth: ["eventsPerMonth"],
      employees: ["employees"],
      weeklyCovers: ["weeklyCovers"],
      banquetEvents: ["banquetEvents"],
      choirMembers: ["choirMembers"],
      servicesAndEvents: ["weeklyServices"],
      weekly: []
    };
    state.goods.forEach((goodId) => {
      const driver = config.helpEstimateDrivers?.[profile.goods[goodId]];
      (requiredByBasis[driver?.basis] || []).forEach((id) => required.add(id));
    });
    return required;
  };

  const visibleBaseFields = () => {
    const profile = helpProfile();
    if (!profile) return [];
    return profile.baseFields.filter((id) => {
      if (state.operation === "casino") {
        if (id === "banquetEvents") return state.goods.includes("banquetLinens");
        if (id === "restaurantOutlets") return state.goods.some((goodId) => ["chefCoats", "napkins", "tableLinens"].includes(goodId));
      }
      if (state.operation === "worship") {
        if (id === "weeklyServices" || id === "specialEventsPerMonth") return state.goods.includes("tableLinens");
        if (id === "choirMembers") return state.goods.includes("choirRobes");
      }
      return true;
    });
  };

  const createEstimatorBaseField = (field, required) => {
    const controlId = `volume-estimate-${state.operation}-${field.id}`;
    if (field.type === "select") {
      const group = document.createElement("fieldset");
      const legend = document.createElement("legend");
      const options = document.createElement("div");
      const hint = document.createElement("small");
      group.className = "calm-field volume-estimator__field volume-estimator__field--choices";
      legend.textContent = field.label;
      options.className = "editorial-choice-list editorial-choice-list--estimator";
      field.options.forEach((item, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        const visual = document.createElement("span");
        const text = document.createElement("strong");
        input.type = "radio";
        input.name = controlId;
        input.value = item.value;
        input.required = required;
        input.dataset.volumeEstimateBase = field.id;
        input.checked = state.scale[field.id] === item.value;
        input.id = `${controlId}-${index}`;
        text.textContent = item.label;
        visual.appendChild(text);
        label.append(input, visual);
        options.appendChild(label);
      });
      hint.textContent = field.hint;
      group.append(legend, options, hint);
      return group;
    }

    const label = document.createElement("label");
    const title = document.createElement("span");
    const control = document.createElement("input");
    const unit = document.createElement("em");
    label.className = "calm-field volume-estimator__field";
    label.htmlFor = controlId;
    title.textContent = field.label;
    if (field.unit) {
      unit.textContent = field.unit;
      title.append(" ", unit);
    }
    control.type = "number";
    control.min = field.min;
    control.max = field.max;
    control.step = field.step || 1;
    control.inputMode = "numeric";
    control.id = controlId;
    control.dataset.volumeEstimateBase = field.id;
    control.required = required;
    control.value = state.scale[field.id] || "";

    const hint = document.createElement("small");
    hint.textContent = field.hint;
    label.append(title, control, hint);
    return label;
  };

  const createEstimatorGoodsField = (goodId, driver) => {
    const good = config.goods[goodId];
    const label = document.createElement("label");
    const title = document.createElement("span");
    const control = document.createElement("input");
    const unit = document.createElement("em");
    const controlId = `volume-estimate-good-${goodId}`;
    label.className = "calm-field volume-estimator__field volume-estimator__field--good";
    label.htmlFor = controlId;
    title.textContent = `${good.label} ${driver.label}`;
    unit.textContent = driver.unit;
    title.append(" ", unit);
    control.id = controlId;
    control.type = "number";
    control.min = "0.1";
    control.max = "1000000";
    control.step = "0.1";
    control.inputMode = "decimal";
    control.required = true;
    control.dataset.volumeEstimateGood = goodId;
    control.value = state.goodsScale[goodId] || "";
    label.append(title, control);
    return label;
  };

  const buildEstimatorFields = () => {
    volumeEstimatorFields.replaceChildren();
    const profile = helpProfile();
    if (!profile || !state.goods.length) return;

    const required = requiredBaseFields();
    const baseFields = visibleBaseFields().map(scaleField).filter(Boolean);
    if (baseFields.length) {
      const group = document.createElement("fieldset");
      const legend = document.createElement("legend");
      const fields = document.createElement("div");
      group.className = "volume-estimator__group";
      legend.textContent = "Your operation";
      fields.className = "volume-estimator__grid";
      baseFields.forEach((field) => fields.appendChild(createEstimatorBaseField(field, required.has(field.id))));
      group.append(legend, fields);
      volumeEstimatorFields.appendChild(group);
    }

    const goodsGroup = document.createElement("fieldset");
    const goodsLegend = document.createElement("legend");
    const goodsFields = document.createElement("div");
    goodsGroup.className = "volume-estimator__group";
    goodsLegend.textContent = "Selected goods";
    goodsFields.className = "volume-estimator__grid";
    state.goods.forEach((goodId) => {
      const driver = config.helpEstimateDrivers?.[profile.goods[goodId]];
      if (driver && config.goods[goodId]) goodsFields.appendChild(createEstimatorGoodsField(goodId, driver));
    });
    goodsGroup.append(goodsLegend, goodsFields);
    volumeEstimatorFields.appendChild(goodsGroup);
  };

  const renderHelpEstimator = () => {
    const operation = config.operations.find((item) => item.id === state.operation);
    const signature = `${state.operation}|${state.goods.join(",")}`;
    if (signature !== estimatorSignature) {
      estimatorSignature = signature;
      buildEstimatorFields();
    }

    if (!operation) {
      volumeEstimatorContext.textContent = "Choose the operation in section 01 to see tailored prompts.";
    } else if (!state.goods.length) {
      volumeEstimatorContext.textContent = "Choose the goods in section 01 to build this estimate.";
    } else {
      volumeEstimatorContext.textContent = `${operation.label} · ${state.goods.length} selected ${state.goods.length === 1 ? "good" : "goods"}`;
    }

    const estimate = helpEstimatedVolume();
    const canEstimate = Boolean(operation && state.goods.length && estimate.complete);
    const usesPieceBilling = hasPieceBilledGoods();
    volumeEstimatorStatus.hidden = canEstimate;
    volumeEstimatorStatus.textContent = operation && state.goods.length
      ? usesPieceBilling
        ? "Complete the prompts that apply to finish this estimate."
        : "Complete the prompts that apply to reveal an estimated weekly weight."
      : "Your estimate will adapt to the operation and goods selected above.";
    const estimateParts = [];
    if (estimate.pounds > 0) estimateParts.push(`${Math.round(estimate.pounds).toLocaleString("en-US")} lb/week`);
    if (estimate.pieces > 0) estimateParts.push(`${Math.round(estimate.pieces).toLocaleString("en-US")} pieces/week`);
    volumeHelpConversion.hidden = !usesPieceBilling && !canEstimate;
    volumeHelpConversion.textContent = canEstimate
      ? `Estimated weekly program: ${estimateParts.join(" + ")}. ${usesPieceBilling ? billingCopyForSelection() : ""}`.trim()
      : usesPieceBilling
        ? billingCopyForSelection()
        : "";
  };

  const renderVolume = () => {
    const methodInput = root.querySelector(`[name="volumeMethod"][value="${state.volumeMethod}"]`);
    if (methodInput) methodInput.checked = true;
    const usesEstimator = state.volumeMethod === "help";
    volumeDirect.hidden = usesEstimator;
    volumeEstimator.hidden = !usesEstimator;
    poundVolumeInput.value = state.volumePounds || "";
    pieceVolumeInput.value = state.volumePieces || "";
    const showPounds = !state.goods.length || hasPoundBilledGoods();
    const showPieces = !state.goods.length || hasPieceBilledGoods();
    poundVolumeField.hidden = !showPounds;
    pieceVolumeField.hidden = !showPieces;
    volumeBillingNote.textContent = !state.goods.length
      ? "Choose the goods above and this section will show the measure that applies."
      : showPounds && showPieces
        ? "This is a mixed program. Enter pounds and pieces separately; the estimate will not convert piece-billed goods into pounds."
        : showPieces
          ? pieceBillingCopy
          : "The selected goods are planned by weekly weight.";

    if (usesEstimator) renderHelpEstimator();
  };

  const validLocation = () => {
    const value = state.location.trim();
    return /^\d{5}$/.test(value) || /[a-zA-Z]{2,}/.test(value);
  };

  const completion = () => ({
    program: Boolean(state.operation && state.goods.length),
    volume: planningPounds() > 0 || planningPieces() > 0,
    finish: finishRecommendationState.ready,
    ownership: Boolean(state.ownership),
    route: validLocation()
  });

  const roundFive = (value) => Math.max(5, Math.round(value / 5) * 5);
  const money = (value) => `$${Math.round(value).toLocaleString("en-US")}`;

  const calculationState = () => ({
    operation: state.operation || "other",
    goods: state.goods.slice(),
    scale: {
      ...state.scale,
      knownPounds: state.volumeMethod === "help" ? 0 : planningPounds(),
      knownPieces: state.volumeMethod === "help" ? 0 : planningPieces(),
      estimatedPounds: state.volumeMethod === "help" ? planningPounds() : 0,
      estimatedPieces: state.volumeMethod === "help" ? planningPieces() : 0,
      weeklyPieceCounts: planningPieceCounts(),
      pieceGoods: pieceBilledGoods(),
      storage: state.scale.storage || "limited"
    },
    finish: state.finish.slice(),
    specialtyNeeds: state.specialtyNeeds.slice(),
    ownership: state.ownership || "unsure",
    inventory: { ...state.inventory },
    serviceRhythm: state.serviceRhythm || "recommended",
    location: {
      value: state.location.trim(),
      kind: /^\d{5}$/.test(state.location.trim()) ? "zip" : "city"
    },
    route: {
      returnWindow: state.returnWindow,
      access: state.access
    }
  });

  const adjustedRange = (result, count) => {
    if (count === 5) return result.range;
    const midpoint = (result.range.weeklyLow + result.range.weeklyHigh) / 2;
    const spread = count === 3 ? 0.38 : 0.24;
    const weeklyLow = roundFive(midpoint * (1 - spread));
    const weeklyHigh = roundFive(midpoint * (1 + spread));
    return {
      weeklyLow,
      weeklyHigh,
      monthlyLow: roundFive(weeklyLow * calculator.pricingRules.monthlyWeeks),
      monthlyHigh: roundFive(weeklyHigh * calculator.pricingRules.monthlyWeeks)
    };
  };

  const serialOxford = (items) => {
    if (items.length === 1) return items[0];
    if (items.length === 2) return `${items[0]} and ${items[1]}`;
    return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
  };

  const moneyRange = (range) => `${money(range.weeklyLow)}–${money(range.weeklyHigh)} / week`;

  const setRhythmPanelOpen = (open) => {
    rhythmPanelOpen = open;
    rhythmOverrides.hidden = !open;
    rhythmToggle.setAttribute("aria-expanded", String(open));
    rhythmToggle.textContent = open ? "Hide alternate rhythms" : "Choose a different rhythm";
  };

  const syncRhythmInputs = () => {
    const selected = state.serviceRhythm || "recommended";
    rhythmInputs.forEach((input) => {
      input.checked = input.value === selected;
    });
  };

  const renderRhythmCadence = (rhythmId) => {
    const activeDays = rhythmCadenceDays[rhythmId] || [];
    rhythmCadence.dataset.rhythm = rhythmId || "pending";
    rhythmDays.forEach((day, index) => {
      day.classList.toggle("is-active", activeDays.includes(index));
    });
  };

  const renderRhythmRecommendation = () => {
    if (!state.operation || (!planningPounds() && !planningPieces())) {
      rhythmRecommendationKicker.textContent = "Recommendation pending";
      rhythmRecommendationLabel.textContent = "Add the operation and weekly volume to see a recommendation.";
      rhythmRecommendationReason.textContent = "Shelton balances estimated movement, storage, and the type of account before suggesting a route rhythm.";
      rhythmUseRecommendation.disabled = true;
      renderRhythmCadence("");
      if (state.serviceRhythm !== "recommended") {
        rhythmOverrideNote.hidden = false;
        rhythmOverrideNote.textContent = `Your ${rhythmOptionLabels[state.serviceRhythm] || "preferred"} rhythm is saved. Add the operation and weekly volume to compare it with Shelton's recommendation.`;
      } else {
        rhythmOverrideNote.hidden = true;
      }
      return;
    }
    const recommendationState = calculationState();
    recommendationState.serviceRhythm = "recommended";
    const rhythm = calculator.recommendRhythm(recommendationState, planningLoad(), calculator.pricingRules);
    rhythmRecommendationKicker.textContent = "Shelton's recommendation";
    rhythmRecommendationLabel.textContent = rhythm.recommendedLabel;
    rhythmRecommendationReason.textContent = rhythm.reason;
    rhythmUseRecommendation.disabled = false;
    renderRhythmCadence(rhythm.recommendedId);
    if (state.serviceRhythm !== "recommended") {
      const selectedLabel = rhythmOptionLabels[state.serviceRhythm] || "alternate rhythm";
      rhythmOverrideNote.hidden = false;
      rhythmOverrideNote.textContent = state.serviceRhythm === rhythm.recommendedId
        ? `${selectedLabel} matches Shelton's current recommendation.`
        : `You selected ${selectedLabel}. Because it differs from Shelton's recommendation, the planning range may widen or require route review.`;
    } else {
      rhythmOverrideNote.hidden = true;
    }
  };

  const renderResultSupport = (result, count) => {
    const showBreakdown = count === 5 && (result.inventoryRange || result.inventoryExcluded);
    rangeBreakdown.hidden = !showBreakdown;
    if (showBreakdown) {
      processingRange.textContent = moneyRange(result.processingRange);
      inventoryRangeRow.hidden = false;
      inventoryRange.textContent = result.inventoryRange ? moneyRange(result.inventoryRange) : "Not included yet";
    }

    const reviews = result.manualReviewReasons || [];
    rangeReview.hidden = !reviews.length;
    rangeReviewCopy.textContent = reviews.join(" ");
    rangeAssumptions.replaceChildren();
    (result.assumptions || []).forEach((assumption) => {
      const item = document.createElement("li");
      item.textContent = assumption;
      rangeAssumptions.appendChild(item);
    });
  };

  const updateResult = () => {
    const completed = completion();
    const completedKeys = Object.keys(completed).filter((key) => completed[key]);
    const missingKeys = Object.keys(completed).filter((key) => !completed[key]);
    const count = completedKeys.length;

    completedCount.textContent = `${count} of 5 ${count === 1 ? "factor" : "factors"}`;
    progressDots.forEach((dot, index) => dot.classList.toggle("is-complete", index < count));
    Object.entries(completed).forEach(([key, value]) => {
      const label = root.querySelector(`[data-factor-state="${key}"]`);
      if (!label) return;
      label.textContent = key === "finish"
        ? value
          ? "Recommendation ready"
          : finishRecommendationState.hasProgram
            ? "Add weekly volume"
            : "Waiting for estimator"
        : value
          ? "Included in your range"
          : "Optional";
      label.classList.toggle("is-complete", value);
    });

    if (count < 3) {
      latestResult = null;
      rangeLocked.hidden = false;
      rangeRevealed.hidden = true;
      rangeBreakdown.hidden = true;
      rangeReview.hidden = true;
      rangeAssumptions.replaceChildren();
      const remaining = 3 - count;
      unlockCopy.textContent = count === 0
        ? "Answer any three factors to reveal an early planning range."
        : `Answer ${remaining} more ${remaining === 1 ? "factor" : "factors"} to reveal an early planning range.`;
    } else {
      const result = calculator.calculatePlanningRange(calculationState(), calculator.pricingRules);
      const range = adjustedRange(result, count);
      latestResult = { ...result, range, completed, count };
      rangeLocked.hidden = true;
      rangeRevealed.hidden = false;
      weeklyRange.textContent = `${money(range.weeklyLow)}–${money(range.weeklyHigh)}`;
      monthlyRange.textContent = `${money(range.monthlyLow)}–${money(range.monthlyHigh)} in a typical month`;
      rhythmLabel.textContent = result.rhythm.label;
      modelLabel.textContent = result.model.label;
      renderResultSupport(result, count);

      if (count === 3) {
        rangeStage.textContent = "Early planning range · 3 of 5 factors";
        confidenceLabel.textContent = "Early direction";
        guidanceTitle.textContent = "Broad by design";
        guidanceCopy.textContent = `Add ${serialOxford(missingKeys.map((key) => factorLabels[key]))} to narrow this range. The wider band protects against false precision while those details are still unknown.`;
      } else if (count === 4) {
        rangeStage.textContent = "Refining range · 4 of 5 factors";
        confidenceLabel.textContent = "Useful planning confidence";
        guidanceTitle.textContent = "One detail will tighten it further";
        guidanceCopy.textContent = `Add ${factorLabels[missingKeys[0]]} for the most informed version of this planning range.`;
      } else {
        rangeStage.textContent = "Most informed planning range · 5 of 5 factors";
        confidenceLabel.textContent = result.confidence.level;
        guidanceTitle.textContent = result.manualReviewReasons.length ? "Needs Shelton review" : "Ready for Shelton review";
        guidanceCopy.textContent = result.confidence.explanation;
      }
    }

    if (count > 0) {
      estimateDock.hidden = false;
      dockProgress.textContent = `${count} of 5 ${count === 1 ? "factor" : "factors"}`;
      if (count < 3) {
        const remaining = 3 - count;
        dockRange.textContent = `Answer ${remaining} more to reveal your range`;
        dockAction.textContent = "View progress";
      } else {
        dockRange.textContent = weeklyRange.textContent + " / week";
        dockAction.textContent = count < 5 ? "See how to narrow it" : "View full range";
      }
    } else {
      estimateDock.hidden = true;
    }
  };

  const saveAndUpdate = () => {
    renderSpecialty();
    renderVolume();
    renderFinishRecommendation();
    renderOwnership();
    renderRhythmRecommendation();
    sessionStorage.setItem(storageKey, JSON.stringify(state));
    updateResult();
  };

  operationInput.addEventListener("change", () => {
    state.operation = operationInput.value;
    const operation = config.operations.find((item) => item.id === state.operation);
    state.goods = operation ? state.goods.filter((id) => operation.goods.includes(id)) : [];
    state.volumePounds = "";
    state.volumePieces = "";
    state.scale = {};
    state.goodsScale = {};
    estimatorSignature = "";
    renderGoods();
    syncOperationPicker();
    setOperationPanelOpen(false);
    saveAndUpdate();
  });

  operationTrigger.addEventListener("click", () => {
    setOperationPanelOpen(!operationPanelOpen);
  });

  operationSearch.addEventListener("input", () => {
    filterOperationOptions(operationSearch.value);
  });

  operationSearch.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown") return;
    const firstVisible = Array.from(operationOptions.querySelectorAll("[data-operation-option]")).find((button) => !button.hidden);
    if (!firstVisible) return;
    event.preventDefault();
    firstVisible.focus();
  });

  operationOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-operation-option]");
    if (!button) return;
    operationInput.value = button.dataset.value;
    operationInput.dispatchEvent(new Event("change", { bubbles: true }));
    operationTrigger.focus();
  });

  operationPicker.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !operationPanelOpen) return;
    setOperationPanelOpen(false);
    operationTrigger.focus();
  });

  document.addEventListener("click", (event) => {
    if (!operationPanelOpen || operationPicker.contains(event.target)) return;
    setOperationPanelOpen(false);
  });

  goodsOptions.addEventListener("change", (event) => {
    if (!event.target.matches("input[name='goods']")) return;
    state.goods = Array.from(goodsOptions.querySelectorAll("input:checked")).map((input) => input.value);
    if (!hasPoundBilledGoods()) state.volumePounds = "";
    if (!hasPieceBilledGoods()) state.volumePieces = "";
    state.goodsScale = Object.fromEntries(Object.entries(state.goodsScale).filter(([id]) => state.goods.includes(id)));
    estimatorSignature = "";
    saveAndUpdate();
  });

  specialtyOptions.addEventListener("change", (event) => {
    if (!event.target.matches("input[name='specialty']")) return;
    state.specialtyNeeds = Array.from(specialtyOptions.querySelectorAll("input:checked")).map((input) => input.value);
    saveAndUpdate();
  });

  root.querySelector("[data-volume-methods]").addEventListener("change", (event) => {
    if (!event.target.matches("input[name='volumeMethod']")) return;
    state.volumeMethod = event.target.value;
    saveAndUpdate();
  });

  poundVolumeInput.addEventListener("input", () => {
    state.volumePounds = poundVolumeInput.value;
    saveAndUpdate();
  });

  pieceVolumeInput.addEventListener("input", () => {
    state.volumePieces = pieceVolumeInput.value;
    saveAndUpdate();
  });

  const updateEstimatorValue = (event) => {
    const baseId = event.target.dataset.volumeEstimateBase;
    const goodId = event.target.dataset.volumeEstimateGood;
    if (baseId) state.scale[baseId] = event.target.value;
    if (goodId) state.goodsScale[goodId] = event.target.value;
    if (baseId || goodId) saveAndUpdate();
  };

  volumeEstimatorFields.addEventListener("input", updateEstimatorValue);
  volumeEstimatorFields.addEventListener("change", (event) => {
    if (event.target.matches("[data-volume-estimate-base], [data-volume-estimate-good]")) updateEstimatorValue(event);
  });

  ownershipOptions.addEventListener("change", (event) => {
    if (!event.target.matches("input[name='ownership']")) return;
    state.ownership = event.target.value;
    saveAndUpdate();
  });

  const updateInventory = () => {
    state.inventory = {
      suppliedUnits: inventoryUnits.value,
      par: selectedRadioValue(inventoryParInputs),
      customization: selectedRadioValue(inventoryCustomizationInputs)
    };
    saveAndUpdate();
  };

  inventoryUnits.addEventListener("input", updateInventory);
  inventoryParInputs.forEach((input) => input.addEventListener("change", updateInventory));
  inventoryCustomizationInputs.forEach((input) => input.addEventListener("change", updateInventory));

  locationInput.addEventListener("input", () => {
    state.location = locationInput.value;
    saveAndUpdate();
  });

  rhythmInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      state.serviceRhythm = input.value;
      if (input.value === "recommended") setRhythmPanelOpen(false);
      else setRhythmPanelOpen(true);
      saveAndUpdate();
    });
  });

  rhythmToggle.addEventListener("click", () => {
    setRhythmPanelOpen(!rhythmPanelOpen);
  });

  returnWindowInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      state.returnWindow = input.value;
      saveAndUpdate();
    });
  });

  accessInputs.forEach((input) => {
    input.addEventListener("change", () => {
      if (!input.checked) return;
      state.access = input.value;
      saveAndUpdate();
    });
  });

  clearAnswers.addEventListener("click", () => {
    state = defaultState();
    estimatorSignature = "";
    sessionStorage.removeItem(storageKey);
    operationInput.value = "";
    syncOperationPicker();
    setOperationPanelOpen(false);
    renderGoods();
    renderSpecialty();
    renderOwnership();
    renderVolume();
    renderFinishRecommendation();
    locationInput.value = "";
    syncRhythmInputs();
    setRhythmPanelOpen(false);
    syncRadioInputs(returnWindowInputs, "");
    syncRadioInputs(accessInputs, "");
    quoteError.hidden = true;
    quoteStatus.hidden = true;
    renderRhythmRecommendation();
    updateResult();
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(quoteForm);
    const email = String(formData.get("email") || "").trim();
    const required = ["name", "business"].every((key) => String(formData.get(key) || "").trim());
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!required || !validEmail) {
      quoteError.hidden = false;
      return;
    }

    quoteError.hidden = true;
    const payload = {
      createdAt: new Date().toISOString(),
      contact: Object.fromEntries(formData.entries()),
      pricingInputs: state,
      planningResult: latestResult ? {
        weeklyRange: latestResult.range,
        processingRange: latestResult.processingRange,
        inventoryRange: latestResult.inventoryRange,
        completedFactors: latestResult.count,
        weeklyPounds: latestResult.weeklyPounds,
        weeklyPieces: latestResult.weeklyPieces,
        rhythm: latestResult.rhythm,
        model: latestResult.model,
        confidence: latestResult.confidence,
        manualReviewReasons: latestResult.manualReviewReasons,
        assumptions: latestResult.assumptions,
        rulesVersion: latestResult.rulesVersion
      } : null,
      status: "development payload — connect to Shelton quote endpoint"
    };
    sessionStorage.setItem("shelton-pricing-quote-payload", JSON.stringify(payload));
    quoteStatus.hidden = false;
    quoteStatus.textContent = "Your pricing answers and contact details are prepared together. In this development build, the request is saved locally and has not been sent.";
    quoteStatus.focus();
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const inResult = entries.some((entry) => entry.isIntersecting);
      estimateDock.classList.toggle("is-suppressed", inResult);
    }, { threshold: 0.1 });
    observer.observe(root.querySelector("[data-range-shell]"));
    observer.observe(root.querySelector("[data-quote-form]"));
  }

  renderOperations();
  renderGoods();
  renderSpecialty();
  renderOwnership();
  renderVolume();
  renderFinishRecommendation();
  locationInput.value = state.location;
  syncRhythmInputs();
  setRhythmPanelOpen(rhythmPanelOpen);
  syncRadioInputs(returnWindowInputs, state.returnWindow);
  syncRadioInputs(accessInputs, state.access);
  renderRhythmRecommendation();
  updateResult();
}());
