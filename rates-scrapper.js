// const osmosis = require("osmosis");
// var Sync = require("sync");
// const fs = require("fs");

// let savedData = [];

// osmosis
//   .get("https://kovalut.ru/kurs/sankt-peterburg/")
//   .find("table.tb-k tr")
//   .set(["td"])
//   .data(function (data) {
//     if (data.length > 5) {
//       data = data.slice(0, 5);
//     }
//     if (data.length === 5) {
//       savedData.push(data);
//     }
//   })
//   .done(function () {
//     fs.writeFile("data.json", JSON.stringify(savedData, null, 4), function (
//       err
//     ) {
//       if (err) console.error(err);
//       else console.log("Data Saved to data.json file");
//     });
//   });

// osmosis
//   .get("https://www.banki.ru/products/currency/cash/gbp/sankt-peterburg/")
//   .find("div.exchange-calculator-rates")
//   .set(".trades-table__name > a")
//   .data(console.log);

// let town = "spb.";
// let valute = "usd";

// let parseBanksRatesOneValute = async (town, valute, resultString) => {
//   await osmosis
//     .get(`https://${town}bankiros.ru/currency/${valute}`)
//     .find("tbody > tr.productBank")
//     .set(["td"])
//     .data((data) => {
//       resultString +=
//         "" + data[0] + "\n Покупка " + data[1] + "\n Продажа " + data[2] + "\n";
//       // console.log(resultString);
//     });
//   // .done(() => {
//   // console.log(savedData);
//   // return savedData;
//   // });
//   // console.log(savedData);
//   // return savedData;
// };

// let parseBanksRatesAllValutes = async (town, resultArray) =>
//   await osmosis
//     .get(`https://${town}bankiros.ru/currency/`)
//     .find("table.non-standard > tr")
//     // .set(["td"])
//     .set(["a", "span.conv-val"])
//     .data((data) => {
//       if (data.length == 7) {
//         resultArray.push([
//           data[0].toUpperCase(),
//           data[1],
//           data[3],
//           data[2],
//           data[4],
//         ]);
//       }
//       // console.log(data);
//     });
// // .done(() => {
// //   console.log(savedData);
// // });

// let a = banksRatesReq(town, valute);
// console.log(a);

// banksRatesReq(town, valute);
// console.log(savedData);
// let ParseBanksRates = async function (town, valute, res) {
//   if (valute == "") {
//     await parseBanksRatesAllValutes(town, res);
//     console.log(res);
//   } else {
//     await parseBanksRatesOneValute(town, valute, res);
//     console.log(res);
//   }
//   foo = res;
// };

// a();
// const myFunction = (user) => {
//   console.log(`Hello, ${user}!`);
// };

// const b = (user) => {
//   console.log(`Hello, ${user}!`);
// };

// export { sayHi };

// export default sayHi;

// module.exports.Hello = { ParseBanksRates };
