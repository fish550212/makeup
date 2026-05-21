import { computed, ref } from "vue";
import { ALL_CATEGORY } from "../constants/inventory.js";
import { loadLocalItems, saveLocalItems } from "../services/localStorage.js";
import { sheetJsonp, sheetPost, useSheetApi } from "../services/inventoryApi.js";
import { itemFinalTotal } from "../utils/item.js";

const SEARCHABLE_FIELDS = ["name", "brand", "note", "pros", "cons", "review", "repurchase"];

export function useInventory(selectedCategory) {
  const items = ref([]);
  const searchQuery = ref("");
  const isLoading = ref(false);
  const isSaving = ref(false);
  const loadingMessage = ref("正在讀取");
  const savingMessage = ref("正在儲存");
  const status = ref("");
  const statusIsError = ref(false);

  const filteredItems = computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase();

    return items.value.filter((item) => {
      const matchCategory = selectedCategory.value === ALL_CATEGORY || item.category === selectedCategory.value;
      const matchKeyword =
        !keyword ||
        SEARCHABLE_FIELDS.map((field) => item[field] || "")
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchCategory && matchKeyword;
    });
  });

  const totalInventoryAmount = computed(() =>
    items.value.reduce((total, item) => {
      const itemTotal = itemFinalTotal(item);
      return itemTotal > 0 ? total + itemTotal : total;
    }, 0),
  );

  function setStatus(message, isError = false) {
    status.value = message;
    statusIsError.value = isError;
  }

  function updateItemState(action, item) {
    const index = items.value.findIndex((current) => current.id === item.id);

    if (action === "delete") {
      items.value = items.value.filter((current) => current.id !== item.id);
      return;
    }

    if (index >= 0) {
      items.value.splice(index, 1, item);
    } else {
      items.value = [item, ...items.value];
    }
  }

  async function loadItems() {
    isLoading.value = true;
    loadingMessage.value = "正在讀取";

    try {
      if (!useSheetApi()) {
        items.value = loadLocalItems();
        setStatus("使用本機資料");
        return;
      }

      setStatus("正在讀取 Google Sheets");
      const data = await sheetJsonp("list");
      items.value = Array.isArray(data.items) ? data.items : [];
      setStatus("已同步 Google Sheets");
    } catch (error) {
      items.value = loadLocalItems();
      setStatus(`${error.message}，已改用本機資料`, true);
    } finally {
      isLoading.value = false;
    }
  }

  async function persistItem(action, item) {
    isSaving.value = true;
    savingMessage.value = action === "delete" ? "正在刪除" : "正在儲存";

    try {
      updateItemState(action, item);

      if (useSheetApi()) {
        await sheetPost(action, item);
      } else {
        saveLocalItems(items.value);
      }

      setStatus("已儲存");
    } catch (error) {
      setStatus(error.message, true);
      await loadItems();
      throw error;
    } finally {
      isSaving.value = false;
      savingMessage.value = "正在儲存";
    }
  }

  return {
    items,
    searchQuery,
    filteredItems,
    totalInventoryAmount,
    isLoading,
    isSaving,
    loadingMessage,
    savingMessage,
    status,
    statusIsError,
    loadItems,
    persistItem,
    setStatus,
  };
}
