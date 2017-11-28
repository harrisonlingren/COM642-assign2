var express = require('express');
var router = express.Router();
var faker = require('faker');
var mdb = require('mongodb').MongoClient,
    assert = require('assert');
    
var db_conn_str = process.env.DB_CONN_STR || null;
if (!db_conn_str) {
  console.error('DB_CONN_STR variable not set!');
}

console.log(db_conn_str);

// GET: get todo item
router.get('/:id', function(req, res, next) {
  let itemId = parseInt(req.params.id);
  
  // find ID in DB
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    console.log('connected to db!');
    
    // search db for ID: itemId
    db.collection('todo').findOne({ item_id: itemId }, (err, todoItem) => {
      assert.equal(null, err);
      
      // if found, send data
      if (todoItem) {
        assert.equal(todoItem.item_id, itemId);
        
        let resData = {
          'message': 'To-do item found!',
          'data': todoItem
        }; res.status(200).json(resData);
        
      // if not found, send 404
      } else {
        let resData = {
          'message': 'Error: todo item ' + itemId + ' was not found',
          'data': todoItem
        }; res.status(404).json(resData);
      }    
    });
  });
});

// POST: create todo item
router.post('/new', (req, res, next) => {
  let newItem = {
    item_id: 0,
    title: req.body.title,
    date: req.body.date,
    category: req.body.category,
    description: req.body.description,
    done: req.body.done
  }
  
  // send to DB here
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    
    // get number of todo items
    db.collection('todo').count( (err, count) => {
      assert.equal(null, err);
      let newId = count;
      
      // insert into db
      newItem.item_id = newId;
      db.collection('todo').insertOne(newItem, (err, result) => {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);
        
        // send response data
        let resData = {
          'message': 'Record created!',
          'data': newItem
        }; res.status(201).json(resData);
      });      
    });
  });
});

module.exports = router;