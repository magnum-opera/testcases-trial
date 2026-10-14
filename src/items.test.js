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

test("an item added with a quantity carries it, at the bottom of the list", () => {
  const list = createList();
  list.add("Milk", "2");
  list.add("Bread", "3");
  assert.deepEqual(
    list.all().map(({ name, quantity }) => ({ name, quantity })),
    [
      { name: "Milk", quantity: 2 },
      { name: "Bread", quantity: 3 },
    ],
  );
});

test("an item added with no quantity has a quantity of 1", () => {
  const list = createList();
  assert.equal(list.add("Milk").item.quantity, 1);
  assert.equal(list.add("Bread", "").item.quantity, 1);
});

test("a quantity that is not a whole number from 1 to 99 is refused", () => {
  const list = createList();
  list.add("Milk", "2");
  for (const quantity of ["0", "100", "2.5", "2.0", "-1", "three"]) {
    assert.deepEqual(list.add("Bread", quantity), {
      error: "Quantity must be a whole number from 1 to 99",
    });
  }
  assert.deepEqual(
    list.all().map(({ name, quantity }) => ({ name, quantity })),
    [{ name: "Milk", quantity: 2 }],
  );
});

test("TC-4.2 An empty item name is refused whatever the quantity", () => {
  const list = createList();
  list.add("Milk", "2");
  assert.deepEqual(list.add("   ", "3"), { error: "Enter an item name" });
  assert.deepEqual(list.add("   ", "0"), { error: "Enter an item name" });
  assert.deepEqual(
    list.all().map(({ name, quantity }) => ({ name, quantity })),
    [{ name: "Milk", quantity: 2 }],
  );
});
