<script setup>
import { onUnmounted, watch } from "vue";

const props = defineProps({
  open: Boolean,
  title: {
    type: String,
    default: "",
  },
  wide: Boolean,
  guardClose: Boolean,
});

const emit = defineEmits(["update:open", "close-request"]);

let previousOverflow = "";

function requestClose() {
  emit("close-request");
}

function syncBodyScrollLock(open) {
  if (open) {
    if (!document.body.dataset.modalLockCount) {
      previousOverflow = document.body.style.overflow;
      document.body.dataset.modalLockCount = "0";
    }
    document.body.dataset.modalLockCount = String(Number(document.body.dataset.modalLockCount) + 1);
    document.body.style.overflow = "hidden";
    return;
  }

  const nextCount = Math.max(0, Number(document.body.dataset.modalLockCount || 0) - 1);
  if (nextCount > 0) {
    document.body.dataset.modalLockCount = String(nextCount);
    return;
  }

  delete document.body.dataset.modalLockCount;
  document.body.style.overflow = previousOverflow;
}

watch(
  () => props.open,
  (open, previousOpen) => {
    if (open === previousOpen) return;
    syncBodyScrollLock(open);
  },
  { immediate: true },
);

onUnmounted(() => {
  if (props.open) syncBodyScrollLock(false);
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal open" @click.self="guardClose ? requestClose() : emit('update:open', false)">
      <div class="dialog" :class="{ wide }">
        <div v-if="title" class="dialog-head">
          <h2>{{ title }}</h2>
          <button
            class="close-btn"
            type="button"
            aria-label="關閉"
            @click="guardClose ? requestClose() : emit('update:open', false)"
          >
            ×
          </button>
        </div>
        <slot />
      </div>
    </div>
  </Teleport>
</template>
