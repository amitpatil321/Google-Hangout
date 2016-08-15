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
    },

    sendTyping : function(room,io,msgObj){
        var senderName = userModel.getName(msgObj.sender);    
        io.sockets.in(room).emit("typing",{
            "sender"   : msgObj.sender,
            "receiver" : msgObj.receiver,
            "msg"      : senderName+' is typing...', 
        });         
    }
};