// Site-wide behaviour: header shadow on scroll, theme toggle, desktop dropdowns, mobile menu.
(function () {
  "use strict";

  // Header gains a stronger background once the page is scrolled.
  var hdr = document.querySelector("[data-cw-hdr]");
  if (hdr) {
    var onScroll = function () { hdr.classList.toggle("sc", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Theme: explicit choice is stored; otherwise the OS preference applies.
  var root = document.documentElement;
  var themeButtons = document.querySelectorAll("[data-cw-theme]");
  function currentTheme() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function labelThemeButtons() {
    var label = currentTheme() === "dark" ? "Switch to light theme" : "Switch to dark theme";
    themeButtons.forEach(function (b) { b.setAttribute("aria-label", label); b.title = label; });
  }
  themeButtons.forEach(function (b) {
    b.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("cw-theme", next); } catch (e) {}
      labelThemeButtons();
    });
  });
  labelThemeButtons();

  // Desktop dropdowns: open on hover or chevron click; close on Escape, focus leaving, or outside click.
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll("[data-cw-dd]"));
  var closeTimer, hoveredAt = 0;
  function setOpen(dd, open) {
    var btn = dd.querySelector(".cw-chev");
    var menu = document.getElementById(btn.getAttribute("aria-controls"));
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.classList.toggle("open", open);
  }
  function closeAll(except) { dropdowns.forEach(function (d) { if (d !== except) setOpen(d, false); }); }
  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector(".cw-chev");
    dd.addEventListener("mouseenter", function () {
      clearTimeout(closeTimer); hoveredAt = Date.now(); closeAll(dd); setOpen(dd, true);
    });
    dd.addEventListener("mouseleave", function () {
      clearTimeout(closeTimer);
      closeTimer = setTimeout(function () { setOpen(dd, false); }, 140);
    });
    btn.addEventListener("click", function () {
      clearTimeout(closeTimer);
      var open = btn.getAttribute("aria-expanded") === "true";
      // A click right after hover-open should not immediately close the menu.
      if (open && Date.now() - hoveredAt > 450) setOpen(dd, false);
      else { closeAll(dd); setOpen(dd, true); }
    });
    dd.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && btn.getAttribute("aria-expanded") === "true") { setOpen(dd, false); btn.focus(); }
    });
    dd.addEventListener("focusout", function (e) { if (!dd.contains(e.relatedTarget)) setOpen(dd, false); });
  });
  document.addEventListener("click", function (e) { if (!e.target.closest("[data-cw-dd]")) closeAll(); });

  // Mobile menu.
  var burger = document.querySelector(".cw-burger");
  var mnav = document.getElementById("cw-mnav");
  if (burger && mnav) {
    var setMenu = function (open) {
      mnav.hidden = !open;
      burger.setAttribute("aria-expanded", String(open));
    };
    burger.addEventListener("click", function () { setMenu(mnav.hidden); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mnav.hidden) { setMenu(false); burger.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!mnav.hidden && !mnav.contains(e.target) && !burger.contains(e.target)) setMenu(false);
    });
    mnav.querySelectorAll(".cw-mtog").forEach(function (tog) {
      var group = document.getElementById(tog.getAttribute("aria-controls"));
      var name = tog.previousElementSibling.textContent;
      tog.addEventListener("click", function () {
        var open = group.hidden;
        group.hidden = !open;
        tog.setAttribute("aria-expanded", String(open));
        tog.setAttribute("aria-label", (open ? "Hide " : "Show ") + name + " links");
        tog.classList.toggle("open", open);
      });
    });
  }
})();
