var mongoose = require("mongoose");
var autoIncrement = require("mongoose-auto-increment");

//schemat zamówienia
var orderSchema = new mongoose.Schema({
    products:[{                     //zamówione produkty
        id: {                       //produkt
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        size: String,               //rozmiar
        quantity: Number            //ilość 
    }],
    orderDate: {                    //data zamówienia
        type: Date, 
        default: Date.now()
    },
    status: String,                 //status zamówienia
    shipping: {
        name: String,               //forma dostawy
        cost: Number                //koszt dostawy
    },
    kodoPurchaser: {                //zamawiający, jeżeli z Kodokanu
        type: Number,
        ref: "Customer"
    },
    nonKodoPurchaser: {             //zamawiający, jezeli nie z Kodokanu
        name: String,               //imię
        surname: String,            //nazwisko
        mail: String,               //e-mail
        address: {
            street: String,         //ulica
            number: String,         //nr domu/mieszkania
            zipCode: String,        //kod pocztowy
            city: String            //miasto 
        },
        phone: String               //nr telefonu
    },
    clubPurchaser: {                //zamawiający, jeżeli klub
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    coachPurchaser: {             //zamawiający, jeżeli trener
        type: mongoose.Schema.Types.ObjectId,
        ref: "coach"
    },
    invoice: Buffer,                //faktura
});

autoIncrement.initialize(mongoose.connection);
orderSchema.plugin(autoIncrement.plugin, "Order");

module.exports = mongoose.model("Order", orderSchema);