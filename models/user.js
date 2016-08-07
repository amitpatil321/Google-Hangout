var db = require("./db.js");

module.exports = {

    getSecret : function(uid){
        Users.find({uid:uid}, function (err, docs) {
            console.log(docs.secretkey);
            return docs.secretkey;
        });
    }

};