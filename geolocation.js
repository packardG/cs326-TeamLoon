var position;

function success(pos){
  position = pos.coords;
}

function getLocation(){
  navigator.geolocation.getCurrentPosition(success);
}

function getDistance(room, pos){
  var x = room.getLat - pos.latitude;
  var y = room.getLong - pos.latitude;
  var dist = Math.sqrt((x*x) + (y*y));
  return dist;
}
