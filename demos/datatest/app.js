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
srv = app.listen(27000)
app.use('/peerjs', require('peer').ExpressPeerServer(srv, {
	debug: true
}))
