const Redis = require("ioredis");

// ─── Auto-detect: Redis Cloud URL vs Local host/port ────────
const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      retryStrategy: (times) => {
        if (times > 10) return null;
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
    })
  : new Redis({
      // Local Redis (WSL / native)
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: parseInt(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      retryStrategy: (times) => {
        if (times > 10) return null;
        return Math.min(times * 100, 3000);
      },
      lazyConnect: true,
    });

redisClient.on("connect", () => {
  const mode = process.env.REDIS_URL ? "Redis Cloud ☁️" : "Local Redis 🖥️";
  console.log(`✅ Redis connected (${mode})`);
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

// Non-blocking connect — server won't crash if Redis is unavailable
redisClient.connect().catch((err) => {
  console.error("❌ Redis connection failed:", err.message);
  console.warn("⚠️  Caching disabled — all requests will go to MongoDB");
});

module.exports = redisClient;

