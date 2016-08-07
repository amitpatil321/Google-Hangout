// Development only libs
var chalk      = require('chalk');
// Deployment libs
var express     = require('express');
var http        = require('http');
var socket      = require('socket.io');
var bodyparser  = require('body-parser');
var handlebars  = require('express-handlebars');
var session     = require('express-session');
var crypto 	    = require('crypto');
var db          = require('./models/db.js');
var userModel   = require('./models/user.js');
var appRoute    = require('./routes/app.js');
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
	// User comes online 
	socket.on("userOnline", function(user){
      socket.uid = user.id;
      // check if user already exists ?
      if(!user[socket.uid])
        users[socket.uid] = socket;

      // check if user already exists in online users list ?
      var found = 0;  
      for (var key in onlineusers) {
        //console.log(onlineusers[key].id+"=="+user.id);
        if(onlineusers[key].id == user.id)
            found = 1 
      }         

      if(!found)
        onlineusers.push(user)

      // Store user details in online users list
	  io.emit("userOnline",{"users":onlineusers});

	});  


    // New message event
	socket.on("message", function(msgObj){
		//console.log("=="+msgObj);
		// Get servers secret key
        //var senderSecret = socket.request.session.user.secret;
        var senderSecret   = userModel.getSecret(msgObj.sender);
		var receiverSecret = userModel.getSecret(msgObj.receiver);
		// Get receivers id
		var receiverId   = msgObj.receiver;
 
        var sender       = msgObj.sender 
        var receiver     = msgObj.receiver
        var senderName   = '';
        var receiverName = '';

        // Create room name
		var room = senderSecret+"-"+receiverId;
     	users[msgObj.receiver].join(room);  
    	users[msgObj.sender].join(room);

        // // Find sender name 
        // for (var key in onlineusers) {
        //     if(onlineusers[key].id == sender)
        //         senderName = onlineusers[key].name
        // }      
        // // Find receiver name 
        // for (var key in onlineusers) {
        //     if(onlineusers[key].name == receiver);
        //         receiverName = onlineusers[key].name
        // }      
  
    	// send message to all user in room
    	io.sockets.in(room).emit("message",{
            "msg"          : msgObj.msg, 
            "sender"       : msgObj.sender, 
            "receiver"     : msgObj.receiver,
            "timestamp"    : Date.now() 
    	});
		// List all rooms and members	
		// var room = io.sockets.adapter.rooms;
		// for (var key in room){
		//     console.log(room[key]);
		// }
	});

    socket.on("typing", function(msgObj){
        var senderSecret = socket.request.session.user.secret;
        // Get receivers id
        var receiverId   = msgObj.receiver;
        var senderName   = '';

        var room = senderSecret+"-"+receiverId;

        // Find sender name 
        for (var key in onlineusers) {
            if(onlineusers[key].name == msgObj.sender);
                senderName = onlineusers[key].name
        }   
        // Create room name
        var room = senderSecret+"-"+receiverId;
        io.sockets.in(room).emit("typing",{
            "sender"   : msgObj.sender,
            "receiver" : msgObj.receiver,
            "msg"      : senderName+' is typing...', 
        });
        //console.log(chalk.red("Typing event received from :"+msgObj.sender+" to :"+msgObj.receiver));
        
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
  console.log('Web server started at : ' + new Date().toString("hh:mm tt"))
});