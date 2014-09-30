describe("Work interval", function(){
  var date = new Date("2014-08-07T02:00+0300");
  var interval;

  it("function getNext() added to interval", function(){
    var dayInfo = getDayInfo(date);
    var actual = getWorkInterval(date, dayInfo);
    expect(typeof actual.getNext).toEqual('function');
  });

  // нужны тесты для 9-ти случаев:
  // 5-ти интервалов и для 4-ёх граничных точек 
  //-----09:00-----13:00----14:00-----18:00----

  it("before work", function(){
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T09:00+0300"), 
      new Date("2014-08-07T13:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("work day at 9:00", function(){ 
    date = new Date("2014-08-07T09:00+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T09:00+0300"), 
      new Date("2014-08-07T13:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("work day between 9:00 and 13:00", function() {
    date = new Date("2014-08-07T11:00+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T09:00+0300"), 
      new Date("2014-08-07T13:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("work day at 13:00", function() {
    date = new Date("2014-08-07T13:00+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T09:00+0300"), 
      new Date("2014-08-07T13:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("work day between 13:00 and 14:00", function() {
    date = new Date("2014-08-07T13:30+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T14:00+0300"), 
      new Date("2014-08-07T18:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("work day at 14:00", function() {
    date = new Date("2014-08-07T14:00+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T14:00+0300"), 
      new Date("2014-08-07T18:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("work day between 14:00 and 18:00", function() {
    date = new Date("2014-08-07T15:00+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T14:00+0300"), 
      new Date("2014-08-07T18:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("work day at 18:00", function() {
    date = new Date("2014-08-07T18:00+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-07T14:00+0300"), 
      new Date("2014-08-07T18:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });

  it("after work", function() {
    date = new Date("2014-08-07T19:00+0300"); 
    var actual = getWorkInterval(date);
    var expected = DateInterval(new Date("2014-08-08T09:00+0300"), 
      new Date("2014-08-08T13:00+0300"));
    expect(actual.start).toEqual(expected.start);
    expect(actual.end).toEqual(expected.end);
  });
})