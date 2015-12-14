console.log("included");

function initialize(myID) {
  var peer = new Peer(myID, {
  	host: location.hostname,
  	port: 27000,
  	path: '/peerjs'
  })

  peer.on('call', function(mediaConnection) {
  	mediaConnection.answer();
  	mediaConnection.on('stream', function(stream) {
  		console.log(stream);
  		var audio = new Audio();
  	  audio.src = (URL || webkitURL || mozURL).createObjectURL(stream);
  	  audio.play();
  	})
  });

  var mediaStreamSource;
  var rawstream;
  var conn;

  function successCallback(stream) {
  		var audioContext = new AudioContext();
      // Create an AudioNode from the stream.
      mediaStreamSource = audioContext.createMediaStreamSource( stream );
      for (var i = 0; i<userList.length; i++) {
    		conn = peer.call(userList[i].username, stream);
      }
  }

  function errorCallback() {
      console.log("The following error occurred: " + err);
  }

  var media = navigator.webkitGetUserMedia( {audio:true}, successCallback, errorCallback );

}
