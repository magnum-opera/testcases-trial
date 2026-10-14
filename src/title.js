// The list's name, shown as the page's heading.
export function createTitle(initial = "Shopping list") {
  let name = initial;

  return {
    get: () => name,

    set(next) {
      const trimmed = String(next ?? "").trim();
      if (trimmed === "") return { error: "Enter a list name" };
      name = trimmed;
      return { name };
    },
  };
}
