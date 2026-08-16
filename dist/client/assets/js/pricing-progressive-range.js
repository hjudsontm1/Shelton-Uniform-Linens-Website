(function () {
  "use strict";

  const positive = (value) => Number(value) > 0;
  const present = (value) => String(value ?? "").trim() !== "";
  const anyPositive = (state, ids) => ids.some((id) => positive(state.scale?.[id]));

  const driverRules = {
    hotel: { ids: ["rooms", "knownVolume"], label: "guest-room count or measured weekly pounds" },
    senior_living: { ids: ["licensedCapacity", "knownVolume"], label: "resident capacity or measured weekly pounds" },
    residential_treatment: { ids: ["licensedCapacity", "knownVolume"], label: "bed capacity or measured weekly pounds" },
    str: { ids: ["properties", "turnsPerProperty", "weeklyTurns", "knownVolume"], label: "property activity or measured weekly pounds" },
    spa: { ids: ["appointments", "knownVolume"], label: "appointment volume or measured weekly pounds" },
    medspa: { ids: ["appointments", "knownVolume"], label: "appointment volume or measured weekly pounds" },
    gym: { ids: ["weeklyTowelUses", "knownVolume"], label: "towel use or measured weekly pounds" },
    events: { ids: ["weeklyTablecloths", "weeklyNapkins", "totalWeeklyPieces"], label: "weekly linen count" },
    restaurant: { ids: ["weeklyCovers", "knownVolume", "weeklyChefCoats", "weeklyAprons"], label: "weekly cover, linen, or garment count" },
    casino: { ids: ["hotelRooms", "weeklyCovers", "weeklyTablecloths", "weeklyNapkins", "weeklyChefCoats", "weeklyUniformTops"], label: "active department volume" },
    uniforms: { ids: ["weeklyUniformTops", "weeklyChefCoats", "weeklyPants", "weeklyJackets"], label: "weekly garment count" },
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
      return { ready: false, message: "Add one meaningful sizing answer in Section 02 to begin.", label: "sizing answer", manualReview: false };
    }
    const ready = anyPositive(state, rule.ids);
    return {
      ready,
      label: rule.label,
      manualReview: Boolean(rule.manualReview),
      message: ready
        ? rule.manualReview
          ? "Enough information is available to open the Shelton review path."
          : "Your first planning range is available. Additional answers will narrow it."
        : `Add a ${rule.label} in Section 02 to see your first ${rule.manualReview ? "review path" : "broad range"}.`
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
    const all = [
      Boolean(state?.operation),
      Boolean(state?.goods?.length),
      ...visibleFields.filter((field) => field.required).map((field) => fieldAnswered(state, field)),
      Boolean(state?.ownership),
      Boolean(options.locationValid)
    ];
    const answered = all.filter(Boolean).length;
    const total = Math.max(1, all.length);
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

  const roundedMoney = (value) => Math.round(Number(value) / 5) * 5;

  const refine = (result, detail) => {
    if (!result || result.rangeUnavailable || !result.range) return result;
    return {
      ...result,
      precision: { ...detail },
      factors: result.factors || []
    };
  };

  window.SheltonProgressiveRange = { minimumDriver, precision, refine };
}());
