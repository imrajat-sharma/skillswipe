export const discoverToggleValue = (items, value) =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value];
