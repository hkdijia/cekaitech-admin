export function normalizeOptionalText(value: string) {
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function splitListText(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function createStoreConfigRequestId() {
  const randomPart = Math.random().toString(16).slice(2);
  return `store-config-${Date.now()}-${randomPart}`;
}
