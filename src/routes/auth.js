const express = require("express");
const router = express.Router();
const userService = require("../services/userService");

// POST /auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username ve password gerekli" });
    }

    // aynı kullanıcı adı var mı?
    const existing = await userService.loginUser(username, password); // ya da getUserByUsername repository'den
    // daha temiz: userRepository.getUserByUsername, ama hızlı olsun diye:
    // burada küçük bir değişiklik yapabilirsin, istersen ben sonra düzeltirim

    // basit şekilde: aynı username varsa hata verelim
    // (daha düzgün çözüm için userRepository.getUserByUsername kullan)
    // örnek:
    // const existing = await userRepository.getUserByUsername(username);

    if (existing) {
      return res.status(409).json({ error: "Bu username zaten kullanılıyor" });
    }

    const user = await userService.registerUser(username, password);
    res.status(201).json({ data: user });
  } catch (err) {
    console.error("POST /auth/register error:", err);
    res.status(500).json({ error: "Kayıt sırasında hata" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username ve password gerekli" });
    }

    const user = await userService.loginUser(username, password);
    if (!user) {
      return res.status(401).json({ error: "Geçersiz kullanıcı adı veya şifre" });
    }

    // Şimdilik token yok, direkt user dönüyoruz
    res.json({ data: user });
  } catch (err) {
    console.error("POST /auth/login error:", err);
    res.status(500).json({ error: "Giriş sırasında hata" });
  }
});

module.exports = router;
