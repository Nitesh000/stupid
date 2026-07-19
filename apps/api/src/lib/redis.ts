import Redis from "ioredis";
import { env } from "../config/env";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("[Redis] Connected");
});

redis.on("error", (err) => {
  console.error("[Redis] Connection error:", err);
});

export const connectRedis = async () => {
  await redis.connect();
};

export const closeRedis = async () => {
  await redis.quit();
};
