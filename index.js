require("dotenv").config();
const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOTAPI;
// const bot = new TelegramBot(token, { polling: true });

// let BankRates = JSON.parse(fs.readFileSync("data.json", "utf8"));
// let CBRates = JSON.parse(fs.readFileSync("cb.json", "utf8")).ValCurs.Valute;

// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;

//   if (msg.text && msg.text[0] !== "/") {
//     const text = msg.text.toLowerCase();
//     let str = "";

//     if (~text.indexOf("курс доллара")) {
//       for (let i = 1; i < 10; i++) {
//         str +=
//           "🏦 " +
//           BankRates[i][0] +
//           "\n\t  Купить  " +
//           BankRates[i][1] +
//           "\n\t  Продать " +
//           BankRates[i][2] +
//           "\n\n";
//       }
//     } else if (~text.indexOf("курс евро")) {
//       for (let i = 1; i < 10; i++) {
//         str +=
//           "🏦 " +
//           BankRates[i][0] +
//           "\n\t  Купить  " +
//           BankRates[i][3] +
//           "\n\t  Продать " +
//           BankRates[i][4] +
//           "\n\n";
//       }
//     } else if (~text.indexOf("курс цб")) {
//       for (let i = 0; i < CBRates.length; i++) {
//         str +=
//           "[" +
//           CBRates[i].CharCode._text +
//           "]  " +
//           CBRates[i].Name._text +
//           " x" +
//           CBRates[i].Nominal._text +
//           "\n  " +
//           CBRates[i].Value._text +
//           "\n\n";
//       }
//     } else {
//       str = "Unknown command!";
//     }
//     bot.sendMessage(chatId, str);
//   }
// });

// bot.onText(/\/start/, (msg, match) => {
//   let chatId = msg.chat.id;
//   openKeyboard(chatId);
// });

// bot.on("polling_error", (msg) => console.log(msg));

// bot.onText(/convert (\d.+) (.+) to (.+)/, function (msg, match) {
//   let userId = msg.from.id;
//   let valuteValue = match[1];
//   let valuteFrom = match[2].toUpperCase();
//   let valuteTo = match[3].toUpperCase();
//   let nominalFrom, nominalTo, valueFrom, valueTo;

//   for (let i = 0; i < CBRates.length; i++) {
//     if (CBRates[i].CharCode._text == valuteFrom) {
//       nominalFrom = CBRates[i].Nominal._text;
//       valueFrom = parseFloat(
//         CBRates[i].Value._text.replace(",", ".").replace(" ", "")
//       );
//     }

//     if (CBRates[i].CharCode._text == valuteTo) {
//       nominalTo = CBRates[i].Nominal._text;
//       valueTo = parseFloat(
//         CBRates[i].Value._text.replace(",", ".").replace(" ", "")
//       );
//     }
//     if (valuteTo == "RUB") {
//       nominalTo = 1;
//       valueTo = 1;
//     }

//     if (valuteFrom == "RUB") {
//       nominalFrom = 1;
//       valueFrom = 1;
//     }
//   }

//   if (!valueFrom || !valueTo) {
//     bot.sendMessage(userId, "Невалидная валюта, попробуйте снова!");
//     return;
//   }

//   let Result = (
//     ((valuteValue / nominalFrom) * valueFrom * nominalTo) /
//     valueTo
//   ).toFixed(4);

//   bot.sendMessage(userId, Result + " " + valuteTo);
// });

// const openKeyboard = (chatId) => {
//   bot.sendMessage(chatId, "Привет", {
//     reply_markup: {
//       keyboard: [
//         [
//           {
//             text: "Курс Доллара",
//           },
//           {
//             text: "Курс Евро",
//           },
//         ],
//         [
//           {
//             text: "Курс ЦБ",
//           },
//         ],
//       ],
//     },
//   });
// };

let jsonValutes = {
  dollar: {
    name: ["доллар", "долар", "usd", ",бакс", "dollar", "dolar", "зелен"],
    url: "usd",
  },
  euro: {
    name: ["евро", "euro", "eur"],
    url: "eur",
  },
};

// const ex = (el) => /usd/.test(el);
let str = "евро купить зелен";

for (let valute in jsonValutes) {
  if (jsonValutes[valute].name.some((el) => str.includes(el))) {
    console.log(jsonValutes[valute].url);
    break;
  }
}

let jsonTowns = {
  moscow: {
    name: ["москв", "мск", "moscow", "MSC", "MSK"],
    url: "moskva",
  },
  saintpetersburg: {
    name: ["санкт-петербург", "питер", "спб", "spb", "ленинград"],
    url: "spb",
  },
};

let str1 = "в питере пить";

for (let town in jsonTowns) {
  if (jsonTowns[town].name.some((el) => str1.includes(el))) {
    console.log(jsonTowns[town].url);
    break;
  }
}

let str2 = "2 янв 07";
let dateRegex = /(0?[1-9]|[12][0-9]|3[01])[\/\-\. ](0?[1-9]|1[012]|(янв(?:аря)?|фев(?:раля)?|мар(?:та)?|апр(?:еля)?|мая|июн(?:я)?|июл(?:я)?|авг(?:уста)?|сен(?:тября)?|окт(?:ября)?|ноя(?:бря)?|дек(?:абря)?))($|[ \/\.\-\n]([0-9]{2,4})?)/;
let match = dateRegex.exec(str2);
// console.log(match[1], match[2], match[5]);
let day = match[1];
if (day < 10) {
  day = "0" + day.toString();
}

let month = match[2];
if (parseInt(match[2]) >= 0) {
  month = match[2];
} else {
  if (match[2] == "янв" || match[2] == "январь") {
    month = "01";
  }
  if (match[2] == "фев" || match[2] == "февраль") {
    month = "02";
  }
  if (match[2] == "мар" || match[2] == "марта") {
    month = "03";
  }
  if (match[2] == "апр" || match[2] == "апреля") {
    month = "04";
  }
  if (match[2] == "мая") {
    month = "05";
  }
  if (match[2] == "июн" || match[2] == "июня") {
    month = "06";
  }
  if (match[2] == "июл" || match[2] == "июля") {
    month = "07";
  }
  if (match[2] == "авг" || match[2] == "августа") {
    month = "08";
  }
  if (match[2] == "сен" || match[2] == "сентябрь") {
    month = "09";
  }
  if (match[2] == "окт" || match[2] == "октября") {
    month = "10";
  }
  if (match[2] == "ноя" || match[2] == "ноября") {
    month = "11";
  }
  if (match[2] == "дек" || match[2] == "декабря") {
    month = "12";
  }
}
let year;
if (match[5] == "undefined" || match[5] < 2000) {
  year = new Date().getFullYear();
} else {
  year = match[5];
}

console.log(day + "/" + month + "/" + year);

// bot.onText(/курс|curs/, (msg) => {
//   let chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Hello");
// });
