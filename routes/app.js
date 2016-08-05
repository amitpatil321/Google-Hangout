var mongoose = require( 'mongoose' );
var users = mongoose.model('Users');

exports.home = function(req,res){
	if(!req.session.user){
		res.render("login.handlebars");
		console.log("not logged in");
	}else{
		console.log("Logged in 	");
	}
}

// Show login screen
exports.login = function(req,res){
    res.render("login.handlebars",{"msg" : req.session.flash});
    delete req.session.flash
}

// check user login details
exports.loginCheck = function(req,res){
    var username = req.body.username;
    var password = req.body.password;    
    users.find({username: username}, function(er, user){
        console.log(user);
        if(!user.length){
            req.session.flash = {"type" : "error", "msg" : "Invalid username or password"} 
            res.redirect("/login");
        }
        else{
            if(user[0].password == password){
                res.redirect("/home");
            }else{
                req.session.flash = {"type" : "error", "msg" : "Invalid username or password"} 
                res.redirect("/login");
            }
        }
    });
}

// Show home page
exports.home = function(req,res) {
    res.render("home.handlebars");
}