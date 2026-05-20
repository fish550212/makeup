export function createId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `item-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function normalizeRating(value) {
  if (value === "" || value === null || value === undefined) return 0;
  return Math.min(5, Math.max(0, Math.round(Number(value) || 0)));
}

export function isSold(item) {
  return item?.sold === true || String(item?.sold || "").trim() === "已賣出";
}

export function itemSubtotal(item) {
  return (Number(item.price) || 0) * (Number(item.quantity) || 1);
}

export function itemSaleAmount(item) {
  return isSold(item) ? Math.max(0, Number(item.saleAmount) || 0) : 0;
}

export function itemFinalTotal(item) {
  return Math.max(0, itemSubtotal(item) - itemSaleAmount(item));
}

export function itemImages(item) {
  if (Array.isArray(item?.images)) return item.images.filter(Boolean);
  if (!item?.images) return [];

  try {
    const parsed = JSON.parse(item.images);
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export function itemNotes(item) {
  return [
    ["回購", item?.repurchase],
    ["優點", item?.pros],
    ["缺點", item?.cons],
    ["詳細評論", item?.review],
    ["備註", item?.note],
  ].filter(([, value]) => String(value || "").trim());
}

export function platformMerchant(value) {
  return String(value || "未填平台").trim();
}

export function toEditableItem(item, fallbackCategory) {
  return {
    id: item?.id || "",
    name: item?.name || "",
    brand: item?.brand || "",
    category: item?.category || fallbackCategory,
    price: Number(item?.price) || 0,
    rating: normalizeRating(item?.rating),
    quantity: Number(item?.quantity) || 1,
    sold: isSold(item),
    saleAmount: Number(item?.saleAmount) || 0,
    platform: item?.platform || "",
    note: item?.note || "",
    repurchase: item?.repurchase || "",
    pros: item?.pros || "",
    cons: item?.cons || "",
    review: item?.review || "",
    images: itemImages(item),
  };
}
