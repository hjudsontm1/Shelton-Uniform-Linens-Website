(function () {
  const hero = document.querySelector('[data-route-hero]');
  const journey = document.querySelector('.process-journey');
  const stages = Array.from(document.querySelectorAll('[data-route-stage]'));
  const tracker = document.querySelector('[data-route-tracker]');
  const trackerLinks = tracker ? Array.from(tracker.querySelectorAll('a[href^="#"]')) : [];
  const trackerProgress = document.querySelector('[data-route-progress]');
  const finishStage = document.querySelector('[data-finish-stage]');
  const finishVisual = finishStage ? finishStage.querySelector('.process-visual--finish') : null;
  const finishImage = document.querySelector('[data-finish-image]');
  const finishChoices = Array.from(document.querySelectorAll('[data-finish-choice]'));
  const finishStatus = document.querySelector('[data-finish-status]');
  const finishCaption = document.querySelector('[data-finish-caption]');
  const finishMark = document.querySelector('[data-finish-mark]');
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  const finishContent = {
    pressed: {
      image: 'assets/images/process-ironer.jpg',
      alt: 'Pressed commercial linen arranged beside professional finishing equipment',
      mark: 'PRESS',
      status: 'Pressed for presentation-sensitive sheets, table linen, uniforms, and event goods.',
      caption: 'Pressed and presentation ready'
    },
    folded: {
      image: 'assets/images/process-folding.jpg',
      alt: 'Consistent stacks of professionally folded commercial towels',
      mark: 'FOLD',
      status: 'Folded into consistent stacks for linen carts, shelves, storage, and fast restocking.',
      caption: 'Folded for organized restocking'
    },
    hung: {
      image: 'assets/images/industry-uniform.jpg',
      alt: 'Finished uniforms and chef coats arranged on a professional garment rail',
      mark: 'HANG',
      status: 'Hung for uniforms, chef coats, and specialty garments that should return ready for the team.',
      caption: 'Hung and protected for return'
    },
    bundled: {
      image: 'assets/images/history/shelton-cleaners-poly-garments-web.jpeg',
      alt: 'Finished garments protected in Shelton packaging on a return rail',
      mark: 'BUNDLE',
      status: 'Bundled and labeled by item type, property, department, or account preference.',
      caption: 'Bundled, labeled, and staged'
    }
  };

  let activeStage = null;
  let scrollFrame = null;
  let finishSwap = null;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function setActiveStage(stage) {
    if (!stage || stage === activeStage) return;

    activeStage = stage;
    const activeIndex = Number(stage.dataset.routeStage || 0);

    stages.forEach((item) => item.classList.toggle('is-active', item === stage));
    trackerLinks.forEach((link, index) => {
      if (index === activeIndex) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });

    if (trackerProgress) {
      trackerProgress.style.width = `${((activeIndex + 1) / stages.length) * 100}%`;
    }

    if (tracker && window.innerWidth < 860) {
      const activeLink = trackerLinks[activeIndex];
      if (activeLink) {
        tracker.scrollTo({
          left: activeLink.offsetLeft - ((tracker.clientWidth - activeLink.offsetWidth) / 2),
          behavior: motionQuery.matches ? 'auto' : 'smooth'
        });
      }
    }
  }

  function updateScrollState() {
    scrollFrame = null;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

    if (hero) {
      const rect = hero.getBoundingClientRect();
      const progress = motionQuery.matches ? 0 : clamp(-rect.top / Math.max(rect.height * 0.78, 1), 0, 1);
      hero.style.setProperty('--hero-progress', progress.toFixed(4));
    }

    if (journey) {
      const rect = journey.getBoundingClientRect();
      const distance = Math.max(rect.height - (viewportHeight * 0.35), 1);
      const progress = clamp((viewportHeight * 0.48 - rect.top) / distance, 0, 1);
      journey.style.setProperty('--journey-progress', progress.toFixed(4));
    }

    stages.forEach((stage) => {
      const rect = stage.getBoundingClientRect();
      const travel = Math.max(rect.height + (viewportHeight * 0.28), 1);
      const progress = motionQuery.matches
        ? (rect.top < viewportHeight && rect.bottom > 0 ? 0.55 : 0)
        : clamp((viewportHeight * 0.78 - rect.top) / travel, 0, 1);
      stage.style.setProperty('--stage-progress', progress.toFixed(4));
    });
  }

  function requestScrollState() {
    if (scrollFrame !== null) return;
    scrollFrame = window.requestAnimationFrame(updateScrollState);
  }

  function updateFinish(mode) {
    const content = finishContent[mode];
    const activeChoice = finishChoices.find((choice) => choice.dataset.finishChoice === mode);
    if (!finishStage || !content || !activeChoice) return;

    finishStage.dataset.finishMode = mode;
    finishChoices.forEach((choice) => {
      const selected = choice === activeChoice;
      choice.classList.toggle('is-active', selected);
      choice.setAttribute('aria-pressed', String(selected));
    });

    if (finishStatus) finishStatus.textContent = content.status;
    if (finishCaption) finishCaption.textContent = content.caption;
    if (finishMark) finishMark.textContent = content.mark;

    if (!finishImage || finishImage.getAttribute('src') === content.image) return;

    window.clearTimeout(finishSwap);
    if (finishVisual && !motionQuery.matches) finishVisual.classList.add('is-changing');

    const commitImage = function () {
      finishImage.src = content.image;
      finishImage.alt = content.alt;

      const settle = function () {
        if (finishVisual) finishVisual.classList.remove('is-changing');
      };

      if (finishImage.complete) settle();
      else finishImage.addEventListener('load', settle, { once: true });
    };

    if (motionQuery.matches) commitImage();
    else finishSwap = window.setTimeout(commitImage, 140);
  }

  if ('IntersectionObserver' in window && stages.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in-view');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    const activeObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (visible[0]) setActiveStage(visible[0].target);
    }, { rootMargin: '-24% 0px -48% 0px', threshold: [0.05, 0.18, 0.38, 0.62] });

    stages.forEach((stage) => {
      revealObserver.observe(stage);
      activeObserver.observe(stage);
    });
  } else {
    stages.forEach((stage) => stage.classList.add('is-in-view'));
  }

  trackerLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({
        behavior: motionQuery.matches ? 'auto' : 'smooth',
        block: 'start'
      });
      window.history.replaceState(null, '', link.getAttribute('href'));
    });
  });

  finishChoices.forEach((button) => {
    button.addEventListener('click', () => updateFinish(button.dataset.finishChoice));
  });

  window.addEventListener('scroll', requestScrollState, { passive: true });
  window.addEventListener('resize', requestScrollState);
  motionQuery.addEventListener('change', requestScrollState);

  if (stages[0]) setActiveStage(stages[0]);
  updateScrollState();
})();
