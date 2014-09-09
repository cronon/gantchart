'use strict';

/*

*/
var Task = function(options){
  this.start = new Date();
  this.end = new Date();
  this.duration  // milliseconds
  this.name = "new task";
  this.prev = "21ОН - 4 дня"
  this.subtasks = [new Task(), new Task()]
}