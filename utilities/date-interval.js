var DateInterval = function(start, end){
  return {
    'start': new Date(start),
    'end': new Date(end),
    'duration': (end - start),
    include: function(date){
      return this.start < date && date < this.end;
    },
    includeWeak: function(date){
      return this.start <= date && date <= this.end;
    },
    includeInterval: function(interval){
      return this.start <= interval.start && interval.end <= this.end;
    }
  }
}