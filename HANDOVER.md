# Handover: Codeworks website (status 5 October 2026)

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
| Tests | `npm test` (28 behaviour checks, all passing) |

**Every push to `main` goes live within about 30 seconds.** Work on a branch (currently `site-updates`), check it locally, then open a pull request into `main`.

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
  - "30+ Years Telecom-Grade Legacy" (Home, Company)

#### 3.3 Contact form backend (in the **company Google Workspace**)
The form currently falls back to opening the visitor's email program. To connect it properly:
- [ ] Follow `apps-script/README.md` while signed in to a **Codeworks Google Workspace account**, not a personal one. It takes about 10 minutes.
- [ ] Check `NOTIFY_EMAIL` in the script (currently `sales@codeworks.ind.in`).
- [ ] Paste the web-app URL (ends in `/exec`) into `formEndpoint` in `src/_data/site.js`, then commit and push.
- [ ] Test on the live site: the row appears in the Sheet, the email arrives, and the visitor sees "Thank you".
- [x] Retention period in the Privacy Policy: 24 months after last contact unless a business relationship follows. Confirm it when the form goes live.

#### 3.4 Content decisions
- [ ] **Resources → Case Studies** shows a "will be published here" placeholder. Launch with it, or hide the tab?
- [ ] **Resources → Insights** lists topic titles with no content behind them. Same decision.
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
6. [ ] Verify the domain with GitHub (gmahesh-1809's account settings → Pages → Verified domains). Not yet checked.
7. [ ] Once the certificate is issued, tick **Enforce HTTPS**. The certificate is issued (valid to 3 January 2027) and the box was ticked on 5 October, but GitHub still reported `https_enforced: false` that day and `http://` did not redirect. Check with `gh api repos/gmahesh-1809/codeworks-website/pages --jq .https_enforced`; if it stays false, remove and re-add the custom domain.
8. [ ] Re-run the deploy workflow **after step 7 takes effect**. The site address comes from the Pages settings, which say `http://` until HTTPS is enforced, so canonical URLs, the sitemap and link previews currently use `http://www.codeworks.ind.in`.
9. [ ] After step 8, in Google Search Console, add the domain and submit `https://www.codeworks.ind.in/sitemap.xml`.
10. [x] Turn off Pages on the personal preview repository, then make it private or delete it, so two copies of the site aren't online.

### P1: should do soon after launch
- [ ] **Analytics (optional):** if wanted, use a cookieless tool (Plausible, GoatCounter or Cloudflare Web Analytics) with one goal: form submissions. Avoid Google Analytics unless advertising attribution is needed, because it requires a cookie banner. Any analytics tool must also be added to the Privacy Policy.
- [x] **Drishti "Four Intelligent Agents"** (PR #1): a Pause/Play button now controls the cycling, and the cards are an ordered list instead of `<button>`s.
- [x] **Drishti page headings** (PR #1): visually hidden H2s for the Overview and Agents panels; agent names are H3s.
- [ ] **Unused CSS:** about 3 KB in `site.css` belongs to removed product screenshots and earlier layouts: `.cw-shots`, `.cw-shot`, `.cw-peek`, `.cw-bento`, `.cw-asym`, `.cw-sw`, `.cw-tabs`. Remove it, then run the visual check.
- [ ] **Inline styles:** repeated inline styles (section labels, display headings, CTA bands, cards) should become CSS classes. Do one pattern at a time and run the visual check after each.
- [ ] **Product summaries:** home page cards and the Products page still have their own copies of the product taglines and ROI lines. Move them into `src/_data/nav.js` (or a `products.js`) so there is one source.
- [ ] **Content Security Policy:** add one as a `<meta>` tag. It must allow the Apps Script domains (`script.google.com`, `script.googleusercontent.com`). It needs `'unsafe-inline'` for styles until the inline styles are gone.

### P2: nice to have
- [ ] Product-page "Talk to Us" buttons could link to `/contact/?topic=drishti` or `?topic=spectra`. The form already supports this.
- [ ] Individual resource pages or PDFs in `src/assets/documents/` once real content exists.
- [ ] Automatic broken-link checking in the deploy workflow.
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
- **Contact form:** it only shows "Thank you" when the Apps Script replies `{"ok": true}`. Never switch the request to `no-cors`, or every submission would look successful even when it failed.
