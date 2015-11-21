var mongojs = require('mongojs');

var connstr = 'mongo ds057204.mongolab.com:57204/users';

var users = db.collection('users');

var db = require('mongojs').connect(connstr, users);


module.exports = db;
