// src/messaging/redisClient.js
const { createClient } = require("redis");
require("dotenv").config();

const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn("⚠️ REDIS_URL is not set. Redis will not be used.");
}

const redisClient = createClient({
  url: redisUrl,
});

redisClient.on("error", (err) => {
  console.error("Redis Error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected (Redis Cloud)");
});

(async () => {
  try {
    if (redisUrl) {
      await redisClient.connect();
    }
  } catch (err) {
    console.error("Redis initial connect failed:", err);
  }
})();

module.exports = redisClient;
