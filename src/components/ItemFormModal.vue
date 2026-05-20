<script setup>
import { computed, ref, watch } from "vue";
import BaseModal from "./BaseModal.vue";
import ImagePreview from "./ImagePreview.vue";
import UnsavedChangesModal from "./UnsavedChangesModal.vue";
import { readImageFile } from "../composables/useImageFiles.js";
import { toEditableItem } from "../utils/item.js";

const props = defineProps({
  open: Boolean,
  item: {
    type: Object,
    default: null,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  saving: Boolean,
});

const emit = defineEmits(["update:open", "save", "image"]);
const form = ref(toEditableItem(null, ""));
const formEl = ref(null);
const originalForm = ref("");
const unsavedOpen = ref(false);
const title = computed(() => (form.value.id ? "編輯品項" : "新增品項"));
const unsavedMessage = computed(() =>
  form.value.id ? "編輯內容尚未儲存，是否要儲存這次改動？" : "新增品項尚未儲存，是否要儲存這次改動？",
);
const isDirty = computed(() => JSON.stringify(normalizeForm(form.value)) !== originalForm.value);

function normalizeForm(value) {
  return {
    ...value,
    name: String(value.name || "").trim(),
    brand: String(value.brand || "").trim(),
    category: String(value.category || ""),
    price: Number(value.price) || 0,
    rating: Number(value.rating) || 0,
    quantity: Number(value.quantity) || 1,
    sold: Boolean(value.sold),
    saleAmount: Number(value.saleAmount) || 0,
    platform: String(value.platform || "").trim(),
    note: String(value.note || "").trim(),
    repurchase: String(value.repurchase || ""),
    pros: String(value.pros || "").trim(),
    cons: String(value.cons || "").trim(),
    review: String(value.review || "").trim(),
    images: Array.isArray(value.images) ? [...value.images] : [],
  };
}

watch(
  () => [props.open, props.item, props.categories],
  () => {
    if (!props.open) return;
    form.value = toEditableItem(props.item, props.categories[0] || "");
    originalForm.value = JSON.stringify(normalizeForm(form.value));
    unsavedOpen.value = false;
  },
  { immediate: true },
);

async function addImages(event) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const images = await Promise.all(files.map(readImageFile));
  form.value.images = [...form.value.images, ...images];
  event.target.value = "";
}

function removeImage(index) {
  form.value.images.splice(index, 1);
}

function submit() {
  emit("save", { ...form.value, images: [...form.value.images] });
}

function requestClose() {
  if (isDirty.value) {
    unsavedOpen.value = true;
    return;
  }

  emit("update:open", false);
}

function saveAndClose() {
  formEl.value?.requestSubmit();
}

function discardAndClose() {
  unsavedOpen.value = false;
  emit("update:open", false);
}
</script>

<template>
  <BaseModal :open="open" :title="title" wide guard-close @close-request="requestClose" @update:open="emit('update:open', $event)">
    <form id="itemForm" ref="formEl" @submit.prevent="submit">
      <div class="form-scroll">
        <div class="field full">
          <label for="nameInput">品名 *</label>
          <input id="nameInput" v-model.trim="form.name" required />
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="brandInput">品牌</label>
            <input id="brandInput" v-model.trim="form.brand" />
          </div>

          <div class="field">
            <label for="categoryInput">分類</label>
            <select id="categoryInput" v-model="form.category">
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </div>

          <div class="field">
            <label for="soldInput">狀態</label>
            <select id="soldInput" v-model="form.sold">
              <option :value="false">庫存中</option>
              <option :value="true">已賣出</option>
            </select>
          </div>

          <div class="field">
            <label for="quantityInput">數量</label>
            <input id="quantityInput" v-model.number="form.quantity" type="number" min="1" inputmode="numeric" />
          </div>

          <div class="field">
            <label for="priceInput">單價</label>
            <input id="priceInput" v-model.number="form.price" type="number" min="0" inputmode="numeric" />
          </div>

          <div v-if="form.sold" class="field">
            <label for="saleAmountInput">賣出金額</label>
            <input id="saleAmountInput" v-model.number="form.saleAmount" type="number" min="0" inputmode="numeric" />
          </div>

          <div class="field">
            <label for="ratingInput">評價星數</label>
            <input id="ratingInput" v-model.number="form.rating" type="number" min="0" max="5" step="1" inputmode="numeric" />
          </div>

          <div class="field">
            <label for="platformInput">購買平台</label>
            <input id="platformInput" v-model.trim="form.platform" />
          </div>

          <div class="field">
            <label for="repurchaseInput">回購</label>
            <select id="repurchaseInput" v-model="form.repurchase">
              <option value="">未填</option>
              <option value="是">是</option>
              <option value="否">否</option>
              <option value="也許">也許</option>
              <option value="不需">不需</option>
            </select>
          </div>

          <div class="field">
            <label for="prosInput">優點</label>
            <textarea id="prosInput" v-model.trim="form.pros"></textarea>
          </div>

          <div class="field">
            <label for="consInput">缺點</label>
            <textarea id="consInput" v-model.trim="form.cons"></textarea>
          </div>

          <div class="field full">
            <label for="reviewInput">詳細評論</label>
            <textarea id="reviewInput" v-model.trim="form.review"></textarea>
          </div>

          <div class="field full">
            <label for="noteInput">備註</label>
            <textarea id="noteInput" v-model.trim="form.note"></textarea>
          </div>

          <div class="field full">
            <label for="imageInput">圖片</label>
            <input id="imageInput" class="file-input" type="file" accept="image/*" multiple @change="addImages" />
            <ImagePreview :images="form.images" @remove="removeImage" @view="emit('image', $event)" />
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button class="primary-btn" type="submit" :disabled="saving">儲存</button>
      </div>
    </form>
  </BaseModal>

  <UnsavedChangesModal
    v-model:open="unsavedOpen"
    :message="unsavedMessage"
    :saving="saving"
    @save="saveAndClose"
    @discard="discardAndClose"
  />
</template>
