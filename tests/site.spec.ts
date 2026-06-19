import { test, expect } from '@playwright/test';

test.describe('Flower Stalk site', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct lang/dir and Arabic title', async ({ page }) => {
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page).toHaveTitle(/Flower Stalk/);
  });

  test('hero headline and CTAs render', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('ورد');
    await expect(page.getByRole('link', { name: 'اطلب باقتك الآن' })).toBeVisible();
  });

  test('trust bar cites the real Google rating', async ({ page }) => {
    await expect(page.locator('.trust')).toContainText('4.9');
    await expect(page.locator('.trust')).toContainText('115');
  });

  test('every image has a src that resolves and an alt', async ({ page }) => {
    // Scroll the whole page so lazy images get a chance to load
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        let y = 0;
        const step = () => {
          window.scrollBy(0, 600);
          y += 600;
          if (y < document.body.scrollHeight) setTimeout(step, 60);
          else { window.scrollTo(0, 0); resolve(); }
        };
        step();
      });
    });
    const imgs = page.locator('main img, header img, footer img');
    const count = await imgs.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const img = imgs.nth(i);
      await expect(img).toHaveAttribute('alt', /.+/);
      await expect
        .poll(async () => img.evaluate((el: HTMLImageElement) => el.naturalWidth), { timeout: 5000 })
        .toBeGreaterThan(0);
    }
  });

  test('preloader hides', async ({ page }) => {
    await expect(page.locator('#preloader')).toBeHidden({ timeout: 3000 });
  });

  test('full-screen mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('#burger').click();
    const menu = page.locator('#mobile-menu');
    await expect(menu).toHaveClass(/is-open/);
    // Full-screen overlay
    const box = await menu.boundingBox();
    expect(box?.width).toBeGreaterThan(380);
    await page.locator('#menu-close').click();
    await expect(menu).not.toHaveClass(/is-open/);
  });

  test('no horizontal scroll at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow).toBeFalsy();
  });

  test('order form validates and builds a WhatsApp link', async ({ page }) => {
    await page.locator('#order-form button[type="submit"]').click();
    await expect(page.locator('.field--invalid').first()).toBeVisible();

    await page.fill('#f-name', 'سارة العتيبي');
    await page.fill('#f-phone', '0551234567');
    await page.selectOption('#f-type', 'باقة ورد');

    const popupPromise = page.waitForEvent('popup');
    await page.locator('#order-form button[type="submit"]').click();
    await expect(page.locator('#toast')).toHaveClass(/is-show/);
    const popup = await popupPromise;
    // wa.me may redirect to api.whatsapp.com/send — assert the number + message in either form
    expect(popup.url()).toContain('966534018920');
    expect(decodeURIComponent(popup.url())).toContain('سارة');
  });

  test('localStorage stores demo order', async ({ page }) => {
    await page.fill('#f-name', 'محمد');
    await page.fill('#f-phone', '0539876543');
    await page.selectOption('#f-type', 'صندوق هدايا');
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#order-form button[type="submit"]').click();
    await popupPromise;
    const orders = await page.evaluate(() => localStorage.getItem('fs_orders'));
    expect(orders).toContain('محمد');
  });

  test('gallery lightbox opens', async ({ page }) => {
    await page.locator('.gcard').first().click();
    await expect(page.locator('#lightbox')).toHaveClass(/is-open/);
    await page.locator('#lightbox-close').click();
    await expect(page.locator('#lightbox')).not.toHaveClass(/is-open/);
  });

  test('JSON-LD Florist with aggregateRating present', async ({ page }) => {
    const json = await page.locator('script[type="application/ld+json"]').textContent();
    expect(json).toContain('"Florist"');
    expect(json).toContain('"ratingValue": "4.9"');
    expect(json).toContain('"reviewCount": "115"');
  });
});
