var express    = require('express');
var handlebars = require('express-handlebars');
var app = express();

app.set('port', process.env.PORT || 3000);

var view = handlebars.create({ defaultLayout: 'receive' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.render('main', {layout : "receive"});
});

app.get('/send', (req, res) => {
  res.render('main', {layout : "send"});
});


app.listen(app.get('port'), () => {
  console.log('Express started on http://localhost:' +
              app.get('port') + '; press Ctrl-C to terminate');
});

// PEERJS stuff
server = app.listen(27000)
app.use('/peerjs', require('peer').ExpressPeerServer(server, {
	debug: true
}))

var connected = [];
server.on('connection', function (id) {
  console.log(id);
  var idx = connected.indexOf(id); // only add id if it's not in the list yet
  if (idx === -1) {connected.push(id);}
});
server.on('disconnect', function (id) {
  var idx = connected.indexOf(id); // only attempt to remove id if it's in the list
  if (idx !== -1) {connected.splice(idx, 1);}
});
