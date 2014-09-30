describe("Date Interval", function(){
  var interval, start, end;

  start = new Date("2014-08-01T00:00+0400");
  end = new Date("2014-08-01T12:00+0400");
  interval = DateInterval(start, end);

  it("creates correct", function(){
    expect(interval.start).toEqual(start);
    expect(interval.end).toEqual(end);
  });

  it("'s fields are new objects", function(){
    expect(interval.start).not.toBe(start);
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
      var otherInterval = DateInterval("2014-08-01T01:00+0400","2014-08-01T12:00+0400");
      var actual = interval.includeInterval(otherInterval);
      expect(actual).toEqual(true);
    });

    it("returns false when it doesn't include interval", function(){
      var otherInterval = DateInterval("2014-08-01T00:00+0400","2014-08-01T15:00+0400");
      var actual = interval.includeInterval(otherInterval);
      expect(actual).toEqual(false);
    });
  });

  describe("includeWeak", function(){
    it("exist includeWeak", function(){
      var dateOnBorderInterval = new Date("2014-08-01T00:00+0400");
      var actual = interval.includeWeak(dateOnBorderInterval);
      expect(actual).toEqual(true);
    });
  });

  describe("duration", function(){
    it("retruns duration between start and end", function(){
      expect(interval.duration).toEqual(12*3600*1000);
    })
  })

  xdescribe("isOverlap", function(){
    it("returns true when overlap", function(){
      var otherInterval = DateInterval("2014-08-01T00:00+0400","2014-08-01T15:00+0400");
      actual = interval.isOverlap(otherInterval);
      expect(actual).toEqual(true);
    });

    it("returns true when others overlaps", function(){
      var otherInterval = DateInterval("2014-08-01T00:00+0400","2014-08-01T15:00+0400");
      actual = otherInterval.isOverlap(interval);
      expect(actual).toEqual(true);
    });

    it("returns true when it is including other", function(){
      var otherInterval = DateInterval("2014-08-01T00:00+0400","2014-08-01T15:00+0400");
      actual = otherInterval.isOverlap(interval);
      expect(actual).toEqual(true);
    });

    it("returns false when doesn't overlap", function(){
      var otherInterval = DateInterval("2014-08-02T00:00+0400","2014-08-02T15:00+0400");
      actual = interval.isOverlap(otherInterval);
      expect(actual).toEqual(false);
    });
  })

})