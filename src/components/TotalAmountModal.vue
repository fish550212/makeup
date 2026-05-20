<script setup>
import BaseModal from "./BaseModal.vue";
import { money } from "../utils/format.js";

defineProps({
  open: Boolean,
  amount: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["update:open"]);
</script>

<template>
  <BaseModal :open="open" title="所有品項總價" @update:open="emit('update:open', $event)">
    <div class="detail-body">
      <div class="total-amount-display">$ {{ money(amount) }}</div>
    </div>
  </BaseModal>
</template>
