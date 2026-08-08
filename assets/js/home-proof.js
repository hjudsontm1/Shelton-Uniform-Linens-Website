(function () {
  var proof = document.querySelector('[data-home-proof]');
  if (!proof) return;

  var range = proof.querySelector('[data-home-proof-range]');
  var output = proof.querySelector('[data-home-proof-output]');
  var comparison = proof.querySelector('.home-proof__comparison');
  if (!range) return;

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

  function cancelAutoSlide() {
    autoCancelled = true;
    window.clearTimeout(autoTimer);
    window.cancelAnimationFrame(autoFrame);
    if (autoObserver) autoObserver.disconnect();
  }

  function easeInOut(progress) {
    return 0.5 - Math.cos(Math.PI * progress) / 2;
  }

  function runAutoSlide() {
    if (autoCancelled || autoStarted) return;
    autoStarted = true;

    var startValue = 84;
    var endValue = 16;
    var duration = 2100;
    var startedAt = 0;

    range.value = String(startValue);
    updateComparison(false);

    function animate(timestamp) {
      if (autoCancelled) return;
      if (!startedAt) startedAt = timestamp;

      var progress = Math.min(1, (timestamp - startedAt) / duration);
      var value = Math.round(startValue + (endValue - startValue) * easeInOut(progress));
      range.value = String(value);
      updateComparison(false);

      if (progress < 1) {
        autoFrame = window.requestAnimationFrame(animate);
      } else {
        updateComparison(true);
      }
    }

    autoTimer = window.setTimeout(function () {
      autoFrame = window.requestAnimationFrame(animate);
    }, 380);
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

  if (!reducedMotion && comparison && 'IntersectionObserver' in window) {
    range.value = '84';
    updateComparison(true);

    autoObserver = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
      autoObserver.disconnect();
      runAutoSlide();
    }, {
      root: null,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.38
    });

    autoObserver.observe(comparison);
  } else {
    updateComparison(true);
  }
})();
