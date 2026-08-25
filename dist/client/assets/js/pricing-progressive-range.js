(function () {
  "use strict";

  const positive = (value) => Number(value) > 0;
  const present = (value) => String(value ?? "").trim() !== "";
  const withinConfiguredRange = (state, id) => {
    const value = Number(state.scale?.[id]);
    if (!Number.isFinite(value) || value <= 0) return false;
    const fields = window.SheltonPricingJourneyConfig?.scaleSchemas?.[state.operation] || [];
    const field = fields.find((item) => item.id === id);
    if (!field || field.type !== "number") return true;
    return value >= Number(field.min) && value <= Number(field.max);
  };
  const anyPositive = (state, ids) => ids.some((id) => withinConfiguredRange(state, id));
  const applicableDriverIds = (state, ids) => {
    const config = window.SheltonPricingJourneyConfig;
    const fields = config?.scaleSchemas?.[state.operation] || [];
    const directField = config?.scaleEntryModes?.[state.operation]?.directField;
    return ids.filter((id) => {
      if (id === directField && state.scale?.entryMode !== "direct") return false;
      const field = fields.find((item) => item.id === id);
      return !Array.isArray(field?.goods) || field.goods.some((goodId) => state.goods.includes(goodId));
    });
  };

  const driverRules = {
    hotel: { ids: ["rooms", "knownVolume"], label: "guest-room count or measured weekly pounds" },
    senior_living: { ids: ["licensedCapacity", "knownVolume"], label: "resident capacity or measured weekly pounds" },
    residential_treatment: { ids: ["licensedCapacity", "knownVolume"], label: "bed capacity or measured weekly pounds" },
    str: { ids: ["properties", "weeklyTurns", "knownVolume"], label: "property activity or measured weekly pounds" },
    spa: { ids: ["appointments", "knownVolume"], label: "weekly appointment volume or measured weekly pounds" },
    medspa: { ids: ["appointments", "knownVolume"], label: "weekly appointment volume or measured weekly pounds" },
    gym: { ids: ["weeklyTowelUses", "knownVolume"], label: "towel use or measured weekly pounds" },
    events: { ids: ["weeklyTablecloths", "weeklyNapkins", "totalWeeklyPieces"], label: "weekly linen count" },
    restaurant: { ids: ["weeklyCovers", "knownVolume", "weeklyChefCoats", "weeklyAprons"], label: "weekly cover, linen, or garment count" },
    casino: { ids: ["hotelRooms", "weeklyCovers", "weeklyTablecloths", "weeklyNapkins", "weeklyChefCoats", "weeklyUniformTops"], label: "active department volume" },
    uniforms: { ids: ["weeklyUniformTops", "weeklyCasinoUniformTops", "weeklyChefCoats", "weeklyPants", "weeklyJackets"], label: "weekly garment count" },
    wholesale: { ids: ["weeklyVolume"], label: "approximate weekly volume", manualReview: true },
    other: { ids: ["weeklyVolume"], label: "approximate weekly volume", manualReview: true }
  };

  const minimumDriver = (state) => {
    if (!state?.operation) {
      return { ready: false, message: "Choose an operation in Section 01 to begin.", label: "operation", manualReview: false };
    }
    if (!Array.isArray(state.goods) || !state.goods.length) {
      return { ready: false, message: "Choose at least one item in Section 01 to continue.", label: "item", manualReview: false };
    }
    const rule = driverRules[state.operation];
    if (!rule) {
      return { ready: false, message: "Add one meaningful sizing answer in Section 03 to begin.", label: "sizing answer", manualReview: false };
    }
    const ready = anyPositive(state, applicableDriverIds(state, rule.ids));
    return {
      ready,
      label: rule.label,
      manualReview: Boolean(rule.manualReview),
      message: ready
        ? rule.manualReview
          ? "Enough information is available to open the Shelton review path."
          : "Your first planning range is available. Additional answers will narrow it."
        : `Add a ${rule.label} in Section 03 to see your first ${rule.manualReview ? "review path" : "broad range"}.`
    };
  };

  const fieldAnswered = (state, field) => {
    const value = state.scale?.[field.id];
    if (field.type === "select") return present(value);
    if (!present(value)) return false;
    const numeric = Number(value);
    return Number.isFinite(numeric) && numeric >= Number(field.min) && numeric <= Number(field.max);
  };

  const precision = (state, fields, options = {}) => {
    const visibleFields = Array.isArray(fields) ? fields : [];
    const core = [
      Boolean(state?.operation),
      Boolean(state?.goods?.length),
      ...visibleFields.filter((field) => field.required).map((field) => fieldAnswered(state, field)),
      Boolean(state?.ownership),
      Boolean(options.locationValid)
    ];
    const optionalFields = visibleFields.filter((field) => !field.required && !field.routing);
    const optionalCapacity = Math.min(3, optionalFields.length);
    const optionalAnswered = Math.min(optionalCapacity, optionalFields.filter((field) => fieldAnswered(state, field)).length);
    // Only count an extra answer when it changes the estimate itself. Storage,
    // demand pattern, and ordinary access notes are useful for Shelton's review,
    // but they do not justify a numerically narrower public range. A supplied-
    // inventory tier is different because it is sent to the pricing model.
    const extraCapacity = state?.ownership === "supply" ? 1 : 0;
    const extraAnswered = extraCapacity && present(state?.rentalTier) ? 1 : 0;
    const answered = core.filter(Boolean).length + optionalAnswered + extraAnswered;
    const total = Math.max(1, core.length + optionalCapacity + extraCapacity);
    const ratio = Math.max(0, Math.min(1, answered / total));
    const label = ratio < 0.42 ? "Early" : ratio < 0.66 ? "Developing" : ratio < 0.88 ? "Refined" : "Detailed";
    return {
      ratio,
      percent: Math.round(ratio * 100),
      label,
      answered,
      total,
      missingCount: total - answered
    };
  };

  const roundedMoney = (value, direction = "nearest") => {
    const normalized = Number(value) / 5;
    const rounded = direction === "down"
      ? Math.floor(normalized)
      : direction === "up"
        ? Math.ceil(normalized)
        : Math.round(normalized);
    return rounded * 5;
  };

  const evidenceProfile = (result) => {
    const evidence = String(result?.sourceInput?.volume?.evidence || "default_mix");
    return ({
      known_pounds: { baseline: 0.05, ceiling: 0.10, label: "measured pounds" },
      piece_counts: { baseline: 0.07, ceiling: 0.14, label: "piece counts" },
      business_proxy: { baseline: 0.10, ceiling: 0.20, label: "room and occupancy inputs" },
      default_mix: { baseline: 0.14, ceiling: 0.26, label: "early operating inputs" }
    })[evidence] || { baseline: 0.14, ceiling: 0.26, label: "early operating inputs" };
  };

  const rangedUnitPricing = (unitPricing, spread) => {
    if (!unitPricing) return null;
    const currentLow = Number(unitPricing.poundLow);
    const currentHigh = Number(unitPricing.poundHigh);
    if (!Number.isFinite(currentLow) || !Number.isFinite(currentHigh)) return unitPricing;
    const midpoint = (currentLow + currentHigh) / 2;
    return {
      ...unitPricing,
      poundBase: Number(midpoint.toFixed(4)),
      poundLow: Number((midpoint * (1 - spread)).toFixed(4)),
      poundHigh: Number((midpoint * (1 + spread)).toFixed(4))
    };
  };

  const refine = (result, detail) => {
    if (!result || result.rangeUnavailable || !result.range) return result;
    const serverLow = Number(result.range.weeklyLow);
    const serverHigh = Number(result.range.weeklyHigh);
    const base = Number(result.range.weeklyBase) || (serverLow + serverHigh) / 2;
    const ratio = Math.max(0, Math.min(1, Number(detail?.ratio) || 0));
    const profile = evidenceProfile(result);
    const difficultAccess = result?.sourceInput?.route?.access === "difficult";
    // Difficult access already has explicit review semantics in the public
    // estimate contract. Keep that result at the lane's supported ceiling
    // instead of pretending that unrelated optional answers remove the risk.
    const effectiveRatio = difficultAccess ? 0 : ratio;
    const uncertaintySpread = profile.baseline + ((profile.ceiling - profile.baseline) * (1 - effectiveRatio));
    const weeklyLow = Math.max(0, roundedMoney(base * (1 - uncertaintySpread), "down"));
    const weeklyHigh = roundedMoney(base * (1 + uncertaintySpread), "up");
    return {
      ...result,
      range: {
        ...result.range,
        weeklyLow,
        weeklyHigh
      },
      unitPricing: rangedUnitPricing(result.unitPricing, uncertaintySpread),
      precision: { ...detail },
      uncertaintySpread,
      uncertaintyBasis: difficultAccess ? `${profile.label} plus difficult site access` : profile.label,
      serverRange: { weeklyLow: serverLow, weeklyHigh: serverHigh },
      factors: result.factors || []
    };
  };

  window.SheltonProgressiveRange = { minimumDriver, precision, refine };
}());
