import { SHEET_API_URL } from "../constants/inventory.js";

export function useSheetApi() {
  return SHEET_API_URL.trim().length > 0;
}

export function sheetJsonp(action) {
  return new Promise((resolve, reject) => {
    const callbackName = `sheetCallback_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const url = new URL(SHEET_API_URL);

    url.searchParams.set("action", action);
    url.searchParams.set("callback", callbackName);

    window[callbackName] = (data) => {
      delete window[callbackName];
      script.remove();
      data?.ok ? resolve(data) : reject(new Error(data?.error || "讀取資料失敗"));
    };

    script.onerror = () => {
      delete window[callbackName];
      script.remove();
      reject(new Error("無法連線到 Google Sheets"));
    };

    script.src = url.toString();
    document.body.appendChild(script);
  });
}

export async function sheetPost(action, item) {
  const response = await fetch(SHEET_API_URL, {
    method: "POST",
    body: JSON.stringify({ action, item }),
  });

  if (!response.ok) throw new Error("Google Sheets 同步失敗");
  const data = await response.json();
  if (!data.ok) throw new Error(data.error || "Google Sheets 同步失敗");
  return data;
}
