const publicEstimate = (lane, rental = []) => ({
  estimateToken: `checkpoint-${lane}-token`,
  estimate: {
    modelVersion: "commercial-estimator.v2",
    lane,
    ready: true,
    requiresReview: false,
    reviewMessages: [],
    confidence: { score: 82, label: "Planning", evidence: "estimated" },
    sizing: { driver: "Commercial Estimator V2", weeklyPounds: lane === "event" ? 950 : 4200 },
    pricing: {
      weeklyRange: { low: 3500, base: 3850, high: 4200 },
      monthlyRange: { low: 15165, base: 16683, high: 18199 },
      lines: [{
        key: lane === "event" ? "tablecloth" : "commercial_laundry",
        label: lane === "event" ? "Tablecloth" : "Customer-owned linen",
        billingUnit: lane === "event" ? "piece" : "pound",
        weeklyUnits: lane === "event" ? 250 : 4200,
        low: lane === "event" ? 6.5 : 0.82,
        target: lane === "event" ? 7.25 : 0.88,
        high: lane === "event" ? 7.75 : 0.96
      }]
    },
    route: {
      label: "Twice-weekly commercial pickup and return",
      recommendedPickupsPerWeek: 2,
      separateDeliveryFee: false,
      remoteReview: false
    },
    rental
  }
});

async function installCommercialEstimatorV2Fixture(page) {
  await page.route("**/api/public/commercial-estimate", async (route) => {
    const body = JSON.parse(route.request().postData() || "{}");
    const selections = body.estimate?.rentalSelections || [];
    const rental = selections.map((selection) => ({
      category: selection.category,
      tier: selection.tier,
      quantity: selection.quantity,
      weeklyRatePerItem: 0.42,
      weeklyCharge: Math.round(selection.quantity * 0.42 * 100) / 100,
      requiresManagementReview: false
    }));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(publicEstimate(body.estimate?.lane || "hotel", rental))
    });
  });
}

const isEstimatorCalculationRequest = (request) => request.method() === "POST"
  && new URL(request.url()).pathname === "/api/public/commercial-estimate";

module.exports = { installCommercialEstimatorV2Fixture, isEstimatorCalculationRequest };
