<script setup>
defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["remove", "view"]);
</script>

<template>
  <div class="image-preview">
    <div v-for="(src, index) in images" :key="`${src}-${index}`" class="preview-item">
      <img class="preview-img" :src="src" :alt="`品項圖片 ${index + 1}`" @click="emit('view', src)" />
      <button class="image-remove-btn" type="button" title="刪除圖片" @click="emit('remove', index)">×</button>
    </div>
  </div>
</template>
