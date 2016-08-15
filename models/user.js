var db = require("./db.js");

module.exports = {

    getName : function(sender){
        //console.log(onlineusers);
        for (var key in onlineusers) {
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