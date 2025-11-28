const express = require("express");
const router = express.Router();

const { sendMessageToStream } = require("../messaging/producer");
const messageService = require("../services/messageService");
const userService = require("../services/userService");

router.get("/", async (req, res) => {
  try {
    const msgs = await messageService.getAllMessages();
    res.json({ data: msgs });
  } catch (err) {
    console.error("GET /messages error:", err);
    res.status(500).json({ error: "Mesajlar alınamadı" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { userId, content } = req.body;

    // Validation
    if (!userId || content == null || content.trim() === "") {
      return res.status(400).json({ error: "userId ve content gerekli" });
    }

    if (isNaN(parseInt(userId))) {
      return res.status(400).json({ error: "userId sayısal olmalıdır" });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ error: "Gönderilen userId için kullanıcı bulunamadı" });
    }

   
    const savedMessage = await messageService.createMessage(userId, content);

    let streamId = null;
    try {
      streamId = await sendMessageToStream(userId, content);
      console.log("Message added to Redis stream:", streamId);
    } catch (redisErr) {
      console.error("Redis publish error:", redisErr);
      
    }

    return res.status(201).json({
      status: "ok",
      data: savedMessage,
      streamId,
    });
  } catch (err) {
    console.error("POST /messages error:", err);
    return res.status(500).json({ error: "Mesaj kaydedilemedi" });
  }
});

module.exports = router;
