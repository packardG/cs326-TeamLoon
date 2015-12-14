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
var tracking = require('./lib/tracking');

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

//Global vars
var suggestedVids = [];



io.on('connection', function(socket){

  // console.log("Connection");


  //THIS SHOULD BE CALLED RIGHT WHEN THE USER CONNECTS
  socket.on('adduser', function(data){
    socket.room = chatroom.findRoom(data.room);
    socket.roomName = socket.room.name;

    socket.username = chatroom.joinRoom(socket.roomName, socket);


    // send client to the room
    socket.join(socket.roomName);

    io.sockets.in(socket.roomName).emit('chat message', 'SERVER', socket.username + ' has entered the chatroom');
    io.sockets.in(socket.roomName).emit('update userLists', Object.keys(socket.room.userList));
  });


  socket.on('chat message', function(message){
    io.sockets.in(socket.roomName).emit('chat message', socket.username, message);
  });

  socket.on('suggest video', function(data){
    console.log('suggest video: ' + splitter(data.suggestedvideo));
    var vid = splitter(data.suggestedvideo);
    tracking.updateVideo(vid, 1, 0);
    suggestedVids.push(vid);
    io.sockets.in(socket.roomName).emit('suggest video', {suggestedvideo: vid});
    io.sockets.in(socket.roomName).emit('change video', {videoAr: suggestedVids});
   //  suggestedVids.shift();

  });

  socket.on('remove vid', function(){
      suggestedVids.shift();
  });

  socket.on('PlayVideo', function(time){
      socket.broadcast.in(socket.roomName).emit('PlayVideo', time);
  });

  socket.on('PauseVideo', function(time){
      socket.broadcast.in(socket.roomName).emit('PauseVideo', time);
  });

  socket.on('disconnect', function(){

    socket.broadcast.in(socket.roomName).emit('chat message', 'SERVER', socket.username + ' has left the chatroom');

    chatroom.removeUser(socket.room,socket.username);


    if(socket.room){
      socket.broadcast.in(socket.roomName).emit('update userLists', Object.keys(socket.room.userList));
    }

    socket.leave(socket.roomName);
  });

  socket.on('Call Vote', function(userName){
     console.log('Calling kick to vote on: ' + userName);
      io.sockets.in(socket.roomName).emit('Vote Kick', userName);
  });


  socket.on('kick player', function(userInput, userName){

     if(userInput === 'yes'){
         socket.room.kickYesCount++;
     }
     else{
         socket.room.kickNoCount++;
     }
      socket.room.totalKickCount = socket.room.kickYesCount + socket.room.kickNoCount;



     if(socket.room.totalKickCount === Object.keys(socket.room.userList).length){
        if(socket.room.kickYesCount > socket.room.kickNoCount){
            console.log('Kicking' + socket.username);

            socket.room.userList[userName].emit('force disconnect');
            socket.room.userList[userName].disconnect();

            io.sockets.in(socket.roomName).emit('update userLists', Object.keys(socket.room.userList));
        }
         socket.room.kickYesCount = 0;
         socket.room.kickNoCount = 0;
     }

  });

  socket.on('skip video', function(){
     console.log('Voting to skip video');
      io.sockets.in(socket.roomName).emit('video vote');
 });

 socket.on('handle skip', function(userInput){

    if(userInput === 'yes'){
        socket.room.vidYesCount++;
    }
    else{
        socket.room.vidNoCount++;
    }
     socket.room.totalVote = socket.room.vidYesCount + socket.room.vidNoCount;

    if(socket.room.totalVote === Object.keys(socket.room.userList).length){

      if(socket.room.vidYesCount > socket.room.vidNoCount){
         tracking.updateVideo(suggestedVids[0],0,socket.room.vidYesCount);
         io.sockets.in(socket.roomName).emit('pop vid');
      }
        socket.room.vidYesCount = 0;
        socket.room.vidNoCount = 0;
   }
});

});

http.listen(3000, "0.0.0.0", () => {
  console.log('Express started on http://localhost:' +
      3000 + '; press Ctrl-C to terminate');
});
