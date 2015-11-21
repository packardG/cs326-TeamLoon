var mongojs = require('mongojs');
var user = require('user.js');

var connstr = 'mongo ds057204.mongolab.com:57204/users';

var users = db.collection('users');

var db = require('mongojs').connect(connstr, users);

db.users.insert({userName: user.screenName, password: user.pass, ID:user.ID, pos:user.pos}, function(err, saved) {
  if(err) console.log("User not saved");
  else console.log("User saved");
});

module.exports = db;
