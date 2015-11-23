var mongojs = require('mongojs');
var user = require('./routes/user-routes.js'); //Should this be ./lib/user.js????

var connectionstring = 'mongodb://admin:admin@ds057204.mongolab.com:57204/users';
var db = mongojs(connectionstring,['userInfo'], {authMechanism: 'ScramSHA1'});

function addUser(user){
   console.log("addUser has been called");

   db.userInfo.insert({screenName: user.screenName,
   pass: user.pass},
      function(err, saved) {
         if(err){ console.log(err);}
         else {console.log("User saved");}
   });
}

function checkUser(user,success,failure){
   db.userInfo.find({screenName: user.screenName, pass: user.pass},
   function(err, users) {
      if(err) {
         failure();
         console.log("No users found");}
      else {
         success();
      }
   });
}

exports.addUser = addUser;
exports.checkUser = checkUser;
