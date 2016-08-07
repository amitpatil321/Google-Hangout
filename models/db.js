var mongoose = require('mongoose');
var chalk    = require('chalk');

// mongodb://amit:amit@ds145325.mlab.com:45325/hangout
var dbURI = 'mongodb://127.0.0.1/hangout';
console.log(chalk.yellow("Establishing connection to the DB"));

mongoose.connect(dbURI);

// Handle connection error
mongoose.connection.on('error', function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

// Handle success error
mongoose.connection.on("connected",function(){
    console.log(chalk.green("Database connection successful"));
});

/*** users schema ***/
var userSchema = new mongoose.Schema({
    name     : {type:String},
    username : {type : String, unique : true},
    password : {type : String}
});

//mongoose.model( 'Users', userSchema );
global.Users = mongoose.model('Users',userSchema);

/*** users schema ***/
var skeysSchema = new mongoose.Schema({
    uid       : {type:String},
    secretkey : {type:String},
    otherkey  : {type:String}
});

//mongoose.model( 'Keys', skeysSchema );
global.Keys = mongoose.model('Keys',skeysSchema);