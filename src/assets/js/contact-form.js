// Contact form. Posts to the Google Apps Script endpoint in data-endpoint and only shows
// "Thank you" when the script confirms the enquiry was saved. With no endpoint configured,
// it opens the visitor's email program with the enquiry filled in.
(function () {
  "use strict";

  var form = document.querySelector("[data-cw-contact]");
  if (!form) return;

  var STARTERS = {
    drishti: "Hello Codeworks team,\n\nWe are interested in Drishti.ai for credit assessment and investigation. We would like to understand how it fits our pre-sanction and post-sanction process and works alongside our existing systems.\n\nCould we set up a conversation?",
    spectra: "Hello Codeworks team,\n\nWe are interested in Spectra for subvention claims tracing, reconciliation and audit. We would like to understand how it handles our schemes, settlement and reporting.\n\nCould we set up a conversation?",
    review: "Hello Codeworks team,\n\nWe would like to schedule an architecture review of [describe the platform or system]. Our main concerns are [scale / availability / integration / modernisation].\n\nPlease let us know a convenient time.",
    services: "Hello Codeworks team,\n\nWe are looking for engineering support with [product engineering / enterprise architecture / AI engineering / application modernisation / systems integration].\n\nHere is a short description of what we need: [add details].",
    other: "Hello Codeworks team,\n\nWe would like to talk to you about [add topic].\n\nPlease get in touch."
  };
  var LABELS = { drishti: "Drishti.ai", spectra: "Spectra", review: "Architecture review", services: "Engineering services", other: "Something else" };

  var endpoint = form.getAttribute("data-endpoint");
  var email = form.getAttribute("data-email");
  var el = form.elements;
  var errorBox = document.getElementById("cw-form-error");
  var sent = form.parentElement.querySelector("[data-cw-sent]");
  var submit = form.querySelector('button[type="submit"]');
  var submitHTML = submit.innerHTML;
  var openedAt = Date.now();
  var edited = false;

  function applyTopic(topic) {
    if (!edited && STARTERS[topic]) el.message.value = STARTERS[topic];
  }
  el.message.addEventListener("input", function () { edited = true; });
  el.topic.addEventListener("change", function () { applyTopic(el.topic.value); });

  // Product pages can link to /contact/?topic=drishti to preselect the topic.
  var preset = new URLSearchParams(location.search).get("topic");
  if (preset && LABELS[preset]) { el.topic.value = preset; applyTopic(preset); }

  function clearErrors() {
    errorBox.hidden = true;
    errorBox.textContent = "";
    [el.name, el.email].forEach(function (f) { f.removeAttribute("aria-invalid"); });
  }
  function showError(message, field) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    if (field) { field.setAttribute("aria-invalid", "true"); field.focus(); }
  }
  function showSent(viaMail) {
    if (viaMail) {
      sent.querySelector("h2").textContent = "Almost there.";
      sent.querySelector("p").textContent = "Your email program should now open with your enquiry ready to send. If it did not, please write to " + email + ".";
    }
    form.hidden = true;
    sent.hidden = false;
    sent.querySelector("h2").focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors();
    var v = function (name) { return (el[name].value || "").trim(); };

    if (!v("name")) return showError("Please enter your name.", el.name);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) return showError("Please enter a valid work email address.", el.email);

    var data = {
      name: v("name"),
      organisation: v("org"),
      email: v("email"),
      topic: LABELS[el.topic.value] || "",
      message: el.message.value,
      page: location.href,
      website: v("website"),          // honeypot: must stay empty
      elapsedMs: Date.now() - openedAt // bots submit instantly
    };

    if (!endpoint) {
      var body = ["Name: " + data.name, "Organisation: " + data.organisation, "Email: " + data.email, "Topic: " + data.topic, "", data.message].join("\n");
      window.location.href = "mailto:" + email + "?subject=" + encodeURIComponent("Enquiry: " + (data.topic || "Codeworks")) + "&body=" + encodeURIComponent(body);
      return showSent(true);
    }

    submit.disabled = true;
    submit.innerHTML = "Sending…";
    // text/plain keeps this a "simple" request (no CORS preflight), which Apps Script requires.
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(data) })
      .then(function (res) { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(function (json) {
        if (!json || json.ok !== true) throw new Error((json && json.error) || "Not saved");
        showSent(false);
      })
      .catch(function () {
        submit.disabled = false;
        submit.innerHTML = submitHTML;
        showError("Sorry, that did not send. Please try again or email " + email + ".");
      });
  });
})();
