(function () {
  "use strict";

  const pricingRules = Object.freeze({
    version: "commercial-estimator.v2",
    estimatePath: "/api/public/commercial-estimate",
    leadPath: "/api/public/commercial-leads"
  });

  const numberValue = (state, key, fallback = 0) => {
    const value = Number(state.scale?.[key]);
    return Number.isFinite(value) ? value : fallback;
  };

  const positive = (value) => Number(value) > 0 ? Number(value) : undefined;
  const selected = (state, id) => state.goods.includes(id);
  const apiBaseUrl = () => {
    const configured = String(window.SheltonPricingApiConfig?.apiBaseUrl || "").trim();
    const fromMeta = document.querySelector('meta[name="shelton-pricing-api"]')?.content?.trim() || "";
    return (configured || fromMeta).replace(/\/$/, "");
  };
  const apiUrl = (path) => `${apiBaseUrl()}${path}`;

  const ownershipModel = (state) => ({
    own: { id: "cog", label: "Customer-Owned Goods", reason: "The service range covers cleaning and processing of customer-owned goods." },
    some: { id: "hybrid", label: "Hybrid Program", reason: "Cleaning stays separate from the selected rental tier and confirmed supplied inventory." },
    supply: { id: "rental", label: "Rental Program", reason: "Cleaning stays separate from the selected rental tier and confirmed supplied inventory." },
    unsure: { id: "review", label: "Shelton Model Review", reason: "Shelton will confirm whether customer-owned, hybrid, or rental service best fits the account." }
  }[state.ownership] || { id: "review", label: "Shelton Model Review", reason: "Shelton will confirm the right ownership structure." });

  const occupancyPercent = (value) => ({ under50: 40, "50to74": 62, "75to89": 82, "90plus": 94 }[value] || 75);

  const garmentLines = (state) => [
    { type: "chef_coat", weeklyPieces: numberValue(state, "weeklyChefCoats") },
    { type: "uniform_top", weeklyPieces: numberValue(state, "weeklyUniformTops") },
    { type: "apron", weeklyPieces: numberValue(state, "weeklyAprons") },
    { type: "pants", weeklyPieces: numberValue(state, "weeklyPants") },
    { type: "jacket_coverall", weeklyPieces: numberValue(state, "weeklyJackets") }
  ].filter((item) => item.weeklyPieces > 0);

  const specialtyItems = (state) => [
    { type: "robe", weeklyPieces: numberValue(state, "weeklyRobes") },
    { type: "blanket", weeklyPieces: numberValue(state, "weeklyBlankets") }
  ].filter((item) => item.weeklyPieces > 0);

  const rentalCategory = (state) => ({
    sheets: "sheets", towels: "towels", handTowels: "towels", bathMats: "towels", robes: "robes",
    blankets: "blankets", duvetCovers: "sheets", tablecloths: "table linens", napkins: "table linens",
    tableLinens: "table linens", banquetLinens: "table linens", chefCoats: "uniforms", aprons: "uniforms",
    casinoUniforms: "uniforms", uniformShirts: "uniforms", workwear: "uniforms", jackets: "uniforms"
  }[state.goods[0]] || "commercial linens");

  const rentalSelections = (state) => {
    if (!["some", "supply"].includes(state.ownership) || !state.rentalTier || Number(state.rentalQuantity) <= 0) return [];
    return [{
      category: rentalCategory(state),
      tier: state.rentalTier,
      quantity: Number(state.rentalQuantity),
      landedCostPerItem: null
    }];
  };

  const commonInput = (state, lane) => ({
    schemaVersion: "commercial-estimator.v2",
    lane,
    accountName: "Website planning prospect",
    volumeEvidence: positive(numberValue(state, "knownVolume")) ? "customer_provided" : "estimated",
    ...(positive(numberValue(state, "knownVolume")) ? { knownWeeklyPounds: numberValue(state, "knownVolume") } : {}),
    productionDaysPerWeek: 5,
    shiftsPerDay: 1,
    productiveHoursPerShift: 7,
    specialtyItems: specialtyItems(state),
    rentalSelections: rentalSelections(state),
    specializedHandling: state.specialtyNeeds.some((id) => ["moldTreatment", "delicate", "deadline"].includes(id))
  });

  const buildEstimateInput = (state) => {
    if (["wholesale", "other"].includes(state.operation)) return null;
    if (state.operation === "hotel") return {
      ...commonInput(state, "hotel"),
      rooms: numberValue(state, "rooms"),
      occupancyPercent: occupancyPercent(state.scale.occupancy),
      linenServicePercent: 90,
      bedSystem: state.scale.bedSystem || "mixed",
      duvetPercent: numberValue(state, "duvetPercent", 50)
    };
    if (state.operation === "str") return {
      ...commonInput(state, "str"),
      properties: numberValue(state, "properties"),
      weeklyTurns: numberValue(state, "weeklyTurns"),
      averageBedrooms: numberValue(state, "averageBedrooms", 1)
    };
    if (state.operation === "spa") return {
      ...commonInput(state, "resort_spa"),
      appointmentsPerWeek: numberValue(state, "appointments"),
      goodsUse: state.scale.goodsUse || "standard"
    };
    if (state.operation === "medspa") return {
      ...commonInput(state, "medspa"),
      appointmentsPerWeek: numberValue(state, "appointments"),
      handTowelsPerAppointment: numberValue(state, "handTowelsPerAppointment")
    };
    if (state.operation === "gym") return {
      ...commonInput(state, "gym"),
      weeklyTowelUses: numberValue(state, "weeklyTowelUses")
    };
    if (state.operation === "events") return {
      ...commonInput(state, "event"),
      weeklyTablecloths: numberValue(state, "weeklyTablecloths"),
      weeklyNapkins: numberValue(state, "weeklyNapkins"),
      ...(positive(numberValue(state, "totalWeeklyPieces")) ? { totalWeeklyPieces: numberValue(state, "totalWeeklyPieces") } : {}),
      specializedHandling: commonInput(state, "event").specializedHandling || state.goods.some((id) => !["tablecloths", "napkins"].includes(id))
    };
    if (state.operation === "restaurant") {
      const includesDiningLinen = state.goods.some((id) => ["napkins", "tableLinens"].includes(id));
      return {
        ...commonInput(state, "restaurant"),
        weeklyCovers: includesDiningLinen ? numberValue(state, "weeklyCovers") : 0,
        ...(includesDiningLinen && positive(numberValue(state, "knownVolume")) ? { knownWeeklyLinenPounds: numberValue(state, "knownVolume") } : {}),
        garments: garmentLines(state)
      };
    }
    if (state.operation === "uniforms") return {
      ...commonInput(state, "uniform"),
      garments: garmentLines(state)
    };
    if (state.operation === "casino") {
      const programs = [];
      if (numberValue(state, "hotelRooms") > 0) programs.push({ lane: "hotel", rooms: numberValue(state, "hotelRooms") });
      if (numberValue(state, "weeklyCovers") > 0) programs.push({ lane: "restaurant", weeklyCovers: numberValue(state, "weeklyCovers"), garments: [] });
      if (numberValue(state, "weeklyTablecloths") + numberValue(state, "weeklyNapkins") > 0) programs.push({ lane: "event", weeklyTablecloths: numberValue(state, "weeklyTablecloths"), weeklyNapkins: numberValue(state, "weeklyNapkins") });
      const garments = garmentLines(state);
      if (garments.length) programs.push({ lane: "uniform", garments });
      return { ...commonInput(state, "casino"), programs };
    }
    return null;
  };

  const unavailableRecommendation = (state, reason, manualReview = false) => {
    const model = ownershipModel(state);
    return {
      rulesVersion: pricingRules.version,
      warning: manualReview ? "EXACT REVIEW REQUIRED" : "PLANNING RANGE TEMPORARILY UNAVAILABLE",
      positioning: manualReview
        ? "This service needs Shelton review before a responsible price can be shown."
        : "Your answers are saved. Send them to Shelton for a manual commercial review.",
      rangeUnavailable: true,
      manualReview,
      range: null,
      rhythm: { label: "Shelton route review", reason: "Pickup cadence will be confirmed from location, weekly movement, and service requirements." },
      model,
      comparisons: [],
      confidence: { level: "Manual review", explanation: reason },
      unitRates: [],
      rental: [],
      factors: [reason, state.location.value ? `Route review for ${state.location.value}` : "Location pending"],
      estimateToken: null,
      sourceInput: null
    };
  };

  const recommendationFromPublic = (state, input, payload) => {
    const estimate = payload.estimate;
    const model = ownershipModel(state);
    const comparison = {
      id: model.id,
      label: model.label,
      recommended: true,
      weeklyLow: estimate.pricing.weeklyRange.low,
      weeklyHigh: estimate.pricing.weeklyRange.high
    };
    const unitRates = (estimate.pricing.lines || []).map((line) => ({
      label: line.label,
      billingUnit: line.billingUnit,
      rate: line.target,
      weeklyUnits: line.weeklyUnits
    }));
    return {
      rulesVersion: estimate.modelVersion,
      warning: estimate.requiresReview ? "PLANNING RANGE · SHELTON REVIEW REQUIRED" : "COMMERCIAL PLANNING RANGE",
      positioning: "A quality-first planning range using the same commercial pricing logic Shelton reviews internally.",
      rangeUnavailable: false,
      range: {
        weeklyLow: estimate.pricing.weeklyRange.low,
        weeklyHigh: estimate.pricing.weeklyRange.high,
        monthlyLow: estimate.pricing.monthlyRange.low,
        monthlyHigh: estimate.pricing.monthlyRange.high
      },
      rhythm: {
        label: estimate.route.label,
        reason: estimate.route.remoteReview
          ? "This location needs route review before service is confirmed."
          : "The rhythm follows estimated weekly movement; exact pickup days remain part of Shelton review."
      },
      model,
      comparisons: [comparison],
      confidence: {
        level: `${estimate.confidence.label} confidence`,
        explanation: `${estimate.confidence.score}% planning confidence using ${String(estimate.confidence.evidence).replaceAll("_", " ")} volume.`
      },
      unitRates,
      rental: estimate.rental || [],
      factors: [
        `${Number(estimate.sizing.weeklyPounds || 0).toLocaleString("en-US")} estimated pounds per week`,
        ...unitRates.map((line) => `${line.label}: $${Number(line.rate).toFixed(2)} per ${line.billingUnit}`),
        ...(estimate.reviewMessages || []),
        state.location.value ? `Route review for ${state.location.value}` : "Location pending route review"
      ],
      estimateToken: payload.estimateToken,
      sourceInput: input
    };
  };

  const calculatePlanningRange = async (state) => {
    if (["wholesale", "other"].includes(state.operation)) {
      return unavailableRecommendation(state, "Wholesale dry cleaning and Other / Not Sure are reviewed manually; no numeric range is invented.", true);
    }
    const input = buildEstimateInput(state);
    if (!input) return unavailableRecommendation(state, "This program needs a Shelton review before pricing.", true);
    try {
      const response = await window.fetch(apiUrl(pricingRules.estimatePath), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimate: input })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.estimate) throw new Error(payload.error || "The calculation service is unavailable.");
      return recommendationFromPublic(state, input, payload);
    } catch (error) {
      return unavailableRecommendation(state, "The automatic range could not be calculated. Your answers can still be sent for manual review.");
    }
  };

  window.SheltonPricingDevelopmentRules = {
    pricingRules,
    apiUrl,
    buildEstimateInput,
    calculatePlanningRange,
    unavailableRecommendation
  };
}());
