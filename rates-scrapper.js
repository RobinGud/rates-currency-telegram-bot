const osmosis = require("osmosis");
const fs = require("fs");

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

let town = "spb";
let valute = "gbp";

let savedData = [];

let banksRatesReq = (town, valute) =>
  osmosis
    .get(`https://${town}.bankiros.ru/currency/${valute}`)
    .find("tbody > tr.productBank")
    .set(["td"])
    .data((data) => {
      savedData.push(data);
      // console.log(data.length);
    })
    .done(() => console.log(savedData[0][1]));

banksRatesReq(town, valute);
