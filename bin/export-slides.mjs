import puppeteer from 'puppeteer';
import { mkdir, access } from 'fs/promises';
import { resolve } from 'path';

const outputDir = process.argv[2];
if (!outputDir) {
  console.error('Usage: node export-slides.mjs <output-folder>');
  console.error('Example: node export-slides.mjs "ig-carousel/260421-claude-design-economics/"');
  process.exit(1);
}

const absOut = resolve(outputDir);
const htmlFile = resolve(absOut, 'index.html');

// Verify the HTML exists in the target folder
try {
  await access(htmlFile);
} catch {
  console.error(`Error: index.html not found at ${htmlFile}`);
  console.error('Each carousel folder must contain its own index.html.');
  process.exit(1);
}

await mkdir(absOut, { recursive: true });

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();

// IG portrait slide — 1080x1350 at 2x retina
await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });

const htmlPath = `file://${htmlFile.replace(/\\/g, '/')}`;
await page.goto(htmlPath, { waitUntil: 'networkidle0' });

// Wait for fonts to load
await page.evaluate(() => document.fonts.ready);

// Hide the IG shell (header, dots, actions, arrows) so only slides export.
// Selectors match the current skill output (post-refactor):
//   .ig-header, .dots, .ig-actions(-wrap), .nav-arrow, .ig-frame, .carousel, #track
await page.evaluate(() => {
  const hide = (sel) => document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
  hide('.ig-header');
  hide('.ig-actions-wrap');
  hide('.ig-actions');
  hide('.dots');
  hide('.nav-arrows');
  hide('.nav-arrow');

  const frame = document.querySelector('.ig-frame');
  if (frame) {
    frame.style.borderRadius = '0';
    frame.style.boxShadow = 'none';
    frame.style.maxWidth = '100%';
    frame.style.width = '100%';
    frame.style.margin = '0';
  }

  const carousel = document.querySelector('.carousel');
  if (carousel) {
    carousel.style.overflow = 'hidden';
    carousel.style.width = '1080px';
    carousel.style.height = '1350px';
    carousel.style.aspectRatio = 'auto';
  }

  const track = document.getElementById('track');
  if (track) {
    track.style.scrollSnapType = 'none';
    track.style.height = '1350px';
  }

  // Force each slide to fill the 1080x1350 viewport so justify-content: center
  // lands the content in the true middle.
  document.querySelectorAll('.slide').forEach(slide => {
    slide.style.height = '1350px';
    slide.style.minHeight = '1350px';
    slide.style.width = '1080px';
  });

  document.body.style.background = 'transparent';
  document.body.style.padding = '0';
  document.body.style.margin = '0';
  document.body.style.display = 'block';
  document.body.style.minHeight = 'auto';
});

const slides = await page.$$('.slide');
console.log(`Found ${slides.length} slides in ${outputDir}`);

for (let i = 0; i < slides.length; i++) {
  // Scroll the target slide into view directly. More reliable than
  // computing scrollLeft, which can drift at viewport boundaries.
  await page.evaluate((idx) => {
    const slides = document.querySelectorAll('.slide');
    if (slides[idx]) {
      slides[idx].scrollIntoView({ behavior: 'instant', inline: 'start', block: 'nearest' });
    }
  }, i);

  // Settle delay for render after scroll
  await new Promise(r => setTimeout(r, 400));

  const num = String(i + 1).padStart(2, '0');
  const path = resolve(absOut, `slide-${num}.png`);
  await page.screenshot({ path, type: 'png' });
  console.log(`Exported: slide-${num}.png`);
}

await browser.close();
console.log(`\nDone! ${slides.length} slides saved to ${absOut}`);
