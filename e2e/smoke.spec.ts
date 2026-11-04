import { expect, test } from "@playwright/test";

const pages = ["/", "/about", "/enquiry", "/faq"] as const;

for (const path of pages) {
  test(`loads ${path}`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.ok()).toBeTruthy();
    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("link", { name: /balo india/i }).first()).toBeVisible();
  });
}
