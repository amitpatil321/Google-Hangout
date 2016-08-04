var express    = require("express");
var bodyparser = require('body-parser');
var handlebars = require('express-handlebars');
var session    = require('express-session');

var routes     = require('./routes/routes.js');
 
var app = express();
  
// Config handlebars
app.set('view engine','handlebars');
app.engine('handlebars',handlebars({defaultLayout:'layout'}));

// Middlewares
app.use(express.static(__dirname+"/public"));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use(session({secret: "xpm#sfr", resave : true, saveUninitialized: false}));

app.get('/', routes.home);

// Configure body parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
// Listen server request on given port

var port = process.env.PORT || 3000;
app.listen(port,function(){
	console.log("Server started at port : "+port);
});