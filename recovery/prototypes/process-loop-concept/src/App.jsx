import { useEffect } from "react";

const STAGES = [
  {
    id: "pickup",
    number: "01",
    title: "Pickup",
    summary: "A Shelton route van arrives at the service handoff, collects the load and begins the cycle.",
    care: "The load stays contained from handoff onward.",
  },
  {
    id: "sort",
    number: "02",
    title: "Sort",
    summary: "Items separate into whites and lights or colors and darks before washing.",
    care: "Each load follows its correct care path.",
  },
  {
    id: "clean",
    number: "03",
    title: "Clean",
    summary: "The Yamamoto washer fills, turns and drains through the selected wash cycle.",
    care: "Time, temperature and chemistry stay controlled.",
  },
  {
    id: "finish",
    number: "04",
    title: "Finish",
    summary: "Sheets move through the Compact ironer for a smooth, consistent finish.",
    care: "Heat and pressure are applied evenly.",
  },
  {
    id: "inspect",
    number: "05",
    title: "Inspect",
    summary: "A team member checks cleanliness, condition, finish and sorting before packing.",
    care: "Only clean, correctly finished goods move forward.",
  },
  {
    id: "package",
    number: "06",
    title: "Package",
    summary: "Clean goods are grouped and loaded into a cart for the correct account.",
    care: "Every load stays orderly and account-ready.",
  },
  {
    id: "return",
    number: "07",
    title: "Return",
    summary: "The route van brings the clean cart back and completes the cycle.",
    care: "Goods arrive organized and ready to use.",
  },
];

const ASSET_BASE = document.getElementById("root")?.dataset.assetBase || "/assets";
const assetPath = (fileName) => `${ASSET_BASE}/${fileName}`;

function StageSection({ stage, tone, scene }) {
  return (
    <section
      id={stage.id}
      className={`stage stage--${stage.id} stage--${tone}`}
      aria-labelledby={`${stage.id}-title`}
    >
      <img
        className="stage-reference-full"
        src={assetPath(`reference-${stage.id}-full.png`)}
        alt=""
        aria-hidden="true"
      />
      <div className="stage-copy">
        <p className="stage-number">{stage.number}</p>
        <h2 id={`${stage.id}-title`}>{stage.title}</h2>
        <p className="stage-checkpoint">Checkpoint {stage.number}</p>
        <div className="stage-info">
          <p className="stage-summary">{stage.summary}</p>
          <div className="stage-care">
            <p className="stage-care__label">Care standard</p>
            <p className="stage-care__value">{stage.care}</p>
          </div>
        </div>
      </div>
      <div className="stage-media">
        {stage.id !== "return" && <span className="checkpoint-node" aria-hidden="true" />}
        {scene}
      </div>
    </section>
  );
}

function VanScene({ mode = "pickup" }) {
  return (
    <div className={`scene scene--van scene--${mode}`}>
      <img
        className="scene-image"
        src={assetPath("route-van-white-v1.png")}
        alt={mode === "pickup" ? "A white route van arriving beside clean linen carts" : "A white route van returning clean linens"}
      />
    </div>
  );
}

function SortScene() {
  return (
    <div className="scene scene--sort">
      <img className="scene-image" src={assetPath("sort-bins-photo-v1.png")} alt="White and navy sorting bins beside a commercial laundry conveyor" />
    </div>
  );
}

function WashScene() {
  return (
    <div className="scene scene--wash">
      <img className="scene-image" src={assetPath("washer-clean-cycle-v1.png")} alt="Three commercial washers with the center machine running a white-linen cycle" />
    </div>
  );
}

function FinishScene() {
  return (
    <div className="scene scene--finish">
      <img className="scene-image" src={assetPath("ironer-sheet-feed-v1.png")} alt="A commercial flatwork ironer feeding a sheet from wrinkled to smoothly pressed" />
    </div>
  );
}

function InspectScene() {
  return (
    <div className="scene scene--inspect">
      <img className="scene-image" src={assetPath("inspection-placeholder.png")} alt="A team member inspecting a finished white sheet" />
    </div>
  );
}

function PackageScene() {
  return (
    <div className="scene scene--package">
      <img className="scene-image" src={assetPath("package-cart-photo-v1.png")} alt="A team member loading folded white linens into a clean cart" />
    </div>
  );
}

export function App() {
  const embedded = document.getElementById("root")?.hasAttribute("data-process-embed");
  const BoardTag = embedded ? "div" : "main";

  useEffect(() => {
    const initialStage = window.location.hash.slice(1);
    if (!STAGES.some(({ id }) => id === initialStage)) return;
    window.requestAnimationFrame(() => {
      document.getElementById(initialStage)?.scrollIntoView({ behavior: "auto", block: "start" });
    });
  }, []);

  return (
    <div className="prototype-shell">
      {!embedded && <header className="site-header">
        <a className="brand-link" href="#top" aria-label="Shelton Linen and Uniform Services Process overview">
          <img src={assetPath("shelton-logo-dark.svg")} alt="Shelton Linen and Uniform Services" />
        </a>
        <nav className="header-nav" aria-label="Concept navigation">
          <a href="#top">Overview</a>
          <a href="#pickup">The route</a>
        </nav>
      </header>}

      <BoardTag className="process-board">
        <section id="top" className="loop-hero" aria-labelledby="hero-title">
          <img
            className="hero-reference-media"
            src={assetPath("reference-hero-full.png")}
            alt=""
            aria-hidden="true"
          />
          <div className="loop-hero-copy">
            <h1 id="hero-title">The<br />Shelton<br />Process</h1>
            <p>One route. Seven checkpoints.<br />A cycle you can count on.</p>
            <a className="hero-start" href="#pickup" aria-label="Continue to pickup">↓</a>
          </div>

          <div className="hero-wheel" aria-label="Seven process checkpoints">
            <div className="wheel-rings" aria-hidden="true">
              <div className="wheel-core">
                <img src={assetPath("washer-drum-sheet-v1.png")} alt="" />
              </div>
            </div>
            {STAGES.map((stage, index) => (
              <div key={stage.id} className={`orbit-link orbit-link--${index + 1}`}>
                <span>{stage.number}</span>
                {stage.title}
              </div>
            ))}
          </div>
          <span className="hero-spine" aria-hidden="true" />
        </section>

        <div className="journey" aria-label="The seven-step Shelton process">
          <StageSection stage={STAGES[0]} tone="cream" scene={<VanScene />} />
          <StageSection stage={STAGES[1]} tone="navy" scene={<SortScene />} />
          <StageSection stage={STAGES[2]} tone="cream" scene={<WashScene />} />
          <StageSection stage={STAGES[3]} tone="navy" scene={<FinishScene />} />
          <StageSection stage={STAGES[4]} tone="cream" scene={<InspectScene />} />
          <StageSection stage={STAGES[5]} tone="navy" scene={<PackageScene />} />
          <StageSection stage={STAGES[6]} tone="cream" scene={<VanScene mode="return" />} />
        </div>
      </BoardTag>

      {!embedded && <footer className="concept-footer">
        <img src={assetPath("shelton-logo-dark.svg")} alt="Shelton Linen and Uniform Services" />
        <p>Keeps your operation moving. Keeps your standards high.</p>
        <a href="https://sheltonlinen.com/request-a-quote">Request a quote</a>
      </footer>}
    </div>
  );
}
