var mongoose                = require("mongoose");

//schemat pojedynczego treningu
var trainingSchema = new mongoose.Schema({
    trainingType: String,                //jaka grupa/typ treningu, należy sprecyzować możliwe opcje wyboru w formularzu
    trainingDate: Date,                  //data przeprowadzenia treningu
    coach: {                            //trener prowadzący trening
        type: mongoose.Schema.Types.ObjectId,
        ref: "Coach"
    },
    club: {                             //w jakim klubie odbył się trening
        type: mongoose.Schema.Types.ObjectId,
        ref: "Club"
    },
    hall: {                             //na jakiej sali odbył się trening
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hall"
    },
    participants: [{                    //uczestnicy treningu
        type: Number,
        ref: "Customer"
    }]
});

module.exports = mongoose.model("Training", trainingSchema);