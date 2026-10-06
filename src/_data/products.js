// Single source for each product's summary: used by the header and footer (via nav.js), the home
// page cards, the Products page, Resources → Product Briefs, the 404 page and the contact form.
// The product pages themselves (src/products/<key>/) are written by hand.
//
// tone picks the colour styles in site.css (cw-btn-<tone>, --roi-<tone>, --<tone>-text, …);
// color is the solid fill used for card backgrounds and dots.
// HTML is allowed in subtitle, roi and highlights (escape & as &amp;).
export default [
  {
    key: "drishti",
    name: "Drishti.ai",
    url: "/products/drishti/",
    tone: "blue",
    color: "#1878a4",
    tagline: "AI credit assessment & investigation",
    label: "AI-Powered Intelligence Layer",
    subtitle: "AI Credit Assessment &amp; Investigation",
    highlights: ["Multi-agent support", "Inconsistency &amp; risk detection", "Intelligent Copilot", "Non-invasive deployment layer"],
    roi: "Cuts credit investigation turnaround time by 60%.",
    brief: "Credit Assessment &amp; Investigation Platform",
    starter: "Hello Codeworks team,\n\nWe are interested in Drishti.ai for credit assessment and investigation. We would like to understand how it fits our pre-sanction and post-sanction process and works alongside our existing systems.\n\nCould we set up a conversation?",
  },
  {
    key: "spectra",
    name: "Spectra",
    url: "/products/spectra/",
    tone: "green",
    color: "#4d8230",
    tagline: "Subvention claims tracing, reconciliation & audit",
    label: "Automated Settlement Engine",
    subtitle: "Subvention Processing Engine for Claims Tracing, Reconciliation and Audit",
    highlights: ["Automated claim tracing &amp; validation", "Rule-based calculation engines", "Complete transaction traceability", "Automated multi-party reconciliation"],
    roi: "Eliminates audit leaks and manual settlement delays.",
    brief: "Subvention Processing Engine for Claims Tracing, Reconciliation and Audit",
    starter: "Hello Codeworks team,\n\nWe are interested in Spectra for subvention claims tracing, reconciliation and audit. We would like to understand how it handles our schemes, settlement and reporting.\n\nCould we set up a conversation?",
  },
];
