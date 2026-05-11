import puppeteer from 'puppeteer';
import { mkdir, writeFile } from 'fs/promises';
import { resolve, join } from 'path';

const url = process.argv[2];
const outDir = process.argv[3];

if (!url) {
  console.error('Usage: node swipe-carousel.mjs <post-url> [output-folder]');
  console.error('');
  console.error('Example:');
  console.error('  node swipe-carousel.mjs "https://www.instagram.com/p/ABC123/" "swipe-file/260509-creator-x/"');
  console.error('');
  console.error('Env flags:');
  console.error('  HEADLESS=false   — open visible browser so you can login or dismiss modals manually');
  console.error('  WAIT_MS=8000     — pause N ms after page load before capture (default 3000)');
  process.exit(1);
}

const absOut = resolve(outDir || `swipe-file/swipe-${Date.now()}`);
await mkdir(absOut, { recursive: true });

const headless = process.env.HEADLESS !== 'false';
const waitMs = parseInt(process.env.WAIT_MS || '3000');

console.log(`Opening: ${url}`);
console.log(`Mode: ${headless ? 'headless' : 'headed — login manually if needed'}`);

const browser = await puppeteer.launch({
  headless,
  defaultViewport: { width: 1280, height: 1600 }
});
const page = await browser.newPage();
await page.setUserAgent(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
);

await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
console.log(`Page loaded. Waiting ${waitMs}ms for dynamic content to settle...`);
await new Promise(r => setTimeout(r, waitMs));

// Extract candidate slide images. Filter by aspect ratio + min size to skip
// avatars, recommendations, icons, etc. Pull highest-res from srcset.
const images = await page.evaluate(() => {
  const all = Array.from(document.querySelectorAll('img'));
  const seen = new Set();
  const slides = [];

  for (const img of all) {
    const rect = img.getBoundingClientRect();
    if (rect.width < 300 || rect.height < 300) continue;

    const ratio = rect.width / rect.height;
    if (ratio < 0.5 || ratio > 1.5) continue;

    let best = img.currentSrc || img.src;
    const srcset = img.getAttribute('srcset');
    if (srcset) {
      let maxW = 0;
      for (const part of srcset.split(',').map(s => s.trim())) {
        const [u, w] = part.split(/\s+/);
        const wn = parseInt((w || '').replace('w', '')) || 0;
        if (wn > maxW) { maxW = wn; best = u; }
      }
    }

    if (!best || seen.has(best)) continue;
    seen.add(best);
    slides.push({ src: best, w: Math.round(rect.width), h: Math.round(rect.height) });
  }

  return slides;
});

console.log(`Detected ${images.length} candidate slide image(s).`);

if (images.length === 0) {
  console.error('');
  console.error('No slides found. Likely causes:');
  console.error('  - Login wall blocked the post → re-run with HEADLESS=false');
  console.error('  - Post is private');
  console.error('  - Page needs longer to render → set WAIT_MS=8000');
  await browser.close();
  process.exit(1);
}

// Pull metadata for credit attribution
const meta = await page.evaluate(() => ({
  ogTitle: document.querySelector('meta[property="og:title"]')?.content || '',
  ogDesc: document.querySelector('meta[property="og:description"]')?.content || '',
  pageTitle: document.title,
}));

const handleMatch = (meta.ogTitle + ' ' + meta.pageTitle).match(/@([\w.]+)/);
const handle = handleMatch ? handleMatch[1] : null;

// Download each image via a second tab — preserves browser session/cookies
const dlPage = await browser.newPage();
let saved = 0;

for (let i = 0; i < images.length; i++) {
  const num = String(i + 1).padStart(2, '0');
  const dest = join(absOut, `slide-${num}.png`);

  try {
    const response = await dlPage.goto(images[i].src, { timeout: 30000 });
    const buffer = await response.buffer();
    await writeFile(dest, buffer);
    saved++;
    console.log(`Saved: slide-${num}.png (${images[i].w}x${images[i].h})`);
  } catch (e) {
    console.error(`Failed slide-${num}: ${e.message}`);
  }
}

// source.md is the credit-attribution audit trail. Don't skip the credit step
// when you publish the repurposed version.
const sourceMd = `# Source

- **URL:** ${url}
- **Handle:** ${handle ? '@' + handle : '(unknown — fill in manually before posting)'}
- **Captured:** ${new Date().toISOString()}
- **Slides saved:** ${saved} / ${images.length}
- **Page title:** ${meta.ogTitle || meta.pageTitle}

## Visible caption (from og:description)

${meta.ogDesc || '(no caption extracted — open the post manually to read)'}

## Repurpose workflow

This is a swipe-file reference. **Do not republish these images.** Use them to study the structure, then write your own version.

- [ ] Read all slides; note the strategy + slide-by-slide arc
- [ ] Identify which of the 9 emotional-psychology strategies it uses
- [ ] Draft your own version in your brand voice with your angle
- [ ] Credit the source in your caption — e.g. "h/t @${handle || '<creator>'}" or "Inspired by @${handle || '<creator>'}"
- [ ] Tag the original creator in the IG post if you want a reshare
`;

await writeFile(join(absOut, 'source.md'), sourceMd);
await browser.close();

console.log('');
console.log(`Done. Saved ${saved}/${images.length} slides to: ${absOut}`);
console.log(`Wrote source.md with credit attribution metadata.`);
