const index = require("./index.js");
const today = new Date();
const todayDay = today.getDate();
const todayMonth = today.getMonth() + 1;
const todayYear = today.getFullYear();

test("parsing date: 1 jun", () => {
  expect(index.parseDate("1 янв")).toBe("01/01/" + todayYear);
});

test("parsing date: 15 dec 12", () => {
  expect(index.parseDate("15 дек 12")).toBe("15/12/2012");
});

test("parsing date: 1 jan", () => {
  expect(index.parseDate("1 января")).toBe("01/01/" + todayYear);
});

test("parsing date: 20 february 2020", () => {
  expect(index.parseDate("20 февраля 2020")).toBe("20/02/2020");
});

test("parsing date: 1 1", () => {
  expect(index.parseDate("1 1")).toBe("01/01/" + todayYear);
});

test("parsing date: 3 2 20", () => {
  expect(index.parseDate("3 2 20")).toBe("03/02/2020");
});

test("parsing date: 01 01 20", () => {
  expect(index.parseDate("01 01 20")).toBe("01/01/2020");
});

test("isDateFuture future years", () => {
  expect(index.isDateFuture(todayDay, todayMonth, todayYear + 1)).toBe(true);
});

test("isDateFuture future month", () => {
  expect(index.isDateFuture(todayDay, todayMonth + 1, todayYear)).toBe(true);
});

test("isDateFuture future day", () => {
  expect(index.isDateFuture(todayDay + 1, todayMonth, todayYear)).toBe(true);
});

test("isDateFuture future month and past month", () => {
  expect(index.isDateFuture(todayDay, todayMonth + 1, todayYear - 1)).toBe(
    false
  );
});
test("isDateFuture future day and past year", () => {
  expect(index.isDateFuture(todayDay + 1, todayMonth, todayYear - 1)).toBe(
    false
  );
});
