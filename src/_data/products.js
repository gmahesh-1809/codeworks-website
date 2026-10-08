// Single source for each product's summary: used by the header and footer, the home
// page cards, the Products page, Resources → Product Briefs, the 404 page and the contact form.
// The product pages themselves (src/products/<key>/) are written by hand.
//
// tone picks the colour styles in site.css (cw-btn-<tone>, --roi-<tone>, --<tone>-text, …);
// color is the solid fill used for card backgrounds and dots.
// hero is the window shown for the product in the home page carousel: steps use
// done / run / queue / ready, findings and note use the tags warn / flag / ok.
// category and audienceType describe the product to search engines (structured data on its page).
// HTML is allowed in subtitle, roi, highlights and hero step names (escape & as &amp;).
export default [
  {
    key: "drishti",
    name: "Drishti.ai",
    url: "/products/drishti/",
    tone: "blue",
    color: "#1878a4",
    tagline: "AI credit assessment & investigation",
    label: "AI-Powered Intelligence Layer",
    category: "Credit assessment and investigation software",
    audienceType: "Banks, NBFCs and lenders",
    subtitle: "AI Credit Assessment &amp; Investigation",
    highlights: ["Multi-agent support", "Inconsistency &amp; risk detection", "Intelligent Copilot", "Non-invasive deployment layer"],
    roi: "Cuts credit investigation turnaround time by 60%.",
    hero: {
      title: "Indigo Loom Works · ₹2 Cr loan",
      steps: [["Document Verification", "done"], ["Investigation", "run"], ["Credit Assessment Report", "queue"], ["Credit Copilot", "ready"]],
      findings: [["Revenue in P&L 15% above GST returns", "flag", "Flag"], ["Factory licence missing · requested", "warn", "Review"]],
      note: ["No director defaults found", "ok", "Clear"],
    },
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
    category: "Subvention claims processing and reconciliation software",
    audienceType: "Banks and lenders processing government subvention schemes",
    subtitle: "Subvention Processing Engine for Claims Tracing, Reconciliation and Audit",
    highlights: ["Automated claim tracing &amp; validation", "Rule-based calculation engines", "Complete transaction traceability", "Automated multi-party reconciliation"],
    roi: "Eliminates audit leaks and manual settlement delays.",
    hero: {
      title: "KCC crop loans · Apr–Jun claim",
      steps: [["Find eligible loans", "done"], ["Calculate the claim", "done"], ["Approve &amp; file", "run"], ["Reconcile &amp; credit", "queue"]],
      findings: [["Loan above ₹3 lakh · capped", "warn", "Review"], ["Loan classed NPA · not eligible", "flag", "Flag"]],
      note: ["1,240 loans · claim ₹38.6 L", "ok", "Clear"],
    },
    brief: "Subvention Processing Engine for Claims Tracing, Reconciliation and Audit",
    starter: "Hello Codeworks team,\n\nWe are interested in Spectra for subvention claims tracing, reconciliation and audit. We would like to understand how it handles our schemes, settlement and reporting.\n\nCould we set up a conversation?",
  },
  {
    key: "assay",
    name: "Assay",
    url: "/products/assay/",
    tone: "navy",
    // A CSS variable rather than a fixed colour, so it lightens in the dark theme.
    color: "var(--cw-navy)",
    tagline: "Claims integrity & settlement for insurers",
    label: "Claims Integrity Platform",
    category: "Insurance claims integrity and settlement software",
    audienceType: "Life, general and health insurers",
    subtitle: "Claims Integrity and Settlement Platform for Insurers",
    highlights: ["Underwriting &amp; claim checks", "Every figure cited to its source", "Thresholds set in configuration", "Settlement reconciled to the paisa"],
    roi: "Checks every claim before payout, and keeps the evidence behind every decision.",
    hero: {
      title: "Car claim · total loss ₹3.84 L",
      steps: [["Proposal &amp; claim checks", "done"], ["Documents read &amp; cited", "run"], ["Every figure with its working", "queue"], ["Officer decides &amp; settles", "ready"]],
      findings: [["Loss 10 days after the policy started", "flag", "Flag"], ["Claim at 94% of the cover", "warn", "Review"]],
      note: ["Policy active on the date of loss", "ok", "Clear"],
    },
    brief: "Claims Integrity &amp; Settlement for Insurers",
    starter: "Hello Codeworks team,\n\nWe are interested in Assay for claims integrity and settlement. We would like to understand how it checks proposals and claims against our own records and fits alongside our policy administration system.\n\nCould we set up a conversation?",
  },
];
