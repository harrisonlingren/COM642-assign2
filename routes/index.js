var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    'itemtitle': 'item.title',
    'itemid': 0,
    'itemdone': false,
    'itemtext': 'item.text',
    'title': 'Site Title',
    'user': 'User'
  });
});

module.exports = router;
