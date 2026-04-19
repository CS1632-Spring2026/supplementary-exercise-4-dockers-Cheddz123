import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:8080/');
  await page.evaluate(() => {
    document.cookie = "1=false";
    document.cookie = "2=false";
    document.cookie = "3=false";
  });
  await page.reload();
});

test('TEST-1-RESET', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "1=true";
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
  await page.reload();
  await page.getByRole('link', { name: 'Reset' }).click();
  await expect(page.locator('#cat-id1')).toContainText('ID 1. Jennyanydots');
  await expect(page.locator('#cat-id2')).toContainText('ID 2. Old Deuteronomy');
  await expect(page.locator('#cat-id3')).toContainText('ID 3. Mistoffelees');
});

test('TEST-2-CATALOG', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await expect(page.locator('img').nth(1)).toHaveAttribute('src', '/images/cat2.jpg');
});

test('TEST-3-LISTING', async ({ page }) => {
  await page.getByRole('link', { name: 'Catalog' }).click();
  await expect(page.locator('#listing li')).toHaveCount(3);
  await expect(page.locator('#listing li').nth(2)).toContainText('ID 3. Mistoffelees');
});

test('TEST-4-RENT-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await expect(page.getByRole('button', { name: 'Rent' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Return' })).toBeVisible();
});

test('TEST-5-RENT', async ({ page }) => {
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.locator('#rentID').fill('1');
  await page.getByRole('button', { name: 'Rent' }).click();
  await expect(page.locator('#listing li').nth(0)).toContainText('Rented out');
  await expect(page.locator('#listing li').nth(1)).toContainText('ID 2. Old Deuteronomy');
  await expect(page.locator('#listing li').nth(2)).toContainText('ID 3. Mistoffelees');
  await expect(page.locator('#rentResult')).toContainText('Success!');
});

test('TEST-6-RETURN', async ({ page }) => {
  await page.evaluate(() => {
    document.cookie = "2=true";
    document.cookie = "3=true";
  });
  await page.reload();
  await page.getByRole('link', { name: 'Rent-A-Cat' }).click();
  await page.locator('#returnID').fill('2');
  await page.getByRole('button', { name: 'Return' }).click();
  await expect(page.locator('#cat-id1')).toContainText('ID 1. Jennyanydots');
  await expect(page.locator('#cat-id2')).toContainText('ID 2. Old Deuteronomy');
  await expect(page.locator('#cat-id3')).toContainText('Rented out');
  await expect(page.locator('#returnResult')).toContainText('Success!');
});

test('TEST-7-FEED-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await expect(page.getByRole('button', { name: 'Feed' })).toBeVisible();
});

test('TEST-8-FEED', async ({ page }) => {
  await page.getByRole('link', { name: 'Feed-A-Cat' }).click();
  await page.locator('#catnips').fill('6');
  await page.getByRole('button', { name: 'Feed' }).click();
  await expect(page.locator('#feedResult')).toContainText('Nom, nom, nom.', { timeout: 10000 });
});

test('TEST-9-GREET-A-CAT', async ({ page }) => {
  await page.getByRole('link', { name: 'Greet-A-Cat' }).click();
  await expect(page.locator('body')).toContainText('Meow!Meow!Meow!');
});

test('TEST-10-GREET-A-CAT-WITH-NAME', async ({ page }) => {
  await page.goto('http://localhost:8080/greet-a-cat/Jennyanydots');
  await expect(page.locator('body')).toContainText('Meow! from Jennyanydots.');
});