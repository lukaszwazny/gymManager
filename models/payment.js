var mongoose = require("mongoose");

//schemat pojedynczej płatności, którą musimy wykonać
var paymentSchema = new mongoose.Schema({
    receiverClub: {                     //odbiorca płatności, jeżeli klub
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    receiverCoach: {                    //odbiorca płatności, jeżeli trener
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach"
    },
    amount: Number,                     //wartość płatności
    invoice: Buffer,                    //faktura
    status: String,                     //stan płatności (opłacona, nieopłacona)
    description: String,                //opis płatności
});

module.exports = mongoose.model("Payment", paymentSchema);