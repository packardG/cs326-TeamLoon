module.exports = function (app) {
    var maintanace = false;

    //local libraries
    var db = require('../lib/db');
    var chatroom = require('../lib/chatrooms');
    var team = require('../lib/team.js');
    var bodyParser = require("body-parser");

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
            //  layout : "none",
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
                members: result.data
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

    app.get('/roomView', (req, res) => {
        var sessionUser = req.session.user;
        if (maintanace && !loggedIn(sessionUser)) {
            res.redirect('/login');
            return;
        }

        var queryVal = req.query.roomName;

        //Check to see if query was valid and if a room with that name is in the database
        if(queryVal){
            var room = chatroom.findRoom(queryVal);
            if(room){
                /// joined the room
                console.log(chatroom.getUsers(room));
                res.render('wireframe', {
                    layout : "chatroom",
                    userList : chatroom.getUsers(room)
                });
                return;
            }
        }

        res.redirect('/roomSelection');
    });

    app.get('/rooms', (req, res) => {
      var lat = Number(req.query.lat);
      var lon = Number(req.query.long);

      res.send(chatroom.getNearbyRooms(lat,lon));
    });

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
      extended: true
    }));

    function splitter(url){
        if (url.indexOf('=') === -1){
    	return url;
        }
        else
    	return url.split('=')[1];
    }


    app.post('/createChatroom', (req,res) => {
      console.log(req.body);
      chatroom.createChatroom(req.body.name, "", Number(req.body.lat), Number(req.body.lon), splitter(req.body.url));
    });


    app.get('/roomSelection', (req, res) => {
        var sessionUser = req.session.user;
        if (maintanace && !loggedIn(sessionUser)) {
            res.redirect('/login');
            return;
        }

        var allRooms = chatroom.getAllRooms();

        res.render('chatroom-selection', {
            rooms: allRooms,
            layout : "none"
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

};
/**
 * Created by Hawmalt on 12/10/2015.
 */
