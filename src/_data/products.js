// Single source for each product's summary: used by the header and footer, the home
// page cards, the Products page, Resources → Product Briefs, the 404 page and the contact form.
// The product pages themselves (src/products/<key>/) are written by hand.
//
// tone picks the colour styles in site.css (cw-btn-<tone>, --roi-<tone>, --<tone>-text, …);
// color is the solid fill used for card backgrounds and dots.
// audience is the field it serves, shown in the home page "Built for" strip.
// hero is the window shown for the product in the home page carousel: steps use
// done / run / queue / ready, findings and note use the tags warn / flag / ok.
// HTML is allowed in audience, subtitle, roi, highlights and hero step names (escape & as &amp;).
export default [
  {
    key: "drishti",
    name: "Drishti.ai",
    url: "/products/drishti/",
    tone: "blue",
    color: "#1878a4",
    tagline: "AI credit assessment & investigation",
    audience: "Lending",
    label: "AI-Powered Intelligence Layer",
    subtitle: "AI Credit Assessment &amp; Investigation",
    highlights: ["Multi-agent support", "Inconsistency &amp; risk detection", "Intelligent Copilot", "Non-invasive deployment layer"],
    roi: "Cuts credit investigation turnaround time by 60%.",
    hero: {
      title: "Drishti.ai · Four intelligent agents",
      steps: [["Document Verification", "done"], ["Investigation", "run"], ["Credit Assessment Report", "queue"], ["Credit Copilot", "ready"]],
      findings: [["Inconsistency across submitted documents", "warn", "Review"], ["Unexplained link between related entities", "flag", "Flag"]],
      note: ["Income evidence matches declared profile", "ok", "Clear"],
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
    audience: "Subvention",
    label: "Automated Settlement Engine",
    subtitle: "Subvention Processing Engine for Claims Tracing, Reconciliation and Audit",
    highlights: ["Automated claim tracing &amp; validation", "Rule-based calculation engines", "Complete transaction traceability", "Automated multi-party reconciliation"],
    roi: "Eliminates audit leaks and manual settlement delays.",
    hero: {
      title: "Spectra · Subvention claims batch",
      steps: [["Claim Tracing &amp; Validation", "done"], ["Rule-Based Calculation", "done"], ["Reconciliation", "run"], ["Nodal Agency Submission", "queue"]],
      findings: [["Interest rate outside the scheme limit", "warn", "Review"], ["Claim already submitted in an earlier batch", "flag", "Flag"]],
      note: ["Batch totals reconcile with the source ledger", "ok", "Clear"],
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
    audience: "Insurance",
    label: "Claims Integrity Platform",
    subtitle: "Claims Integrity and Settlement Platform for Insurers",
    highlights: ["Underwriting &amp; claim checks", "Every figure cited to its source", "Thresholds you set, without a release", "Settlement reconciled to the paisa"],
    roi: "Checks every claim before payout, and keeps the evidence behind every decision.",
    hero: {
      title: "Assay · Claim file CLM-2026-4418",
      steps: [["Cover &amp; Waiting Periods", "done"], ["Claim Timing", "done"], ["Documents Read &amp; Cited", "run"], ["Officer Decision", "queue"]],
      findings: [["Claim close to policy inception", "flag", "Flag"], ["Claim near the sum insured", "warn", "Review"]],
      note: ["Loss occurred after cover began", "ok", "Clear"],
    },
    brief: "Claims Integrity &amp; Settlement for Insurers",
    starter: "Hello Codeworks team,\n\nWe are interested in Assay for claims integrity and settlement. We would like to understand how it checks proposals and claims against our own records and fits alongside our policy administration system.\n\nCould we set up a conversation?",
  },
];
