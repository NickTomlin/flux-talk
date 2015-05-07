'use strict';

var angular = require('angular');
var assign = require('object-assign');
var uuid = require('uuid').v1;
var EventEmitter = require('events').EventEmitter;
var Dispatcher = require('Flux').Dispatcher;

var tilApp = angular.module('til', []);
var dispatcher = new Dispatcher();

tilApp.directive('addTil', require('./components/add-til'));
tilApp.directive('tilList', require('./components/til-list'));

tilApp.controller('index', function ($scope, tilStore) {
  $scope.tils = tilStore.getAll();

  tilStore.addChangeListener(function () {
    $scope.tils = tilStore.getAll();
  });
});

tilApp.service('clientActionCreators', function () {
  this.addTil = function (data) {
    console.log('clientActionCreatorsCreators::AddTil', data);
    dispatcher.dispatch({
      type: 'ADD_TIL',
      data: {
        til: {
          text: data.text,
          userId: data.userId
        }
      }
    });
  };

  this.addComment = function (data) {
    console.log('clientActionCreatorsCreators::AddComment', data);
    dispatcher.dispatch({
      type: 'ADD_COMMENT',
      data: {
        comment: {
          text: data.text,
          tilClientId: data.tilClientId,
          userId: data.userId
        }
      }
    });
  };
});

tilApp.service('serverActionCreators', function () {
  this.receiveTils = function (res) {
    console.log('serverActionCreators::ReceiveTils', res);
    dispatcher.dispatch({
      type: 'RECEIVE_TILS',
      data: {
        tils: res.data.tils,
        users: res.data.users
      }
    });
  };
});

tilApp.service('tilStore', function (userStore) {
  var _tils = {};

  function addTil (til) {
    til.clientId = uuid();
    til.comments = til.comments || [];
    til.comments.forEach(getUserDataForComment);
    til.user = userStore.get(til.userId);
    _tils[til.clientId] = til;
  }

  function getUserDataForComment (comment) {
    comment.user = userStore.get(comment.userId);
  }

  function addComment (comment) {
    var til = _tils[comment.tilClientId];
    getUserDataForComment(comment);
    til.comments.push(comment);
  }

  var tilStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback) {
      this.on('change', callback);
    },
    getAll: function () {
      return Object.keys(_tils).map(function (key) {
        return _tils[key];
      });
    }
  });

  dispatcher.register(function (payload) {

    switch (payload.type) {
      case 'ADD_TIL':
        console.log('tilStore::ADD_TIL', payload.data);
        addTil(payload.data.til);
        tilStore.emit('change');
      break;

      case 'RECEIVE_TILS':
        dispatcher.waitFor([userStore.dispatchToken]);
        console.log('tilStore::RECEIVE_TILS', payload.data);
        payload.data.tils.forEach(addTil);
        tilStore.emit('change');
      break;

      case 'ADD_COMMENT':
        dispatcher.waitFor([userStore.dispatchToken]);
        console.log('tilStore::ADD_COMMENT', payload.data);
        addComment(payload.data.comment);
        tilStore.emit('change')
      break;

      default:
        // ¯\_(ツ)_/¯
    }
  });

  return tilStore;
});

tilApp.service('userStore', function () {
  var _users = {};

  function addUser (user) {
    _users[user._id] = user;
  }

  var userStore = assign({}, EventEmitter.prototype, {
    addChangeListener: function (callback) {
      this.on('change', callback);
    },
    get: function (userId) {
      return _users[userId];
    }
  });

  userStore.dispatchToken = dispatcher.register(function (payload) {
    switch (payload.type) {
      case 'RECEIVE_TILS':
        console.log('userStore::RECEIVE_USERS', payload.data);
        payload.data.users.forEach(addUser);
        console.log(_users);
        userStore.emit('change');
      break;

      default:
        // ¯\_(ツ)_/¯
    }
  });

  return userStore;
});


tilApp.run(function (tilStore, userStore, serverActionCreators) {
  // we preload the app with some data to replicate an XHR
  serverActionCreators.receiveTils({
    data: {
      users: [{displayName: 'Marty McFly', _id: 'user-id'}, {_id: 'user-2-id', displayName: 'Doc Brown'}],
      tils: [
        {
          _id: 'til-id',
          userId: 'user-id',
          text: 'Biff was always a jerk.',
          comments: [{text: 'Gah! Don\'t interfere with the past!', userId: 'user-2-id'}]
        }
      ]
    }
  });
});
