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
  assert.deepEqual(config.chapterOrder, ["operation", "goods", "ownership", "scale", "finish", "location", "review"]);
  assert.equal(config.storageKey, `shelton-pricing-spine-v${config.version}`);

  const factorOrder = ["factor-program", "factor-ownership", "factor-volume", "factor-finish", "factor-route", "planning-range"];
  let previous = -1;
  factorOrder.forEach((id) => {
    const position = pricingHtml.indexOf(`id="${id}"`);
    assert.ok(position > previous, `${id} follows the preceding estimator section`);
    previous = position;
  });
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

test("specialty-event topology uses the direct piece path", () => {
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
    scale: { entryMode: "direct", totalWeeklyPieces: "500", seasonality: "eventDriven" }
  });
  assert.equal(progressive.minimumDriver(directState).ready, true);
  const input = engine.buildEstimateInput(directState);
  assert.equal(input.operation, "event");
  assert.equal(input.volume.evidence, "piece_counts");
  assert.equal(input.volume.totalWeeklyPieces, 500);
  assert.equal(input.pattern.seasonal, true);
});

test("gym exposes one demand-pattern control and no duplicate seasonality", () => {
  const ids = fieldIds("gym");
  assert.equal(ids.filter((id) => id === "peakPattern").length, 1);
  assert.equal(ids.includes("seasonality"), false);
  assert.equal(ids.includes("variability"), false);
  assert.deepEqual(field("gym", "peakPattern").options.map((option) => option.value), ["balanced", "variable"]);
  assert.equal(inputFor({
    operation: "gym",
    goods: ["towels"],
    scale: { entryMode: "drivers", weeklyTowelUses: "1200", peakPattern: "variable" }
  }).pattern.seasonal, true);
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
