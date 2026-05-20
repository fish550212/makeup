import { CATEGORIES_KEY, DEFAULT_CATEGORIES, SAMPLE_ITEMS, STORAGE_KEY } from "../constants/inventory.js";

export function loadLocalItems() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return SAMPLE_ITEMS;

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : SAMPLE_ITEMS;
  } catch {
    return SAMPLE_ITEMS;
  }
}

export function saveLocalItems(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function loadLocalCategories() {
  const stored = localStorage.getItem(CATEGORIES_KEY);
  if (!stored) return [...DEFAULT_CATEGORIES];

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_CATEGORIES];
  } catch {
    return [...DEFAULT_CATEGORIES];
  }
}

export function saveLocalCategories(categories) {
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
}
