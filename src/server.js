require("dotenv").config();
const express = require("express");
const { sequelize } = require("./models");
const path = require("path");
const authRoutes = require("./routes/auth");


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/auth", authRoutes);
// statik dosyalar 
app.use(express.static(path.join(__dirname, "../public")));

const userService = require("./services/userService");

const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

app.use("/users", userRoutes);
app.use("/messages", messageRoutes);


app.get("/test-create-user", async (req, res) => {
  try {
    const user = await userService.createUser({ username: "api-test" });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error creating user" });
  }
});

app.get("/test-users", async (req, res) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

const messageService = require("./services/messageService");

app.get("/test-create-message", async (req, res) => {
  try {
    const msg = await messageService.createMessage({
      userId: 1,
      content: "Merhaba bu bir test mesaj"
    });
    res.json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mesaj oluşturulamadı" });
  }
});

app.get("/messages", async (req, res) => {
  try {
    const msgs = await messageService.getAllMessages();
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Mesajlar alınamadı" });
  }
});

app.get("/messages/pretty", async (req, res) => {
  try {
    const msgs = await messageService.getAllMessages();

    let html = `
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Messages</title>
      </head>
      <body>
        <h1>Messages</h1>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Content</th>
            <th>Created At</th>
          </tr>
    `;

    for (const m of msgs) {
      html += `
        <tr>
          <td>${m.id}</td>
          <td>${m.userId}</td>
          <td>${m.content}</td>
          <td>${m.createdAt}</td>
        </tr>
      `;
    }

    html += `
        </table>
      </body>
      </html>
    `;

    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Mesajlar alınamadı");
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

sequelize
  .sync()
  .then(() => {
    console.log("Database synced");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB sync error:", err);
  });
