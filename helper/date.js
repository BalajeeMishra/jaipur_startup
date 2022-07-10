const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

module.exports.timingFormat = () => {
  var date = new Date();
  var year = date.getFullYear();
  const monthname = monthNames[date.getMonth()];
  //8 for this month...
  let day = weekday[date.getDay()];
  var month = String(date.getMonth() + 1).padStart(2, "0");
  var givenDate = String(date.getDate()).padStart(2, "0");
  var givenDateShowpage =
    day + ", " + monthname + " " + givenDate + ", " + year;
  var datePattern = year + "-" + month + "-" + givenDate;
  var dateTosave = givenDate + "-" + month + "-" + year;
  var monthandyear = month + "-" + year;
  const formats = {
    givenDateShowpage,
    datePattern,
    dateTosave,
    givenDate,
    month,
    year,
    monthandyear,
  };
  return formats;
};
