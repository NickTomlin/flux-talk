'use strict';

var router = require('express').Router();
var logger = require('../lib/logger');
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
  req.model
    .find({})
    .populate('comments')
    .exec(function (err, result) {
      if (err) { return next(err); }
      var data = {};
      data[req.model.modelName] = result;
      res.json(data);
    });
});

router.post('/til/comments', function (req, res) {
  var comment = new models.comment({ //eslint-disable-line
    text: req.body.comment.text
  });

  models.til.findOneAndUpdate({
    _id: req.body.tilId
  },
  {$push: {comments: comment}})
  .populate('comments')
  .exec(function (err, result) {
    if (err) {
      throw new Error(err);
    }

    console.log('found', result);

    res
    .status(201)
    .json({
      til: result
    });
  });
});

router.post('/:model', function (req, res) {
  new req.model(req.body)
    .save(function (err, result) {
      var resp = {};
      if (err) {
        logger.info('TIL error %s', err);
        res.status(400);
        // simulate delay to showcase "optimistic" fallbacks
        return setTimeout(function () {
          res.json({
            errors: err.errors,
            clientId: req.body.clientId
          });
        }, 900);
      }

      resp[req.model.modelName] = result;

      res.status(201);
      res.json(resp);
    });
});

module.exports = router;
