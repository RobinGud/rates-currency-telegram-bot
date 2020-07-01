require("dotenv").config();
const fs = require("fs");

const TelegramBot = require("node-telegram-bot-api");
const token = process.env.BOTAPI;
const bot = new TelegramBot(token, { polling: true });

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

// const ex = (el) => /usd/.test(el);
// let str = "евро купить зелен";
// let parseValute = (text) => {
//   for (let valute in jsonValutes) {
//     if (jsonValutes[valute].name.some((el) => str.includes(el))) {
//       // console.log(jsonValutes[valute].url);
//       return jsonValutes[valute].url;
//     }
//   }
// };

let parse = (text, json) => {
  for (let obj in json) {
    if (json[obj].name.some((el) => text.includes(el))) {
      // console.log(jsonValutes[valute].url);
      return json[obj].url;
    }
  }
  return "";
};

// let str1 = "в питере пить";

// for (let town in jsonTowns) {
//   if (jsonTowns[town].name.some((el) => str1.includes(el))) {
//     console.log(jsonTowns[town].url);
//     break;
//   }
// }

// let str2 = "2 янв 07";

let parseDate = (text) => {
  let day, month, year;
  let dateRegex = /(0?[1-9]|[12][0-9]|3[01])[\/\-\. ](0?[1-9]|1[012]|(янв(?:аря)?|фев(?:раля)?|мар(?:та)?|апр(?:еля)?|мая|июн(?:я)?|июл(?:я)?|авг(?:уста)?|сен(?:тября)?|окт(?:ября)?|ноя(?:бря)?|дек(?:абря)?))($|[ \/\.\-\n]([0-9]{2,4})?)/;
  let match = dateRegex.exec(text);
  if (match) {
    console.log(match[1], match[2], match[5], "sdada");
    day = match[1];
    month = match[2];
    year = match[5];
  }
  // console.log(match);
  // let day = match[1];
  if (!day) {
    day = new Date().getDate();
    console.log(day);
  }
  if (day < 10) {
    day = "0" + day.toString();
  }
  if (!month) {
    month = "0" + (new Date().getMonth() + 1);
    console.log(month);
  } else if (parseInt(month) >= 0) {
    month = match[2];
  } else {
    if (month == "янв" || month == "январь") {
      month = "01";
    }
    if (month == "фев" || month == "февраль") {
      month = "02";
    }
    if (month == "мар" || month == "марта") {
      month = "03";
    }
    if (month == "апр" || month == "апреля") {
      month = "04";
    }
    if (month == "мая") {
      month = "05";
    }
    if (month == "июн" || month == "июня") {
      month = "06";
    }
    if (month == "июл" || month == "июля") {
      month = "07";
    }
    if (month == "авг" || month == "августа") {
      month = "08";
    }
    if (month == "сен" || month == "сентябрь") {
      month = "09";
    }
    if (month == "окт" || month == "октября") {
      month = "10";
    }
    if (month == "ноя" || month == "ноября") {
      month = "11";
    }
    if (month == "дек" || month == "декабря") {
      month = "12";
    }
  }
  if (!year) {
    year = new Date().getFullYear();
    console.log(year);
  } else if (year < 100) {
    year = 2000 + match[5];
  }
  return day + "/" + month + "/" + year;
};

let jsonValutes = JSON.parse(fs.readFileSync("valutes.json", "utf8"));
let jsonTowns = JSON.parse(fs.readFileSync("towns.json", "utf8"));

// parseDate("22 июня");
// const mod = require("./rates-scrapper.js");
// import sayHi from "./rates-scrapper";
const osmosis = require("osmosis");

let parseBanksRatesOneValute = (chatId, town, valute) => {
  let resultString = "";
  osmosis
    .get(`https://${town}bankiros.ru/currency/${valute}`)
    .find("tbody > tr.productBank")
    .set(["td"])
    .data((data) => {
      resultString +=
        "" +
        data[0] +
        "\n   Покупка  " +
        data[1] +
        "\n   Продажа " +
        data[2] +
        "\n\n";
      // console.log(resultString);
    })
    .done(() => bot.sendMessage(chatId, resultString));
};

let parseBanksRatesAllValutes = (chatId, town) => {
  let resultString = "Лучшие курсы банков:\n\n";
  osmosis
    .get(`https://${town}bankiros.ru/currency/`)
    .find("table.non-standard > tr")
    // .set(["td"])
    .set(["a", "span.conv-val"])
    .data((data) => {
      if (data.length == 6) {
        resultString +=
          "" +
          data[0].toUpperCase() +
          "\n " +
          data[1] +
          "\n   Покупка    " +
          data[3] +
          "\n " +
          data[2] +
          "\n   Продажа   " +
          data[4] +
          "\n\n";
      }
      // console.log(data);
    })
    .done(() => bot.sendMessage(chatId, resultString));
};

bot.onText(/курс|curs|Курс|Curs/, (msg) => {
  let chatId = msg.chat.id;
  let text = msg.text.toLowerCase();
  let valute = parse(text, jsonValutes);
  let town = parse(text, jsonTowns);
  let date = parseDate(text);
  // mod.Hello.myFunction(text);
  // let b = "";
  // console.log(
  //   text + "\n valute " + valute + "\n town " + town + "\n date " + date
  // );
  if (!town) {
    parseBanksRatesAllValutes(chatId, valute);
  } else {
    parseBanksRatesOneValute(chatId, town, valute);
  }
  // mod.Hello.ParseBanksRates("spb.", "usd", b).then(bot.sendMessage(chatId, b));

  bot.sendMessage(chatId, valute + " " + town + " " + date);
});

bot.on("polling_error", (msg) => console.log(msg));
