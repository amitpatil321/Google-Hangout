var mongoose    = require('mongoose');
var userModel   = require('../models/user.js');
var helperModel = require('../models/helper.js');

// Show home page 
exports.home = function(req, res) {
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
    //console.log(req.params.username);
    res.render("login.handlebars",{"msg" : req.session.flash, "username": req.params.username, "password": req.params.password});
    delete req.session.flash
}
 
// exports.register = function(req, res){
//     userModel.register(req)
//     res.render("login.handlebars",{"msgreg" : req.session.flash});
//     delete req.session.flash
// }

// check user login details
exports.loginCheck = function(req,res){
    if(req.body.action == "login")
        userModel.login(req, res)
    else
        userModel.register(req, res)
    delete req.session.flash    
} 