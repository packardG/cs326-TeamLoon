// Rooms maintain a user list
// way of tracking users

function room(name, desc, lat, long, video, uniqueID) {
  return {
    name: name,
    desc: desc,
    lat: lat,
    long: long,
    vid : video,
    userList: [],
    votingList: [],
    vidYesCount : 0,
    vidNoCount : 0,
    totalVote : 0,
    kickYesCount : 0,
    kickNoCount : 0,
    totalKickCount : 0
  };
}

var rooms = [];

var usernames = ['Loon', 'Elephant', 'Lynx', 'Dog', 'Cat', 'Falcon', 'Eagle', 'Chimpanzee', 'Tick', 'DoDo', 'Penguin',
'Cheetah', 'Whale', 'Philip Seymour Hoffman', 'Goldfish', 'Unicorn', 'Lion', 'Tiger', 'Bear', 'Chickadee', 'Liger',
'Monkey', 'Giraffe', 'Seal', 'Walrus', 'Toucan', 'Chipmunk', 'Gorilla', 'Hiphopotomas', 'Rhymnocerus', 'Bernie Mac',
'Oprah', 'Frog', 'Shark', 'Dolphin', 'Rabbit', 'Squirrel', 'Wooley Mammoth', 'Lemur', 'Zebra', 'Heath Ledger',
'Steve Harvey', 'Batman', 'Superman', 'Aquaman', 'Wonder Woman', 'Green Lantern', 'Iron Man', 'Hulk',
'Hawkeye', 'Black Widow', 'Spiderman', 'Thor'];

// tags is for description right now, I'm pretty sure there shouldn't be a description but
// thats not up to me to make
function createChatroom(name, tags, lat, lon, video) {
  var newRoom = room(name, tags, lat, lon, video);
  rooms.push(newRoom);
}

// initialize our chat rooms

createChatroom('Amherst', 'bleh',  42.3670, -72.5170, "");
createChatroom('Sunderland', 'neverland', 42.4667,-72.5792, "");
createChatroom('Hadley', 'mall place', 42.3417, -72.5889, "");
createChatroom('Neverland', 'Heee heeee', 42.4510, -72.5170, "");

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

function getNearbyRooms(lat,lon){
  var nearRooms = [];
  for (var i = 0; i<rooms.length; i++) {
    var room = rooms[i];
    if (Math.abs(room.lat - lat) < 0.5 && Math.abs(room.long - lon) < 0.5)
      nearRooms.push(room);
  }
  return nearRooms;
}


// join a room, giving the room your username
function joinRoom(roomName, userSocket) {
  var room = findRoom(roomName);
  if (!room){
    console.log('cant find room');
    return;
  }
  var newNam = getName(room, usernames[Math.floor(Math.random() * usernames.length)]);
  room.userList[newNam] = userSocket;

  return newNam;
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

  delete chatroom.userList[user];
}

function getName(chatroom, nameString){
  var tempName = nameString;

  if(!(tempName in chatroom.userList)){
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
exports.getNearbyRooms = getNearbyRooms;
