(function () {
  "use strict";

  const config = {
    steps: [
      {
        number: 1,
        id: "model",
        label: "Model",
        title: "How should your goods be supplied?",
        kind: "model"
      },
      {
        number: 2,
        id: "operation",
        label: "Operation",
        title: "Operation",
        kind: "placeholder"
      },
      {
        number: 3,
        id: "goods",
        label: "Goods",
        title: "Goods",
        kind: "placeholder"
      },
      {
        number: 4,
        id: "volume",
        label: "Volume",
        title: "Volume",
        kind: "placeholder"
      },
      {
        number: 5,
        id: "service",
        label: "Service",
        title: "Service",
        kind: "placeholder"
      },
      {
        number: 6,
        id: "finish",
        label: "Finish",
        title: "Finish",
        kind: "placeholder"
      }
    ],
    models: [
      {
        id: "hybrid",
        label: "Hybrid Program",
        manifestLabel: "Hybrid Program",
        description: "Use your own goods where it makes sense, and let Shelton supplement selected items.",
        featured: false
      },
      {
        id: "customer-owned",
        label: "Customer-Owned Goods",
        manifestLabel: "Customer-Owned Goods",
        description: "You own the inventory. Shelton cleans, finishes, packages, and returns it.",
        featured: true
      },
      {
        id: "rental",
        label: "Rental Program",
        manifestLabel: "Rental Program",
        description: "Shelton supplies and manages selected recurring inventory.",
        featured: false
      },
      {
        id: "recommend",
        label: "Not sure - help me choose",
        manifestLabel: "Recommend for me",
        description: "",
        featured: false,
        assistive: true
      }
    ],
    placeholderCopy: "Question UI will be added after pricing logic and content review.",
    manifestFields: [
      { key: "model", label: "Model" },
      { key: "operation", label: "Operation" },
      { key: "goods", label: "Goods" },
      { key: "volumeValue", label: "Volume" },
      { key: "serviceFrequency", label: "Service" },
      { key: "finishing", label: "Finish" }
    ],
    initialState: {
      currentStep: 1,
      model: null,
      operation: null,
      goods: [],
      volumeMethod: null,
      volumeValue: null,
      serviceFrequency: null,
      serviceArea: null,
      finishing: [],
      specialtyNeeds: [],
      estimate: null
    },
    resultShell: {
      heading: "Your planning range",
      fields: [
        { label: "Weekly range", value: "\u2014 to \u2014" },
        { label: "Monthly range", value: "\u2014 to \u2014" },
        { label: "Suggested model", value: "\u2014" }
      ]
    }
  };

  window.SheltonPricingBuilderConfig = Object.freeze(config);
}());
