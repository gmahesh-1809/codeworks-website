// Product page workflow illustration: adds a Pause/Play button for the cycling step highlight (WCAG 2.2.2).
// The highlight is a CSS animation; pausing adds .paused to the band. Not added under reduced motion,
// where the highlight doesn't run, or on phones, where the illustration is a static list (CSS hides it).
(function () {
  "use strict";

  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  Array.prototype.forEach.call(document.querySelectorAll(".cw-viz"), function (band) {
    var bar = band.querySelector(".cw-vwin .cw-bar");
    if (!bar) return;
    var pp = document.createElement("button");
    pp.type = "button";
    pp.className = "cw-pp";
    pp.innerHTML = '<svg class="i-pause" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><rect x="3.5" y="2.5" width="3" height="11" rx="1"></rect><rect x="9.5" y="2.5" width="3" height="11" rx="1"></rect></svg>' +
      '<svg class="i-play" width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" hidden><path d="M4 2.5v11l9-5.5z"></path></svg>';
    function render() {
      var paused = band.classList.contains("paused");
      pp.setAttribute("aria-label", paused ? "Play the workflow animation" : "Pause the workflow animation");
      pp.querySelector(".i-pause").hidden = paused;
      pp.querySelector(".i-play").hidden = !paused;
    }
    pp.addEventListener("click", function () { band.classList.toggle("paused"); render(); });
    bar.appendChild(pp);
    render();
  });
})();
