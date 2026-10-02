import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Rewrites root-relative URLs (/products/, /assets/...) to include pathPrefix,
  // so the same source works at username.github.io/<repo>/ and at a custom domain.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Joins rather than resolves, so a base that includes a path prefix (github.io/<repo>) is kept.
  eleventyConfig.addFilter("absoluteUrl", (path, base) => base.replace(/\/$/, "") + "/" + String(path).replace(/^\//, ""));
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));

  // Legal pages contain "[TO CONFIRM: ...]" placeholders until the company details are filled in.
  eleventyConfig.on("eleventy.after", ({ results }) => {
    const pending = results.filter((r) => /\[TO CONFIRM/.test(r.content)).map((r) => r.url);
    if (pending.length) console.warn(`[codeworks] Unresolved [TO CONFIRM] placeholders on: ${pending.join(", ")}`);
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["html", "njk", "md"],
    // "/" for a custom domain; "/<repo>/" for a GitHub project site. Set in the deploy workflow.
    pathPrefix: process.env.PATH_PREFIX || "/",
  };
}
