<script setup>
import { computed, ref, watch } from "vue";
import BaseModal from "./BaseModal.vue";
import UnsavedChangesModal from "./UnsavedChangesModal.vue";

const props = defineProps({
  open: Boolean,
  categories: {
    type: Array,
    default: () => [],
  },
  allCategory: {
    type: String,
    default: "全部",
  },
});

const emit = defineEmits(["update:open", "save"]);
const draft = ref([]);
const originalDraft = ref([]);
const newCategory = ref("");
const error = ref("");
const unsavedOpen = ref(false);

const isDirty = computed(() => {
  return JSON.stringify(draft.value) !== JSON.stringify(originalDraft.value) || newCategory.value.trim().length > 0;
});

watch(
  () => [props.open, props.categories],
  () => {
    if (!props.open) return;
    draft.value = [...props.categories];
    originalDraft.value = [...props.categories];
    newCategory.value = "";
    error.value = "";
    unsavedOpen.value = false;
  },
  { immediate: true },
);

function addCategory() {
  const name = newCategory.value.trim();
  if (!name || name === props.allCategory) return;
  if (!draft.value.includes(name)) draft.value.push(name);
  newCategory.value = "";
}

function removeCategory(index) {
  draft.value.splice(index, 1);
}

function save() {
  const values = draft.value.map((category) => category.trim()).filter(Boolean);
  const duplicates = values.filter((value, index) => values.indexOf(value) !== index);

  if (values.length !== draft.value.length) {
    error.value = "分類名稱不可空白。";
    unsavedOpen.value = false;
    return false;
  }

  if (duplicates.length) {
    error.value = `分類名稱不可重複：${[...new Set(duplicates)].join("、")}`;
    unsavedOpen.value = false;
    return false;
  }

  emit("save", values);
  return true;
}

function requestClose() {
  if (isDirty.value) {
    unsavedOpen.value = true;
    return;
  }

  emit("update:open", false);
}

function saveAndClose() {
  save();
}

function discardAndClose() {
  unsavedOpen.value = false;
  emit("update:open", false);
}
</script>

<template>
  <BaseModal :open="open" title="管理分類" guard-close @close-request="requestClose" @update:open="emit('update:open', $event)">
    <div class="category-add">
      <input v-model.trim="newCategory" placeholder="新增分類名稱" @keydown.enter.prevent="addCategory" />
      <button class="primary-btn" type="button" @click="addCategory">新增</button>
    </div>

    <div class="category-list">
      <div v-for="(_, index) in draft" :key="index" class="category-row">
        <input v-model.trim="draft[index]" />
        <button class="primary-btn danger-btn" type="button" @click="removeCategory(index)">刪除</button>
      </div>
    </div>

    <p v-if="error" class="status error">{{ error }}</p>

    <div class="form-actions">
      <button class="primary-btn" type="button" @click="save">儲存分類</button>
    </div>
  </BaseModal>

  <UnsavedChangesModal
    v-model:open="unsavedOpen"
    message="管理分類尚未儲存，是否要儲存這次改動？"
    @save="saveAndClose"
    @discard="discardAndClose"
  />
</template>
