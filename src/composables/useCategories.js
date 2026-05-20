import { computed, ref } from "vue";
import { ALL_CATEGORY, DEFAULT_CATEGORIES, DEFAULT_CATEGORY } from "../constants/inventory.js";
import { loadLocalCategories, saveLocalCategories } from "../services/localStorage.js";

export function normalizeCategories(categories) {
  return [
    DEFAULT_CATEGORY,
    ...new Set(
      categories
        .map((category) => String(category).trim())
        .filter(Boolean)
        .filter((category) => category !== DEFAULT_CATEGORY)
        .filter((category) => category !== ALL_CATEGORY),
    ),
  ];
}

export function useCategories(items) {
  const categories = ref(normalizeCategories(loadLocalCategories()));
  const selectedCategory = ref(ALL_CATEGORY);

  const itemCategories = computed(() => normalizeCategories(items.value.map((item) => item.category)));
  const activeCategories = computed(() => normalizeCategories([...categories.value, ...itemCategories.value]));
  const allCategories = computed(() => [ALL_CATEGORY, ...activeCategories.value]);

  function saveCategories(nextCategories) {
    categories.value = normalizeCategories(nextCategories.length ? nextCategories : DEFAULT_CATEGORIES);
    saveLocalCategories(categories.value);
    if (selectedCategory.value !== ALL_CATEGORY && !activeCategories.value.includes(selectedCategory.value)) {
      selectedCategory.value = ALL_CATEGORY;
    }
  }

  return {
    categories,
    selectedCategory,
    activeCategories,
    allCategories,
    saveCategories,
  };
}
