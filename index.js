require("dotenv").config();
const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOTAPI;

const bot = new TelegramBot(token, { polling: true });

let fileContent = JSON.parse(fs.readFileSync("data.json", "utf8"));

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const first_name = msg.chat.first_name;

  if (msg.text) {
    const text = msg.text.toLowerCase();

    if (~text.indexOf("привет")) {
      bot.sendMessage(chatId, "Приветик, " + first_name + "!");
    } else if (~text.indexOf("курс доллара")) {
      // bot.sendMessage(chatId, "Курс доллара💵");
      for (let i = 1; i < 6; i++) {
        bot.sendMessage(
          chatId,
          fileContent[i][0] +
            "\n\t" +
            fileContent[i][1] +
            "\n\t" +
            fileContent[i][2]
        );
      }
    } else if (~text.indexOf("курс евро")) {
      // bot.sendMessage(chatId, "Курс Евро💶");
      for (let i = 1; i < 6; i++) {
        bot.sendMessage(
          chatId,
          fileContent[i][0] +
            "\n\t" +
            fileContent[i][3] +
            "\n\t" +
            fileContent[i][4]
        );
      }
    } else if (~text.indexOf("клав")) {
      openKeyboard(chatId);
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

const openKeyboard = (chatId) => {
  bot.sendMessage(chatId, "Клавиатура открыта", {
    reply_markup: {
      keyboard: [
        [
          {
            text: "Курс Доллара",
          },
          {
            text: "Курс Евро",
          },
        ],
      ],
    },
  });
};
