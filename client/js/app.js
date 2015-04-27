'use strict';

var angular = require('angular');
var assign = require('object-assign');
var uuid = require('uuid').v1;
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Flux').Dispatcher;

var dispatcher = new Dispatcher();
