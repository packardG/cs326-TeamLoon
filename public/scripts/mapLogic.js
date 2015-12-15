var pins = [];
var map;
var featureLayer;

var position;
// Helper function used as parameter for getLocation function.

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

function clearMap() {
  map.removeLayer(featureLayer);
  pins = [];
  featureLayer = L.mapbox.featureLayer().addTo(map);

  featureLayer.on('layeradd', function(e) {
      var marker = e.layer,
          feature = marker.feature;

      // Create custom popup content
      var popupContent =  '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                              feature.properties.desc +
                          '</a>';

      // http://leafletjs.com/reference.html#popup
      marker.bindPopup(popupContent,{
          closeButton: false,
          minWidth: 320
      });
  });
}


function checkMap() {
  $.ajax({
     url: '/rooms?lat=' + position.coords.latitude + '&long=' + position.coords.longitude,
     error: function(code) {
       console.log(code);
     },
     dataType: 'json',
     success: function(data) {
       if (data.length != pins.length) {
         clearMap();
         for (var i = 0; i<data.length; i++) {
           room = data[i];
           addPin({name : room.name, desc : "<center><h3>"+room.name+"</h3><br>Join</center>", coords : [room.long, room.lat], url : "/roomView?roomName="+room.name});
         }
       }
     },
     type: 'GET'
  });

  setTimeout(checkMap, 2000);
}

function initializeMap() {
  // this just creates the map object. The size is still specified in the map.handlebars
  L.mapbox.accessToken = 'pk.eyJ1IjoiYWNiZW50bGUiLCJhIjoiY2lndTI4cm5pMGF1anVja28zOHI3ZXo4eSJ9.bC_CeR5LuW9S7K1oTHxh3Q';
  map = L.mapbox.map('map', 'mapbox.streets');
  getLocation();
  featureLayer = L.mapbox.featureLayer().addTo(map);

  featureLayer.on('layeradd', function(e) {
      var marker = e.layer,
          feature = marker.feature;

      // Create custom popup content
      var popupContent =  '<a target="_blank" class="popup" href="' + feature.properties.url + '">' +
                              feature.properties.desc +
                          '</a>';

      // http://leafletjs.com/reference.html#popup
      marker.bindPopup(popupContent,{
          closeButton: false,
          minWidth: 320
      });
  });
  $("a").each(function() {
      var t = $(this);
      var url = t.attr('url');
      if (url) {
        console.log(url);
        t.click(function() {
          console.log(url);
          window.location.href = url;
        });
      }
  });
  $("#makecr").click(function() {
    var name = $('#crn').val();
    var url = $('#crv').val();

      console.log(name);
    if (!name) {
      name = "Default";
    }
    if (!url) {
      url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstleyVEVO";
    }
    $.ajax({
       url: '/createChatroom',
       data : {
          name : name,
          url : url,
          lat : $('#lat').val(),
          lon : $('#long').val(),
        },
       error: function(code) {
         console.log(code);
       },
       dataType: 'json',
       success: function(data) {},
       type: 'POST'
    });
    map.setView([position.coords.latitude, position.coords.longitude], 16);
  });

}

function success(pos){
  position = pos;
  map.setView([pos.coords.latitude, pos.coords.longitude], 13);
  $('#lat').val(position.coords.latitude);
  $('#long').val(position.coords.longitude);
  $.ajax({
     url: '/rooms?lat=' + position.coords.latitude + '&long=' + position.coords.longitude,
     error: function(code) {
       console.log(code);
     },
     dataType: 'json',
     success: function(data) {
       console.log(data);
       clearMap();
       for (var i = 0; i<data.length; i++) {
         room = data[i];
         addPin({name : room.name, desc : "<center><h3>"+room.name+"</h3><br>Join</center>", coords : [room.long, room.lat], url : "/roomView?roomName="+room.name});
       }
     },
     type: 'GET'
  });
  checkMap();
}


function addPin(data) {
  pins.splice(pins.length,0,{
     // this feature is in the GeoJSON format: see geojson.org
     // for the full specification
     type: 'Feature',
     geometry: {
         type: 'Point',
         // coordinates here are in longitude, latitude order because
         // x, y is the standard for GeoJSON and many formats
         coordinates: data.coords
     },
     properties: {
         title: "<h1>" + data.name + "</h1>",
         desc : data.desc, // cool we can inject in here
         url : data.url,
         // one can customize markers by adding simplestyle properties
         // https://www.mapbox.com/guides/an-open-platform/#simplestyle
         'marker-size': 'large',
         'marker-color': '#3366ff',
         'marker-symbol': "star"
     }
  });
  featureLayer.setGeoJSON(pins);
}

$(document).ready( initializeMap );

// testing to see if it actually clears it
// "1" is a key
//
//
//Example Data object
// {
//  they swapped the freaking coordinates ^, so friggin annoying
//            longitude, latitude
// coords : [-72.5170, 42.3670]
// }

//addPin({name : "Rocking", desc : "<center>Join</center>", coords : [-72.5170, 42.3670], url : "nerd"});

//clearMap();
