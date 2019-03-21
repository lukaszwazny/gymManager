var crypto = require("crypto");

var hashingFunctions = {
    hash: (algorithm, key, iv, data) => {
        var cipher = crypto.createCipheriv(algorithm, key, iv);
        var hashedData = cipher.update(data, "utf8", "hex");
        hashedData += cipher.final("hex");
        return hashedData;
    },
    unhash: (algorithm, key, iv, data) => {
        var cipher = crypto.createDecipheriv(algorithm, key, iv);
        cipher.setAutoPadding(false);
        var unhashedData = cipher.update(data, "hex", "utf8");
        unhashedData += cipher.final("utf8");
        
        //removing some trash at the end
        for(var i = 0; i < 32; i++){
            var trash = unhashedData.indexOf(String.fromCodePoint(i));
            unhashedData = unhashedData.substring(0, trash != -1 ? trash : unhashedData.length);    
        }
        
        return unhashedData;
    },
};

module.exports = hashingFunctions;