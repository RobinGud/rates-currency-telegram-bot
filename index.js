require("dotenv").config();
const fs = require("fs");
const osmosis = require("osmosis");
const Iconv = require("iconv").Iconv;
const request = require("request");
const parser = require("fast-xml-parser");
const TelegramBot = require("node-telegram-bot-api");
const winston = require("winston");

const bot = new TelegramBot(process.env.BOTAPI, { polling: true });

const logConfiguration = {
  transports: [new winston.transports.File({ filename: "bot.log" })],
};

const logger = winston.createLogger(logConfiguration);

const jsonValutes = JSON.parse(fs.readFileSync("valutes.json", "utf8"));
const jsonTowns = JSON.parse(fs.readFileSync("towns.json", "utf8"));

const conv = Iconv("windows-1251", "utf8");

const parse = (text, json) => {
  for (let obj in json) {
    if (json[obj].vocabulary.some((el) => text.includes(el))) {
      return json[obj];
    }
  }
  return "";
};

const parseDate = (text) => {
  let day, month, year;
  let dateRegex = /(0?[1-9]|[12][0-9]|3[01])[\/\-\. ](0?[1-9]|1[012]|(янв(?:аря)?|фев(?:раля)?|мар(?:та)?|апр(?:еля)?|мая|июн(?:я)?|июл(?:я)?|авг(?:уста)?|сен(?:тября)?|окт(?:ября)?|ноя(?:бря)?|дек(?:абря)?))($|[ \/\.\-\n]([0-9]{2,4})?)/;
  let match = dateRegex.exec(text);
  if (match) {
    day = match[1];
    month = match[2];
    year = match[5];
  }
  if (!day) {
    day = new Date().getDate();
  }
  if (day < 10) {
    day = "0" + parseInt(day).toString();
  }
  if (!month) {
    month = "0" + (new Date().getMonth() + 1);
  } else if (month >= 0) {
    month = match[2];
    if (month < 10) {
      month = "0" + parseInt(month).toString();
    }
  } else {
    if (month == "янв" || month == "января") {
      month = "01";
    }
    if (month == "фев" || month == "февраля") {
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
    if (month == "сен" || month == "сентября") {
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
  } else if (year < 100) {
    year = 2000 + parseInt(match[5]);
  }

  if (/позавчера/.exec(text)) {
    return convertData(new Date(year, month, parseInt(day) - 2));
  } else if (/вчера/.exec(text)) {
    return convertData(new Date(year, month, parseInt(day) - 1));
  }

  let dayBack = /(\d+) (дней|день) назад/.exec(text);
  if (dayBack) {
    return convertData(new Date(year, month, parseInt(day) - dayBack[1]));
  }

  let weekBack = /(\d+) (недел.) назад/.exec(text);
  if (weekBack) {
    return convertData(new Date(year, month, parseInt(day) - weekBack[1] * 7));
  }

  let monthBack = /(\d+) (месяц.+) назад/.exec(text);
  if (monthBack) {
    return convertData(new Date(year, parseInt(month) - monthBack[1], day));
  }

  let yearBack = /(\d+) (год.|лет) назад/.exec(text);
  if (yearBack) {
    return convertData(new Date(year - yearBack[1], month, day));
  }
  if (isDateFuture(day, month, year)) {
    return parseDate(" ");
  }
  return day + "/" + month + "/" + year;
};

const convertData = (date) => {
  day = date.getDate();
  month = date.getMonth();
  year = date.getFullYear();
  return parseDate(day + " " + month + " " + year);
};

const isDateFuture = (day, month, year) => {
  let today = new Date();
  let todayDay = today.getDate();
  let todayMonth = today.getMonth() + 1;
  let todayYear = today.getFullYear();

  if (year < todayYear) {
    return false;
  } else if (year > todayYear) {
    return true;
  } else {
    if (parseInt(month) < todayMonth) {
      return false;
    } else if (parseInt(month) > todayMonth) {
      return true;
    } else {
      if (parseInt(day) < todayDay) {
        return false;
      } else if (parseInt(day) > todayDay) {
        return true;
      } else {
        return false;
      }
    }
  }
};

const parseBanksRatesOneValute = (chatId, town, valute) => {
  if (!town) {
    town = { url: "", name: "В России" };
  }
  let resultString = `Курс ${valute.name} ${town.name}\n\n`;
  let isEmpty = 1;
  osmosis
    .get(`https://${town.url}bankiros.ru/currency/${valute.url}`)
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
      isEmpty = 0;
    })
    .error(logger.error)
    .done(() => {
      if (isEmpty) {
        bot.sendMessage(chatId, `${town.name} не обменивают ${valute.name}`);
      } else {
        bot.sendMessage(chatId, resultString);
      }
    });
};

const parseBanksRatesAllValutes = (chatId, town) => {
  if (!town) {
    town = { url: "", name: "В России" };
  }
  let resultString = `Лучшие курсы валют ${town.name}:\n\n`;
  osmosis
    .get(`https://${town.url}bankiros.ru/currency/`)
    .find("table.non-standard > tr")
    .set(["a", "span.conv-val"])
    .data((data) => {
      if (data.length > 1) {
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
    })
    .error(logger.error)
    .done(() => {
      bot.sendMessage(chatId, resultString);
    });
};

const CBReq = (chatId, date) => {
  let resultString = `Курс ЦБ на ${date}\n\n`;
  request(
    {
      uri: `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${date}`,
      method: "GET",
      encoding: "binary",
    },
    function (error, response, body) {
      if (response && response.statusCode == 200) {
        body = new Buffer(body, "binary");
        body = conv.convert(body).toString();

        if (parser.validate(body) === true) {
          var jsonObj = parser.parse(body).ValCurs.Valute || {};
          if (Object.keys(jsonObj).length === 0) {
            logger.error(`${JSON.stringify(response)}`);
          }
          for (let i = 0; i < jsonObj.length; i++) {
            resultString +=
              "[" +
              jsonObj[i].CharCode +
              "]  " +
              jsonObj[i].Name +
              " x" +
              jsonObj[i].Nominal +
              "\n  " +
              jsonObj[i].Value +
              "\n\n";
          }
          bot.sendMessage(chatId, resultString);
        }
      } else {
        logger.error(error);
      }
    }
  );
};

bot.onText(/(\d.+) (.+) в (.+)/, function (msg, match) {
  let userId = msg.from.id;
  let valuteValue = match[1];
  let valuteFrom = parse(match[2].toLowerCase(), jsonValutes).url;
  let valuteTo = parse(match[3].toLowerCase(), jsonValutes).url;
  let date = parseDate(" ");
  let nominalFrom, nominalTo, valueFrom, valueTo;
  rubRegex = /rub|рубл/;

  if (!valuteTo && rubRegex.test(match[3].toLowerCase())) {
    nominalTo = 1;
    valueTo = 1;
    valuteTo = "rub";
  }

  if (!valuteFrom && rubRegex.test(match[2].toLowerCase())) {
    nominalFrom = 1;
    valueFrom = 1;
  }

  request(
    {
      uri: `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${date}`,
      method: "GET",
      encoding: "binary",
    },
    function (error, response, body) {
      if (response && response.statusCode == 200) {
        body = new Buffer(body, "binary");
        body = conv.convert(body).toString();

        if (parser.validate(body) === true) {
          var jsonObj = parser.parse(body).ValCurs.Valute || {};
          if (Object.keys(jsonObj).length === 0) {
            logger.error(`${JSON.stringify(response)}`);
          }
          for (let i = 0; i < jsonObj.length; i++) {
            if (jsonObj[i].CharCode.toLowerCase() == valuteFrom) {
              nominalFrom = jsonObj[i].Nominal;
              valueFrom = parseFloat(
                jsonObj[i].Value.replace(",", ".").replace(" ", "")
              );
            }

            if (jsonObj[i].CharCode.toLowerCase() == valuteTo) {
              nominalTo = jsonObj[i].Nominal;
              valueTo = parseFloat(
                jsonObj[i].Value.replace(",", ".").replace(" ", "")
              );
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
        }
      } else {
        logger.error(error);
      }
    }
  );
});

bot.onText(/курс|curs|Курс|Curs/, (msg) => {
  let chatId = msg.chat.id;
  let text = msg.text.toLowerCase();
  let valute = parse(text, jsonValutes);
  let town = parse(text, jsonTowns);
  let date = parseDate(text);
  logger.info(
    `id: ${chatId} send message: ${text}, parse data: ${valute.name} ${town.name} ${date}`
  );
  if (/цб/.test(text)) {
    CBReq(chatId, date);
  } else if (!valute) {
    parseBanksRatesAllValutes(chatId, town);
  } else {
    parseBanksRatesOneValute(chatId, town, valute);
  }
});

bot.onText(/\/start/, (msg) => {
  let chatId = msg.chat.id;
  bot.sendMessage(chatId, "Добрый день", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Список городов и валют",
            callback_data: "/list",
          },
        ],
        [
          {
            text: "Справка",
            callback_data: "/help",
          },
        ],
      ],
    },
  });
});

bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  if (query.data === "/help") {
    bot.sendMessage(
      chatId,
      "Для Получения курса Цб на конкретную дату:\n\tкурс цб {дата}\n\tНапример: курс цб 22 июня 2020\n\n" +
        "Для получения курса валюты в регионе:\n\tкурс {валюта} {город}\n\tНапример: курс евро в спб\n\n" +
        "Для получения лучших курсов всех валют в регионе:\n\tкурс {город}\n\tНапример: курс в Ижевске\n\n" +
        "Для конвертации валюты по курсу ЦБ:\n\t{количество} {валюта} в {валюта}\n\tНапример: 100 баксов в фунты"
    );
  }
  if (query.data === "/list") {
    bot.sendMessage(
      chatId,
      "Города:\n\tМосква\n\tСпб\n\tЕкб\n\tОренбург\n\tНовосибирск\n\tТомск\n\tОмск\n\tЧелябинск\n\t" +
        "Ростов\n\tКрасноярск\n\tВоронеж\n\tВолгоград\n\tКраснодар\n\tСаратов\n\tВладивосток\n\tИжевск\n\tБарнаул\n\t" +
        "Иркутск\n\tУльяновск\n\tХабаровск\n\tКазань\n\tСамара\n\tУфа\n\tПермь\n\tТюмень\n\tТольятти\n\tЯрославль\n\tМахачкала\n\tНижний Новгород\n\n" +
        "Валюты: \n\tдоллар \n\tевро \n\tфунт стерлингов \n\tбелоруский рубль \n\tпольский злотый \n\tшвейцарский франк \n\tяпонский йен"
    );
  }
});

bot.on("polling_error", (msg) => console.log(msg));

module.exports = {
  parseDate,
  isDateFuture,
  CBReq,
};
