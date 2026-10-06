// Home hero: one window per product. Advances every 6s (the bar under the current product fills),
// holds while the visitor points at or focuses the carousel, and stops for good once a product is chosen.
// The Pause/Play button controls it (WCAG 2.2.2); it never autoplays when reduced motion is requested.
// Without JavaScript only the first window shows and the switcher stays hidden.
(function () {
  "use strict";

  var car = document.querySelector("[data-cw-hcar]");
  if (!car) return;
  var tabs = Array.prototype.slice.call(car.querySelectorAll('[role="tab"]'));
  var slides = Array.prototype.slice.call(car.querySelectorAll(".cw-slide"));
  var live = car.querySelector(".cw-slides");
  var pp = car.querySelector(".cw-pp");
  var playing = !(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var act = 0;

  function render(focus) {
    tabs.forEach(function (t, i) {
      var on = i === act;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      // Restart the progress bar on the newly selected tab.
      var bar = t.querySelector(".bar");
      bar.style.animation = "none";
      void bar.offsetWidth;
      bar.style.animation = "";
    });
    slides.forEach(function (s, i) {
      var on = i === act;
      s.classList.toggle("on", on);
      if (on) { s.removeAttribute("aria-hidden"); s.inert = false; }
      else { s.setAttribute("aria-hidden", "true"); s.inert = true; }
    });
    car.classList.toggle("play", playing);
    // Announce changes only when the visitor is driving.
    live.setAttribute("aria-live", playing ? "off" : "polite");
    pp.setAttribute("aria-label", playing ? "Pause" : "Play");
    pp.querySelector(".i-pause").hidden = !playing;
    pp.querySelector(".i-play").hidden = playing;
    if (focus) tabs[act].focus();
  }

  function choose(i, focus) { act = (i + tabs.length) % tabs.length; playing = false; render(focus); }

  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { choose(i); });
    t.querySelector(".bar").addEventListener("animationend", function () {
      if (playing && i === act) { act = (act + 1) % tabs.length; render(); }
    });
    t.addEventListener("keydown", function (e) {
      var k = e.key;
      if (k === "ArrowRight" || k === "ArrowDown") choose(i + 1, true);
      else if (k === "ArrowLeft" || k === "ArrowUp") choose(i - 1, true);
      else if (k === "Home") choose(0, true);
      else if (k === "End") choose(tabs.length - 1, true);
      else return;
      e.preventDefault();
    });
  });
  pp.addEventListener("click", function () { playing = !playing; render(); });

  // Hold while the visitor is reading or interacting.
  var hold = function () { car.classList.add("hold"); };
  var release = function () { car.classList.remove("hold"); };
  car.addEventListener("mouseenter", hold);
  car.addEventListener("mouseleave", release);
  car.addEventListener("focusin", hold);
  car.addEventListener("focusout", function (e) { if (!car.contains(e.relatedTarget)) release(); });

  car.querySelector(".cw-hsw").hidden = false;
  render();
})();
