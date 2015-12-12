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

function splitter(url) {
    if (url.length>13){
	return url.split('=')[1];
	}
    else return url;
}

io.on('connection', function(socket){

  console.log("Connection");

  //THIS SHOULD BE CALLED RIGHT WHEN THE USER CONNECTS
  socket.on('adduser', function(data){
    console.log(data);
    socket.room = data.room;

    //TODO Generate a new username
    socket.username = 'Loon';

    // send client to the room
    socket.join(socket.room);

    io.sockets.in(socket.room).emit('chat message', 'SERVER', socket.username + ' has entered the chatroom');
  });


  socket.on('chat message', function(message){
    io.sockets.in(socket.room).emit('chat message', socket.username, message);
  });

  socket.on('suggest video', function(data){
    console.log('suggest video: ' + data.suggestedvideo);

    io.sockets.in(socket.room).emit('suggest video', {suggestedvideo: data.suggestedvideo});
    io.sockets.in(socket.room).emit('change video', {videoid: data.suggestedvideo});
  });

  socket.on('disconnect', function(){

<<<<<<< HEAD
    io.sockets.emit('suggest video', {suggestedvideo: splitter(data.suggestedvideo)});
=======
    socket.broadcast.to(socket.room).emit('chat message', 'SERVER', socket.username + ' has disconnected');
    socket.leave(socket.room);
>>>>>>> 26f59490812f13cae47d3d39a42e0282fd98f469
  });

});

http.listen(3000, "0.0.0.0", () => {
  console.log('Express started on http://localhost:' +
      3000 + '; press Ctrl-C to terminate');
});
