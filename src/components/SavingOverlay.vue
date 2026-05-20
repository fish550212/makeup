<script setup>
defineProps({
  show: Boolean,
  text: {
    type: String,
    default: "正在儲存",
  },
});
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="saving-overlay open" aria-live="polite" aria-busy="true">
      <div class="saving-box">
        <div class="saving-spinner"></div>
        <div>{{ text }}</div>
      </div>
    </div>
  </Teleport>
</template>
