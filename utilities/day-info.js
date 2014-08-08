var getDayInfo = function(date, needInfoByNextDay) {
  var MS_IN_HOUR = 3600 * 1000;

  function getHolidays (date) {
    var year = date.getFullYear();
    result = [];
    // 1, 2, 3, 4, 5, 6 и 8 января – Новогодние каникулы;
    // 7 января – Рождество Христово;
    for (var i = 1; i < 8; i++){
      result.push(new Date(year, 0, i));
    }

    // 23 февраля – День защитника Отечества;
    result.push(new Date(year, 1, 23));

    // 8 марта – Международный женский день;
    result.push(new Date(year, 2, 8));

    // 1 мая – Праздник Весны и Труда;
    result.push(new Date(year, 4, 1));

    // 9 мая – День Победы;
    result.push(new Date(year, 4, 9));

    // 12 июня – День России;
    result.push(new Date(year, 5, 12));

    // 4 ноября – День народного единства
    result.push(new Date(year, 10, 4));
    return result;
  }

  /*
   * Сравнение дат на равенство до дня -
   * по году, месяцу и дню.
   */
  function sameDay(date1, date2) {
    var d1 = [date1.getFullYear(), date1.getMonth(),
      date1.getDate()];
    var d2 = [date2.getFullYear(), date2.getMonth(),
      date2.getDate()];

    return (d1[0] == d2[0]) && (d1[1] == d2[1]) && (d1[2] == d2[2]);
  }

  var dayDate = new Date(date.getFullYear(), date.getMonth(),
    date.getDate());
  var dayInMillisec = dayDate.getTime();

  var HOLIDAY_DAY = {
    type: 'holiday_day',
    schedule: [ 
      DateInterval(NaN, NaN), 
      DateInterval(NaN, NaN)
    ]
  }

  var WORK_DAY = {
    type: 'work_day',
    schedule: [ 
      DateInterval(dayInMillisec + 9 * MS_IN_HOUR, dayInMillisec + 13 * MS_IN_HOUR), 
      DateInterval(dayInMillisec + 14 * MS_IN_HOUR, dayInMillisec + 18 * MS_IN_HOUR)
    ]
  }

  var SHORTENED_DAY = {
    type: 'before_holiday',
    schedule: [ 
      DateInterval(dayInMillisec + 9 * MS_IN_HOUR, dayInMillisec + 13 * MS_IN_HOUR), 
      DateInterval(dayInMillisec + 14 * MS_IN_HOUR, dayInMillisec + 17 * MS_IN_HOUR)
    ]
  }

  var dayIndex = date.getDay();
  // проверка на субботу и воскресенье
  if (dayIndex === 0 || dayIndex === 6){
    return HOLIDAY_DAY;
  }

  var dayInfo = WORK_DAY;

  // детерминированные праздники
  getHolidays(date).every(function(elm, index, arr){
    if(sameDay(elm, date)){
      dayInfo = HOLIDAY_DAY;
      return false;
    } else {
      return true;
    }
  });

  needInfoByNextDay = needInfoByNextDay===undefined ? true : false;
  // условие для рекурсии
  if (needInfoByNextDay && dayInfo.type != 'holiday_day'){
    var nextDay = new Date(date.getTime() + 24 * MS_IN_HOUR);
    // предотвращаем вечную рекурсиию
    var nextDayInfo = this.getDayInfo(nextDay, false);
    if (nextDayInfo.type === "holiday_day"){
      dayInfo = SHORTENED_DAY;
    }
  }

  return dayInfo;
}