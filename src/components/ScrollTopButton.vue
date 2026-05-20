<script setup>
import { onMounted, onUnmounted, ref } from "vue";

const visible = ref(false);

function onScroll() {
  visible.value = window.scrollY > 240;
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

onMounted(() => window.addEventListener("scroll", onScroll));
onUnmounted(() => window.removeEventListener("scroll", onScroll));
</script>

<template>
  <button
    class="icon-btn scroll-top-btn"
    :class="{ visible }"
    type="button"
    title="回到頂端"
    aria-label="回到頂端"
    @click="scrollTop"
  >
    <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
  </button>
</template>
