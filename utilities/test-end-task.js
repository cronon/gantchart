describe("Calculate end task", function(){
  var MS_IN_HOUR = 3600 * 1000;
  var startTask = new Date("2014-08-07T02:00+0400");
  var duration = 2 * MS_IN_HOUR;

  it("end task with duration 2 hours", function(){
    var actual = getEndTask(startTask, duration);
    // 2 hour after start work day
    var expected = new Date("2014-08-07T11:00+0400");
    expect(actual).toEqual(expected);
  });

  // Было написано в пятницу у Димона на хате много тестов
  // но в репозитории их нет

})