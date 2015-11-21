var mongojs = require('mongojs');
var user = require('./routes/user-routes.js');

var connstr = 'mongo ds057204.mongolab.com:57204/users';
var db = mongojs(connstr,['userInfo'], {authMechanism: 'ScramSHA1'});

function addUser(user){
   console.log("addUser has been called");
   db.userInfo.insert({userName: user.screenName, password: user.pass, pos:user.pos},
      function(err, saved) {
         if(err) console.log("User not saved");
         else console.log("User saved");
   });
}

exports.addUser = addUser;
