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
  <TransitionGroup name="card-list" tag="section" class="grid" appear>
    <InventoryCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @select="emit('select', $event)"
    />
  </TransitionGroup>
</template>
