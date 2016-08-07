var db = require("./db.js");

module.exports = {

    getSecret : function(uid){
        //console.log(uid);
        Keys.find({"uid":uid}, function (err, docs) {
            return docs[0].secretkey;
        });
    }

};