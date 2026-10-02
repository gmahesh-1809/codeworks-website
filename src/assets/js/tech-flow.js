// Technology page: four-step flow that advances every 4.5s, pauses on hover/focus,
// stops when a step is chosen, and never autoplays when reduced motion is requested.
(function () {
  "use strict";

  var band = document.querySelector("[data-cw-flow]");
  if (!band) return;
  var nodes = Array.prototype.slice.call(band.querySelectorAll(".cw-nb"));
  var conns = Array.prototype.slice.call(band.querySelectorAll(".cw-conn"));
  var panels = Array.prototype.slice.call(band.querySelectorAll(".cw-detail-in > div"));
  var pp = band.querySelector(".cw-pp");
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var active = Math.max(0, nodes.findIndex(function (n) { return n.classList.contains("on"); }));
  var playing = !reduced;

  function render() {
    nodes.forEach(function (n, i) {
      var on = i === active;
      n.classList.toggle("on", on);
      n.setAttribute("aria-pressed", String(on));
      var prog = n.querySelector(".cw-prog");
      if (prog) prog.remove();
      if (on && playing) {
        prog = document.createElement("span");
        prog.className = "cw-prog";
        prog.setAttribute("aria-hidden", "true");
        var bar = document.createElement("i");
        bar.addEventListener("animationend", function () { active = (active + 1) % nodes.length; render(); });
        prog.appendChild(bar);
        n.appendChild(prog);
      }
    });
    conns.forEach(function (c, i) {
      c.classList.toggle("done", i < active);
      c.classList.toggle("flow", i === active && playing);
    });
    panels.forEach(function (p, i) {
      var on = i === active;
      p.style.opacity = on ? "1" : "0";
      p.style.visibility = on ? "visible" : "hidden";
      p.setAttribute("aria-hidden", String(!on));
    });
    pp.setAttribute("aria-label", playing ? "Pause" : "Play");
    pp.querySelector(".i-pause").hidden = !playing;
    pp.querySelector(".i-play").hidden = playing;
  }

  nodes.forEach(function (n, i) {
    n.addEventListener("click", function () { active = i; playing = false; render(); });
  });
  pp.addEventListener("click", function () { playing = !playing; render(); });

  // Hold progress while the visitor is reading or interacting.
  var hold = function () { band.classList.add("cw-hold"); };
  var release = function () { band.classList.remove("cw-hold"); };
  band.addEventListener("mouseenter", hold);
  band.addEventListener("mouseleave", release);
  band.addEventListener("focusin", hold);
  band.addEventListener("focusout", function (e) { if (!band.contains(e.relatedTarget)) release(); });

  render();
})();
