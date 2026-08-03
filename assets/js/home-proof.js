(function () {
  var proof = document.querySelector('[data-home-proof]');
  if (!proof) return;

  var range = proof.querySelector('[data-home-proof-range]');
  var output = proof.querySelector('[data-home-proof-output]');
  if (!range) return;

  function updateComparison() {
    var value = Math.min(Number(range.max), Math.max(Number(range.min), Number(range.value)));
    var professionallyCleaned = 100 - value;
    var status = value + ' percent received and ' + professionallyCleaned + ' percent professionally cleaned';

    proof.style.setProperty('--proof-position', value + '%');
    range.setAttribute('aria-valuetext', status);
    if (output) output.textContent = status;
  }

  range.addEventListener('input', updateComparison);
  range.addEventListener('change', updateComparison);
  range.addEventListener('keydown', function (event) {
    var handledKeys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
    if (handledKeys.indexOf(event.key) === -1) return;

    event.preventDefault();
    var value = Number(range.value);
    var step = Number(range.step) || 1;

    if (event.key === 'Home') value = Number(range.min);
    else if (event.key === 'End') value = Number(range.max);
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') value -= step;
    else value += step;

    range.value = String(Math.min(Number(range.max), Math.max(Number(range.min), value)));
    updateComparison();
  });
  updateComparison();
})();
