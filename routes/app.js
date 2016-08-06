var mongoose = require( 'mongoose' );
var users    = mongoose.model('Users');
var crypto   = require('crypto');
var socket   = require('socket.io');

// Show home page
exports.home = function(req,res) {
    // check if user is logged in
    //req.session.destroy();
    if(!req.session.user){
        res.redirect("/login");
    }else
        res.render("home.handlebars",{"user" : req.session.user,"page": "home"});
}

// Show login screen
exports.login = function(req,res){
    res.render("login.handlebars",{"msg" : req.session.flash});
    delete req.session.flash
}
// Show login screen
exports.login2 = function(req,res){
    console.log(req.params.username);
    res.render("login.handlebars",{"msg" : req.session.flash, "username": req.params.username, "password": req.params.password});
    delete req.session.flash
}

// check user login details
exports.loginCheck = function(req,res){
    var username = req.body.username;
    var password = req.body.password;    
    users.find({username: username}, function(er, user){
        //console.log(user);
        if(!user.length){
            req.session.flash = {"type" : "error", "msg" : "Invalid username or password"} 
            res.redirect("/login");
        }
        else{
            if(user[0].password == password){
                var id   = user[0]._id
                var name = user[0].name

                // Store user details in online users list
                // onlineusers.push({"id": id, "name" : name})

                // Store user details in session
                req.session.user = {"id": id,"secret": crypto.randomBytes(20).toString('hex'),"name" : name}
                res.redirect("/home");
            }else{
                req.session.flash = {"type" : "error", "msg" : "Invalid username or password"} 
                res.redirect("/login");
            }
        }
    });
}

