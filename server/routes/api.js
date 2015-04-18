'use strict';

var router = require('express').Router();
var models = require('../models');

router.param('model', function (req, res, next) {
  var model = req.params.model;
  if (!models[model]) {
    return res
      .status(404)
      .end();
  }
  req.model = models[model];
  next();
});

router.get('/:model', function (req, res, next) {
  req.model.find({}, function (err, result) {
    if (err) { return next(err); }
    res.json(result);
  });
});

router.post('/:model', function (req, res) {
  new req.model(req.body)
    .save(function (err, result) {
      var resp = {};
      if (err) {
        res.status(400);
        return res.json({
          errors: err.errors
        });
      }

      resp[req.model.modelName] = result;

      res.status(201);
      res.json(resp);
    });
});

module.exports = router;
