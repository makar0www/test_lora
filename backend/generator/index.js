const fs = require("fs");
const path = require("path");

const SD_API_URL = process.env.SD_API_URL || "http://127.0.0.1:7860";
const LORA_PROMPT = process.env.LORA_PROMPT || "";

// 📌 сохранить данные о картинке в storage/images.json
function saveToDatabase(fileName, prompt) {
  const dbPath = path.join(__dirname, "..", "storage", "images.json");

  let data = [];

  // если файл уже есть — читаем
  if (fs.existsSync(dbPath)) {
    try {
      data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
    } catch {
      data = [];
    }
  }

  // новая запись
  const record = {
    fileName,
    prompt,
    createdAt: Date.now(),
  };

  data.unshift(record);

  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

async function generateImage(prompt) {
  const fullPrompt = `${LORA_PROMPT} ${prompt}`.trim();

  const payload = {
    prompt: fullPrompt,
    steps: 20,
    width: 512,
    height: 512,
    sampler_name: "Euler a",
  };

  const url = `${SD_API_URL}/sdapi/v1/txt2img`;

  console.log("[generator] Запрос к Automatic1111...", fullPrompt);

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log("SD RESPONSE:", data);

  // получаем base64
  const imgBase64 = data.images[0];
  const imgBuffer = Buffer.from(imgBase64, "base64");

  // имя файла
  const fileName = `image_${Date.now()}.png`;

  // путь
  const storageDir = path.join(__dirname, "..", "storage");
  const filePath = path.join(storageDir, fileName);

  // сохраняем файл
  await fs.promises.writeFile(filePath, imgBuffer);
  console.log("[generator] Картинка сохранена:", filePath);

  // 📌 сохраняем в JSON-базу
  saveToDatabase(fileName, fullPrompt);

  return { fileName, filePath };
}

module.exports = { generateImage };
