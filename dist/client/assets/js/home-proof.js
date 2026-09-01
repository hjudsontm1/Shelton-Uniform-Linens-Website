(function () {
  var proof = document.querySelector('[data-home-proof]');
  if (!proof) return;

  var comparison = proof.querySelector('[data-home-proof-comparison]') || proof.querySelector('.home-proof__comparison');
  var range = proof.querySelector('[data-home-proof-range]');
  var output = proof.querySelector('[data-home-proof-output]');
  var hero = proof.querySelector('.home-hero--ready');
  var transition = document.querySelector('.home-tailored-transition');
  if (!range) return;

  var compactQuery = window.matchMedia('(max-width: 860px)');
  var comparisonRole = comparison ? comparison.getAttribute('role') : null;
  var comparisonLabel = comparison ? comparison.getAttribute('aria-label') : null;
  var autoFrame = 0;
  var autoTimer = 0;
  var autoObserver = null;
  var autoCancelled = false;
  var autoStarted = false;
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function updateComparison(announce) {
    var value = Math.min(Number(range.max), Math.max(Number(range.min), Number(range.value)));
    var professionallyCleaned = 100 - value;
    var status = value + ' percent received and ' + professionallyCleaned + ' percent professionally cleaned';

    proof.style.setProperty('--proof-position', value + '%');
    range.setAttribute('aria-valuetext', status);
    if (output && announce !== false) output.textContent = status;
  }

  function stopAutoSlide(cancelPermanently) {
    window.clearTimeout(autoTimer);
    window.cancelAnimationFrame(autoFrame);
    autoTimer = 0;
    autoFrame = 0;

    if (autoObserver) {
      autoObserver.disconnect();
      autoObserver = null;
    }

    if (cancelPermanently) autoCancelled = true;
  }

  function cancelAutoSlide() {
    stopAutoSlide(true);
  }

  function easeInOut(progress) {
    return 0.5 - Math.cos(Math.PI * progress) / 2;
  }

  function runAutoSlide() {
    if (autoCancelled || autoStarted || reducedMotion || compactQuery.matches) return;
    autoStarted = true;

    var startValue = 84;
    var endValue = 16;
    var duration = 2100;
    var startedAt = 0;

    range.value = String(startValue);
    updateComparison(false);

    function animate(timestamp) {
      if (autoCancelled || reducedMotion || compactQuery.matches) return;
      if (!startedAt) startedAt = timestamp;

      var progress = Math.min(1, (timestamp - startedAt) / duration);
      var value = Math.round(startValue + (endValue - startValue) * easeInOut(progress));
      range.value = String(value);
      updateComparison(false);

      if (progress < 1) {
        autoFrame = window.requestAnimationFrame(animate);
      } else {
        autoFrame = 0;
        updateComparison(true);
      }
    }

    autoTimer = window.setTimeout(function () {
      autoTimer = 0;
      if (autoCancelled || reducedMotion || compactQuery.matches) return;
      autoFrame = window.requestAnimationFrame(animate);
    }, 380);
  }

  function armAutoSlide() {
    if (autoCancelled || autoStarted || reducedMotion || compactQuery.matches || !comparison || !('IntersectionObserver' in window) || autoObserver) return;

    range.value = '84';
    updateComparison(true);

    var observer = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      observer.disconnect();
      if (autoObserver === observer) autoObserver = null;
      runAutoSlide();
    }, {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.38
    });

    autoObserver = observer;
    observer.observe(comparison);
  }

  range.addEventListener('pointerdown', cancelAutoSlide);
  range.addEventListener('input', function () {
    cancelAutoSlide();
    updateComparison(true);
  });
  range.addEventListener('change', function () {
    cancelAutoSlide();
    updateComparison(true);
  });
  range.addEventListener('keydown', function (event) {
    var handledKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (handledKeys.indexOf(event.key) === -1) return;

    cancelAutoSlide();
    event.preventDefault();
    var value = Number(range.value);
    var step = Number(range.step) || 1;

    if (event.key === 'Home') value = Number(range.min);
    else if (event.key === 'End') value = Number(range.max);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') value -= step;
    else value += step;

    range.value = String(Math.min(Number(range.max), Math.max(Number(range.min), value)));
    updateComparison(true);
  });

  function updateMode() {
    var isCompact = compactQuery.matches;
    range.disabled = isCompact;

    if (isCompact) stopAutoSlide(false);

    if (hero && isCompact) {
      var heroHeight = hero.getBoundingClientRect().height + 'px';
      proof.style.setProperty('--opening-hero-rendered-height', heroHeight);
      if (transition) transition.style.setProperty('--opening-hero-rendered-height', heroHeight);
    } else {
      proof.style.removeProperty('--opening-hero-rendered-height');
      if (transition) transition.style.removeProperty('--opening-hero-rendered-height');
    }

    if (comparison) {
      if (isCompact) {
        comparison.removeAttribute('role');
        comparison.removeAttribute('aria-label');
      } else {
        if (comparisonRole) comparison.setAttribute('role', comparisonRole);
        if (comparisonLabel) comparison.setAttribute('aria-label', comparisonLabel);
      }
    }

    if (!isCompact) {
      updateComparison(false);
      armAutoSlide();
    }
  }

  if (typeof compactQuery.addEventListener === 'function') {
    compactQuery.addEventListener('change', updateMode);
  } else if (typeof compactQuery.addListener === 'function') {
    compactQuery.addListener(updateMode);
  }

  if (hero && typeof ResizeObserver === 'function') {
    new ResizeObserver(function () {
      if (compactQuery.matches) {
        var heroHeight = hero.getBoundingClientRect().height + 'px';
        proof.style.setProperty('--opening-hero-rendered-height', heroHeight);
        if (transition) transition.style.setProperty('--opening-hero-rendered-height', heroHeight);
      }
    }).observe(hero);
  } else {
    window.addEventListener('resize', updateMode);
  }

  updateComparison(true);
  updateMode();
})();
