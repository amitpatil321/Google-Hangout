// Development only libs
var chalk      = require('chalk');
 
// Deployment libs
var express    = require('express');
var http       = require('http');
var socket     = require('socket.io');
var bodyparser = require('body-parser');
var handlebars = require('express-handlebars');
var session    = require('express-session');
var crypto 	   = require('crypto');
var db         = require('./models/db.js');
var appRoute   = require('./routes/app.js');
// var userRoute  = require('./routes/user.js');
// var chatRoute  = require('./routes/chat.js');

var sessionMiddleware = session({secret: "xpm#sfr", resave : true, saveUninitialized: false})
 
var app        = express();
var httpServer = http.createServer(app);
io             = socket(httpServer);
// Enable session access inside socket
io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next);
});

// Config handlebars
app.set('port', process.env.PORT || 3000)
app.set('view engine','handlebars');
app.engine('handlebars',handlebars({defaultLayout:'layout'}));


// Middlewares
app.use(express.static(__dirname+"/public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(sessionMiddleware);


// Handle paths/routes
app.get('/', appRoute.home)
app.get('/login', appRoute.login)
app.get('/login/:username/:password', appRoute.login2)
app.post('/login', appRoute.loginCheck)
app.get('/home', appRoute.home)

io.use(function (socket, next){
    var name = socket.handshake.query.name;
    socket._name = name;
    next();
});

var onlineusers = new Array();
var users = new Array();
io.on("connection",function(socket){
	// USer comes online 
	socket.on("userOnline", function(user){
      socket.uid = user.id;
      //console.log(socket.id);
      users[socket.uid] = socket;
      onlineusers.push(user)
	  // Store user details in online users list
	  io.emit("userOnline",{"users":onlineusers});
	}); 

	socket.on("message", function(msgObj){
		//console.log("=="+msgObj);
		// Get servers secret key
		var senderSecret = socket.request.session.user.secret;
		// Get receivers id
		var receiverId   = msgObj.receiver;
		// Create room name
		var room = senderSecret+"-"+receiverId;
     	users[msgObj.receiver].join(room);  
    	users[msgObj.sender].join(room);
    	//console.log(room);
    	// send message to all user in room
    	io.sockets.in(room).emit("message",{
    		"msg"      : msgObj.msg, 
    		"sender"   : msgObj.sender, 
    		"receiver" : msgObj.receiver,
    		"timestamp": Date.now()
    	});
		// List all rooms and members	
		// var room = io.sockets.adapter.rooms;
		// for (var key in room){
		//     console.log(room[key]);
		// }
	});

	// User disconencts
	socket.on('disconnect', function () {
	  socket.emit('disconnected');
	});

});

// Listen server request on given port
var port = process.env.PORT || 3000;
httpServer.listen(app.get('port'), function () {
  console.log('Web server listening on port ' + app.get('port'))
});