require("dotenv").config();
const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOTAPI;
const bot = new TelegramBot(token, { polling: true });

let BankRates = JSON.parse(fs.readFileSync("data.json", "utf8"));
let CBRates = JSON.parse(fs.readFileSync("cb.json", "utf8")).ValCurs.Valute;

bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  if (msg.text && msg.text[0] !== "/") {
    const text = msg.text.toLowerCase();
    let str = "";

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
    } else if (~text.indexOf("курс цб")) {
      for (let i = 0; i < CBRates.length; i++) {
        str +=
          "[" +
          CBRates[i].CharCode._text +
          "]  " +
          CBRates[i].Name._text +
          " x" +
          CBRates[i].Nominal._text +
          "\n  " +
          CBRates[i].Value._text +
          "\n\n";
      }
    } else {
      str = "Unknown command!";
    }
    bot.sendMessage(chatId, str);
  }
});

bot.onText(/\/start/, (msg, match) => {
  let chatId = msg.chat.id;
  openKeyboard(chatId);
});

bot.on("polling_error", (msg) => console.log(msg));

bot.onText(/convert (\d.+) (.+) to (.+)/, function (msg, match) {
  let userId = msg.from.id;
  let valuteValue = match[1];
  let valuteFrom = match[2].toUpperCase();
  let valuteTo = match[3].toUpperCase();
  let nominalFrom, nominalTo, valueFrom, valueTo;

  for (let i = 0; i < CBRates.length; i++) {
    if (CBRates[i].CharCode._text == valuteFrom) {
      nominalFrom = CBRates[i].Nominal._text;
      valueFrom = parseFloat(
        CBRates[i].Value._text.replace(",", ".").replace(" ", "")
      );
    }

    if (CBRates[i].CharCode._text == valuteTo) {
      nominalTo = CBRates[i].Nominal._text;
      valueTo = parseFloat(
        CBRates[i].Value._text.replace(",", ".").replace(" ", "")
      );
    }
    if (valuteTo == "RUB") {
      nominalTo = 1;
      valueTo = 1;
    }

    if (valuteFrom == "RUB") {
      nominalFrom = 1;
      valueFrom = 1;
    }
  }

  if (!valueFrom || !valueTo) {
    bot.sendMessage(userId, "Невалидная валюта, попробуйте снова!");
    return;
  }

  let Result = (
    ((valuteValue / nominalFrom) * valueFrom * nominalTo) /
    valueTo
  ).toFixed(4);

  bot.sendMessage(userId, Result + " " + valuteTo);
});

const openKeyboard = (chatId) => {
  bot.sendMessage(chatId, "Привет", {
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
