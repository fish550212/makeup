// 貼到「綁定這份試算表」的 Apps Script。
// 這版會使用第一個工作表，並支援你現有的欄位：
// 分類、品名色號、單價、評價、量、狀態、賣出金額、總、購買平台、備註

const SHEET_NAME = ""; // 留空代表使用第一個工作表；若要指定工作表名稱可填在這裡。
const REQUIRED_HEADERS = ["分類", "品名色號", "單價", "評價", "量", "狀態", "賣出金額", "總", "購買平台", "備註"];
const SYSTEM_HEADERS = ["id", "brand", "images", "createdAt", "updatedAt"];

function doGet(e) {
  const parameter = e && e.parameter ? e.parameter : {};
  const action = parameter.action || "list";
  const callback = parameter.callback;
  const result = action === "list" ? { ok: true, items: listItems() } : { ok: false, error: "Unknown action" };

  if (callback) {
    return ContentService
      .createTextOutput(`${callback}(${JSON.stringify(result)});`)
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return jsonOutput(result);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || "{}");
  const action = payload.action;
  const item = payload.item;

  if (!item || !item.id) return jsonOutput({ ok: false, error: "Missing item" });

  if (action === "create") upsertItem(item, true);
  if (action === "update") upsertItem(item, false);
  if (action === "delete") deleteItem(item.id);

  return jsonOutput({ ok: true });
}

function jsonOutput(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = SHEET_NAME
    ? spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME)
    : spreadsheet.getSheets()[0];

  ensureHeaders(sheet);
  ensureIds(sheet);
  return sheet;
}

function ensureHeaders(sheet) {
  const lastColumn = Math.max(sheet.getLastColumn(), 1);
  const headers = sheet.getRange(1, 1, 1, lastColumn).getValues()[0].map(String);
  const isEmpty = headers.every((header) => header.trim() === "");

  if (isEmpty) {
    sheet.getRange(1, 1, 1, REQUIRED_HEADERS.length).setValues([REQUIRED_HEADERS]);
    headers.splice(0, headers.length, ...REQUIRED_HEADERS);
  }

  [...REQUIRED_HEADERS, ...SYSTEM_HEADERS].forEach((header) => {
    if (!headers.includes(header)) {
      sheet.getRange(1, sheet.getLastColumn() + 1).setValue(header);
      headers.push(header);
    }
  });
}

function getHeaderMap(sheet) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  return headers.reduce((map, header, index) => {
    map[header] = index + 1;
    return map;
  }, {});
}

function ensureIds(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const headerMap = getHeaderMap(sheet);
  const idColumn = headerMap.id;
  const idRange = sheet.getRange(2, idColumn, lastRow - 1, 1);
  const ids = idRange.getValues();
  let changed = false;

  const nextIds = ids.map((row) => {
    if (row[0]) return row;
    changed = true;
    return [Utilities.getUuid()];
  });

  if (changed) idRange.setValues(nextIds);
}

function listItems() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];

  const headerMap = getHeaderMap(sheet);
  return sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues()
    .filter((row) => cell(row, headerMap, "品名色號"))
    .map((row) => rowToItem(row, headerMap));
}

function rowToItem(row, headerMap) {
  return {
    id: cell(row, headerMap, "id"),
    name: cell(row, headerMap, "品名色號"),
    brand: cell(row, headerMap, "brand"),
    category: cell(row, headerMap, "分類"),
    price: parseMoney(cell(row, headerMap, "單價")),
    rating: normalizeRating(cell(row, headerMap, "評價")),
    quantity: Number(cell(row, headerMap, "量")) || 1,
    sold: parseSold(cell(row, headerMap, "狀態")),
    saleAmount: parseMoney(cell(row, headerMap, "賣出金額")),
    platform: cell(row, headerMap, "購買平台"),
    note: cell(row, headerMap, "備註"),
    images: parseImages(cell(row, headerMap, "images")),
    createdAt: cell(row, headerMap, "createdAt"),
    updatedAt: cell(row, headerMap, "updatedAt"),
  };
}

function cell(row, headerMap, header) {
  const column = headerMap[header];
  return column ? row[column - 1] : "";
}

function parseMoney(value) {
  if (typeof value === "number") return value;
  return Number(String(value || "").replace(/[^\d.-]/g, "")) || 0;
}

function normalizeRating(value) {
  if (value === "" || value === null || value === undefined) return 0;
  return Math.min(5, Math.max(0, Math.round(Number(value) || 0)));
}

function parseSold(value) {
  return value === true || String(value || "").trim() === "已賣出";
}

function parseImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function findRowById(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  const headerMap = getHeaderMap(sheet);
  const idColumn = headerMap.id;
  const ids = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
  const index = ids.findIndex((row) => row[0] === id);
  return index === -1 ? -1 : index + 2;
}

function upsertItem(item, isCreate) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet();
    const rowNumber = findRowById(sheet, item.id);

    if (rowNumber === -1) {
      const nextRow = sheet.getLastRow() + 1;
      writeItem(sheet, nextRow, item, null);
      return;
    }

    if (isCreate) return;

    const previous = rowToItem(
      sheet.getRange(rowNumber, 1, 1, sheet.getLastColumn()).getValues()[0],
      getHeaderMap(sheet)
    );
    writeItem(sheet, rowNumber, item, previous);
  } finally {
    lock.releaseLock();
  }
}

function writeItem(sheet, rowNumber, item, previous) {
  const headerMap = getHeaderMap(sheet);
  const now = new Date().toISOString();
  const price = Number(item.price) || 0;
  const rating = normalizeRating(item.rating);
  const quantity = Number(item.quantity) || 1;
  const sold = parseSold(item.sold);
  const saleAmount = sold ? Number(item.saleAmount) || 0 : 0;
  const total = Math.max(0, price * quantity - saleAmount);

  setByHeader(sheet, rowNumber, headerMap, "分類", item.category || "");
  setByHeader(sheet, rowNumber, headerMap, "品名色號", item.name || "");
  setByHeader(sheet, rowNumber, headerMap, "單價", price);
  setByHeader(sheet, rowNumber, headerMap, "評價", rating || "");
  setByHeader(sheet, rowNumber, headerMap, "量", quantity);
  setByHeader(sheet, rowNumber, headerMap, "狀態", sold ? "已賣出" : "庫存中");
  setByHeader(sheet, rowNumber, headerMap, "賣出金額", saleAmount || "");
  setByHeader(sheet, rowNumber, headerMap, "總", total);
  setByHeader(sheet, rowNumber, headerMap, "購買平台", item.platform || "");
  setByHeader(sheet, rowNumber, headerMap, "備註", item.note || "");
  setByHeader(sheet, rowNumber, headerMap, "id", item.id);
  setByHeader(sheet, rowNumber, headerMap, "brand", item.brand || "");
  setByHeader(sheet, rowNumber, headerMap, "images", JSON.stringify(parseImages(item.images)));
  setByHeader(sheet, rowNumber, headerMap, "createdAt", previous && previous.createdAt ? previous.createdAt : now);
  setByHeader(sheet, rowNumber, headerMap, "updatedAt", now);
}

function setByHeader(sheet, rowNumber, headerMap, header, value) {
  if (headerMap[header]) {
    sheet.getRange(rowNumber, headerMap[header]).setValue(value);
  }
}

function deleteItem(id) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = getSheet();
    const rowNumber = findRowById(sheet, id);
    if (rowNumber !== -1) {
      sheet.deleteRow(rowNumber);
    }
  } finally {
    lock.releaseLock();
  }
}
