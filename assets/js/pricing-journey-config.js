(function () {
  "use strict";

  const config = {
    concepts: {
      orb: { number: "A", label: "Textile Begin Orb" },
      label: { number: "B", label: "Suspended Program Label" },
      portal: { number: "C", label: "Minimal Typographic Portal" }
    },
    operations: [
      { id: "hotel", number: "01", label: "Hotel / Boutique Stay" },
      { id: "str", number: "02", label: "STR / Property Manager" },
      { id: "spa", number: "03", label: "Spa / Wellness" },
      { id: "gym", number: "04", label: "Gym / Fitness" },
      { id: "event", number: "05", label: "Event / Venue / Convention Center" },
      { id: "restaurant", number: "06", label: "Restaurant / Food Service" },
      { id: "casino", number: "07", label: "Casino / Entertainment" },
      { id: "uniform", number: "08", label: "Uniform Account" },
      { id: "wholesale", number: "09", label: "Wholesale Dry Cleaning" },
      { id: "other", number: "10", label: "Other / Not Sure" }
    ]
  };

  window.SheltonPricingJourneyConfig = Object.freeze(config);
}());
