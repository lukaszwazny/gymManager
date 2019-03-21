var mongoose = require("mongoose");

//schemat pojedynczej sali treningowej
var hallSchema = new mongoose.Schema({
    name: String,                   //nazwa salki
    club: {                         //klub, w którym znajduje się sala
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    image: {                        //zdjęcie sali
        data: Buffer,
        mimetype: String
    },
    description: String             //opis sali
});

module.exports = mongoose.model("Hall", hallSchema)