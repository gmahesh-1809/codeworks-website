// Accessible tabs (Resources and the product pages). All panels are in the HTML; this only switches them.
// The selected tab is mirrored in the URL hash (#white-papers, #agents ...) so it can be linked to.
(function () {
  "use strict";

  document.querySelectorAll("[data-cw-tabs]").forEach(function (list) {
    var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    var key = function (tab) { return tab.id.replace(/^tab-/, ""); };

    function select(tab, opts) {
      opts = opts || {};
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
        document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
      });
      if (opts.focus) tab.focus();
      if (opts.updateHash !== false) {
        try { history.replaceState(null, "", "#" + key(tab)); } catch (e) {}
      }
      list.dispatchEvent(new CustomEvent("cw-tabchange", { detail: key(tab) }));
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { select(tab); });
      tab.addEventListener("keydown", function (e) {
        var next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") next = tabs[(i + tabs.length - 1) % tabs.length];
        else if (e.key === "Home") next = tabs[0];
        else if (e.key === "End") next = tabs[tabs.length - 1];
        if (!next) return;
        e.preventDefault();
        select(next, { focus: true });
      });
    });

    function fromHash() {
      var k = location.hash.slice(1);
      var tab = tabs.filter(function (t) { return key(t) === k; })[0];
      if (tab) select(tab, { updateHash: false });
    }
    fromHash();
    window.addEventListener("hashchange", fromHash);
  });
})();
