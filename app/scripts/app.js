'use strict';

import $ from 'jquery';
import _ from 'underscore';

/**
 * Constructor
 * @param {array} data - An array of events to map.
 */
function LayoutDay(data) {
  this.render(this.buildEventsObj(data));
}

LayoutDay.prototype = {
  /**
   * Runs for each item and determines the column it belongs in based on collisions.
   * @param  {array} arr - An array built from original events data that contains collision information
   * @param  {number} itemIdx - The event item's index to assign
   * @return {number} - The column the event item should be assigned to
   */
  assignColumn: function(arr, itemIdx) {
    var foundEmptyColumn = false;
    var col;
    var item = arr[itemIdx];
    var prevItem = arr[itemIdx - 1];

    if (itemIdx === 0) {
      col = 0;
    } else if (this.checkForOverlap(item, prevItem)) {
      //for every column
      for (var key in this.columnIndex) {
        //check each item in the column
        var intersections = _.intersection(this.columnIndex[key], item.overlappedEvents);
        // if there are no intersections in column, put it in that column
        if (!intersections.length && !foundEmptyColumn) {
          foundEmptyColumn = true;
          col = parseInt(key);
        }
      }
      //it was not put into a column or does not exist in the first column...
      if (!col && col !== 0) {
        //...so we increment it from the prev column because we know it overlaps
        col = prevItem.column + 1;
        //Then we check to see if it overlaps with anything in the new existing column
        col = this.recursiveColumnCheck(arr, itemIdx, col);
      }
    } else {
      col = 0;
    }
    if (!this.columnIndex[col]) {
      this.columnIndex[col] = [];
    }
    this.columnIndex[col].push(itemIdx);
    return col;
  },

  /**
   * Takes raw data and creates an object array with collision information.
   * @param  {array} events - Raw event data
   * @return {array} - Object array
   */
  buildEventsObj(events) {
    var _this = this;
    var arr = [];
    //create a property that contains each item's conflicting events
    events.forEach(function(v, i) {
      var overlappedEvents = [];
      events.forEach(function(w, j) {
        if (_this.checkForOverlap(v, w)) {
          overlappedEvents.push(j);
        }
      });
      arr.push({
        end: v.end,
        height: v.end - v.start,
        id: v.id,
        overlappedEvents: overlappedEvents,
        start: v.start
      });
    });
    //add the event to the right column
    arr.forEach(function(v, i) {
      v.column = _this.assignColumn(arr, i);
    });
    //set heights, widths, and position
    arr.forEach(function(v, i) {
      var columnSet = [];
      arr.forEach(function(v, i) {
        columnSet.push(v.column);
      });
      var highest = Math.max.apply(null, columnSet);
      v.left = (600 / (highest + 1)) * v.column;
      v.width = (600 / (highest + 1));
      if (!v.overlappedEvents.length) {
        v.width = 600;
      }
    });
    return arr;
  },

  /**
   * Checks two events for overlapping.
   * @param  {object} e1 - An event item
   * @param  {object} e1 - An event item
   * @return {boolean} - If the event items overlap
   */
  checkForOverlap: function(e1, e2) {
    if (e1.id === e2.id) {
      return false;
    } else if (e1.end > e2.start && e2.end > e1.start) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * An array that gets populated with an object for each column.
   * That object contains an array of event items in that column.
   * @type {Object}
   */
  columnIndex: {},

  /**
   * Checks for overlapped events in a given column.
   * @param  {array} arr - Array of event items
   * @param  {number} itemIdx - Index of an event item
   * @param  {number} col - Index of a column
   * @return {boolean} - If the event overlaps with an item in the column
   */
  checkColumnOverlap: function(arr, itemIdx, col) {
    var overlaps = false;
    arr[itemIdx].overlappedEvents.forEach(function(v, i) {
      if (v < itemIdx && arr[v].column === col) {
        overlaps = true;
      }
    });
    return overlaps;
  },

  /**
   * Calculates empty column for event item placement.
   * @param  {array} arr - Array of event items
   * @param  {number} itemIdx - Index of an event item
   * @param  {number} col - Index of a column
   * @return {column} - The column to place event item in
   */
  recursiveColumnCheck: function(arr, itemIdx, col){
    var column = col;
    if (this.checkColumnOverlap(arr, itemIdx, column)) {
      column += 1;
    }else{
      return column;
    }
    return(this.recursiveColumnCheck(arr, itemIdx, column));
  },

  /**
   * Loops through each event item and places it on the calendar view in the right spot.
   * @param  {array} events - Array of event objects
   * @return {boolean}
   */
  render(events) {
    events.forEach(function(v, i) {
      var el = '<div class="calendar-wrapper__item" data-id="' + v.id +
        '">' +
        'Event #: ' + i + ' || Column: ' + v.column +
        '</div>';
      $('.calendar-wrapper').append(el);
      $('[data-id="' + v.id + '"]').css({
        height: v.height,
        left: v.left,
        top: v.start,
        width: v.width
      });
    });
  }
};

//Instantiate with date
var layoutDay = new LayoutDay([
  // { id: 1, start: 60, end: 120 }, 
  // { id: 2, start: 100, end: 240 }, 
  // { id: 3, start: 200, end: 410 }, 
  // { id: 4, start: 220, end: 450 }, 
  // { id: 5, start: 400, end: 720 }, 
  // { id: 6, start: 300, end: 650 }, 
  // { id: 7, start: 680, end: 720 }, 
  // { id: 8, start: 680, end: 720 }
  { id: 1, start: 10, end: 90 },
  { id: 2, start: 20, end: 80 },
  { id: 3, start: 70, end: 180 },
  { id: 4, start: 90, end: 180 },
  { id: 5, start: 200, end: 270 },
  { id: 6, start: 230, end: 290 },
  { id: 7, start: 300, end: 340 },
  { id: 8, start: 350, end: 400 },
  { id: 9, start: 370, end: 580 },
  { id: 10, start: 410, end: 480 },
  { id: 11, start: 450, end: 590 },
  { id: 12, start: 500, end: 595 },
  { id: 13, start: 530, end: 590 },
  { id: 14, start: 600, end: 660 },
  { id: 15, start: 650, end: 690 },
  { id: 16, start: 670, end: 710 }
]);
