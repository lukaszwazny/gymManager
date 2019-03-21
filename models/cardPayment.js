var mongoose = require("mongoose");

//schemat płatności za karty członkowskie
var cardPaymentSchema = new mongoose.Schema({
    cards: [{                           //karty do opłacenia
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }],
    amount: Number,                     //wartość płatności
    invoice: {type: String, required: true},        //faktura
    status: String                      //stan płatności (opłacona, nieopłacona)
});

module.exports = mongoose.model("CardPayment", cardPaymentSchema);