export function money(value) {
  return Number(value || 0).toLocaleString("zh-TW");
}
