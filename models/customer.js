var mongoose                = require("mongoose");
var autoIncrement           = require("mongoose-auto-increment");

//wzór challenga
var challenge = new mongoose.Schema({              
        name: String,                   //nazwa
        description: String,            //opis challenga
        success: Boolean,               //czy się udał
        points: Number,                 //liczba pkt za challenge
        startDate: Date,                //kiedy się zaczął
        endDate: Date                   //kiedy koniec
    });

//schemat klienta klubu
var customerSchema = new mongoose.Schema({
    name: String,               //imię
    surname: String,            //nazwisko
    gender: String,             //płeć
    phone: String,              //nr telefonu
    image: {                    //zdjęcie twarzy klienta
        data: String,           //binarne dane zdjęcia
        mimetype: String        //typ pliku
    },
    card: {                     //karta członkowska
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    },
    cardNumber: String,         //nr unique id na karcie członkowskiej
    address: {                  //adres korespondencji
        street: String,         //ulica
        number: String,         //nr domu/mieszkania
        zipCode: String,        //kod pocztowy
        city: String            //miasto       
    },
    birthday: Date,             //data urodzenia
    joinDate: {                 //data dołączenia do klubu
        type: Date, 
        default: Date.now
    },
    trainingDiscount: Number,   //zniżka na karnety do trenowania, ułamek, <0;1>
    productDiscount: Number,    //zniżka na produkty ze sklepu, ułamek, <0;1>
    points: Number,             //punkty w programie lojalnościowym
    club: {                     //klub, do którego klient jest przypisany
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    packages: [{                //karnety wykupione przez klienta
        name: String,           //nazwa karnetu
        price: Number,          //cena
        description: String,    //opis karnetu
        timeLimit: Number,      //ograniczenie czasowe, jednostka - dni,     0 - nielimitowane
        entrancesLeft: Number,  //ile wejść zostało,    jednostka - wejście, 0 - nielimitowane
        purchaseDate: Date,     //data zakupu
        active: Boolean,        //czy aktywny?
    }],
    challenges: [challenge],    //wykonane challenge
    activeChallenge: challenge, //aktywny challenge
    family: {                   //rodzina
        father: {               //ojciec
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        },
        mother: {               //matka
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        },
        partner: {              //małżonek
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        },
        children: [{            //dzieci
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer"
        }],
        kdr: Boolean            //czy posiada kartę dużej rodziny
    },
    active: Boolean,            //czy klient jest aktywny
    degrees: {                  //stopnie klienta (jeszcze do zrobienia)
    },
    events:[{                   //wydarzenia, w których klient brał udział bądź będzie brał udział
        id: {                   //wydarzenie
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        },
        certificate: Buffer     //certyfikat
    }],
    trainings: [{               //treningi, w których klient brał udział
        type: mongoose.Schema.Types.ObjectId,
        ref: "Training"
    }],
    orders: [{                  //zamówienia klienta
        type: Number,
        ref: "Order"
    }],
    declaration: Boolean,       //czy klient oddał deklarację członkowską
});

autoIncrement.initialize(mongoose.connection);
customerSchema.plugin(autoIncrement.plugin, "Customer");

module.exports = mongoose.model("Customer", customerSchema);