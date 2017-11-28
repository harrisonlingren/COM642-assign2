var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'COM 642 Assignment 2 | A16',
    todoItems: items
  });
});

module.exports = router;
