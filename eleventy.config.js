import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { HtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  // Rewrites root-relative URLs (/products/, /assets/...) to include pathPrefix,
  // so the same source works at username.github.io/<repo>/ and at a custom domain.
  eleventyConfig.addPlugin(HtmlBasePlugin);

  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

  // Joins rather than resolves, so a base that includes a path prefix (github.io/<repo>) is kept.
  eleventyConfig.addFilter("absoluteUrl", (path, base) => base.replace(/\/$/, "") + "/" + String(path).replace(/^\//, ""));
  // CSP source for an inline script: 'sha256-…' of its exact text (see the Content-Security-Policy meta in base.njk).
  eleventyConfig.addFilter("cspHash", (text) => `'sha256-${createHash("sha256").update(String(text)).digest("base64")}'`);
  // The item in a list of data objects whose key matches, e.g. products | findByKey(active).
  eleventyConfig.addFilter("findByKey", (list, key) => (list || []).find((x) => x.key === key));
  // Cache-busting: "/assets/css/site.css" | versioned → "/assets/css/site.css?v=<hash of the file>".
  // GitHub Pages lets browsers keep assets for 10 minutes; the hash changes only when the file does,
  // so a deploy never pairs new pages with an old stylesheet or script.
  eleventyConfig.addFilter("versioned", (path) => {
    const hash = createHash("sha256").update(readFileSync("src" + path)).digest("hex").slice(0, 10);
    return `${path}?v=${hash}`;
  });
  // Rebuild pages when an asset changes, so the dev server's hashes stay current too.
  eleventyConfig.addWatchTarget("src/assets/");
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
