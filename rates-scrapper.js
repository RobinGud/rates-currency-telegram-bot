const osmosis = require("osmosis");
const fs = require("fs");

let savedData = [];

osmosis
  .get("https://kovalut.ru/kurs/sankt-peterburg/")
  .find("table.tb-k tr")
  .set(["td"])
  .data(function (data) {
    if (data.length > 5) {
      data = data.slice(0, 5);
    }
    if (data.length === 5) {
      // console.log(data);
      savedData.push(data);
    }
  })
  .done(function () {
    fs.writeFile("data.json", JSON.stringify(savedData, null, 4), function (
      err
    ) {
      if (err) console.error(err);
      else console.log("Data Saved to data.json file");
    });
  });
