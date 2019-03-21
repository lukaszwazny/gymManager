var mongoose                = require("mongoose");

//wzór treningu
var training = new mongoose.Schema({
    trainingType: String,           //jaka grupa/typ treningu, należy sprecyzować możliwe opcje wyboru w formularzu
    startTime: {                    //godzina rozpoczęcia
        minute: Number,
        hour: Number
    },
    duration: Number,               //czas trwania [w minutach]
    coach: {                        //trener prowadzący trening
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach"
    },
    hall: {                         //na jakiej sali odbywa się trening
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall"
    }
});

//wzór produktu na sprzedaż w pojedynczym klubie
var productLocal = new mongoose.Schema({
    name: String,                       //nazwa produktu
    category: String,                   //kategoria produtku
    price: Number,                      //cena produktu
    sizes: [{                           //rozmiarówka
        size: String,                   //rozmiar
        quantity: Number,               //ilość produktów, w danym rozmiarze, w magazynie głównym
    }],
});

//wzór pojedynczego zamówienia złożonego lokalnie w klubie
var order = new mongoose.Schema({
    products: [{                    //zamówione produkty
        product: productLocal,      //dane produktu        
        size: String,               //rozmiar
        quantity: Number            //ilość
    }],
    orderDate: {                    //data zamówienia
        type: Date,
        default: Date.now()
    },
    kodoPurchaser: {                //zamawiający, jeżeli z Kodokanu
        type: Number,
        ref: "Customer"
    },
    seller: {                       //kto sprzedał
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receptionist"
    }
});

//schemat pojedynczego klubu
var kodokanSchema = new mongoose.Schema({
    mail: String,                       //e-mail klubowy
    phone: String,                      //nr kontaktowy telefonu
    description: String,                //opis klubu
    address: {                          //adres klubu
        street: String,                 //ulica
        number: String,                 //nr domu/mieszkania
        zipCode: String,                //kod pocztowy
        city: String                    //miasto  
    },
    name: String,                       //imię właściciela klubu
    surname: String,                    //nazwisko właściciela klubu
    coaches: [{                         //trenerzy
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach"
    }],
    customers: [{                       //klienci, przypisani do klubu
        type: Number,
        ref: "Customer"
    }],
    events: [{                          //wydarzenia, które odbyły się bądź odbędą się w tym klubie
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    halls: [{                           //sale, które znajdują się w klubie
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall"
    }],
    receptionists: [{                   //recepcjoniści
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receptionist"
    }],
    trainings: [{                       //przeprowadzone i nadchodzące treningi w danym klubie
        type: mongoose.Schema.Types.ObjectId,
        ref: "Training"
    }],
    schedule: {                         //plan zajęć
        mon:[training],                 //poniedziałek
        tue:[training],                 //wtorek
        wen:[training],                 //środa
        thu:[training],                 //czwartek
        fri:[training],                 //piątek
        sat:[training]                  //sobota
    },
    magazine: [productLocal],           //ilość produktów na sprzedaż w klubie        
    orders: [order],                    //zamówienia złożone lokalnie w klubie
    active: Boolean,                    //czy klub jest aktywny
    contribution: {                     //składka jaką klub zobowiązany jest płacić
        amount: Number,                 //wysokość składki [zł]
        period: Number                  //okres rozliczeniowy [w miesiącach]
    }
});

module.exports = mongoose.model("Club", kodokanSchema);