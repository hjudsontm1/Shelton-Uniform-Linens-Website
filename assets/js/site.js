(() => {
  document.documentElement.classList.add("js-enabled");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const setText = (root, selector, value) => {
    const element = root.querySelector(selector);
    if (element) element.textContent = value;
  };
  const setItems = (root, selector, items, tagName = "li") => {
    const list = root.querySelector(selector);
    if (!list) return;
    const nodes = items.map((item) => {
      const node = document.createElement(tagName);
      node.textContent = item;
      return node;
    });
    list.replaceChildren(...nodes);
  };

  const toggle = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#primary-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!isOpen));
      menu.classList.toggle("is-open", !isOpen);
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
      }
    });
  }

  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  const insightPanels = document.querySelectorAll(".insight-popout");
  insightPanels.forEach((panel) => {
    panel.addEventListener("toggle", () => {
      if (!panel.open) return;
      insightPanels.forEach((otherPanel) => {
        if (otherPanel !== panel) otherPanel.removeAttribute("open");
      });
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    insightPanels.forEach((panel) => panel.removeAttribute("open"));
  });

  const pricingShell = document.querySelector("[data-pricing-shell]");
  if (pricingShell) {
    const pricingButtons = Array.from(pricingShell.querySelectorAll("[data-pricing-option]"));
    const pricingSummary = pricingShell.querySelector("[data-pricing-summary]");
    const renderPricingSummary = () => {
      if (!pricingSummary) return;
      const selections = pricingButtons
        .filter((button) => button.getAttribute("aria-pressed") === "true")
        .map((button) => button.textContent.trim());
      if (!selections.length) {
        const placeholder = document.createElement("span");
        placeholder.textContent = "Selections will appear as you choose options.";
        pricingSummary.replaceChildren(placeholder);
        return;
      }
      const nodes = selections.map((selection) => {
        const node = document.createElement("span");
        node.className = "is-selection";
        node.textContent = selection;
        return node;
      });
      pricingSummary.replaceChildren(...nodes);
    };

    pricingButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const step = button.closest("[data-pricing-step]");
        const isMultiple = step?.dataset.pricingMode === "multiple";
        const isActive = button.getAttribute("aria-pressed") === "true";
        if (!isMultiple && step) {
          step.querySelectorAll("[data-pricing-option]").forEach((otherButton) => {
            otherButton.setAttribute("aria-pressed", "false");
          });
        }
        button.setAttribute("aria-pressed", String(!isActive));
        renderPricingSummary();
      });
    });
    renderPricingSummary();
  }

  const aboutMontage = document.querySelector("[data-about-montage]");
  if (aboutMontage) {
    const aboutTiles = Array.from(aboutMontage.querySelectorAll("[data-about-tile]"));
    const aboutTv = aboutMontage.querySelector("[data-about-tv]");
    const tvScreen = aboutTv?.querySelector("[data-about-tv-screen]");
    const tvPhoto = aboutTv?.querySelector("[data-about-tv-photo]");
    const tvPhotoCanvas = aboutTv?.querySelector("[data-about-tv-photo-canvas]");
    const nextButton = aboutTv?.querySelector("[data-about-tv-next]");
    const tvInstruction = {
      era: "Shelton family archive",
      title: "Click a photo to tune into the story.",
      story: "Turn the dial or choose a square from the wall to read a short family laundry story."
    };
    let activeAboutTile = null;
    let aboutTuneId = 0;
    let aboutAutoplayTimeout = null;
    let aboutTuneRenderTimeout = null;
    let aboutTuneClearTimeout = null;
    let aboutWarmupTimeout = null;
    let aboutMontageInView = true;
    let aboutMontageWasObserved = false;
    const aboutInitialAutoplayDelay = 10000;
    const aboutManualAutoplayDelay = 15000;
    const aboutStoryAutoplayInterval = 14500;
    const aboutTuneRenderDelay = 24;
    const aboutTuneSettleDelay = 170;
    const aboutWarmupDuration = 180;

    const visibleAboutTiles = () => aboutTiles.filter((tile) => window.getComputedStyle(tile).display !== "none");
    const featuredAboutTiles = () => {
      const realTiles = visibleAboutTiles().filter((tile) => tile.dataset.placeholder !== "true");
      return realTiles.length ? realTiles : visibleAboutTiles();
    };
    const aboutTileData = (tile) => {
      const tileImage = tile?.querySelector("img");
      return {
        title: tile?.dataset.title || "Shelton story",
        era: tile?.dataset.era || "Shelton history",
        story: tile?.dataset.story || "A future archive note can live here when this photo is added.",
        photoSrc: tileImage?.currentSrc || tileImage?.getAttribute("src") || ""
      };
    };
    const drawAboutTvPhoto = (tile) => {
      if (!(tvPhotoCanvas instanceof HTMLCanvasElement) || !tvPhoto) return;
      const source = tile?.querySelector("img");
      const context = tvPhotoCanvas.getContext("2d", { alpha: false });
      if (!context) return;
      if (!source || !source.complete || !source.naturalWidth || !source.naturalHeight) {
        context.clearRect(0, 0, tvPhotoCanvas.width, tvPhotoCanvas.height);
        if (source) {
          source.addEventListener("load", () => {
            if (activeAboutTile === tile) drawAboutTvPhoto(tile);
          }, { once: true });
        }
        return;
      }

      const targetWidth = Math.max(1, Math.min(900, Math.round(tvPhoto.clientWidth || 720)));
      const targetHeight = Math.max(1, Math.min(720, Math.round(tvPhoto.clientHeight || 560)));
      if (tvPhotoCanvas.width !== targetWidth) tvPhotoCanvas.width = targetWidth;
      if (tvPhotoCanvas.height !== targetHeight) tvPhotoCanvas.height = targetHeight;

      const scale = Math.max(targetWidth / source.naturalWidth, targetHeight / source.naturalHeight);
      const sourceWidth = targetWidth / scale;
      const sourceHeight = targetHeight / scale;
      const sourceX = (source.naturalWidth - sourceWidth) / 2;
      const sourceY = (source.naturalHeight - sourceHeight) / 2;

      context.filter = "none";
      context.drawImage(source, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, targetWidth, targetHeight);

      // Safari does not reliably apply CanvasRenderingContext2D.filter. Grade the
      // drawn pixels once per channel change so every browser gets the same image.
      const imageData = context.getImageData(0, 0, targetWidth, targetHeight);
      const pixels = imageData.data;
      for (let index = 0; index < pixels.length; index += 4) {
        const luminance = (pixels[index] * 0.299) + (pixels[index + 1] * 0.587) + (pixels[index + 2] * 0.114);
        const softened = ((luminance - 128) * 0.78) + 128;
        const darkened = Math.max(0, Math.min(255, softened * 0.72));
        pixels[index] = Math.min(255, darkened * 1.1);
        pixels[index + 1] = Math.min(255, darkened * 1.02);
        pixels[index + 2] = Math.min(255, darkened * 0.86);
      }
      context.putImageData(imageData, 0, 0);
    };
    const renderAboutTv = (data, tile = null) => {
      if (!aboutTv) return;
      aboutTv.classList.toggle("is-instruction", !tile);
      tvScreen?.classList.toggle("has-photo", Boolean(tile && data.photoSrc));
      drawAboutTvPhoto(tile);
      setText(aboutTv, "[data-about-tv-era]", data.era);
      setText(aboutTv, "[data-about-tv-title]", data.title);
      setText(aboutTv, "[data-about-tv-story]", data.story);
    };
    const setActiveAboutTile = (tile) => {
      if (activeAboutTile && activeAboutTile !== tile) {
        activeAboutTile.classList.remove("is-tuned");
        activeAboutTile.setAttribute("aria-pressed", "false");
      }
      activeAboutTile = tile;
      if (!tile) return;
      tile.classList.add("is-tuned");
      tile.setAttribute("aria-pressed", "true");
    };
    const clearAboutTune = () => {
      window.clearTimeout(aboutTuneRenderTimeout);
      window.clearTimeout(aboutTuneClearTimeout);
      window.clearTimeout(aboutWarmupTimeout);
      tvScreen?.classList.remove("is-tuning", "is-warming-up");
    };
    const tuneAboutTv = (tile, { flicker = true } = {}) => {
      const data = tile ? aboutTileData(tile) : tvInstruction;
      const tuneId = ++aboutTuneId;
      setActiveAboutTile(tile);
      clearAboutTune();
      if (!prefersReducedMotion && flicker && tvScreen) {
        tvScreen.classList.add("is-tuning");
        aboutTuneRenderTimeout = window.setTimeout(() => {
          if (tuneId === aboutTuneId) renderAboutTv(data, tile);
        }, aboutTuneRenderDelay);
        aboutTuneClearTimeout = window.setTimeout(() => {
          if (tuneId === aboutTuneId) tvScreen.classList.remove("is-tuning");
        }, aboutTuneSettleDelay);
      } else {
        renderAboutTv(data, tile);
      }
    };
    const clearAboutAutoplay = () => {
      window.clearTimeout(aboutAutoplayTimeout);
      aboutAutoplayTimeout = null;
    };
    const nextAboutStory = ({ useFeatured = false } = {}) => {
      const pool = useFeatured ? featuredAboutTiles() : visibleAboutTiles();
      if (!pool.length) return;
      const currentIndex = Math.max(0, pool.indexOf(activeAboutTile));
      const nextIndex = activeAboutTile && pool.includes(activeAboutTile) ? (currentIndex + 1) % pool.length : 0;
      tuneAboutTv(pool[nextIndex]);
    };
    const scheduleAboutAutoplay = (delay = aboutInitialAutoplayDelay) => {
      clearAboutAutoplay();
      if (prefersReducedMotion || !aboutMontageInView) return;
      aboutAutoplayTimeout = window.setTimeout(() => {
        nextAboutStory({ useFeatured: true });
        scheduleAboutAutoplay(aboutStoryAutoplayInterval);
      }, delay);
    };

    aboutTiles.forEach((tile) => {
      const data = aboutTileData(tile);
      tile.setAttribute("aria-label", `Tune story: ${data.title}`);
      tile.setAttribute("aria-pressed", "false");
      tile.addEventListener("click", () => {
        tuneAboutTv(tile);
        scheduleAboutAutoplay(aboutManualAutoplayDelay);
      });
    });

    nextButton?.addEventListener("click", () => {
      nextButton.classList.add("is-dialing");
      window.setTimeout(() => nextButton.classList.remove("is-dialing"), 340);
      nextAboutStory();
      scheduleAboutAutoplay(aboutManualAutoplayDelay);
    });

    if (aboutTv && tvScreen) {
      renderAboutTv(tvInstruction, null);
      if (!prefersReducedMotion) {
        tvScreen.classList.add("is-warming-up");
        aboutWarmupTimeout = window.setTimeout(() => tvScreen.classList.remove("is-warming-up"), aboutWarmupDuration);
      }
      scheduleAboutAutoplay(aboutInitialAutoplayDelay);
      if ("IntersectionObserver" in window) {
        const aboutMontageObserver = new IntersectionObserver(([entry]) => {
          const wasInView = aboutMontageInView;
          aboutMontageInView = entry.isIntersecting && entry.intersectionRatio > 0.05;
          if (aboutMontageWasObserved && aboutMontageInView && !wasInView) {
            scheduleAboutAutoplay(aboutManualAutoplayDelay);
          } else if (!aboutMontageInView) {
            clearAboutAutoplay();
            clearAboutTune();
          }
          aboutMontageWasObserved = true;
        }, { threshold: [0, 0.05] });
        aboutMontageObserver.observe(aboutMontage);
      }
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          clearAboutAutoplay();
          clearAboutTune();
          return;
        }
        scheduleAboutAutoplay(aboutManualAutoplayDelay);
      });
    }
  }

  const aboutTagTimeline = document.querySelector("[data-about-tag-timeline]");
  if (aboutTagTimeline) {
    const timelineTags = Array.from(aboutTagTimeline.querySelectorAll("[data-about-timeline-tag]"));
    const detailPanel = aboutTagTimeline.querySelector("#about-shirt-tag-panel");
    const timelineData = (tag) => ({
      chapter: tag.dataset.chapter || "",
      number: tag.dataset.number || "",
      date: tag.dataset.date || "",
      lot: tag.dataset.lot || "",
      title: tag.dataset.title || "",
      story: tag.dataset.story || ""
    });
    const setTimelineDetail = (tag, { animate = true } = {}) => {
      if (!tag || !detailPanel) return;
      const data = timelineData(tag);
      timelineTags.forEach((item) => {
        const isActive = item === tag;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-selected", String(isActive));
      });
      const render = () => {
        setText(aboutTagTimeline, "[data-about-timeline-number]", data.number);
        setText(aboutTagTimeline, "[data-about-timeline-date]", data.date);
        setText(aboutTagTimeline, "[data-about-timeline-chapter]", data.chapter);
        setText(aboutTagTimeline, "[data-about-timeline-lot]", data.lot);
        setText(aboutTagTimeline, "[data-about-timeline-date-inline]", data.date);
        setText(aboutTagTimeline, "[data-about-timeline-title]", data.title);
        setText(aboutTagTimeline, "[data-about-timeline-story]", data.story);
      };
      if (!prefersReducedMotion && animate) {
        detailPanel.classList.add("is-changing");
        window.setTimeout(render, 120);
        window.setTimeout(() => detailPanel.classList.remove("is-changing"), 260);
      } else {
        render();
      }
    };

    timelineTags.forEach((tag, index) => {
      tag.addEventListener("click", () => setTimelineDetail(tag));
      tag.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === "Home"
          ? 0
          : event.key === "End"
            ? timelineTags.length - 1
            : event.key === "ArrowRight"
              ? (index + 1) % timelineTags.length
              : (index - 1 + timelineTags.length) % timelineTags.length;
        timelineTags[nextIndex]?.focus();
        setTimelineDetail(timelineTags[nextIndex]);
      });
    });
    setTimelineDetail(timelineTags.find((tag) => tag.classList.contains("is-active")) || timelineTags[0], { animate: false });
  }

  const storyCarousel = document.querySelector("[data-story-carousel]");
  if (storyCarousel) {
    const slides = Array.from(storyCarousel.querySelectorAll("[data-story-slide]"));
    const dots = Array.from(storyCarousel.querySelectorAll("[data-story-dot]"));
    const previousButton = storyCarousel.querySelector("[data-story-prev]");
    const nextButton = storyCarousel.querySelector("[data-story-next]");
    const counter = storyCarousel.querySelector("[data-story-counter]");
    const caption = storyCarousel.querySelector("[data-story-current-caption]");
    let activeStoryIndex = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
    let isStoryFlipped = false;

    const storyNumber = (value) => String(value).padStart(2, "0");
    const activeStorySlide = () => slides[activeStoryIndex];
    const visibleQueueCount = () => {
      if (window.matchMedia("(max-width: 620px)").matches) return 1;
      if (window.matchMedia("(max-width: 980px)").matches) return 2;
      return 4;
    };
    const storyLabel = (slide, action = "Flip story card for") => {
      const captionText = slide.dataset.storyCaption || slide.dataset.storyTitle || "story photo";
      return `${action} ${captionText}`;
    };
    const setStoryFlipped = (isFlipped) => {
      isStoryFlipped = isFlipped;
      storyCarousel.classList.toggle("is-flipped", isStoryFlipped);
      slides.forEach((slide, index) => {
        const isActive = index === activeStoryIndex;
        slide.classList.toggle("is-flipped", isActive && isStoryFlipped);
        slide.setAttribute("aria-pressed", String(isActive && isStoryFlipped));
        if (isActive) {
          slide.setAttribute("aria-label", storyLabel(slide, isStoryFlipped ? "Flip back to photo for" : "Flip story card for"));
        }
      });
    };
    const renderStorySlide = (index) => {
      if (!slides.length) return;
      activeStoryIndex = (index + slides.length) % slides.length;
      const maxQueue = Math.min(visibleQueueCount(), Math.floor((slides.length - 1) / 2));
      slides.forEach((slide, slideIndex) => {
        const rawOffset = (slideIndex - activeStoryIndex + slides.length) % slides.length;
        const signedOffset = rawOffset > slides.length / 2 ? rawOffset - slides.length : rawOffset;
        const distance = Math.abs(signedOffset);
        const isActive = signedOffset === 0;
        const isQueued = distance > 0 && distance <= maxQueue;
        slide.classList.toggle("is-active", isActive);
        slide.classList.toggle("is-queued", isQueued);
        for (let queueIndex = 1; queueIndex <= 4; queueIndex += 1) {
          slide.classList.toggle(`is-prev-${queueIndex}`, signedOffset === -queueIndex && isQueued);
          slide.classList.toggle(`is-next-${queueIndex}`, signedOffset === queueIndex && isQueued);
        }
        slide.setAttribute("aria-hidden", String(!isActive && !isQueued));
        slide.tabIndex = isActive || isQueued ? 0 : -1;
        if (!isActive) slide.setAttribute("aria-label", storyLabel(slide, "Show"));
      });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === activeStoryIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
      if (counter) counter.textContent = `${storyNumber(activeStoryIndex + 1)} / ${storyNumber(slides.length)}`;
      if (caption) caption.textContent = activeStorySlide()?.dataset.storyCaption || "";
      setStoryFlipped(false);
    };

    slides.forEach((slide, index) => {
      slide.addEventListener("click", () => {
        if (index === activeStoryIndex) {
          setStoryFlipped(!isStoryFlipped);
        } else {
          renderStorySlide(index);
        }
      });
      slide.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          renderStorySlide(activeStoryIndex + 1);
        }
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          renderStorySlide(activeStoryIndex - 1);
        }
      });
    });
    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => renderStorySlide(index));
    });
    if (previousButton) previousButton.addEventListener("click", () => renderStorySlide(activeStoryIndex - 1));
    if (nextButton) nextButton.addEventListener("click", () => renderStorySlide(activeStoryIndex + 1));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setStoryFlipped(false);
    });
    window.addEventListener("resize", () => renderStorySlide(activeStoryIndex));
    renderStorySlide(activeStoryIndex);
  }

  const qualityCinema = document.querySelector("[data-quality-cinema]");
  if (qualityCinema) {
    const qualityStages = [
      {
        count: "01 / 04",
        title: "They come in tired.",
        copy: "Chef coats, linens, and towels arrive with different soil, wear, and return needs."
      },
      {
        count: "02 / 04",
        title: "Cleaned for the item, not just the load.",
        copy: "Soil, stains, chemistry, cycle choice, and handling all affect what your team receives back."
      },
      {
        count: "03 / 04",
        title: "Finished for how your team uses it.",
        copy: "Coats, linens, and towels are finished according to how they need to return."
      },
      {
        count: "04 / 04",
        title: "Clean goods. Longer life. Fewer headaches.",
        copy: "Chef coats return hung in poly, linens return stacked in a linen cart, and towels return packed in a bag."
      }
    ];
    const countNode = qualityCinema.querySelector("[data-quality-cinema-count]");
    const titleNode = qualityCinema.querySelector("[data-quality-cinema-title]");
    const copyNode = qualityCinema.querySelector("[data-quality-cinema-copy]");
    const stepNodes = Array.from(qualityCinema.querySelectorAll("[data-quality-cinema-step]"));
    let activeQualityStage = -1;
    let qualityFrame = null;

    const clamp = (value, min = 0, max = 1) => Math.min(Math.max(value, min), max);
    const renderQualityCinema = (progress) => {
      const cleanProgress = clamp((progress - 0.18) / 0.34);
      const finishProgress = clamp((progress - 0.48) / 0.34);
      const stageIndex = Math.min(qualityStages.length - 1, Math.floor(clamp(progress) * qualityStages.length));
      qualityCinema.style.setProperty("--quality-progress", progress.toFixed(3));
      qualityCinema.style.setProperty("--quality-clean-progress", cleanProgress.toFixed(3));
      qualityCinema.style.setProperty("--quality-finish-progress", finishProgress.toFixed(3));
      qualityCinema.dataset.qualityStage = String(stageIndex + 1);
      if (stageIndex === activeQualityStage) return;
      activeQualityStage = stageIndex;
      const stage = qualityStages[stageIndex];
      if (countNode) countNode.textContent = stage.count;
      if (titleNode) titleNode.textContent = stage.title;
      if (copyNode) copyNode.textContent = stage.copy;
      stepNodes.forEach((node, index) => node.classList.toggle("is-active", index === stageIndex));
    };
    const updateQualityCinema = () => {
      qualityFrame = null;
      if (prefersReducedMotion) {
        renderQualityCinema(1);
        return;
      }
      const rect = qualityCinema.getBoundingClientRect();
      const scrollDistance = Math.max(1, rect.height - window.innerHeight);
      const progress = clamp(-rect.top / scrollDistance);
      renderQualityCinema(progress);
    };
    const requestQualityUpdate = () => {
      if (qualityFrame) return;
      qualityFrame = window.requestAnimationFrame(updateQualityCinema);
    };
    window.addEventListener("scroll", requestQualityUpdate, { passive: true });
    window.addEventListener("resize", requestQualityUpdate);
    updateQualityCinema();
  }

  const programProfiles = {
    hotels: {
      label: "Hotels & Boutique Stays",
      summary: "A reliable linen program for hospitality accounts of every size, from boutique stays to larger properties.",
      items: ["Linens", "Towels", "Bath mats", "Robes", "Blankets"],
      rhythm: "Pickup and delivery built around your schedule, from once weekly to daily service.",
      helps: "We help hospitality teams keep linens cleaner, brighter, and more consistent over time, reducing replacement headaches and keeping goods ready for the next stay.",
      finishing: "Folded, bundled, and delivered back in linen carts.",
      flow: ["Pickup cadence", "Account sorting", "Finishing standards", "Route-ready return"],
      cta: "Build a hotel program",
      href: "quote.html?program=hotels",
      secondaryCta: "Learn more about hospitality laundry →",
      secondaryHref: "services.html"
    },
    str: {
      label: "Short-Term Rentals / Property Managers",
      summary: "A bulk laundry program for STR operators and property managers who need clean guest linens moving between turns without tying up staff time.",
      items: ["Sheets", "Towels", "Bath mats", "Duvet covers", "Blankets"],
      rhythm: "Bulk pickup and delivery to a central location, built around turnover volume, property schedules, and seasonal demand.",
      helps: "We take laundry off the turnover checklist, helping your team avoid on-site washing, laundromat runs, and last-minute linen shortages between guests.",
      finishing: "Folded, pressed, bundled, labeled, and returned by property, item type, or account preference.",
      flow: ["Checkout pickup", "Property labeling", "Guest-ready folds", "Cleaner-friendly return"],
      cta: "Build an STR program",
      href: "quote.html?program=str",
      secondaryCta: "Learn more about STR laundry programs →",
      secondaryHref: "services.html"
    },
    spa: {
      label: "Spas, Massage & Wellness",
      summary: "A soft-goods laundry program for spas, massage studios, wellness clinics, and treatment-based businesses.",
      items: ["Towels", "Sheets", "Robes", "Blankets", "Face cradle covers"],
      rhythm: "Recurring pickup and delivery built around appointment volume, room turnover, and storage needs.",
      helps: "We help keep your team stocked with clean, spotless, consistent goods — including pressed sheets — so staff is not spending time washing towels, folding sheets, or managing laundry between appointments.",
      finishing: "Folded, pressed, bundled, sorted by item type, and returned ready to use.",
      flow: ["Treatment-room volume", "Softness standards", "Use-based bundles", "Stocked return"],
      cta: "Build a spa program",
      href: "quote.html?program=spa",
      secondaryCta: "Learn more about spa & wellness laundry →",
      secondaryHref: "services.html"
    },
    fitness: {
      label: "Gyms, Yoga & Fitness Studios",
      summary: "A towel heavy laundry program for gyms, yoga studios, Pilates studios, fitness clubs, and training facilities.",
      items: ["Towels", "Hand towels"],
      rhythm: "Recurring pickup and delivery built around class volume, member usage, storage space, and weekly towel demand.",
      helps: "We keep clean, odorless towels moving through your studio or facility so staff is not constantly washing, drying, folding, and restocking between classes or peak hours.",
      finishing: "Folded, bundled, and returned ready to stock.",
      flow: ["Usage planning", "Frequent pickup", "Towel bundles", "Storage-aware return"],
      cta: "Build a fitness program",
      href: "quote.html?program=fitness",
      secondaryCta: "Learn more about fitness towel service →",
      secondaryHref: "services.html"
    },
    events: {
      label: "Event Linen Programs",
      summary: "A specialty cleaning program for event companies, venues, convention centers, and planners handling presentation goods, colored linens, and tight return windows.",
      items: ["Tablecloths", "Napkins", "Runners", "Skirting", "Chair covers", "Specialty event goods"],
      rhythm: "Pickup and delivery built around event schedules, return windows, seasonal volume, and production needs.",
      helps: "We provide high quality cleaning that helps event linens stay presentation ready longer. Our cleaning programs remove stains while staying gentle on fabric and color, and our specialty mold removal programs help reduce waste and replacement costs on items of all color.",
      finishing: "Pressed, hung or folded, sorted by item type, and returned ready for your team.",
      flow: ["Event deadline", "Specialty cleaning", "Order sorting", "Presentation-ready return"],
      cta: "Build an event linen program",
      href: "quote.html?program=events",
      secondaryCta: "Learn more about event linen care →",
      secondaryHref: "services.html"
    },
    restaurants: {
      label: "Restaurants & Food Service",
      summary: "A commercial laundry program for restaurants, catering teams, and kitchens that need clean, professional goods on a recurring schedule.",
      items: ["Chef coats", "Aprons", "Napkins", "Bar towels", "Table linens"],
      rhythm: "Recurring pickup and delivery built around weekly volume, service schedule, kitchen usage, and dining room needs.",
      helps: "We help keep kitchen and dining goods clean, sharp, and ready for service while handling food stains, grease, heavy soil, and repeated use.",
      finishing: "Pressed, folded, bundled, and returned in linen carts or bags, ready for your kitchen or dining room use.",
      flow: ["Recurring service", "Stain-aware wash", "Dining-room finish", "Consistent return"],
      cta: "Build a restaurant program",
      href: "quote.html?program=restaurants",
      secondaryCta: "Learn more about restaurant laundry →",
      secondaryHref: "services.html"
    },
    uniforms: {
      label: "Uniforms & Casino Programs",
      summary: "A uniform cleaning program for casinos, hospitality teams, security, valet services, and staff accounts that need workwear returned clean and organized.",
      items: ["Uniform shirts", "Chef coats", "Casino uniforms", "Workwear", "Jackets"],
      rhythm: "Recurring pickup and delivery built around staff count, weekly usage, change-outs, and return needs.",
      helps: "We help keep uniforms looking professional longer, with cleaning and finishing built around repeated wear, staff presentation, and organized return.",
      finishing: "High-quality presentation, packaged according to your needs.",
      flow: ["Staff count", "Garment grouping", "Hung or folded finish", "Route-ready return"],
      cta: "Build a uniform program",
      href: "quote.html?program=uniforms",
      secondaryCta: "Learn more about uniform programs →",
      secondaryHref: "services.html"
    },
    wholesale: {
      label: "Specialty Commercial Accounts",
      summary: "A flexible cleaning program for theaters, religious organizations, clubs, and commercial accounts with unique fabric, schedule, or presentation needs.",
      items: ["Costumes", "Choir robes", "Table linens", "Uniforms", "Specialty garments"],
      rhythm: "Scheduled or as-needed pickup and delivery built around performances, services, events, banquets, and seasonal needs.",
      helps: "We help specialty accounts clean, finish, and maintain items that do not fit neatly into a standard laundry program, with careful handling based on how each piece is used.",
      finishing: "Finished to the highest quality and packaged by your needs.",
      flow: ["Unique goods", "Careful handling", "Presentation finish", "Packaged return"],
      cta: "Discuss specialty account needs",
      href: "quote.html?program=wholesale",
      secondaryCta: "Learn more about specialty accounts →",
      secondaryHref: "services.html"
    }
  };

  const programButtons = document.querySelectorAll("[data-program-key]");
  const programPanel = document.querySelector("#program-detail-panel");
  let programTimer;
  const renderProgram = (key, shouldScroll = false) => {
    const profile = programProfiles[key] || programProfiles.hotels;
    if (!programPanel) return;

    const commit = () => {
      programButtons.forEach((button) => {
        const isActive = button.dataset.programKey === key;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-expanded", String(isActive));
      });
      setText(programPanel, "[data-program-field='title']", profile.label);
      setText(programPanel, "[data-program-field='summary']", profile.summary);
      setText(programPanel, "[data-program-field='rhythm']", profile.rhythm);
      setText(programPanel, "[data-program-field='helps']", profile.helps);
      setText(programPanel, "[data-program-field='finishing']", profile.finishing);
      setItems(programPanel, "[data-program-list='items']", profile.items);

      const cta = programPanel.querySelector("[data-program-field='href']");
      if (cta) {
        cta.textContent = profile.cta;
        cta.href = profile.href;
      }

      const secondaryCta = programPanel.querySelector("[data-program-field='secondaryHref']");
      if (secondaryCta) {
        const hasSecondaryCta = Boolean(profile.secondaryCta && profile.secondaryHref);
        secondaryCta.hidden = !hasSecondaryCta;
        secondaryCta.textContent = profile.secondaryCta || "";
        if (hasSecondaryCta) {
          secondaryCta.href = profile.secondaryHref;
        } else {
          secondaryCta.removeAttribute("href");
        }
      }

      programPanel.classList.remove("is-updating");
      programPanel.setAttribute("aria-busy", "false");
      if (shouldScroll && window.matchMedia("(max-width: 700px)").matches) {
        programPanel.scrollIntoView({ block: "start", behavior: prefersReducedMotion ? "auto" : "smooth" });
      }
    };

    window.clearTimeout(programTimer);
    programPanel.setAttribute("aria-busy", "true");
    if (prefersReducedMotion) {
      commit();
    } else {
      programPanel.classList.add("is-updating");
      programTimer = window.setTimeout(commit, 120);
    }
  };

  programButtons.forEach((button) => {
    button.addEventListener("click", () => renderProgram(button.dataset.programKey, true));
  });

  const params = new URLSearchParams(window.location.search);
  const industry = params.get("industry");
  const service = params.get("service");
  const request = params.get("request");
  const program = params.get("program");
  const industrySelect = document.querySelector("#industry-select");
  const serviceSelect = document.querySelector("#service-select");
  const messageField = document.querySelector("#message-field");
  const programQuoteMap = {
    hotels: {
      industry: "hotel",
      service: "linen",
      message: "I am interested in building a hotel or boutique stay linen program."
    },
    str: {
      industry: "str",
      service: "linen",
      message: "I am interested in building a short-term rental or property management laundry program."
    },
    spa: {
      industry: "spa",
      service: "towels",
      message: "I am interested in building a spa, massage, or wellness laundry program."
    },
    fitness: {
      industry: "gym",
      service: "towels",
      message: "I am interested in building a gym, yoga, or fitness towel program."
    },
    events: {
      industry: "event",
      service: "event",
      message: "I am interested in building an event linen program for tablecloths, napkins, runners, or specialty event goods."
    },
    restaurants: {
      industry: "restaurant",
      service: "event",
      message: "I am interested in building a restaurant or food service laundry program for napkins, aprons, bar towels, dining-room goods, or uniforms."
    },
    uniforms: {
      industry: "uniform",
      service: "uniforms",
      message: "I am interested in building a uniform cleaning and finishing program."
    },
    wholesale: {
      industry: "wholesale",
      service: "wholesale",
      message: "I am interested in discussing wholesale laundry or finishing support."
    }
  };
  const programQuote = programQuoteMap[program];
  if (programQuote) {
    if (industrySelect) industrySelect.value = programQuote.industry;
    if (serviceSelect) serviceSelect.value = programQuote.service;
    if (messageField && !messageField.value) messageField.value = programQuote.message;
  }
  if (industrySelect && industry) industrySelect.value = industry;
  if (serviceSelect && service) serviceSelect.value = service;
  if (messageField && request === "plant-tour") {
    messageField.value = "I would like to schedule a plant tour and discuss a commercial laundry account.";
  }

  const form = document.querySelector("#quote-form");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const status = form.querySelector(".form-status");
    const submit = form.querySelector("button[type='submit']");
    if (submit) submit.disabled = true;
    if (status) status.textContent = "Sending quote request...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });
      if (!response.ok) throw new Error("Request failed");
      window.location.href = "thank-you.html";
    } catch {
      if (status) status.textContent = "We could not send the request just now. Please try again.";
      if (submit) submit.disabled = false;
    }
  });
})();
