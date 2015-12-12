console.log("included");

function initialize(myID) {
  var peer = new Peer(myID, {
  	host: location.hostname,
  	port: 27000,
  	path: '/peerjs'
  })

  peer.on('connection', function(dataConnection) {
  	dataConnection.on('data', function(data) {
  		// data === 'hello'
  	  console.log(data);
  	})
  });
  console.log("start");
  peer.on('call', function(mediaConnection) {
  	mediaConnection.answer();
  	mediaConnection.on('stream', function(stream) {
  		console.log(stream);
  		var audio = new Audio();
  	  audio.src = (URL || webkitURL || mozURL).createObjectURL(stream);
  	  audio.play();
  	})
  });
}
