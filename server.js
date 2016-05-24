var http = require("http");
var io = require('socket.io')(http);

var server = http.createServer(function (req, res){
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end("<h1>hello</h1>");
})

var port = Number(process.env.PORT || 20000);

server.listen(port);

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

  socket.on('loadLobbies', function(){
    socket.emit('updateLobbies', realm.lobbies);
  });

  socket.on('gMessage', function(data){
    socket.broadcast.emit('gMessage', data);
  });
});
