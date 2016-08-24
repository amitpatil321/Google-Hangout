var db = require("./db.js");
 
module.exports = {

    register : function(req,res){
        var user        = new Users();
        var errlist     = "";

        user.name       = req.body.name
        user.username   = req.body.username
        user.password   = req.body.password
        user.profilepic = req.body.profilepic
        user.save(function(err, user_saved){
            //console.log(err);
            if(err){
                if(err.name == 'ValidationError'){
                    for (var key in err.errors) {
                        if (err.errors.hasOwnProperty(key)) {
                            errlist += '- '+key+' is required<br>';
                        }
                    }
                    req.session.flash = {type : "error", msg : errlist, mod : "register"};
                }                
                else if (err.name == 'MongoError' && err.code == 11000) {
                    req.session.flash = {type : "error", msg : "Username already exists", mod : "register"}
                }else{
                    req.session.flash = {type : "error", msg : "Something went wrong, Try again", mod : "register"};
                }
            }else{
                console.log("saved"+user_saved);
                req.session.flash = {type : "success", msg : "Registration Successful", mod : "register"};
            }
            res.redirect("/login");
        });
    },

    login : function(req,res){
        var username = req.body.username;
        var password = req.body.password;
        Users.find({username: username}, function(er, user){
            //console.log(user);
            if(!user.length){
                req.session.flash = {type : "error", msg : "Invalid username or password", mod : "login"}
                res.redirect("/login");
            }
            else{
                if(user[0].password == password){
                    var id    = user[0]._id
                    var name  = user[0].name
                    var ppic  = user[0].profilepic
                    // Store user details in online users list
                    // onlineusers.push({"id": id, "name" : name})

                    // Store user details in session

                    //req.session.user = {"id": id,"secret": crypto.randomBytes(20).toString('hex'),"name" : name}
                    req.session.user = {id: id,name : name, pic : ppic}
                    //console.log(req.session.user);
                    res.redirect("/home");
                }else{
                    req.session.flash = {type : "error", msg : "Invalid username or password", mod : "login"}
                    res.redirect("/login");
                }
            }
        });
    },

    remove : function(socket){
        // Remove user from users array
        delete users[socket.uid]

        // remove user from online users list
        var index = 0;
        for (var key in onlineusers) {
            if(onlineusers[key].id == socket.uid){
                onlineusers.splice(index, 1);
            }
            index++            
        }
    }, 
 
    getName : function(sender){
        //console.log(onlineusers);
        var senderName = false;
        for (var key in onlineusers) {
            //console.log(onlineusers[key].id+"=="+sender);
            if(onlineusers[key].id == sender)
                senderName = onlineusers[key].name
        }
        return senderName;
    },

    getSecret : function(uid){
        //console.log(uid);
        Keys.find({"uid":uid}, function (err, docs) {
            return docs[0].secretkey;
        });
    },   
    
    getSecretKey : function(socket,callback){
        var skey = socket.request.session.user.secret;
        callback(skey);
    }

};