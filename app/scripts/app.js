'use strict';

//var $ = require('jquery');
import $ from 'jquery';

var data = [
  {id : 1, start : 60, end : 120}, 
  {id : 2, start : 100, end : 240},
  {id : 3, start : 200, end : 410},
  {id : 4, start : 220, end : 450},
  {id : 5, start : 400, end : 620},
  {id : 6, start : 600, end : 650},
  {id : 7, start : 680, end : 720} 
];

var util = {
  checkForOverlap: function(e1, e2){
    if (e1.id === e2.id){
      return false;
    }
    else if (e1.end > e2.start && e2.end > e1.start) {
      return true;
    } else {
      return false;
    }
  },
  traverseOverlaps: function(event, arr){
    var consecutives = 0;
    var subConsecutives;
    console.log('event ' + event.id + ' overlaps with ' + event.overlappedIds);
    event.overlappedIds.forEach(function(v,i){

      arr[v-1].overlappedIds.forEach(function(w,j){
        if (w !== event.id){
          consecutives +=1;
          console.log('id: ', arr[w-1]);
          //subConsecutives = util.traverseOverlaps(arr[w-1], arr);
        }
      });
      if(arr[arr.length -1 ].id !== event.id){
        //util.tranverseOverlaps
      }
      // var id;
      // arr.forEach(function(w,j){
      //   if (w.id = v){
      //     id
      //   }
      // });
    });
    //console.log(event.id, consecutives);
    return consecutives + subConsecutives;
  }
};

function layOutDay(events) {
  var arr = [];
  events.forEach(function(v,i){
    var overlappedIds = [];
    events.forEach(function(w,j){
      if(util.checkForOverlap(v,w)){
        overlappedIds.push(w.id);
      }
    });
    arr.push({
      height: v.end - v.start,
      id: v.id,
      info: v,
      overlappedIds: overlappedIds,
      top: v.start,
      width: 600/(overlappedIds.length + 1)
    });
  });
  arr.forEach(function(v,i){
      v.consecOverlaps = util.traverseOverlaps(v, arr);

      // var prevEvent = arr[i-1];
      // console.log(prevEvent.width);
      // console.log(prevEvent.info.end > v.info.start);
      // if(prevEvent.info.end < v.info.start){
      //   v.left = 0;
      //   console.log(prevEvent.info.id);
      // }else{
      //   v.left = prevEvent.width;
      // }
  });

  return arr;
}

function render(events){
  events.forEach(function(v,i){
    var el = '<div class="calendar-wrapper__item" data-id="' + v.id + '">' + v.id + ' overlaps with ' + v.overlappedIds + '</div>';
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

