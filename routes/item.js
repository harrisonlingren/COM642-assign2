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
router.get('/:id', (req, res, next) => {
  res.status(200).json( getData() );
});

// POST: create todo item
router.post('/new', (req, res, next) => {
  res.status(200).json( getData() );
});

// PUT: update todo item
router.put('/:id', (req, res, next) => {
  res.status(200).json( getData() );
});

// DELETE: delete todo item
router.delete('/:id', (req, res, next) => {
  res.status(200).json( getData() );
});



// temporary data function because the mongodb connection doesn't work on school network
function getData() {
  // temporary code because the mongodb connection doesn't work on school network
  let d = new Date();
  d = d.now();
  return {
    message: 'Fake data attached',
    data: {
      item_id: req.params.id,
      title: 'item.title',
      date: d.toDateString(),
      category: 'item.category',
      description: 'item.description',
      done: false
    }
  };
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

function mongoPost(req, res, next) {
  let newItem = {
    item_id: 0,
    title: req.body.title,
    date: req.body.date,
    category: req.body.category,
    description: req.body.description,
    done: parseBoolean(req.body.done)
  }
  
  console.log(req.body);
  
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
  let update = {
    item_id: parseInt(req.params.id),
    title: req.body.title,
    date: req.body.date,
    category: req.body.category,
    description: req.body.description,
    done: parseBoolean(req.body.done)
  };

  console.log('updating: ', update);

  // send to DB
  mdb.connect(db_conn_str, (err, db) => {
    assert.equal(null, err);
    
    db.collection('todo').findOne({item_id:update.item_id}, function(err, todoItem) {
      assert.equal(null, err);
      console.log(todoItem);
      // if item found in db, update
      if (todoItem) {
        assert.equal(todoItem.item_id, update.item_id);

        let update_id = todoItem._id;
        db.collection('todo').updateOne({_id:update_id}, update, (err, result) => {
          assert.equal(null, err);
          
          let resData = {
            'message': 'To-do item #' + update.item_id + ' updated',
            'data': update
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