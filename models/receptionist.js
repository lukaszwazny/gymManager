var mongoose = require("mongoose");

//schemat recepcjonisty
var receptionistSchema = new mongoose.Schema({
    name: String,                       //imię
    surname: String,                    //nazwisko
    phone: String,                      //nr telefonu
    club: {                             //klub, w którym recepcjonista pracuje
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    workDays: [{                        //dni pracy
        startTime: Date,                //rozpoczęcie pracy
        endTime: Date                   //zakończenie pracy
    }],
    fired: Boolean                      //czy pracownik jest zwolniony
});

module.exports = mongoose.model("Receptionist", receptionistSchema);