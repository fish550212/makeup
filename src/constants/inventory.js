import { createId } from "../utils/item.js";

export const SHEET_API_URL =
  "https://script.google.com/macros/s/AKfycbwz0g52Ts3ZUzGbkGSZneunCo1gvUdcUSPF3xSrpPI0VF6yqjXfAQXRrOADd66phfM/exec";

export const STORAGE_KEY = "makeup-inventory-items";
export const CATEGORIES_KEY = "makeup-inventory-categories";
export const ALL_CATEGORY = "全部";
export const DEFAULT_CATEGORY = "未分類";

export const DEFAULT_CATEGORIES = [
  DEFAULT_CATEGORY,
  "妝前底妝防曬",
  "遮瑕校色",
  "定妝",
  "腮紅",
  "修容打亮",
  "眼彩",
  "眉彩",
  "唇彩",
  "工具",
];

export const EMPTY_ITEM = {
  id: "",
  category: DEFAULT_CATEGORIES[0],
  name: "",
  brand: "",
  price: 0,
  rating: 0,
  quantity: 0,
  sold: false,
  saleAmount: 0,
  platform: "",
  note: "",
  repurchase: "",
  pros: "",
  cons: "",
  review: "",
  images: [],
};

export const SAMPLE_ITEMS = [
  {
    id: createId(),
    category: "妝前底妝防曬",
    name: "持久柔霧粉底液 SPF50 PA++++ 01 明亮色",
    brand: "Maybelline",
    price: 490,
    rating: 4,
    quantity: 1,
    platform: "MOMO",
    note: "",
    images: [],
  },
  {
    id: createId(),
    category: "遮瑕校色",
    name: "柔焦遮瑕膏 02 自然色",
    brand: "The Saem",
    price: 179,
    rating: 3,
    quantity: 1,
    platform: "蝦皮",
    note: "",
    images: [],
  },
  {
    id: createId(),
    category: "眼彩",
    name: "九宮格眼影盤 玫瑰奶茶",
    brand: "rom&nd",
    price: 520,
    rating: 5,
    quantity: 1,
    platform: "屈臣氏",
    note: "",
    images: [],
  },
];
