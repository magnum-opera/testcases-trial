import { test } from "node:test";
import assert from "node:assert/strict";
import { createTitle } from "./title.js";

test("names the list", () => {
  const title = createTitle();
  assert.deepEqual(title.set("Weekend shop"), { name: "Weekend shop" });
  assert.equal(title.get(), "Weekend shop");
});

test("TC-16.2 An empty list name is refused", () => {
  const title = createTitle();
  assert.deepEqual(title.set(""), { error: "Enter a list name" });
  assert.equal(title.get(), "Shopping list");
});

test("TC-18.1 A list name of only spaces is refused", () => {
  const title = createTitle();
  assert.deepEqual(title.set(" "), { error: "Enter a list name" });
  assert.equal(title.get(), "Shopping list");
});
