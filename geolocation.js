// Helper function used as parameter for getLocation function.
function success(pos){
  var position = pos;
}

// Grabs location if possible and assigns position object.
function getLocation(){
  navigator.geolocation.getCurrentPosition(success);
  return position;
}

// Pythagorean function that uses chat room position and user position to
// calculate the hypotenuse between the two positions. Takes in two position
// objects, returns double.
function getDistance(roomPos, userPos){
  var x = roomPos.coords.latitude - userPos.coords.latitude;
  var y = roomPos.coords.longitude - userPos.coords.longitude;
  var dist = Math.sqrt((x*x) + (y*y));
  return dist;
}
