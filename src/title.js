// The list's name, shown as the page's heading.
export function createTitle(initial = "Shopping list") {
  let name = initial;

  return {
    get: () => name,

    set(next) {
      if (next === "" || next == null) return { error: "Enter a list name" };
      name = String(next).trim();
      return { name };
    },
  };
}
