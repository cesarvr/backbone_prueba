var express = require('express')
  , mongoskin = require('mongoskin')
  , bodyParser = require('body-parser')
  , cors = require('cors')
  , http = require('http')
  , Emitter = require('./lib/emitter.js')
  

var app = express()
app.use(cors())
app.use(bodyParser())
app.use(express.static(__dirname + '/static'));


var emitter = new Emitter(app);


var db = mongoskin.db('mongodb://@localhost:27017/test', {safe:true})

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})

app.get('/', function(req, res, next) {
   res.sendfile(__dirname + '/static/index.html');
})



app.get('/collections/:collectionName', function(req, res, next) {
  req.collection.find({} ,{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

app.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
    emitter.sendRefresh();
  })
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

app.patch('/collections/:collectionName/:id', function(req, res, next) {
//  console.log(req.body);
 // console.log('remove id [_id inmutable in mongodb]');
  //delete req.body._id;
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
    emitter.sendRefresh();
  })
})

app.put('/collections/:collectionName/:id', function(req, res, next) {
//  console.log(req.body);
 // console.log('remove id [_id inmutable in mongodb]');
  //delete req.body._id;
  req.collection.updateById(req.params.id, {$set:req.body}, {safe:true, multi:false}, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.del('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result===1)?{msg:'success'}:{msg:'error'})
  })
})

app.listen(3000, '0.0.0.0')