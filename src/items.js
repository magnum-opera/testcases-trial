const QUANTITY_ERROR = "Quantity must be a whole number from 1 to 99";

// Judges the written form, not Number(): "2.0" must be refused. Refuses "" too; #7 reuses it.
function quantityRule(value) {
  const written = String(value ?? "");
  if (!/^\d+$/.test(written)) return { error: QUANTITY_ERROR };
  const quantity = Number(written);
  if (quantity < 1 || quantity > 99) return { error: QUANTITY_ERROR };
  return { quantity };
}

// The shopping list, held in memory for the life of the server.
export function createList() {
  const items = [];
  let nextId = 1;

  return {
    all: () => items.map((item) => ({ ...item })),

    add(name, quantity) {
      const trimmed = String(name ?? "").trim();
      if (trimmed === "") return { error: "Enter an item name" };
      const judged = quantity === undefined || quantity === "" ? { quantity: 1 } : quantityRule(quantity);
      if (judged.error) return judged;
      const item = { id: nextId++, name: trimmed, quantity: judged.quantity };
      items.push(item);
      return { item: { ...item } };
    },

    // No default here: an emptied quantity is refused (TC-4.11).
    changeQuantity(id, quantity) {
      const item = items.find((candidate) => candidate.id === id);
      if (!item) return { error: "Not found", notFound: true };
      const judged = quantityRule(quantity);
      if (judged.error) return judged;
      item.quantity = judged.quantity;
      return { item: { ...item } };
    },
  };
}
