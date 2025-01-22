export function createEmptyStockId() {
  return `temp: ${Math.random()}`;
}

export function isTempId(id: string) {
  return id.startsWith("temp:");
}
