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
  const number = (id, label, unit, hint, min, max, required = true) => ({ id, label, unit, hint, type: "number", min, max, step: 1, required });
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
      number("weeklyTurns", "Average room turns per week", "turns", "Use a typical week rather than a peak holiday.", 1, 35000),
      select("storage", "Clean-goods storage", "Storage pressure can affect the practical route rhythm.", storageOptions),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if your team already tracks pounds.", 1, 250000, false)
    ],
    str: [
      number("properties", "Properties in the program", "properties", "This should reflect the bulk program, not individual household pickup.", 1, 10000),
      number("weeklyTurns", "Average turns per week", "turns", "Use the total turns routed through the central staging point.", 1, 50000),
      select("centralPoint", "Central pickup arrangement", "Shelton planning assumes account-level bulk pickup and return.", [option("established", "Central location established"), option("staging", "Laundry staging point planned"), option("planning", "Still determining the central point")]),
      select("seasonality", "Seasonal movement", "Seasonal changes help avoid planning only around an average month.", seasonalityOptions),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if pounds are already tracked.", 1, 250000, false)
    ],
    spa: [
      number("appointments", "Appointments per week", "appointments", "Appointment volume helps estimate treatment-room turnover.", 1, 50000),
      number("treatmentRooms", "Treatment rooms", "rooms", "Room count provides a second operating signal.", 1, 1000),
      select("goodsUse", "Soft-goods use per appointment", "Choose the closest overall pattern.", [option("light", "Mostly towels or one sheet"), option("standard", "Towels plus a sheet"), option("high", "Multiple towels, sheets, or robes")]),
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
      number("eventsPerMonth", "Events per month", "events", "Use a typical active month.", 1, 2000),
      number("piecesPerEvent", "Average pieces per event", "pieces", "Include table, chair, and specialty goods in the estimate.", 1, 500000),
      select("returnWindow", "Typical return window", "Deadlines influence production planning without asking for a route preference.", [option("urgent", "24-48 hours"), option("standard", "3-4 days"), option("flexible", "Five days or flexible")]),
      select("seasonality", "Volume pattern", "Event volume often moves with season and venue calendar.", seasonalityOptions)
    ],
    restaurant: [
      number("employees", "Employees using goods", "employees", "Include kitchen and service staff tied to the program.", 1, 10000),
      number("weeklyCovers", "Approximate weekly covers", "covers", "Dining volume helps scale napkin and table-linen movement.", 1, 1000000),
      number("shiftsPerDay", "Operating shifts per day", "shifts", "Shift structure helps identify recurring kitchen demand.", 1, 6),
      select("goodsMix", "Primary goods mix", "This weights kitchen soil and dining-room presentation differently.", [option("kitchen", "Mostly kitchen goods"), option("dining", "Mostly dining-room goods"), option("both", "Kitchen and dining-room goods")]),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if pounds are already tracked.", 1, 250000, false)
    ],
    casino: [
      number("employees", "Employees in the program", "employees", "Use the staff population tied to selected goods.", 1, 100000),
      number("departments", "Departments", "departments", "Department count helps anticipate sorting and organized return.", 1, 200),
      number("shiftsPerDay", "Operating shifts per day", "shifts", "Multiple shifts create continuous garment movement.", 1, 6),
      number("banquetEvents", "Banquet or event volume per month", "events", "Use zero only when banquet goods are outside the program.", 0, 5000),
      number("restaurantOutlets", "Restaurant outlets", "outlets", "Include only outlets whose goods are selected here.", 0, 500)
    ],
    uniforms: [
      number("employees", "Employees in the program", "employees", "Headcount establishes the working garment pool.", 1, 100000),
      number("departments", "Departments", "departments", "Departments can shape labeling and organized return.", 1, 500),
      number("shiftsPerDay", "Operating shifts per day", "shifts", "Shift structure helps estimate recurring garment demand.", 1, 6),
      number("piecesPerEmployee", "Pieces used per employee per week", "pieces", "Use an average across included roles.", 1, 100),
      number("knownVolume", "Known weekly volume", "lb / week", "Optional if pounds are already tracked.", 1, 250000, false)
    ],
    wholesale: [
      number("weeklyVolume", "Weekly wholesale volume", "volume", "Enter the normal combined batch volume.", 1, 1000000),
      select("volumeUnit", "Volume unit", "Use the unit your plant already tracks.", volumeUnitOptions),
      number("batchDays", "Production days per week", "days", "This is a capacity signal, not a route preference.", 1, 7),
      select("turnaround", "Typical turnaround requirement", "Turnaround helps weight cleaning and finishing capacity.", [option("urgent", "Under 48 hours"), option("standard", "3-4 days"), option("flexible", "Five days or flexible")]),
      select("capacityNeed", "Primary capacity need", "Choose the closest role Shelton would play.", [option("full", "Cleaning and finishing"), option("pressing", "Pressing or finishing"), option("overflow", "Overflow and peak support")])
    ],
    worship: [
      number("weeklyServices", "Regular services per week", "services", "Use a typical week before holiday or seasonal peaks.", 1, 50),
      number("choirMembers", "Choir members", "people", "Include members whose robes or garments are part of the program.", 0, 2000, false),
      number("specialEventsPerMonth", "Special events per month", "events", "Include weddings, memorials, concerts, and other scheduled events.", 0, 200, false),
      select("storage", "Clean-goods storage", "Storage can affect the practical return rhythm.", storageOptions)
    ],
    other: [
      number("weeklyVolume", "Approximate weekly volume", "volume", "A rough amount is enough for the private planning model.", 1, 1000000),
      select("volumeUnit", "Volume unit", "Choose pounds, pieces, or not sure.", volumeUnitOptions),
      number("activeDays", "Operating days per week", "days", "Operating days help describe demand without choosing pickup frequency.", 1, 7),
      select("variability", "Volume pattern", "Variability helps Shelton understand peak pressure.", seasonalityOptions),
      select("storage", "Clean-goods storage", "Storage can affect the recommended return rhythm.", storageOptions)
    ]
  };

  const helpEstimateDrivers = {
    roomTurn: { label: "per occupied room serviced", unit: "pieces / room", basis: "weeklyTurns" },
    propertyTurn: { label: "per property turn", unit: "pieces / turn", basis: "weeklyTurns" },
    appointment: { label: "per appointment", unit: "pieces / appointment", basis: "appointments" },
    event: { label: "per event", unit: "pieces / event", basis: "eventsPerMonth" },
    banquetEvent: { label: "per banquet or event", unit: "pieces / event", basis: "banquetEvents" },
    employeeWeek: { label: "per employee per week", unit: "pieces / employee / week", basis: "employees" },
    choirMemberWeek: { label: "per choir member per week", unit: "pieces / member / week", basis: "choirMembers" },
    serviceEvent: { label: "per service or event", unit: "pieces / service", basis: "servicesAndEvents" },
    cover: { label: "per cover", unit: "pieces / cover", basis: "weeklyCovers" },
    weeklyDirect: { label: "each week", unit: "pieces / week", basis: "weekly" }
  };

  const helpEstimateProfiles = {
    hotel: {
      baseFields: ["weeklyTurns"],
      goods: { sheets: "roomTurn", towels: "roomTurn", bathMats: "roomTurn", robes: "weeklyDirect", blankets: "weeklyDirect" }
    },
    str: {
      baseFields: ["properties", "weeklyTurns"],
      goods: { sheets: "propertyTurn", towels: "propertyTurn", bathMats: "propertyTurn", duvetCovers: "propertyTurn", blankets: "weeklyDirect" }
    },
    spa: {
      baseFields: ["appointments", "treatmentRooms"],
      goods: { towels: "appointment", sheets: "appointment", robes: "appointment", blankets: "weeklyDirect", faceCradleCovers: "appointment" }
    },
    gym: {
      baseFields: [],
      goods: { towels: "weeklyDirect", handTowels: "weeklyDirect" }
    },
    events: {
      baseFields: ["eventsPerMonth"],
      goods: { tablecloths: "event", napkins: "event", runners: "event", skirting: "event", chairCovers: "event", specialtyEventGoods: "event" }
    },
    restaurant: {
      baseFields: ["employees", "weeklyCovers"],
      goods: { chefCoats: "employeeWeek", aprons: "employeeWeek", napkins: "cover", barTowels: "weeklyDirect", tableLinens: "weeklyDirect" }
    },
    casino: {
      baseFields: ["employees", "banquetEvents"],
      goods: { casinoUniforms: "employeeWeek", chefCoats: "employeeWeek", napkins: "weeklyDirect", tableLinens: "weeklyDirect", towels: "weeklyDirect", banquetLinens: "banquetEvent" }
    },
    uniforms: {
      baseFields: ["employees"],
      goods: { uniformShirts: "employeeWeek", chefCoats: "employeeWeek", casinoUniforms: "employeeWeek", workwear: "employeeWeek", jackets: "employeeWeek" }
    },
    wholesale: {
      baseFields: ["turnaround"],
      goods: { shirts: "weeklyDirect", suits: "weeklyDirect", dresses: "weeklyDirect", specialtyGarments: "weeklyDirect" }
    },
    worship: {
      baseFields: ["weeklyServices", "choirMembers", "specialEventsPerMonth"],
      goods: { choirRobes: "choirMemberWeek", tableLinens: "serviceEvent", specialtyGarments: "weeklyDirect" }
    },
    other: {
      baseFields: ["storage"],
      goods: { towels: "weeklyDirect", tableLinens: "weeklyDirect", uniformShirts: "weeklyDirect", robes: "weeklyDirect", choirRobes: "weeklyDirect", specialtyGarments: "weeklyDirect" }
    }
  };

  const foldedGoods = ["sheets", "towels", "handTowels", "bathMats", "blankets", "duvetCovers", "faceCradleCovers", "tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods", "barTowels", "tableLinens", "banquetLinens"];
  const garmentGoods = ["robes", "chefCoats", "aprons", "casinoUniforms", "uniformShirts", "workwear", "jackets", "shirts", "suits", "dresses", "specialtyGarments", "choirRobes"];

  const billingUnits = {
    default: "pounds",
    byGood: {
      tableLinens: "pieces",
      banquetLinens: "pieces",
      robes: "pieces",
      choirRobes: "pieces",
      specialtyGarments: "pieces"
    },
    byOperation: {
      events: { default: "pieces" },
      worship: { default: "pieces" },
      restaurant: { goods: { tableLinens: "pounds" } }
    }
  };

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
    { id: "deadline", label: "Production deadline", description: "For event or wholesale return windows that shape capacity.", goods: [...foldedGoods, ...garmentGoods], operations: ["events", "wholesale"] },
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
    version: 6,
    storageKey: "shelton-pricing-journey-v6",
    concepts: {
      orb: { number: "A", label: "Textile Begin Orb" }
    },
    chapterOrder: ["operation", "goods", "scale", "location", "finish", "ownership", "review"],
    operations: [
      operation("hotel", "01", "Hotel / Boutique Stay", "Hospitality programs often combine guest-facing presentation with occupancy shifts, storage limits, and repeat room turns.", ["sheets", "towels", "bathMats", "robes", "blankets"]),
      operation("str", "02", "STR / Property Manager", "Bulk pickup and return can support central turnover staging without implying house-to-house consumer service.", ["sheets", "towels", "bathMats", "duvetCovers", "blankets"]),
      operation("spa", "03", "Spa / Wellness", "Treatment-room programs are shaped by appointment volume, room turnover, soft-goods feel, and compact storage.", ["towels", "sheets", "robes", "blankets", "faceCradleCovers"]),
      operation("gym", "04", "Gym / Fitness", "Fitness programs usually center on towel volume, peak usage, odor control, and steady restocking.", ["towels", "handTowels"]),
      operation("events", "05", "Event / Venue / Convention Center", "Event programs balance presentation, fabric and color, event deadlines, variable volume, and specialty cleaning needs.", ["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods"]),
      operation("restaurant", "06", "Restaurant / Food Service", "Restaurant programs combine recurring kitchen soil with dining-room presentation and service schedules.", ["chefCoats", "aprons", "napkins", "barTowels", "tableLinens"]),
      operation("casino", "07", "Casino / Entertainment", "Casino programs may span staff departments, multiple shifts, restaurants, banquets, and presentation-driven goods.", ["casinoUniforms", "chefCoats", "napkins", "tableLinens", "towels", "banquetLinens"]),
      operation("uniforms", "08", "Uniform Account", "Uniform programs are organized around staff count, departments, shifts, garment presentation, and repeat wear.", ["uniformShirts", "chefCoats", "casinoUniforms", "workwear", "jackets"]),
      operation("wholesale", "09", "Wholesale Dry Cleaning", "Wholesale support adds behind-the-scenes cleaning and finishing capacity around batch volume and turnaround.", ["shirts", "suits", "dresses", "specialtyGarments"]),
      operation("worship", "10", "Houses of Worship", "Houses of worship may combine choir garments, table linens, and specialty garments around weekly services and seasonal events.", ["choirRobes", "tableLinens", "specialtyGarments"]),
      operation("other", "11", "Other / Not Sure", "Some commercial programs do not fit a standard category. Start with the goods and Shelton can shape the questions from there.", ["towels", "tableLinens", "uniformShirts", "robes", "choirRobes", "specialtyGarments"])
    ],
    goods,
    scaleSchemas,
    helpEstimateDrivers,
    helpEstimateProfiles,
    billingUnits,
    finishOptions,
    specialtyOptions,
    ownershipChoices
  };

  window.SheltonPricingJourneyConfig = Object.freeze(config);
}());
