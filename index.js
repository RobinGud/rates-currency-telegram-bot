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

    //CBrates();

    if (~text.indexOf("курс доллара")) {
      for (let i = 1; i < 6; i++) {
        bot.sendMessage(
          chatId,
          fileContent[i][0] +
            "\n\t Купить  " +
            fileContent[i][1] +
            "\n\t Продать " +
            fileContent[i][2]
        );
      }
    } else if (~text.indexOf("курс евро")) {
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
    } else {
      bot.sendMessage(chatId, "Unknown command");
    }
  }
});

bot.onText(/\/start/, (msg, match) => {
  const chatId = msg.chat.id;
  openKeyboard(chatId);
  bot.sendMessage(chatId, "Приветик, " + msg.chat.first_name + "!");
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
        [
          {
            text: "Курс ЦБ",
          },
        ],
      ],
    },
  });
};
