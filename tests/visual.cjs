// Visual regression: screenshots the original export (baseline) and the built site (current), then diffs them.
// Usage: node tests/visual.js baseline|current|diff [pageKey ...]
// Requires Google Chrome (override with CHROME_PATH). "current" expects `npm run serve` on :8080.
const { chromium } = require('playwright-core');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
const pixelmatch = require('pixelmatch');

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const OUT = path.join(__dirname, 'screens');
const WIDTHS = [360, 375, 390, 430, 768, 820, 900, 1024, 1280, 1440, 1920];
const THEMES = ['light', 'dark'];
const PAGES = {
  home: ['Codeworks Landing.dc.html', '/'],
  company: ['Codeworks Company.dc.html', '/company/'],
  products: ['Codeworks Products.dc.html', '/products/'],
  drishti: ['Drishti Product.dc.html', '/products/drishti/'],
  spectra: ['Spectra Product.dc.html', '/products/spectra/'],
  technology: ['Codeworks Technology.dc.html', '/technology/'],
  services: ['Codeworks Services.dc.html', '/services/'],
  resources: ['Codeworks Resources.dc.html', '/resources/'],
  contact: ['Codeworks Contact.dc.html', '/contact/'],
};
// Freeze motion so screenshots are deterministic in both versions.
const FREEZE = '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}';

function exportDoc(name) {
  const html = fs.readFileSync(path.join(__dirname, '..', 'reference', 'codeworks-export.html'), 'utf8');
  const code = html.match(/<script>\n([\s\S]*?)var HOOK=/)[1];
  const ctx = {};
  new Function('ctx', code + ';ctx.PAGES=PAGES;ctx.COMPS=COMPS;ctx.SUPPORT=SUPPORT;')(ctx);
  const boot = '<script>window.__resources={};window.__resourceBlobs={};var __c=' + JSON.stringify(ctx.COMPS).split('<').join('\\u003c') +
    ';for(var k in __c)window.__resourceBlobs[k]=new Blob([__c[k]],{type:"text/html"});<\/script><script>' + ctx.SUPPORT + '<\/script>';
  return ctx.PAGES[name].replace(/<script src="\.\/support\.js"><\/script>/, () => boot);
}

async function shoot(mode, keys) {
  const browser = await chromium.launch({ executablePath: CHROME });
  for (const theme of THEMES) {
    const context = await browser.newContext({ colorScheme: theme, reducedMotion: 'reduce' });
    await context.addInitScript(() => { try { localStorage.clear(); } catch (e) {} });
    const page = await context.newPage();
    for (const key of keys) {
      const [file, url] = PAGES[key];
      for (const w of WIDTHS) {
        await page.setViewportSize({ width: w, height: 900 });
        if (mode === 'baseline') { await page.setContent(exportDoc(file)); await page.waitForTimeout(1200); }
        else { await page.goto(BASE_URL + url); }
        await page.addStyleTag({ content: FREEZE });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(250);
        const dir = path.join(OUT, mode); fs.mkdirSync(dir, { recursive: true });
        await page.screenshot({ path: path.join(dir, `${key}-${w}-${theme}.png`), fullPage: true });
      }
      process.stdout.write(`${mode} ${theme} ${key} done\n`);
    }
    await context.close();
  }
  await browser.close();
}

function pad(png, w, h) {
  if (png.width === w && png.height === h) return png;
  const out = new PNG({ width: w, height: h });
  out.data.fill(0);
  PNG.bitblt(png, out, 0, 0, Math.min(png.width, w), Math.min(png.height, h), 0, 0);
  return out;
}

function diff(keys) {
  const dir = path.join(OUT, 'diff'); fs.mkdirSync(dir, { recursive: true });
  const rows = [];
  for (const key of keys) for (const theme of THEMES) for (const w of WIDTHS) {
    const name = `${key}-${w}-${theme}.png`;
    const a = PNG.sync.read(fs.readFileSync(path.join(OUT, 'baseline', name)));
    const b = PNG.sync.read(fs.readFileSync(path.join(OUT, 'current', name)));
    const W = Math.max(a.width, b.width), H = Math.max(a.height, b.height);
    const out = new PNG({ width: W, height: H });
    const n = pixelmatch(pad(a, W, H).data, pad(b, W, H).data, out.data, W, H, { threshold: 0.1 });
    const pct = (100 * n / (W * H));
    if (n) fs.writeFileSync(path.join(dir, name), PNG.sync.write(out));
    rows.push({ name, pct, dh: b.height - a.height });
  }
  for (const r of rows) if (r.pct > 0 || r.dh) console.log(`${r.pct.toFixed(3).padStart(7)}%  height ${r.dh >= 0 ? '+' : ''}${r.dh}px  ${r.name}`);
  const bad = rows.filter(r => r.pct > 0 || r.dh).length;
  console.log(`${rows.length - bad}/${rows.length} screenshots identical`);
}

const [mode, ...rest] = process.argv.slice(2);
const keys = rest.length ? rest : Object.keys(PAGES);
if (mode === 'diff') diff(keys); else shoot(mode, keys).catch(e => { console.error(e); process.exit(1); });
