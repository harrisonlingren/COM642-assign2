var express = require('express');
var router = express.Router();
var faker = require('faker');
var mdb = require('mongodb').MongoClient;
var assert = require('assert');
    
var db_conn_str = process.env.DB_CONN_STR || 'mongodb://db_user:db_pass@178.62.91.15:80/todo';
if (!db_conn_str) {
  console.error('DB_CONN_STR variable not set!');
}

// GET: get all todo items
router.get('/all', mongoGetAll );

// GET: get todo item
router.get('/:id', mongoGet );

// POST: create todo item
router.post('/new', mongoPost );

// PUT: update todo item
router.put('/:id', mongoPut );

// DELETE: delete todo item
router.delete('/:id', mongoDel );


// NON-DATABASE data functions
// temporary data function because the mongodb connection doesn't work on school network
function getData(id) {
  // temporary code because the mongodb connection doesn't work on school network
  let d = new Date;
  return {
    message: 'Fake data attached',
    data: {
      item_id: id,
      title: 'item #'+id,
      date: getDate(),
      category: getCategory(),
      description: getSentence(),
      done: false
    }
  };
}

// temporary code because the mongodb connection doesn't work on school network
function getAllData(n) {
  let resData = [];
  for (var i = 0; i < n; i++) {
    resData.push({
      item_id: i,
      title: 'item #'+i,
      date: getDate(),
      category: getCategory(),
      description: getSentence(),
      done: false
    });
  }
  
  return {
    message: 'All fake data',
    data: resData
  };
}

function getDate() {
  let d = new Date;
  return d.toGMTString();
}

function getSentence() {
  return faker.lorem.sentence();
}

function getCategory() {
  let randCatId = Math.floor(Math.random() * 4);
  return ['University', 'Housework', 'Career', 'Activities', 'Miscellaneous'][randCatId];
}

// DATABASE FUNCTIONS
function mongoGet(req, res, next) {
  let itemId = parseInt(req.params.id);
  
  // find ID in DB
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    console.log('connected to db!');
    
    // search db for ID: itemId
    db.collection('todo').findOne({ item_id:itemId }, (err, todoItem) => {
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
}

function mongoGetAll(req, res, next) {
  // find ID in DB
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    //console.log('connected to db!');
    
    db.collection('todo').find({}).toArray((err, todoItems) => {
      assert.equal(null, err);
      
      let resData = {
        message: 'All items',
        data: todoItems
      }; res.status(200).json(resData);
    });
  });
}

function mongoPost(req, res, next) {
  let newItem = {
    item_id: 0,
    title: req.body.title,
    date: new Date(req.body.date),
    category: req.body.category,
    description: req.body.description,
    done: parseBoolean(req.body.done)
  }
  
  // send to DB here
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    
    // get number of todo items
    db.collection('todo').count( (err, count) => {
      assert.equal(null, err);
      let newId = parseInt(count);
      
      // insert into db
      newItem.item_id = newId;
      db.collection('todo').insertOne(newItem, (err, result) => {
        assert.equal(null, err);
        assert.equal(1, result.insertedCount);
        
        // send response data
        let resData = {
          'message': 'Record created!',
          'data': newItem
        }; res.status(201).json(resData);
      });      
    });
  });
}

function mongoPut(req, res, next) {

  let update = {};
  // determine update method (just the status or the entire record)
  if (Object.keys(req.body).length == 1 && ('done' in req.body) ) {
    update = {
      item_id: parseInt(req.params.id),
      done: parseBoolean(req.body.done)
    };
  } else if (req.body.title && req.body.category && req.body.description && req.body.date && ('done' in req.body)) {
    update = {
      item_id: parseInt(req.params.id),
      title: req.body.title,
      date: new Date(req.body.date),
      category: req.body.category,
      description: req.body.description,
      done: parseBoolean(req.body.done)
    };
  } else {
    update = {};
    res.sendStatus(400);
    return;
  }

  // send to DB
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    
    db.collection('todo').findOne({item_id:update.item_id}, function(err, todoItem) {
      assert.equal(null, err);

      // if item found in db, update
      if (todoItem) {
        assert.equal(todoItem.item_id, update.item_id);

        // create object to hold updated properties
        let finalUpdateObj = {};
        Object.keys(todoItem).forEach( (key, val) => {
          if (key == '_id') {
            return;
          }

          if (update.hasOwnProperty(key)) {
            finalUpdateObj[key] = update[key];
          } else {
            finalUpdateObj[key] = todoItem[key];
          }
        });

        // write to database
        db.collection('todo').updateOne({item_id: update.item_id}, finalUpdateObj, (err, result) => {
          assert.equal(null, err);
          
          let resData = {
            'message': 'To-do item #' + update.item_id + ' updated',
            'data': finalUpdateObj
          }; res.status(200).json(resData);
        });
        
      // if not found
      } else {
        let resData = {
          'message': 'Error: to-do item #' + update.item_id + ' not found',
          'data': todoItem
        }; res.status(404).json(resData);
      }
    });
  });
}

function mongoDel(req, res, next) {
  let itemId = parseInt(req.params.id);
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    
    db.collection('todo').findOne({ item_id:itemId }, function(err, todoItem) {
      assert.equal(null, err);

      // if item found in db, delete
      if (todoItem) {
        assert.equal(itemId, todoItem.item_id);
        
        db.collection('todo').deleteOne({_id:todoItem._id}, function(err, result) {
          assert.equal(null, err);

          let resData = {
            'message': 'To-do item #' + todoItem.item_id + ' deleted!'
          }; res.status(200).json(resData);
        });
        
      // if item not found
      } else {
        let resData = {
          'message': 'Error: to-do item #' + itemId + ' not found',
          'data': todoItem
        }; res.status(404).json(resData);
      }
    });
  });
}

function parseBoolean(bool) {
  return (bool == 'true' || bool == true);
}

module.exports = router;