require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { generateImage } = require("./generator");
const { initBot } = require("./bot");

const app = express();
const PORT = process.env.PORT || 4000;

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
