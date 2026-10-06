# Codeworks website

The corporate and product website for Codeworks: a static site built with [Eleventy](https://www.11ty.dev/) and hosted on GitHub Pages.

**Taking over this project? Start with [HANDOVER.md](HANDOVER.md)**: pending items, decisions and gotchas.

Visitors get plain HTML, one stylesheet and about 10 KB of JavaScript. No framework runs in the browser.

## Quick start

```bash
npm install
npm start            # http://localhost:8080, rebuilds on save
npm run build        # writes the site to _site/
npm test             # behaviour checks (menus, tabs, form…) against the running dev server
```

The tests use your installed Google Chrome. Set `CHROME_PATH` if it isn't in the default macOS location.

## Structure

```text
src/
  _data/        site.js (URL, email, legal details, form endpoint), nav.js (product + resource links), schema.js
  _includes/
    layouts/    base.njk (every page), legal.njk (Privacy, Terms)
    partials/   header.njk, footer.njk, product menu thumbnails
  index.html                 /
  company/                   /company/
  products/                  /products/  /products/drishti/  /products/spectra/  /products/assay/
  technology/                /technology/
  services/                  /services/
  resources/                 /resources/  (#product-briefs, #white-papers, … select a tab)
  contact/                   /contact/    (?topic=drishti preselects a topic)
  privacy/, terms/           Markdown
  404.html, robots.txt.njk, sitemap.xml.njk
  assets/
    css/site.css             the whole design system, one file
    js/                      main.js (every page), tabs.js, tech-flow.js, agents.js, contact-form.js
    images/                  logos (SVG), Open Graph image
    icons/                   favicon, app icons
    fonts/                   self-hosted Bricolage Grotesque + DM Sans (SIL OFL)
apps-script/                 contact form backend (Google Apps Script) and setup guide
tests/                       functional.cjs (behaviour), visual.cjs (screenshot comparison)
reference/                   the original design export, kept for visual comparison only
```

## Common changes

- **Page text:** edit the page's `index.html` under `src/`. Each file starts with its `title` and `description` (used for search results and link previews).
- **Products:** `src/_data/products.js` holds each product's name, tagline, colour, highlights, ROI line and contact message. The header, footer, home page, Products page, Resources briefs, 404 page and contact form all read from it. Each product's own page is `src/products/<key>/index.html`.
- **Link-preview images:** each product's is generated from `products.js` with `npm run og-images` (needs Chrome); commit the PNGs it writes.
- **New product:** add an entry to `products.js` (including its `hero` window for the home page carousel, and run `npm run og-images`), create its page, and add `src/_includes/partials/thumb-<key>.svg` (menu picture; the build fails without it) and `tile-<key>.svg` (home card illustration). A new colour needs its `--<tone>` tokens and `cw-btn-`, `cw-tile-`, `to-`, `cw-viz-` and `acc-` styles in `site.css`; see the `navy` ones added for Assay.
- **Resources list:** `src/_data/nav.js` feeds the Resources links in the header, mobile menu and footer.
- **Email address, legal details, form endpoint:** `src/_data/site.js`.
- **Styles:** `src/assets/css/site.css`. Colours, the type scale (`--fs-…`) and corner radii (`--r-…`) are CSS variables at the top, with dark-theme colours beneath them. Reusable components extracted from inline styles (`cw-eyebrow`, `cw-h1`, `cw-card`, `cw-cta`, …) are at the end.
- **New page:** create `src/<name>/index.html` with the same front matter as an existing page. It is added to the sitemap automatically.

Write internal links from the site root (`/products/`, `/assets/...`). The build adds the GitHub Pages path prefix when needed, so links work both at `username.github.io/<repo>/` and at the custom domain.

## Deployment

**Preview vs. production:** a repository used only for review should have the Actions variable `SITE_NOINDEX` set to `true` (**Settings → Secrets and variables → Actions → Variables**). The site then tells search engines not to index it. Leave it unset on the production repository.

Every push to `main` builds and deploys through GitHub Actions (`.github/workflows/deploy.yml`).

First-time setup:

1. Create the repository on GitHub and push this folder to `main`.
2. In **Settings → Pages**, set **Source: GitHub Actions**.
3. Wait for the "Deploy to GitHub Pages" workflow to finish. The site is then live at `https://<username>.github.io/<repo>/`.

### Custom domain (www.codeworks.ind.in)

1. **Settings → Pages → Custom domain:** enter `www.codeworks.ind.in` and save.
2. At the DNS provider for `codeworks.ind.in`:
   - `CNAME` record: `www` → `<username>.github.io`
   - `A` records for the bare domain `codeworks.ind.in`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (GitHub then redirects it to `www`)
   - Leave the existing `MX` (email) records unchanged.
3. Verify the domain under **GitHub → Settings (account or organisation) → Pages → Verified domains**, so nobody else can claim it.
4. Once the certificate is issued, tick **Enforce HTTPS**.
5. Re-run the deploy workflow (**Actions → Deploy to GitHub Pages → Run workflow**). The site URL and path prefix come from the Pages settings, so canonical URLs, the sitemap and link previews switch to the new domain without code changes.
6. In [Google Search Console](https://search.google.com/search-console), add the domain and submit `https://www.codeworks.ind.in/sitemap.xml`.

## Before launch: still to do

- [ ] Legal details in `src/_data/site.js` (`legalName`, `registeredOffice`), plus the grievance officer in `src/privacy/index.md`. The build prints a warning while any are left.
- [ ] Check the marketing claims ("cuts … by 60%", "eliminates audit leaks", "without hallucinations").
- [ ] Contact form: deploy the Apps Script (`apps-script/README.md`) and set `formEndpoint`.
- [x] Case Studies and Insights are hidden until there is real content (see HANDOVER §3.4).

## Visual regression check

`tests/visual.cjs` screenshots every page at 11 widths (360–1920px) in light and dark themes and compares them with the original export:

```bash
node tests/visual.cjs baseline   # once: screenshots of reference/codeworks-export.html
node tests/visual.cjs current    # screenshots of the dev server (npm start)
node tests/visual.cjs diff       # differences, with images in tests/screens/diff/
```
