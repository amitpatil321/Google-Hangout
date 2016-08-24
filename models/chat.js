var db        = require("./db.js");
var userModel = require("./user.js");

module.exports = {

    sendMessage : function(room,io,msgObj){
        io.sockets.in(room).emit("message",{
            "msg"          : msgObj.msg, 
            "sender"       : msgObj.sender, 
            "receiver"     : msgObj.receiver,
            "timestamp"    : Date.now() 
        });
        // Store message to database
        var chatmsg         = new Chats();
        chatmsg.sender    = msgObj.sender;
        chatmsg.receiver  = msgObj.receiver;
        chatmsg.message   = msgObj.msg;
        chatmsg.timestamp = new Date().getTime();
        chatmsg.save(function(err, user_Saved){
            if(err){
                console.log(err);
            }
        });                        
    }, 

    sendTyping : function(room,io,msgObj){
        var senderName = userModel.getName(msgObj.sender);
        if (senderName != false) {
            io.sockets.in(room).emit("typing", {
                "sender": msgObj.sender,
                "receiver": msgObj.receiver,
                "msg": senderName + ' is typing...',
            });
        }  
    },

    sendLogout: function (room,io,myname) {
        io.sockets.in(room).emit("logout", {name : myname});
    }
};