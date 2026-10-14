import { test, expect } from "@playwright/test";

test("TC-16.1 A renamed list shows its name as the heading", { tag: ["@REQ-16.1", "@normal"] }, async ({ page }) => {
  await page.goto("/");
  await page.getByLabel("List name").fill("Weekend shop");
  await page.getByRole("button", { name: "Rename" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Weekend shop");
});
