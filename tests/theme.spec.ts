import { test, expect } from '@playwright/test';

test.use({ colorScheme: 'dark', reducedMotion: 'reduce' });

for (const width of [360,390,430,768,1366,1440,1920]) {
  test(`complete themes and dialogs at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width < 800 ? 932 : 1080 });
    await page.goto('/');
    for (const theme of ['dark','light'] as const) {
      if (theme === 'light') await page.locator('.header .theme-toggle').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const surface = theme === 'dark' ? 'rgb(8, 8, 8)' : 'rgb(245, 240, 220)';
      const text = theme === 'dark' ? 'rgb(245, 240, 220)' : 'rgb(8, 8, 8)';
      for (const section of await page.locator('main > section').all()) {
        await expect(section).toHaveCSS('background-color', surface);
        await expect(section).toHaveCSS('color', text);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await page.locator('#home').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/themes/${width}-${theme}-hero.png` });
      for (const name of ['Explore Ground mount solar','PVsyst','View experience at Jayaam Group']) {
        await page.getByRole('button', { name, exact: true }).click();
        await expect(page.getByRole('dialog')).toHaveCSS('background-color', surface);
        await expect(page.getByRole('dialog')).toHaveCSS('color', text);
        await page.keyboard.press('Escape');
      }
      for (const id of ['about','expertise','projects','experience','education','contact']) {
        const section = page.locator(`#${id}`);
        for (const img of await section.locator('img').all()) {
          await img.scrollIntoViewIfNeeded();
          await expect.poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
        }
        if (width === 390 || width === 1440) await section.screenshot({ path: `artifacts/themes/${width}-${theme}-${id}.png`, style: '.header, .skip-link { visibility:hidden!important }' });
      }
    }
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme','light');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expect(page.locator('html')).toHaveAttribute('data-theme','light');
    await expect(page.locator('body')).not.toContainText(/CONCEPT ILLUSTRATION|awaiting approval|not a verified|A NOTE ON THE WORK/);
  });
}

test('circular reveal uses toggle coordinates in both directions and preserves open content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'PVsyst', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCSS('transform', 'none');
  const scroll = await page.evaluate(() => scrollY);
  for (const theme of ['light','dark']) {
    const toggle = page.locator('dialog .theme-toggle');
    const rect = (await toggle.boundingBox())!;
    await toggle.click();
    await expect.poll(() => page.evaluate(() => document.getAnimations().some(a => (a.effect as KeyframeEffect)?.pseudoElement === '::view-transition-new(root)'))).toBe(true);
    const frames = await page.evaluate(() => {
      const animation = document.getAnimations().find(a => (a.effect as KeyframeEffect)?.pseudoElement === '::view-transition-new(root)')!;
      animation.pause(); animation.currentTime = 380;
      return (animation.effect as KeyframeEffect).getKeyframes().map(frame => frame.clipPath);
    });
    const origin = String(frames[0]).match(/at ([\d.]+)px ([\d.]+)px/)!;
    expect(Number(origin[1])).toBeCloseTo(rect.x + rect.width / 2, 1);
    expect(Number(origin[2])).toBeCloseTo(rect.y + rect.height / 2, 1);
    await page.screenshot({ path: `artifacts/themes/reveal-${theme}.png` });
    await page.evaluate(() => document.getAnimations().filter(a => (a.effect as KeyframeEffect)?.pseudoElement === '::view-transition-new(root)').forEach(a => a.play()));
    await expect(toggle).toBeEnabled();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
    expect(await page.evaluate(() => scrollY)).toBe(scroll);
  }
  await page.keyboard.press('Escape');
  expect(errors).toEqual([]);
});

test('system preference, reduced motion, fallback and resize leave no blocking layer', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await page.locator('.header .theme-toggle').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme','light');
  await expect(page.locator('.theme-curtain')).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => Object.defineProperty(document, 'startViewTransition', { value: undefined }));
  await page.locator('.header .theme-toggle').click();
  await expect(page.locator('.theme-curtain')).toHaveCount(1);
  await page.setViewportSize({ width: 430, height: 932 });
  await expect(page.locator('.theme-curtain')).toHaveCount(0);
  await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
  await expect(page.locator('.header .theme-toggle')).toBeEnabled();
});

for (const width of [390,1440]) {
  test(`header circular reveal and rapid-click guard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');
    await expect(page.locator('.hero-letter').last()).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)');
    for (const theme of ['light','dark']) {
      const toggle = page.locator('.header .theme-toggle');
      const bounds = (await toggle.boundingBox())!;
      await toggle.click();
      await expect.poll(() => page.evaluate(() => document.getAnimations().some(a => (a.effect as KeyframeEffect)?.pseudoElement === '::view-transition-new(root)'))).toBe(true);
      const frames = await page.evaluate(() => {
        const animation = document.getAnimations().find(a => (a.effect as KeyframeEffect)?.pseudoElement === '::view-transition-new(root)')!;
        animation.pause(); animation.currentTime = 180;
        return (animation.effect as KeyframeEffect).getKeyframes().map(f => String(f.clipPath));
      });
      const origin = frames[0].match(/at ([\d.]+)px ([\d.]+)px/)!;
      expect(Number(origin[1])).toBeCloseTo(bounds.x + bounds.width / 2, 1);
      expect(Number(origin[2])).toBeCloseTo(bounds.y + bounds.height / 2, 1);
      await toggle.evaluate(el => { el.click(); el.click(); });
      await expect(toggle).toBeDisabled();
      await page.screenshot({ path: `artifacts/themes/${width}-circle-${theme}.png` });
      await page.evaluate(() => document.getAnimations().filter(a => (a.effect as KeyframeEffect)?.pseudoElement === '::view-transition-new(root)').forEach(a => a.play()));
      await expect(toggle).toBeEnabled();
      await expect(page.locator('html')).toHaveAttribute('data-theme',theme);
      await expect(toggle).toBeFocused();
    }
    if (width === 390) {
      await page.getByRole('button', { name: 'Open navigation' }).click();
      await page.locator('dialog .theme-toggle').click();
      await expect(page.locator('dialog .theme-toggle')).toBeEnabled();
      await expect(page.getByRole('navigation', { name: 'Mobile navigation' })).toBeVisible();
    }
  });
}
