(function () {
  "use strict";

  const goods = {
    sheets: {
      label: "Sheets",
      short: "Flat and fitted",
      education: "Commercial sheets can be cleaned, pressed, folded, and returned around the way your operation uses them."
    },
    towels: {
      label: "Towels",
      short: "Bath, hand, and wash",
      education: "Commercial towels are processed for soil, odor, repeated use, and consistent return."
    },
    handTowels: {
      label: "Hand towels",
      short: "",
      education: "Hand towels need repeatable processing and compact return states that keep busy service areas stocked."
    },
    bathMats: {
      label: "Bath mats",
      short: "",
      education: "Bath mats benefit from soil-focused processing and consistent bundling for housekeeping use."
    },
    robes: {
      label: "Robes",
      short: "Waffle, terry, and spa",
      education: "Robes are handled for cleanliness, feel, presentation, and recurring guest use."
    },
    blankets: {
      label: "Blankets",
      short: "Bed and throw",
      education: "Blankets require processing that balances cleanliness, material care, and practical folded return."
    },
    duvetCovers: {
      label: "Duvet covers",
      short: "",
      education: "Duvet covers can be processed and folded for clear, repeatable turnover staging."
    },
    faceCradleCovers: {
      label: "Face cradle covers",
      short: "",
      education: "Treatment-room covers need consistent cleaning and compact sorting between appointments."
    },
    tablecloths: {
      label: "Tablecloths",
      short: "Round, square, and banquet",
      education: "Tablecloths require cleaning that considers stains, presentation, fabric, and color."
    },
    napkins: {
      label: "Napkins",
      short: "Dining and cocktail",
      education: "Napkins need soil-focused cleaning and consistent finishing for repeated presentation use."
    },
    runners: {
      label: "Runners",
      short: "",
      education: "Runners benefit from fabric-aware cleaning and finishing that preserves their presentation."
    },
    skirting: {
      label: "Skirting",
      short: "Pleated and flat",
      education: "Event skirting needs careful stain treatment, controlled finishing, and organized return."
    },
    chairCovers: {
      label: "Chair covers",
      short: "Fitted and draped",
      education: "Chair covers need consistent cleaning and sorting so event teams can stage them efficiently."
    },
    specialtyEventGoods: {
      label: "Specialty event goods",
      short: "Specialty shapes and fabrics",
      education: "Specialty event goods are evaluated for fabric, color, staining, presentation, and deadline."
    },
    chefCoats: {
      label: "Chef coats",
      short: "Cook and executive styles",
      education: "Heavy-use chef coats are cleaned for soil, white retention, and repeated commercial use."
    },
    aprons: {
      label: "Aprons",
      short: "Bib and waist",
      education: "Aprons are processed for food soil, grease, repeat wear, and practical organized return."
    },
    barTowels: {
      label: "Bar towels",
      short: "",
      education: "Bar towels need repeatable heavy-soil processing and efficient bundled return."
    },
    tableLinens: {
      label: "Table linens",
      short: "Tablecloths, napkins, and runners",
      education: "Table linens need stain treatment and finishing that keeps presentation consistent over time."
    },
    casinoUniforms: {
      label: "Casino uniforms",
      short: "Shirts, jackets, and workwear",
      education: "Casino uniforms need professional cleaning, presentation-focused finishing, and organized return by department."
    },
    banquetLinens: {
      label: "Banquet linens",
      short: "Tablecloths, napkins, and skirting",
      education: "Banquet linens combine recurring volume with event-grade stain treatment and presentation."
    },
    uniformShirts: {
      label: "Uniform shirts",
      short: "",
      education: "Uniform shirts are cleaned and finished for repeated wear, staff presentation, and organized return."
    },
    workwear: {
      label: "Workwear",
      short: "Shirts, pants, and outerwear",
      education: "Workwear programs balance repeated soil, garment life, professional finishing, and account organization."
    },
    jackets: {
      label: "Jackets",
      short: "",
      education: "Jackets require garment-aware cleaning and return choices suited to presentation and storage."
    },
    shirts: {
      label: "Shirts",
      short: "",
      education: "Wholesale shirts can move through cleaning and pressing capacity built around batch volume and turnaround."
    },
    suits: {
      label: "Suits",
      short: "Two- and three-piece",
      education: "Structured garments require controlled cleaning, pressing, and careful organized return."
    },
    dresses: {
      label: "Dresses",
      short: "",
      education: "Dresses require fabric-aware handling and finishing that adapts to construction and presentation."
    },
    specialtyGarments: {
      label: "Specialty garments",
      short: "Fabric- and construction-specific",
      education: "Specialty garments are evaluated around fabric, construction, use, finish, and return requirements."
    },
    choirRobes: {
      label: "Choir robes",
      short: "",
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
  const option = (value, label, description) => ({ value, label, ...(description ? { description } : {}) });

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
      number("rooms", "Guest rooms", "rooms", "Room count sets the program's potential scale before occupancy is applied.", 1, 5000),
      select("occupancy", "Approximate occupancy", "Occupancy converts total rooms into rooms likely to need linen service in a normal week.", [option("under50", "Under 50%"), option("50to74", "50-74%"), option("75to89", "75-89%"), option("90plus", "90% or more")]),
      select("bedSystem", "Bed-linen system", "Duvet and triple-sheet rooms use different quantities and finishing paths, so the mix changes weekly pounds and labor.", [option("duvet", "Duvet cover"), option("triple_sheet", "Triple sheet"), option("mixed", "A mix of both")]),
      number("duvetPercent", "Duvet share when mixed", "%", "The approximate duvet share lets the estimator weight both bed systems correctly.", 0, 100, false),
      select("storage", "Clean-goods storage", "On-site storage determines how much clean inventory can wait between bulk returns and helps shape service cadence.", storageOptions),
      number("knownVolume", "Total weekly pounds", "lb / week", "A normal measured weekly total replaces room-based assumptions and gives the closest starting range.", 1, 250000, false),
      number("weeklyRobes", "Robes per week", "pieces", "Robes follow a separate per-piece handling path, so their labor is estimated apart from room-linen pounds.", 0, 250000, false, ["robes"]),
      number("weeklyBlankets", "Blankets per week", "pieces", "Blankets receive separate specialty handling, so their count is estimated apart from standard room linen.", 0, 250000, false, ["blankets"])
    ],
    senior_living: [
      number("licensedCapacity", "Licensed resident capacity", "residents", "Capacity sets the maximum recurring linen demand before occupancy and care mix are applied.", 1, 10000),
      select("occupancy", "Approximate occupancy", "Occupancy converts licensed capacity into residents likely to need linen service in a normal week.", [option("under50", "Under 50%"), option("50to74", "50-74%"), option("75to89", "75-89%"), option("90plus", "90% or more")]),
      select("careType", "Resident care mix", "Care mix changes the planned linen pounds per occupied resident.", [option("independent_assisted", "Independent / assisted living"), option("memory_care", "Memory care"), option("mixed", "A mix of both")]),
      number("memoryCarePercent", "Memory-care share when mixed", "%", "The approximate memory-care share lets the estimator weight a mixed resident program correctly.", 0, 100, false),
      number("knownVolume", "Total weekly pounds", "lb / week", "A normal measured weekly total replaces resident-based assumptions and gives the closest starting range.", 1, 250000, false),
      number("weeklyBlankets", "Blankets per week", "pieces", "Blankets receive separate specialty handling, so their count is estimated apart from standard linen pounds.", 0, 250000, false, ["blankets"])
    ],
    residential_treatment: [
      number("licensedCapacity", "Licensed bed capacity", "beds", "Capacity sets the maximum recurring linen demand before occupancy and turnover are applied.", 1, 10000),
      select("occupancy", "Approximate occupancy", "Occupancy converts licensed beds into beds likely to need linen service in a normal week.", [option("under50", "Under 50%"), option("50to74", "50-74%"), option("75to89", "75-89%"), option("90plus", "90% or more")]),
      select("careType", "Treatment setting", "The treatment setting changes the normal linen use and turnover assumptions for each occupied bed.", [option("residential_sud", "Residential substance-use treatment"), option("detox_withdrawal", "Detox / withdrawal management"), option("mental_health_residential", "Residential mental-health treatment"), option("eating_disorder_residential", "Residential eating-disorder treatment")]),
      number("admissionsPerWeek", "Admissions per week", "admissions", "Admissions capture the additional linen generated when residents arrive and rooms turn over.", 0, 10000, false),
      number("averageStayDays", "Average length of stay", "days", "Length of stay shows how often beds turn; shorter stays generally create more turnover linen.", 1, 3650, false),
      number("knownVolume", "Total weekly pounds", "lb / week", "A normal measured weekly total replaces bed-based assumptions and gives the closest starting range.", 1, 250000, false),
      number("weeklyBlankets", "Blankets per week", "pieces", "Blankets receive separate specialty handling, so their count is estimated apart from standard linen pounds.", 0, 250000, false, ["blankets"])
    ],
    str: [
      number("properties", "Properties in the program", "properties", "Property count establishes the account's scale and combines with turns per property to estimate weekly linen movement.", 1, 10000),
      number("turnsPerProperty", "Average turns per property per week", "turns / property", "Turns per property convert the property count into the number of complete linen sets moving each week.", 0.01, 100),
      select("bedroomBasis", "How do you track bedrooms?", "Bedrooms drive the linen required for each turnover; choose the measure your team already tracks to avoid double counting.", [
        option("average", "Average per property", "Use the typical bedroom count for one property."),
        option("total", "Total across the program", "Use the combined bedrooms across every property in the program.")
      ]),
      number("averageBedrooms", "Average bedrooms per property", "bedrooms / property", "Typical bedrooms per property set the linen pounds for each property turnover.", 0.1, 30),
      number("totalBedrooms", "Total bedrooms across the program", "total bedrooms", "The combined bedroom count lets the estimator derive the program's average property size.", 1, 300000),
      select("seasonality", "Seasonal movement", "Seasonal movement keeps an average week from understating the capacity needed during peak periods.", seasonalityOptions),
      number("knownVolume", "Total weekly pounds", "lb / week", "A normal measured weekly total bypasses property and turnover assumptions and gives the closest starting range.", 1, 250000, false),
      number("weeklyBlankets", "Blankets per week", "pieces", "Blankets receive separate per-piece handling, so their count is estimated apart from standard linen pounds.", 0, 250000, false, ["blankets"])
    ],
    spa: [
      number("appointments", "Appointments per week", "appointments", "Appointment volume establishes how many treatment-room changeovers occur in a normal week.", 1, 50000),
      select("goodsUse", "Soft-goods use per appointment", "The towels, sheets, and robes used at each appointment determine the linen weight created by every changeover.", [option("light", "Light · two towels"), option("standard", "Standard · three towels and one sheet"), option("heavy", "Heavy · four towels, one sheet, and one robe")]),
      select("storage", "Clean-goods storage", "On-site storage determines how much clean inventory can wait between returns and helps shape service cadence.", storageOptions),
      number("knownVolume", "Total weekly pounds", "lb / week", "A normal measured weekly total bypasses appointment-based assumptions and gives the closest starting range.", 1, 100000, false)
    ],
    medspa: [
      number("appointments", "Appointments per week", "appointments", "Appointment volume establishes the number of treatment-table resets; the starting model uses two twin sheets per appointment.", 1, 50000),
      number("handTowelsPerAppointment", "Hand towels per appointment", "towels", "Hand towels add processing weight to every appointment and should be included only when they are part of the service.", 0, 20),
      select("storage", "Clean-goods storage", "On-site storage determines how much clean inventory can wait between returns and helps shape service cadence.", storageOptions),
      number("knownVolume", "Total weekly pounds", "lb / week", "A normal measured weekly total bypasses appointment-based assumptions and gives the closest starting range.", 1, 100000, false)
    ],
    gym: [
      number("weeklyTowelUses", "Weekly towel uses", "uses", "Member and class towel uses establish the program's base weekly processing volume.", 1, 500000),
      select("peakPattern", "Peak-use pattern", "Peak concentration shows how much clean stock may be needed at once, even when total weekly use stays the same.", [option("concentrated", "A few concentrated peaks"), option("balanced", "Balanced across the week"), option("variable", "Highly variable")]),
      number("activeDays", "Active days per week", "days", "Operating days show how weekly towel demand is distributed and help shape the return rhythm.", 1, 7),
      select("storage", "Clean-towel storage", "Storage capacity determines how much clean towel inventory can wait between returns.", storageOptions),
      number("knownVolume", "Total weekly pounds", "lb / week", "A normal measured weekly total bypasses towel-use assumptions and gives the closest starting range.", 1, 250000, false)
    ],
    events: [
      number("weeklyTablecloths", "Tablecloths per week", "pieces", "Tablecloth count maps the larger finished pieces that move through the event-linen production path each week.", 0, 500000, false, ["tablecloths"]),
      number("weeklyNapkins", "Napkins per week", "pieces", "Napkins use a different finishing path from tablecloths, so their weekly count is estimated separately.", 0, 2000000, false, ["napkins"]),
      number("totalWeeklyPieces", "Total pieces per week", "pieces", "When individual counts are unavailable, total pieces establish the base volume using a planning mix of one tablecloth to eight napkins.", 1, 2500000, false),
      select("seasonality", "Volume pattern", "Season and venue calendars reveal peak weeks that an average volume could otherwise hide.", seasonalityOptions)
    ],
    restaurant: [
      number("weeklyCovers", "Approximate weekly covers", "covers", "Dining volume establishes the likely movement of napkins and table linen in a normal week.", 1, 1000000, false, ["napkins", "tableLinens"]),
      number("knownVolume", "Total weekly linen pounds", "lb / week", "A measured weekly total for dining linen and utility towels gives the closest starting range.", 1, 250000, false, ["napkins", "tableLinens", "barTowels"]),
      number("weeklyChefCoats", "Chef coats per week", "pieces", "Chef coats require garment cleaning and finishing, so their actual weekly count is estimated separately from linen pounds.", 0, 250000, false, ["chefCoats"]),
      number("weeklyAprons", "Aprons per week", "pieces", "Aprons use a separate garment and folding path, so their weekly count adds labor beyond dining linen.", 0, 250000, false, ["aprons"])
    ],
    casino: [
      number("hotelRooms", "Hotel rooms", "rooms", "Room count establishes the hotel-linen portion of the program; leave it blank when room linen is not included.", 0, 5000, false),
      number("weeklyCovers", "Restaurant covers per week", "covers", "Covers establish the dining-linen portion of the program; leave it blank when restaurant linen is not included.", 0, 1000000, false),
      number("weeklyTablecloths", "Banquet tablecloths per week", "pieces", "Tablecloth count captures the larger finished pieces moving through the banquet production path.", 0, 500000, false),
      number("weeklyNapkins", "Banquet napkins per week", "pieces", "Napkins use a different finishing path from tablecloths, so their weekly count is estimated separately.", 0, 2000000, false),
      number("weeklyChefCoats", "Chef coats per week", "pieces", "Chef coats require garment cleaning and finishing, so their weekly count is estimated apart from linen.", 0, 250000, false, ["chefCoats"]),
      number("weeklyUniformTops", "Uniform tops per week", "pieces", "Uniform quantity sets the garment-processing portion of the program and should include only pieces Shelton will service.", 0, 250000, false, ["casinoUniforms"])
    ],
    uniforms: [
      number("weeklyUniformTops", "Uniform shirts per week", "pieces", "Actual weekly shirt count sets the cleaning, pressing, and presentation labor for this garment type.", 0, 500000, false, ["uniformShirts", "casinoUniforms"]),
      number("weeklyChefCoats", "Chef coats per week", "pieces", "Chef coats have their own garment-finishing requirements, so their weekly count is estimated separately.", 0, 500000, false, ["chefCoats"]),
      number("weeklyPants", "Pants or workwear per week", "pieces", "Pants and workwear follow a different finishing path from shirts, so their actual weekly count matters.", 0, 500000, false, ["workwear"]),
      number("weeklyJackets", "Jackets or coveralls per week", "pieces", "Heavier construction changes cleaning and finishing labor, so jackets and coveralls require a separate count and review.", 0, 500000, false, ["jackets"])
    ],
    wholesale: [
      number("weeklyVolume", "Weekly wholesale volume", "volume", "Normal combined batch volume establishes the amount of production capacity the program needs each week.", 1, 1000000),
      select("volumeUnit", "Volume unit", "The unit tells the estimator how to interpret the volume without converting plant records incorrectly.", volumeUnitOptions),
      number("batchDays", "Production days per week", "days", "Production days show how the weekly volume is distributed and how much capacity is needed on each batch day.", 1, 7),
      select("turnaround", "Typical turnaround requirement", "The turnaround deadline determines how quickly cleaning and finishing capacity must be available.", [option("urgent", "Under 48 hours"), option("standard", "3-4 days"), option("flexible", "Five days or flexible")]),
      select("capacityNeed", "Primary capacity need", "The service role determines which parts of cleaning, pressing, and finishing Shelton must include.", [option("full", "Cleaning and finishing"), option("pressing", "Pressing or finishing"), option("overflow", "Overflow and peak support")])
    ],
    other: [
      number("weeklyVolume", "Approximate weekly volume", "volume", "Even a rough weekly amount gives the estimator a base scale for an uncommon program.", 1, 1000000),
      select("volumeUnit", "Volume unit", "The unit prevents pounds and pieces from being interpreted as the same type of workload.", volumeUnitOptions),
      number("activeDays", "Operating days per week", "days", "Operating days show how demand is distributed and help shape the service rhythm.", 1, 7),
      select("variability", "Volume pattern", "Volume swings reveal the peak capacity an average week could otherwise hide.", seasonalityOptions),
      select("storage", "Clean-goods storage", "On-site storage determines how much clean inventory can wait between returns and helps shape service cadence.", storageOptions)
    ]
  };

  Object.entries(scaleSchemas).forEach(([operationId, fields]) => {
    if (["wholesale", "other"].includes(operationId)) return;
    if (!fields.some((field) => field.id === "storage")) {
      fields.push(select("storage", "Clean-goods storage", "Storage changes the recommended pickup cadence; limited storage adds service frequency without lowering the priced recommendation.", storageOptions, false));
    }
    if (!fields.some((field) => ["seasonality", "variability"].includes(field.id))) {
      fields.push(select("seasonality", "Typical and peak pattern", "A seasonal account keeps one fixed rate; when an exact peak is unknown the estimator tests 25% above typical.", seasonalityOptions, false));
    }
  });

  const scaleEntryModes = {
    hotel: { driverLabel: "Rooms and occupancy", directLabel: "Total pounds per week", directField: "knownVolume" },
    senior_living: { driverLabel: "Resident capacity and occupancy", directLabel: "Total pounds per week", directField: "knownVolume" },
    residential_treatment: { driverLabel: "Bed capacity and occupancy", directLabel: "Total pounds per week", directField: "knownVolume" },
    str: { driverLabel: "Properties and turns", directLabel: "Total pounds per week", directField: "knownVolume" },
    spa: { driverLabel: "Appointments and item use", directLabel: "Total pounds per week", directField: "knownVolume" },
    medspa: { driverLabel: "Appointments and item use", directLabel: "Total pounds per week", directField: "knownVolume" },
    gym: { driverLabel: "Weekly towel use", directLabel: "Total pounds per week", directField: "knownVolume" },
    events: { driverLabel: "Tablecloth and napkin counts", directLabel: "Total pieces per week", directField: "totalWeeklyPieces" },
    restaurant: { driverLabel: "Covers and item counts", directLabel: "Total linen pounds per week", directField: "knownVolume", directGoods: ["napkins", "tableLinens", "barTowels"] }
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

  const operation = (id, number, label, context, goodsIds, guideTitle, drivers, note) => ({
    id,
    number,
    label,
    context,
    goods: goodsIds,
    guide: { title: guideTitle, drivers, note }
  });

  const config = {
    version: 9,
    storageKey: "shelton-pricing-spine-v9",
    concepts: {
      orb: { number: "A", label: "Textile Begin Orb" }
    },
    chapterOrder: ["operation", "goods", "scale", "finish", "ownership", "location", "review"],
    operations: [
      operation("hotel", "01", "Hotel / Boutique Stay", "Hospitality programs combine guest-facing presentation with occupancy shifts, storage limits, and repeat room turns.", ["sheets", "duvetCovers", "towels", "bathMats", "robes", "blankets"], "A room-ready program starts with the way the property turns.", ["Guest rooms", "Approximate occupancy", "Bed-linen system"], "Known weekly pounds, robe counts, and blanket counts are useful when your team already tracks them."),
      operation("senior_living", "02", "Senior Living", "Senior-living programs balance occupied-resident volume, care mix, dependable stock, and recurring resident use.", ["sheets", "towels", "bathMats", "blankets"], "Resident use and care mix shape the linen plan.", ["Licensed resident capacity", "Approximate occupancy", "Resident care mix"], "A known weekly volume or blanket count can make the first plan more precise."),
      operation("residential_treatment", "03", "Residential Treatment", "Treatment programs combine occupied-bed volume with setting, admissions, and turnover needs.", ["sheets", "towels", "bathMats", "blankets"], "The treatment setting changes how recurring and turnover linen move.", ["Licensed bed capacity", "Approximate occupancy", "Treatment setting"], "Admissions, average stay, and known weekly pounds help refine turnover assumptions when available."),
      {
        ...operation("str", "04", "STR / Property Manager", "Bulk pickup and return support central turnover staging for multi-property programs.", ["sheets", "towels", "bathMats", "duvetCovers", "blankets"], "A useful STR plan follows turns through one central staging point.", ["Properties in the program", "Average turns per property", "Average or total bedrooms", "Central location required"], "Seasonality and measured weekly pounds help plan for peak turnover periods."),
        centralLocationRequired: true
      },
      operation("spa", "05", "Resort / Day Spa", "Treatment-room programs are shaped by appointment volume, soft-goods use, feel, and compact storage.", ["towels", "sheets", "robes", "blankets", "faceCradleCovers"], "Treatment volume and the guest experience move together.", ["Appointments per week", "Soft-goods use per appointment", "Clean-goods storage"], "Known weekly pounds can refine the plan, but appointment volume is enough to begin."),
      operation("medspa", "06", "Medspa", "Medspa programs usually start with treatment-table sheets and add hand towels only when they are part of the service.", ["sheets", "handTowels", "faceCradleCovers"], "The program should reflect what each appointment actually uses.", ["Appointments per week", "Hand towels per appointment", "Clean-goods storage"], "Hand-towel use can remain at zero when treatment sheets are the primary item."),
      operation("gym", "07", "Gym / Fitness", "Fitness programs center on towel movement, peak usage, odor control, and steady restocking.", ["towels", "handTowels"], "Peak towel demand matters as much as the weekly total.", ["Weekly towel uses", "Peak-use pattern", "Active days", "Clean-towel storage"], "A simple estimate of member and class towel use is enough to start."),
      operation("events", "08", "Event / Venue / Convention Center", "Event programs balance presentation, fabric and color, variable volume, and specialty cleaning needs.", ["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods"], "Presentation and production needs define an event-linen program.", ["Weekly linen pieces", "Selected goods", "Seasonal or event-driven volume"], "Separate tablecloth and napkin counts improve finishing and capacity planning."),
      operation("restaurant", "09", "Restaurant / Food Service", "Restaurant programs combine recurring kitchen soil with dining-room presentation and service schedules.", ["chefCoats", "aprons", "napkins", "barTowels", "tableLinens"], "Kitchen soil and dining-room presentation need different care paths.", ["Dining covers", "Weekly linen or garment counts", "Goods in the program"], "Choose the goods first; the next section will show only the counts that apply."),
      operation("casino", "10", "Casino / Entertainment", "Casino programs may span hotel rooms, staff departments, restaurants, banquets, and presentation-driven goods.", ["casinoUniforms", "chefCoats", "napkins", "tableLinens", "towels", "banquetLinens"], "One property can contain several distinct laundry programs.", ["Departments in scope", "Hotel rooms or dining covers", "Uniform and banquet counts"], "Include only the departments and goods Shelton would service in this program."),
      operation("uniforms", "11", "Uniform Account", "Uniform programs are organized around weekly garment movement, professional presentation, and repeat wear.", ["uniformShirts", "chefCoats", "casinoUniforms", "workwear", "jackets"], "Weekly garment movement is the clearest starting point.", ["Weekly garment counts", "Garment mix", "Presentation and return needs"], "Actual pieces entering service each week are more useful than total employee count."),
      operation("wholesale", "12", "Wholesale Laundry / Finishing Partner", "Wholesale programs provide behind-the-scenes cleaning, pressing, finishing, or overflow capacity for another operator.", ["sheets", "tablecloths", "tableLinens", "shirts", "suits", "specialtyGarments"], "Capacity, turnaround, and finishing define a wholesale partnership.", ["Weekly batch volume", "Production days", "Turnaround requirement", "Capacity need"], "Wholesale programs receive a direct Shelton review rather than a generic public price."),
      operation("other", "13", "Other / Not Sure", "Some commercial programs do not fit a standard category. Start with the goods and Shelton can shape the remaining questions.", ["sheets", "tableLinens", "tablecloths", "uniformShirts", "choirRobes", "specialtyGarments"], "Start with what moves through the program.", ["Approximate weekly volume", "Operating days", "Volume pattern", "Clean-goods storage"], "A rough amount is enough to begin. Shelton can refine the program during review.")
    ],
    goods,
    scaleSchemas,
    scaleEntryModes,
    finishOptions,
    specialtyOptions,
    ownershipChoices
  };

  window.SheltonPricingJourneyConfig = Object.freeze(config);
}());
