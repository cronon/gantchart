describe("Task", function(){
  it("calculate second task", function () {
  var start = new Date("2014-08-18T10:00+0400");
  var duration = 2 * MS_IN_HOUR;
  var headTask = new Task({startDate: start, duration: duration});

  var secondTask = new Task({timespan: 1 * MS_IN_HOUR, duration: 3 * MS_IN_HOUR});

  headTask.addNeighbour(secondTask);
  var expected = new Task({startDate: new Date("2014-08-18T14:00+0400"),
    endDate: new Date("2014-08-18T17:00+0400")})
  expect(expected).toEqual(secondTask);
  });
})