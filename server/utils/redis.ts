import type { RuntimeConfig } from "nuxt/schema";
import { createClient } from "redis";

export default async function useRedis(config: RuntimeConfig) {
  return await createClient({ url: config.redisUrl }).connect();
}
