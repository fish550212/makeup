<script setup>
import { computed, onMounted, ref } from "vue";
import AppHeader from "./components/AppHeader.vue";
import InventoryGrid from "./components/InventoryGrid.vue";
import InventoryTable from "./components/InventoryTable.vue";
import ItemFormModal from "./components/ItemFormModal.vue";
import ItemDetailModal from "./components/ItemDetailModal.vue";
import CategoryManagerModal from "./components/CategoryManagerModal.vue";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal.vue";
import TotalAmountModal from "./components/TotalAmountModal.vue";
import ImageViewerModal from "./components/ImageViewerModal.vue";
import SavingOverlay from "./components/SavingOverlay.vue";
import ScrollTopButton from "./components/ScrollTopButton.vue";
import { ALL_CATEGORY } from "./constants/inventory.js";
import { useCategories } from "./composables/useCategories.js";
import { useInventory } from "./composables/useInventory.js";
import { createId } from "./utils/item.js";

const viewMode = ref("grid");
const formOpen = ref(false);
const detailOpen = ref(false);
const categoryOpen = ref(false);
const deleteOpen = ref(false);
const totalOpen = ref(false);
const imageViewerOpen = ref(false);
const editingItem = ref(null);
const selectedItemId = ref("");
const pendingDeleteItem = ref(null);
const imageViewerSrc = ref("");

const temporaryItems = ref([]);
const { selectedCategory, activeCategories, allCategories, saveCategories } = useCategories(temporaryItems);
const {
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
} = useInventory(selectedCategory);

temporaryItems.value = items.value;

const selectedItem = computed(() => items.value.find((item) => item.id === selectedItemId.value));
const resultText = computed(() => `${selectedCategory.value}，共 ${filteredItems.value.length} 件`);

function openCreateForm() {
  editingItem.value = null;
  formOpen.value = true;
}

function openEditForm(item) {
  editingItem.value = item;
  formOpen.value = true;
}

function openDetail(item) {
  selectedItemId.value = item.id;
  detailOpen.value = true;
}

function requestDelete(item) {
  pendingDeleteItem.value = item;
  deleteOpen.value = true;
}

function openImage(src) {
  imageViewerSrc.value = src;
  imageViewerOpen.value = true;
}

async function saveItem(payload) {
  const item = {
    ...payload,
    id: payload.id || createId(),
    sold: payload.sold ? "已賣出" : "庫存中",
  };
  await persistItem(payload.id ? "update" : "create", item);
  temporaryItems.value = items.value;
  formOpen.value = false;
  selectedItemId.value = item.id;
}

async function confirmDelete() {
  if (!pendingDeleteItem.value) return;
  await persistItem("delete", pendingDeleteItem.value);
  temporaryItems.value = items.value;
  deleteOpen.value = false;
  detailOpen.value = false;
  pendingDeleteItem.value = null;
}

function handleCategoriesSave(nextCategories) {
  saveCategories(nextCategories);
  categoryOpen.value = false;
}

onMounted(async () => {
  await loadItems();
  temporaryItems.value = items.value;
});
</script>

<template>
  <AppHeader
    v-model:search="searchQuery"
    v-model:category="selectedCategory"
    :categories="allCategories"
    :total-amount="totalInventoryAmount"
    @add="openCreateForm"
    @manage-categories="categoryOpen = true"
    @show-total="totalOpen = true"
  />

  <main class="page">
    <div class="toolbar">
      <div class="count-pill">{{ resultText }}</div>
      <p class="status" :class="{ error: statusIsError }">{{ status }}</p>
      <div class="view-switch" aria-label="顯示模式">
        <button class="icon-btn" :class="{ active: viewMode === 'grid' }" type="button" @click="viewMode = 'grid'">
          ▦
        </button>
        <button class="icon-btn" :class="{ active: viewMode === 'list' }" type="button" @click="viewMode = 'list'">
          ☰
        </button>
      </div>
    </div>

    <InventoryGrid
      v-if="viewMode === 'grid'"
      :items="filteredItems"
      @select="openDetail"
    />
    <InventoryTable
      v-else
      :items="filteredItems"
      @select="openDetail"
    />

    <p v-if="filteredItems.length === 0" class="empty">目前沒有符合條件的品項</p>
  </main>

  <ItemDetailModal
    v-model:open="detailOpen"
    :item="selectedItem"
    @edit="openEditForm"
    @delete="requestDelete"
    @image="openImage"
  />

  <ItemFormModal
    v-model:open="formOpen"
    :item="editingItem"
    :categories="activeCategories"
    :saving="isSaving"
    @save="saveItem"
    @image="openImage"
  />

  <CategoryManagerModal
    v-model:open="categoryOpen"
    :categories="activeCategories"
    :all-category="ALL_CATEGORY"
    @save="handleCategoriesSave"
  />

  <ConfirmDeleteModal
    v-model:open="deleteOpen"
    :item="pendingDeleteItem"
    :saving="isSaving"
    @confirm="confirmDelete"
  />

  <TotalAmountModal v-model:open="totalOpen" :amount="totalInventoryAmount" />
  <ImageViewerModal v-model:open="imageViewerOpen" :src="imageViewerSrc" />
  <SavingOverlay :show="isLoading || isSaving" :text="isLoading ? loadingMessage : savingMessage" />
  <ScrollTopButton />
</template>
