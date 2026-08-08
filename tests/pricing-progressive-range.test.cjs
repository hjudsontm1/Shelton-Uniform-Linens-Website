const assert = require("node:assert/strict");
const path = require("node:path");

global.window = {};
require(path.resolve(__dirname, "../assets/js/pricing-progressive-range.js"));

const { minimumDriver, precision, refine } = global.window.SheltonProgressiveRange;
const hotelFields = [
  { id: "rooms", type: "number", min: 1, max: 5000 },
  { id: "occupancy", type: "select" },
  { id: "bedSystem", type: "select" },
  { id: "storage", type: "select" },
  { id: "knownVolume", type: "number", min: 1, max: 250000 }
];

const earlyHotel = {
  operation: "hotel",
  goods: ["sheets"],
  scale: { rooms: "100" },
  ownership: "",
  location: "",
  returnWindow: "",
  access: ""
};

assert.equal(minimumDriver({ operation: "", goods: [], scale: {} }).ready, false);
assert.equal(minimumDriver({ operation: "hotel", goods: ["sheets"], scale: {} }).ready, false);
assert.equal(minimumDriver(earlyHotel).ready, true, "one primary sizing answer opens the hotel range");
assert.equal(minimumDriver({ operation: "hotel", goods: ["sheets"], scale: { entryMode: "direct", knownVolume: "4200" } }).ready, true, "measured pounds open the range without proxy answers");
assert.equal(minimumDriver({ operation: "str", goods: ["sheets"], scale: { entryMode: "drivers", turnsPerProperty: "1.5" } }).ready, true, "per-property STR turns are a valid first driver");
assert.equal(minimumDriver({ operation: "events", goods: ["napkins"], scale: { weeklyNapkins: "800" } }).ready, true);
assert.equal(minimumDriver({ operation: "other", goods: ["towels"], scale: { weeklyVolume: "1000" } }).manualReview, true);

const earlyPrecision = precision(earlyHotel, hotelFields, { locationValid: false });
const refinedHotel = {
  ...earlyHotel,
  scale: { rooms: "100", occupancy: "75to89", bedSystem: "mixed", storage: "limited", knownVolume: "4800" },
  ownership: "own",
  returnWindow: "standard",
  access: "dock"
};
const refinedPrecision = precision(refinedHotel, hotelFields, { locationValid: true });
assert.ok(refinedPrecision.ratio > earlyPrecision.ratio, "additional answers increase estimator precision");

const modelResult = {
  rangeUnavailable: false,
  range: {
    weeklyLow: 5100,
    weeklyBase: 5500,
    weeklyHigh: 5900
  },
  confidence: { level: "Directional confidence", explanation: "Estimator confidence" },
  factors: ["Model factor"]
};
const earlyRange = refine(modelResult, earlyPrecision);
const refinedRange = refine(modelResult, refinedPrecision);
assert.deepEqual(earlyRange.range, modelResult.range, "the website never widens the server-owned component range");
assert.deepEqual(refinedRange.range, modelResult.range, "the website never invents a narrower range from form completeness");
assert.equal(earlyRange.confidence.explanation, modelResult.confidence.explanation);

const manual = { rangeUnavailable: true, range: null, manualReview: true };
assert.equal(refine(manual, earlyPrecision), manual, "manual-review programs remain manual-review programs");

console.log("Progressive pricing range tests passed.");
