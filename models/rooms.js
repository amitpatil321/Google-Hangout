var db = require("./db.js");
var crypto      = require('crypto');

module.exports = {

    getRoomId : function(startedby, startedwith, next){
        // Check if room already exists ? If not then insert
        console.log("Before");
        Rooms.find({startedby : startedby, startedwith : startedwith}, function(err, sdoc){
        console.log("insdie");
            if(!sdoc.length){
                Rooms.find({startedby : startedwith, startedwith : startedby}, function(err, rdoc){
                    if(rdoc.length){    
                        console.log('Room found level 2 '+rdoc[0].roomname); 
                        //return rdoc[0].roomname
                        next(null,rdoc[0].roomname)
                    }                  
                }); 
            }else{
                console.log('Room found level 1 '+sdoc[0].roomname);                 
                //return sdoc[0].roomname
                next(null,sdoc[0].roomname)
            }
        });

    },

    createRoom : function(startedby, startedwith){
        var roomname     = crypto.randomBytes(20).toString('hex');
        var room         = new Rooms();
        room.startedby   = startedby;
        room.startedwith = startedwith;
        room.roomname    = roomname;
        room.save(function(err, user_Saved){
            if(err){
                throw err;
                console.log(err); 
            }else{
                console.log('Room created : '+roomname);
                return roomname;
            }
        });         
    }

};