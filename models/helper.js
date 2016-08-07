var db = require("./db.js");

module.exports = {

    insertKey : function(uid,skey){
        // If record already exist, then delete it and then insert

        Keys.findOneAndRemove({uid: uid}, function(err){
            var key = new Keys();

            key.uid       = uid;
            key.secretkey = skey;
            key.save(function(err, user_Saved){
                if(err){
                    throw err;
                    console.log(err);
                }else{
                    console.log('Key stored');
                }
            });
        });
        
    }

};