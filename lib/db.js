var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds053164.mongolab.com:53164/unicorns', ['adminDB'], {authMechanism: 'ScramSHA1'});

// taken from https://github.com/mafintosh/mongojs
db.on('error', function (err) {
    console.log('database error', err)
})
// End copy-pasta

db.adminDB.find(function(err, docs) {
  if(err || !docs) console.log(err);
  else docs.forEach(function(entry) {
    if (entry.weight > 400) {
      var proceed = false;
      for (var i = 0; i<entry.loves.length; i++) {
        if (entry.loves[i] == "apple" || entry.loves[i] == "grape") {
          proceed = true;
          break;
        }
      }
      if (proceed) {

      }
    }
  });
});

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

var online = []
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