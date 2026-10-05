// Drishti.ai "Four Intelligent Agents": steps through the agents while that tab is visible.
// The Pause/Play button controls it (WCAG 2.2.2); pointing at or clicking an agent shows it and pauses.
// Never autoplays when reduced motion is requested.
(function () {
  "use strict";

  var panel = document.getElementById("panel-agents");
  if (!panel) return;
  var cards = Array.prototype.slice.call(panel.querySelectorAll(".cw-ag"));
  var pp = panel.querySelector(".cw-pp");
  var playing = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var act = 0;
  var timer;

  function step() {
    if (!panel.hidden && !document.hidden) act = (act + 1) % cards.length;
    render();
  }

  function render() {
    cards.forEach(function (c, i) {
      c.classList.toggle("done", i < act);
      c.classList.toggle("on", i === act);
    });
    pp.setAttribute("aria-label", playing ? "Pause" : "Play");
    pp.querySelector(".i-pause").hidden = !playing;
    pp.querySelector(".i-play").hidden = playing;
    clearTimeout(timer);
    if (playing) timer = setTimeout(step, 2200);
  }

  cards.forEach(function (c, i) {
    var pick = function () {
      if (act !== i || playing) { act = i; playing = false; render(); }
    };
    c.addEventListener("click", pick);
    c.addEventListener("mouseenter", pick);
  });
  pp.addEventListener("click", function () { playing = !playing; render(); });

  pp.hidden = false;
  render();
})();
