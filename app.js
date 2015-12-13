// This requires the necessary libraries for the webapp.
var express    = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');
var db = require('./lib/db');
var chatroom = require('./lib/chatrooms');


// initialize our app
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var view = handlebars.create({ defaultLayout: 'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(flash());
app.use(morgan('combined'));
// setup session
// Session Support:
app.use(session({
  secret: 'octocat',
  saveUninitialized: false, // does not save uninitialized session.
  resave: false             // does not save session if not modified.
}));


//
// handle routes
var routes = require("./routes/routes.js")(app);

function loggedIn(sessionUser) {
  return sessionUser && db.isOnline(sessionUser);
}

function splitter(url){
    if (url.indexOf('=') === -1){
	return url;
    }
    else
	return url.split('=')[1];
}

var suggestedVids = [];

io.on('connection', function(socket){

  // console.log("Connection");


  //THIS SHOULD BE CALLED RIGHT WHEN THE USER CONNECTS
  socket.on('adduser', function(data){
    socket.room = chatroom.findRoom(data.room);
    socket.roomName = socket.room.name;
    socket.u = chatroom.joinRoom(socket.roomName, "temp");

    socket.username = socket.u.userName;

    // send client to the room
    socket.join(socket.roomName);

    io.sockets.in(socket.roomName).emit('chat message', 'SERVER', socket.username + ' has entered the chatroom');
    io.sockets.in(socket.roomName).emit('update userLists', socket.room.userList);
  });


  socket.on('chat message', function(message){
    io.sockets.in(socket.roomName).emit('chat message', socket.username, message);
  });

  socket.on('suggest video', function(data){
    console.log('suggest video: ' + splitter(data.suggestedvideo));
    var vid = splitter(data.suggestedvideo);

    suggestedVids.push(vid);
    io.sockets.in(socket.roomName).emit('suggest video', {suggestedvideo: vid});
    io.sockets.in(socket.roomName).emit('change video', {videoAr: suggestedVids});
    suggestedVids.shift();

  });

  socket.on('disconnect', function(){

    socket.broadcast.in(socket.roomName).emit('chat message', 'SERVER', socket.username + ' has left the chatroom');

    chatroom.removeUser(socket.room,socket.u);


    if(socket.room){
      socket.broadcast.in(socket.roomName).emit('update userLists', socket.room.userList);
    }

    socket.leave(socket.roomName);
  });

  socket.on('Call Vote', function(){
     console.log('calling kick.');
     socket.broadcast.in(socket.roomName).emit('Vote Kick');
 });

   socket.on('kick count', function(client){
      if (typeof io.sockets.sockets[client] !== 'undefined') {
      socket.emit('chat message', socket.username + ' kicked by Server.');
      io.sockets.sockets[client].disconnect();
    } else {
      socket.emit('chat message', socket.username + ' does not exist.');
    }
   });

});

http.listen(3000, "0.0.0.0", () => {
  console.log('Express started on http://localhost:' +
      3000 + '; press Ctrl-C to terminate');
});
