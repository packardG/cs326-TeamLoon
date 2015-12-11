// This requires the necessary libraries for the webapp.
var express    = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');




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

io.on('connection', function(socket){

  console.log("Connection");

  socket.on('chat message', function(data){
    console.log('message: ' + data.message);
    io.sockets.emit('chat message', {message: data.message});
  });

  socket.on('suggest video', function(data){
    console.log('suggest video: ' + data.suggestedvideo);

    io.sockets.emit('suggest video', {suggestedvideo: data.suggestedvideo});
    io.sockets.emit('change video', {videoid: data.suggestedvideo});
  });

});

http.listen(3000, "0.0.0.0", () => {
  console.log('Express started on http://localhost:' +
      3000 + '; press Ctrl-C to terminate');
});
