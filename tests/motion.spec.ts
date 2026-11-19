import { test, expect } from '@playwright/test';

test('image entrances release hover transforms and reduced motion clears masks', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const card = page.getByRole('button', { name: 'Explore Ground mount solar', exact: true });
  const image = card.locator('img');
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
  await expect.poll(() => image.evaluate(el => el.style.transform)).toBe('');
  await card.hover();
  await expect(image).toHaveCSS('transform', 'matrix(1.04, 0, 0, 1.04, 0, 0)');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('main .photo').evaluateAll(elements => elements.every(el => !(el as HTMLElement).style.clipPath))).toBe(true);
  await card.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});
