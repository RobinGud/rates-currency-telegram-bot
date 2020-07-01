const osmosis = require("osmosis");
var Sync = require("sync");
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

let town = "spb.";
let valute = "usd";

let banksRatesReq = async (town, valute, a) => {
  await osmosis
    .get(`https://${town}bankiros.ru/currency/${valute}`)
    .find("tbody > tr.productBank")
    .set(["td"])
    .data((data) => {
      a.push(data);
      // console.log(data.length);
    })
    .done(() => {
      // console.log(savedData);
      // return savedData;
    });
  // console.log(savedData);
  // return savedData;
};

// let banksRatesReq = (town, valute) =>
//   osmosis
//     .get(`https://${town}bankiros.ru/currency/${valute}`)
//     .find("table.non-standard > tr")
//     // .set(["td"])
//     .set(["a", "span.conv-val"])
//     .data((data) => {
//       if (data.length == 7) {
//         savedData.push([
//           data[0].toUpperCase(),
//           data[1],
//           data[3],
//           data[2],
//           data[4],
//         ]);
//       }
//       console.log(data);
//     })
//     .done(() => {
//       console.log(savedData);
//     });

// let a = banksRatesReq(town, valute);
// console.log(a);

// banksRatesReq(town, valute);
// console.log(savedData);
(async function () {
  let a = [];
  await banksRatesReq(town, valute, a);
  console.log(a);
})();
