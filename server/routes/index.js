'use strict';

var router = require('express').Router();

router.get('/', function (req, res) {
  res.render('layout', {});
});

module.exports = router;
