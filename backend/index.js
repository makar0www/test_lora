require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { generateImage } = require("./generator");
const { initBot } = require("./bot");

const app = express();
const PORT = process.env.PORT || 4000;

// 🟢 CORS FIX — ставим самым первым
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// middlewares
app.use(cors());
app.use(express.json());

// раздаём статику
const storagePath = path.join(__dirname, "storage");
app.use("/images", express.static(storagePath));

// health-check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend работает" });
});

// 📌 Эндпоинт ленты изображений
app.get("/images-list", async (req, res) => {
  try {
    const files = await fs.promises.readdir(storagePath);

    const list = files
      .filter((f) => f.endsWith(".png") || f.endsWith(".jpg"))
      .map((f) => `/images/${f}`)
      .sort();

    res.json(list);
  } catch (err) {
    console.error("[server] Ошибка чтения storage:", err);
    res.status(500).json({ error: "cannot read images" });
  }
});

// endpoint /generate
app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "prompt is required" });
    }

    console.log("[server] /generate промпт:", prompt);

    const { fileName } = await generateImage(prompt);
    const imageUrl = `/images/${fileName}`;

    res.json({ imageUrl });
  } catch (err) {
    console.error("[server] Ошибка в /generate:", err);
    res.status(500).json({ error: "generation failed" });
  }
});

// старт сервера
app.listen(PORT, () => {
  console.log(`[server] Сервер запущен на http://localhost:${PORT}`);
});

// запуск Telegram-бота
initBot(generateImage);
