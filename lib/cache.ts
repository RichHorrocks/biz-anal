import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getOrSet<T>(
  key: string,
  ttlSeconds: number,
  fetchFn: () => Promise<T>
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetchFn();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}

export { redis };
