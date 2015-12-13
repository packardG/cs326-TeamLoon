var mongojs = require('mongojs');
var db = mongojs('mongodb://admin:admin@ds053164.mongolab.com:53164/unicorns', ['chatroomDB'], {authMechanism: 'ScramSHA1'});
// Rooms maintain a user list, this list is just a temporary
// way of tracking users
function room(name, desc, lat, long, video, uniqueID) {
  return {
    name: name,
    desc: desc,
    lat: lat,
    long: long,
    vid : video,
    userUID : 0,
    userList: [],
    votingList: [],
    UID : uniqueID,
  };
}

var roomsUID = 0;
var rooms = [];

var usernames = ['Loon', 'Elephant', 'Lynx', 'Dog', 'Cat', 'Falcon', 'Eagle', 'Chimpanzee', 'Tick', 'DoDo', 'Penguin',
'Cheetah', 'Whale', 'Philip Seymour Hoffman', 'Goldfish', 'Unicorn', 'Lion', 'Tiger', 'Bear', 'Chickadee', 'Liger',
'Monkey', 'Giraffe', 'Seal', 'Walrus', 'Toucan', 'Chipmunk', 'Gorilla', 'Hiphopotomas', 'Rhymnocerus', 'Bernie Mac',
'Oprah', 'Frog', 'Shark', 'Dolphin', 'Rabbit', 'Squirrel', 'Wooley Mammoth', 'Lemur', 'Zebra', 'Heath Ledger',
'Steve Harvey', 'Batman', 'Superman', 'Aquaman', 'Wonder Woman', 'Green Lantern', 'Iron Man', 'Hulk',
'Hawkeye', 'Black Widow', 'Spiderman', 'Thor'];

var activeUsernames = [];

// tags is for description right now, I'm pretty sure there shouldn't be a description but
// thats not up to me to make
function createChatroom(name, tags, lat, lon, video) {
  rooms[roomsUID++] = room(name, tags, lat, lon, video, roomsUID);
  db.chatroomDB.insert(rooms[roomsUID-1]);
  console.log(roomsUID);
}

//clear the old database
db.chatroomDB.remove({}, function(cb) {})
// initialize our chat rooms

createChatroom('Amherst', 'bleh', -72.5170, 42.3670, "");
createChatroom('Sunderland', 'neverland', -72.5792, 42.4667, "");
createChatroom('Hadley', 'mall place', -72.5889, 42.3417, "");
createChatroom('Neverland', 'Heee heeee', -72.5170, 42.4510, "");

//Returns a room obj otherwise return nothing
function findRoom(roomName){
  for (var i = 0; i < rooms.length; i++) {
    if(rooms[i].name === roomName){
      return rooms[i];
    }
  }
}

//Returns an array of all of the rooms
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
  room.userList[room.userUID] = newUser(getName(usernames[Math.floor(Math.random() * usernames.length)]));
  room.userUID++;
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
    activeUsernames.splice(indexOfNameToBeRemoved, 1);
  }
  var indexOfUserToBeRemoved = chatroom.userList.indexOf(user);
  if(indexOfUserToBeRemoved != -1){
    chatroom.userList.splice(indexOfUserToBeRemoved, 1);
  }
  chatroom.userUID--;
}

function getName(nameString){
  var tempName = nameString;
  if(activeUsernames.indexOf(tempName) === -1){
    activeUsernames.push(tempName);
    return tempName;
  }
  else{
    tempName = tempName + '+';
    return getName(tempName);
  }
}

exports.findRoom = findRoom;
exports.getAllRooms = getAllRooms;
exports.joinRoom = joinRoom;
exports.getUsers = getUsers;
exports.createChatroom = createChatroom;
exports.removeUser = removeUser;
