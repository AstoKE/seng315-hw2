// src/repositories/userRepository.js
const User = require("../models/User");

async function getAllUsers() {
  return User.findAll({
    order: [["createdAt", "ASC"]],
  });
}

async function getUserById(id) {
  return User.findByPk(id);
}

async function getUserByUsername(username) {
  return User.findOne({ where: { username } });
}

async function createUser(username) {
  return User.create({ username });
}

async function createUserWithPassword(username, passwordHash) {
  return User.create({ username, passwordHash });
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByUsername,
  createUser,
  createUserWithPassword,
};
