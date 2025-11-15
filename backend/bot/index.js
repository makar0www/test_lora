const fs = require("fs");
const TelegramBot = require("node-telegram-bot-api");

function initBot(generateImage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log("[bot] TELEGRAM_BOT_TOKEN не задан — бот не будет запущен");
    return;
  }

  const bot = new TelegramBot(token, { polling: true });
  console.log("[bot] Бот запущен. Используй команду /gen <текст>");

  bot.onText(/^\/gen (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const prompt = match[1];

    bot.sendMessage(chatId, "Генерирую изображение...");

    try {
      const { filePath } = await generateImage(prompt);
      await bot.sendPhoto(chatId, fs.createReadStream(filePath));
    } catch (err) {
      console.error(err);
      bot.sendMessage(chatId, "Ошибка при генерации 😢");
    }
  });

  bot.onText(/^\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Привет! Отправь:\n/gen <описание>");
  });
}

module.exports = { initBot };
