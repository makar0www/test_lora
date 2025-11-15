require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { generateImage } = require("./generator");
const { initBot } = require("./bot");

const app = express();
const PORT = process.env.PORT || 4000;

/* ========================================================
   🟢 ГЛАВНЫЙ FIX ДЛЯ LOCALHOST / LOCALTUNNEL / VERCEL
   Ставим САМЫМ ПЕРВЫМ, обрабатываем OPTIONS
======================================================== */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

/* ========================================================
   🟡 Основные middlewares
======================================================== */
app.use(cors());
app.use(express.json());

/* ========================================================
   🟣 Раздача статики (картинки)
======================================================== */
const storagePath = path.join(__dirname, "storage");
app.use("/images", express.static(storagePath));

/* ========================================================
   ❤️ Health check
======================================================== */
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Backend работает" });
});

/* ========================================================
   📸 Лента изображений — читаем storage напрямую
======================================================== */
app.get("/images-list", async (req, res) => {
  try {
    const files = await fs.promises.readdir(storagePath);

    const list = files
      .filter((file) => file.endsWith(".png") || file.endsWith(".jpg"))
      .map((file) => `/images/${file}`)
      .sort();

    res.json(list);
  } catch (err) {
    console.error("[server] Ошибка чтения storage:", err);
    res.status(500).json({ error: "cannot read images" });
  }
});

/* ========================================================
   🎨 Генерация изображения
======================================================== */
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

/* ========================================================
   🚀 Старт сервера
======================================================== */
app.listen(PORT, () => {
  console.log(`[server] Сервер запущен на http://localhost:${PORT}`);
});

/* ========================================================
   🤖 Запуск Telegram-бота
======================================================== */
initBot(generateImage);
