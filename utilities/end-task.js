var MS_IN_HOUR = 3600 * 1000;
var MS_IN_DAY = 24 * MS_IN_HOUR;

function getDayDuration (dayInfo) {
	var duration = 0;
	if (dayInfo.type == "work_day"){
		duration = 8 * MS_IN_HOUR;
	} else if (dayInfo.type == "before_holiday"){
		duration = 7 * MS_IN_HOUR;
	}

	return duration;
}


var getEndTask = function (startDate, duration) {
	var accumulator = 0;
	var endTask = new Date(startDate);
	var dayInfo = getDayInfo(endTask);
	var sumDates = function(date1, date2) {
    return new Date(date1.getTime() + date2.getTime());
  };

  if(duration >= MS_IN_DAY*30){
  	return sumDates(startDate, new Date(duration));
  }

	// сдвигаем начало задачи на рабочий день
	while (dayInfo.type == "holiday_day"){
		endTask = getDateBeforeWorkInNextDay(endTask);
		dayInfo = getDayInfo(endTask);
	}

	var dayDuration = getDayDuration(dayInfo);

	// проходим по дням
	while(accumulator < duration - dayDuration){
		accumulator += dayDuration;
		endTask.setTime(endTask.getTime() + MS_IN_DAY);
		dayInfo = getDayInfo(endTask);
		// опять сдвигаемся если выходной
		// не сделано методом, ибо надо менять
		// две переменные
		// while (dayInfo.type == "holiday_day"){
		// 	endTask = getDateBeforeWorkInNextDay(endTask);
		// 	dayInfo = getDayInfo(endTask);
		// }
		dayDuration = getDayDuration(dayInfo);
	}


	// проход по половинам рабочего дня: 09-13 и 14-17/18
	// смотрим сколько осталось до конца задачи
	var remainder = duration - accumulator;
	var interval = getWorkInterval(endTask, dayInfo);
	console.log(interval);
	while (remainder > interval.duration){
		remainder -= interval.includeWeak(endTask) ? (interval.end - endTask):  interval.duration;
		endTask = interval.end;
		interval = interval.getNext();
	}
	// должно остаться маленькое число в remainder
	endTask.setTime(interval.start.getTime() + remainder);

	return endTask;
}