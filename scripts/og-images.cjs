// Generates the 1200×630 link-preview (Open Graph) image for each product:
// src/assets/images/og-<key>.png, in the product's colour, from src/_data/products.js.
// Usage: npm run og-images   (needs Google Chrome; override its location with CHROME_PATH)
// Rerun after changing a product's name, label or tagline, then commit the PNGs.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ROOT = path.join(__dirname, '..');
const ASSETS = path.join(ROOT, 'src', 'assets');
// Dark-background versions of each product colour (the hero and fills stay as in products.js).
const ACCENT = { blue: '#5cb7e4', green: '#8fc96a', navy: '#8fb3c4' };

const esc = (s) => String(s).replace(/&(?!amp;)/g, '&amp;').replace(/</g, '&lt;');

function card(p) {
  const accent = ACCENT[p.tone] || '#5cb7e4';
  const fill = p.tone === 'navy' ? '#24485a' : p.color;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'Bricolage Grotesque';src:url(fonts/bricolage-grotesque-latin.woff2) format('woff2');font-weight:200 800}
@font-face{font-family:'DM Sans';src:url(fonts/dm-sans-latin.woff2) format('woff2');font-weight:100 1000}
html,body{margin:0}
body{width:1200px;height:630px;position:relative;overflow:hidden;background:#0d1f28;color:#fff;font-family:'DM Sans',sans-serif}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(92,183,228,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(92,183,228,.07) 1px,transparent 1px);background-size:56px 56px}
.ring{position:absolute;right:-150px;top:150px;width:560px;height:560px;border-radius:50%;border:56px solid ${fill};opacity:.55}
.band{position:absolute;left:0;top:0;bottom:0;width:14px;background:${fill}}
.in{position:absolute;left:80px;top:88px;right:80px;bottom:80px;display:flex;flex-direction:column}
.logo{width:420px;height:auto;display:block}
.k{margin-top:56px;font-size:22px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${accent}}
h1{margin:14px 0 0;font:800 128px/1 'Bricolage Grotesque';letter-spacing:-.045em}
p{margin:22px 0 0;max-width:780px;font:500 38px/1.25 'DM Sans';color:${accent};text-wrap:balance}
.u{margin-top:auto;font-size:24px;font-weight:500;color:#a9bdc6}
</style></head><body><div class="grid"></div><div class="ring"></div><div class="band"></div>
<div class="in"><img class="logo" src="images/codeworks-logo-dark.svg" alt="">
<div class="k">${esc(p.label)}</div><h1>${esc(p.name)}</h1><p>${esc(p.tagline)}</p>
<div class="u">www.codeworks.ind.in${esc(p.url)}</div></div></body></html>`;
}

(async () => {
  const { default: products } = await import(pathToFileURL(path.join(ROOT, 'src', '_data', 'products.js')).href);
  const browser = await chromium.launch({ executablePath: CHROME });
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  for (const p of products) {
    // Write the card next to the assets so fonts and the logo load by relative path, then remove it.
    const tmp = path.join(ASSETS, `.og-${p.key}.html`);
    fs.writeFileSync(tmp, card(p));
    try {
      await page.goto(pathToFileURL(tmp).href);
      await page.evaluate(() => document.fonts.ready);
      const out = path.join(ASSETS, 'images', `og-${p.key}.png`);
      await page.screenshot({ path: out });
      console.log('wrote', path.relative(ROOT, out));
    } finally {
      fs.unlinkSync(tmp);
    }
  }
  await browser.close();
})();
