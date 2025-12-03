// src/messaging/producer.js
const redisClient = require("./redisClient");

const STREAM_KEY = "chat_stream";

async function sendMessageToStream(userId, content) {
  try {
    if (!redisClient.isOpen) {
      console.warn("⚠️ Redis client not open, skipping publish");
      return null;
    }

    const id = await redisClient.xAdd(STREAM_KEY, "*", {
      userId: String(userId),
      content,
      createdAt: new Date().toISOString(),
    });

    console.log("Message added to Redis stream:", id);
    return id;
  } catch (err) {
    console.error("Redis publish error:", err);
    throw err;
  }
}

module.exports = {
  sendMessageToStream,
};
