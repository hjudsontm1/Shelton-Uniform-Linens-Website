(function () {
  "use strict";

  const pricingRules = {
    version: "development-2026-07-21",
    developmentOnly: true,
    warning: "HYPOTHETICAL DEVELOPMENT ESTIMATE - NOT APPROVED PRICING",
    competitivePositioning: "Quality-first service with pricing built to compete.",
    monthlyWeeks: 4.33,
    range: { low: 0.88, high: 1.14 },
    operationRates: {
      hotel: { base: 145, unit: 1.18 },
      str: { base: 155, unit: 1.22 },
      spa: { base: 120, unit: 1.34 },
      gym: { base: 115, unit: 1.08 },
      events: { base: 180, unit: 1.42 },
      restaurant: { base: 135, unit: 1.28 },
      casino: { base: 240, unit: 1.16 },
      uniforms: { base: 140, unit: 1.3 },
      wholesale: { base: 210, unit: 0.92 },
      worship: { base: 145, unit: 1.3 },
      other: { base: 145, unit: 1.3 }
    },
    pieceRates: {
      default: 1.25,
      tableLinens: 1.45,
      banquetLinens: 1.65,
      robes: 3.75,
      choirRobes: 4.5,
      specialtyGarments: 4.75
    },
    finishFactors: {
      folded: 0.02,
      pressed: 0.2,
      hanging: 0.15,
      poly: 0.07,
      bundled: 0.03,
      bagged: 0.03,
      linenCart: 0.06,
      labeled: 0.08
    },
    specialtyFactors: {
      heavySoil: 0.12,
      whiteRetention: 0.08,
      colorRetention: 0.09,
      moldTreatment: 0.2,
      odor: 0.08,
      delicate: 0.16,
      deadline: 0.14,
      propertySort: 0.1,
      departmentSort: 0.1
    },
    inventoryWeeklyPerPiece: {
      hybrid: 0.07,
      rental: 0.12
    },
    volumeBands: [
      { minimum: 10000, factor: 0.84 },
      { minimum: 3000, factor: 0.9 },
      { minimum: 1000, factor: 0.95 },
      { minimum: 0, factor: 1 }
    ],
    rhythmThresholds: {
      weekly: 350,
      twiceWeekly: 1100,
      threeWeekly: 2500
    },
    reviewThresholds: {
      loadEquivalent: 6000,
      pieces: 8000
    },
    goodsWeights: {
      sheets: 3.2,
      towels: 0.65,
      handTowels: 0.35,
      bathMats: 1.05,
      robes: 2.2,
      blankets: 4.8,
      duvetCovers: 3.4,
      faceCradleCovers: 0.25,
      tablecloths: 2.1,
      napkins: 0.18,
      runners: 0.7,
      skirting: 3.2,
      chairCovers: 1.15,
      specialtyEventGoods: 1.8,
      chefCoats: 1.25,
      aprons: 0.75,
      barTowels: 0.35,
      tableLinens: 1.1,
      casinoUniforms: 1.4,
      banquetLinens: 1.5,
      uniformShirts: 0.65,
      workwear: 1.35,
      jackets: 1.8,
      shirts: 0.6,
      suits: 2.2,
      dresses: 1.4,
      specialtyGarments: 1.5,
      choirRobes: 2.1
    }
  };

  const numberValue = (source, key, fallback = 0) => {
    const value = Number(source?.[key]);
    return Number.isFinite(value) ? value : fallback;
  };

  const roundToFive = (value) => Math.max(5, Math.round(value / 5) * 5);

  const rangeFor = (weekly, rules, expansion = 0) => {
    const low = roundToFive(weekly * Math.max(0.62, rules.range.low - expansion * 0.5));
    const high = roundToFive(weekly * (rules.range.high + expansion));
    return {
      weeklyLow: low,
      weeklyHigh: high,
      monthlyLow: roundToFive(low * rules.monthlyWeeks),
      monthlyHigh: roundToFive(high * rules.monthlyWeeks)
    };
  };

  const sumRanges = (first, second) => ({
    weeklyLow: first.weeklyLow + second.weeklyLow,
    weeklyHigh: first.weeklyHigh + second.weeklyHigh,
    monthlyLow: first.monthlyLow + second.monthlyLow,
    monthlyHigh: first.monthlyHigh + second.monthlyHigh
  });

  const averageGoodsWeight = (state, rules) => {
    const weights = (state.goods || []).map((id) => rules.goodsWeights[id] || 1);
    return weights.length ? weights.reduce((sum, value) => sum + value, 0) / weights.length : 1;
  };

  const weeklyPounds = (state) => numberValue(state.scale, "knownPounds") || numberValue(state.scale, "estimatedPounds");
  const weeklyPieces = (state) => numberValue(state.scale, "knownPieces") || numberValue(state.scale, "estimatedPieces");

  const pieceServiceValue = (state, rules) => {
    const counts = state.scale?.weeklyPieceCounts || {};
    const entries = Object.entries(counts).filter(([, value]) => Number(value) > 0);
    if (entries.length) {
      return entries.reduce((sum, [goodId, value]) => {
        const rate = rules.pieceRates[goodId] || rules.pieceRates.default;
        return sum + Number(value) * rate;
      }, 0);
    }
    const count = weeklyPieces(state);
    if (!count) return 0;
    const pieceGoods = state.scale?.pieceGoods || state.goods || [];
    const rates = pieceGoods.map((id) => rules.pieceRates[id] || rules.pieceRates.default);
    const averageRate = rates.length ? rates.reduce((sum, value) => sum + value, 0) / rates.length : rules.pieceRates.default;
    return count * averageRate;
  };

  const loadEquivalent = (state, rules) => {
    const pounds = weeklyPounds(state);
    const counts = state.scale?.weeklyPieceCounts || {};
    const pieceLoad = Object.keys(counts).length
      ? Object.entries(counts).reduce((sum, [goodId, value]) => sum + Number(value || 0) * (rules.goodsWeights[goodId] || 1), 0)
      : weeklyPieces(state) * averageGoodsWeight(state, rules);
    return pounds + pieceLoad;
  };

  const recommendedModel = (state) => {
    const choices = {
      own: {
        id: "cog",
        label: "Customer-Owned Goods",
        reason: "The starting structure centers on cleaning, finishing, packaging, and return for goods you already own."
      },
      some: {
        id: "hybrid",
        label: "Hybrid Program",
        reason: "Owned goods and supplied inventory are considered as separate parts of one program."
      },
      supply: {
        id: "rental",
        label: "Rental Program",
        reason: "The planning structure considers supplied inventory separately from recurring processing."
      },
      unsure: {
        id: "hybrid",
        label: "Hybrid Program",
        reason: "A hybrid starting point keeps owned and supplied inventory available for account review."
      }
    };
    return choices[state.ownership] || choices.unsure;
  };

  const rhythmOptions = {
    weekly: { rank: 1, label: "Once-weekly commercial pickup and return" },
    twiceWeekly: { rank: 2, label: "Twice-weekly commercial pickup and return" },
    threeWeekly: { rank: 3, label: "Three-times-weekly commercial pickup and return" },
    weekday: { rank: 4, label: "Weekday commercial pickup and return" },
    event: { rank: 3, label: "Event-scheduled commercial pickup and return" }
  };

  const recommendRhythm = (state, weeklyLoad, rules = pricingRules) => {
    let recommendedId = "weekly";
    let reason = "The recommendation balances estimated movement, operating rhythm, and the storage information provided.";

    if (state.operation === "events" || state.operation === "wholesale") {
      recommendedId = "event";
      reason = "Event calendars, production windows, and return priorities shape this recommendation more reliably than a generic weekly preference.";
    } else {
      const tightStorage = state.scale?.storage === "tight";
      const thresholds = {
        weekly: rules.rhythmThresholds.weekly * (tightStorage ? 0.72 : 1),
        twiceWeekly: rules.rhythmThresholds.twiceWeekly * (tightStorage ? 0.78 : 1),
        threeWeekly: rules.rhythmThresholds.threeWeekly * (tightStorage ? 0.84 : 1)
      };
      if (weeklyLoad > thresholds.threeWeekly) recommendedId = "weekday";
      else if (weeklyLoad > thresholds.twiceWeekly) recommendedId = "threeWeekly";
      else if (weeklyLoad > thresholds.weekly) recommendedId = "twiceWeekly";
      if (tightStorage) reason = "Estimated movement and tight clean-goods storage support a shorter interval between returns.";
    }

    const preferredId = state.serviceRhythm && state.serviceRhythm !== "recommended" ? state.serviceRhythm : recommendedId;
    const recommended = rhythmOptions[recommendedId];
    const selected = rhythmOptions[preferredId] || recommended;
    let override = null;
    let priceFactor = 1;
    let rangeExpansion = 0;

    if (preferredId !== recommendedId) {
      if (preferredId === "event" || recommendedId === "event") {
        override = "review";
        rangeExpansion = 0.12;
      } else if (selected.rank > recommended.rank) {
        override = "moreFrequent";
        priceFactor = 1 + (selected.rank - recommended.rank) * 0.06;
        rangeExpansion = 0.05;
      } else {
        override = "lessFrequent";
        rangeExpansion = 0.14;
      }
    }

    return {
      id: preferredId,
      label: selected.label,
      reason,
      recommendedId,
      recommendedLabel: recommended.label,
      override,
      priceFactor,
      rangeExpansion
    };
  };

  const manualReviewReasons = (state, load, pieces, rhythm, rules) => {
    const reasons = [];
    const specialtyReviews = {
      moldTreatment: "Specialty mold treatment needs item-level evaluation.",
      delicate: "Delicate or specialty goods need handling review.",
      deadline: "A production deadline needs capacity confirmation.",
      heavySoil: "Repeated heavy soil needs a wash-process review."
    };
    (state.specialtyNeeds || []).forEach((id) => {
      if (specialtyReviews[id]) reasons.push(specialtyReviews[id]);
    });
    if (load > rules.reviewThresholds.loadEquivalent || pieces > rules.reviewThresholds.pieces) {
      reasons.push("The estimated program size needs a plant-capacity review.");
    }
    if (state.inventory?.customization === "custom" || state.inventory?.customization === "identified") {
      reasons.push("Custom or account-specific inventory needs sourcing review.");
    }
    if (state.route?.returnWindow === "urgent") reasons.push("A 24–48 hour return priority needs route and production confirmation.");
    if (state.route?.access === "complex") reasons.push("The service location has access or sorting complexity to confirm.");
    if (rhythm.override === "lessFrequent") reasons.push("The preferred rhythm is less frequent than the operating recommendation.");
    if (rhythm.override === "review") reasons.push("The preferred rhythm differs from the account’s operating pattern.");
    return [...new Set(reasons)];
  };

  const calculatePlanningRange = (pricingJourneyState, rules = pricingRules) => {
    const state = pricingJourneyState;
    const operationRate = rules.operationRates[state.operation] || rules.operationRates.other;
    const pounds = weeklyPounds(state);
    const pieces = weeklyPieces(state);
    const load = loadEquivalent(state, rules);
    const volumeBand = rules.volumeBands.find((band) => load >= band.minimum) || rules.volumeBands[rules.volumeBands.length - 1];
    const finishFactor = (state.finish || []).reduce((sum, id) => sum + (rules.finishFactors[id] || 0), 0);
    const specialtyFactor = (state.specialtyNeeds || []).reduce((sum, id) => sum + (rules.specialtyFactors[id] || 0), 0);
    const poundService = pounds * operationRate.unit * volumeBand.factor;
    const pieceService = pieceServiceValue(state, rules);
    const careFactor = 1 + finishFactor + specialtyFactor + (state.route?.returnWindow === "urgent" ? 0.08 : 0);
    const rhythm = recommendRhythm(state, load, rules);
    const processingWeekly = (operationRate.base + poundService + pieceService) * careFactor * rhythm.priceFactor;
    const model = recommendedModel(state);
    const suppliedUnits = numberValue(state.inventory, "suppliedUnits");
    const inventoryRate = rules.inventoryWeeklyPerPiece[model.id] || 0;
    const inventoryCustomization = state.inventory?.customization;
    const inventoryFactor = inventoryCustomization === "custom" || inventoryCustomization === "identified" ? 1.2 : 1;
    const inventoryWeekly = suppliedUnits > 0 ? suppliedUnits * inventoryRate * inventoryFactor : 0;
    const inventoryExcluded = ["hybrid", "rental"].includes(model.id) && suppliedUnits <= 0;
    const reviewReasons = manualReviewReasons(state, load, pieces, rhythm, rules);
    const estimatedVolume = numberValue(state.scale, "estimatedPounds") > 0 || numberValue(state.scale, "estimatedPieces") > 0;
    const knownVolume = numberValue(state.scale, "knownPounds") > 0 || numberValue(state.scale, "knownPieces") > 0;
    const missingLocation = !state.location?.value;
    const confidencePenalty = (estimatedVolume ? 1 : 0)
      + (knownVolume ? 0 : 1)
      + (inventoryExcluded ? 1 : 0)
      + (missingLocation ? 1 : 0)
      + (rhythm.override ? 1 : 0)
      + (reviewReasons.length ? 1 : 0);
    const expansion = rhythm.rangeExpansion + (reviewReasons.length ? 0.08 : 0) + (inventoryExcluded ? 0.06 : 0);
    const processingRange = rangeFor(processingWeekly, rules, expansion);
    const inventoryRange = inventoryWeekly > 0 ? rangeFor(inventoryWeekly, rules, 0.12) : null;
    const selectedRange = inventoryRange ? sumRanges(processingRange, inventoryRange) : processingRange;
    const assumptions = [];
    if (pounds > 0) assumptions.push(`${Math.round(pounds).toLocaleString("en-US")} lb/week is treated as pound-billed processing.`);
    if (pieces > 0) assumptions.push(`${Math.round(pieces).toLocaleString("en-US")} pieces/week is priced as a separate piece-billed stream.`);
    if (estimatedVolume) assumptions.push("Weekly volume is estimated from the operating prompts and should be replaced with measured counts when available.");
    if (inventoryExcluded) assumptions.push("Supplied inventory is excluded until an approximate piece quantity is entered or reviewed by Shelton.");
    if (rhythm.override === "moreFrequent") assumptions.push("The preferred rhythm is more frequent than recommended, so the hypothetical range includes added route frequency.");
    if (rhythm.override === "lessFrequent") assumptions.push("A less-frequent override does not create an automatic discount; it widens the range pending feasibility review.");
    if (missingLocation) assumptions.push("Route feasibility is excluded until a ZIP code or address is provided.");
    assumptions.push("All dollar inputs are hypothetical development assumptions pending approved costs, margins, and profit targets.");

    const comparisons = ["cog", "hybrid", "rental"].map((id) => {
      const comparisonInventory = suppliedUnits > 0 ? suppliedUnits * (rules.inventoryWeeklyPerPiece[id] || 0) : 0;
      return {
        id,
        label: { cog: "Customer-Owned Goods", hybrid: "Hybrid", rental: "Rental" }[id],
        recommended: id === model.id,
        ...rangeFor(processingWeekly + comparisonInventory, rules, expansion)
      };
    });

    const confidence = confidencePenalty === 0
      ? { level: "Higher planning confidence", explanation: "The main operating inputs are present; final route and item review remain provisional." }
      : confidencePenalty <= 2
        ? { level: "Directional planning confidence", explanation: "The range is useful for planning but still depends on estimated or excluded details." }
        : { level: "Low confidence · review needed", explanation: "Several material assumptions need Shelton review before this range should guide a decision." };

    return {
      developmentOnly: true,
      rulesVersion: rules.version,
      warning: rules.warning,
      positioning: rules.competitivePositioning,
      weeklyUnits: Math.round(load),
      weeklyPounds: Math.round(pounds),
      weeklyPieces: Math.round(pieces),
      range: selectedRange,
      processingRange,
      inventoryRange,
      inventoryExcluded,
      rhythm,
      model,
      comparisons,
      confidence,
      manualReviewReasons: reviewReasons,
      assumptions,
      factors: [
        `${Math.round(load).toLocaleString("en-US")} estimated weekly load-equivalent units`,
        `${(state.goods || []).length} selected ${(state.goods || []).length === 1 ? "good" : "goods"}`,
        `${(state.finish || []).length} recommended finish/return ${(state.finish || []).length === 1 ? "method" : "methods"}`,
        state.location?.value ? `Route review for ${state.location.value}` : "Location pending route review"
      ]
    };
  };

  window.SheltonPricingDevelopmentRules = {
    pricingRules,
    calculatePlanningRange,
    recommendRhythm,
    loadEquivalent
  };
}());
