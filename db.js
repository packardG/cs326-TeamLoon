var mongojs = require('mongojs');
var user = require('./routes/user-routes.js');

var connstr = 'mongo ds057204.mongolab.com:57204/users';
var db = mongojs(connstr,['userInfo'], {authMechanism: 'ScramSHA1'});


db.userInfo.insert({userName: user.screenName, password: user.pass, ID:user.ID, pos:user.pos}, function(err, saved) {
  if(err) console.log("User not saved");
  else console.log("User saved");
});

module.exports = db;
