const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
global.window = {};
require(path.join(root, "assets/js/pricing-journey-config.js"));

const config = global.window.SheltonPricingJourneyConfig;
const operationIds = config.operations.map((item) => item.id);

assert.equal(config.version, 9);
assert.equal(config.operations.length, 13, "twelve commercial lanes plus Other / Not Sure exist");
assert.equal(new Set(operationIds).size, 13, "operation IDs are unique");
assert.deepEqual(operationIds.slice(0, 3), ["hotel", "senior_living", "residential_treatment"]);
assert.equal(operationIds.includes("wholesale"), true, "wholesale is available as a manual-review operation");
assert.equal(config.operations.find((item) => item.id === "spa").label, "Resort / Day Spa");
assert.equal(config.operations.find((item) => item.id === "medspa").label, "Medspa");

config.operations.forEach((operation) => {
  assert.ok(operation.goods.length >= 2 && operation.goods.length <= 6, `${operation.id} keeps the Goods branch to six choices or fewer`);
  operation.goods.forEach((id) => {
    const item = config.goods[id];
    assert.ok(item, `${operation.id} references known good ${id}`);
    assert.ok(item.label && item.education, `${id} has complete selection copy`);
    assert.equal(typeof item.short, "string", `${id} declares an optional category refiner`);
    assert.ok(Array.isArray(item.details) && item.details.length > 0 && item.details.length <= 3, `${id} has concise capabilities`);
  });

  const scaleSchema = config.scaleSchemas[operation.id];
  assert.ok(Array.isArray(scaleSchema) && scaleSchema.length >= 4, `${operation.id} has operation-specific scale inputs`);
  assert.ok(scaleSchema.every((field) => !/pickup|frequency|cadence/i.test(field.id)), `${operation.id} does not ask for a desired route frequency`);
  assert.ok(operation.guide && operation.guide.title, `${operation.id} has an educational guide title`);
  assert.ok(Array.isArray(operation.guide.drivers) && operation.guide.drivers.length >= 3, `${operation.id} has concise planning drivers`);
  assert.ok(operation.guide.note, `${operation.id} has a useful next-step note`);
});

const hotelGoods = config.operations.find((item) => item.id === "hotel").goods;
assert.equal(hotelGoods.includes("duvetCovers"), true, "hotel goods support the duvet-cover bed-system path");

const wholesaleGoods = config.operations.find((item) => item.id === "wholesale").goods;
assert.equal(wholesaleGoods.includes("sheets"), true, "wholesale supports flatwork linen");
assert.equal(wholesaleGoods.includes("shirts"), true, "wholesale supports garment finishing");
assert.equal(wholesaleGoods.length, 6, "wholesale uses six representative goods categories");

const otherGoods = config.operations.find((item) => item.id === "other").goods;
assert.equal(otherGoods.includes("sheets"), true, "Other / Not Sure includes core linen goods");
assert.equal(otherGoods.includes("specialtyGarments"), true, "Other / Not Sure includes specialty garments");
assert.equal(otherGoods.includes("towels"), false, "Other / Not Sure removes the redundant towel choice");
assert.equal(otherGoods.includes("robes"), false, "Other / Not Sure removes the redundant robe choice");
assert.equal(otherGoods.length, 6, "Other / Not Sure fits the six-card grid");

const senior = config.scaleSchemas.senior_living;
assert.equal(senior.find((field) => field.id === "licensedCapacity").required, true);
assert.equal(senior.find((field) => field.id === "occupancy").required, true);
assert.equal(senior.find((field) => field.id === "careType").required, true);
assert.equal(senior.find((field) => field.id === "memoryCarePercent").required, false);
assert.deepEqual(
  senior.find((field) => field.id === "careType").options.map((item) => item.value),
  ["independent_assisted", "memory_care", "mixed"]
);

const treatment = config.scaleSchemas.residential_treatment;
assert.equal(treatment.find((field) => field.id === "licensedCapacity").required, true);
assert.equal(treatment.find((field) => field.id === "occupancy").required, true);
assert.equal(treatment.find((field) => field.id === "careType").required, true);
assert.equal(treatment.find((field) => field.id === "admissionsPerWeek").required, false);
assert.equal(treatment.find((field) => field.id === "averageStayDays").required, false);
assert.deepEqual(
  treatment.find((field) => field.id === "careType").options.map((item) => item.value),
  ["residential_sud", "detox_withdrawal", "mental_health_residential", "eating_disorder_residential"]
);

assert.equal(config.scaleEntryModes.str.directField, "knownVolume", "STR can start from measured weekly pounds");
assert.equal(config.scaleEntryModes.events.directField, "totalWeeklyPieces", "piece-priced event work starts from a supported direct unit");
const strScale = config.scaleSchemas.str;
assert.equal(strScale.find((field) => field.id === "turnsPerProperty").label, "Average turns per property per week");
assert.equal(strScale.find((field) => field.id === "bedroomBasis").type, "select");
assert.ok(strScale.some((field) => field.id === "totalBedrooms"), "STR accepts total bedrooms across the program");
assert.equal(strScale.some((field) => field.id === "centralPoint"), false, "STR does not ask the customer to choose an unsupported pickup arrangement");
assert.equal(config.operations.find((item) => item.id === "str").centralLocationRequired, true, "STR states the central-location requirement directly");
assert.ok(config.scaleSchemas.gym.some((field) => field.id === "knownVolume"), "fitness programs can begin from measured pounds");

assert.deepEqual(
  config.ownershipChoices.map((item) => item.label),
  [
    "We already own the goods",
    "We own some and need some supplied",
    "We want Shelton to supply the goods",
    "We are not sure"
  ]
);
assert.equal(config.ownershipChoices.some((item) => item.selected), false, "ownership has no preselected model");

const production = fs.readFileSync(path.join(root, "pricing.html"), "utf8");
const spineCss = fs.readFileSync(path.join(root, "assets/css/pricing-spine-concept.css"), "utf8");
const pricingLearning = fs.readFileSync(path.join(root, "assets/js/pricing-learning.js"), "utf8");
const pricingEngine = fs.readFileSync(path.join(root, "assets/js/pricing-engine.js"), "utf8");
const pricingConfig = fs.readFileSync(path.join(root, "assets/js/pricing-journey-config.js"), "utf8");
const progressiveRange = fs.readFileSync(path.join(root, "assets/js/pricing-progressive-range.js"), "utf8");
const quotePage = fs.readFileSync(path.join(root, "quote.html"), "utf8");
const tailoredIndustries = fs.readFileSync(path.join(root, "industries-tailored-concept.html"), "utf8");
const legacyEstimator = fs.readFileSync(path.join(root, "estimate.html"), "utf8");
assert.doesNotMatch(production, /noindex|nofollow|noarchive/);
assert.match(production, /pricing-spine-workbench/);
assert.match(production, /pricing-calm\.css/);
assert.match(production, /pricing-spine-concept\.css/);
assert.match(production, /pricing-journey-config\.js/);
assert.match(production, /pricing-engine\.js/);
assert.match(production, /pricing-progressive-range\.js/);
assert.match(production, /pricing-learning\.js/);
assert.doesNotMatch(production, /pricing-journey-vectors\.js|pricing-rules\.dev\.js|answer any three/i);
assert.doesNotMatch(production, /Your first useful answer opens the range|every additional answer narrows it/i);
assert.match(production, /data-pound-range/);
assert.doesNotMatch(production, /data-monthly-range|data-confidence-label|data-model-label|data-range-assumptions|data-range-breakdown|data-completed-count|data-progress-dots/i);
assert.doesNotMatch(production, /approved Shelton defaults|confidence|likely model|details supplied|of 5 factors/i);
assert.doesNotMatch(production, /data-rhythm-recommendation-reason|data-factor-state="ownership"|data-factor-state="route"|result-disclaimer/i);
assert.match(production, /pricing-spine-concept\.css\?v=20260816-mobile-accessibility-v33/);
assert.match(production, /pricing-calm\.css\?v=20260816-mobile-accessibility-v18/);
assert.match(production, /pricing-learning\.js\?v=20260816-mobile-accessibility-v26/);
assert.match(production, /pricing-journey-config\.js\?v=20260803-estimator-v24/);
assert.match(production, /pricing-engine\.js\?v=20260815-estimator-timeout-v25/);
assert.match(production, /pricing-progressive-range\.js\?v=20260803-estimator-v24/);
assert.match(production, /aria-label="Five estimator steps"/);
assert.doesNotMatch(production, /<span>06<\/span>Result/);
assert.equal(config.goods.sheets.short, "Flat and fitted", "sheet cards clarify the included variants");
assert.equal(config.goods.towels.short, "Bath, hand, and wash", "towel cards clarify the included variants");
assert.equal(config.goods.bathMats.short, "", "self-explanatory goods do not receive filler subtitles");
assert.match(pricingLearning, /if \(good\.short\)[\s\S]*?copy\.classList\.add\("is-label-only"\)/, "goods cards render refiners only when they add information");
assert.match(pricingLearning, /if \(field\.id !== "entryMode"\)/, "the leading volume choice omits generic rationale while later questions retain it");
assert.match(spineCss, /#factor-route \.learning-chapter__lesson > \.chapter-editorial-copy[\s\S]*?margin-right:\s*auto;[\s\S]*?margin-left:\s*auto;[\s\S]*?text-align:\s*center;/, "route editorial copy shares the headline's center axis");
assert.equal((production.match(/class="chapter-editorial-title" id="factor-(?:program|volume|finish|ownership|route)-title"/g) || []).length, 5, "all five estimator chapters use the established editorial headline treatment");
assert.equal((production.match(/class="chapter-detail-list/g) || []).length, 0, "compact detail-row introductions no longer replace the editorial treatment");
assert.doesNotMatch(production, /program-editorial__lede|A considered program begins with the rhythm of the operation/i);
assert.match(production, /What you clean matters as much as how much you clean/i);
assert.match(production, /Weekly volume determines the scale of your laundry program/i);
assert.match(production, /Clean is only part of the service/i);
assert.match(production, /Who owns the goods changes how the program is structured/i);
assert.match(production, /Your location and service schedule shape the route/i);
assert.match(spineCss, /@media \(min-width: 761px\)[\s\S]*?\.pricing-spine-workbench \.estimate-dock\s*\{[\s\S]*?position:\s*fixed;[\s\S]*?left:\s*auto;[\s\S]*?width:\s*min\(360px/);
assert.match(spineCss, /@media \(max-width: 1199px\)[\s\S]*?\.pricing-spine-workbench \.estimate-dock\s*\{[\s\S]*?display:\s*none !important;/, "compact and mobile layouts rely on inline progress instead of an overlapping dock");
assert.match(pricingLearning, /dockBlockers\.size > 0/, "the dock is suppressed whenever the result or quote form is in view");
assert.match(pricingLearning, /Promise\.allSettled\(\[durableRequest, notificationRequest\]\)/, "durable intake and Formspree notification run in parallel");
assert.match(pricingLearning, /!durableAccepted && !fallbackAccepted/, "Formspree remains a submission fallback during estimator outages");
assert.match(pricingLearning, /let quoteInFlight = false/, "the pricing handoff rejects duplicate submissions while one is active");
assert.match(pricingLearning, /new AbortController\(\)/, "the pricing handoff can cancel stalled requests");
assert.match(pricingLearning, /quoteSubmissionController\?\.abort\(\)/, "the pricing handoff enforces a bounded timeout and aborts on page exit");
assert.match(pricingLearning, /The request took too long\. Your answers are still here; please try again\./, "timeout recovery keeps the completed pricing answers available");
assert.match(pricingEngine, /window\.setTimeout\(\(\) => controller\.abort\(\), 10000\)/, "the pricing estimator exits a stalled API request before the handoff timeout");
assert.match(pricingLearning, /field\.id === "duvetPercent"[\s\S]*?bedSystem === "mixed"/, "duvet-share sizing is shown only for mixed bed systems");
assert.match(pricingLearning, /const restoreInitialHash = \(\) =>/);
assert.match(pricingLearning, /target\.scrollIntoView\(\{ behavior: "instant", block: "start" \}\)/, "saved-state deep links are restored after the estimator renders");
assert.doesNotMatch(production, /Estimator 2\.3/i);
assert.doesNotMatch(pricingLearning, /Estimator 2\.3/i);
assert.doesNotMatch(pricingConfig, /Estimator 2\.3/i);
assert.doesNotMatch(progressiveRange, /Estimator 2\.3/i);
assert.doesNotMatch(progressiveRange, /midpoint|intentionally wider/i);
assert.match(quotePage, /href="pricing\.html#factor-program"/);
assert.match(tailoredIndustries, /href="pricing\.html#factor-program"/);
assert.match(legacyEstimator, /window\.location\.replace\("pricing\.html#factor-program"\)/);
assert.doesNotMatch(production, /data-volume-estimator-context/);
assert.match(production, /Choose the number you know best/i);
assert.match(pricingLearning, /question\.dataset\.scaleQuestion = field\.id/);
assert.match(pricingLearning, /next\.dataset\.scaleNext/);
assert.match(pricingLearning, /fieldset\.className = "volume-choice-field"/, "categorical sizing questions render as clickable cards");
assert.match(pricingLearning, /state\.scale\.entryMode === "direct"/, "direct volume answers use the short sizing path");
assert.doesNotMatch(production, /data-operation-close/);
assert.doesNotMatch(pricingLearning, /operationClose|data-operation-close/);
assert.doesNotMatch(production, /data-operation-backdrop/);
assert.doesNotMatch(pricingLearning, /operationBackdrop/);
assert.match(pricingLearning, /!event\.target\.closest\("\[data-operation-picker\]"\)/, "outside click remains the picker close behavior");
assert.match(pricingLearning, /const modalPicker = \(\) => false/, "the picker remains an inline disclosure rather than a dialog");
assert.doesNotMatch(production, /data-operation-search|Search operations/i, "the operation directory is direct choice only");
assert.doesNotMatch(pricingLearning, /operationSearch|filterOperations/, "operation filtering is no longer part of the picker");
assert.match(spineCss, /Keep the operation directory attached to its field[\s\S]*?\.pricing-spine-workbench \.operation-picker__panel\s*\{[\s\S]*?position:\s*relative[\s\S]*?width:\s*100%[\s\S]*?max-height:\s*390px[\s\S]*?transform:\s*none/, "the condensed desktop picker opens inline inside Section 01");
assert.match(spineCss, /@media \(min-width: 761px\)[\s\S]*?\.pricing-spine-workbench \.operation-picker__options button[\s\S]*?min-height:\s*54px/, "desktop and compact operation rows are condensed without removing choices");
assert.match(production, /data-inventory-category/);
assert.match(production, /data-inventory-tier/);
assert.match(production, /data-inventory-units/);
assert.match(production, /Preferred contact/);
assert.match(production, /Economy/);
assert.doesNotMatch(production, /Boutique/);
assert.doesNotMatch(production, /Typical return window|data-return-window/);
assert.doesNotMatch(production, /A hotel sheet, a kitchen apron, and an event tablecloth/i);
assert.match(production, /data-operation-guide-link/);
assert.match(production, /industries\.html#industry-directory/);
assert.doesNotMatch(production, /data-specialty-fieldset|data-specialty-options|Special handling needs/i);
assert.doesNotMatch(production, /data-operation-guide-context|data-operation-guide-drivers|data-operation-guide-note|data-operation-guide-selection|data-operation-guide-goods|data-operation-guide-care/);
assert.match(production, /data-finish-goods-list/);
assert.match(production, /assets\/icons\/bootstrap\/(?:bag|cart3)\.svg/);
assert.doesNotMatch(production, /data-finish-volume|data-finish-recommendation-copy|data-finish-recommendation-basis|This return direction matches/i);
assert.match(pricingLearning, /sheets:\s*"Pressed and folded"/);
assert.match(pricingLearning, /towels:\s*"Folded"/);
const finishMapSource = pricingLearning.match(/const finishByGood = \{([\s\S]*?)\n  \};/);
assert.ok(finishMapSource, "the customer-facing finish map exists");
const finishMapIds = new Set(Array.from(finishMapSource[1].matchAll(/^\s{4}([A-Za-z][A-Za-z0-9]*):/gm), (match) => match[1]));
assert.deepEqual(Object.keys(config.goods).filter((id) => !finishMapIds.has(id)), [], "every selectable good has an item-specific finish across all operation paths");
assert.match(pricingLearning, /weeklyPounds >= 500 \? "cart" : "bag"/, "return packaging changes only with estimated program volume");
assert.match(pricingLearning, /Central location required/);

console.log("Pricing spine configuration tests passed.");
