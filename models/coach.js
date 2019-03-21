var mongoose                = require("mongoose");

//schemat trenera 
var coachSchema = new mongoose.Schema({
    name: String,                       //imię delikwenta
    surname: String,                    //nazwisko
    image: {                            //zdjęcie trenera
        data: Buffer,
        mimetype: String
    },
    address: {                          //adres korespondencji
        street: String,                 //ulica
        number: String,                 //nr domu/mieszkania
        zipCode: String,                //kod pocztowy
        city: String                    //miasto       
    },
    description: String,                //opis trenera z uwzględnieniem osiągnięć i uprawnień
    trainings: [{                       //treningi przeprowadzone przez trenera
        type: mongoose.Schema.Types.ObjectId,
        ref: "Training"
    }],
    club: {                             //klub, w którym trener pracuje
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    orders: [{                          //zamówienia produktów dokonane przez trenera
        type: Number,
        ref: "Order"
    }],
    organisedEvents: [{                 //zorganizowane przez trenera eventy
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    participatedEvents: [{              //eventy, w których trener brał udział
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    deegres: {                          //stopnie trenera (do zrobienia)
        
    },
    fired: Boolean                      //czy trener jest zwolniony
});

module.exports = mongoose.model("Coach", coachSchema);