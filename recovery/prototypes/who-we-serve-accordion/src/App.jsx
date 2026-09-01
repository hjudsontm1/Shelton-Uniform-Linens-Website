import { useState } from "react";
import { ArrowRight } from "@phosphor-icons/react";

const industryFamilies = [
  {
    key: "hotels",
    number: "01",
    title: "Hotels & Boutique Stays",
    audience: "Hotels, resorts & boutique properties",
    description:
      "Linens and towels cleaned and pressed to the highest standard and care",
    cta: "Explore hotels",
    href: "https://sheltonlinen.com/industries.html#hotels",
    image: "/assets/images/industry-hotel.jpg",
    imagePosition: "52% center",
    longTitle: true,
  },
  {
    key: "rentals",
    number: "02",
    title: "Short-Term Rentals",
    audience: "Short-term rentals & property managers",
    description:
      "Bringing hotel level pricing and quality to the short term rental market.",
    cta: "Explore rentals",
    href: "https://sheltonlinen.com/industries.html#short-term-rentals",
    image: "/assets/images/industry-str.jpg",
    imagePosition: "55% center",
    longTitle: true,
  },
  {
    key: "wellness",
    number: "03",
    title: "Wellness",
    audience: "Gyms, fitness centers, spas & wellness",
    description:
      "Towels, robes, and treatment linens returned pressed, spotless, and ready for daily demand",
    cta: "Explore wellness",
    href: "https://sheltonlinen.com/industries.html#gyms",
    image: "/assets/images/industry-spa.jpg",
    imagePosition: "61% center",
  },
  {
    key: "events",
    number: "04",
    title: "Events",
    audience: "Event companies, venues, and wineries",
    description:
      "Professionally cleaned and pressed linens returned ready for big events",
    cta: "Explore events",
    href: "https://sheltonlinen.com/industries.html#events",
    image: "/assets/images/industry-event.jpg",
    imagePosition: "60% center",
  },
  {
    key: "food-service",
    number: "05",
    title: "Food Service",
    audience: "Restaurants, caterers, and food service operations",
    description:
      "Chef wear, dining linens, and kitchen textiles professionally cleaned, pressed, and ready for service.",
    cta: "Explore food service",
    href: "https://sheltonlinen.com/industries.html#restaurants",
    image: "/assets/images/industry-food-service.png",
    imagePosition: "56% center",
  },
  {
    key: "workforce",
    number: "06",
    title: "Workforce",
    audience: "Uniform accounts, casinos & entertainment",
    description:
      "Uniforms professionally cleaned and pressed to match the standards you provide.",
    cta: "Explore workforce",
    href: "https://sheltonlinen.com/industries.html#uniforms",
    image: "/assets/images/industry-uniform.jpg",
    imagePosition: "65% center",
  },
];

function IndustryPanel({ family, index, isActive, onSelect, onKeyDown }) {
  const panelId = `industry-panel-${family.key}`;
  const triggerId = `industry-trigger-${family.key}`;

  return (
    <article
      className={`industry-panel${isActive ? " is-active" : ""}${family.longTitle ? " has-long-title" : ""}`}
      data-family={family.key}
    >
      <img
        className="industry-panel__image"
        src={family.image}
        alt=""
        aria-hidden="true"
        loading={index === 0 ? "eager" : "lazy"}
        style={{ objectPosition: family.imagePosition }}
      />
      <span className="industry-panel__shade" aria-hidden="true" />

      <button
        className="industry-panel__trigger"
        id={triggerId}
        type="button"
        aria-expanded={isActive}
        aria-controls={panelId}
        aria-label={`${isActive ? "Selected" : "Explore"} ${family.title}`}
        onClick={() => onSelect(family.key)}
        onKeyDown={(event) => onKeyDown(event, index)}
      >
        <span className="industry-panel__rail-title" aria-hidden="true">
          {family.title}
        </span>
        <span className="industry-panel__number" aria-hidden="true">
          {family.number}
        </span>
      </button>

      {isActive && (
        <div
          className="industry-panel__details"
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          aria-live="polite"
        >
          <h2>{family.title}</h2>
          <p className="industry-panel__audience">{family.audience}</p>
          <p className="industry-panel__description">{family.description}</p>
          <a className="industry-panel__link" href={family.href}>
            <span>{family.cta}</span>
            <ArrowRight weight="light" aria-hidden="true" />
          </a>
        </div>
      )}
    </article>
  );
}

export function App() {
  const [activeFamily, setActiveFamily] = useState("hotels");

  function handlePanelKeyDown(event, index) {
    const supportedKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
    if (!supportedKeys.includes(event.key)) return;

    event.preventDefault();

    let nextIndex = index;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = industryFamilies.length - 1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (index + 1) % industryFamilies.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (index - 1 + industryFamilies.length) % industryFamilies.length;
    }

    const nextFamily = industryFamilies[nextIndex];
    setActiveFamily(nextFamily.key);
    requestAnimationFrame(() => {
      document.getElementById(`industry-trigger-${nextFamily.key}`)?.focus();
    });
  }

  return (
    <main className="prototype-page">
      <section className="industry-explorer" aria-label="Who Shelton serves">
        <div
          className="industry-accordion"
          role="group"
          aria-label="Shelton industry families"
          data-testid="industry-accordion"
        >
          {industryFamilies.map((family, index) => (
            <IndustryPanel
              key={family.key}
              family={family}
              index={index}
              isActive={activeFamily === family.key}
              onSelect={setActiveFamily}
              onKeyDown={handlePanelKeyDown}
            />
          ))}
        </div>
      </section>

      <section className="program-models" aria-label="Choose a service model">
        <a className="program-model" href="/customer-owned-goods.html">
          <span className="program-model__copy">
            <strong>Customer-Owned Goods</strong>
            <small>You own the linens or uniforms. Shelton cleans, finishes, packages, and returns them.</small>
          </span>
          <span className="program-model__icon" aria-hidden="true">
            <ArrowRight weight="light" />
          </span>
        </a>

        <a className="program-model" href="/rental-program.html">
          <span className="program-model__copy">
            <strong>Rental Program</strong>
            <small>Shelton supplies, cleans, and manages the recurring inventory your operation needs.</small>
          </span>
          <span className="program-model__icon" aria-hidden="true">
            <ArrowRight weight="light" />
          </span>
        </a>

        <p className="program-models__hybrid">
          <a href="https://sheltonlinen.com/quote.html?program=hybrid">
            <span>Need both? Ask about a hybrid program built around your operation</span>
            <ArrowRight weight="light" aria-hidden="true" />
          </a>
        </p>
      </section>
    </main>
  );
}
