require("dotenv").config();
const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOTAPI;
const bot = new TelegramBot(token, { polling: true });

let BankRates = JSON.parse(fs.readFileSync("data.json", "utf8"));
let CBRates = JSON.parse(fs.readFileSync("cb.json", "utf8")).ValCurs.Valute;

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const first_name = msg.chat.first_name;

  if (msg.text) {
    const text = msg.text.toLowerCase();
    let str = "";
    //CBrates();

    if (~text.indexOf("курс доллара")) {
      for (let i = 1; i < 6; i++) {
        str +=
          "🏦 " +
          BankRates[i][0] +
          "\n\t  Купить  " +
          BankRates[i][1] +
          "\n\t  Продать " +
          BankRates[i][2] +
          "\n\n";
      }
      // bot.sendMessage(chatId, str);
    } else if (~text.indexOf("курс евро")) {
      for (let i = 1; i < 6; i++) {
        str +=
          "🏦 " +
          BankRates[i][0] +
          "\n\t  Купить  " +
          BankRates[i][3] +
          "\n\t  Продать " +
          BankRates[i][4] +
          "\n\n";
      }
      // bot.sendMessage(chatId, str);
    } else if (~text.indexOf("курс цб")) {
      for (let i = 0; i < CBRates.length; i++) {
        str +=
          CBRates[i].Name._text +
          " x" +
          CBRates[i].Nominal._text +
          "\n  " +
          CBRates[i].Value._text +
          "\n\n";
      }
    } else {
      str = "Unknown command";
      //bot.sendMessage(chatId, "Unknown command");
    }
    bot.sendMessage(chatId, str);
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
