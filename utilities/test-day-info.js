describe("Day info", function(){

  describe("Day type 'holiday_day', 'work_day', 'before_holiday'", function(){
    it("names Jan 1st as holiday", function(){
      actual = getDayInfo(new Date(2014,0,1)).type;
      expected = 'holiday_day';
      expect(actual).toEqual(expected);
    });

    it("names Mon, 4th November as holiday", function(){
      actual = getDayInfo(new Date(2014,10,4)).type;
      expected = 'holiday_day';
      expect(actual).toEqual(expected);
    });

    it("names Saturday as holiday", function(){
      actual = getDayInfo(new Date(2014,7,9)).type;
      expected = 'holiday_day';
      expect(actual).toEqual(expected);
    });

    it("names Sunday as holiday", function(){
      actual = getDayInfo(new Date(2014,7,10)).type;
      expected = 'holiday_day';
      expect(actual).toEqual(expected);
    });

    it("names Thursday as work day", function(){
      actual = getDayInfo(new Date(2014,7,7)).type;
      expected = 'work_day';
      expect(actual).toEqual(expected);
    });

    it("names Friday as day before holiday", function(){
      actual = getDayInfo(new Date(2014,7,8)).type;
      expected = 'before_holiday';
      expect(actual).toEqual(expected);
    });

    it("names Mon, 3rd November as day before holiday", function(){
      actual = getDayInfo(new Date(2014,10,3)).type;
      expected = 'before_holiday';
      expect(actual).toEqual(expected);
    });
  });
  
  describe("schedule", function(){
    it("for work days", function(){
      var dateString = "2014-08-06";
      actual = getDayInfo(new Date(dateString)).schedule;
      expect(actual[0].begin).toEqual(new Date(dateString+"T09:00+0400"));
      expect(actual[0].end).toEqual(new Date(dateString+"T13:00+0400"));
      expect(actual[1].begin).toEqual(new Date(dateString+"T14:00+0400"));
      expect(actual[1].end).toEqual(new Date(dateString+"T18:00+0400"));
    });

    it("is shrotened for days before holiday", function(){
      var dateString = "2014-08-08";
      actual = getDayInfo(new Date(dateString)).schedule;
      expect(actual[0].begin).toEqual(new Date(dateString+"T09:00+0400"));
      expect(actual[0].end).toEqual(new Date(dateString+"T13:00+0400"));
      expect(actual[1].begin).toEqual(new Date(dateString+"T14:00+0400"));
      expect(actual[1].end).toEqual(new Date(dateString+"T17:00+0400"));
    });

    it("with interval of invalid dates for holiday", function(){
      var dateString = "2014-01-01";
      actual = getDayInfo(new Date(dateString)).schedule;
      expect(actual[0].begin.valueOf()).toBeNaN();
      expect(actual[0].end.valueOf()).toBeNaN();
      expect(actual[1].begin.valueOf()).toBeNaN();
      expect(actual[1].end.valueOf()).toBeNaN();
    });

    it("'s intervals has method include", function(){
      actual = getDayInfo(new Date("2014-01-01")).schedule;
      expect(typeof actual[0].include).toEqual('function');
    });

  });
  


})