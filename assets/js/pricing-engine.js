(function () {
  "use strict";

  const pricingRules = Object.freeze({
    version: "commercial-estimator.v2.4",
    schemaVersion: "commercial-estimator.v3",
    estimatePath: "/api/commercial-estimate",
    leadPath: "/api/commercial-leads"
  });

  const numberValue = (state, key, fallback = 0) => {
    const value = Number(state.scale?.[key]);
    return Number.isFinite(value) ? value : fallback;
  };

  const positive = (value) => Number(value) > 0 ? Number(value) : undefined;
  const selected = (state, id) => state.goods.includes(id);
  const apiUrl = (path) => path;
  const locationValue = (state) => typeof state.location === "string"
    ? state.location.trim()
    : String(state.location?.value || "").trim();

  const ownershipModel = (state) => ({
    own: { id: "cog", label: "Customer-Owned Goods", reason: "The service range covers cleaning and processing of customer-owned goods." },
    some: { id: "hybrid", label: "Hybrid Program", reason: "Cleaning stays separate from the selected rental tier and confirmed supplied inventory." },
    supply: { id: "rental", label: "Rental Program", reason: "Cleaning stays separate from the selected rental tier and confirmed supplied inventory." },
    unsure: { id: "review", label: "Shelton Model Review", reason: "Shelton will confirm whether customer-owned, hybrid, or rental service best fits the account." }
  }[state.ownership] || { id: "review", label: "Shelton Model Review", reason: "Shelton will confirm the right ownership structure." });

  const occupancyPercent = (value) => ({ under50: 40, "50to74": 62, "75to89": 82, "90plus": 94 }[value]);
  const usingDirectPounds = (state) => state.scale?.entryMode === "direct" && positive(numberValue(state, "knownVolume"));
  const requiredDriver = (state, key) => usingDirectPounds(state) ? 1 : numberValue(state, key);

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

  const rentalCategory = (state) => {
    const explicit = String(state.rentalCategory || "");
    if (["sheets", "towels", "robes", "blankets", "table linens", "uniforms"].includes(explicit)) return explicit;
    return ({
      sheets: "sheets", towels: "towels", handTowels: "towels", bathMats: "towels", robes: "robes",
      blankets: "blankets", duvetCovers: "sheets", tablecloths: "table linens", napkins: "table linens",
      tableLinens: "table linens", banquetLinens: "table linens", chefCoats: "uniforms", aprons: "uniforms",
      casinoUniforms: "uniforms", uniformShirts: "uniforms", workwear: "uniforms", jackets: "uniforms"
    }[state.goods[0]] || "commercial linens");
  };

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

  const buildLegacyEstimateInput = (state) => {
    if (["wholesale", "other"].includes(state.operation)) return null;
    if (state.operation === "hotel") return {
      ...commonInput(state, "hotel"),
      rooms: requiredDriver(state, "rooms"),
      ...(occupancyPercent(state.scale.occupancy) ? { occupancyPercent: occupancyPercent(state.scale.occupancy) } : {}),
      linenServicePercent: 90,
      ...(state.scale.bedSystem ? { bedSystem: state.scale.bedSystem } : {}),
      ...(String(state.scale.duvetPercent ?? "").trim() !== "" ? { duvetPercent: numberValue(state, "duvetPercent") } : {})
    };
    if (state.operation === "senior_living") return {
      ...commonInput(state, "senior_living"),
      licensedCapacity: requiredDriver(state, "licensedCapacity"),
      ...(occupancyPercent(state.scale.occupancy) ? { occupancyPercent: occupancyPercent(state.scale.occupancy) } : {}),
      ...(state.scale.careType ? { careType: state.scale.careType } : {}),
      ...(String(state.scale.memoryCarePercent ?? "").trim() !== "" ? { memoryCarePercent: numberValue(state, "memoryCarePercent") } : {})
    };
    if (state.operation === "residential_treatment") return {
      ...commonInput(state, "residential_treatment"),
      licensedCapacity: requiredDriver(state, "licensedCapacity"),
      ...(occupancyPercent(state.scale.occupancy) ? { occupancyPercent: occupancyPercent(state.scale.occupancy) } : {}),
      ...(state.scale.careType ? { careType: state.scale.careType } : {}),
      ...(positive(numberValue(state, "admissionsPerWeek")) ? { admissionsPerWeek: numberValue(state, "admissionsPerWeek") } : {}),
      ...(positive(numberValue(state, "averageStayDays")) ? { averageStayDays: numberValue(state, "averageStayDays") } : {})
    };
    if (state.operation === "str") {
      const properties = usingDirectPounds(state) ? 1 : numberValue(state, "properties");
      const turnsPerProperty = numberValue(state, "turnsPerProperty");
      const weeklyTurns = turnsPerProperty > 0 && properties > 0
        ? turnsPerProperty * properties
        : numberValue(state, "weeklyTurns");
      const totalBedrooms = numberValue(state, "totalBedrooms");
      const averageBedrooms = totalBedrooms > 0 && properties > 0
        ? totalBedrooms / properties
        : numberValue(state, "averageBedrooms");
      return {
        ...commonInput(state, "str"),
        ...(positive(properties) ? { properties } : {}),
        ...(positive(usingDirectPounds(state) ? 1 : weeklyTurns) ? { weeklyTurns: usingDirectPounds(state) ? 1 : weeklyTurns } : {}),
        ...(positive(usingDirectPounds(state) ? 1 : averageBedrooms) ? { averageBedrooms: usingDirectPounds(state) ? 1 : averageBedrooms } : {})
      };
    }
    if (state.operation === "spa") return {
      ...commonInput(state, "resort_spa"),
      appointmentsPerWeek: requiredDriver(state, "appointments"),
      goodsUse: state.scale.goodsUse || "standard"
    };
    if (state.operation === "medspa") return {
      ...commonInput(state, "medspa"),
      appointmentsPerWeek: requiredDriver(state, "appointments"),
      handTowelsPerAppointment: numberValue(state, "handTowelsPerAppointment")
    };
    if (state.operation === "gym") return {
      ...commonInput(state, "gym"),
      weeklyTowelUses: requiredDriver(state, "weeklyTowelUses")
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
        ...(includesDiningLinen && positive(numberValue(state, "weeklyCovers")) ? { weeklyCovers: numberValue(state, "weeklyCovers") } : {}),
        ...(positive(numberValue(state, "knownVolume")) ? { knownWeeklyLinenPounds: numberValue(state, "knownVolume") } : {}),
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

  const publicGoodId = (id) => ({
    handTowels: "hand_towels", bathMats: "bath_mats", duvetCovers: "duvet_covers",
    faceCradleCovers: "face_cradle_cover", tablecloths: "tablecloths", napkins: "napkins",
    runners: "runner", skirting: "skirting", chairCovers: "chair_cover",
    specialtyEventGoods: "specialty_event_good", chefCoats: "chef_coats", barTowels: "bar_towels",
    tableLinens: "table_linens", casinoUniforms: "casino_uniforms", banquetLinens: "banquet_linens",
    uniformShirts: "uniform_tops", workwear: "workwear", specialtyGarments: "unusual_garment",
    choirRobes: "unusual_garment"
  }[id] || id);

  const goodQuantity = (state, id) => ({
    robes: numberValue(state, "weeklyRobes"), blankets: numberValue(state, "weeklyBlankets"),
    tablecloths: numberValue(state, "weeklyTablecloths"), napkins: numberValue(state, "weeklyNapkins"),
    chefCoats: numberValue(state, "weeklyChefCoats"), aprons: numberValue(state, "weeklyAprons"),
    uniformShirts: numberValue(state, "weeklyUniformTops"), casinoUniforms: numberValue(state, "weeklyUniformTops"),
    workwear: numberValue(state, "weeklyPants"), jackets: numberValue(state, "weeklyJackets")
  }[id] || 0);

  const proxyComplete = (state) => {
    const required = {
      hotel: ["rooms", "occupancy", "bedSystem"],
      senior_living: ["licensedCapacity", "occupancy", "careType"],
      residential_treatment: ["licensedCapacity", "occupancy", "careType"],
      str: ["properties", "turnsPerProperty", "bedroomBasis"],
      spa: ["appointments", "goodsUse"], medspa: ["appointments"], gym: ["weeklyTowelUses"],
      restaurant: ["weeklyCovers"], casino: [], events: [], uniforms: []
    }[state.operation] || [];
    return required.every((key) => String(state.scale?.[key] ?? "").trim() !== "");
  };

  const buildEstimateInput = (state) => {
    const legacy = buildLegacyEstimateInput(state);
    if (!legacy) return null;
    const knownPounds = positive(numberValue(state, "knownVolume"));
    const pieceCountLane = ["events", "uniforms"].includes(state.operation);
    const evidence = knownPounds ? "known_pounds" : pieceCountLane ? "piece_counts" : proxyComplete(state) ? "business_proxy" : "default_mix";
    const selectedGoods = state.goods.map((id) => ({
      id: publicGoodId(id),
      ...(goodQuantity(state, id) > 0 ? { weeklyPieces: goodQuantity(state, id) } : {})
    }));
    const allowedVolumeKeys = [
      "rooms", "occupancyPercent", "linenServicePercent", "bedSystem", "duvetPercent", "licensedCapacity",
      "careType", "memoryCarePercent", "admissionsPerWeek", "averageStayDays", "properties", "weeklyTurns",
      "averageBedrooms", "appointmentsPerWeek", "goodsUse", "handTowelsPerAppointment", "weeklyTowelUses",
      "weeklyCovers", "weeklyTablecloths", "weeklyNapkins", "totalWeeklyPieces"
    ];
    const volume = { evidence, ...(knownPounds ? { weeklyPounds: knownPounds } : {}) };
    allowedVolumeKeys.forEach((key) => {
      if (legacy[key] !== undefined && legacy[key] !== null && legacy[key] !== "") volume[key] = legacy[key];
    });
    garmentLines(state).forEach((line) => {
      const key = { chef_coat: "weeklyChefCoats", uniform_top: "weeklyUniformTops", apron: "weeklyAprons", pants: "weeklyPants", jacket_coverall: "weeklyJackets" }[line.type];
      volume[key] = line.weeklyPieces;
    });
    if (state.operation === "casino") {
      volume.hotelRooms = numberValue(state, "hotelRooms");
      volume.weeklyCovers = numberValue(state, "weeklyCovers");
      volume.weeklyTablecloths = numberValue(state, "weeklyTablecloths");
      volume.weeklyNapkins = numberValue(state, "weeklyNapkins");
    }
    const operation = ({ spa: "resort_spa", events: "event", uniforms: "uniform" }[state.operation] || state.operation);
    const ownership = ({ own: "customer_owned", some: "hybrid", supply: "shelton_supplied", unsure: "unsure" }[state.ownership] || "unsure");
    const resolvedOwnership = ownership === "shelton_supplied" && !state.rentalTier ? "unsure" : ownership;
    const cadence = ({ weekly: 1, twiceWeekly: 2, threeWeekly: 3, weekday: 5 }[state.requestedPickups]);
    return {
      schemaVersion: pricingRules.schemaVersion,
      operation,
      accountName: "Website planning prospect",
      selectedGoods,
      volume,
      pattern: { seasonal: ["seasonal", "eventDriven", "variable"].includes(String(state.scale?.seasonality || state.scale?.variability || state.scale?.peakPattern || "")) },
      service: {
        storage: state.scale?.storage === "tight" ? "very_tight" : state.scale?.storage || "ample",
        ...(cadence ? { requestedPickupsPerWeek: cadence } : {}),
        customSorting: state.specialtyNeeds.some((id) => ["propertySort", "departmentSort"].includes(id))
      },
      route: {
        zip: locationValue(state),
        access: state.access === "complex" ? "difficult" : state.access || "standard"
      },
      ownership: {
        model: resolvedOwnership,
        ...(resolvedOwnership === "shelton_supplied" ? { tier: state.rentalTier } : {})
      }
    };
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
      unitPricing: null,
      rental: [],
      factors: [reason, locationValue(state) ? `Route review for ${locationValue(state)}` : "Location pending"],
      estimateToken: null,
      sourceInput: null
    };
  };

  const recommendationFromPublic = (state, input, payload) => {
    const estimate = payload.estimate;
    const model = ownershipModel(state);
    if (!estimate.pricing) {
      return {
        ...unavailableRecommendation(state, (estimate.reviewMessages || ["Shelton review is required before pricing."]).join(" "), true),
        rulesVersion: estimate.modelVersion,
        estimateToken: payload.estimateToken,
        sourceInput: input,
        factors: estimate.unresolvedFactors || []
      };
    }
    const weekly = estimate.pricing.weeklyRange;
    const comparison = {
      id: model.id,
      label: model.label,
      recommended: true,
      weeklyLow: weekly.low,
      weeklyHigh: weekly.high
    };
    const pricingLines = estimate.pricing.unitPrices || [];
    const unitRates = pricingLines.map((line) => ({
      label: line.label,
      billingUnit: line.billingUnit,
      rate: line.recommendedRate,
      low: Number(line.recommendedRate),
      high: Number(line.recommendedRate),
      weeklyUnits: line.weeklyUnits
    }));
    const poundLines = unitRates.filter((line) => line.billingUnit === "pound" && Number(line.weeklyUnits) > 0);
    const poundUnits = poundLines.reduce((sum, line) => sum + Number(line.weeklyUnits), 0);
    const weeklyPounds = Number(estimate.sizing?.weeklyPounds || poundUnits);
    const unitPricing = poundUnits > 0 ? {
      poundLow: Number((poundLines.reduce((sum, line) => sum + line.rate * Number(line.weeklyUnits), 0) / poundUnits).toFixed(4)),
      poundHigh: Number((poundLines.reduce((sum, line) => sum + line.rate * Number(line.weeklyUnits), 0) / poundUnits).toFixed(4))
    } : null;
    return {
      rulesVersion: estimate.modelVersion,
      warning: estimate.requiresReview ? "PLANNING RANGE · SHELTON REVIEW REQUIRED" : "COMMERCIAL PLANNING RANGE",
      positioning: "A quality-first planning range using the same commercial pricing logic Shelton reviews internally.",
      rangeUnavailable: false,
      range: {
        weeklyLow: weekly.low,
        weeklyBase: weekly.base,
        weeklyHigh: weekly.high
      },
      weeklyPounds,
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
        explanation: estimate.dominantUncertainty
          ? `The main open factor is ${String(estimate.dominantUncertainty).toLowerCase()}.`
          : "The material quantity and mix inputs are resolved for this planning estimate."
      },
      unitRates,
      unitPricing,
      rental: estimate.rental || [],
      factors: [
        `${Number(estimate.sizing.weeklyPounds || 0).toLocaleString("en-US")} typical pounds per week`,
        ...unitRates.map((line) => `${line.label}: $${Number(line.rate).toFixed(2)} per ${line.billingUnit}`),
        ...(estimate.unresolvedFactors || []),
        ...(estimate.reviewMessages || []),
        locationValue(state) ? `Route review for ${locationValue(state)}` : "Location pending route review"
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
      if (payload.schemaVersion !== pricingRules.schemaVersion) {
        throw new Error(`The calculation service returned ${payload.schemaVersion || "an unknown schema"}.`);
      }
      if (payload.estimate.modelVersion !== pricingRules.version) {
        throw new Error(`The calculation service returned ${payload.estimate.modelVersion || "an unknown model"}.`);
      }
      return recommendationFromPublic(state, input, payload);
    } catch (error) {
      return unavailableRecommendation(state, "The automatic range could not be calculated. Your answers can still be sent for manual review.");
    }
  };

  window.SheltonPricingEngine = {
    pricingRules,
    apiUrl,
    buildEstimateInput,
    calculatePlanningRange,
    unavailableRecommendation
  };
}());
