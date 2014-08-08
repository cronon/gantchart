describe("Date Interval", function(){
  var interval, begin, end;

    begin = new Date("2014-08-01T00:00+0400");
    end = new Date("2014-08-01T12:00+0400");
    interval = DateInterval(begin, end);
    console.log(interval);


  it("creates correct", function(){
    expect(interval.begin).toEqual(begin);
    expect(interval.end).toEqual(end);
  });

  it("'s fields are new objects", function(){
    expect(interval.begin).not.toBe(begin);
    expect(interval.end).not.toBe(end);
  })

  describe("include", function(){
    it("returns true when date in interval",function(){
      var date = new Date("2014-08-01T05:00:00+0400");
      var actual = interval.include(date);
      expect(actual).toEqual(true);
    });

    it("returns false when date out of interval",function(){
      var date = new Date("2014-08-01T05:00:00+0400");
      var actual = interval.include(date);
      expect(actual).toEqual(true);
    });
  });

  describe("includeInterval", function(){
    it("returns true when it includes interval", function(){
      console.log(interval);
      var otherInterval = DateInterval("2014-08-01T01:00+0400","2014-08-01T12:00+0400");
      var actual = interval.includeInterval(otherInterval);
      expect(actual).toEqual(true);
    });

    it("returns false when it doesn't include interval", function(){
      console.log(interval);
      var otherInterval = DateInterval("2014-08-01T00:00+0400","2014-08-01T15:00+0400");
      var actual = interval.includeInterval(otherInterval);
      expect(actual).toEqual(false);
    });
  })

})