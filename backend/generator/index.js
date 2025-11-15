const fs = require("fs");
const path = require("path");

const SD_API_URL = process.env.SD_API_URL || "http://127.0.0.1:7860";
const LORA_PROMPT = process.env.LORA_PROMPT || "";

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

  const imgBase64 = data.images[0]; // добавили
  const imgBuffer = Buffer.from(imgBase64, "base64");

  const fileName = `image_${Date.now()}.png`;
  const storageDir = path.join(__dirname, "..", "storage");
  const filePath = path.join(storageDir, fileName);

  await fs.promises.writeFile(filePath, imgBuffer);

  console.log("[generator] Картинка сохранена:", filePath);

  return { fileName, filePath };
}

module.exports = { generateImage };
