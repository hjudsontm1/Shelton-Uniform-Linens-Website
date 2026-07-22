(function () {
  "use strict";

  var root = document.querySelector("[data-pricing-experience]");
  if (!root) return;

  var comparisons = {
    hotel: {
      index: "Account 01 / 04",
      title: "Hotel linens",
      lead: "Guest-facing goods reward consistency across cleaning, finishing, and room-ready return.",
      goods: "Sheets, towels, robes, bath mats",
      soil: "Recurring guest use and cosmetic soil",
      finish: "Pressed or folded to the property standard",
      return: "Bundled or staged in linen carts",
      reason: "Occupancy, turn volume, presentation standards, storage, and service rhythm determine the actual work.",
      caption: "Hospitality account example",
      image: "assets/images/industry-hotel.jpg",
      alt: "Finished hotel linens prepared for hospitality service",
      operation: "hotel"
    },
    restaurant: {
      index: "Account 02 / 04",
      title: "Restaurant goods",
      lead: "Kitchen and dining goods combine heavy soil with a presentation standard that must hold through recurring use.",
      goods: "Chef coats, aprons, napkins, bar towels",
      soil: "Food, grease, beverage, and kitchen soil",
      finish: "Pressed garments and consistent folded goods",
      return: "Separated for kitchen and dining-room use",
      reason: "Soil treatment, garment finishing, weekly volume, and the mix of kitchen and dining goods change the handling path.",
      caption: "Food-service account example",
      image: "assets/images/hero-editorial-textiles.jpg",
      alt: "Commercial garments and linens arranged for professional service",
      operation: "restaurant"
    },
    event: {
      index: "Account 03 / 04",
      title: "Event linens",
      lead: "Presentation goods carry deadlines, stain risk, color considerations, and return requirements tied to the next event.",
      goods: "Tablecloths, napkins, runners, specialty goods",
      soil: "Food, beverage, candle wax, weather, and storage risk",
      finish: "Pressed, folded, or hung by item and fabric",
      return: "Sorted and protected for production teams",
      reason: "Event windows, specialty stain work, fabric and color, sorting, and the required return date shape the range.",
      caption: "Event-linen account example",
      image: "assets/images/industry-event.jpg",
      alt: "Formal event linens prepared for a presentation-focused account",
      operation: "event"
    },
    uniform: {
      index: "Account 04 / 04",
      title: "Uniform programs",
      lead: "Workwear is priced around garment care, finishing, staff organization, and the reliability of recurring return.",
      goods: "Uniform shirts, chef coats, jackets, workwear",
      soil: "Department-specific wear and repeated use",
      finish: "Pressed, hung, and packaged to the account standard",
      return: "Organized by department, team, or preference",
      reason: "Garment mix, soil, employee count, presentation, and account-level organization create the operating scope.",
      caption: "Uniform-account example",
      image: "assets/images/industry-uniform.jpg",
      alt: "Professional uniforms prepared for organized commercial return",
      operation: "uniform"
    }
  };

  var factors = {
    goods: {
      question: "What are we cleaning?",
      title: "The item determines the handling path.",
      body: "Flatwork, towels, garments, and specialty event goods do not move through the same cleaning and finishing workflow.",
      changes: ["Cleaning and finishing method", "Inspection and presentation standard", "Packaging and return format"],
      inputs: ["Item types and fabric notes", "Approximate pounds or pieces", "Any high-value or specialty goods"],
      label: "Goods mix",
      image: "assets/images/hero-editorial-textiles.jpg",
      alt: "A range of commercial linens, towels, and uniforms"
    },
    soil: {
      question: "What must come out?",
      title: "Not every pound requires the same cleaning work.",
      body: "Food, grease, makeup, oil, odor, mold, and event stains can change treatment, chemistry, inspection, and rewash risk.",
      changes: ["Pre-treatment and chemistry", "Cycle choice and production time", "Inspection and rewash pressure"],
      inputs: ["Primary soil and stain types", "White, colored, or mixed goods", "Any specialty treatment concerns"],
      label: "Soil and care",
      image: "assets/images/process-washers.jpg",
      alt: "Commercial washers processing white linens"
    },
    volume: {
      question: "How much work arrives, and how steadily?",
      title: "Predictability matters alongside volume.",
      body: "A steady recurring account is different from event spikes, seasonal turns, or a mixed program with several operating peaks.",
      changes: ["Production planning and capacity", "Likely service rhythm", "Staging and account controls"],
      inputs: ["Approximate weekly pounds or pieces", "Peak periods and seasonal changes", "Known occupancy, turns, shifts, or events"],
      label: "Volume and rhythm",
      image: "assets/images/process-folding.jpg",
      alt: "Finished towels moving through a commercial folding operation"
    },
    finish: {
      question: "How should the goods look when they return?",
      title: "Finishing is part of the service, not an afterthought.",
      body: "Pressed, folded, hung, bagged, bundled, and cart-ready returns carry different labor and presentation requirements.",
      changes: ["Finishing equipment and labor", "Packaging and protection", "The condition staff receives"],
      inputs: ["Pressed, folded, hung, or mixed return", "Bagging, bundling, or cart needs", "Presentation standards by item"],
      label: "Finish standard",
      image: "assets/images/process-ironer.jpg",
      alt: "Sheets and towels finished beside a commercial flatwork ironer"
    },
    account: {
      question: "How should the return be organized?",
      title: "Account handling can give time back to your staff.",
      body: "Sorting by property, department, item, or account preference can reduce on-site handling while adding real production work.",
      changes: ["Sorting and labeling requirements", "Packing and staging time", "Account-specific quality control"],
      inputs: ["Number of properties or departments", "Labeling and separation needs", "How staff stores and restocks goods"],
      label: "Account organization",
      image: "assets/images/process-folding.jpg",
      alt: "Finished commercial towels organized into consistent stacks"
    },
    route: {
      question: "How does service move through the account?",
      title: "The route is part of the operating model.",
      body: "Location, access, service rhythm, staging space, and return windows shape the practical work beyond the plant.",
      changes: ["Route feasibility and travel", "Pickup and return timing", "Driver access and handoff work"],
      inputs: ["ZIP code or city", "Loading, parking, or access notes", "Operating windows and staging space"],
      label: "Route service",
      image: "assets/images/route-delivery.jpg",
      alt: "Commercial laundry route van returning finished goods"
    }
  };

  var comparisonTabs = Array.from(root.querySelectorAll("[data-comparison]"));
  var factorTabs = Array.from(root.querySelectorAll("[data-factor]"));
  var comparisonPanel = root.querySelector("#comparison-panel");
  var factorPanel = root.querySelector("#factor-panel");
  var pendingImages = new WeakMap();

  function setText(selector, value) {
    var element = root.querySelector(selector);
    if (element) element.textContent = value;
  }

  function setList(selector, values) {
    var list = root.querySelector(selector);
    if (!list) return;
    list.replaceChildren.apply(list, values.map(function (value) {
      var item = document.createElement("li");
      item.textContent = value;
      return item;
    }));
  }

  function replaceImage(image, source, alt) {
    if (!image) return;
    image.alt = alt;
    if (image.getAttribute("src") === source) return;

    pendingImages.set(image, source);
    var preload = new Image();
    preload.onload = function () {
      if (pendingImages.get(image) === source) {
        image.src = source;
        pendingImages.delete(image);
      }
    };
    preload.src = source;
  }

  function activateTabs(tabs, key, value) {
    tabs.forEach(function (tab) {
      var selected = tab.dataset[key] === value;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
  }

  function updateEstimatorLinks(operation) {
    root.querySelectorAll("[data-estimate-link]").forEach(function (link) {
      link.href = "#inline-estimator";
      link.dataset.estimatorOperation = operation;
    });
  }

  root.addEventListener("click", function (event) {
    var link = event.target.closest("[data-estimate-link]");
    if (!link) return;
    var estimator = root.querySelector("[data-inline-pricing-estimator]");
    if (!estimator) return;
    estimator.dataset.initialOperation = link.dataset.estimatorOperation || "hotel";
  });

  function selectComparison(id, options) {
    var item = comparisons[id];
    if (!item || !comparisonPanel) return;
    var tab = comparisonTabs.find(function (button) { return button.dataset.comparison === id; });

    activateTabs(comparisonTabs, "comparison", id);
    comparisonPanel.setAttribute("aria-labelledby", tab.id);
    setText("[data-comparison-index]", item.index);
    setText("[data-comparison-title]", item.title);
    setText("[data-comparison-lead]", item.lead);
    setText("[data-comparison-goods]", item.goods);
    setText("[data-comparison-soil]", item.soil);
    setText("[data-comparison-finish]", item.finish);
    setText("[data-comparison-return]", item.return);
    setText("[data-comparison-reason]", item.reason);
    setText("[data-comparison-caption]", item.caption);
    replaceImage(root.querySelector("[data-comparison-image]"), item.image, item.alt);

    if (options && options.userInitiated) updateEstimatorLinks(item.operation);
    if (options && options.focus) tab.focus();
  }

  function selectFactor(id, options) {
    var item = factors[id];
    if (!item || !factorPanel) return;
    var tab = factorTabs.find(function (button) { return button.dataset.factor === id; });

    activateTabs(factorTabs, "factor", id);
    factorPanel.setAttribute("aria-labelledby", tab.id);
    setText("[data-factor-question]", item.question);
    setText("[data-factor-title]", item.title);
    setText("[data-factor-body]", item.body);
    setText("[data-factor-photo-label]", item.label);
    setList("[data-factor-changes]", item.changes);
    setList("[data-factor-inputs]", item.inputs);
    replaceImage(root.querySelector("[data-factor-image]"), item.image, item.alt);

    if (options && options.focus) tab.focus();
  }

  function bindTabs(tabs, key, select) {
    tabs.forEach(function (tab, index) {
      tab.addEventListener("click", function () {
        select(tab.dataset[key], { userInitiated: true });
      });

      tab.addEventListener("keydown", function (event) {
        var nextIndex;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabs.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabs.length) % tabs.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabs.length - 1;
        if (nextIndex === undefined) return;
        event.preventDefault();
        select(tabs[nextIndex].dataset[key], { userInitiated: true, focus: true });
      });
    });
  }

  bindTabs(comparisonTabs, "comparison", selectComparison);
  bindTabs(factorTabs, "factor", selectFactor);
  selectComparison("hotel");
  selectFactor("goods");
}());
