(function () {
  "use strict";

  const root = document.querySelector("[data-pricing-journey]");
  const config = window.SheltonPricingJourneyConfig;
  const vectors = window.SheltonPricingJourneyVectors;
  if (!root || !config || !vectors) return;

  const searchParams = new URLSearchParams(window.location.search);
  const allowedConcepts = new Set(Object.keys(config.concepts));
  const requestedConcept = searchParams.get("concept");
  const explicitConcept = allowedConcepts.has(requestedConcept) ? requestedConcept : null;
  const reducedMotion = searchParams.get("motion") === "reduce" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const concept = explicitConcept || "label";

  const conceptPanels = Array.from(document.querySelectorAll("[data-concept-panel]"));
  const flow = document.querySelector("[data-journey-flow]");
  const operationChoices = document.querySelector("[data-operation-choices]");
  const operationSelection = document.querySelector("[data-operation-selection]");
  const operationSelectionLabel = document.querySelector("[data-operation-selection-label]");
  const goodsChoices = document.querySelector("[data-goods-choices]");
  const goodsScene = document.querySelector("[data-goods-scene]");
  const goodsEducation = document.querySelector("[data-goods-education] p");
  const goodsCapabilities = document.querySelector("[data-goods-capabilities]");
  const goodsError = document.querySelector("[data-goods-error]");
  const goodsCount = document.querySelector("[data-goods-count]");
  const programSummary = document.querySelector("[data-program-summary]");
  const programSummaryCount = document.querySelector("[data-program-summary-count]");
  const programSummaryList = document.querySelector("[data-program-summary-list]");
  const foundationHandoff = document.querySelector("[data-foundation-handoff]");
  const foundationScene = document.querySelector("[data-foundation-scene]");
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
    developmentMode: true
  });

  const restoreState = () => {
    if (explicitConcept) return createInitialState();
    try {
      const stored = JSON.parse(window.sessionStorage.getItem(config.storageKey));
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

  const setComplete = (chapter, complete = true) => {
    const chapters = new Set(state.completedChapters);
    if (complete) chapters.add(chapter);
    else chapters.delete(chapter);
    state.completedChapters = config.chapterOrder.filter((item) => chapters.has(item));
  };

  const saveState = () => {
    try {
      window.sessionStorage.setItem(config.storageKey, JSON.stringify(state));
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
    document.querySelectorAll("[data-concept-link]").forEach((link) => {
      link.setAttribute("aria-current", link.dataset.conceptLink === state.concept ? "page" : "false");
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

  const renderThread = () => {
    document.querySelectorAll("[data-thread-step]").forEach((item) => {
      const chapter = item.dataset.threadStep;
      const current = state.activeChapter === chapter || (state.activeChapter === "foundation" && chapter === "scale");
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
    const count = Number(Boolean(operation)) + Number(Boolean(state.goods.length));
    programSummary.hidden = count === 0 || state.view !== "flow";
    programSummaryCount.textContent = String(count);
    programSummaryList.replaceChildren();
    if (operation) addSummaryItem("Operation", operation.label);
    if (state.goods.length) addSummaryItem("Goods", state.goods.map((id) => config.goods[id].label).join(" · "));
  };

  const renderFlow = () => {
    if (flow) flow.hidden = state.view !== "flow";
    if (state.view !== "flow") {
      programSummary.hidden = true;
      return;
    }
    renderOperationState();
    renderGoodsState();
    renderThread();
    renderProgramSummary();
    foundationHandoff.hidden = state.activeChapter !== "foundation";
    if (!foundationHandoff.hidden) {
      vectors.renderScene(foundationScene, {
        operation: activeOperation(),
        goodsIds: state.goods,
        selectedIds: state.goods,
        selectedOnly: true,
        catalog: config.goods
      });
    }
  };

  const render = () => {
    renderConcept();
    renderFlow();
    saveState();
  };

  const focusChapter = (chapter) => {
    const target = chapter === "foundation"
      ? foundationHandoff
      : document.querySelector(`[data-chapter="${chapter}"]`);
    const heading = target?.querySelector("h2");
    window.setTimeout(() => {
      heading?.focus({ preventScroll: true });
      if (chapter === "operation") {
        window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
      } else {
        const headerHeight = document.querySelector(".journey-private-bar")?.getBoundingClientRect().height || 0;
        const threadHeight = document.querySelector(".program-thread")?.getBoundingClientRect().height || 0;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - threadHeight - 16;
        window.scrollTo({ top: Math.max(0, targetTop), behavior: reducedMotion ? "auto" : "smooth" });
      }
    }, reducedMotion ? 0 : 40);
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
      setComplete("goods", false);
      goodsChoices.dataset.operation = "";
    }

    state.operation = id;
    render();
    if (moveFocus) operationChoices.querySelector(`[data-operation-id="${id}"]`)?.focus();

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
    setComplete("goods", false);
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
    state.activeChapter = "foundation";
    render();
    focusChapter("foundation");
    announce("Goods saved. Your program foundation is ready for scale inputs.");
  };

  const editChapter = (chapter) => {
    if (!['operation', 'goods'].includes(chapter)) return;
    state.activeChapter = chapter;
    state.view = "flow";
    render();
    focusChapter(chapter);
    announce(`${chapter === "operation" ? "Operation" : "Goods"} reopened for editing.`);
  };

  const startOver = () => {
    state = createInitialState();
    try {
      window.sessionStorage.removeItem(config.storageKey);
    } catch (error) {
      // Clearing the in-memory state is sufficient when storage is unavailable.
    }
    render();
    const button = activePanel()?.querySelector("[data-begin-journey]");
    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
    button?.focus({ preventScroll: true });
    announce(`${config.concepts[state.concept].label} restored. Your private selections were cleared.`);
  };

  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-begin-journey]")) return openOperation();

    const operationChoice = event.target.closest("[data-operation-id]");
    if (operationChoice) return selectOperation(operationChoice.dataset.operationId);

    const goodsChoice = event.target.closest("[data-good-id]");
    if (goodsChoice) return toggleGood(goodsChoice.dataset.goodId);

    if (event.target.closest("[data-operation-continue]")) return completeOperation();
    if (event.target.closest("[data-goods-continue]")) return completeGoods();
    if (event.target.closest("[data-start-over]")) return startOver();

    const edit = event.target.closest("[data-edit-chapter]");
    if (edit) editChapter(edit.dataset.editChapter);
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
  render();
  if (state.view === "flow") focusChapter(state.activeChapter === "foundation" ? "foundation" : state.activeChapter);

  window.SheltonPricingJourney = {
    getState: () => JSON.parse(JSON.stringify(state)),
    openOperation,
    selectOperation,
    completeOperation,
    toggleGood,
    completeGoods,
    editChapter,
    startOver
  };
}());
