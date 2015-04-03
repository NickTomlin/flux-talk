'use strict';

var debug = require('debug')('til:base-store');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var STORE_CHANGE = require('../constants').events.STORE_CHANGE;
var dispatcher = require('../dispatcher');

module.exports = function (properties) {
  if (!properties || !properties.handler) throw new Error('stores must implement a handler');

  var store = assign({}, properties, EventEmitter.prototype, {
    emitChange: function () {
      this.emit(STORE_CHANGE);
    },
    addChangeListener: function (callback) {
      this.on(STORE_CHANGE, callback);
    },
    _handleDispatch: function (payload) {
      var type = payload.type;
      this.handler(type, payload);
    }
  });

  dispatcher.register(store._handleDispatch.bind(store));

  return store;
}
