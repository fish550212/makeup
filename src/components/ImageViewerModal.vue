<script setup>
defineProps({
  open: Boolean,
  src: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:open"]);
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="modal open" @click.self="emit('update:open', false)">
      <div class="dialog image-viewer-dialog">
        <button class="close-btn image-viewer-close" type="button" aria-label="關閉" @click="emit('update:open', false)">×</button>
        <img class="image-viewer-img" :src="src" alt="放大圖片" />
      </div>
    </div>
  </Teleport>
</template>
