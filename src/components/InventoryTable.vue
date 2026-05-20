<script setup>
import RatingStars from "./RatingStars.vue";
import { money } from "../utils/format.js";
import { isSold, itemFinalTotal, platformMerchant } from "../utils/item.js";

defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["select"]);
</script>

<template>
  <section class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>品項</th>
          <th style="width: 130px">分類</th>
          <th style="width: 80px">狀態</th>
          <th>單價</th>
          <th style="width: 55px">數量</th>
          <th>總價</th>
          <th>購買平台</th>
          <th style="width: 60px">回購</th>
          <th style="width: 130px">優點</th>
          <th style="width: 130px">缺點</th>
          <th style="width: 130px">詳細評論</th>
          <th>備註</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in items"
          :key="item.id"
          tabindex="0"
          @click="emit('select', item)"
          @keydown.enter="emit('select', item)"
        >
          <td>
            <span class="brand">{{ item.brand || "未填品牌" }}</span><br />
            <strong>{{ item.name }}</strong><br />
            <RatingStars :value="item.rating" />
          </td>
          <td><span class="tag">{{ item.category }}</span></td>
          <td>
            <span v-if="isSold(item)" class="tag sold-tag">已賣出</span>
            <span v-else>庫存中</span>
          </td>
          <td>${{ money(item.price) }}</td>
          <td>{{ item.quantity || 1 }}</td>
          <td>${{ money(itemFinalTotal(item)) }}</td>
          <td>{{ platformMerchant(item.platform) }}</td>
          <td>{{ item.repurchase || "未填" }}</td>
          <td>{{ item.pros || "未填" }}</td>
          <td>{{ item.cons || "未填" }}</td>
          <td>{{ item.review || "未填" }}</td>
          <td><span v-if="item.note" class="note">{{ item.note }}</span><span v-else>未填備註</span></td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
