# Handover: Codeworks website (status 6 October 2026)

The Codeworks website is live. This file lists everything still to do, plus the context needed to continue: which decisions were made, why, and what to watch out for.

> **Starting a Claude Code session on a new laptop?** Clone the repository, open it, and say:
> *"Read HANDOVER.md and README.md, then help me with the pending items."*
> This file replaces the notes from the original session, which stay on the first laptop.

---

## 1. Where things stand

| | |
|---|---|
| Source | https://github.com/gmahesh-1809/codeworks-website (the **company repository**) |
| Live site | https://www.codeworks.ind.in, served by GitHub Pages from that repository |
| Old preview | `fzmgt5c478-svg/codeworks-website` (personal account). Pages is off and the repository is private. Don't use it |
| Build | Eleventy 3 static site, deployed by GitHub Actions on every push to `main` |
| Tests | `npm test` (37 behaviour checks, all passing) |

**Every push to `main` goes live within about 30 seconds.** Work on a branch (`site-updates`, or a short-lived branch per change that is deleted after merging), check it locally, then open a pull request into `main`. Merging is done by a person on GitHub, not by Claude Code.

**Done:**
- The original design export (a single HTML file that rendered 9 pages in an iframe with React from unpkg) has been converted into real static pages at clean URLs.
- The visual design is unchanged. Screenshot comparison at 11 widths (360–1920px), light and dark, matches the original apart from the deliberate changes listed in §5.
- Added:
  - search basics: titles, descriptions, canonical URLs, sitemap, robots.txt, Organization schema
  - self-hosted fonts, SVG logos, favicon and link-preview image
  - Privacy and Terms drafts, a 404 page
  - an accessibility pass
  - a contact form backend ready to connect (Apps Script)
- Moved to the company repository and live on the custom domain (5 October 2026). See §3.5 for the steps still open.
- Third product, **Assay** (claims integrity & settlement for insurers), added 6 October 2026 at `/products/assay/`. Its wording comes from the Assay brief in the `assay-core` repository (`collateral/Assay_Insurance_Brief.html`), approved for the website by the project owner. Assay uses the site's dark navy (`--cw-navy`) as its colour.
- Home page reworked on 6 October 2026:
  - the line above the heading names the fields served: "Lending · Insurance · Public-Scheme Finance" ([#4](https://github.com/gmahesh-1809/codeworks-website/pull/4))
  - less space above the heading, so the product cards start on the first screen of a laptop ([#4](https://github.com/gmahesh-1809/codeworks-website/pull/4))
  - "Telecom-Grade Legacy" / "telecom engineering" reworded to "carrier-grade engineering" on the Home and Company pages; the Company page description no longer lists telcos ([#4](https://github.com/gmahesh-1809/codeworks-website/pull/4))
  - the hero window switches between the three products, with a product switcher and Pause/Play, and an "Explore <product> →" link in each window ([#5](https://github.com/gmahesh-1809/codeworks-website/pull/5))
- Products page shows three cards across on wide screens, with the names lined up ([#2](https://github.com/gmahesh-1809/codeworks-website/pull/2), [#3](https://github.com/gmahesh-1809/codeworks-website/pull/3)).
- Product pages on 6 October 2026:
  - Drishti and Spectra "Talk to Us" buttons preselect the product on the contact form, as Assay's do ([#6](https://github.com/gmahesh-1809/codeworks-website/pull/6))
  - Assay copy corrected against the product's code, from `assay-core/docs/internal/2026-10-06-website-copy-fixes.md` ([#8](https://github.com/gmahesh-1809/codeworks-website/pull/8))
  - Assay text shortened (Overview 221 → 145 words) and made less specific about integrations: "with the customer's consent, their bank and tax data" instead of naming the account aggregator; "set in configuration" instead of "without a software release" ([#8](https://github.com/gmahesh-1809/codeworks-website/pull/8), [#9](https://github.com/gmahesh-1809/codeworks-website/pull/9), [#10](https://github.com/gmahesh-1809/codeworks-website/pull/10))
- Unused CSS removed: 41 rules, about 3 KB, every page pixel-identical before and after ([#7](https://github.com/gmahesh-1809/codeworks-website/pull/7)).
- Design review of the whole site on 6 October 2026, with quick fixes: dark-mode contrast of the home window's step numbers and the amber "!" badge, Services cards no longer alternating the product colours, numbered markers only on real sequences, and a narrower text column on the legal pages. The remaining findings are P1/P2 items below.

**Do not touch** the older private repository `fzmgt5c478-svg/codeworks-site`. It holds an earlier design and is unrelated.

---

## 2. Setting up on a new laptop

1. The project owner adds you as a collaborator: **repo Settings → Collaborators → Add people**. Accept the email invite.
2. Install [Node.js 22+](https://nodejs.org/), [Google Chrome](https://www.google.com/chrome/) (used by the tests) and the GitHub CLI (`brew install gh`, then `gh auth login`).
3. Clone the repository and start the site:
   ```bash
   git clone https://github.com/gmahesh-1809/codeworks-website.git
   cd codeworks-website
   npm install
   npm start                 # http://localhost:8080
   npm test                  # in a second terminal, while npm start is running
   ```
4. If Chrome isn't in the default macOS location, set `CHROME_PATH=/path/to/chrome` before `npm test`.

---

## 3. Pending items

### P0: must be done before launch

#### 3.1 Company legal details
In `src/_data/site.js`:
- [ ] `cin`: the Corporate Identification Number. There's no `cin` field in `site.js` yet; add one and show it in the legal pages.
- [ ] `registeredOffice`: currently `"Navi Mumbai, Maharashtra"`. Replace it with the full registered address.
- [ ] `legalName` is currently `"Codeworks"`. Confirm it's the exact registered name, including any suffix such as "Private Limited".

Placeholders still in the legal pages:

| File | Placeholder |
|---|---|
| `src/privacy/index.md` | the grievance officer's **name**. The email (`grievance@codeworks.ind.in`) is already in place (Digital Personal Data Protection Act 2023) |

Already confirmed: the governing courts are **Mumbai, Maharashtra**. The build prints `Unresolved [TO CONFIRM] placeholders on: …` only while a field is empty, so it no longer warns: the fields above have interim values that still need confirming.

#### 3.2 Content review
- [ ] **Privacy Policy and Terms.** These are drafts written from how the site actually works: no cookies, no analytics, enquiries stored in Google Workspace, hosting on GitHub Pages. They are not legal advice.
- [ ] **Marketing claims that need evidence or softer wording:**
  - "Cuts credit investigation turnaround time by 60%" (Products page, Drishti page)
  - "Eliminates audit leaks and manual settlement delays" (Products page, Spectra page)
  - "without hallucinations or black-box guesswork" (Technology page)
  - "millions of daily critical transactions" (Company page)
  - "30+ Years Carrier-Grade Engineering" (Home, Company). Was "Telecom-Grade Legacy" until 6 October 2026; the 30 years still need confirming.
  - Assay's "ROI Impact" line ("Checks every claim before payout…") is descriptive, because Assay has not yet been measured on real claims. Replace it with a figure once one exists.
- [ ] **Assay wording after the 6 October rounds:** the Assay team should read the live Assay page. Their fix list marked some sentences "correct, do not change", and later rounds shortened them (e.g. "Calculated, Not Estimated", the Key Highlight on thresholds). No fact was changed.
- [ ] **Home page product windows (Spectra and Assay):** their steps and findings are illustrative, written for the carousel (e.g. "Interest rate outside the scheme limit", "Claim close to policy inception", claim number CLM-2026-4418 from the Assay brief). Ask someone who knows each product to confirm they're realistic. They're in the `hero` entries in `src/_data/products.js`.

#### 3.3 Contact form backend (in the **company Google Workspace**)
The form currently falls back to opening the visitor's email program. To connect it properly:
- [ ] Follow `apps-script/README.md` while signed in to a **Codeworks Google Workspace account**, not a personal one. It takes about 10 minutes.
- [ ] Check `NOTIFY_EMAIL` in the script (currently `sales@codeworks.ind.in`).
- [ ] Paste the web-app URL (ends in `/exec`) into `formEndpoint` in `src/_data/site.js`, then commit and push.
- [ ] Test on the live site: the row appears in the Sheet, the email arrives, and the visitor sees "Thank you".
- [x] Retention period in the Privacy Policy: 24 months after last contact unless a business relationship follows. Confirm it when the form goes live.

#### 3.4 Content decisions
- [x] **Resources → Case Studies and Insights:** hidden on 6 October 2026 until there is real content. The placeholder text read like internal notes ("Case studies will be published here", "Only genuine implementations…", a writing template), and Insights listed topics with nothing behind them. To bring one back: restore its tab button and uncomment its panel in `src/resources/index.html`, and remove `hidden: true` from its entry in `src/_data/nav.js` (the menus and footer then show it again).
- [ ] Every Resources item says "Request this" and links to Contact; no documents are downloadable yet. Fine for launch if that's intended.

#### 3.5 Move to the company GitHub organisation and go live
1. [x] Move the code to the company organisation. Either use **Settings → Transfer** on this repository (GitHub keeps redirects), or create a new repository there and push `main` to it.
2. [x] In the company repository, set **Settings → Pages → Source: GitHub Actions**.
3. [x] Make sure the Actions variable `SITE_NOINDEX` is **not** set there. It exists only on the preview repository to keep it out of search engines.
4. [x] Add the custom domain `www.codeworks.ind.in` in **Settings → Pages**.
5. [x] Set up DNS for `codeworks.ind.in` (full steps in README → *Custom domain*):
   - `CNAME www` → `gmahesh-1809.github.io`
   - four `A` records for the bare domain
   - leave the `MX` (email) records unchanged
6. [ ] Verify the domain with GitHub, so no one else can use it on their own Pages site. gmahesh-1809 opens their **account** Settings → Pages → **Add a domain**, enters `codeworks.ind.in`, adds the `_github-pages-challenge-gmahesh-1809` TXT record GitHub shows to DNS, then clicks **Verify**. Not done as of 6 October (checked again late that day): no such TXT record exists.
7. [x] Once the certificate is issued, tick **Enforce HTTPS**. On since 5 October: `http://` (with or without `www`) and `https://codeworks.ind.in` all redirect (301) to `https://www.codeworks.ind.in/`. The certificate is valid to 3 January 2027 and GitHub renews it automatically.
8. [x] Re-run the deploy workflow after step 7. Done on 5 October: canonical URLs, Open Graph URLs, the sitemap, robots.txt and the Organization schema all use `https://www.codeworks.ind.in`.
9. [ ] In [Google Search Console](https://search.google.com/search-console), add `codeworks.ind.in` as a **Domain** property, add the `google-site-verification=…` TXT record it shows to DNS, click **Verify**, then submit `https://www.codeworks.ind.in/sitemap.xml`. Not done as of 6 October.
10. [x] Turn off Pages on the personal preview repository, then make it private or delete it, so two copies of the site aren't online.

Both TXT records (steps 6 and 9) go alongside the existing SPF record on `codeworks.ind.in`; leave that record unchanged.

### P1: should do soon after launch
- [ ] **Analytics (optional):** if wanted, use a cookieless tool (Plausible, GoatCounter or Cloudflare Web Analytics) with one goal: form submissions. Avoid Google Analytics unless advertising attribution is needed, because it requires a cookie banner. Any analytics tool must also be added to the Privacy Policy.
- [x] **Drishti "Four Intelligent Agents"** (PR #1): a Pause/Play button now controls the cycling, and the cards are an ordered list instead of `<button>`s.
- [x] **Drishti page headings** (PR #1): visually hidden H2s for the Overview and Agents panels; agent names are H3s.
- [x] **Unused CSS:** removed on 6 October 2026: 41 rules (about 3 KB) for removed product screenshots and earlier layouts (`.cw-shots`, `.cw-shot`, `.cw-peek`, `.cw-bento`, `.cw-asym`, `.cw-sw`, `.cw-tabs`), plus `.cw-tv` and `.cw-fl.strong`, which nothing used. Every page was pixel-identical before and after.
- [ ] **Inline styles:** repeated inline styles (section labels, display headings, CTA bands, cards) should become CSS classes. Do one pattern at a time and run the visual check after each.
- [x] **Product summaries:** now in `src/_data/products.js`, the one source for the header, footer, home cards, Products page, Resources briefs, 404 page and contact topics. README → *Common changes* explains adding a product.
- [ ] **Design pass (from the 6 October review):** to be mocked up on a branch and reviewed before merging:
  - smaller headings on inner pages (Services' heading takes 4 lines at about 70px; aim for 48–56px), so content starts higher
  - fewer heavy coloured blocks: Company stacks a dark panel, a blue and a green card, a blue call-to-action band and the dark footer
  - the strip under the home page products: "30+ Years…" has a number and caption, the other three only a bold label; give all four the same structure
  - shorter product cards on phones (the home page is about 4,600px tall on a phone, mostly illustrations)
  - Resources repeats its tab name as a large heading straight below the tabs
- [ ] **Type scale and corner radii:** the site uses 41 font sizes and 22 corner radii. Settle on about 8 sizes and 3–4 radii. Do it together with the inline-styles item above, since most of them are inline.
- [ ] **Content Security Policy:** add one as a `<meta>` tag. It must allow the Apps Script domains (`script.google.com`, `script.googleusercontent.com`). It needs `'unsafe-inline'` for styles until the inline styles are gone.

### P2: nice to have
- [x] Product-page "Talk to Us" buttons preselect the product on the contact form: `/contact/?topic=drishti`, `?topic=spectra` and `?topic=assay`.
- [ ] Individual resource pages or PDFs in `src/assets/documents/` once real content exists.
- [ ] Automatic broken-link checking in the deploy workflow.
- [x] Services cards ended in lines like "→ Architectural Specs" that looked like links but weren't. They are now plain labels ("Deliverable: architectural specs").
- [ ] `BreadcrumbList` structured data on product pages.

---

## 4. Decisions already made (don't reopen without the project owner)

- **Build tool: Eleventy**, chosen over Jekyll and over any front-end framework.
- **Hosting:** GitHub Pages. The production address is `www.codeworks.ind.in`; the bare domain redirects to `www`.
- **Form backend:** Google Apps Script → Google Sheet + email, owned by the company Workspace.
- **Logo:** no original vector artwork exists; `misc/` on the first laptop only had 512×74 PNGs. The SVGs in `src/assets/images/` were rebuilt from those PNGs.
  - Official colours are the website's: blue `#1878a4` and green `#5c903c`.
  - Dark-theme colours are `#5cb7e4` and `#8fc96a`.
  - The reversed version is all white.
  - The PNG values `#1979a7` and `#5e903c` were deliberately *not* used.
- **Product screenshots** that appeared in an earlier version were removed on purpose.
- **Legal name** "Codeworks"; governing courts Mumbai.

---

## 5. Things to know (gotchas)

- **Deliberate differences from the original design:**
  - Privacy and Terms links in the footer. On phones, "Talk to Us" moves to its own line.
  - A one-line privacy notice under the contact form's Send button.
  - The vector logo.
  - Privacy, Terms and 404 are new pages.
- **Page width stays at 1240px on large screens.** The original CSS had a rule widening it to 1360px above 1700px, but it never took effect in the original, so it was removed to keep what visitors actually saw.
- **The arrows (→ ↗)** render in a system font in both the original and the new site. The web fonts don't include those characters. This is expected.
- **Links:** write internal links from the site root (`/products/`). The build adds the GitHub Pages path prefix automatically. Inside CSS, use paths relative to the stylesheet (`../fonts/…`), because CSS isn't rewritten.
- **Favicon:** `src/favicon.ico` must stay at the source root. An earlier copy rule overwrote the whole output folder on fresh builds.
- **Visual check:** `tests/screens/` isn't committed. On a new laptop, run `node tests/visual.cjs baseline` once (it uses `reference/codeworks-export.html`). After that, `current` and `diff` work as described in the README.
- **Fonts:** Bricolage Grotesque and DM Sans are self-hosted under the SIL Open Font License. The licence files are in `src/assets/fonts/`.
- **Drishti agent cards:** their grey fill and sizing originally came from the browser's default `<button>` style. Now that they're list items, `.cw-ag` sets `background-color: ButtonFace` and `box-sizing: border-box` to keep the same look. `ButtonFace` differs slightly between Chrome, Safari and Firefox (it did before too); replace it with a design colour if that matters.
- **Product data:** templates read `products` directly. Don't import `products.js` into another data file (such as `nav.js`): the dev server then keeps a stale copy and edits only appear after restarting `npm start`.
- **Colour and numbering conventions** (from the design review): blue, green and navy are the three products' colours (and blue and green are also the logo's), so don't alternate them decoratively; use one neutral surface and the blue accent for groups of equal items. Use 01 / 02 / 03 markers only where the order is real: the Technology flow, Drishti's agents, the home window steps and Spectra's capabilities.
- **Line length:** in DM Sans a `ch` unit is wider than an average character, so `72ch` gave about 93 characters per line. Running text uses about `58ch` (around 75 characters).
- **Home page carousel** (`src/assets/js/hero.js`): each product's window comes from its `hero` entry in `products.js`, so a new product needs one too. The first product's window is the one shown without JavaScript, and the one the page opens on. Rotation is every 6 seconds (the `cw-hfill` animation in `site.css`; the script advances when it ends). The windows are stacked in one grid cell; the 30px of bottom padding on each `.cw-slide` (removed below 1180px) is room for the floating note.
- **Contact form:** it only shows "Thank you" when the Apps Script replies `{"ok": true}`. Never switch the request to `no-cors`, or every submission would look successful even when it failed.
