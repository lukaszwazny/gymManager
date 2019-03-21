var mongoose            = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

//schemat użytkownika
var userSchema = new mongoose.Schema({
    username: String,           //e-mail, pełniący funckję loginu
    password: String,           //hasło
    role: String,               //rola użytkownika - admin: admin, klient: customer, wyrabiacz kart członkowskich: cardCompany, szef klubu: club, trener: coach, recepcjonista: receptionist
    club: {                     //dane klubu, jeżeli użytkownik to szef klubu
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    coach: {                    //dane trenera, jeżeli użytkownik to trener
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach"
    },
    customer: {                 //dane klienta, jeżeli użytkownik to klient
        type: Number,
        ref: "Customer"
    },
    receptionist: {             //dane recepcjonisty, jeżeli użytkownik to recepcjonista
        type: mongoose.Schema.Types.ObjectId,
        ref: "Receptionist"
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);