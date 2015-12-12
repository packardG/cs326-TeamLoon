var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds053164.mongolab.com:53164/unicorns', ['adminDB'], {authMechanism: 'ScramSHA1'});
// Rooms maintain a user list, this list is just a temporary
// way of tracking users
function room(name, desc, lat, long, video) {
  return {
    name: name,
    desc: desc,
    lat: lat,
    long: long,
    vid : video,
    userUID : 0,
    userList: [],
    votingList: [],
  };
}

var roomsUID = 0;
var rooms = [];
// tags is for description right now, I'm pretty sure there shouldn't be a description but
// thats not up to me to make
function createChatroom(name, tags, lat, lon, video) {
  rooms[roomsUID++] = room(name, tags, lat, lon, video);
  db.adminDB.insert({name : name, tags: tags, lat : lat, lon : lon, video : video})
  console.log(roomsUID);
}

// initialize our chat rooms
createChatroom('amherst', 'bleh', 0, 0, "");
createChatroom('sunderland', 'neverland', 0, 0, "");
createChatroom('hadley', 'mall place', 0, 0, "");
createChatroom('Neverland Ranch', 'Heee heeee', 0, 0, "");

//Returns a room obj
function findRoom(roomName){
  for (var i = 0; i < rooms.length; i++) {
    if(rooms[i].name === roomName){
      return rooms[i];
    }
  }
  return;
}

function getAllRooms(){
  return rooms;
}

// returns a new user object, saving the username
function newUser(un) {
  return {userName : un}
}

// join a room, giving the room your username
function joinRoom(roomName, username) {
  var room = findRoom(roomName);
  if (!room) return console.log("can't find room");
  room.userUID++;
  room.userList[room.userUID] = newUser(username);
  return room.userUID;
}

// returns a list of users in the chatroom
function getUsers(chatroom) {
  return chatroom.userList;
}

// removes a user
function removeUser(chatroom, userID) {
  for (var i in chatroom.userLists) {
    if (i == userID) {
      delete chatroom.userLists[i];
      return;
    }
  }
}

exports.findRoom = findRoom;
exports.getAllRooms = getAllRooms;
exports.joinRoom = joinRoom;
exports.getUsers = getUsers;
exports.createChatroom = createChatroom;
