(function () {
  "use strict";

  const pricingRules = {
    version: "development-2026-07-11",
    developmentOnly: true,
    warning: "DEVELOPMENT ESTIMATE - NOT APPROVED PRICING",
    competitivePositioning: "Quality-first service with pricing built to compete.",
    monthlyWeeks: 4.33,
    range: { low: 0.88, high: 1.14 },
    operationRates: {
      hotel: { base: 145, unit: 1.18 },
      str: { base: 155, unit: 1.22 },
      spa: { base: 120, unit: 1.34 },
      gym: { base: 115, unit: 1.08 },
      event: { base: 180, unit: 1.42 },
      restaurant: { base: 135, unit: 1.28 },
      casino: { base: 240, unit: 1.16 },
      uniform: { base: 140, unit: 1.3 },
      wholesale: { base: 210, unit: 0.92 },
      other: { base: 145, unit: 1.3 }
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
    modelFactors: {
      cog: 1,
      hybrid: 1.18,
      rental: 1.36
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

  const numberValue = (state, key, fallback = 0) => {
    const value = Number(state.scale?.[key]);
    return Number.isFinite(value) ? value : fallback;
  };

  const averageGoodsWeight = (state, rules) => {
    const weights = state.goods.map((id) => rules.goodsWeights[id] || 1);
    return weights.length ? weights.reduce((sum, value) => sum + value, 0) / weights.length : 1;
  };

  const knownVolume = (state) => numberValue(state, "knownVolume", 0);

  const estimateWeeklyUnits = (state, rules) => {
    const known = knownVolume(state);
    if (known > 0) return known;
    const weight = averageGoodsWeight(state, rules);

    switch (state.operation) {
      case "hotel":
        return Math.max(1, numberValue(state, "weeklyTurns") * weight);
      case "str":
        return Math.max(1, numberValue(state, "weeklyTurns") * weight);
      case "spa": {
        const useFactor = { light: 0.75, standard: 1, high: 1.45 }[state.scale.goodsUse] || 1;
        return Math.max(1, numberValue(state, "appointments") * weight * useFactor);
      }
      case "gym":
        return Math.max(1, numberValue(state, "weeklyTowelUses") * weight);
      case "events":
        return Math.max(1, (numberValue(state, "eventsPerMonth") * numberValue(state, "piecesPerEvent") * weight) / rules.monthlyWeeks);
      case "restaurant":
        return Math.max(1, numberValue(state, "weeklyCovers") * 0.16 + numberValue(state, "employees") * numberValue(state, "shiftsPerDay") * weight);
      case "casino":
        return Math.max(1, numberValue(state, "employees") * numberValue(state, "shiftsPerDay") * weight + numberValue(state, "banquetEvents") * 35 + numberValue(state, "restaurantOutlets") * 75);
      case "uniforms":
        return Math.max(1, numberValue(state, "employees") * numberValue(state, "piecesPerEmployee") * weight);
      case "wholesale": {
        const unitFactor = state.scale.volumeUnit === "pieces" ? weight : 1;
        return Math.max(1, numberValue(state, "weeklyVolume") * unitFactor);
      }
      case "other": {
        const unitFactor = state.scale.volumeUnit === "pieces" ? weight : 1;
        return Math.max(1, numberValue(state, "weeklyVolume") * unitFactor);
      }
      default:
        return Math.max(1, state.goods.length * 100);
    }
  };

  const roundToFive = (value) => Math.max(5, Math.round(value / 5) * 5);

  const rangeFor = (weekly, rules) => {
    const low = roundToFive(weekly * rules.range.low);
    const high = roundToFive(weekly * rules.range.high);
    return {
      weeklyLow: low,
      weeklyHigh: high,
      monthlyLow: roundToFive(low * rules.monthlyWeeks),
      monthlyHigh: roundToFive(high * rules.monthlyWeeks)
    };
  };

  const recommendedModel = (state) => {
    const choices = {
      own: {
        id: "cog",
        label: "Customer-Owned Goods",
        reason: "You indicated that the selected goods are already owned, so the starting structure centers on cleaning, finishing, packaging, and return rather than supplied inventory."
      },
      some: {
        id: "hybrid",
        label: "Hybrid Program",
        reason: "You indicated that some goods are owned and some may need to be supplied, so a blended structure is the clearest planning starting point."
      },
      supply: {
        id: "rental",
        label: "Rental Program",
        reason: "You indicated that Shelton-supplied inventory is needed, so the planning structure includes recurring inventory support as well as service."
      },
      unsure: {
        id: "hybrid",
        label: "Hybrid Program",
        reason: "Because ownership is still being evaluated, a blended planning structure keeps both owned and supplied inventory available for the exact-quote review."
      }
    };
    return choices[state.ownership] || choices.unsure;
  };

  const recommendRhythm = (state, weeklyUnits, rules) => {
    if (state.operation === "events") {
      const urgent = state.scale.returnWindow === "urgent";
      return {
        label: urgent ? "Event-scheduled pickup with 24-48 hour return planning" : "Event-scheduled commercial pickup and return",
        reason: "Event calendars and return windows shape production timing more reliably than a generic weekly preference."
      };
    }
    if (state.operation === "wholesale") {
      return {
        label: state.scale.turnaround === "urgent" ? "Production-window pickup and return with sub-48-hour planning" : "Production-window commercial pickup and return",
        reason: "Batch volume, plant days, turnaround, and finishing capacity shape the recommended production rhythm."
      };
    }

    const tightStorage = state.scale.storage === "tight";
    const thresholds = {
      weekly: rules.rhythmThresholds.weekly * (tightStorage ? 0.72 : 1),
      twiceWeekly: rules.rhythmThresholds.twiceWeekly * (tightStorage ? 0.78 : 1),
      threeWeekly: rules.rhythmThresholds.threeWeekly * (tightStorage ? 0.84 : 1)
    };
    let label = "Once-weekly commercial pickup and return";
    if (weeklyUnits > thresholds.threeWeekly) label = "Weekday commercial pickup and return";
    else if (weeklyUnits > thresholds.twiceWeekly) label = "Three-times-weekly commercial pickup and return";
    else if (weeklyUnits > thresholds.weekly) label = "Twice-weekly commercial pickup and return";
    return {
      label,
      reason: tightStorage
        ? "Estimated movement and tight clean-goods storage support a shorter interval between returns."
        : "The recommendation balances estimated movement, operating rhythm, and the storage information provided."
    };
  };

  const calculatePlanningRange = (pricingJourneyState, rules = pricingRules) => {
    const state = pricingJourneyState;
    const operationRate = rules.operationRates[state.operation] || rules.operationRates.other;
    const weeklyUnits = estimateWeeklyUnits(state, rules);
    const volumeBand = rules.volumeBands.find((band) => weeklyUnits >= band.minimum) || rules.volumeBands[rules.volumeBands.length - 1];
    const finishFactor = state.finish.reduce((sum, id) => sum + (rules.finishFactors[id] || 0), 0);
    const specialtyFactor = state.specialtyNeeds.reduce((sum, id) => sum + (rules.specialtyFactors[id] || 0), 0);
    const serviceBase = operationRate.base + weeklyUnits * operationRate.unit * volumeBand.factor;
    const serviceWithCare = serviceBase * (1 + finishFactor + specialtyFactor);
    const model = recommendedModel(state);
    const comparisons = ["cog", "hybrid", "rental"].map((id) => ({
      id,
      label: { cog: "Customer-Owned Goods", hybrid: "Hybrid", rental: "Rental" }[id],
      recommended: id === model.id,
      ...rangeFor(serviceWithCare * rules.modelFactors[id], rules)
    }));
    const selectedRange = comparisons.find((item) => item.id === model.id);
    const rhythm = recommendRhythm(state, weeklyUnits, rules);
    const usesKnownVolume = knownVolume(state) > 0 || ["wholesale", "other"].includes(state.operation);

    return {
      developmentOnly: true,
      rulesVersion: rules.version,
      warning: rules.warning,
      positioning: rules.competitivePositioning,
      weeklyUnits: Math.round(weeklyUnits),
      range: {
        weeklyLow: selectedRange.weeklyLow,
        weeklyHigh: selectedRange.weeklyHigh,
        monthlyLow: selectedRange.monthlyLow,
        monthlyHigh: selectedRange.monthlyHigh
      },
      rhythm,
      model,
      comparisons,
      confidence: {
        level: usesKnownVolume ? "Higher planning confidence" : "Directional planning confidence",
        explanation: usesKnownVolume
          ? "The range uses a supplied volume input, while route and item review still remain provisional."
          : "The range estimates volume from operating signals and should be refined with measured pounds or pieces."
      },
      factors: [
        `${Math.round(weeklyUnits).toLocaleString("en-US")} estimated weekly planning units`,
        `${state.goods.length} selected ${state.goods.length === 1 ? "good" : "goods"}`,
        `${state.finish.length} finish/return ${state.finish.length === 1 ? "choice" : "choices"}`,
        state.location.value ? `Route review for ${state.location.value}` : "Location pending route review"
      ]
    };
  };

  window.SheltonPricingDevelopmentRules = {
    pricingRules,
    calculatePlanningRange
  };
}());
