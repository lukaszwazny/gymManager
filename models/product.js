var mongoose = require("mongoose");

//schemat produktów na sprzedaż
var productSchema = new mongoose.Schema({
    name: String,                       //nazwa produktu
    category: String,                   //kategoria produtku
    price: Number,                      //cena produktu
    description: String,                //opis produktu
    sizes: [{                           //rozmiarówka
        size: String,                   //rozmiar
        quantity: Number,               //ilość produktów, w danym rozmiarze, w magazynie głównym
    }],
    images: [{                          //zdjęcia produktu
        data: Buffer,                   //dane zdjęcia
        mimetype: String                //typ zdjęcia
    }]
});

module.exports = mongoose.model("Product", productSchema);