$(document).ready(function(){
	
	// $(window).bind('mousewheel DOMMouseScroll', function(event){
	// 	var e = event;
	//     if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
	//         // scroll up
	//     }
	//     else {
	//         // scroll down
	//     }
	// });

	var obj = document.body;  // obj=element for example body
	// bind mousewheel event on the mouseWheel function
	if(obj.addEventListener)
	{
	    obj.addEventListener('DOMMouseScroll',mouseWheel,false);
	    obj.addEventListener("mousewheel",mouseWheel,false);
	}
	else obj.onmousewheel=mouseWheel;

	function mouseWheel(e)
	{
	    // disabling
	    e=e?e:window.event;
	    if(e.ctrlKey)
	    {
	        if(e.preventDefault) e.preventDefault();
	        else e.returnValue = false;

	        console.log("Work hah " + new Date());
	        if (e.deltaY > 0){
	        	if (scale > 0){
	        		scale--;
	        	} else if (scale == 0){
	        		scale = 9;
	        	}
	        } else {
	        	if (scale < 9) {
					scale++;
				} else {
					scale = 0;
				}
	        }
	        
		
			showScale(scale,chartStartDateF,chartEndDateF);

	        return false;
	    }
	}

	//праздники
	function Holidays () {
		var _holidays = [];

		// Маловероятное значение для года вначале,
		// чтобы в первый раз initHolidays инициализировал 
		var year = 0;

		function initHolidays (date) {

			var oldYear = year;
			var year = date.getFullYear();

			//Что бы не пересчитывать, если год не изменился.
			if (oldYear != year){

				// 1, 2, 3, 4, 5, 6 и 8 января – Новогодние каникулы;
				// 7 января – Рождество Христово;
				for (var i = 1; i < 8; i++){
					_holidays.push(new Date(year, 0, i));
				}

				// 23 февраля – День защитника Отечества;
				_holidays.push(new Date(year, 1, 23));

				// 8 марта – Международный женский день;
				_holidays.push(new Date(year, 2, 8));

				// 1 мая – Праздник Весны и Труда;
				_holidays.push(new Date(year, 4, 1));

				// 9 мая – День Победы; 
				_holidays.push(new Date(year, 4, 9));

				// 12 июня – День России; 
				_holidays.push(new Date(year, 5, 12));

				// 4 ноября – День народного единства
				_holidays.push(new Date(year, 10, 4));
			}
		}

		/*
		 * Сравнение дат на равенство до дня - 
		 * по году, месяцу и дню.
		 */
		function equalsDateByDay (date1, date2) {
			var date1BeforeDay = new Date(date1.getFullYear(), date1.getMonth(),
				date1.getDate());
			var date2BeforeDay = new Date(date2.getFullYear(), date2.getMonth(),
				date2.getDate());

			return date1BeforeDay - date2BeforeDay === 0;	
		}

		this.getDayInfo = function (date, needInfoByNextDay = true) {
			initHolidays(date);

			var result = _holidays.find(function(element, index, arr){
				return equalsDateByDay(element, date);
			});

			var dayDate = new Date(date.getFullYear(), date.getMonth(),
				date.getDate);
			var dayInMillisec = dayDate.getTime();
			var hourMs = 3600 * 1000;

			var dayInfo = {
				type: "work_day",
			 	schedule: [{
			 					start: new Date(dayInMillisec + 9 * hourMs),
			 					end: new Date(dayInMillisec + 13 * hourMs)
			 				}, 

			 				{
			 					start: new Date(dayInMillisec + 14 * hourMs),
			 					end: new Date(dayInMillisec + 18 * hourMs)
			 				}
			 	]
			};
			if (result !== undefined){
				dayInfo.type = "holiday_day";
			}

			// условие для рекурсии
			if (needInfoByNextDay){
				var nextDay = new Date();
				nextDay.setTime(date.getTime() + 24 * 3600 * 1000);

				var nextDayInfo = this.getDayInfo(nextDay, false);
				if (nextDay.type === "holiday_day"){
					dayInfo.type = "before_holiday";
					dayInfo.schedule[0] = {start: }
				}
			}

			return dayInfo;
		}
		
	}

	holiday = new Holidays();

	var scale = 0;
	var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday",
		"Friday", "Saturday"];
	var months = ["January", "February", "March", "April", "May", "June","July",
		"August","September","October","November","December"];

	var chartStartDateF = new Date("Jan 1, 2013 03:50:00");
	var chartEndDateF = new Date("Jul 1, 2013");

	//список задач
	var activities = [
		{
			startDate:"Jan 01, 2013 03:50:00",
			endDate:"Jan 01, 2013 07:00:00"
		},

		{
			startDate:"Jan 02, 2013 00:00:00",
			endDate:"Jan 03, 2013 00:07:00"
		},

		{
			startDate:"Feb 01, 2013",
			endDate:"Feb 28, 2013"
		},

		{
			startDate:"Jan 04, 2013",
			endDate:"Apr 3, 2013"
		}
	];

	
	Date.prototype.getDaysInYear = function(){
	    var y = this.getFullYear();
	    return (y % 4 == 0 && y % 100 != 0 || y % 400 == 0)?366:365;
	}; 

	Date.prototype.getDaysInMonth = function(){
	    return arguments.callee[this.getDaysInYear()==366 ? 'widthUnitContent' : 'R'][this.getMonth()];
	};

	// durations of months for the regular year
	Date.prototype.getDaysInMonth.R = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	
	// durations of months for the leap year
	Date.prototype.getDaysInMonth.widthUnitContent = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	

	function monthUnitLength(myDate){		
		var k = 24*60*60*1000*myDate.getDaysInMonth()/this.mainUnitMilliSec;		
		var p = this.mainUnitLength * k + (k-1) * 1;		
		return Math.round(p);
	}

	function mostUnitLength(myDate){
		var k = this.unitMilliSec/this.mainUnitMilliSec;		
		return Math.round(this.mainUnitLength * k + (k-1) * 1);
	}

	/* 
	 * Служебный метод для вычисления грнаниц периодов, состоящих из нескольких
	 * месяце: кварталов, полугодий, года.
	 * myDate - дата, которой надо определить границу периода;
	 * direction - направление границы: prev, prex+, next, next+;
	 * countMonth - количество месяцев в периоде;
	 */
	function borderByCountMonthInPeriod (myDate, direction, countMonth) {
		// Работа метода основана на не на вычисления в стиле:
		// отнять от даты количество милисекунд из-за различной длинны
		// месяцев.
		var monthIndex = myDate.getMonth();
		var year = myDate.getFullYear();
		var indexBorderMonth = Math.floor(monthIndex / countMonth) * countMonth;
		var borderDate = new Date(year, indexBorderMonth, 1);

		var difference = myDate - borderDate;
		if (difference != 0){
			if ( direction == "next"){
				year = (indexBorderMonth + countMonth > 12)? year + 1: year;
				indexBorderMonth = (indexBorderMonth + countMonth) % 12;
			}
			// "prev" уже учтено по умолчанию
		} else {
			if (direction == "prev+"){
				if (indexBorderMonth - countMonth >= 0){
					indexBorderMonth -= countMonth;
				} else {
					indexBorderMonth = 12 - countMonth;
					year--;
				}
			} else {
				year = (indexBorderMonth + countMonth > 0) ? year++: year;
				indexBorderMonth = (indexBorderMonth + countMonth) % 12;
			}
		}

		return new Date(year, indexBorderMonth, 1);
	}

	function mostPrevNextPeriod(myDate, dir, milliSecPeriod){
		var periodDate=new Date("Jan 01, "+myDate.getFullYear()); //пока здесь хранится начало года
		var k=(myDate.getTime()-periodDate.getTime())/milliSecPeriod;
		
		if (k - Math.floor(k) == 0 && (dir=="prev" || dir=="next")) {						
			periodDate.setTime(myDate.getTime());
		} else if (dir=="prev"||dir=="prev+") {			
			periodDate.setTime(myDate.getTime()-(k-Math.floor(k))*milliSecPeriod);
		} else {			
			periodDate.setTime(myDate.getTime()+(1-(k-Math.floor(k)))*milliSecPeriod);			
		}
		
		return periodDate;
	}

	function monthPrevNextPeriod(myDate, dir, milliSecPeriod){
		var periodDate=new Date(months[myDate.getMonth()].substr(0,3) +
			" 01, " + myDate.getFullYear()); 	
		var k = (myDate.getTime() - periodDate.getTime());	
		if (k == 0 && dir == "prev+") {
			periodDate.setMonth(periodDate.getMonth()-1);
		} else if ((k!=0&&dir=="next") || (k==0&&dir=="next+")) {
			periodDate.setMonth(periodDate.getMonth() + 1);			
		} 		
		return periodDate;
	}

	function weekPrevNextPeriod(myDate, dir, milliSecPeriod){
		var k;
		var periodDate=new Date(months[myDate.getMonth()].substr(0,3) +
			" " + myDate.getDate() + ", " + myDate.getFullYear()); 	
		k=myDate.getDay();		
		if (k==0) {k=7;}
		if (dir=="prev"||dir=="prev+") {
			periodDate.setTime(periodDate.getTime()-(k-1)*24*60*60*1000);
			if (k==1&&dir=="prev+") {
				periodDate.setTime(periodDate.getTime()-7*24*60*60*1000);
			}
		} else {			
			periodDate.setTime(
				periodDate.getTime()-(k-1)*24*60*60*1000 + 7*24*60*60*1000);
		}		
		return periodDate;
	}	

	//список шкал
	scales = [
	
		{
			// 0
			// час по 15 минут
			mainUnit: "15min", unit: "H", 
			mainUnitMilliSec: 15*60*1000, 
			unitMilliSec: 60*60*1000, 
			mainUnitLength: 24, //ширина в px  
			unitLength: mostUnitLength, 
			getMainUnit: function(dft){
				return dft.getMinutes();
			},
			getUnit: function(dft){
				return daysOfWeek[dft.getDay()].substr(0,2) + " "
				+ dft.getDate() + " " + months[dft.getMonth()].substr(0,3)
				+ ", " + dft.getHours();
			}, //Чт 22 Окт, 3
		},

		{
			// 1
			// день по 2 часа
			mainUnit: "2H", unit: "D", 
			mainUnitMilliSec: 2*60*60*1000, 
			unitMilliSec: 24*60*60*1000, 
			mainUnitLength: 20, 
			getMainUnit: function(dft){
				return dft.getHours();
			},
			getUnit: function(dft){
				return daysOfWeek[dft.getDay()].substr(0,2)+ " " + 
				dft.getDate()+ " " + months[dft.getMonth()].substr(0,3);
			}, //Чт 22 Окт
			unitLength: mostUnitLength
		}, 

		{
			// 2
			// день по 6 часов
			mainUnit: "6H", unit: "D", 
			mainUnitMilliSec: 6*60*60*1000, 
			unitMilliSec:24*60*60*1000, mainUnitLength:20, 
			getMainUnit: function(dft){
				return dft.getHours();
			},
			getUnit: function(dft){
				return daysOfWeek[dft.getDay()].substr(0,2)+ " " + 
				dft.getDate() + " " + months[dft.getMonth()].substr(0,3);
			}, //Чт 22 Окт
			unitLength: mostUnitLength
		},

		{
			//3
			//неделя по дням
			mainUnit: "DW", unit: "W", //DW - Day Week, W - Week
			mainUnitMilliSec: 24*60*60*1000, //один день
			unitMilliSec:7*24*60*60*1000, //неделя
			mainUnitLength:20, 
			getMainUnit: function(dft){
				return daysOfWeek[dft.getDay()].charAt(0);
			},
			getUnit: function(dft){
				return dft.getDate() + " " + 
				months[dft.getMonth()].substr(0,3) + " '" + 
				String(dft.getFullYear()).substr(2,2);
				}, //для отображения идёт день недели, верх 12 Окт '09
			unitLength: mostUnitLength
		},	

		{
			// 4
			// месяц по 3 дня
			mainUnit: "3D", unit: "M", 
			mainUnitMilliSec: 3*24*60*60*1000, 
			unitMilliSec: 30.4375*24*60*60*1000, 
			mainUnitLength: 25, 
			getMainUnit: function(dft){
				return dft.getDate();
			},
			getUnit: function(dft){
				return months[dft.getMonth()] + " " + dft.getFullYear();
			}, //Декабрь 2009
			unitLength: monthUnitLength
		}, 

		{
			// 5
			// месяц по неделям
			mainUnit: "W", unit: "M", 
			mainUnitMilliSec: 7*24*60*60*1000, 
			unitMilliSec: 30.4375*24*60*60*1000, 
			mainUnitLength:30, 
			getMainUnit: function(dft){
				return dft.getDate();
			},
			getUnit: function(dft){
				return months[dft.getMonth()].substr(0,3) + " '" + 
				String(dft.getFullYear()).substr(2,2);
			}, //для отображения идёт первое число недели, верх Окт '09
			unitLength:monthUnitLength
		}, 

		{
			// 6
			// квартал по месяцам
			mainUnit: "M", unit: "Q", 
			mainUnitMilliSec: 30.4375*24*60*60*1000, 
			unitMilliSec: 3*30.4375*24*60*60*1000, 
			mainUnitLength: 35, 
			getMainUnit: function(dft){
				return months[dft.getMonth()].substr(0,3);
			},
			getUnit: function(dft){
				var q;
				q=dft.getMonth();
				if (q<=2) {
					q="Кв.1";
				} else if (q<=5) {
					q="Кв.2";
				} else if (q<=8) {
					q="Кв.3";
				} else {
					q="Кв.4";
				}
				return q+", "+dft.getFullYear();
			}, //Кв.3,2009
			unitLength: mostUnitLength
		}, 

		{
			// 7
			// полгода по месяцам
			mainUnit:"M", unit:"HY", //HY - half year
			mainUnitMilliSec: 30.4375*24*60*60*1000, 
			unitMilliSec: 6*30.4375*24*60*60*1000, 
			mainUnitLength: 35, 
			getMainUnit: function(dft){
				return months[dft.getMonth()].charAt(0);
			},
			getUnit: function(dft){
				var q;
				q=dft.getMonth();
				if (q<=5) {
					q="Полугодие 1";
				} else {
					q="Полугодие 2";
				}
				return q+", "+dft.getFullYear();}, //Полугодие 1,2009
			unitLength:mostUnitLength
		}, 

		{
			// 8
			// год по 3 месяца
			mainUnit:"Q", unit:"Y", 
			mainUnitMilliSec: 3*30.4375*24*60*60*1000, 
			unitMilliSec: 365.25*24*60*60*1000, 
			mainUnitLength: 24, 
			getMainUnit: function(dft){
				var q;
				q = dft.getMonth();
				if (q<=2) {
					q="Q1";
				} else if (q<=5) {
					q="Q2";
				} else if (q<=8) {
					q="Q3";
				} else {
					q="Q4";}
				return q;
			},
			getUnit:function(dft){return dft.getFullYear();}, //2009
			unitLength:mostUnitLength
		},

		{
			// 9
			// год по полугодиям
			mainUnit:"HY", unit:"Y", 
		 	mainUnitMilliSec: 6*30.4375*24*60*60*1000, 
			unitMilliSec: 365.25*24*60*60*1000, 
			mainUnitLength: 35,
			getMainUnit: function(dft){
				var q;
				q=dft.getMonth();
				if (q<=5) {
					q="HY1";
				} else {
					q="HY2";}
				return q;
			},
			getUnit: function(dft){
				return dft.getFullYear();
			}, //2009
			unitLength: mostUnitLength
		} 
	];	
	
	//добавляем ещё шкалам методы, надоело их ручками вставлять
	scales.forEach(function(item, i, arr){
		if (i==4||i==5) {
			item.unitPrevNextPeriod=monthPrevNextPeriod;
		} else if (i==3) {
			item.unitPrevNextPeriod = weekPrevNextPeriod;
		} else {
			item.unitPrevNextPeriod = mostPrevNextPeriod;
		}

		if (i==5) {
			item.mainUnitPrevNextPeriod = weekPrevNextPeriod;
		} else if (i==6||i==7) {
			item.mainUnitPrevNextPeriod = monthPrevNextPeriod;
		} else {
			item.mainUnitPrevNextPeriod = mostPrevNextPeriod;
		}
	});

	function showScale(scale, chartStartDate, chartEndDate) {
		var k;
		var tDate = new Date();
		var	cSDU = new Date(), cEDU=new Date(), cSDMU=new Date(), cEDMU=new Date();
		cSDU.setTime(chartStartDate.getTime());
		cEDU.setTime(chartEndDate.getTime());
		cSDMU.setTime(chartStartDate.getTime());
		cEDMU.setTime(chartEndDate.getTime());
	
		cSDU = scales[scale].unitPrevNextPeriod(chartStartDate,
			"prev", scales[scale].unitMilliSec);
		cSDMU = scales[scale].mainUnitPrevNextPeriod(chartStartDate,
			"prev", scales[scale].mainUnitMilliSec);
		cEDU = scales[scale].unitPrevNextPeriod(chartEndDate,
			"prev", scales[scale].unitMilliSec);
		cEDMU = scales[scale].mainUnitPrevNextPeriod(chartEndDate,
			"prev", scales[scale].mainUnitMilliSec);

		if (cSDU < cSDMU) {
			cSDMU = scales[scale].mainUnitPrevNextPeriod(cSDU,
				"next", scales[scale].mainUnitMilliSec);
		}
		
		console.log("scale = ",scale);
		console.log("chartEndDate = ", chartEndDate);
		console.log("cEDU = ",cEDU, " cEDMU = ",cEDMU);
		
		var widthUnitContent;
		var setka = "<table class='unit'><tr>";				
		if (cSDU > cSDMU) {
			tDate = scales[scale].unitPrevNextPeriod(cSDU, "prev+",
			 scales[scale].unitMilliSec);
			widthUnitContent = Math.round((cSDU.getTime()-cSDMU.getTime()) /
				scales[scale].unitMilliSec*scales[scale].unitLength(tDate));									
			setka += "<td class='first' style='background:yellow; min-width:" +
			widthUnitContent + "px; max-width:" + widthUnitContent + "px'></td>";			
		}		
		tDate.setTime(cSDU.getTime());		
		while (tDate <= cEDU) {						
			widthUnitContent = scales[scale].unitLength(tDate);	

			setka += "<td style='min-width:" + widthUnitContent + 
			"px; max-width:" + widthUnitContent + "px'>" + 
			scales[scale].getUnit(tDate) + "</td>";

			tDate = scales[scale].unitPrevNextPeriod(tDate, "next+", 
				scales[scale].unitMilliSec);
		}
		setka += "</tr></table>";		
		$(".gantChartArea").html(setka);
		
		setka = "<table class='mainUnit'><tr>";
		if (cSDMU > cSDU) {						
			k = (cSDMU.getTime()-cSDU.getTime())/scales[scale].mainUnitMilliSec;
			widthUnitContent = Math.round((cSDMU.getTime()-cSDU.getTime()) /
				scales[scale].mainUnitMilliSec*scales[scale].mainUnitLength+k-1); //k-1 - это для учёта кол-ва ненарисованных границ, но почему-то для недели не работает -небольшой сдвиг там есть (			
			setka += "<td class='first' style='background:yellow; min-width:" +
			widthUnitContent + "px; max-width:" + widthUnitContent + "px; width:" + widthUnitContent + "px; height:21px'></td>";
		}		
		tDate.setTime(cSDMU.getTime());
		while (tDate <= cEDMU) {			
			setka += "<td>" + scales[scale].getMainUnit(tDate) + "</td>";
			tDate = scales[scale].mainUnitPrevNextPeriod(tDate,"next+",
				scales[scale].mainUnitMilliSec);
		}		
		setka += "</tr></table>";		
		$(".gantChartArea").append(setka);				
		$(".mainUnit td:not(.first)").css("min-width",scales[scale].mainUnitLength);
		$(".mainUnit td:not(.first)").css("max-width",scales[scale].mainUnitLength);
		$(".mainUnit td:not(.first)").css("text-align","center");		
		$("table.mainUnit td").css("border","solid 1px black");

		$("table td").css("border-top","solid 0px black");		
		
		//рисуем задачи, хотя это нужно делать не здесь
		var begD = new Date();
		var left,top,width;
		begD.setTime( ( (cSDU < cSDMU)?cSDU:cSDMU).getTime());
		activities.forEach(function (item, i, arr){
			var startDate = new Date(item.startDate);
			var endDate = new Date(item.endDate);
			k = (startDate.getTime()-begD.getTime())/scales[scale].mainUnitMilliSec;
			left = Math.round(k*scales[scale].mainUnitLength+(k-1));
			k = (endDate.getTime()-begD.getTime())/scales[scale].mainUnitMilliSec;
			width = Math.round(k*scales[scale].mainUnitLength+(k-1))-left;
			top = 21*2+10+i*70;
			setka = "<div class='gantChartBar' style='overflow:auto;left:"+ left +"px;top:"+top+"px;width:"+width+"px;height:63px'>"+i+"; "+startDate+"; "+endDate+"</div>";
			$(".gantChartArea").append(setka);
		});
	}
	
	
	showScale(scale,chartStartDateF,chartEndDateF);		
});