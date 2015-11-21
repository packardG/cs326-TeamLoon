var mongojs = require('mongojs');
var user = require('./routes/user-routes.js');

//var connectionstring = 'mongo dssdff7204.mongolab.com:57204/users';

var connectionstring = 'mongo ds057204.mongolab.com:57204/users';
var db = mongojs(connectionstring,['userInfo'], {authMechanism: 'ScramSHA1'});

function addUser(user){
   // console.log("addUser has been called");
   // console.log(db.userInfo._getServer);

   db.userInfo.insert({screenName: user.screenName, pass: user.pass, lat: user.lat, long: user.long},
      function(err, saved) {
         if(err) console.log("User not saved");
         else console.log("User saved");
   });

   //console.log(db);

}

exports.addUser = addUser;
