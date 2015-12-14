var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds053164.mongolab.com:53164/unicorns', ['adminDB'], {authMechanism: 'ScramSHA1'});

// taken from https://github.com/mafintosh/mongojs
db.on('error', function (err) {
    console.log('database error', err)
})
// End copy-pasta
//This database will be expanded to support Data tracking for what videos get watched
//However t. rich said that for this assignment this should be sufficient

function validateUser(user, success, failure) {
  // poll the database to see if the user is there
  db.adminDB.findOne({username : user.username, password : user.password}, function(err,docs) {
      // something went wrong
      if (err)
        console.log(err);
      // No errors, but user doesn't exist
      if (!docs) {
        failure();
      }
      else {
        // it worked
        success();
        online[user.username] = true; // this user is online
      }
  });
}

var online = [];
function isOnline(user) {
  if (online[user.username])
    return true;
  return false;
}

function logout(user) {
  if (isOnline(user))
    online.splice(user.username, 1);
}

// export stuff so we can properly use this library
exports.validateUser = validateUser
exports.isOnline = isOnline;
exports.logout = logout;
