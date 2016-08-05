// Development only libs
var chalk      = require('chalk');
 
// Deployment libs
var express    = require('express');
var http       = require('http');
var socket     = require('socket.io');
var bodyparser = require('body-parser');
var handlebars = require('express-handlebars');
var session    = require('express-session');
var db         = require('./models/db.js');
var appRoute   = require('./routes/app.js');
// var userRoute  = require('./routes/user.js');
// var chatRoute  = require('./routes/chat.js');
 
var app        = express();
var httpServer = http.createServer(app);
io             = socket(httpServer);
  
// Config handlebars
app.set('port', process.env.PORT || 3000)
app.set('view engine','handlebars');
app.engine('handlebars',handlebars({defaultLayout:'layout'}));


// Middlewares
app.use(express.static(__dirname+"/public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(session({secret: "xpm#sfr", resave : true, saveUninitialized: false}));


// Handle paths/routes
app.get('/', appRoute.home)
app.get('/login', appRoute.login)
app.post('/login', appRoute.loginCheck)
app.get('/home', appRoute.home)

// Listen server request on given port
var port = process.env.PORT || 3000;
httpServer.listen(app.get('port'), function () {
  console.log('Web server listening on port ' + app.get('port'))
});