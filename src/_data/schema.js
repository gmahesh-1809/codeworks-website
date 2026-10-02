import site from "./site.js";

// schema.org Organization markup, output on the home page only.
export default {
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url + "/",
    logo: site.url + "/assets/icons/icon-512.png",
    email: site.email,
    description: "Technology product company building enterprise software for businesses where technology is central to operations.",
  },
};
