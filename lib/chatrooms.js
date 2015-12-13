var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds053164.mongolab.com:53164/unicorns', ['chatroomDB'], {authMechanism: 'ScramSHA1'});
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

var usernames = ['Loon', 'Elephant', 'Lynx', 'Dog', 'Cat', 'Falcon', 'Eagle', 'Chimpanzee', 'Tick', 'DoDo', 'Penguin',
'Cheetah', 'Whale', 'Philip Seymour Hoffman', 'Goldfish', 'Unicorn', 'Lion', 'Tiger', 'Bear', 'Chickadee', 'Liger',
'Monkey', 'Giraffe', 'Seal', 'Walrus', 'Toucan', 'Chipmunk', 'Gorilla'];

var activeUsernames = [];

// tags is for description right now, I'm pretty sure there shouldn't be a description but
// thats not up to me to make
function createChatroom(name, tags, lat, lon, video) {
  rooms[roomsUID++] = room(name, tags, lat, lon, video);
  db.chatroomDB.insert(rooms[roomsUID-1]);
  console.log(roomsUID);
}

//clear the old database
db.chatroomDB.remove({}, function(cb) {})
// initialize our chat rooms
createChatroom('amherst', 'bleh', -72.5130, 42.3630, "");
createChatroom('sunderland', 'neverland', -72.5190, 42.3690, "");
createChatroom('hadley', 'mall place', -72.5180, 42.3670, "");
createChatroom('Neverland Ranch', 'Heee heeee', -72.5170, 42.3680, "");

//Returns a room obj
function findRoom(roomName){
  for (var i = 0; i < rooms.length; i++) {
    if(rooms[i].name === roomName){
      // console.log(rooms[i]);
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
  if (!room){
    console.log('cant find room');
    return;
  }
  // room.userUID++;
  room.userList[room.userUID] = newUser(getName(usernames[Math.floor(Math.random() * usernames.length)]));
  room.userUID++;
  // room.userList[room.userUID] = newUser(username);
  return room.userList[room.userUID - 1];
}

// returns a list of users in the chatroom
function getUsers(chatroom) {
  return chatroom.userList;
}

// removes a user
function removeUser(chatroom, user) {
  if(!user){
    return;
  }
  var indexOfNameToBeRemoved = activeUsernames.indexOf(user.userName);
  if(indexOfNameToBeRemoved != -1){
    // activeUsernames.pop();
    activeUsernames.splice(indexOfNameToBeRemoved, 1);
  }
  var indexOfUserToBeRemoved = chatroom.userList.indexOf(user);
  if(indexOfUserToBeRemoved != -1){
    // console.log(chatroom.userList);
    // chatroom.userList.pop();
    chatroom.userList.splice(indexOfUserToBeRemoved, 1);
  }
  chatroom.userUID--;
  // console.log(chatroom.userList);
  // for (var i in chatroom.userLists) {
  //   if (i == userID) {
  //     chatroom.userLists.splice(i, 1);
  //     return;
  //   }
  // }
}

function getName(nameString){
  var tempName = nameString;
  // var tempName = usernames[Math.floor((Math.random() * usernames.length) + 1)];
  if(activeUsernames.indexOf(tempName) === -1){
    activeUsernames.push(tempName);
    return tempName;
  }
  else{
    tempName = tempName + '+';
    return getName(tempName);
    // getName(Math.floor((Math.random()* usernames.length) + 1));
  }
}

exports.findRoom = findRoom;
exports.getAllRooms = getAllRooms;
exports.joinRoom = joinRoom;
exports.getUsers = getUsers;
exports.createChatroom = createChatroom;
exports.removeUser = removeUser;
