// src/repositories/messageRepository.js
const Message = require("../models/Message");

async function getAllMessages() {
  return Message.findAll({
    order: [["createdAt", "ASC"]],
  });
}

async function createMessage(userId, content) {
  return Message.create({
    userId: userId,   
    content: content, 
  });
}

module.exports = {
  getAllMessages,
  createMessage,
};
