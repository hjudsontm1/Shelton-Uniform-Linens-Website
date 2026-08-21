(function () {
  "use strict";

  const pricingRules = Object.freeze({
    version: "commercial-estimator.v2.4",
    schemaVersion: "commercial-estimator.v3",
    apiBaseUrl: "https://api.sheltonlinen.com",
    estimatePath: "/api/public/commercial-estimate",
    leadPath: "/api/public/commercial-leads",
    planningZip: "92101"
  });

  const numberValue = (state, key, fallback = 0) => {
    const value = Number(state.scale?.[key]);
    if (!Number.isFinite(value)) return fallback;
    const field = window.SheltonPricingJourneyConfig?.scaleSchemas?.[state.operation]
      ?.find((item) => item.id === key && item.type === "number");
    if (field && (value < Number(field.min) || value > Number(field.max))) return fallback;
    return value;
  };

  const positive = (value) => Number(value) > 0 ? Number(value) : undefined;
  const selected = (state, id) => state.goods.includes(id);
  const apiUrl = (path) => new URL(path, pricingRules.apiBaseUrl).toString();
  const locationValue = (state) => typeof state.location === "string"
    ? state.location.trim()
    : String(state.location?.value || "").trim();
  const routeZip = (state) => /^\d{5}$/.test(locationValue(state))
    ? locationValue(state)
    : pricingRules.planningZip;

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
    { type: "chef_coat", weeklyPieces: numberValue(state, "weeklyChefCoats"), goods: ["chefCoats"] },
    { type: "uniform_top", weeklyPieces: numberValue(state, "weeklyUniformTops"), goods: ["uniformShirts"] },
    { type: "uniform_top", weeklyPieces: numberValue(state, state.operation === "casino" ? "weeklyUniformTops" : "weeklyCasinoUniformTops"), goods: ["casinoUniforms"] },
    { type: "apron", weeklyPieces: numberValue(state, "weeklyAprons"), goods: ["aprons"] },
    { type: "pants", weeklyPieces: numberValue(state, "weeklyPants"), goods: ["workwear"] },
    { type: "jacket_coverall", weeklyPieces: numberValue(state, "weeklyJackets"), goods: ["jackets"] }
  ].filter((item) => item.weeklyPieces > 0 && item.goods.some((id) => selected(state, id)))
    .map(({ goods, ...item }) => item);

  const specialtyItems = (state) => [
    { type: "robe", weeklyPieces: numberValue(state, "weeklyRobes"), good: "robes" },
    { type: "blanket", weeklyPieces: numberValue(state, "weeklyBlankets"), good: "blankets" }
  ].filter((item) => item.weeklyPieces > 0 && selected(state, item.good))
    .map(({ good, ...item }) => item);

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
    volumeEvidence: usingDirectPounds(state) ? "customer_provided" : "estimated",
    ...(usingDirectPounds(state) ? { knownWeeklyPounds: numberValue(state, "knownVolume") } : {}),
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
      linenServicePercent: 90
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
      ...(selected(state, "handTowels") ? { handTowelsPerAppointment: numberValue(state, "handTowelsPerAppointment") } : {})
    };
    if (state.operation === "gym") return {
      ...commonInput(state, "gym"),
      weeklyTowelUses: requiredDriver(state, "weeklyTowelUses")
    };
    if (state.operation === "events") return {
      ...commonInput(state, "event"),
      ...(selected(state, "tablecloths") ? { weeklyTablecloths: numberValue(state, "weeklyTablecloths") } : {}),
      ...(selected(state, "napkins") ? { weeklyNapkins: numberValue(state, "weeklyNapkins") } : {}),
      ...(positive(numberValue(state, "totalWeeklyPieces")) ? { totalWeeklyPieces: numberValue(state, "totalWeeklyPieces") } : {}),
      specializedHandling: commonInput(state, "event").specializedHandling || state.goods.some((id) => !["tablecloths", "napkins"].includes(id))
    };
    if (state.operation === "restaurant") {
      const includesDiningLinen = state.goods.some((id) => ["napkins", "tableLinens"].includes(id));
      return {
        ...commonInput(state, "restaurant"),
        ...(includesDiningLinen && positive(numberValue(state, "weeklyCovers")) ? { weeklyCovers: numberValue(state, "weeklyCovers") } : {}),
        ...(usingDirectPounds(state) ? { knownWeeklyLinenPounds: numberValue(state, "knownVolume") } : {}),
        garments: garmentLines(state)
      };
    }
    if (state.operation === "uniforms") return {
      ...commonInput(state, "uniform"),
      garments: garmentLines(state)
    };
    if (state.operation === "casino") {
      const programs = [];
      if (selected(state, "towels") && numberValue(state, "hotelRooms") > 0) programs.push({ lane: "hotel", rooms: numberValue(state, "hotelRooms") });
      if (state.goods.some((id) => ["napkins", "tableLinens"].includes(id)) && numberValue(state, "weeklyCovers") > 0) programs.push({ lane: "restaurant", weeklyCovers: numberValue(state, "weeklyCovers"), garments: [] });
      const banquetSelected = state.goods.some((id) => ["napkins", "tableLinens", "banquetLinens"].includes(id));
      if (banquetSelected && numberValue(state, "weeklyTablecloths") + numberValue(state, "weeklyNapkins") > 0) programs.push({ lane: "event", weeklyTablecloths: numberValue(state, "weeklyTablecloths"), weeklyNapkins: numberValue(state, "weeklyNapkins") });
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
    uniformShirts: numberValue(state, "weeklyUniformTops"), casinoUniforms: numberValue(state, state.operation === "casino" ? "weeklyUniformTops" : "weeklyCasinoUniformTops"),
    workwear: numberValue(state, "weeklyPants"), jackets: numberValue(state, "weeklyJackets")
  }[id] || 0);

  const proxyComplete = (state) => {
    const required = {
      hotel: ["rooms", "occupancy"],
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
    const knownPounds = usingDirectPounds(state) ? numberValue(state, "knownVolume") : undefined;
    const restaurantGarmentOnly = state.operation === "restaurant"
      && !state.goods.some((id) => ["napkins", "tableLinens", "barTowels"].includes(id))
      && garmentLines(state).length > 0;
    const pieceCountLane = ["events", "uniforms"].includes(state.operation) || restaurantGarmentOnly;
    const evidence = knownPounds ? "known_pounds" : pieceCountLane ? "piece_counts" : proxyComplete(state) ? "business_proxy" : "default_mix";
    const selectedGoods = state.goods.map((id) => ({
      id: publicGoodId(id),
      ...(goodQuantity(state, id) > 0 ? { weeklyPieces: goodQuantity(state, id) } : {})
    }));
    const allowedVolumeKeys = [
      "rooms", "occupancyPercent", "linenServicePercent", "licensedCapacity",
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
      volume[key] = Number(volume[key] || 0) + line.weeklyPieces;
    });
    if (state.operation === "casino") {
      if (selected(state, "towels")) volume.hotelRooms = numberValue(state, "hotelRooms");
      if (state.goods.some((id) => ["napkins", "tableLinens"].includes(id))) volume.weeklyCovers = numberValue(state, "weeklyCovers");
      if (state.goods.some((id) => ["tableLinens", "banquetLinens"].includes(id))) volume.weeklyTablecloths = numberValue(state, "weeklyTablecloths");
      if (state.goods.some((id) => ["napkins", "tableLinens", "banquetLinens"].includes(id))) volume.weeklyNapkins = numberValue(state, "weeklyNapkins");
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
      pattern: { seasonal: false },
      service: {
        storage: "ample",
        ...(cadence ? { requestedPickupsPerWeek: cadence } : {}),
        customSorting: state.specialtyNeeds.some((id) => ["propertySort", "departmentSort"].includes(id))
      },
      route: {
        zip: routeZip(state),
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
    const hasActualRoute = /^\d{5}$/.test(locationValue(state));
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
        pickups: estimate.route.recommendedPickupsPerWeek,
        reason: !hasActualRoute
          ? "A central San Diego route is being used for this early range; add your ZIP to refine it."
          : estimate.route.remoteReview
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
        hasActualRoute ? `Route review for ${locationValue(state)}` : `Central San Diego planning route (${pricingRules.planningZip})`
      ],
      estimateToken: hasActualRoute ? payload.estimateToken : null,
      sourceInput: input,
      usingPlanningZip: !hasActualRoute
    };
  };

  const calculatePlanningRange = async (state) => {
    if (["wholesale", "other"].includes(state.operation)) {
      return unavailableRecommendation(state, "Wholesale dry cleaning and Other / Not Sure are reviewed manually; no numeric range is invented.", true);
    }
    const input = buildEstimateInput(state);
    if (!input) return unavailableRecommendation(state, "This program needs a Shelton review before pricing.", true);
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 10000);
    try {
      const response = await window.fetch(apiUrl(pricingRules.estimatePath), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estimate: input }),
        signal: controller.signal
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
    } finally {
      window.clearTimeout(timeoutId);
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
