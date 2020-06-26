const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const token = "924594568:AAHrreoO1YUzY975eGiMtTx2T6a1m9HVUcA";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const first_name = msg.chat.first_name;

  if (msg.text) {
    const text = msg.text.toLowerCase();

    if (~text.indexOf("привет")) {
      bot.sendMessage(chatId, "Приветик, " + first_name + "!");
    } else if (~text.indexOf("курс доллара")) {
      bot.sendMessage(chatId, "Курс доллара \n\t 60.00\n\t 61.00 ");
    } else {
      bot.sendMessage(chatId, "Unknown command");
    }
  }
});

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Приветик, " + msg.chat.first_name + "!");
  openKeyboard(chatId);
});

function openKeyboard(chatId) {
  bot.sendMessage(chatId, "Клавиатура открыта", {
    reply_markup: {
      keyboard: [
        // [
        {
          text: "Курс доллара",
        },
        {
          text: "Курс Евро",
        },
      ],
      one_time_keyboard: true,
    },
  });
}
