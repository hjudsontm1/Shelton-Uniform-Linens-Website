const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repositoryRoot = path.resolve(__dirname, "..");
const distClient = path.join(repositoryRoot, "dist", "client");
const homePath = path.join(distClient, "index.html");
const industriesPath = path.join(distClient, "industries.html");
const homeHtml = fs.readFileSync(homePath, "utf8");
const industriesHtml = fs.readFileSync(industriesPath, "utf8");

const componentCssReference =
  "assets/css/home-industry-explorer.css?v=20260825-production-v1";
const componentScriptReference =
  "assets/js/home-industry-explorer.js?v=20260825-production-v1";

const decodeHtmlAttribute = (value) => String(value || "")
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", "\"")
  .replaceAll("&#39;", "'");

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const attributeValue = (tag, name) => {
  const match = tag.match(new RegExp(`\\b${escapeRegExp(name)}="([^"]*)"`));
  return match ? decodeHtmlAttribute(match[1]) : null;
};

const tagsWithAttribute = (html, tagName, attribute) => (
  html.match(new RegExp(`<${tagName}\\b[^>]*\\b${escapeRegExp(attribute)}(?:="[^"]*")?[^>]*>`, "g")) || []
);

const componentSectionMatch = homeHtml.match(
  /<section\b[^>]*\bid="build-program"[^>]*>[\s\S]*?<\/section>/
);
assert.ok(componentSectionMatch, "production Home includes the promoted #build-program section");
const componentHtml = componentSectionMatch[0];
const componentSectionTag = componentHtml.match(/^<section\b[^>]*>/)[0];

const articleBlocks = componentHtml.match(
  /<article\b[^>]*\bdata-home-industry-panel(?:="[^"]*")?[^>]*>[\s\S]*?<\/article>/g
) || [];
const compactTabTags = tagsWithAttribute(
  componentHtml,
  "button",
  "data-home-industry-compact-trigger"
);
const desktopTriggerTags = tagsWithAttribute(
  componentHtml,
  "button",
  "data-home-industry-trigger"
);
const detailTags = tagsWithAttribute(
  componentHtml,
  "div",
  "data-home-industry-details"
);

const expectedDestinations = new Map([
  ["hotels", "hotels"],
  ["rentals", "short-term-rentals"],
  ["wellness", "gyms"],
  ["events", "events"],
  ["food-service", "restaurants"],
  ["workforce", "uniforms"]
]);

const expectedAnalyticsDestinations = new Map([
  ["home-explore-hotels", "industries-hotels"],
  ["home-explore-rentals", "industries-rentals"],
  ["home-explore-wellness", "industries-wellness"],
  ["home-explore-events", "industries-events"],
  ["home-explore-food-service", "industries-food-service"],
  ["home-explore-workforce", "industries-workforce"],
  ["home-service-model-cog", "pricing-ownership"],
  ["home-service-model-rental", "pricing-ownership"],
  ["home-service-model-hybrid", "quote-hybrid"]
]);

const regularProductionFile = (relativeReference) => {
  const relativePath = decodeHtmlAttribute(relativeReference).split(/[?#]/)[0];
  assert.ok(relativePath.startsWith("assets/"), `${relativePath} is a local production asset`);
  assert.ok(!path.isAbsolute(relativePath) && !relativePath.includes(".."), `${relativePath} stays inside dist/client`);

  const absolutePath = path.join(distClient, relativePath);
  const stat = fs.lstatSync(absolutePath);
  assert.equal(stat.isSymbolicLink(), false, `${relativePath} is not a symbolic link`);
  assert.equal(stat.isFile(), true, `${relativePath} is a regular file`);
  assert.ok(
    fs.realpathSync(absolutePath).startsWith(`${fs.realpathSync(distClient)}${path.sep}`),
    `${relativePath} resolves inside dist/client`
  );
  return absolutePath;
};

test("Home promotes exactly one explorer and removes the legacy program builder", () => {
  assert.equal((homeHtml.match(/\bid="build-program"/g) || []).length, 1);
  assert.match(attributeValue(componentSectionTag, "class") || "", /(?:^|\s)home-industry-explorer(?:\s|$)/);
  assert.equal(attributeValue(componentSectionTag, "data-analytics-module"), "home-industry-explorer");
  assert.doesNotMatch(homeHtml, /build-program-legacy|data-program-key|program-detail-panel/);
  assert.doesNotMatch(homeHtml, /<section\b[^>]*class="[^"]*\bprogram-builder\b/);
});

test("the explorer exposes the approved analytics module and stable link identifiers", () => {
  const linkedAnalyticsIds = new Map(
    (componentHtml.match(/<a\b[^>]*>/g) || [])
      .filter((tag) => attributeValue(tag, "data-analytics-id"))
      .map((tag) => [
        attributeValue(tag, "data-analytics-id"),
        attributeValue(tag, "data-analytics-destination")
      ])
  );

  assert.deepEqual(linkedAnalyticsIds, expectedAnalyticsDestinations);
  assert.match(homeHtml, /assets\/js\/analytics\.js\?v=20260825-first-party-v1/);
});

test("six panels and six compact tabs expose unique reciprocal ARIA relationships", () => {
  assert.equal(articleBlocks.length, 6, "there are six industry panels");
  assert.equal(desktopTriggerTags.length, 6, "there are six desktop panel controls");
  assert.equal(compactTabTags.length, 6, "there are six compact tabs");
  assert.equal(detailTags.length, 6, "there are six labelled detail regions");

  const allDocumentIds = Array.from(homeHtml.matchAll(/\bid="([^"]+)"/g), (match) => match[1]);
  assert.equal(new Set(allDocumentIds).size, allDocumentIds.length, "Home has no duplicate IDs");
  const documentIds = new Set(allDocumentIds);

  const detailsById = new Map(detailTags.map((tag) => [attributeValue(tag, "id"), tag]));
  const desktopByControl = new Map(desktopTriggerTags.map((tag) => [attributeValue(tag, "aria-controls"), tag]));
  const compactByControl = new Map(compactTabTags.map((tag) => [attributeValue(tag, "aria-controls"), tag]));

  assert.equal(detailsById.size, 6, "detail IDs are unique");
  assert.equal(desktopByControl.size, 6, "desktop controls target six unique details");
  assert.equal(compactByControl.size, 6, "compact controls target six unique details");

  detailsById.forEach((detailTag, detailId) => {
    assert.ok(detailId && documentIds.has(detailId), `${detailId} exists in the document`);
    const desktopTrigger = desktopByControl.get(detailId);
    const compactTab = compactByControl.get(detailId);
    assert.ok(desktopTrigger, `${detailId} has a desktop control`);
    assert.ok(compactTab, `${detailId} has a compact tab`);
    assert.equal(attributeValue(detailTag, "aria-labelledby"), attributeValue(desktopTrigger, "id"));
    assert.ok(documentIds.has(attributeValue(desktopTrigger, "id")), `${detailId} desktop label exists`);
    assert.ok(documentIds.has(attributeValue(compactTab, "id")), `${detailId} compact label exists`);
  });

  assert.equal(desktopTriggerTags.filter((tag) => attributeValue(tag, "aria-expanded") === "true").length, 1);
  assert.equal(compactTabTags.filter((tag) => attributeValue(tag, "aria-selected") === "true").length, 1);
  assert.equal(compactTabTags.filter((tag) => attributeValue(tag, "tabindex") === "0").length, 1);
});

test("the production component stylesheet and script are linked, regular, and syntactically valid", () => {
  assert.match(
    homeHtml,
    new RegExp(`<link\\b[^>]*href="${escapeRegExp(componentCssReference)}"[^>]*>`)
  );
  assert.match(
    homeHtml,
    new RegExp(`<script\\b[^>]*src="${escapeRegExp(componentScriptReference)}"[^>]*><\\/script>`)
  );

  regularProductionFile(componentCssReference);
  const scriptPath = regularProductionFile(componentScriptReference);
  const syntaxCheck = spawnSync(process.execPath, ["--check", scriptPath], { encoding: "utf8" });
  assert.equal(syntaxCheck.status, 0, syntaxCheck.stderr || syntaxCheck.stdout || "component JavaScript parses");
});

test("all explorer imagery is lazy, optimized, and stored as regular production assets", () => {
  const imageTags = componentHtml.match(/<img\b[^>]*>/g) || [];
  assert.equal(imageTags.length, 12, "six stage images and six compact-tab images are present");
  imageTags.forEach((tag) => {
    assert.equal(attributeValue(tag, "loading"), "lazy", `${attributeValue(tag, "src")} loads lazily`);
  });

  const uniqueImageReferences = [...new Set(
    imageTags.map((tag) => attributeValue(tag, "src"))
  )];
  assert.equal(uniqueImageReferences.length, 6, "each industry reuses one stage/dock asset");
  assert.ok(
    uniqueImageReferences.every((source) => source.endsWith(".webp")),
    "all six explorer images use WebP"
  );
  const totalImageBytes = uniqueImageReferences.reduce((total, source) => (
    total + fs.statSync(regularProductionFile(source)).size
  ), 0);
  assert.ok(totalImageBytes < 800_000, `explorer image payload is ${totalImageBytes} bytes`);

  const foodImageReferences = imageTags
    .map((tag) => attributeValue(tag, "src"))
    .filter((source) => /industry-food-service/.test(source || ""));
  assert.equal(foodImageReferences.length, 2, "Food Service uses one image in the stage and compact tab");
  assert.equal(new Set(foodImageReferences).size, 1, "both Food Service surfaces share one asset URL");
  regularProductionFile(foodImageReferences[0]);
});

test("all six Explore links resolve to existing production Who We Serve fragments", () => {
  assert.equal(new Set(articleBlocks.map((block) => attributeValue(block.match(/^<article\b[^>]*>/)[0], "data-family"))).size, 6);

  expectedDestinations.forEach((fragment, family) => {
    const article = articleBlocks.find((block) => (
      attributeValue(block.match(/^<article\b[^>]*>/)[0], "data-family") === family
    ));
    assert.ok(article, `${family} panel exists`);
    assert.match(article, new RegExp(`href="industries\\.html#${escapeRegExp(fragment)}"`));
    assert.equal(
      (industriesHtml.match(new RegExp(`\\bid="${escapeRegExp(fragment)}"`, "g")) || []).length,
      1,
      `industries.html contains exactly one #${fragment} destination`
    );
  });
});

test("Customer-Owned Goods, Rental, and hybrid links use the approved production routes", () => {
  const linkBlocks = componentHtml.match(/<a\b[^>]*>[\s\S]*?<\/a>/g) || [];
  const linkByText = (pattern) => linkBlocks.find((link) => pattern.test(link.replace(/<[^>]+>/g, " ")));

  const customerOwned = linkByText(/Customer-Owned Goods/);
  const rental = linkByText(/Rental Program/);
  const hybrid = linkByText(/Need both\?/);
  assert.ok(customerOwned, "Customer-Owned Goods link exists");
  assert.ok(rental, "Rental Program link exists");
  assert.ok(hybrid, "hybrid link exists");
  assert.equal(attributeValue(customerOwned.match(/^<a\b[^>]*>/)[0], "href"), "pricing.html#factor-ownership");
  assert.equal(attributeValue(rental.match(/^<a\b[^>]*>/)[0], "href"), "pricing.html#factor-ownership");
  assert.equal(
    attributeValue(hybrid.match(/^<a\b[^>]*>/)[0], "href"),
    "quote.html?industry=other&service=not-sure"
  );

  assert.equal((fs.readFileSync(path.join(distClient, "pricing.html"), "utf8").match(/\bid="factor-ownership"/g) || []).length, 1);
  assert.ok(fs.existsSync(path.join(distClient, "quote.html")), "quote.html exists");
});
