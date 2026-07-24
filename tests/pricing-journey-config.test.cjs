const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
global.window = {};
require(path.join(root, "assets/js/pricing-journey-config.js"));
require(path.join(root, "assets/js/pricing-journey-vectors.js"));

const config = global.window.SheltonPricingJourneyConfig;
const vectors = global.window.SheltonPricingJourneyVectors;

assert.equal(config.operations.length, 11, "all eleven operation branches exist");
assert.equal(new Set(config.operations.map((item) => item.id)).size, 11, "operation IDs are unique");
assert.equal(config.operations.find((item) => item.id === "wholesale").label, "Wholesale Dry Cleaning");
assert.equal(config.operations.find((item) => item.id === "spa").label, "Resort / Day Spa");
assert.equal(config.operations.find((item) => item.id === "medspa").label, "Medspa");

config.operations.forEach((operation) => {
  assert.ok(operation.goods.length >= 2 && operation.goods.length <= 6, `${operation.id} has a usable Goods branch`);
  operation.goods.forEach((id) => {
    const item = config.goods[id];
    assert.ok(item, `${operation.id} references known good ${id}`);
    assert.ok(item.label && item.short && item.education, `${id} has complete selection copy`);
    assert.ok(Array.isArray(item.details) && item.details.length > 0 && item.details.length <= 3, `${id} has concise capabilities`);
  });

  const container = { innerHTML: "" };
  vectors.renderScene(container, {
    operation,
    goodsIds: operation.goods,
    selectedIds: [],
    selectedOnly: false,
    catalog: config.goods
  });
  assert.equal((container.innerHTML.match(/data-vector-good=/g) || []).length, operation.goods.length, `${operation.id} renders every branch good`);

  const scaleSchema = config.scaleSchemas[operation.id];
  assert.ok(Array.isArray(scaleSchema) && scaleSchema.length >= 4, `${operation.id} has operation-specific scale inputs`);
  assert.ok(scaleSchema.every((field) => !/pickup|frequency|cadence/i.test(field.id)), `${operation.id} does not ask for a desired route frequency`);
});

const expectedBackdropCopy = {
  hotel: "LINEN CART RETURN",
  str: "CENTRAL TURNOVER STAGING",
  spa: "TREATMENT-ROOM FLOW",
  medspa: "TREATMENT-ROOM FLOW",
  gym: "PEAK-USE TOWEL RACK",
  events: "PRESENTATION · COLOR · DEADLINE",
  restaurant: "KITCHEN + DINING ROOM",
  casino: "MULTIPLE SHIFTS",
  uniforms: "ORGANIZED GARMENT RAIL",
  wholesale: "BATCH CAPACITY · PRESSING · TURNAROUND",
  other: "BUILT AROUND THE GOODS"
};

config.operations.forEach((operation) => {
  const container = { innerHTML: "" };
  vectors.renderScene(container, {
    operation,
    goodsIds: operation.goods,
    selectedIds: [],
    selectedOnly: false,
    catalog: config.goods
  });
  assert.ok(container.innerHTML.includes(expectedBackdropCopy[operation.id]), `${operation.id} renders its intended operation backdrop`);
});

const hotel = config.operations.find((item) => item.id === "hotel");
const narrowed = { innerHTML: "" };
vectors.renderScene(narrowed, {
  operation: hotel,
  goodsIds: hotel.goods,
  selectedIds: ["robes"],
  selectedOnly: true,
  catalog: config.goods
});
assert.equal((narrowed.innerHTML.match(/data-vector-good=/g) || []).length, 1, "single selection narrows the assembled scene");
assert.match(narrowed.innerHTML, /data-vector-good="robes"/);
assert.match(narrowed.innerHTML, /translate\(351 68\) scale\(1\.65\)/, "single-item scenes use the resolved focal composition");
assert.doesNotMatch(narrowed.innerHTML, /data-vector-good="sheets"|data-vector-good="towels"/);

const returned = { innerHTML: "" };
vectors.renderScene(returned, {
  operation: hotel,
  goodsIds: ["sheets"],
  selectedIds: ["sheets"],
  selectedOnly: true,
  returnOptions: ["pressed", "linenCart", "labeled"],
  catalog: config.goods
});
assert.match(returned.innerHTML, /return-overlay/);
assert.match(returned.innerHTML, /PRESSED FINISH/);
assert.match(returned.innerHTML, /LINEN-CART RETURN/);

assert.deepEqual(
  config.ownershipChoices.map((item) => item.label),
  [
    "We already own the goods",
    "We own some and need some supplied",
    "We want Shelton to supply the goods",
    "We are not sure"
  ],
  "ownership uses the approved plain-language choices"
);
assert.equal(config.ownershipChoices.some((item) => item.selected), false, "ownership has no preselected model");

const robeFinishIds = config.finishOptions
  .filter((item) => item.goods.includes("robes"))
  .map((item) => item.id);
assert.ok(robeFinishIds.includes("hanging") && robeFinishIds.includes("poly"), "robes retain garment-relevant returns");
assert.ok(!robeFinishIds.includes("linenCart"), "robes do not retain an irrelevant linen-cart return");

const preview = fs.readFileSync(path.join(root, "pricing-journey-preview.html"), "utf8");
assert.match(preview, /noindex, nofollow, noarchive/);
assert.match(preview, /pricing-journey-vectors\.js/);
assert.doesNotMatch(preview, /Once weekly|Twice weekly|Five times weekly|desired pickup frequency/i);
assert.match(preview, /ZIP code or city/);
assert.match(preview, /No option is preselected/);
assert.match(preview, /Economy/);
assert.match(preview, /Boutique/);

console.log("Pricing journey configuration and vector tests passed.");
