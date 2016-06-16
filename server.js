var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.get('/', function(req, res){
  res.end('<h1>You\'re not supposed to be here, go away ;_;</h1>');
});

var port = Number(process.env.PORT || 20000);

http.listen(port, function(){
  console.log("listening on port: " + port);
});

// ========================================================================================
// Database
// ========================================================================================

var operations = require('./database/functions/operations.js')();
var models = require('./database/functions/models.js')(mongoose);

mongoose.connect('mongodb://localhost/game', { server: { reconnectTries: Number.MAX_VALUE } });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connection');

  // var user = new models.user({ login: 'test1', password: 'test1' });
  // var user2 = new models.user({ login: 'test1', password: 'test3' });
  // operations.insertData(user2, function(){
  // //{ "authors": { "$regex": "Alex", "$options": "i" } }
  //   operations.selectData(models.user, { password: { "$regex": "Test3", "$options": "i" }}, function(result){
  //     console.log(result);
  //   });
  // });
  // user.validate(function(err){ console.log(err) });
});

// ========================================================================================
// Socket
// ========================================================================================

io.on('connection', function(client){
  operations.selectData(models.user, {}, function(result){
    console.log(result);
  });
  console.log(client.id + ' connected');
  client.on('registration', function(data) {
    console.log('?');
    operations.selectData(models.user, {}, function(result){
      console.log(result);
    });
  });

});
