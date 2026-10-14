import { test } from "node:test";
import assert from "node:assert/strict";
import { createList } from "./items.js";

test("adds an item to the bottom of the list", () => {
  const list = createList();
  list.add("Milk");
  list.add("Bread");
  assert.deepEqual(
    list.all().map((item) => item.name),
    ["Milk", "Bread"],
  );
});

test("TC-2.2 An empty item name is refused", () => {
  const list = createList();
  assert.deepEqual(list.add("   "), { error: "Enter an item name" });
  assert.deepEqual(list.all(), []);
});
