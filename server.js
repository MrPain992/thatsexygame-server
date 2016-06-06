var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.end('<h1>You\'re not supposed to be here, go away ;_;</h1>');
});

var port = Number(process.env.PORT || 20000);

http.listen(port, function(){
  console.log("listening on port: " + port);
});

// var realm = {
//   'lobbies': [
//     {
//       'name': "",
//       'id': "",
//       'users': [],
//       'private': false,
//       'passProtected': false,
//       'password': "",
//
//     },
//     ...
//   ],
//   'users': [
//     {
//       'nick': "",
//       'status': derp,
//       'lobby': lobby id / null
//     },
//     ...
//   ]
// };
var realm = {
  'lobbies': [],
  'users': []
};

io.on('connection', function(socket){

  socket.on('test', function(data){
    console.log("test: " + data);
    socket.emit('test', data);
  });

  socket.on('login', function(data){
    realm.users.push( { 'nick': data.nick } );

    socket.emit('loginResponse', true);
    socket.broadcast.emit('updateUsers', realm.users);
    socket.broadcast.emit('gLogin', data);
  });

  socket.on('logout', function(data){
    realm.users.splice( realm.users.indexOf(data.nick), 1 );

    socket.broadcast.emit('updateUsers', realm.users);
    socket.broadcast.emit('gLogout', data);
  });

  socket.on('loadUsers', function(){
    socket.emit('updateUsers', realm.users);
  });

  socket.on('newLobby', function(data){
    console.log("received lobby creation request: \n");
	 console.log(data);
    var ok = true;

    if(ok){
      realm.lobbies.push(data);
      io.emit('updateLobbies', realm.lobbies);
    }
    socket.emit('newLobbyResponse', ok);
  });

  socket.on('loadLobbies', function(){
    socket.emit('updateLobbies', realm.lobbies);
  });

  socket.on('gMessage', function(data){
    socket.broadcast.emit('gMessage', data);
  });
});
