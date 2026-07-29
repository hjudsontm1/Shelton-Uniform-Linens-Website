(function () {
  "use strict";

  const goods = {
    sheets: {
      label: "Sheets",
      short: "Pressed layers",
      education: "Commercial sheets can be cleaned, pressed, folded, and returned around the way your operation uses them."
    },
    towels: {
      label: "Towels",
      short: "High-volume soft goods",
      education: "Commercial towels are processed for soil, odor, repeated use, and consistent return."
    },
    handTowels: {
      label: "Hand towels",
      short: "Daily-use towel stock",
      education: "Hand towels need repeatable processing and compact return states that keep busy service areas stocked."
    },
    bathMats: {
      label: "Bath mats",
      short: "Guest-room floor goods",
      education: "Bath mats benefit from soil-focused processing and consistent bundling for housekeeping use."
    },
    robes: {
      label: "Robes",
      short: "Guest-facing garments",
      education: "Robes are handled for cleanliness, feel, presentation, and recurring guest use."
    },
    blankets: {
      label: "Blankets",
      short: "Layered guest goods",
      education: "Blankets require processing that balances cleanliness, material care, and practical folded return."
    },
    duvetCovers: {
      label: "Duvet covers",
      short: "Turnover-ready layers",
      education: "Duvet covers can be processed and folded for clear, repeatable turnover staging."
    },
    faceCradleCovers: {
      label: "Face cradle covers",
      short: "Treatment-room pieces",
      education: "Treatment-room covers need consistent cleaning and compact sorting between appointments."
    },
    tablecloths: {
      label: "Tablecloths",
      short: "Presentation linens",
      education: "Tablecloths require cleaning that considers stains, presentation, fabric, and color."
    },
    napkins: {
      label: "Napkins",
      short: "Dining and event pieces",
      education: "Napkins need soil-focused cleaning and consistent finishing for repeated presentation use."
    },
    runners: {
      label: "Runners",
      short: "Specialty table layers",
      education: "Runners benefit from fabric-aware cleaning and finishing that preserves their presentation."
    },
    skirting: {
      label: "Skirting",
      short: "Large-format event goods",
      education: "Event skirting needs careful stain treatment, controlled finishing, and organized return."
    },
    chairCovers: {
      label: "Chair covers",
      short: "Fitted event goods",
      education: "Chair covers need consistent cleaning and sorting so event teams can stage them efficiently."
    },
    specialtyEventGoods: {
      label: "Specialty event goods",
      short: "Color and fabric specific",
      education: "Specialty event goods are evaluated for fabric, color, staining, presentation, and deadline."
    },
    chefCoats: {
      label: "Chef coats",
      short: "Heavy-use whites",
      education: "Heavy-use chef coats are cleaned for soil, white retention, and repeated commercial use."
    },
    aprons: {
      label: "Aprons",
      short: "Kitchen workwear",
      education: "Aprons are processed for food soil, grease, repeat wear, and practical organized return."
    },
    barTowels: {
      label: "Bar towels",
      short: "High-soil utility goods",
      education: "Bar towels need repeatable heavy-soil processing and efficient bundled return."
    },
    tableLinens: {
      label: "Table linens",
      short: "Dining-room presentation",
      education: "Table linens need stain treatment and finishing that keeps presentation consistent over time."
    },
    casinoUniforms: {
      label: "Casino uniforms",
      short: "Departmental workwear",
      education: "Casino uniforms need professional cleaning, presentation-focused finishing, and organized return by department."
    },
    banquetLinens: {
      label: "Banquet linens",
      short: "Event-volume linens",
      education: "Banquet linens combine recurring volume with event-grade stain treatment and presentation."
    },
    uniformShirts: {
      label: "Uniform shirts",
      short: "Recurring workwear",
      education: "Uniform shirts are cleaned and finished for repeated wear, staff presentation, and organized return."
    },
    workwear: {
      label: "Workwear",
      short: "Daily staff garments",
      education: "Workwear programs balance repeated soil, garment life, professional finishing, and account organization."
    },
    jackets: {
      label: "Jackets",
      short: "Outer uniform layers",
      education: "Jackets require garment-aware cleaning and return choices suited to presentation and storage."
    },
    shirts: {
      label: "Shirts",
      short: "Wholesale finishing volume",
      education: "Wholesale shirts can move through cleaning and pressing capacity built around batch volume and turnaround."
    },
    suits: {
      label: "Suits",
      short: "Structured garments",
      education: "Structured garments require controlled cleaning, pressing, and careful organized return."
    },
    dresses: {
      label: "Dresses",
      short: "Varied garment care",
      education: "Dresses require fabric-aware handling and finishing that adapts to construction and presentation."
    },
    specialtyGarments: {
      label: "Specialty garments",
      short: "Nonstandard commercial pieces",
      education: "Specialty garments are evaluated around fabric, construction, use, finish, and return requirements."
    },
    choirRobes: {
      label: "Choir robes",
      short: "Ceremonial garments",
      education: "Choir robes need careful cleaning, presentation-focused finishing, and organized seasonal return."
    }
  };

  const capabilityGroups = [
    {
      ids: ["sheets", "duvetCovers", "blankets"],
      details: ["Appearance and feel", "Pressed or folded finishing", "Linen-cart or bundled return"]
    },
    {
      ids: ["towels", "handTowels", "bathMats", "barTowels"],
      details: ["Soil and odor treatment", "High-volume processing", "Folded, bundled, or bagged return"]
    },
    {
      ids: ["robes"],
      details: ["Cleanliness and feel", "Guest-facing presentation", "Folded or hanging return"]
    },
    {
      ids: ["faceCradleCovers"],
      details: ["Treatment-room soil handling", "Compact sorting", "Ready-to-stage return"]
    },
    {
      ids: ["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods", "tableLinens", "banquetLinens"],
      details: ["Color and fabric awareness", "Stain and specialty treatment", "Pressed, folded, or hanging return"]
    },
    {
      ids: ["chefCoats"],
      details: ["Stain and heavy-soil treatment", "Pressing and professional finishing", "Hanger-and-poly return where selected"]
    },
    {
      ids: ["aprons"],
      details: ["Food and grease treatment", "Repeat-use processing", "Folded or hanging return"]
    },
    {
      ids: ["casinoUniforms", "uniformShirts", "workwear", "jackets"],
      details: ["Repeated-wear cleaning", "Professional finishing", "Organized account return"]
    },
    {
      ids: ["shirts", "suits", "dresses", "specialtyGarments", "choirRobes"],
      details: ["Garment-aware cleaning", "Pressing and presentation", "Batch or account-level return"]
    }
  ];

  capabilityGroups.forEach((group) => {
    group.ids.forEach((id) => {
      if (goods[id]) goods[id].details = group.details;
    });
  });

  const select = (id, label, hint, options, required = true) => ({ id, label, hint, type: "select", options, required });
  const number = (id, label, unit, hint, min, max, required = true, goodsIds) => ({ id, label, unit, hint, type: "number", min, max, step: 1, required, goods: goodsIds });
  const option = (value, label) => ({ value, label });

  const storageOptions = [
    option("ample", "Ample on-site storage"),
    option("limited", "Limited storage"),
    option("tight", "Very tight storage")
  ];
  const seasonalityOptions = [
    option("steady", "Mostly steady"),
    option("seasonal", "Clear seasonal swings"),
    option("eventDriven", "Event or calendar driven")
  ];
  const volumeUnitOptions = [option("pounds", "Pounds"), option("pieces", "Pieces"), option("unknown", "Not sure")];

  const scaleSchemas = {
    hotel: [
      number("rooms", "Guest rooms", "rooms", "The number of rooms establishes the potential linen pool.", 1, 5000),
      select("occupancy", "Approximate occupancy", "Occupancy helps translate rooms into real weekly movement.", [option("under50", "Under 50%"), option("50to74", "50-74%"), option("75to89", "75-89%"), option("90plus", "90% or more")]),
      select("bedSystem", "Bed-linen system", "Choose the closest room setup so sheet and duvet-cover paths remain separate.", [option("duvet", "Duvet cover"), option("triple_sheet", "Triple sheet"), option("mixed", "A mix of both")]),
      number("duvetPercent", "Duvet share when mixed", "%", "Use 50% when the mix is roughly even.", 0, 100, false),
      select("storage", "Clean-goods storage", "Storage pressure can affect the practical route rhythm.", storageOptions),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if your team already tracks pounds.", 1, 250000, false),
      number("weeklyRobes", "Robes per week", "pieces", "Shown separately from pound-priced room linen.", 0, 250000, false, ["robes"]),
      number("weeklyBlankets", "Blankets per week", "pieces", "Standard hotel blankets are priced per piece.", 0, 250000, false, ["blankets"])
    ],
    str: [
      number("properties", "Properties in the program", "properties", "This should reflect the bulk program, not individual household pickup.", 1, 10000),
      number("weeklyTurns", "Average turns per week", "turns", "Use the total turns routed through the central staging point.", 1, 50000),
      number("averageBedrooms", "Average bedrooms per property", "bedrooms", "Bedrooms and weekly turns establish the starting linen weight.", 1, 30),
      select("centralPoint", "Central pickup arrangement", "Shelton planning assumes account-level bulk pickup and return.", [option("established", "Central location established"), option("staging", "Laundry staging point planned"), option("planning", "Still determining the central point")]),
      select("seasonality", "Seasonal movement", "Seasonal changes help avoid planning only around an average month.", seasonalityOptions),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if pounds are already tracked.", 1, 250000, false),
      number("weeklyBlankets", "Blankets per week", "pieces", "Blankets remain a separate per-piece line.", 0, 250000, false, ["blankets"])
    ],
    spa: [
      number("appointments", "Appointments per week", "appointments", "Appointment volume helps estimate treatment-room turnover.", 1, 50000),
      select("goodsUse", "Soft-goods use per appointment", "Choose the closest approved preset.", [option("light", "Light · two towels"), option("standard", "Standard · three towels and one sheet"), option("heavy", "Heavy · four towels, one sheet, and one robe")]),
      select("storage", "Clean-goods storage", "Compact storage can increase return pressure.", storageOptions),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if pounds are already tracked.", 1, 100000, false)
    ],
    medspa: [
      number("appointments", "Appointments per week", "appointments", "The starting model uses two twin sheets per appointment.", 1, 50000),
      number("handTowelsPerAppointment", "Hand towels per appointment", "towels", "Leave at zero unless hand towels are part of the service.", 0, 20),
      select("storage", "Clean-goods storage", "Compact storage can increase return pressure.", storageOptions),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if pounds are already tracked.", 1, 100000, false)
    ],
    gym: [
      number("weeklyTowelUses", "Weekly towel uses", "uses", "Estimate member and class towel movement together.", 1, 500000),
      select("peakPattern", "Peak-use pattern", "Peak concentration matters more than simply asking for maximum service.", [option("concentrated", "A few concentrated peaks"), option("balanced", "Balanced across the week"), option("variable", "Highly variable")]),
      number("activeDays", "Active days per week", "days", "This is an operating signal, not a pickup-frequency request.", 1, 7),
      select("storage", "Clean-towel storage", "Storage capacity shapes how much clean inventory can sit between returns.", storageOptions)
    ],
    events: [
      number("weeklyTablecloths", "Tablecloths per week", "pieces", "Use the average weekly number sent for cleaning.", 0, 500000, false, ["tablecloths"]),
      number("weeklyNapkins", "Napkins per week", "pieces", "Napkins keep their own Compact production path.", 0, 2000000, false, ["napkins"]),
      number("totalWeeklyPieces", "Total pieces per week", "pieces", "Use only when tablecloth and napkin counts are unknown; Shelton applies a 1:8 estimate.", 1, 2500000, false),
      select("returnWindow", "Typical return window", "Deadlines influence production planning without asking for a route preference.", [option("urgent", "24-48 hours"), option("standard", "3-4 days"), option("flexible", "Five days or flexible")]),
      select("seasonality", "Volume pattern", "Event volume often moves with season and venue calendar.", seasonalityOptions)
    ],
    restaurant: [
      number("weeklyCovers", "Approximate weekly covers", "covers", "Dining volume helps scale napkin and table-linen movement.", 1, 1000000),
      number("knownVolume", "Known weekly linen volume", "lb / week", "Optional override when dining-linen pounds are tracked.", 1, 250000, false),
      number("weeklyChefCoats", "Chef coats per week", "pieces", "Count actual weekly garment movement.", 0, 250000, false, ["chefCoats"]),
      number("weeklyAprons", "Aprons per week", "pieces", "Aprons are folded rather than hung.", 0, 250000, false, ["aprons"])
    ],
    casino: [
      number("hotelRooms", "Hotel rooms", "rooms", "Use zero when hotel linen is outside this program.", 0, 5000),
      number("weeklyCovers", "Restaurant covers per week", "covers", "Use zero when restaurant linen is outside this program.", 0, 1000000),
      number("weeklyTablecloths", "Banquet tablecloths per week", "pieces", "Banquet linens retain event pricing and production paths.", 0, 500000),
      number("weeklyNapkins", "Banquet napkins per week", "pieces", "Napkins remain separate from tablecloth finishing.", 0, 2000000),
      number("weeklyChefCoats", "Chef coats per week", "pieces", "Count only garments included in this program.", 0, 250000, false, ["chefCoats"]),
      number("weeklyUniformTops", "Uniform tops per week", "pieces", "Count only garments included in this program.", 0, 250000, false, ["casinoUniforms"])
    ],
    uniforms: [
      number("weeklyUniformTops", "Uniform shirts per week", "pieces", "Count actual weekly pieces entering service.", 0, 500000, false, ["uniformShirts", "casinoUniforms"]),
      number("weeklyChefCoats", "Chef coats per week", "pieces", "Count actual weekly pieces entering service.", 0, 500000, false, ["chefCoats"]),
      number("weeklyPants", "Pants or workwear per week", "pieces", "Count actual weekly pieces entering service.", 0, 500000, false, ["workwear"]),
      number("weeklyJackets", "Jackets or coveralls per week", "pieces", "These remain planning estimates and require management review.", 0, 500000, false, ["jackets"])
    ],
    wholesale: [
      number("weeklyVolume", "Weekly wholesale volume", "volume", "Enter the normal combined batch volume.", 1, 1000000),
      select("volumeUnit", "Volume unit", "Use the unit your plant already tracks.", volumeUnitOptions),
      number("batchDays", "Production days per week", "days", "This is a capacity signal, not a route preference.", 1, 7),
      select("turnaround", "Typical turnaround requirement", "Turnaround helps weight cleaning and finishing capacity.", [option("urgent", "Under 48 hours"), option("standard", "3-4 days"), option("flexible", "Five days or flexible")]),
      select("capacityNeed", "Primary capacity need", "Choose the closest role Shelton would play.", [option("full", "Cleaning and finishing"), option("pressing", "Pressing or finishing"), option("overflow", "Overflow and peak support")])
    ],
    other: [
      number("weeklyVolume", "Approximate weekly volume", "volume", "A rough amount is enough for the private planning model.", 1, 1000000),
      select("volumeUnit", "Volume unit", "Choose pounds, pieces, or not sure.", volumeUnitOptions),
      number("activeDays", "Operating days per week", "days", "Operating days help describe demand without choosing pickup frequency.", 1, 7),
      select("variability", "Volume pattern", "Variability helps Shelton understand peak pressure.", seasonalityOptions),
      select("storage", "Clean-goods storage", "Storage can affect the recommended return rhythm.", storageOptions)
    ]
  };

  const foldedGoods = ["sheets", "towels", "handTowels", "bathMats", "blankets", "duvetCovers", "faceCradleCovers", "tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods", "barTowels", "tableLinens", "banquetLinens"];
  const garmentGoods = ["robes", "chefCoats", "aprons", "casinoUniforms", "uniformShirts", "workwear", "jackets", "shirts", "suits", "dresses", "specialtyGarments", "choirRobes"];

  const finishOptions = [
    { id: "folded", label: "Folded", description: "Finished into stable, ready-to-stage folds.", goods: foldedGoods },
    { id: "pressed", label: "Pressed", description: "Pressed for presentation where the item supports it.", goods: [...foldedGoods, ...garmentGoods] },
    { id: "hanging", label: "Hanging", description: "Returned on hangers for garment or presentation goods.", goods: garmentGoods },
    { id: "poly", label: "Poly protection", description: "Protective poly for selected hanging garments.", goods: garmentGoods },
    { id: "bundled", label: "Bundled", description: "Grouped for practical account-level staging.", goods: foldedGoods },
    { id: "bagged", label: "Bagged", description: "Packed for compact towel or utility-goods return.", goods: ["towels", "handTowels", "bathMats", "barTowels"] },
    { id: "linenCart", label: "Linen-cart return", description: "Stacked into linen carts where the account uses them.", goods: ["sheets", "towels", "bathMats", "blankets", "duvetCovers", "tablecloths", "napkins", "tableLinens", "banquetLinens"] },
    { id: "labeled", label: "Labeled return", description: "Labeled by property, department, item, or account preference.", goods: [...foldedGoods, ...garmentGoods] }
  ];

  const specialtyOptions = [
    { id: "heavySoil", label: "Heavy soil or grease", description: "For kitchen, utility, or repeated high-soil use.", goods: ["chefCoats", "aprons", "barTowels", "workwear"] },
    { id: "whiteRetention", label: "White retention", description: "For white goods where brightness over time matters.", goods: ["sheets", "towels", "chefCoats", "tablecloths", "napkins", "tableLinens"] },
    { id: "colorRetention", label: "Color retention", description: "For colored event, dining, or specialty goods.", goods: ["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods", "tableLinens", "casinoUniforms"] },
    { id: "moldTreatment", label: "Specialty mold treatment", description: "For eligible event goods needing additional evaluation.", goods: ["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods"], operations: ["events"] },
    { id: "odor", label: "Odor treatment", description: "For towels, fitness goods, and recurring heavy use.", goods: ["towels", "handTowels", "bathMats", "barTowels"] },
    { id: "delicate", label: "Delicate or specialty handling", description: "For fabric, construction, or presentation that needs review.", goods: ["robes", "dresses", "specialtyGarments", "choirRobes", "specialtyEventGoods"] },
    { id: "deadline", label: "Production deadline", description: "For event return windows that shape capacity.", goods: [...foldedGoods, ...garmentGoods], operations: ["events"] },
    { id: "propertySort", label: "Property-level sorting", description: "For central STR staging organized by property or account.", goods: foldedGoods, operations: ["str"] },
    { id: "departmentSort", label: "Department-level sorting", description: "For uniforms organized around staff groups or departments.", goods: garmentGoods, operations: ["casino", "uniforms"] }
  ];

  const ownershipChoices = [
    { id: "own", label: "We already own the goods", model: "Customer-Owned Goods", description: "Shelton cleans, finishes, packages, and returns the inventory you own." },
    { id: "some", label: "We own some and need some supplied", model: "Hybrid Program", description: "Owned goods and supplied inventory can be considered together." },
    { id: "supply", label: "We want Shelton to supply the goods", model: "Rental Program", description: "Shelton-supplied inventory can be evaluated around the account." },
    { id: "unsure", label: "We are not sure", model: "Recommend a Model", description: "The result can recommend a starting structure from the completed inputs." }
  ];

  const operation = (id, number, label, context, goodsIds) => ({ id, number, label, context, goods: goodsIds });

  const config = {
    version: 5,
    storageKey: "shelton-pricing-journey-v5",
    concepts: {
      orb: { number: "A", label: "Textile Begin Orb" }
    },
    chapterOrder: ["operation", "goods", "scale", "finish", "ownership", "location", "review"],
    operations: [
      operation("hotel", "01", "Hotel / Boutique Stay", "Hospitality programs often combine guest-facing presentation with occupancy shifts, storage limits, and repeat room turns.", ["sheets", "towels", "bathMats", "robes", "blankets"]),
      operation("str", "02", "STR / Property Manager", "Bulk pickup and return can support central turnover staging without implying house-to-house consumer service.", ["sheets", "towels", "bathMats", "duvetCovers", "blankets"]),
      operation("spa", "03", "Resort / Day Spa", "Treatment-room programs are shaped by appointment volume, soft-goods use, feel, and compact storage.", ["towels", "sheets", "robes", "blankets", "faceCradleCovers"]),
      operation("medspa", "04", "Medspa", "Medspa programs start with treatment-table sheets and add towels only when they are actually used.", ["sheets", "handTowels", "faceCradleCovers"]),
      operation("gym", "05", "Gym / Fitness", "Fitness programs usually center on towel volume, peak usage, odor control, and steady restocking.", ["towels", "handTowels"]),
      operation("events", "06", "Event / Venue / Convention Center", "Event programs balance presentation, fabric and color, event deadlines, variable volume, and specialty cleaning needs.", ["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods"]),
      operation("restaurant", "07", "Restaurant / Food Service", "Restaurant programs combine recurring kitchen soil with dining-room presentation and service schedules.", ["chefCoats", "aprons", "napkins", "barTowels", "tableLinens"]),
      operation("casino", "08", "Casino / Entertainment", "Casino programs may span hotel rooms, staff departments, restaurants, banquets, and presentation-driven goods.", ["casinoUniforms", "chefCoats", "napkins", "tableLinens", "towels", "banquetLinens"]),
      operation("uniforms", "09", "Uniform Account", "Uniform programs are organized around weekly garment counts, presentation, and repeat wear.", ["uniformShirts", "chefCoats", "casinoUniforms", "workwear", "jackets"]),
      operation("other", "10", "Other / Not Sure", "Some commercial programs do not fit a standard category. Start with the goods and Shelton can shape the questions from there.", ["towels", "tableLinens", "uniformShirts", "robes", "choirRobes", "specialtyGarments"])
    ],
    goods,
    scaleSchemas,
    finishOptions,
    specialtyOptions,
    ownershipChoices
  };

  window.SheltonPricingJourneyConfig = Object.freeze(config);
}());
