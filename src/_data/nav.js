// Resource links used by the header and footer. Product links come from products.js.
// hidden: true keeps a section out of the menus until it has real content (its tab on the
// Resources page is commented out too; see HANDOVER §3.4).
export default {
  resources: [
    { key: "product-briefs", name: "Product Briefs" },
    { key: "white-papers", name: "White Papers" },
    { key: "technology-briefs", name: "Technology Briefs" },
    { key: "case-studies", name: "Case Studies", hidden: true },
    { key: "insights", name: "Insights", hidden: true },
  ],
};
