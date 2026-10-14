// The shopping list, held in memory for the life of the server.
export function createList() {
  const items = [];
  let nextId = 1;

  return {
    all: () => items.map((item) => ({ ...item })),

    add(name) {
      const trimmed = String(name ?? "").trim();
      if (trimmed === "") return { error: "Enter an item name" };
      const item = { id: nextId++, name: trimmed };
      items.push(item);
      return { item: { ...item } };
    },
  };
}
