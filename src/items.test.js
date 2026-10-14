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

const shown = (list) => list.all().map(({ name, quantity }) => `${name} × ${quantity}`);

test("a changed quantity shows on the same item, in the same place", () => {
  const list = createList();
  list.add("Milk", "2");
  const bread = list.add("Bread", "1").item;
  list.add("Eggs", "6");
  assert.deepEqual(list.changeQuantity(bread.id, "4"), {
    item: { id: bread.id, name: "Bread", quantity: 4 },
  });
  assert.deepEqual(shown(list), ["Milk × 2", "Bread × 4", "Eggs × 6"]);
});

test("TC-4.9 A quantity outside 1 to 99 is refused when changing", () => {
  const list = createList();
  const milk = list.add("Milk", "2").item;
  list.add("Bread", "3");
  for (const quantity of ["0", "100"]) {
    assert.deepEqual(list.changeQuantity(milk.id, quantity), {
      error: "Quantity must be a whole number from 1 to 99",
    });
    assert.deepEqual(shown(list), ["Milk × 2", "Bread × 3"]);
  }
});

test("TC-4.10 A quantity not written as a whole number is refused when changing", () => {
  const list = createList();
  const milk = list.add("Milk", "2").item;
  list.add("Bread", "3");
  for (const quantity of ["2.5", "2.0", "-1", "three"]) {
    assert.deepEqual(list.changeQuantity(milk.id, quantity), {
      error: "Quantity must be a whole number from 1 to 99",
    });
    assert.deepEqual(shown(list), ["Milk × 2", "Bread × 3"]);
  }
});

test("TC-4.11 An emptied quantity is refused when changing", () => {
  const list = createList();
  const milk = list.add("Milk", "2").item;
  list.add("Bread", "3");
  assert.deepEqual(list.changeQuantity(milk.id, ""), {
    error: "Quantity must be a whole number from 1 to 99",
  });
  assert.deepEqual(shown(list), ["Milk × 2", "Bread × 3"]);
});

test("changing the quantity of an unknown item is refused", () => {
  const list = createList();
  list.add("Milk", "2");
  assert.ok(list.changeQuantity(99, "4").error);
  assert.deepEqual(shown(list), ["Milk × 2"]);
});

test("TC-4.5 A quantity outside 1 to 99 is refused when adding", () => {
  const list = createList();
  list.add("Milk", "2");
  for (const quantity of ["0", "100"]) {
    assert.deepEqual(list.add("Bread", quantity), {
      error: "Quantity must be a whole number from 1 to 99",
    });
    assert.deepEqual(shown(list), ["Milk × 2"]);
  }
});

test("TC-4.6 A quantity not written as a whole number is refused when adding", () => {
  const list = createList();
  list.add("Milk", "2");
  for (const quantity of ["2.5", "2.0", "-1", "three"]) {
    assert.deepEqual(list.add("Bread", quantity), {
      error: "Quantity must be a whole number from 1 to 99",
    });
    assert.deepEqual(shown(list), ["Milk × 2"]);
  }
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
