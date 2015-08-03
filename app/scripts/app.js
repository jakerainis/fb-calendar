'use strict';

//var $ = require('jquery');
import $ from 'jquery';

var data = [
  {id : 1, start : 60, end : 120}, 
  {id : 2, start : 100, end : 240},
  {id : 3, start : 200, end : 410},
  {id : 4, start : 220, end : 450},
  {id : 5, start : 400, end : 720},
  {id : 6, start : 600, end : 650},
  {id : 7, start : 680, end : 720},
  {id : 8, start : 680, end : 720} 
];

var util = {
  assignColumn: function(events, itemIdx){
    let item = events[itemIdx];
    if(itemIdx === 0){
      return 0;
    }
    let prevItem = events[itemIdx-1];
    if(util.checkForOverlap(item, prevItem)){
      prevItem = events[itemIdx-1]
      return prevItem.column + 1;
    } else{
      return 0;
    }
  },
  buildColumnArray: function(events){
    var arr = [];
    events.forEach(function(v,i){
      arr.push(v.column);
    });
    return arr;
  },
  checkForOverlap: function(e1, e2){
    if (e1.id === e2.id){
      return false;
    }
    else if (e1.end >= e2.start && e2.end >= e1.start) {
      return true;
    } else {
      return false;
    }
  },
  getHighestInArray: function(arr){
    return Math.max.apply(null, arr);
  }
};

function layOutDay(events) {
  var arr = [];
  var columnSet = [];
  events.forEach(function(v,i){
    var overlappedEvents = [];
    v.column = 0;
    v.column = util.assignColumn(events, i);
    events.forEach(function(w,j){
      if(util.checkForOverlap(v,w)){
        overlappedEvents.push(j);
      }
    });
    arr.push({
      column: v.column,
      height: v.end - v.start,
      id: v.id,
      info: v,
      overlappedEvents: overlappedEvents,
      top: v.start
    });
  });
  events.forEach(function(v,i){
    columnSet.push(v.column);
  });
  var highest = util.getHighestInArray(columnSet);
  arr.forEach(function(v,i){
    v.left = (600/(highest+1)) * v.column;
    v.width = (600/highest-20); //20 is column padding
    console.log(v.id + ' overlaps: ' + v.overlappedEvents)
  });
  arr.forEach(function(v,i){
    var highestCol = [];
    v.overlappedEvents.forEach(function(w,j){
      console.log(arr[w])
     highestCol.push(arr[w].column);
    });
    highestCol = util.getHighestInArray(highestCol);
    var highestColOffset = arr[highestCol].left;
    //v.left = highestColOffset / v.overlappedEvents.length - 1;
    // v.width = highestColOffset / v.overlappedEvents.length - 1;
    // for(var j = 0; j < overlappedEvents.length -1 ; j++ ){
    //   v.left = 
    // }
    // if its not conflicting with something in the next column
    // and its not the last column (create global for column total)
    // count the conflicting events in previous columns (var conflicts)
    // apply equal widths (highest conflicting column.left / conflicting prev columns)
    // this gets width
    // for each one width is applied to, left = i * equal width number 
  });


  return arr;
}

function render(events){
  events.forEach(function(v,i){
    var el = '<div class="calendar-wrapper__item" data-id="' + v.id + '">' +
      'Event ID: ' + v.id + ' || Column: ' + v.column +
      '</div>';
    $('.calendar-wrapper').append(el);
    $('[data-id="' + v.id + '"]').css({
      height: v.height,
      left: v.left,
      top: v.top,
      width: v.width
    });
  });
}

render(layOutDay(data));

