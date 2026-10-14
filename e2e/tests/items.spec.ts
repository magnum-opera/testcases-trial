import type { Page } from "@playwright/test";
import { test, expect } from "../fixtures";

const REFUSAL = "Quantity must be a whole number from 1 to 99";

// The span carries "name × quantity"; the <li> also holds the row's Change button text.
const itemTexts = (page: Page) => page.getByRole("listitem").locator("span");
const row = (page: Page, name: string) => page.getByRole("listitem").filter({ hasText: `${name} × ` });

async function add(page: Page, name: string, quantity: string) {
  const before = await itemTexts(page).count();
  // Each row also has a "Quantity" field, so scope to the add form.
  const form = page.locator("form").filter({ has: page.getByRole("button", { name: "Add" }) });
  await form.getByLabel("Item", { exact: true }).fill(name);
  await form.getByLabel("Quantity", { exact: true }).fill(quantity);
  await form.getByRole("button", { name: "Add" }).click();
  // The page resets the form after the POST answers; filling before then loses the next item.
  await expect(itemTexts(page)).toHaveCount(before + 1);
}

async function changeQuantity(page: Page, name: string, quantity: string) {
  await row(page, name).getByLabel("Quantity", { exact: true }).fill(quantity);
  await row(page, name).getByRole("button", { name: "Change" }).click();
  await expect(row(page, name).locator("span")).toHaveText(`${name} × ${quantity}`);
}

const tick = (page: Page, name: string) => row(page, name).getByRole("checkbox").click();

test("TC-4.1 An item added with a quantity appears at the bottom of the list", { tag: ["@REQ-4.1", "@high"] }, async ({ page }) => {
  await page.goto("/");
  await add(page, "Milk", "2");
  await add(page, "Bread", "3");
  await expect(itemTexts(page)).toHaveText(["Milk × 2", "Bread × 3"]);
});

test("TC-4.3 An item added with no quantity has a quantity of 1", { tag: ["@REQ-4.2", "@high"] }, async ({ page }) => {
  await page.goto("/");
  await add(page, "Milk", "2");
  await add(page, "Bread", "");
  await expect(itemTexts(page)).toHaveText(["Milk × 2", "Bread × 1"]);
});

test("TC-4.4 Quantities of 1 and 99 are accepted when adding", { tag: ["@REQ-4.3", "@normal"] }, async ({ page }) => {
  await page.goto("/");
  await add(page, "Eggs", "99");
  await add(page, "Salt", "1");
  await expect(itemTexts(page)).toHaveText(["Eggs × 99", "Salt × 1"]);
  await expect(page.getByRole("alert")).not.toContainText(REFUSAL);
});

test("TC-4.7 A changed quantity shows in the same place on the list", { tag: ["@REQ-4.4", "@high"] }, async ({ page }) => {
  await page.goto("/");
  await add(page, "Milk", "2");
  await add(page, "Bread", "1");
  await add(page, "Eggs", "6");
  await row(page, "Bread").getByLabel("Quantity", { exact: true }).fill("4");
  await row(page, "Bread").getByRole("button", { name: "Change" }).click();
  await expect(itemTexts(page)).toHaveText(["Milk × 2", "Bread × 4", "Eggs × 6"]);
});

test("TC-4.8 Quantities of 1 and 99 are accepted when changing", { tag: ["@REQ-4.5", "@normal"] }, async ({ page }) => {
  await page.goto("/");
  await add(page, "Milk", "2");
  await add(page, "Bread", "3");
  await changeQuantity(page, "Milk", "99");
  await changeQuantity(page, "Bread", "1");
  await expect(itemTexts(page)).toHaveText(["Milk × 99", "Bread × 1"]);
  await expect(page.getByRole("alert")).not.toContainText(REFUSAL);
});

test("TC-4.12 A ticked-off item is struck through in the same place", { tag: ["@REQ-4.6", "@high"] }, async ({ page }) => {
  await page.goto("/");
  await add(page, "Milk", "2");
  await add(page, "Bread", "1");
  await add(page, "Eggs", "6");
  await tick(page, "Bread");
  await expect(itemTexts(page)).toHaveText(["Milk × 2", "Bread × 1", "Eggs × 6"]);
  await expect(itemTexts(page).nth(1)).toHaveCSS("text-decoration-line", "line-through");
  await expect(itemTexts(page).nth(0)).not.toHaveCSS("text-decoration-line", "line-through");
  await expect(itemTexts(page).nth(2)).not.toHaveCSS("text-decoration-line", "line-through");
});

test("TC-4.13 Ticking a ticked item again unticks it in the same place", { tag: ["@REQ-4.7", "@normal"] }, async ({ page }) => {
  await page.goto("/");
  await add(page, "Milk", "2");
  await add(page, "Bread", "1");
  await add(page, "Eggs", "6");
  await tick(page, "Bread");
  await expect(row(page, "Bread").locator("span")).toHaveCSS("text-decoration-line", "line-through");
  await tick(page, "Bread");
  await expect(itemTexts(page)).toHaveText(["Milk × 2", "Bread × 1", "Eggs × 6"]);
  for (const text of await itemTexts(page).all()) {
    await expect(text).not.toHaveCSS("text-decoration-line", "line-through");
  }
});
