// src/services/userService.js
const bcrypt = require("bcryptjs");
const userRepository = require("../repositories/userRepository");

// Tüm kullanıcılar
async function getAllUsers() {
  return userRepository.getAllUsers();
}

// Eski kodlarda getUsers kullanıldığı için, alias ekliyoruz
async function getUsers() {
  return getAllUsers();
}

// ID ile kullanıcı
async function getUserById(id) {
  return userRepository.getUserById(id);
}

// Register: username + password
async function registerUser(username, password) {
  if (!username || !password) {
    throw new Error("Username ve password gerekli");
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = await userRepository.createUserWithPassword(username, passwordHash);
  return user;
}

async function loginUser(username, password) {
  const user = await userRepository.getUserByUsername(username);
  if (!user) return null;

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return null;

  return user;
}

module.exports = {
  getAllUsers,
  getUsers,       
  getUserById,
  registerUser,
  loginUser,
};
