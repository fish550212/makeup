<script setup>
import { computed } from "vue";
import { normalizeRating } from "../utils/item.js";

const props = defineProps({
  value: {
    type: [Number, String],
    default: 0,
  },
  showEmpty: {
    type: Boolean,
    default: true,
  },
});

const rating = computed(() => normalizeRating(props.value));
</script>

<template>
  <span v-if="rating > 0" class="rating" :title="`評價 ${rating} / 5`" :aria-label="`評價 ${rating} / 5`">
    <span v-for="index in 5" :key="index" :class="{ muted: index > rating }">★</span>
  </span>
  <span v-else-if="showEmpty" class="rating-empty">未評價</span>
</template>
