const stores = new Map<string, Map<string, { count: number; reset: number }>>();

export function checkRateLimit(
  storeName: string,
  key: string,
  limit: number,
  windowMs: number
): boolean {
  let store = stores.get(storeName);
  if (!store) {
    store = new Map();
    stores.set(storeName, store);
  }

  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.reset) {
    store.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

export function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")?.trim() ??
    "unknown"
  );
}
