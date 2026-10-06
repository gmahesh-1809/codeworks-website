// Site-wide settings. SITE_URL / PATH_PREFIX are set by the deploy workflow;
// moving to a different domain only means changing those two values.
const prefix = (process.env.PATH_PREFIX || "/").replace(/\/$/, "");

export default {
  name: "Codeworks",
  url: (process.env.SITE_URL || "https://www.codeworks.ind.in") + prefix,
  email: "sales@codeworks.ind.in",
  // IndexNow key (public by design): published at /<key>.txt; the deploy workflow uses it to tell
  // Bing and other IndexNow search engines when pages change. Any 8–128 letters, digits or dashes.
  indexNowKey: "c94ecf57bcf22a3e09b0d79db545675d",
  // Company profiles elsewhere (e.g. the LinkedIn company page URL). Listed as sameAs in the structured data.
  profiles: [],
  locale: "en_IN",
  // TODO(legal): registered company name.
  legalName: "Codeworks",
  registeredOffice: "Navi Mumbai, Maharashtra",
  // Google Apps Script web-app URL for the contact form (see apps-script/README.md).
  // While empty, the form falls back to opening the visitor's email program.
  formEndpoint: "",
  year: new Date().getFullYear(),
  // Preview deployments set SITE_NOINDEX=true so search engines skip them (see README).
  noindex: process.env.SITE_NOINDEX === "true",
};
