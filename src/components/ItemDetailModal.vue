<script setup>
import BaseModal from "./BaseModal.vue";
import RatingStars from "./RatingStars.vue";
import { money } from "../utils/format.js";
import { isSold, itemFinalTotal, itemImages, itemSaleAmount } from "../utils/item.js";

defineProps({
  open: Boolean,
  item: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(["update:open", "edit", "delete", "image"]);
</script>

<template>
  <BaseModal :open="open" title="品項內容" wide @update:open="emit('update:open', $event)">
    <div v-if="item" id="detailBody" class="detail-body">
      <div class="form-scroll">
        <div class="form-grid">
        <div class="field full">
          <label>品名</label>
          <div class="detail-value">{{ item.name }}</div>
        </div>
        <div class="field">
          <label>品牌</label>
          <div class="detail-value">{{ item.brand || "未填品牌" }}</div>
        </div>
        <div class="field">
          <label>分類</label>
          <div class="detail-value">{{ item.category }}</div>
        </div>
        <div class="field">
          <label>狀態</label>
          <div class="detail-value"><span v-if="isSold(item)" class="sold-tag">已賣出</span><span v-else>庫存中</span></div>
        </div>
        <div class="field">
          <label>數量</label>
          <div class="detail-value">{{ item.quantity || 1 }}</div>
        </div>
        <div class="field">
          <label>單價</label>
          <div class="detail-value">$ {{ money(item.price) }}</div>
        </div>
        <div class="field">
          <label>總價</label>
          <div class="detail-value">$ {{ money(itemFinalTotal(item)) }}</div>
        </div>
        <div v-if="isSold(item)" class="field">
          <label>賣出金額</label>
          <div class="detail-value">$ {{ money(itemSaleAmount(item)) }}</div>
        </div>
        <div class="field">
          <label>評價星數</label>
          <div class="detail-value"><RatingStars :value="item.rating" /></div>
        </div>
        <div class="field">
          <label>購買平台</label>
          <div class="detail-value">{{ item.platform || "未填" }}</div>
        </div>
        <div class="field">
          <label>回購</label>
          <div class="detail-value">{{ item.repurchase || "未填" }}</div>
        </div>
        <div class="field">
          <label>優點</label>
          <div class="detail-value">{{ item.pros || "未填" }}</div>
        </div>
        <div class="field">
          <label>缺點</label>
          <div class="detail-value">{{ item.cons || "未填" }}</div>
        </div>
        <div class="field full">
          <label>詳細評論</label>
          <div class="detail-value">{{ item.review || "未填" }}</div>
        </div>
        <div class="field full">
          <label>備註</label>
          <div class="detail-value">{{ item.note || "未填備註" }}</div>
        </div>
        <div class="field full">
          <label>圖片</label>
          <div v-if="itemImages(item).length" class="detail-images">
            <img
              v-for="(src, index) in itemImages(item)"
              :key="`${src}-${index}`"
              class="detail-img"
              :src="src"
              :alt="`品項圖片 ${index + 1}`"
              @click="emit('image', src)"
            />
          </div>
          <div v-else class="detail-value">未上傳圖片</div>
        </div>
        </div>
      </div>

      <div class="detail-actions form-actions">
        <button class="primary-btn" type="button" @click="emit('edit', item)">編輯</button>
        <button class="primary-btn danger-btn" type="button" @click="emit('delete', item)">刪除</button>
      </div>
    </div>
  </BaseModal>
</template>
