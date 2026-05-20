<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import CategoryBar from "./CategoryBar.vue";
import { money } from "../utils/format.js";

defineProps({
  search: {
    type: String,
    default: "",
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:search", "update:category", "add", "show-total", "manage-categories"]);

const showCategoryNav = ref(true);
let lastScrollY = 0;

function isMobileNav() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function handleScroll() {
  if (!isMobileNav()) {
    showCategoryNav.value = true;
    lastScrollY = window.scrollY;
    return;
  }

  const currentY = window.scrollY;
  const delta = currentY - lastScrollY;

  if (Math.abs(delta) < 8) return;
  showCategoryNav.value = delta < 0 || currentY < 80;
  lastScrollY = currentY;
}

function handleResize() {
  if (!isMobileNav()) showCategoryNav.value = true;
  lastScrollY = window.scrollY;
}

onMounted(() => {
  lastScrollY = window.scrollY;
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="header-main">
        <h1 class="title">彩妝庫存管理</h1>
        <label class="search-box">
          <span class="search-icon"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i></span>
          <input
            :value="search"
            type="search"
            placeholder="搜尋品名或品牌"
            autocomplete="off"
            @input="emit('update:search', $event.target.value)"
          />
        </label>
        <div class="header-actions">
          <button
            id="totalAmountButton"
            class="primary-btn total-btn"
            type="button"
            :title="`所有品項總價：$${money(totalAmount)}`"
            :aria-label="`所有品項總價：$${money(totalAmount)}`"
            @click="emit('show-total')"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 3v18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
              <path d="M17 7.5C16.25 5.9 14.55 5 12.45 5H10.8C8.7 5 7 6.35 7 8.25S8.55 11.2 10.7 11.65L13.4 12.2C15.55 12.65 17 13.75 17 15.7C17 17.7 15.25 19 12.95 19H11.15C8.85 19 7.2 18.05 6.4 16.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
          </button>
          <button class="primary-btn" type="button" @click="emit('add')">＋ 新增品項</button>
        </div>
      </div>

      <CategoryBar
        :class="{ 'is-mobile-hidden': !showCategoryNav }"
        :model-value="category"
        :categories="categories"
        @update:model-value="emit('update:category', $event)"
        @manage="emit('manage-categories')"
      />
    </div>
  </header>
</template>
