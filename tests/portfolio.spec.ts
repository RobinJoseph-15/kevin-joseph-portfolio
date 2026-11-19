import { test, expect } from '@playwright/test';

test.use({ reducedMotion: 'reduce' });

test('editorial page renders and scroll animations reveal every section', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName('I. Kevin Joseph');
  await expect(page.locator('.hero-letter').first()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.locator('main > section')).toHaveCount(7);
  await page.screenshot({ path: 'artifacts/redesign-desktop-cover.png' });
  for (const id of ['about','expertise','projects','experience','education','contact']) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    for (const heading of await page.locator(`#${id} [data-heading]`).all()) {
      await heading.scrollIntoViewIfNeeded();
      await expect(heading.locator('.line-inner').last()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    }
    for (const element of await page.locator(`#${id} [data-reveal]`).all()) {
      await element.scrollIntoViewIfNeeded();
      await expect(element).toHaveCSS('opacity', '1');
    }
    await page.locator(`#${id}`).screenshot({ path: `artifacts/redesign-desktop-${id}.png`, style: '.header, .skip-link { visibility: hidden !important; }' });
  }
  for (const img of await page.locator('main img').all()) {
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('every skill and category opens the correct information overlay', async ({ page }) => {
  await page.goto('/#expertise');
  for (const name of ['SolidWorks','CATIA','AutoCAD','SketchUp','STAAD','PVsyst','Single-Line Diagrams','BOM Preparation','Technical Reports','MS Office']) {
    await page.getByRole('button', { name, exact: true }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(name);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
  }
  for (const name of ['CAD & Design','Engineering','Documentation']) {
    await page.getByRole('button', { name: `Explore ${name}`, exact: true }).click();
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(name);
    await expect(page.locator('.overlay-list li').first()).toBeVisible();
    await page.getByRole('button', { name: 'Close overlay' }).click();
  }
});

test('all five projects open image details and preserve the current page position', async ({ page }) => {
  await page.goto('/#projects');
  for (const name of ['Ground mount solar','Solar rooftop','Solar tracker','Mobile home solar','Battery storage system']) {
    const trigger = page.getByRole('button', { name: `Explore ${name}`, exact: true });
    await trigger.scrollIntoViewIfNeeded();
    const before = await page.evaluate(() => scrollY);
    await trigger.click();
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(name);
    await expect(page.locator('.overlay-photo img')).toHaveJSProperty('complete', true);
    await expect(page.locator('.overlay-note')).toHaveCount(0);
    await expect(page.locator('.overlay-description')).not.toBeEmpty();
    expect(await page.evaluate(() => getComputedStyle(document.body).overflow)).toBe('hidden');
    if (name === 'Ground mount solar') await page.getByRole('dialog').screenshot({ path: 'artifacts/redesign-project-overlay.png' });
    await page.getByRole('button', { name: 'Close overlay' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(trigger).toBeFocused();
    expect(Math.abs((await page.evaluate(() => scrollY)) - before)).toBeLessThan(2);
    expect(await page.evaluate(() => document.body.style.overflow)).toBe('');
  }
});

test('experience, education and recognition show verified information', async ({ page }) => {
  await page.goto('/#experience');
  for (const company of ['Jayaam Group','Illumine Industries Pvt Ltd']) {
    await page.getByRole('button', { name: `View experience at ${company}` }).click();
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(company);
    await expect(page.locator('.overlay-list li')).toHaveCount(4);
    await expect(page.locator('.overlay-tags')).not.toBeEmpty();
    await page.keyboard.press('Escape');
  }
  for (const name of ['B.E. Mechanical Engineering','CATIA Professional Certification','Performance Excellence Awards']) {
    await page.getByRole('button', { name: `Read about ${name}` }).click();
    await expect(page.getByRole('dialog').getByRole('heading', { level: 2 })).toHaveText(name);
    await page.getByRole('button', { name: 'Close overlay' }).click();
  }
  await expect(page.locator('#education .lucide-graduation-cap')).toHaveCount(1);
  await expect(page.locator('#education .lucide-award')).toHaveCount(1);
  await expect(page.locator('#education .lucide-badge-check')).toHaveCount(1);
});

test('dialog contains keyboard focus, closes outside and restores its opener', async ({ page }) => {
  await page.goto('/#expertise');
  const trigger = page.getByRole('button', { name: 'PVsyst', exact: true });
  await trigger.click();
  await expect(page.getByRole('button', { name: 'Close overlay' })).toBeFocused();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Tab');
    expect(await page.evaluate(() => document.querySelector('.app')!.contains(document.activeElement))).toBe(false);
  }
  await page.mouse.click(5,5);
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('Gmail compose opens with the recipient, mailto fallback and copy work', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read','clipboard-write']);
  await context.route('https://mail.google.com/**', route => route.fulfill({ contentType: 'text/html', body: '<title>Gmail link destination test</title>' }));
  await page.goto('/#contact');
  const gmailLinks = page.getByRole('link', { name: /open Gmail compose/ });
  await expect(gmailLinks).toHaveCount(2);
  for (const gmail of await gmailLinks.all()) {
    await expect(gmail).toHaveAttribute('href', 'https://mail.google.com/mail/?view=cm&fs=1&to=kevinjoseph472001%40gmail.com');
    const popupPromise = page.waitForEvent('popup');
    await gmail.click();
    const popup = await popupPromise;
    await expect(popup).toHaveURL(/to=kevinjoseph472001%40gmail.com/);
    await popup.close();
  }
  await expect(page.locator('.contact-email > a')).toHaveAttribute('href', 'mailto:kevinjoseph472001@gmail.com');
  await page.getByRole('button', { name: 'COPY EMAIL ADDRESS' }).click();
  await expect(page.getByRole('status')).toHaveText('Email copied.');
});

for (const width of [360,375,390,430,768,1024,1366,1440,1920]) {
  test(`responsive layout and overlay at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 600 ? 844 : 1000 });
    await page.goto('/');
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    // Decorative SVG strokes intentionally extend beyond headings; check the actual text.
    const overflow = await page.locator('main h1, main h2').evaluateAll(elements => elements.filter(el => {
      const bounds = el.getBoundingClientRect();
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        if (!node.textContent?.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(node);
        if ([...range.getClientRects()].some(rect => rect.right > bounds.right + 2 || rect.left < bounds.left - 2)) return true;
      }
      return false;
    }).map(el => el.id));
    expect(overflow).toEqual([]);
    await page.screenshot({ path: `artifacts/redesign-${width}.png` });
    if (width === 390) {
      for (const id of ['about','expertise','projects','experience','education','contact']) {
        for (const photo of await page.locator(`#${id} img`).all()) {
          await photo.scrollIntoViewIfNeeded();
          await expect.poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
        }
        await page.locator(`#${id}`).screenshot({ path: `artifacts/redesign-mobile-${id}.png`, style: '.header, .skip-link { visibility: hidden !important; }' });
      }
    }
    if (width <= 800) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
      await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'Education' }).click();
      await expect(page.getByRole('dialog')).toBeHidden();
      await expect(page).toHaveURL(/#education/);
    } else {
      await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Education', exact: true }).click();
      await expect(page).toHaveURL(/#education/);
    }
    await page.getByRole('button', { name: 'Read about B.E. Mechanical Engineering' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect(await page.getByRole('dialog').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    const bounds = await page.getByRole('dialog').boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    if (width === 390) await page.getByRole('dialog').screenshot({ path: 'artifacts/redesign-mobile-overlay.png' });
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();
    expect(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
  });
}

test('all navigation destinations and page actions scroll to their sections', async ({ page }) => {
  await page.goto('/');
  const checkDestination = async (id: string) => {
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect.poll(async () => Math.round((await page.locator(`#${id}`).boundingBox())!.y)).toBeGreaterThanOrEqual(0);
    expect((await page.locator(`#${id}`).boundingBox())!.y).toBeLessThan(150);
  };
  for (const id of ['about','expertise','projects','experience','education','contact','home']) {
    await page.locator(`.desktop-navigation a[href="#${id}"]`).click();
    await checkDestination(id);
  }
  await page.locator('.cover-description a').click();
  await checkDestination('projects');
  await page.locator('footer a').click();
  await checkDestination('home');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const id of ['about','expertise','projects','experience','education','contact','home']) {
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await page.locator(`.overlay-navigation a[href="#${id}"]`).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect.poll(async () => Math.round((await page.locator(`#${id}`).boundingBox())!.y)).toBeLessThan(150);
    await checkDestination(id);
  }
});
