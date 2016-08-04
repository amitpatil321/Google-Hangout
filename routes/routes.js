exports.home = function(req,res){
	if(!req.session.user){
		res.render("login.handlebars");
		console.log("not logged in");
	}else{
		console.log("Logged in 	");
	}
}