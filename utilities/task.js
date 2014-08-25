'use strict';

var Task = function(options){
  this.isNeedCall
  this.name = options.name;
  if (options.start !== undefined && options.end !== undefined){
    this.startDate = options.start;
    this.endDate = options.end;
  } else if (options.start !== undefined && options.duration !== undefined){
    this.startDate = options.start;
    this.duration = options.duration;
    this.endDate = getEndTask(this.startDate, this.duration);
  } else if (options.timespan !== undefined && options.duration !== undefined){
    // addNeighbour for this case
    this.timespan = options.timespan;
    this.duration = options.duration;
  }

  this.addNeighbour = function (neighbour) {
    this.next = neighbour;
    this.timespan = timespan;
    neighbour.startDate = getEndTask(this.start, timespan);
  };

  this.setNext = function (next) {
    this.next = next;
  };

}