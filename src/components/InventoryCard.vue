<script setup>
import RatingStars from "./RatingStars.vue";
import { money } from "../utils/format.js";
import { isSold, itemImages, itemNotes, itemQuantity, platformMerchant } from "../utils/item.js";

defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["select"]);
</script>

<template>
  <article
    class="card"
    :class="{ 'sold-card': isSold(item) }"
    tabindex="0"
    @click="emit('select', item)"
    @keydown.enter="emit('select', item)"
  >
    <div class="card-body">
      <div class="card-top">
        <p class="brand">{{ item.brand || "未填品牌" }}</p>
        <span v-if="isSold(item)" class="sold-status">已賣出</span>
      </div>

      <h3 class="name">{{ item.name }}</h3>
      <span class="tag">{{ item.category }}</span>

      <div v-if="itemImages(item).length" class="thumb-strip">
        <img
          v-for="(src, index) in itemImages(item).slice(0, 3)"
          :key="`${src}-${index}`"
          class="thumb"
          :src="src"
          :alt="`品項圖片 ${index + 1}`"
        />
      </div>

      <div class="price-rating">
        <div class="price">${{ money(item.price) }}</div>
        <RatingStars :value="item.rating" :show-empty="false" />
      </div>
    </div>

    <div class="meta">
      <div class="meta-pair">
        <div class="meta-chip">數量：{{ itemQuantity(item) }}</div>
        <div class="meta-chip meta-shop">{{ platformMerchant(item.platform) }}</div>
      </div>

      <div v-if="itemNotes(item).length" class="note">
        <div v-for="[label, value] in itemNotes(item)" :key="label" class="note-row">
          <span class="note-label">{{ label }}：</span>{{ value }}
        </div>
      </div>
    </div>
  </article>
</template>
