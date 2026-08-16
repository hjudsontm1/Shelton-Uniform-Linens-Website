const assert = require("node:assert/strict");
const path = require("node:path");

const calls = [];
global.document = { querySelector: () => null };
global.window = {
  setTimeout,
  clearTimeout,
  fetch: async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return {
      ok: true,
      json: async () => ({
        schemaVersion: "commercial-estimator.v3",
        estimateToken: "signed-estimate-token",
        estimate: {
          modelVersion: "commercial-estimator.v2.4",
          estimateStatus: "ready",
          ready: true,
          requiresReview: false,
          reviewMessages: [],
          unresolvedFactors: ["First measured production week"],
          dominantUncertainty: "Weekly quantity",
          confidence: { score: 82, label: "Medium", evidence: "business_proxy" },
          sizing: { weeklyPounds: 6142.5 },
          pricing: {
            typicalWeekly: 5470,
            weeklyRange: { low: 4925, base: 5470, high: 6015 },
            unitPrices: [{ key: "hotel_laundry", label: "Hotel linen processing", billingUnit: "pound", recommendedRate: 0.89, weeklyUnits: 6142.5 }]
          },
          route: { label: "3 pickups per week", recommendedPickupsPerWeek: 3, selectedPickupsPerWeek: 3, remoteReview: false },
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
  rentalCategory: "",
  rentalQuantity: "",
  location: { type: "zip", value: "92101" }
};

(async () => {
  const input = buildEstimateInput(hotel);
  assert.equal(input.schemaVersion, "commercial-estimator.v3");
  assert.equal(input.operation, "hotel");
  assert.equal(input.volume.rooms, 100);
  assert.equal(input.volume.linenServicePercent, 90);
  assert.equal(input.volume.evidence, "business_proxy");
  assert.deepEqual(input.selectedGoods.filter((good) => good.weeklyPieces), [
    { id: "robes", weeklyPieces: 40 },
    { id: "blankets", weeklyPieces: 20 }
  ]);
  assert.equal(input.service.storage, "limited");
  assert.equal(input.route.zip, "92101");
  assert.equal("productionDaysPerWeek" in input, false, "public inputs never control production assumptions");

  const result = await calculatePlanningRange(hotel, pricingRules);
  assert.equal(result.rulesVersion, "commercial-estimator.v2.4");
  assert.equal(result.estimateToken, "signed-estimate-token");
  assert.deepEqual(result.range, { weeklyLow: 4925, weeklyBase: 5470, weeklyHigh: 6015 });
  assert.equal("monthlyBase" in result.range, false, "the website adapter does not expose monthly totals");
  assert.equal(result.unitRates[0].rate, 0.89);
  assert.equal(result.unitPricing.poundLow, 0.89);
  assert.equal(result.unitPricing.poundHigh, 0.89);
  assert.match(result.rhythm.label, /3 pickups/i);
  assert.equal(calls[0].url, "/api/commercial-estimate");
  assert.equal(calls[0].body.estimate.schemaVersion, "commercial-estimator.v3");

  const eventInput = buildEstimateInput({
    ...hotel,
    operation: "events",
    goods: ["tablecloths", "napkins"],
    scale: { weeklyTablecloths: "250", weeklyNapkins: "2000", returnWindow: "urgent", seasonality: "seasonal" }
  });
  assert.equal(eventInput.operation, "event");
  assert.equal(eventInput.volume.weeklyTablecloths, 250);
  assert.equal(eventInput.volume.weeklyNapkins, 2000);
  assert.equal(eventInput.volume.evidence, "piece_counts");

  const strInput = buildEstimateInput({ ...hotel, operation: "str", goods: ["sheets"], scale: { properties: "20", weeklyTurns: "40", averageBedrooms: "2" } });
  assert.equal(strInput.volume.averageBedrooms, 2);

  const strPerPropertyInput = buildEstimateInput({
    ...hotel,
    operation: "str",
    goods: ["sheets"],
    scale: { entryMode: "drivers", properties: "20", turnsPerProperty: "2.5", bedroomBasis: "total", totalBedrooms: "60" }
  });
  assert.equal(strPerPropertyInput.volume.weeklyTurns, 50, "per-property turns convert to total weekly turns");
  assert.equal(strPerPropertyInput.volume.averageBedrooms, 3, "total bedrooms convert to average bedrooms");

  const directStrInput = buildEstimateInput({
    ...hotel,
    operation: "str",
    goods: ["sheets"],
    scale: { entryMode: "direct", knownVolume: "5000" }
  });
  assert.equal(directStrInput.volume.weeklyPounds, 5000);
  assert.equal(directStrInput.volume.evidence, "known_pounds");

  const directHotelInput = buildEstimateInput({
    ...hotel,
    goods: ["sheets"],
    scale: { entryMode: "direct", knownVolume: "4200" }
  });
  assert.equal(directHotelInput.volume.weeklyPounds, 4200);
  assert.equal(directHotelInput.volume.evidence, "known_pounds");

  const partialHotelInput = buildEstimateInput({ ...hotel, goods: ["sheets"], scale: { rooms: "80" } });
  assert.equal(partialHotelInput.volume.rooms, 80);
  assert.equal(partialHotelInput.volume.occupancyPercent, undefined, "Estimator v2.4 owns the unanswered occupancy default");
  assert.equal(partialHotelInput.volume.bedSystem, undefined, "Estimator v2.4 owns the unanswered bed-system default");
  const partialHotelResult = await calculatePlanningRange({ ...hotel, goods: ["sheets"], scale: { rooms: "80" } });
  assert.equal(partialHotelResult.range.weeklyBase, 5470, "a partial but usable hotel state receives a range");

  const partialStrInput = buildEstimateInput({ ...hotel, operation: "str", goods: ["sheets"], scale: { properties: "20" } });
  assert.equal(partialStrInput.volume.properties, 20);
  assert.equal(partialStrInput.volume.weeklyTurns, undefined, "missing STR turns are omitted so the approved fallback can apply");
  assert.equal(partialStrInput.volume.averageBedrooms, undefined);

  const medspaInput = buildEstimateInput({ ...hotel, operation: "medspa", goods: ["sheets"], scale: { appointments: "200", handTowelsPerAppointment: "0" } });
  assert.equal(medspaInput.operation, "medspa");
  assert.equal(medspaInput.volume.appointmentsPerWeek, 200);

  const seniorInput = buildEstimateInput({
    ...hotel,
    operation: "senior_living",
    goods: ["sheets", "blankets"],
    scale: {
      licensedCapacity: "120",
      occupancy: "75to89",
      careType: "mixed",
      memoryCarePercent: "35",
      weeklyBlankets: "24"
    }
  });
  assert.equal(seniorInput.operation, "senior_living");
  assert.equal(seniorInput.volume.licensedCapacity, 120);
  assert.equal(seniorInput.volume.occupancyPercent, 82);
  assert.equal(seniorInput.volume.careType, "mixed");
  assert.equal(seniorInput.volume.memoryCarePercent, 35);

  const treatmentInput = buildEstimateInput({
    ...hotel,
    operation: "residential_treatment",
    goods: ["sheets"],
    scale: {
      licensedCapacity: "48",
      occupancy: "90plus",
      careType: "detox_withdrawal",
      admissionsPerWeek: "11",
      averageStayDays: "9"
    }
  });
  assert.equal(treatmentInput.operation, "residential_treatment");
  assert.equal(treatmentInput.volume.licensedCapacity, 48);
  assert.equal(treatmentInput.volume.occupancyPercent, 94);
  assert.equal(treatmentInput.volume.careType, "detox_withdrawal");
  assert.equal(treatmentInput.volume.admissionsPerWeek, 11);
  assert.equal(treatmentInput.volume.averageStayDays, 9);

  const partialSeniorInput = buildEstimateInput({ ...hotel, operation: "senior_living", goods: ["sheets"], scale: { licensedCapacity: "72" } });
  assert.equal(partialSeniorInput.volume.licensedCapacity, 72);
  assert.equal(partialSeniorInput.volume.occupancyPercent, undefined);
  assert.equal(partialSeniorInput.volume.careType, undefined);

  const rentalInput = buildEstimateInput({ ...hotel, goods: ["sheets", "towels"], ownership: "supply", rentalCategory: "towels", rentalTier: "premium", rentalQuantity: "500" });
  assert.deepEqual(rentalInput.ownership, { model: "shelton_supplied", tier: "premium" });

  const wholesale = await calculatePlanningRange({ ...hotel, operation: "wholesale" }, pricingRules);
  assert.equal(wholesale.range, null);
  assert.equal(wholesale.manualReview, true);
  assert.match(wholesale.confidence.explanation, /no numeric range is invented/i);

  global.window.fetch = async () => { throw new Error("offline"); };
  const outage = await calculatePlanningRange(hotel, pricingRules);
  assert.equal(outage.range, null);
  assert.equal(outage.estimateToken, null);
  assert.match(outage.warning, /TEMPORARILY UNAVAILABLE/);

  console.log("Commercial Estimator V2.4 website adapter tests passed.");
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
