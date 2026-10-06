// Behaviour checks for the built site. Usage: node tests/functional.cjs  (expects `npm run serve` on :8080)
const { chromium } = require('playwright-core');

const CHROME = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE_URL || 'http://localhost:8080';
let failures = 0;
const check = (name, ok, extra) => { if (!ok) failures++; console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? '  (' + extra + ')' : ''}`); };

(async () => {
  const browser = await chromium.launch({ executablePath: CHROME });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  const errors = [], missing = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('response', r => { if (r.status() >= 400) missing.push(r.status() + ' ' + r.url()); });
  const visible = sel => page.locator(sel).first().isVisible();

  // Every page loads without script errors or broken requests.
  for (const p of ['/', '/company/', '/products/', '/products/drishti/', '/products/spectra/', '/products/assay/', '/technology/', '/services/', '/resources/', '/contact/', '/privacy/', '/terms/']) {
    await page.goto(BASE + p);
  }
  check('no script errors on any page', errors.length === 0, errors.join(' | '));
  check('no broken requests on any page', missing.length === 0, missing.join(' | '));

  // Desktop dropdown: hover, click, Escape.
  await page.goto(BASE + '/');
  await page.hover('[data-cw-dd] >> nth=0');
  check('products menu opens on hover', await visible('#cw-menu-products'));
  await page.mouse.move(5, 600); await page.waitForTimeout(250);
  check('products menu closes when pointer leaves', !(await visible('#cw-menu-products')));
  await page.focus('[aria-controls="cw-menu-resources"]'); await page.keyboard.press('Enter');
  check('resources menu opens from keyboard', await visible('#cw-menu-resources'));
  await page.keyboard.press('Escape');
  check('Escape closes menu and keeps focus on its button',
    !(await visible('#cw-menu-resources')) && await page.evaluate(() => document.activeElement.getAttribute('aria-controls')) === 'cw-menu-resources');

  // Theme toggle persists across pages.
  await page.click('.cw-nav [data-cw-theme]');
  const theme = await page.evaluate(() => document.documentElement.dataset.theme);
  await page.goto(BASE + '/company/');
  check('theme choice persists to the next page', theme && await page.evaluate(() => document.documentElement.dataset.theme) === theme, theme);
  await page.click('.cw-nav [data-cw-theme]');

  // Active navigation state.
  await page.goto(BASE + '/products/spectra/');
  check('Products marked current on a product page', await page.getAttribute('.cw-nav .cw-navgrp >> nth=0 >> a', 'aria-current') === 'page');

  // Product tabs + deep link.
  await page.goto(BASE + '/products/drishti/#agents');
  check('#agents deep link opens the agents tab', await visible('#panel-agents') && !(await visible('#panel-overview')));
  await page.focus('#tab-agents'); await page.keyboard.press('ArrowLeft');
  check('arrow key moves to Overview and updates the URL', await visible('#panel-overview') && page.url().endsWith('#overview'));

  // Drishti agents: autoplay advances; Pause stops it; Play resumes; cards are plain list items.
  await page.goto(BASE + '/products/drishti/#agents');
  await page.mouse.move(5, 5);
  const agOn = () => page.evaluate(() => [...document.querySelectorAll('.cw-ag')].findIndex(c => c.classList.contains('on')));
  const ag0 = await agOn(); await page.waitForTimeout(2500);
  check('drishti agents advance automatically', await agOn() === (ag0 + 1) % 4);
  await page.click('#panel-agents .cw-pp');
  const agP = await agOn(); await page.waitForTimeout(2500);
  check('Pause stops the agents', await agOn() === agP && await page.getAttribute('#panel-agents .cw-pp', 'aria-label') === 'Play');
  await page.click('#panel-agents .cw-pp'); await page.waitForTimeout(2500);
  check('Play resumes the agents', await agOn() === (agP + 1) % 4 && await page.getAttribute('#panel-agents .cw-pp', 'aria-label') === 'Pause');
  check('agent cards are list items, not buttons', await page.locator('#panel-agents li.cw-ag').count() === 4 && await page.locator('#panel-agents button.cw-ag').count() === 0);
  check('drishti page has section headings', await page.locator('main h2').count() >= 2);

  // Resources: hash from footer link while already on the page.
  await page.goto(BASE + '/resources/');
  await page.click('.cw-foot a[href$="#white-papers"]');
  await page.waitForTimeout(100);
  check('footer link switches Resources tab', await visible('#panel-white-papers') && await page.getAttribute('#tab-white-papers', 'aria-selected') === 'true');

  // Technology flow: autoplay advances; clicking a step pauses.
  await page.goto(BASE + '/technology/');
  await page.mouse.move(5, 5);
  const before = await page.evaluate(() => [...document.querySelectorAll('.cw-nb')].findIndex(n => n.classList.contains('on')));
  await page.waitForTimeout(4900);
  const after = await page.evaluate(() => [...document.querySelectorAll('.cw-nb')].findIndex(n => n.classList.contains('on')));
  check('technology flow advances automatically', after === (before + 1) % 4, `${before} -> ${after}`);
  await page.click('.cw-nb >> nth=0');
  check('choosing a step pauses and shows its detail',
    await page.getAttribute('.cw-pp', 'aria-label') === 'Play' && await page.evaluate(() => document.querySelector('.cw-detail-in > div').style.opacity === '1'));

  // Mobile menu.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE + '/');
  check('desktop nav hidden on mobile', !(await visible('.cw-nav')));
  await page.click('.cw-burger');
  check('burger opens mobile menu', await visible('#cw-mnav'));
  await page.click('[aria-controls="cw-msub-products"]');
  check('products sub-links expand', await visible('#cw-msub-products'));
  await page.keyboard.press('Escape');
  check('Escape closes mobile menu', !(await visible('#cw-mnav')));
  await page.setViewportSize({ width: 1280, height: 900 });

  // Home hero carousel: one window per product; autoplay advances; choosing a product stops it.
  await page.goto(BASE + '/');
  await page.mouse.move(5, 890);
  const slideOn = () => page.evaluate(() => [...document.querySelectorAll('.cw-slide')].findIndex(s => s.classList.contains('on')));
  check('hero has a window per product', await page.locator('.cw-slide').count() === 3 && await slideOn() === 0);
  await page.waitForTimeout(6500);
  check('hero advances to the next product', await slideOn() === 1);
  await page.click('#hs-tab-assay');
  await page.mouse.move(5, 890); await page.waitForTimeout(6500);
  check('choosing a product shows it and stops rotation', await slideOn() === 2 && await page.getAttribute('.cw-hsw .cw-pp', 'aria-label') === 'Play');

  // Products from src/_data/products.js: Assay appears everywhere the list is used.
  await page.goto(BASE + '/');
  check('home shows a card per product', await page.locator('a.cw-prod').count() === 3 && await page.locator('a.cw-prod[href$="/products/assay/"]').count() === 1);
  check('products menu and footer list Assay', await page.locator('#cw-menu-products a[href$="/products/assay/"]').count() === 1 && await page.locator('.cw-foot a[href$="/products/assay/"]').count() === 1);
  await page.goto(BASE + '/products/assay/');
  check('Products marked current on the Assay page', await page.getAttribute('.cw-nav .cw-navgrp >> nth=0 >> a', 'aria-current') === 'page');
  await page.click('#tab-modules');
  check('Assay modules tab shows both modules', await visible('#panel-modules') && await page.locator('#panel-modules .cw-open').count() === 8);
  await page.goto(BASE + '/contact/?topic=assay');
  check('?topic=assay preselects Assay', await page.inputValue('select[name=topic]') === 'assay' && (await page.inputValue('textarea[name=message]')).includes('Assay'));
  const picked = [];
  for (const k of ['drishti', 'spectra', 'assay']) {
    await page.goto(BASE + '/products/' + k + '/');
    await page.click('.cw-phero a.cw-btn');
    await page.waitForLoadState();
    picked.push(await page.inputValue('select[name=topic]'));
  }
  check('product "Talk to Us" buttons preselect their product', picked.join() === 'drishti,spectra,assay', picked.join());
  await page.goto(BASE + '/contact/?topic=' + encodeURIComponent('x"]'));
  check('malformed ?topic= is ignored', await page.inputValue('select[name=topic]') === '');

  // Contact form: validation, honest failure, real success.
  await page.goto(BASE + '/contact/?topic=spectra');
  check('?topic= preselects topic and starter message',
    await page.inputValue('select[name=topic]') === 'spectra' && (await page.inputValue('textarea[name=message]')).includes('Spectra'));
  await page.click('button[type=submit]');
  check('empty name is reported and focused', await visible('#cw-form-error') && await page.evaluate(() => document.activeElement.name) === 'name');
  await page.fill('input[name=name]', 'Test Person');
  await page.fill('input[name=email]', 'not-an-email');
  await page.click('button[type=submit]');
  check('invalid email is reported', (await page.textContent('#cw-form-error')).includes('valid work email') && await page.getAttribute('input[name=email]', 'aria-invalid') === 'true');

  const endpoint = 'https://script.google.com/macros/s/TEST/exec';
  await page.evaluate(u => document.querySelector('[data-cw-contact]').setAttribute('data-endpoint', u), endpoint);
  // contact-form.js reads the endpoint at load, so reload with the attribute injected before scripts run.
  const withEndpoint = async (status, body) => {
    await page.route(endpoint, r => r.fulfill({ status, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body }));
    await page.route(BASE + '/contact/', async r => {
      const res = await r.fetch(); const html = (await res.text()).replace('data-endpoint=""', `data-endpoint="${endpoint}"`);
      r.fulfill({ response: res, body: html });
    });
    await page.goto(BASE + '/contact/');
    await page.fill('input[name=name]', 'Test Person');
    await page.fill('input[name=email]', 'test@example.com');
    await page.click('button[type=submit]');
    await page.waitForTimeout(400);
    await page.unrouteAll();
  };
  await withEndpoint(500, '{"ok":false}');
  check('server failure shows an error, not "Thank you"', await visible('#cw-form-error') && !(await visible('[data-cw-sent]')));
  await withEndpoint(200, '{"ok":true}');
  check('confirmed save shows "Thank you" and focuses it',
    await visible('[data-cw-sent]') && await page.evaluate(() => document.activeElement.tagName) === 'H2');

  // 404 page for unknown URLs (served by GitHub Pages; the dev server serves it too).
  const res = await page.goto(BASE + '/no-such-page/');
  check('unknown URL returns 404 page', res.status() === 404 && (await page.textContent('h1')).length > 0);

  // Search engines: structured data, per-product preview images, llms.txt and the IndexNow key file.
  const ld = async (u) => { await page.goto(BASE + u); return page.$$eval('script[type="application/ld+json"]', s => s.map(x => JSON.parse(x.textContent)['@graph'].map(n => n['@type']).join(','))); };
  check('home structured data: company and website', (await ld('/')).join() === 'Organization,WebSite');
  check('product structured data: software, company, breadcrumbs', (await ld('/products/spectra/')).join() === 'SoftwareApplication,Organization,BreadcrumbList');
  check('product pages use their own preview image', (await page.getAttribute('meta[property="og:image"]', 'content')).endsWith('/og-spectra.png'));
  const llms = await page.goto(BASE + '/llms.txt'), llmsText = await llms.text();
  check('llms.txt is served, lists every product, plain text', llms.status() === 200 && ['Drishti.ai', 'Spectra', 'Assay'].every(n => llmsText.includes(`[${n}]`)) && !llmsText.includes('&amp;'));
  const robots = await (await page.goto(BASE + '/robots.txt')).text();
  check('robots.txt allows crawling and lists the sitemap', /Allow: \//.test(robots) && /Sitemap: /.test(robots));

  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
  process.exit(failures ? 1 : 0);
})();
