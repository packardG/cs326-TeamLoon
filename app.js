// This requires the necessary libraries for the webapp.
var express    = require('express');
var handlebars = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var morgan = require('morgan');

//local libraries
var db = require('./lib/db');
var team = require('./lib/team.js');

var maintanace = true;

// initialize our app
var app = express();

app.set('port', process.env.PORT || 3000);

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

function loggedIn(sessionUser) {
  return sessionUser && db.isOnline(sessionUser);
}

app.post('/auth',(req,res) => {
  // Grab the session if the user is logged in.
  var sessionUser = req.session.user;
  // Redirect to main if cookie and user is online:
  if (loggedIn(sessionUser)) {
    res.redirect('/about');
  }
  else {
    // Pull the values from the form:
    var name = req.body.name;
    var pass = req.body.pass;

    if (!name || !pass) {
      req.flash('login', 'Did not provide the proper credentials.');
      res.redirect('/login');
    }
    else {
      // this isn't a big part of our app, so user object is really simple
      var user = {username : name, password : pass};
      // callbacks
      function success() {
        req.session.user = user;
        res.redirect('/');
      }
      function failure() {
        req.flash('login', 'Account Doesn\'t Exist');
        res.redirect('/login');
      }
      db.validateUser(user, success, failure);
    }
  }
  //
});

app.get('/login',(req,res) => {
  res.render('login', {
    title : "Oops, sorry! A janitor is cleaning up some nasty code",
    message : "We'll be back in a jiff. If you are an admin please log in here!",
    layout : "none",
  });
});

app.get('/logout', function(req, res) {
  // Grab the user session if logged in.
  var sessionUser = req.session.user;

  if (sessionUser && !db.isOnline(sessionUser)) {
    delete req.session.user;
  }
  // Otherwise, we delete both.
  else if (loggedIn(sessionUser)) {
    db.logout(sessionUser);
    delete req.session.user;
  }

  // Redirect regardless.
  res.redirect('/');
});


app.get('/', (req, res) => {
    var sessionUser = req.session.user;
    if (maintanace && !loggedIn(sessionUser)) {
      res.redirect('/login');
      return;
    }
    res.render('splash');
});

app.get('/team', (req, res) => {
  var sessionUser = req.session.user;
  if (maintanace && !loggedIn(sessionUser)) {
    res.redirect('/login');
    return;
  }

  var result;
  var queryVal = req.query.user;

  //Check to see if query was valid
  if(!queryVal){
    result = team.all();
  }
  else{
    result = team.one(queryVal);
  }

  if (!result.success) {
    notFound404(req, res);
  } else {
    res.render('team', {
      members: result.data,
    });
  }
});

app.get('/about', (req, res) => {
  var sessionUser = req.session.user;
  if (maintanace && !loggedIn(sessionUser)) {
    res.redirect('/login');
    return;
  }

  var result = team.all();
  if (!result.success) {
    notFound404(req, res);
  } else {
    res.render('about');
  }
});


//Used to create temporary fake chatrooms for our chatroom-selection view.
function room(name, desc, lat, long) {
  return {
    name: name,
    desc: desc,
    lat: lat,
    long: long
  };
}
var rooms = [
  room('amherst', 'bleh', 0, 0),
  room('sunderland', 'neverland', 0, 0),
  room('hadley', 'mall place', 0, 0)
];

app.get('/roomView', (req, res) => {
  var sessionUser = req.session.user;
  if (maintanace && !loggedIn(sessionUser)) {
    res.redirect('/login');
    return;
  }
  res.render('wireframe', {
    layout : "chatroom",
  });
});

app.get('/roomSelection', (req, res) => {
  var sessionUser = req.session.user;
  if (maintanace && !loggedIn(sessionUser)) {
    res.redirect('/login');
    return;
  }
  res.render('chatroom-selection', {
    rooms: rooms
  });
});

//Errors
function notFound404(req, res) {
  res.status(404);
  res.render('404', {layout : 'none'});
}

function internalServerError500(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500', {layout : 'none'});
}

app.use(notFound404);
app.use(internalServerError500);
//

app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});
