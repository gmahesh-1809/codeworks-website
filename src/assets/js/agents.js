// Drishti.ai "Four Intelligent Agents": steps through the agents while that tab is visible.
// Stops for good once the visitor points at, focuses or clicks an agent; off under reduced motion.
(function () {
  "use strict";

  var panel = document.getElementById("panel-agents");
  if (!panel) return;
  var cards = Array.prototype.slice.call(panel.querySelectorAll(".cw-ag"));
  var auto = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var act = 0;

  function render() {
    cards.forEach(function (c, i) {
      c.classList.toggle("done", i < act);
      c.classList.toggle("on", i === act);
      c.setAttribute("aria-pressed", String(i === act));
    });
  }

  cards.forEach(function (c, i) {
    var pick = function () {
      if (act !== i || auto) { act = i; auto = false; render(); }
    };
    c.addEventListener("click", pick);
    c.addEventListener("mouseenter", pick);
    c.addEventListener("focus", pick);
  });

  setInterval(function () {
    if (auto && !panel.hidden && !document.hidden) { act = (act + 1) % cards.length; render(); }
  }, 2200);
})();
