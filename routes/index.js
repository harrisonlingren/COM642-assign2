var express = require('express');
var router = express.Router();

module.exports = (items) => {
  
  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.render('index', {
      title: 'COM 642 Assignment 2 | A16',
      todoItems: items,
      itemtext: 'test'
    });
  });

  return router;
};
