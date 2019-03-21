var mongoose = require("mongoose");

//schemat pojedynczego eventu
var eventSchema = new mongoose.Schema({
    organizer: {                        //organizator eventu
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach" | "Club"
    },
    name: String,                       //nazwa eventu
    startDate: Date,                    //data i godzina rozpoczęcia
    endDate: Date,                      //data i godzina zakończenia
    facebookLink: String,               //link do wydarzenia na Facebooku
    kodokanPlace: {                     //miejsce eventu, jeżeli w Kodokanie
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall"
    },
    noKodokanPlace: {                   //miejsce eventu, jeżeli nie w Kodokanie
        street: String,                 //ulica
        number: String,                 //nr domu/mieszkania
        zipCode: String,                //kod pocztowy
        city: String                    //miasto       
    },
    cost: [{                            //koszty eventu (ceny za wejście)
        forKodo: Number,                //dla aktywnych członków Kodokanu
        forNonKodo: Number,             //dla tych spoza Kodokanu
        paymentDate: Date               //deadline płatności
    }],
    kodoParticipants: [{                //uczestnicy z Kodokanu
        type: Number,
        ref: "Customer"
    }],
    nonKodoParticipants: [{             //uczestnicy spoza Kodokanu
        name: String,                   //imię
        surname: String,                //nazwisko
        mail: String,                   //e-mail
        club: String                    //z jakiego jest klubu
    }],
    description: String,                //opis eventu
    approved: Boolean                   //czy event jest zatwierdzony
});

module.exports = mongoose.model("Event", eventSchema);