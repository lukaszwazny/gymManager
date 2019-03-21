var express             = require("express"),
    app                 = express(),
    mongoose            = require("mongoose"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    flash               = require("connect-flash"),
    methodOverride      = require("method-override"),
    bodyParser          = require("body-parser"),
    expressSanitizer    = require("express-sanitizer"),
    autoIncrement       = require("mongoose-auto-increment");
    
//modele
var User                = require("./models/user");
var Customer            = require("./models/customer");
var Club                = require("./models/club");
var Training            = require("./models/training");
//var Package             = require("./models/package");
    
//routes
var indexRoutes         = require("./routes/index"),
    customerRoutes      = require("./routes/customer");


//połączenie z bazą danych
var url = process.env.DATABASEURL || "mongodb://localhost:27017/kodokan";
mongoose.connect(url, {useNewUrlParser: true}, (err) => {
    if(err){
        console.log(err);
    }else{
        console.log("Connected to database!");
        //User.findOneAndDelete({username: "63a9058684834585c0c1ee91c5a18adc380d5dd4ac9c9425d38e36d6381efcb0"}, (err) =>{console.log(err)});
        //Customer.deleteMany({name: "a664dc0846c2c8dfe8a9be9131e38e03"}, err => console.log(err));
    }
});

//konfiguracja aplikacji
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(require("express-session")({
    secret: "KsKodokan! Wszystkie sztuki i sporty walki przenikają się nawzajem! Wszystko w jednym miejscu i za jedną cenę!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(expressSanitizer());
app.use(methodOverride("_method"));

//konfiguracja passport local strategy
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
app.use(indexRoutes);
app.use("/customer", customerRoutes);


app.listen(process.env.PORT, process.env.IP, () => {
    console.log("Server started!!");
});