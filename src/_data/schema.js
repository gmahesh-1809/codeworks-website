import site from "./site.js";

// schema.org structured data (JSON-LD), rendered by base.njk.
// Templates pass products in rather than this file importing products.js (see HANDOVER: Product data).
const home = site.url + "/";
const orgId = home + "#organization";

const organization = {
  "@type": "Organization",
  "@id": orgId,
  name: site.name,
  url: home,
  logo: site.url + "/assets/icons/icon-512.png",
  email: site.email,
  description: "Technology product company building software platforms for banks, NBFCs, insurers and other enterprises where technology is central to operations.",
  ...(site.profiles.length ? { sameAs: site.profiles } : {}),
};

// Home page: the company and the website. Product pages link back to the company by its @id.
export function homeGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organization,
      { "@type": "WebSite", "@id": home + "#website", url: home, name: site.name, publisher: { "@id": orgId } },
    ],
  };
}

function breadcrumbs(trail) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: site.url + url })),
  };
}

// A product page: the product as software, made by Codeworks, plus breadcrumbs.
export function productGraph(p, description) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": site.url + p.url + "#software",
        name: p.name,
        url: site.url + p.url,
        description,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: p.category,
        operatingSystem: "Web",
        audience: { "@type": "BusinessAudience", audienceType: p.audienceType },
        publisher: { "@id": orgId },
        provider: { "@id": orgId },
      },
      { "@type": "Organization", "@id": orgId, name: site.name, url: home },
      breadcrumbs([["Home", "/"], ["Products", "/products/"], [p.name, p.url]]),
    ],
  };
}

// The Products page: breadcrumbs only.
export function productsGraph() {
  return { "@context": "https://schema.org", "@graph": [breadcrumbs([["Home", "/"], ["Products", "/products/"]])] };
}

export default { homeGraph, productGraph, productsGraph };
