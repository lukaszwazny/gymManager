var mongoose = require("mongoose");

//schemat karty członkowskiej
var cardSchema = new mongoose.Schema({
    customer: {                         //czyja karta
        type: Number,
        ref: "Customer"
    },
    status: String,                     //na jakim etapie wyrabiania jest karta (zamówiona, wyrobiona, wysłana, potwierdzono odbiór, opłacona)
    orderDate: {type: Date, default: Date.now}  //data zamówienia karty
});

module.exports = mongoose.model("Card", cardSchema);