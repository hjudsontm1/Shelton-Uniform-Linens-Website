const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

// This suite intentionally exercises the publishable website tree, not the
// editable source mirror. It has no third-party dependencies and runs with:
//   node tests/dist-estimator-overnight.test.cjs
const clientRoot = path.resolve(__dirname, "../dist/client");
const scriptPath = (name) => path.join(clientRoot, "assets/js", name);

global.window = {
  setTimeout,
  clearTimeout,
  fetch: async () => {
    throw new Error("A test must install an explicit fetch response.");
  }
};

require(scriptPath("pricing-journey-config.js"));
require(scriptPath("pricing-progressive-range.js"));
require(scriptPath("pricing-engine.js"));

const config = window.SheltonPricingJourneyConfig;
const progressive = window.SheltonProgressiveRange;
const engine = window.SheltonPricingEngine;
const pricingHtml = fs.readFileSync(path.join(clientRoot, "pricing.html"), "utf8");
const pricingSpineCss = fs.readFileSync(path.join(clientRoot, "assets/css/pricing-spine-concept.css"), "utf8");
const learningSource = fs.readFileSync(scriptPath("pricing-learning.js"), "utf8");

const tests = [];
const test = (name, callback) => tests.push({ name, callback });

const makeState = (overrides = {}) => ({
  operation: "hotel",
  goods: ["sheets"],
  scale: { entryMode: "drivers", rooms: "80", occupancy: "75to89" },
  finish: ["folded"],
  specialtyNeeds: [],
  ownership: "own",
  rentalCategory: "",
  rentalTier: "",
  rentalQuantity: "",
  requestedPickups: "",
  access: "standard",
  location: { type: "zip", value: "92101" },
  ...overrides
});

const inputFor = (overrides) => engine.buildEstimateInput(makeState(overrides));
const fieldIds = (operation) => config.scaleSchemas[operation].map((field) => field.id);
const field = (operation, id) => config.scaleSchemas[operation].find((item) => item.id === id);
const requiredFieldIds = (operation) => config.scaleSchemas[operation]
  .filter((item) => item.required)
  .map((item) => item.id);

const selectedGood = (input, id) => input.selectedGoods.find((item) => item.id === id);

test("canonical dist/client operation and factor order", () => {
  assert.match(clientRoot, /\/dist\/client$/);
  assert.deepEqual(config.operations.map((operation) => operation.id), [
    "hotel", "senior_living", "residential_treatment", "str", "spa", "medspa", "gym",
    "events", "restaurant", "casino", "uniforms", "wholesale", "other"
  ]);
  assert.deepEqual(config.chapterOrder, ["operation", "goods", "ownership", "scale", "location", "review"]);
  assert.equal(config.storageKey, `shelton-pricing-spine-v${config.version}`);

  const factorOrder = ["factor-program", "factor-ownership", "factor-volume", "factor-route", "planning-range"];
  let previous = -1;
  factorOrder.forEach((id) => {
    const position = pricingHtml.indexOf(`id="${id}"`);
    assert.ok(position > previous, `${id} follows the preceding estimator section`);
    previous = position;
  });
  assert.doesNotMatch(pricingHtml, /id="factor-finish"/, "finish and return no longer impersonate a required estimator step");
  assert.match(pricingHtml, /data-program-overview/, "derived service rhythm, finish, and return stay with the planning range");
  assert.ok(pricingHtml.indexOf("data-access-input") > pricingHtml.indexOf("data-precision-refinement"), "site access lives inside the optional precise-quote disclosure");
  assert.deepEqual(config.ownershipChoices.map((choice) => choice.id), ["own", "supply", "unsure"], "the basic ownership choice omits the hybrid path");
  assert.match(pricingHtml, /class="ownership-explainer"/, "ownership explanations are available on demand");
  assert.doesNotMatch(pricingHtml, /data-return-format-option/, "derived return format is no longer presented as clickable choices");
  assert.match(pricingHtml, /data-return-format-icon[^>]*aria-hidden="true"/, "the derived return summary may use a decorative icon without becoming a control");
  assert.match(pricingHtml, /data-precision-refinement[^>]*hidden/, "optional precision questions stay hidden until a range exists");
  assert.match(pricingHtml, /Want a more precise quote\?/, "the optional precision layer is clearly invited after the broad range");
  assert.match(pricingHtml, /data-refinement-storage/, "storage remains available only as an optional refinement");
  assert.match(pricingHtml, /data-refinement-demand/, "demand pattern remains available only as an optional refinement");
  assert.match(pricingHtml, /data-inventory-tier/, "supplied-inventory quality remains available only as an optional refinement");
  assert.doesNotMatch(pricingHtml, /data-ownership-options[^>]*aria-required/, "ownership refines rather than blocks the first range");
  assert.doesNotMatch(pricingHtml, /data-location-input[^>]*\srequired(?:\s|>)/, "ZIP refines rather than blocks the first range");
});

test("operation presets are explicit and custom goods begin blank", () => {
  const hotel = config.operations.find((item) => item.id === "hotel");
  assert.deepEqual(hotel.typicalGoods, ["sheets", "towels"]);
  config.operations.forEach((operation) => {
    assert.ok(Array.isArray(operation.typicalGoods), `${operation.id} exposes an explicit typical-goods preset`);
    operation.typicalGoods.forEach((goodId) => {
      assert.ok(operation.goods.includes(goodId), `${operation.id} typical good ${goodId} is selectable`);
    });
  });
  assert.match(learningSource, /goodsCustomize\.addEventListener[\s\S]*?state\.goodsMode = "custom";[\s\S]*?state\.goods = \[\]/);
  assert.match(learningSource, /goodsUseTypical\.addEventListener[\s\S]*?state\.goods = typicalGoods\.slice\(\)/);
  assert.match(learningSource, /good\.icon \|\| "ph-package"/);
  assert.match(pricingHtml, /data-goods-customize/);
  assert.match(pricingHtml, /goods-icon-grid/);
});

test("Shelton-supplied ownership starts at Standard without replacing an existing tier", () => {
  assert.match(learningSource, /state\.ownership === "supply" && !state\.rentalTier\) state\.rentalTier = "standard"/);
  assert.match(learningSource, /state\.ownership === "supply" && !state\.rentalTier\) \{\s*state\.rentalTier = "standard";/);

  const standard = inputFor({ ownership: "supply", rentalTier: "standard" });
  assert.equal(standard.ownership.model, "shelton_supplied");
  assert.equal(standard.ownership.tier, "standard");

  const premium = inputFor({ ownership: "supply", rentalTier: "premium" });
  assert.equal(premium.ownership.tier, "premium", "a later customer tier choice remains authoritative");
});

test("piece-count estimates use piece-appropriate result copy", () => {
  const events = inputFor({
    operation: "events",
    goods: ["tablecloths"],
    scale: { weeklyTablecloths: "150", weeklyNapkins: "0", totalWeeklyPieces: "150" }
  });
  assert.equal(events.volume.evidence, "piece_counts");
  assert.match(learningSource, /sourceInput\?\.volume\?\.evidence === "piece_counts"/);
  assert.match(learningSource, /Per-piece pricing is confirmed during review\./);
});

test("hotel legacy fields remain removed from config and payload", () => {
  assert.equal(fieldIds("hotel").includes("bedSystem"), false);
  assert.equal(fieldIds("hotel").includes("duvetPercent"), false);
  const input = inputFor({
    goods: ["sheets", "duvetCovers"],
    scale: {
      entryMode: "drivers",
      rooms: "100",
      occupancy: "75to89",
      bedSystem: "mixed",
      duvetPercent: "85"
    }
  });
  assert.equal("bedSystem" in input.volume, false);
  assert.equal("duvetPercent" in input.volume, false);
});

test("exact occupancy refines a selected occupancy band", () => {
  ["hotel", "senior_living", "residential_treatment"].forEach((operation) => {
    const exactField = field(operation, "occupancyExact");
    assert.ok(exactField, `${operation} offers exact occupancy after the broad band`);
    assert.equal(exactField.required, false, `${operation} exact occupancy remains optional`);
    assert.ok(fieldIds(operation).indexOf("occupancyExact") > fieldIds(operation).indexOf("occupancy"));
  });

  const exact = inputFor({
    scale: { entryMode: "drivers", rooms: "100", occupancy: "50to74", occupancyExact: "72" }
  });
  assert.equal(exact.volume.occupancyPercent, 72, "a valid exact percentage replaces the band midpoint");

  const bandOnly = inputFor({
    scale: { entryMode: "drivers", rooms: "100", occupancy: "50to74" }
  });
  assert.equal(bandOnly.volume.occupancyPercent, 62, "the band midpoint remains the fast-answer fallback");

  const contradictory = inputFor({
    scale: { entryMode: "drivers", rooms: "100", occupancy: "50to74", occupancyExact: "82" }
  });
  assert.equal(contradictory.volume.occupancyPercent, 62, "an exact value outside the selected band cannot silently contradict it");

  const hotelFields = config.scaleSchemas.hotel;
  const early = progressive.precision(makeState({
    scale: { entryMode: "drivers", rooms: "100", occupancy: "50to74" }
  }), hotelFields);
  const refined = progressive.precision(makeState({
    scale: { entryMode: "drivers", rooms: "100", occupancy: "50to74", occupancyExact: "72" }
  }), hotelFields);
  assert.ok(refined.ratio > early.ratio, "exact occupancy tightens the planning precision without becoming required");
  assert.match(learningSource, /field\.id === "occupancyExact"[\s\S]*state\.scale\.occupancy/);
});

test("access and requested cadence map exactly to the public contract", () => {
  const accessCases = [
    ["", "standard"],
    ["standard", "standard"],
    ["limited", "limited"],
    ["complex", "difficult"]
  ];
  accessCases.forEach(([answer, expected]) => {
    assert.equal(inputFor({ access: answer }).route.access, expected);
  });

  const cadenceCases = [
    ["weekly", 1],
    ["twiceWeekly", 2],
    ["threeWeekly", 3],
    ["weekday", 5]
  ];
  cadenceCases.forEach(([answer, expected]) => {
    assert.equal(inputFor({ requestedPickups: answer }).service.requestedPickupsPerWeek, expected);
  });
  assert.equal(
    "requestedPickupsPerWeek" in inputFor({ requestedPickups: "daily" }).service,
    false,
    "daily service remains a lead-level route request until the public estimate contract supports seven movements"
  );
  assert.match(pricingHtml, /value="daily"[\s\S]*?<strong>7 days a week<\/strong>/);
  assert.match(learningSource, /daily: 7[\s\S]*?selectedRhythm/);
  assert.match(learningSource, /Seven-day service will be included with your quote request/);
  assert.equal("requestedPickupsPerWeek" in inputFor({ requestedPickups: "" }).service, false);
  assert.equal("requestedPickupsPerWeek" in inputFor({ requestedPickups: "recommended" }).service, false);
});

test("only the intended first sizing answer is required", () => {
  assert.deepEqual(Object.fromEntries(config.operations.map(({ id }) => [id, requiredFieldIds(id)])), {
    hotel: ["rooms"],
    senior_living: ["licensedCapacity"],
    residential_treatment: ["licensedCapacity"],
    str: ["properties"],
    spa: ["appointments"],
    medspa: ["appointments"],
    gym: ["weeklyTowelUses"],
    events: [],
    restaurant: [],
    casino: [],
    uniforms: [],
    wholesale: ["weeklyVolume"],
    other: ["weeklyVolume"]
  });
});

test("STR readiness and numeric bounds reject misleading answers", () => {
  assert.equal(progressive.minimumDriver(makeState({
    operation: "str",
    goods: ["sheets"],
    scale: { entryMode: "drivers", turnsPerProperty: "2" }
  })).ready, false, "turns per property alone cannot size an STR program");
  assert.equal(progressive.minimumDriver(makeState({
    operation: "str",
    goods: ["sheets"],
    scale: { entryMode: "drivers", properties: "10" }
  })).ready, true);
  assert.equal(progressive.minimumDriver(makeState({
    operation: "str",
    goods: ["sheets"],
    scale: { entryMode: "drivers", knownVolume: "5000" }
  })).ready, false, "a hidden direct answer cannot open the range in driver mode");
  assert.equal(progressive.minimumDriver(makeState({
    operation: "str",
    goods: ["sheets"],
    scale: { entryMode: "direct", knownVolume: "5000" }
  })).ready, true);

  assert.equal(progressive.minimumDriver(makeState({ scale: { entryMode: "drivers", rooms: "5000" } })).ready, true);
  assert.equal(progressive.minimumDriver(makeState({ scale: { entryMode: "drivers", rooms: "5001" } })).ready, false);
  const invalid = inputFor({
    goods: ["sheets", "robes"],
    scale: { entryMode: "drivers", rooms: "5001", weeklyRobes: "250001" }
  });
  assert.notEqual(invalid.volume.rooms, 5001, "an out-of-bounds room count never reaches the public payload");
  assert.deepEqual(selectedGood(invalid, "robes"), { id: "robes" }, "an out-of-bounds optional piece count is omitted");
});

test("specialty-event topology keeps total-piece answers as an honest manual review", async () => {
  assert.equal(config.scaleEntryModes.events.directField, "totalWeeklyPieces");
  assert.match(
    learningSource,
    /state\.operation === "events"[\s\S]*?!state\.goods\.some\(\(id\) => \["tablecloths", "napkins"\]\.includes\(id\)\)[\s\S]*?onlyDirect: true/,
    "event specialty goods force the only-direct topology"
  );
  const driverState = makeState({
    operation: "events",
    goods: ["runners"],
    scale: { entryMode: "drivers", totalWeeklyPieces: "500" }
  });
  assert.equal(progressive.minimumDriver(driverState).ready, false, "the direct count is inactive in driver mode");
  const directState = makeState({
    operation: "events",
    goods: ["runners"],
    scale: { entryMode: "direct", totalWeeklyPieces: "500" }
  });
  assert.equal(progressive.minimumDriver(directState).ready, true);
  const input = engine.buildEstimateInput(directState);
  assert.equal(input.operation, "event");
  assert.equal(input.volume.evidence, "piece_counts");
  assert.equal(input.volume.totalWeeklyPieces, 500);
  assert.equal(input.pattern.seasonal, false);
  let requested = false;
  window.fetch = async () => {
    requested = true;
    throw new Error("the unsupported total-only payload must not reach the pricing API");
  };
  const result = await engine.calculatePlanningRange(directState);
  assert.equal(requested, false);
  assert.equal(result.rangeUnavailable, true);
  assert.equal(result.manualReview, true);
  assert.match(result.confidence.explanation, /does not identify the tablecloth and napkin mix/i);
});

test("low-value storage and demand-pattern questions stay out of every estimator path", () => {
  const removed = new Set(["storage", "seasonality", "variability", "peakPattern"]);
  config.operations.forEach(({ id }) => {
    assert.equal(fieldIds(id).some((fieldId) => removed.has(fieldId)), false, `${id} has no low-value storage or pattern step`);
  });
  const staleState = inputFor({
    scale: { entryMode: "drivers", rooms: "80", storage: "tight", seasonality: "eventDriven" }
  });
  assert.deepEqual(staleState.pattern, { seasonal: false });
  assert.equal(staleState.service.storage, "ample");
});

test("early ranges use a transparent planning ZIP and real ZIPs replace it", async () => {
  const earlyState = makeState({ ownership: "", location: { type: "city", value: "" } });
  const earlyInput = engine.buildEstimateInput(earlyState);
  assert.equal(earlyInput.route.zip, engine.pricingRules.planningZip);
  assert.equal(earlyInput.ownership.model, "unsure");

  window.fetch = async () => response(readyPayload());
  const early = await engine.calculatePlanningRange(earlyState);
  assert.equal(early.usingPlanningZip, true);
  assert.equal(early.estimateToken, null, "a planning-route estimate token cannot be attached to a lead");
  assert.match(early.rhythm.reason, /central San Diego route/i);

  const routedState = makeState({ location: { type: "zip", value: "92037" } });
  assert.equal(engine.buildEstimateInput(routedState).route.zip, "92037");
  const routed = await engine.calculatePlanningRange(routedState);
  assert.equal(routed.usingPlanningZip, false);
  assert.equal(routed.estimateToken, "overnight-token");
});

test("progressive uncertainty narrows as useful details are added", () => {
  const result = {
    rangeUnavailable: false,
    range: { weeklyLow: 400, weeklyBase: 500, weeklyHigh: 600 },
    sourceInput: { volume: { evidence: "business_proxy" } },
    factors: []
  };
  const early = progressive.refine(result, { ratio: 0.35, label: "Early" });
  const detailed = progressive.refine(result, { ratio: 1, label: "Detailed" });
  assert.ok((early.range.weeklyHigh - early.range.weeklyLow) > (detailed.range.weeklyHigh - detailed.range.weeklyLow));
  assert.deepEqual(early.range, { weeklyLow: 415, weeklyBase: 500, weeklyHigh: 585 });
  assert.deepEqual(detailed.range, { weeklyLow: 450, weeklyBase: 500, weeklyHigh: 550 });
  assert.ok(Math.abs(early.uncertaintySpread - 0.165) < Number.EPSILON);
  assert.equal(detailed.uncertaintySpread, 0.10);
});

test("confidence lanes start at five, seven, and ten percent", () => {
  const resultFor = (evidence) => ({
    rangeUnavailable: false,
    range: { weeklyLow: 5200, weeklyBase: 6604, weeklyHigh: 7800 },
    sourceInput: { volume: { evidence } },
    unitPricing: { poundLow: 0.88, poundHigh: 0.88 },
    factors: []
  });

  const pounds = progressive.refine(resultFor("known_pounds"), { ratio: 1, label: "Detailed" });
  const pieces = progressive.refine(resultFor("piece_counts"), { ratio: 1, label: "Detailed" });
  const rooms = progressive.refine(resultFor("business_proxy"), { ratio: 1, label: "Detailed" });

  assert.equal(pounds.uncertaintySpread, 0.05);
  assert.deepEqual(pounds.range, { weeklyLow: 6270, weeklyBase: 6604, weeklyHigh: 6935 });
  assert.deepEqual(pounds.unitPricing, { poundLow: 0.836, poundHigh: 0.924, poundBase: 0.88 });
  assert.equal(pieces.uncertaintySpread, 0.07);
  assert.equal(rooms.uncertaintySpread, 0.10);
  assert.ok(pounds.range.weeklyLow > resultFor("known_pounds").range.weeklyLow, "measured pounds replace the older generic lower bound");
  assert.ok(pounds.range.weeklyHigh < resultFor("known_pounds").range.weeklyHigh, "measured pounds replace the older generic upper bound");
});

test("missing refiners add uncertainty above each evidence baseline", () => {
  const makeResult = (evidence) => ({
    rangeUnavailable: false,
    range: { weeklyLow: 400, weeklyBase: 500, weeklyHigh: 600 },
    sourceInput: { volume: { evidence } },
    factors: []
  });
  const pounds = progressive.refine(makeResult("known_pounds"), { ratio: 0.5, label: "Developing" });
  const pieces = progressive.refine(makeResult("piece_counts"), { ratio: 0.5, label: "Developing" });
  const rooms = progressive.refine(makeResult("business_proxy"), { ratio: 0.5, label: "Developing" });

  assert.ok(Math.abs(pounds.uncertaintySpread - 0.075) < Number.EPSILON);
  assert.ok(Math.abs(pieces.uncertaintySpread - 0.105) < Number.EPSILON);
  assert.ok(Math.abs(rooms.uncertaintySpread - 0.15) < Number.EPSILON);
});

test("neutral optional details do not manufacture confidence", () => {
  const fields = config.scaleSchemas.hotel;
  const baseState = makeState({
    location: { type: "city", value: "" },
    refinement: { storage: "", demand: "" }
  });
  const base = progressive.precision(baseState, fields, {
    locationValid: false,
    extraCapacity: 3,
    extraAnswered: 0
  });
  const ordinaryDetails = progressive.precision({
    ...baseState,
    access: "limited",
    refinement: { storage: "ample", demand: "steady" }
  }, fields, {
    locationValid: false,
    extraCapacity: 3,
    extraAnswered: 3
  });

  assert.deepEqual(ordinaryDetails, base, "ordinary review notes do not numerically narrow the range");

  const supplyWithoutTier = progressive.precision({
    ...baseState,
    ownership: "supply",
    rentalTier: ""
  }, fields, { locationValid: false });
  const supplyWithTier = progressive.precision({
    ...baseState,
    ownership: "supply",
    rentalTier: "standard"
  }, fields, { locationValid: false });
  assert.ok(supplyWithTier.ratio > supplyWithoutTier.ratio, "a price-shaping supplied tier still improves confidence");
});

test("only difficult access broadens the supported uncertainty lane", () => {
  const resultFor = (access) => ({
    rangeUnavailable: false,
    range: { weeklyLow: 400, weeklyBase: 500, weeklyHigh: 600 },
    sourceInput: { volume: { evidence: "known_pounds" }, route: { access } },
    factors: []
  });
  const detail = { ratio: 1, label: "Detailed" };
  const standard = progressive.refine(resultFor("standard"), detail);
  const limited = progressive.refine(resultFor("limited"), detail);
  const difficult = progressive.refine(resultFor("difficult"), detail);

  assert.equal(standard.uncertaintySpread, 0.05);
  assert.equal(limited.uncertaintySpread, 0.05, "ordinary access notes do not invent a price or uncertainty change");
  assert.equal(difficult.uncertaintySpread, 0.10, "difficult access preserves the lane's broadest supported spread");
  assert.match(difficult.uncertaintyBasis, /difficult site access/);
});

test("medspa hand-towel quantity is scoped to selected hand towels", () => {
  assert.deepEqual(field("medspa", "handTowelsPerAppointment").goods, ["handTowels"]);
  const sheetsOnly = inputFor({
    operation: "medspa",
    goods: ["sheets"],
    scale: { entryMode: "drivers", appointments: "200", handTowelsPerAppointment: "4" }
  });
  assert.equal("handTowelsPerAppointment" in sheetsOnly.volume, false);
  const withTowels = inputFor({
    operation: "medspa",
    goods: ["sheets", "handTowels"],
    scale: { entryMode: "drivers", appointments: "200", handTowelsPerAppointment: "4" }
  });
  assert.equal(withTowels.volume.handTowelsPerAppointment, 4);
  assert.ok(selectedGood(withTowels, "hand_towels"));
});

test("spa use choices stay generic across all selectable soft goods", () => {
  const use = field("spa", "goodsUse");
  assert.deepEqual(use.options.map((option) => option.value), ["light", "standard", "heavy"]);
  assert.deepEqual(use.options.map((option) => option.label), ["Light use", "Standard use", "Heavy use"]);
  assert.equal(use.options.some((option) => /towel|sheet|robe/i.test(option.label)), false);
  const input = inputFor({
    operation: "spa",
    goods: ["blankets"],
    scale: { entryMode: "direct", knownVolume: "600", goodsUse: "heavy" }
  });
  assert.equal(input.operation, "resort_spa");
  assert.equal(input.volume.evidence, "known_pounds");
  assert.equal(input.volume.goodsUse, "heavy");
});

test("uniform-shirt and casino-uniform counts remain independent", () => {
  assert.deepEqual(field("uniforms", "weeklyUniformTops").goods, ["uniformShirts"]);
  assert.deepEqual(field("uniforms", "weeklyCasinoUniformTops").goods, ["casinoUniforms"]);
  const input = inputFor({
    operation: "uniforms",
    goods: ["uniformShirts", "casinoUniforms"],
    scale: { weeklyUniformTops: "100", weeklyCasinoUniformTops: "40" }
  });
  assert.deepEqual(selectedGood(input, "uniform_tops"), { id: "uniform_tops", weeklyPieces: 100 });
  assert.deepEqual(selectedGood(input, "casino_uniforms"), { id: "casino_uniforms", weeklyPieces: 40 });
  assert.equal(input.volume.weeklyUniformTops, 140, "the aggregate public volume includes both independent lines once");

  const deselected = inputFor({
    operation: "uniforms",
    goods: ["uniformShirts"],
    scale: { weeklyUniformTops: "100", weeklyCasinoUniformTops: "999" }
  });
  assert.equal(deselected.selectedGoods.some((good) => good.id === "casino_uniforms"), false);
  assert.equal(deselected.volume.weeklyUniformTops, 100, "a stale deselected casino count cannot leak into volume");
});

test("restaurant garment-only programs send piece-count evidence", () => {
  const garmentOnly = inputFor({
    operation: "restaurant",
    goods: ["chefCoats"],
    scale: { weeklyChefCoats: "125" }
  });
  assert.equal(garmentOnly.volume.evidence, "piece_counts");
  assert.equal(garmentOnly.volume.weeklyChefCoats, 125);
  assert.deepEqual(selectedGood(garmentOnly, "chef_coats"), { id: "chef_coats", weeklyPieces: 125 });

  const dining = inputFor({
    operation: "restaurant",
    goods: ["napkins"],
    scale: { entryMode: "drivers", weeklyCovers: "800" }
  });
  assert.equal(dining.volume.evidence, "business_proxy");
  assert.equal(dining.volume.weeklyCovers, 800);
});

test("all priced operations build representative public inputs", () => {
  const cases = [
    {
      id: "hotel", expectedOperation: "hotel", goods: ["sheets"],
      scale: { entryMode: "drivers", rooms: "100", occupancy: "75to89" },
      expected: { evidence: "business_proxy", key: "rooms", value: 100 }
    },
    {
      id: "senior_living", expectedOperation: "senior_living", goods: ["sheets"],
      scale: { entryMode: "drivers", licensedCapacity: "120", occupancy: "90plus", careType: "mixed" },
      expected: { evidence: "business_proxy", key: "licensedCapacity", value: 120 }
    },
    {
      id: "residential_treatment", expectedOperation: "residential_treatment", goods: ["sheets"],
      scale: { entryMode: "drivers", licensedCapacity: "48", occupancy: "75to89", careType: "detox_withdrawal" },
      expected: { evidence: "business_proxy", key: "licensedCapacity", value: 48 }
    },
    {
      id: "str", expectedOperation: "str", goods: ["sheets"],
      scale: { entryMode: "drivers", properties: "10", turnsPerProperty: "2", bedroomBasis: "average", averageBedrooms: "3" },
      expected: { evidence: "business_proxy", key: "weeklyTurns", value: 20 }
    },
    {
      id: "spa", expectedOperation: "resort_spa", goods: ["towels"],
      scale: { entryMode: "drivers", appointments: "150", goodsUse: "standard" },
      expected: { evidence: "business_proxy", key: "appointmentsPerWeek", value: 150 }
    },
    {
      id: "medspa", expectedOperation: "medspa", goods: ["sheets"],
      scale: { entryMode: "drivers", appointments: "150" },
      expected: { evidence: "business_proxy", key: "appointmentsPerWeek", value: 150 }
    },
    {
      id: "gym", expectedOperation: "gym", goods: ["towels"],
      scale: { entryMode: "drivers", weeklyTowelUses: "1000" },
      expected: { evidence: "business_proxy", key: "weeklyTowelUses", value: 1000 }
    },
    {
      id: "events", expectedOperation: "event", goods: ["tablecloths", "napkins"],
      scale: { entryMode: "drivers", weeklyTablecloths: "100", weeklyNapkins: "800" },
      expected: { evidence: "piece_counts", key: "weeklyNapkins", value: 800 }
    },
    {
      id: "restaurant", expectedOperation: "restaurant", goods: ["barTowels"],
      scale: { entryMode: "direct", knownVolume: "200" },
      expected: { evidence: "known_pounds", key: "weeklyPounds", value: 200 }
    },
    {
      id: "casino", expectedOperation: "casino", goods: ["casinoUniforms"],
      scale: { weeklyUniformTops: "250" },
      expected: { evidence: "business_proxy", key: "weeklyUniformTops", value: 250 }
    },
    {
      id: "uniforms", expectedOperation: "uniform", goods: ["uniformShirts"],
      scale: { weeklyUniformTops: "250" },
      expected: { evidence: "piece_counts", key: "weeklyUniformTops", value: 250 }
    }
  ];

  cases.forEach(({ id, expectedOperation, goods, scale, expected }) => {
    const input = inputFor({ operation: id, goods, scale });
    assert.ok(input, `${id} builds a public input`);
    assert.equal(input.operation, expectedOperation, `${id} uses its public operation ID`);
    assert.equal(input.volume.evidence, expected.evidence, `${id} uses the expected evidence lane`);
    assert.equal(input.volume[expected.key], expected.value, `${id} preserves its representative sizing answer`);
    assert.equal(input.schemaVersion, engine.pricingRules.schemaVersion);
  });
});

test("goods-topology deselection clears or filters every goods-scoped answer", () => {
  assert.match(
    learningSource,
    /Array\.isArray\(field\.goods\)[\s\S]*?!field\.goods\.some\(\(goodId\) => state\.goods\.includes\(goodId\)\)[\s\S]*?delete state\.scale\[field\.id\]/,
    "the UI deletes a goods-scoped answer when its last applicable good is deselected"
  );

  const event = inputFor({
    operation: "events",
    goods: ["runners"],
    scale: { entryMode: "direct", totalWeeklyPieces: "300", weeklyTablecloths: "900", weeklyNapkins: "900" }
  });
  assert.equal("weeklyTablecloths" in event.volume, false);
  assert.equal("weeklyNapkins" in event.volume, false);

  const restaurant = inputFor({
    operation: "restaurant",
    goods: ["chefCoats"],
    scale: { weeklyChefCoats: "20", weeklyAprons: "900", weeklyCovers: "900", knownVolume: "900" }
  });
  assert.equal("weeklyAprons" in restaurant.volume, false);
  assert.equal("weeklyCovers" in restaurant.volume, false);
  assert.equal("weeklyPounds" in restaurant.volume, false);

  const casino = inputFor({
    operation: "casino",
    goods: ["casinoUniforms"],
    scale: { weeklyUniformTops: "20", hotelRooms: "500", weeklyCovers: "500", weeklyTablecloths: "500", weeklyNapkins: "500" }
  });
  assert.equal("hotelRooms" in casino.volume, false);
  assert.equal("weeklyCovers" in casino.volume, false);
  assert.equal("weeklyTablecloths" in casino.volume, false);
  assert.equal("weeklyNapkins" in casino.volume, false);
});

test("wholesale and other remain manual-only", async () => {
  for (const operation of ["wholesale", "other"]) {
    const state = makeState({
      operation,
      goods: [config.operations.find((item) => item.id === operation).goods[0]],
      scale: { weeklyVolume: "1000", volumeUnit: "pounds" }
    });
    assert.equal(engine.buildEstimateInput(state), null);
    const result = await engine.calculatePlanningRange(state);
    assert.equal(result.rangeUnavailable, true);
    assert.equal(result.manualReview, true);
    assert.equal(result.range, null);
    assert.match(result.confidence.explanation, /reviewed manually|no numeric range is invented/i);
  }
});

const readyPayload = (overrides = {}) => ({
  schemaVersion: engine.pricingRules.schemaVersion,
  estimateToken: "overnight-token",
  estimate: {
    modelVersion: engine.pricingRules.version,
    estimateStatus: "ready",
    ready: true,
    requiresReview: false,
    reviewMessages: [],
    unresolvedFactors: [],
    dominantUncertainty: null,
    confidence: { score: 90, label: "Detailed", evidence: "business_proxy" },
    sizing: { weeklyPounds: 500 },
    pricing: {
      weeklyRange: { low: 400, base: 500, high: 600 },
      unitPrices: [{ label: "Laundry processing", billingUnit: "pound", recommendedRate: 1, weeklyUnits: 500 }]
    },
    route: { label: "Twice weekly", recommendedPickupsPerWeek: 2, remoteReview: false },
    rental: [],
    ...overrides
  }
});

const response = (payload, ok = true) => ({ ok, json: async () => payload });

test("selected estimator cards preserve readable copy at every breakpoint", () => {
  const phoneHelperRule = pricingSpineCss.indexOf(".pricing-spine-workbench .choice-cloud--described label span small");
  const selectedInvariant = pricingSpineCss.lastIndexOf("/* Selected-answer contrast is a component invariant");

  assert.match(pricingHtml, /pricing-spine-concept\.css\?v=20260823-overview-merge-v18/);
  assert.match(pricingHtml, /pricing-progressive-range\.js\?v=20260824-approved-fixes-v1/);
  assert.match(pricingHtml, /pricing-learning\.js\?v=20260824-approved-fixes-v1/);
  assert.match(learningSource, /Estimated processing rate · \$/);
  assert.match(pricingSpineCss, /#factor-volume \.volume-question--empty \{\s*align-items: center;\s*text-align: center;/);
  assert.match(pricingSpineCss, /#factor-program \.operation-picker-field > span,[\s\S]*?#factor-program \.calm-fieldset > legend,[\s\S]*?#factor-program \.calm-fieldset > p \{\s*text-align: center;/);
  assert.match(pricingSpineCss, /\.quote-privacy-note \{[\s\S]*?text-align: center;/);
  assert.match(pricingSpineCss, /#factor-ownership \.ownership-list label:nth-child\(2n\) span \{\s*border-right: 1px solid var\(--calm-ink-line\);/);
  assert.match(pricingSpineCss, /\.range-guidance \{\s*text-align: center;/);
  assert.match(pricingSpineCss, /\.range-program-overview__heading \{[\s\S]*?margin-right: auto;[\s\S]*?margin-left: auto;[\s\S]*?text-align: center;/);
  assert.ok(selectedInvariant > phoneHelperRule, "selected contrast invariant must follow phone helper-color overrides");
  assert.match(pricingSpineCss.slice(selectedInvariant), /\.ownership-list input:checked \+ span small[\s\S]*rgba\(250, 246, 238, 0\.74\)/);
  assert.match(pricingSpineCss.slice(selectedInvariant), /\.choice-cloud input:checked \+ span strong[\s\S]*color: inherit/);
  assert.match(pricingSpineCss.slice(selectedInvariant), /button\[aria-pressed="true"\] small[\s\S]*rgba\(250, 246, 238, 0\.74\)/);
});

test("planning range dock remains visible until the actual range readout is in view", () => {
  assert.match(learningSource, /if \(rangeLive\) rangeObserver\.observe\(rangeLive\)/);
  assert.match(learningSource, /\[q\("\.quote-handoff"\), document\.querySelector\("\.site-footer"\)\]/);
  assert.doesNotMatch(learningSource, /\[q\("\.planning-result"\), q\("\.quote-handoff"\)/);
  assert.match(learningSource, /entry\.intersectionRatio >= 0\.4/);
  assert.match(learningSource, /threshold: \[0, 0\.4\], rootMargin: "0px 0px -72px 0px"/);
  assert.match(learningSource, /closingObserver[\s\S]*threshold: 0, rootMargin: "0px 0px 96px 0px"/);
});

test("quote and numeric corrections have specific accessible associations", () => {
  ["name", "business", "email", "phone", "preferred"].forEach((fieldName) => {
    assert.match(pricingHtml, new RegExp(`id="quote-${fieldName}-error"[^>]*data-quote-field-error="${fieldName}"`));
  });
  assert.match(pricingHtml, /data-volume-estimator-status role="status" aria-live="polite" aria-atomic="true"/);
  assert.match(learningSource, /error\.dataset\.scaleFieldError = field\.id/);
  assert.match(learningSource, /control\.setAttribute\("aria-errormessage", error\.id\)/);
  assert.match(learningSource, /if \(entry\.error\) control\.setAttribute\("aria-errormessage", entry\.error\.id\)/);
  assert.doesNotMatch(learningSource, /setAttribute\("aria-errormessage", "quote-error"\)/);
});

test("engine handles success, manual, and failure responses without stale numbers", async () => {
  const state = makeState({ requestedPickups: "twiceWeekly" });
  let request;
  window.fetch = async (url, options) => {
    request = { url, options };
    return response(readyPayload());
  };
  const success = await engine.calculatePlanningRange(state);
  assert.equal(request.url, "https://api.sheltonlinen.com/api/public/commercial-estimate");
  assert.deepEqual(JSON.parse(request.options.body), { estimate: engine.buildEstimateInput(state) });
  assert.deepEqual(success.range, { weeklyLow: 400, weeklyBase: 500, weeklyHigh: 600 });
  assert.equal(success.rangeUnavailable, false);
  assert.equal(success.manualReview, undefined);
  assert.equal(success.estimateToken, "overnight-token");
  assert.equal(success.rhythm.pickups, 2);

  window.fetch = async () => response(readyPayload({
    estimateStatus: "manual_review",
    ready: false,
    requiresReview: true,
    reviewMessages: ["Shelton must review this mix."],
    unresolvedFactors: ["Special handling"],
    pricing: null
  }));
  const manual = await engine.calculatePlanningRange(state);
  assert.equal(manual.rangeUnavailable, true);
  assert.equal(manual.manualReview, true);
  assert.equal(manual.range, null);
  assert.deepEqual(manual.factors, ["Special handling"]);
  assert.match(manual.confidence.explanation, /Shelton must review this mix/);

  const failureCases = [
    ["non-OK response", async () => response({ error: "Service unavailable" }, false)],
    ["missing estimate", async () => response({ schemaVersion: engine.pricingRules.schemaVersion })],
    ["wrong schema", async () => response({ ...readyPayload(), schemaVersion: "commercial-estimator.invalid" })],
    ["wrong model", async () => response(readyPayload({ modelVersion: "commercial-estimator.invalid" }))],
    ["network exception", async () => { throw new Error("offline"); }]
  ];
  for (const [label, fetchImplementation] of failureCases) {
    window.fetch = fetchImplementation;
    const failure = await engine.calculatePlanningRange(state);
    assert.equal(failure.rangeUnavailable, true, label);
    assert.equal(failure.manualReview, false, label);
    assert.equal(failure.range, null, label);
    assert.equal(failure.estimateToken, null, label);
    assert.match(failure.warning, /TEMPORARILY UNAVAILABLE/, label);
  }
});

(async () => {
  let passed = 0;
  for (const { name, callback } of tests) {
    try {
      await callback();
      passed += 1;
      console.log(`ok ${passed} - ${name}`);
    } catch (error) {
      console.error(`not ok ${passed + 1} - ${name}`);
      throw error;
    }
  }
  console.log(`\n${passed} estimator regression groups passed against ${clientRoot}`);
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
