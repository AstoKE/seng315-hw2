// src/services/messageService.js
const messageRepository = require("../repositories/messageRepository");

async function getAllMessages() {
  return messageRepository.getAllMessages();
}

// BURASI DA AYNI İMZAYI KULLANIYOR: (userId, content)
async function createMessage(userId, content) {
  return messageRepository.createMessage(userId, content);
}

module.exports = {
  getAllMessages,
  createMessage,
};
