<script setup>
import BaseModal from "./BaseModal.vue";

defineProps({
  open: Boolean,
  item: {
    type: Object,
    default: null,
  },
  saving: Boolean,
});

const emit = defineEmits(["update:open", "confirm"]);
</script>

<template>
  <BaseModal :open="open" title="確認刪除" @update:open="emit('update:open', $event)">
    <div class="detail-body">
      <p class="note">確定要刪除「{{ item?.name || "" }}」嗎？刪除後會同步移除試算表資料。</p>
      <div class="detail-actions">
        <button class="primary-btn danger-btn" type="button" :disabled="saving" @click="emit('confirm')">刪除</button>
        <button class="primary-btn back-btn" type="button" @click="emit('update:open', false)">取消</button>
      </div>
    </div>
  </BaseModal>
</template>
