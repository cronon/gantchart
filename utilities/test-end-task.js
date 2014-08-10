describe("Calculate end task", function(){
  var MS_IN_HOUR = 3600 * 1000;
  var MS_IN_DAY = MS_IN_HOUR * 24;
  var startTask = new Date("2014-08-07T02:00+0400");
  var duration = 2 * MS_IN_HOUR;

  it("end task with duration 2 hours", function(){
    var actual = getEndTask(startTask, duration);
    // 2 hour after start work day
    var expected = new Date("2014-08-07T11:00+0300");
    expect(actual).toEqual(expected);
  });

  it("calculates term month without getting in account work time", function(){
    var longDuration = MS_IN_DAY * 30;
    var startDate = new Date("2014-01-01T00:00+0300");
    var actual = getEndTask(startDate, longDuration);
    expect(actual).toEqual(new Date(startDate.getTime() + longDuration));
  });

  // getting in account - беря во внимание
  it("calculates short term getting in account work time", function(){
    var shortTermDuration = 2 * MS_IN_DAY; // 48 часов
    var startDate = new Date("2014-08-08T00:00+0300");
    //пятница 48 - 7 часов
    // неделя до 2014-08-15: 4 * 8 + 7 = 39 часа и + 7 => 46 часа
    // 2 часа остаётся на 2014-08-18 начиная с начала рабочего дня
    // итого 2014-08-18T11:00+0300 
    var actual = getEndTask(startDate, shortTermDuration);
    expect(actual).toEqual(new Date("2014-08-18T11:00+0300"));
  });

  describe("starts in free time",function(){
    it("starts before work", function(){
      var startDate = new Date("2014-08-09T14:00+0300");
      var duration = MS_IN_HOUR * 8;
      var actual = getEndTask(startDate, duration);
      expect(actual).toEqual(new Date("2014-08-11T18:00+0300"));
    });
  });

  describe("starts at work time",function(){
    it("starts at 10:00 monday", function(){
      var startDate = new Date("2014-08-11T10:00+0300");
      var duration = MS_IN_HOUR * 8;
      var actual = getEndTask(startDate, duration);
      expect(actual).toEqual(new Date("2014-08-12T10:00+0300"));
    });

    it("starts at 12:59 monday", function(){
      var startDate = new Date("2014-08-11T12:59+0300");
      var duration = MS_IN_HOUR * 6;
      var actual = getEndTask(startDate, duration);
      expect(actual).toEqual(new Date("2014-08-12T10:59+0300"));
    });

  });

  describe("starts at border dinner",function(){
    it("starts at 13:00 monday", function(){
      var startDate = new Date("2014-08-11T13:00+0300");
      var duration = MS_IN_HOUR * 6;
      var actual = getEndTask(startDate, duration);
      expect(actual).toEqual(new Date("2014-08-12T11:00+0300"));
    });
  });

})