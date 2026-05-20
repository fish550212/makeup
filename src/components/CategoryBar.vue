<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "manage"]);
</script>

<template>
  <div class="category-nav-row">
    <nav class="category-bar" aria-label="分類">
      <button
        v-for="category in categories"
        :key="category"
        class="category-btn"
        :class="{ active: category === modelValue }"
        type="button"
        @click="emit('update:modelValue', category)"
      >
        {{ category }}
      </button>
    </nav>
    <button class="icon-btn" type="button" title="管理分類" aria-label="管理分類" @click="emit('manage')">
      <i class="fa-solid fa-gear" aria-hidden="true"></i>
    </button>
  </div>
</template>
