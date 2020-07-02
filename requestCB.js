//const fetch = require("node-fetch");
//const fs = require("fs");
// var convert = require("xml-js");

// fetch("https://www.cbr-xml-daily.ru/daily_utf8.xml")
//   .then(function (response) {
//     if (response.status !== 200) {
//       console.log(
//         "Looks like there was a problem. Status Code: " + response.status
//       );
//       return;
//     }

//     response.text().then(function (data) {
//       fs.writeFile(
//         "cb.json",
//         convert.xml2json(data, { compact: true, spaces: 4 }),
//         function (err) {
//           if (err) console.error(err);
//           else console.log("Data Saved to cb.json file");
//         }
//       );
//     });
//   })
//   .catch(function (err) {
//     console.log("Fetch Error :-S", err);
//   });

// fetch("http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002").then(
//   (response) => {
//     if (response.status !== 200) {
//       console.log("Error load cbr rate. Status Code: " + response.status);
//       return;
//     }
//     response.text().then((data) => console.log(data));
//   }
// );

// 1. Создаём новый объект XMLHttpRequest
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
// var xhr = new XMLHttpRequest();

// // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
// xhr.open(
//   "GET",
//   "http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002",
//   false
// );

// // 3. Отсылаем запрос
// xhr.send();

// // 4. Если код ответа сервера не 200, то это ошибка
// if (xhr.status != 200) {
//   // обработать ошибку
//   console.log(xhr.status + ": " + xhr.statusText); // пример вывода: 404: Not Found
// } else {
//   // вывести результат
//   console.log(xhr.responseText); // responseText -- текст ответа.
// }

// var needle = require("needle");
// // var windows1251 = require("windows-1251");

// needle.get(
//   "http://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002",
//   function (error, response) {
//     if (!error && response.statusCode == 200)
//       console.log(response.body.children[0].children[3].value);
//   }
// );

// const Iconv = require("iconv").Iconv;
// const request = require("request");
// const parser = require("fast-xml-parser");

// let CBReq = (date) => {
//   request(
//     {
//       uri: `http://www.cbr.ru/scripts/XML_daily.asp?date_req=${date}`,
//       method: "GET",
//       encoding: "binary",
//     },
//     function (error, response, body) {
//       if (response.statusCode == 200) {
//         let conv = Iconv("windows-1251", "utf8");
//         body = new Buffer(body, "binary");
//         body = conv.convert(body).toString();
//         //console.log(body);
//         // var he = require("he");

//         // var options = {
//         //   attributeNamePrefix: "@_",
//         //   attrNodeName: "attr", //default is 'false'
//         //   textNodeName: "#text",
//         //   ignoreAttributes: true,
//         //   ignoreNameSpace: false,
//         //   allowBooleanAttributes: false,
//         //   parseNodeValue: true,
//         //   parseAttributeValue: false,
//         //   trimValues: true,
//         //   cdataTagName: "__cdata", //default is 'false'
//         //   cdataPositionChar: "\\c",
//         //   parseTrueNumberOnly: false,
//         //   arrayMode: false, //"strict"
//         //   // attrValueProcessor: (val, attrName) =>
//         //   //   he.decode(val, { isAttributeValue: true }), //default is a=>a
//         //   // tagValueProcessor: (val, tagName) => he.decode(val), //default is a=>a
//         //   stopNodes: ["parse-me-as-string"],
//         // };

//         if (parser.validate(body) === true) {
//           //optional (it'll return an object in case it's not valid)
//           var jsonObj = parser.parse(body);
//         }
//         console.log(jsonObj.ValCurs.Valute[1]);
//       } else {
//         console.log(error);
//       }
//     }
//   );
// };

// let dateReq = "02/03/2004";
// CBReq(dateReq);
