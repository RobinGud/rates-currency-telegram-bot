const index = require("./index.js");
let today = new Date();
let todayDay = today.getDate();
let todayMonth = today.getMonth() + 1;
let todayYear = today.getFullYear();

test("parsing date: 1 jun", () => {
  expect(index.parseDate("1 янв")).toBe("01/01/" + todayYear);
});

test("parsing date: 15 dec 12", () => {
  expect(index.parseDate("15 дек 12")).toBe("15/12/2012");
});

test("parseDate", () => {
  expect(index.parseDate("1 января")).toBe("01/01/" + todayYear);
});

test("parseDate", () => {
  expect(index.parseDate("20 февраля 2020")).toBe("20/02/2020");
});

test("parseDate", () => {
  expect(index.parseDate("1 1")).toBe("01/01/" + todayYear);
});

test("parseDate", () => {
  expect(index.parseDate("3 2 20")).toBe("03/02/2020");
});

test("parseDate", () => {
  expect(index.parseDate("01 01 20")).toBe("01/01/2020");
});

test("isDateFuture", () => {
  expect(index.isDateFuture(todayDay, todayMonth, todayYear + 1)).toBe(true);
  expect(index.isDateFuture(todayDay, todayMonth + 1, todayYear)).toBe(true);
  expect(index.isDateFuture(todayDay + 1, todayMonth, todayYear)).toBe(true);
  expect(index.isDateFuture(todayDay, todayMonth + 1, todayYear - 1)).toBe(
    false
  );
  expect(index.isDateFuture(todayDay + 1, todayMonth, todayYear - 1)).toBe(
    false
  );
});

test("CBReq", () => {
  expect(index.CBReq(172315033, "22/07/2010"));
});
