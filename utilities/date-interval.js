var DateInterval = function(begin, end){
  return {
    'begin': new Date(begin),
    'end': new Date(end),
    include: function(date){
      return this.begin < date && date < this.end;
    },
    includeInterval: function(interval){
      return this.begin <= interval.begin && interval.end <= this.end;
    }
  }
}