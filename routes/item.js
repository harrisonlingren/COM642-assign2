var express = require('express');
var router = express.Router();
var faker = require('faker');



module.exports = (items) => {
  /* GET users listing. */
  router.get('/:id', function(req, res, next) {
    let itemId = req.params.id;
    
    console.log(items, items[itemId]);
    res.render('item', {
      title: items[itemId].title,
      done: items[itemId].done,
      id: items[itemId].id
    });
  });

  return router;
};