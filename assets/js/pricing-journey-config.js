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

  const operation = (id, number, label, context, goodsIds) => ({ id, number, label, context, goods: goodsIds });

  const config = {
    version: 2,
    storageKey: "shelton-pricing-journey-v2",
    concepts: {
      orb: { number: "A", label: "Textile Begin Orb" },
      label: { number: "B", label: "Suspended Program Label" },
      portal: { number: "C", label: "Minimal Typographic Portal" }
    },
    chapterOrder: ["operation", "goods", "scale", "finish", "ownership", "location", "review"],
    operations: [
      operation("hotel", "01", "Hotel / Boutique Stay", "Hospitality programs often combine guest-facing presentation with occupancy shifts, storage limits, and repeat room turns.", ["sheets", "towels", "bathMats", "robes", "blankets"]),
      operation("str", "02", "STR / Property Manager", "Bulk pickup and return can support central turnover staging without implying house-to-house consumer service.", ["sheets", "towels", "bathMats", "duvetCovers", "blankets"]),
      operation("spa", "03", "Spa / Wellness", "Treatment-room programs are shaped by appointment volume, room turnover, soft-goods feel, and compact storage.", ["towels", "sheets", "robes", "blankets", "faceCradleCovers"]),
      operation("gym", "04", "Gym / Fitness", "Fitness programs usually center on towel volume, peak usage, odor control, and steady restocking.", ["towels", "handTowels"]),
      operation("event", "05", "Event / Venue / Convention Center", "Event programs balance presentation, fabric and color, event deadlines, variable volume, and specialty cleaning needs.", ["tablecloths", "napkins", "runners", "skirting", "chairCovers", "specialtyEventGoods"]),
      operation("restaurant", "06", "Restaurant / Food Service", "Restaurant programs combine recurring kitchen soil with dining-room presentation and service schedules.", ["chefCoats", "aprons", "napkins", "barTowels", "tableLinens"]),
      operation("casino", "07", "Casino / Entertainment", "Casino programs may span staff departments, multiple shifts, restaurants, banquets, and presentation-driven goods.", ["casinoUniforms", "chefCoats", "napkins", "tableLinens", "towels", "banquetLinens"]),
      operation("uniform", "08", "Uniform Account", "Uniform programs are organized around staff count, departments, shifts, garment presentation, and repeat wear.", ["uniformShirts", "chefCoats", "casinoUniforms", "workwear", "jackets"]),
      operation("wholesale", "09", "Wholesale Dry Cleaning", "Wholesale support adds behind-the-scenes cleaning and finishing capacity around batch volume and turnaround.", ["shirts", "suits", "dresses", "specialtyGarments"]),
      operation("other", "10", "Other / Not Sure", "Some commercial programs do not fit a standard category. Start with the goods and Shelton can shape the questions from there.", ["towels", "tableLinens", "uniformShirts", "robes", "choirRobes", "specialtyGarments"])
    ],
    goods
  };

  window.SheltonPricingJourneyConfig = Object.freeze(config);
}());
