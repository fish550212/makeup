<script setup>
import InventoryCard from "./InventoryCard.vue";

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["select"]);
</script>

<template>
  <section class="grid">
    <InventoryCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @select="emit('select', $event)"
    />
  </section>
</template>
