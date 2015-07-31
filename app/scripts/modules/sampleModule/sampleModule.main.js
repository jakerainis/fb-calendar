'use strict';
import $ from 'jquery';

export function SampleModule($el) {

  this.$el = $el;
  this.sampleMethod(this.$el);

}

SampleModule.prototype = {
  sampleMethod: function($el) {
    console.log($el);
  }
};

