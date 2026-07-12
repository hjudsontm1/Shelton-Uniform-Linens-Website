const assert = require("node:assert/strict");
const path = require("node:path");

global.window = {};
require(path.resolve(__dirname, "../assets/js/pricing-rules.dev.js"));

const { pricingRules, calculatePlanningRange } = global.window.SheltonPricingDevelopmentRules;

const hotelRobes = {
  operation: "hotel",
  goods: ["robes"],
  scale: { rooms: "80", occupancy: "75to89", weeklyTurns: "220", storage: "limited", knownVolume: "" },
  finish: ["hanging", "poly"],
  specialtyNeeds: ["delicate"],
  ownership: "some",
  location: { type: "zip", value: "92101" }
};

const first = calculatePlanningRange(hotelRobes, pricingRules);
const second = calculatePlanningRange(hotelRobes, pricingRules);
assert.deepEqual(first, second, "development results are deterministic");
assert.equal(first.developmentOnly, true);
assert.match(first.warning, /DEVELOPMENT ESTIMATE - NOT APPROVED PRICING/);
assert.equal(first.model.id, "hybrid");
assert.equal(first.comparisons.length, 3);
assert.equal(first.comparisons.filter((item) => item.recommended).length, 1);
assert.ok(first.range.weeklyHigh > first.range.weeklyLow);
assert.ok(first.range.monthlyHigh > first.range.weeklyHigh);
assert.match(first.rhythm.label, /commercial pickup and return/i);
assert.ok(first.factors.some((item) => item.includes("92101")));

const event = calculatePlanningRange({
  operation: "events",
  goods: ["tablecloths", "napkins"],
  scale: { eventsPerMonth: "12", piecesPerEvent: "450", returnWindow: "urgent", seasonality: "seasonal" },
  finish: ["pressed", "folded", "labeled"],
  specialtyNeeds: ["colorRetention", "deadline"],
  ownership: "own",
  location: { type: "city", value: "San Diego" }
}, pricingRules);
assert.match(event.rhythm.label, /Event-scheduled/);
assert.match(event.rhythm.label, /24-48 hour/);
assert.equal(event.model.id, "cog");

const rental = first.comparisons.find((item) => item.id === "rental");
const cog = first.comparisons.find((item) => item.id === "cog");
assert.ok(rental.weeklyLow > cog.weeklyLow, "development inventory factors remain independently comparable");

console.log("Development pricing rules tests passed.");
