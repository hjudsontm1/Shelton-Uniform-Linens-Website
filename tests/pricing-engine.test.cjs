const assert = require("node:assert/strict");
const path = require("node:path");

const calls = [];
global.document = { querySelector: () => null };
global.window = {
  fetch: async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return {
      ok: true,
      json: async () => ({
        estimateToken: "signed-estimate-token",
        estimate: {
          modelVersion: "commercial-estimator.v2.3",
          lane: calls.at(-1).body.estimate.lane,
          ready: true,
          requiresReview: false,
          reviewMessages: [],
          confidence: { score: 76, label: "Directional", evidence: "estimated" },
          sizing: { weeklyPounds: 6142.5 },
          pricing: {
            weeklyRange: { low: 5100, base: 5500, high: 5900 },
            monthlyRange: { low: 22150, base: 23850, high: 25550 },
            lines: [{ label: "Customer-owned hotel linen", billingUnit: "pound", target: 0.88, weeklyUnits: 6142.5 }]
          },
          route: { label: "Weekday commercial pickup and return", remoteReview: false },
          rental: []
        }
      })
    };
  }
};
require(path.resolve(__dirname, "../assets/js/pricing-engine.js"));

const { pricingRules, buildEstimateInput, calculatePlanningRange } = global.window.SheltonPricingEngine;

const hotel = {
  operation: "hotel",
  goods: ["sheets", "towels", "robes", "blankets"],
  scale: { rooms: "100", occupancy: "75to89", bedSystem: "mixed", duvetPercent: "50", storage: "limited", knownVolume: "", weeklyRobes: "40", weeklyBlankets: "20" },
  finish: ["pressed", "linenCart"],
  specialtyNeeds: [],
  ownership: "own",
  rentalTier: null,
  rentalQuantity: "",
  location: { type: "zip", value: "92101" }
};

(async () => {
  const input = buildEstimateInput(hotel);
  assert.equal(input.lane, "hotel");
  assert.equal(input.rooms, 100);
  assert.equal(input.linenServicePercent, 90);
  assert.deepEqual(input.specialtyItems, [{ type: "robe", weeklyPieces: 40 }, { type: "blanket", weeklyPieces: 20 }]);

  const result = await calculatePlanningRange(hotel, pricingRules);
  assert.equal(result.rulesVersion, "commercial-estimator.v2.3");
  assert.equal(result.estimateToken, "signed-estimate-token");
  assert.equal(result.range.weeklyLow, 5100);
  assert.equal(result.unitRates[0].rate, 0.88);
  assert.match(result.rhythm.label, /Weekday commercial pickup/i);
  assert.equal(calls[0].url, "/api/commercial-estimate");

  const eventInput = buildEstimateInput({
    ...hotel,
    operation: "events",
    goods: ["tablecloths", "napkins"],
    scale: { weeklyTablecloths: "250", weeklyNapkins: "2000", returnWindow: "urgent", seasonality: "seasonal" }
  });
  assert.equal(eventInput.lane, "event");
  assert.equal(eventInput.weeklyTablecloths, 250);
  assert.equal(eventInput.weeklyNapkins, 2000);

  const strInput = buildEstimateInput({ ...hotel, operation: "str", goods: ["sheets"], scale: { properties: "20", weeklyTurns: "40", averageBedrooms: "2" } });
  assert.equal(strInput.averageBedrooms, 2);

  const medspaInput = buildEstimateInput({ ...hotel, operation: "medspa", goods: ["sheets"], scale: { appointments: "200", handTowelsPerAppointment: "0" } });
  assert.equal(medspaInput.lane, "medspa");
  assert.equal(medspaInput.appointmentsPerWeek, 200);

  const rentalInput = buildEstimateInput({ ...hotel, ownership: "supply", rentalTier: "premium", rentalQuantity: "500" });
  assert.deepEqual(rentalInput.rentalSelections, [{ category: "sheets", tier: "premium", quantity: 500, landedCostPerItem: null }]);

  const wholesale = await calculatePlanningRange({ ...hotel, operation: "wholesale" }, pricingRules);
  assert.equal(wholesale.range, null);
  assert.equal(wholesale.manualReview, true);
  assert.match(wholesale.confidence.explanation, /no numeric range is invented/i);

  global.window.fetch = async () => { throw new Error("offline"); };
  const outage = await calculatePlanningRange(hotel, pricingRules);
  assert.equal(outage.range, null);
  assert.equal(outage.estimateToken, null);
  assert.match(outage.warning, /TEMPORARILY UNAVAILABLE/);

  console.log("Commercial Estimator V2.3 website adapter tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
