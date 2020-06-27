const fetch = require("node-fetch");
const fs = require("fs");
var convert = require("xml-js");

fetch("https://www.cbr-xml-daily.ru/daily_utf8.xml")
  .then(function (response) {
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    response.text().then(function (data) {
      fs.writeFile(
        "cb.json",
        convert.xml2json(data, { compact: true, spaces: 4 }),
        function (err) {
          if (err) console.error(err);
          else console.log("Data Saved to cb.json file");
        }
      );
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });
