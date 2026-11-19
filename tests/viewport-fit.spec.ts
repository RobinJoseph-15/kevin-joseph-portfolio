import { test, expect } from '@playwright/test';

const viewports = [
  { width: 1366, height: 768 }, { width: 1440, height: 900 },
  { width: 1920, height: 1080 }, { width: 390, height: 844 },
  { width: 430, height: 932 },
];

for (const viewport of viewports) {
  test(`section compositions fit ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    const desktop = viewport.width >= 1200;
    const headerHeight = (await page.locator('.header').boundingBox())!.height;
    for (const section of await page.locator('main > section').all()) {
      const id = await section.getAttribute('id');
      for (const img of await section.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        await expect(img).toHaveCSS('object-fit', 'cover');
      }
      await section.evaluate((el, offset) => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - offset), headerHeight);
      const bounds = (await section.boundingBox())!;
      if (desktop) {
        expect(bounds.height, `${id} section height`).toBeLessThanOrEqual(viewport.height - headerHeight + 1);
        expect(bounds.y, `${id} below navigation`).toBeGreaterThanOrEqual(headerHeight - 1);
        expect(bounds.y + bounds.height, `${id} bottom visible`).toBeLessThanOrEqual(viewport.height + 1);
        const outside = await section.evaluate(el => {
          const parent = el.getBoundingClientRect();
          return [...el.querySelectorAll('button, a, p, h1, h2, h3, .photo, .section-label, footer')].filter(child => {
            const rect = child.getBoundingClientRect();
            return rect.height > 0 && (rect.bottom > parent.bottom + 1 || rect.top < parent.top - 1);
          }).map(child => child.className || child.tagName);
        });
        expect(outside, `${id} content remains within section`).toEqual([]);
        for (const control of await section.locator('button, a').all()) {
          expect(await control.evaluate(el => {
            const rect = el.getBoundingClientRect();
            return el.contains(document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2));
          }), `${id} control is not covered`).toBe(true);
        }
        const pairs: Record<string, [string, string][]> = {
          home: [['h1', '.cover-description'], ['.cover-description', '.cover-bottom']],
          about: [['.about-composition', '.about-columns'], ['.about-columns', '.word-band']],
          expertise: [['.expertise-heading', '.skill-grid'], ['.skill-grid', '.section-foot']],
          projects: [['.projects-heading', '.project-grid']],
          experience: [['.experience-heading', '.experience-intro'], ['.experience-intro', '.timeline']],
          education: [['.education-heading', '.education-list']],
          contact: [['.contact-composition', '.contact-details'], ['.contact-details', 'footer']],
        };
        for (const [above, below] of pairs[id!] || []) {
          const first = (await section.locator(above).boundingBox())!;
          const second = (await section.locator(below).boundingBox())!;
          expect(first.y + first.height, `${id}: ${above} does not overlap ${below}`).toBeLessThanOrEqual(second.y + 1);
        }
      }
      // Check text bounds, excluding intentional decorative SVG and photographic overlaps.
      const clipped = await section.locator('h1, h2, h3, button').evaluateAll(elements => elements.filter(el => {
        const bounds = el.getBoundingClientRect();
        const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent?.trim()) continue;
          const range = document.createRange(); range.selectNodeContents(node);
          if ([...range.getClientRects()].some(rect => rect.right > bounds.right + 2 || rect.left < bounds.left - 2)) return true;
        }
        return false;
      }).map(el => el.getAttribute('aria-label') || el.id || el.className));
      expect(clipped, `${id} text bounds`).toEqual([]);
      if (desktop) await page.screenshot({ path: `artifacts/viewport-fit/${viewport.width}-${viewport.height}-${id}.png` });
      else await section.screenshot({ path: `artifacts/viewport-fit/${viewport.width}-${viewport.height}-${id}.png`, style: '.header, .skip-link { visibility: hidden !important; }' });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const button = (await page.locator('.contact-action .gmail-link').boundingBox())!;
    const caption = (await page.locator('.contact-hint').boundingBox())!;
    expect(caption.y - button.y - button.height, 'Gmail caption spacing').toBeGreaterThanOrEqual(15);
    const contactHeading = (await page.locator('#contact-title').boundingBox())!;
    const contactStroke = (await page.locator('.contact-underline').boundingBox())!;
    expect(contactStroke.y, 'Contact underline below letterforms').toBeGreaterThanOrEqual(contactHeading.y + contactHeading.height);
    const aboutLine = (await page.locator('.about-second').boundingBox())!;
    const aboutStroke = (await page.locator('.about-second .scribble').boundingBox())!;
    expect(aboutStroke.y, 'About underline below letterforms').toBeGreaterThanOrEqual(aboutLine.y + aboutLine.height);
    if (desktop) {
      const labels = await page.locator('.about-columns > div > .meta').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().y));
      expect(Math.max(...labels) - Math.min(...labels), 'About label baseline').toBeLessThan(1);
      const guides = await page.locator('.brand, #about .section-label, #contact footer').evaluateAll(elements => elements.map(el => el.getBoundingClientRect().x));
      expect(Math.max(...guides) - Math.min(...guides), 'Shared page guides').toBeLessThan(1);
    }
    await expect(page.locator('html')).toHaveCSS('scroll-snap-type', 'none');
    for (const name of ['Explore Ground mount solar', 'Explore Solar rooftop', 'Explore Solar tracker', 'Explore Mobile home solar', 'Explore Battery storage system', 'PVsyst', 'View experience at Jayaam Group', 'Read about B.E. Mechanical Engineering']) {
      await page.getByRole('button', { name, exact: true }).click();
      await expect(page.getByRole('dialog')).toBeVisible();
      const modal = (await page.getByRole('dialog').boundingBox())!;
      expect(modal.y).toBeGreaterThanOrEqual(0);
      expect(modal.y + modal.height).toBeLessThanOrEqual(viewport.height + 1);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('dialog')).toBeHidden();
    }
    expect(errors).toEqual([]);
  });
}
