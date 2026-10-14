import { test, expect } from "../fixtures";

test("TC-2.1 An added item appears at the bottom of the list", { tag: ["@REQ-2.1", "@high"] }, async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("Item").fill("Milk");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("Item").fill("Bread");
  await page.getByRole("button", { name: "Add" }).click();
  await expect(page.getByRole("listitem")).toHaveText(["Milk", "Bread"]);
});
