<script setup>
import BaseModal from "./BaseModal.vue";

defineProps({
  open: Boolean,
  message: {
    type: String,
    default: "內容尚未儲存，是否要儲存這次改動？",
  },
  saving: Boolean,
});

const emit = defineEmits(["update:open", "save", "discard"]);
</script>

<template>
  <BaseModal :open="open" title="是否儲存" @update:open="emit('update:open', $event)">
    <div class="detail-body unsaved-body">
      <p class="note">{{ message }}</p>
      <div class="detail-actions">
        <button class="primary-btn" type="button" :disabled="saving" @click="emit('save')">儲存</button>
        <button class="primary-btn back-btn" type="button" @click="emit('discard')">不儲存</button>
      </div>
    </div>
  </BaseModal>
</template>
