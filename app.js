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

// var usernames = ['Loon', 'Elephant', 'Lynx', 'Dog', 'Cat', 'Falcon', 'Eagle', 'Chimpanzee', 'Tick', 'DoDo', 'Penguin',
// 'Cheetah', 'Whale', 'Philip Seymour Hoffman', 'Goldfish', 'Unicorn', 'Lion', 'Tiger', 'Bear', 'Chickadee', 'Liger',
// 'Monkey', 'Giraffe', 'Seal', 'Walrus', 'Toucan', 'Chipmunk', 'Gorilla'];
//
// var activeUsernames = [];

function splitter(url){
    if (url.indexOf('=') === -1){
	return url;
    }
    else
	return url.split('=')[1];
}

var suggestedVids = [];

var first = 0;

io.on('connection', function(socket){

  console.log("Connection");


  //THIS SHOULD BE CALLED RIGHT WHEN THE USER CONNECTS
  socket.on('adduser', function(data){
    console.log(data.room);
    socket.room = chatroom.findRoom(data.room);
    // console.log(chatroom.findRoom(data.room));
    socket.u = chatroom.joinRoom(socket.room.name, "temp");

    //TODO Generate a new username

    // function getName(nameString){
    //   var tempName = nameString;
    //   // var tempName = usernames[Math.floor((Math.random() * usernames.length) + 1)];
    //   if(activeUsernames.indexOf(tempName) === -1){
    //     return tempName;
    //   }
    //   else{
    //     tempName = tempName + '+';
    //     getName(tempName);
    //     // getName(Math.floor((Math.random()* usernames.length) + 1));
    //   }
    // }

    // var tempName = usernames[Math.floor((Math.random() * usernames.length) + 1)];
    // if(activeUsernames.indexOf(tempName) === -1){
    //   socket.username = tempName
    // }
    // else{
    //   socket.
    // }
    // socket.username = getName(usernames[Math.floor((Math.random() * usernames.length) + 1)]);
    socket.username = socket.u.userName;
    // activeUsernames.push(socket.username);

    // send client to the room
    socket.join(socket.room.name);

    io.sockets.in(socket.room.name).emit('chat message', 'SERVER', socket.username + ' has entered the chatroom');
  });


  socket.on('chat message', function(message){
    io.sockets.in(socket.room.name).emit('chat message', socket.username, message);
  });

  socket.on('suggest video', function(data){
    console.log('suggest video: ' + splitter(data.suggestedvideo));
    var vid = splitter(data.suggestedvideo);

    io.sockets.in(socket.room.name).emit('suggest video', {suggestedvideo: vid});
    io.sockets.in(socket.room.name).emit('change video', {videoid: vid});
//   suggestedVids.push(vid);
    io.sockets.in(socket.room).emit('suggest video', {suggestedvideo: vid});
    if (first === 0){
	io.sockets.in(socket.room).emit('change video', {videoid: vid});
    }
    first = 1;

  });

  socket.on('disconnect', function(){

    // socket.broadcast.to(socket.room.name).emit('chat message', 'SERVER', socket.username + ' has disconnected');
    // var i = activeUsernames.indexOf(socket.username);
    // if(i != -1){
    //   activeUsernames.splice(i, 1);
    // }
    // socket.leave(socket.room.name);
    chatroom.removeUser(socket.room,socket.u);
  });

 //  socket.on('Call Vote', function(){
 //
 //     io.sockets.in(socket.room).emit('Vote Kick');
 // });

});

http.listen(3000, "0.0.0.0", () => {
  console.log('Express started on http://localhost:' +
      3000 + '; press Ctrl-C to terminate');
});
