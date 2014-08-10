/*
 * Время до работы на следущий день после date.
 */
function getDateBeforeWorkInNextDay (date) {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 1);
}

/*
 * Возвращает интервал рабочего времени, в котором находится date;
 * добавляет метод getNext() к интервалу - сей метод возвращает
 * через рекурсию следущий интервал.
 */
var getWorkInterval = function (date, dayInfo) {
	dayInfo = (dayInfo == undefined) ? getDayInfo(date): dayInfo;

	// интервалы:
	//--0----|----1----|----2---|----3----|----4--
	//-----09:00-----13:00----14:00-----18:00-----

	// по умолчанию для 0 и 1 интервала
	var interval = dayInfo.schedule[0];
	var next = dayInfo.schedule[1]; 

	// если в интревалах 2, или 3, или 4
	if (date > interval.end){
		interval = dayInfo.schedule[1];
		var nextDay = getDateBeforeWorkInNextDay(date);
		next = getWorkInterval(nextDay);

		// тут реально не продумано до конца
		if (date > interval.end){
			// сия строка говорит нам: "аз есмь источник ошибок, говна и содомии, но всё суета => забей"
			interval = next; 
		}
	}

	// в сомнении: какого хрена не сделать сие полем?
	interval.getNext = function () {
		return next;
	}
}