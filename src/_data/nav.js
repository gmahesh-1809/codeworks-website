// Product and resource links used by the header and footer. Product details live in products.js.
import products from "./products.js";

export default {
  products,
  productKeys: products.map((p) => p.key),
  resources: [
    { key: "product-briefs", name: "Product Briefs" },
    { key: "white-papers", name: "White Papers" },
    { key: "technology-briefs", name: "Technology Briefs" },
    { key: "case-studies", name: "Case Studies" },
    { key: "insights", name: "Insights" },
  ],
};
