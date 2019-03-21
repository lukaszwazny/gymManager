var express = require("express");
var router  = express.Router();
var transporter = require("../nodemailer");
var hashingFunctions = require("../hashing/hashFunctions");
var hashKeys = require("../hashing/hashKeys");
var User = require("../models/user");
var Customer = require("../models/customer");
var Event = require("../models/event");
var Card = require("../models/card");
var passport = require("passport");
var months = require("../months");
var packages = require("../packages");
var functions = require("../functions");
var PDFDocument = require("pdfkit");
var path = require("path");

//@route GET /login
//@desc login form
router.get("/login", (req, res) => {
    res.render("customer/login");
});

//@route POST /login
//@desc logging customer
router.post("/login", (req, res, next) => {
    req.body.username = hashingFunctions.hash(hashKeys.mail.algo, hashKeys.mail.key, hashKeys.mail.iv, req.body.username);
    return next();
}, passport.authenticate("local", {
        successRedirect: "/customer/panel",
        failureRedirect: "/",
        failureFlash: true
}), (req, res) => {});

//@route GET /logout
//@desc logging out customer
router.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
});

//@route GET /registerMail
//@desc form for registering mail
router.get("/registerMail", (req, res) => {
    res.render("customer/registerMail");
});

//@route POST /registerMail
//@desc sending mail with registration form
router.post("/registerMail", (req, res) => {
    req.body.email = req.sanitize(req.body.email);
    var mail = hashingFunctions.hash(hashKeys.mail.algo, hashKeys.mail.key, hashKeys.mail.iv, req.body.email);
    User.find({username: mail}, (err, customer) => {
        var exists = false;
        if(customer.length > 0){
            customer.forEach((client) => {
                if (client.role == "customer"){
                    exists = true;
                }    
            })    
        }
        if(exists){
            req.flash("badMail", req.body.email)
            res.redirect("/");
        } else {
            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Server is ready to take our messages');
                    var url = "https://webdevbootcamp-lukaszwazny.c9users.io/customer/register/";
                    url += mail;
                    transporter.sendMail({
                        from: "Klub Sportowy Kodokan <kodokan@mma.gliwice.pl",
                        to: req.body.email,
                        subject: "Dokończ swoją rejestrację w Kodokanie!",
                        text: "Dzięki! Dostaliśmy twoje zgłoszenie. Super, że chcesz dołączyć do Centrum Sztuk Walk! Aby dokończyć swoją rejestrację w naszym systemie, kliknij w ten link: " + url,
                        html: "<h1>Dzięki!</h1><p>Dostaliśmy twoje zgłoszenie. Super, że chcesz dołączyć do Centrum Sztuk Walk!</p><p>Aby dokończyć swoją rejestrację w naszym systemie, kliknij w ten link: <a href=\"" + url + "\">" + url + "</a></p>"
                    }, err => {
                        if(err){
                            console.log(err)
                        }else{
                            req.flash("success", req.body.email);
                            res.redirect("/");
                        }
                    });
                }
            });
        }
    });
});

//@route GET /register
//@desc form for registering whole customer
router.get("/register/:mail", (req, res) => {
    var mail = hashingFunctions.unhash(hashKeys.mail.algo, hashKeys.mail.key, hashKeys.mail.iv, req.params.mail);
    res.render("customer/register", {mail: mail, cryptoMail: req.params.mail, error: req.flash("error")});
});

//@route POST /register
//@desc registering new customer
router.post("/register/:mail", (req, res) => {
    var mail = req.params.mail;
    
    //sanitizer
    req.body.password = req.sanitize(req.body.password);
    req.body.Customer.name = req.sanitize(req.body.Customer.name);
    req.body.Customer.surname = req.sanitize(req.body.Customer.surname);
    req.body.Customer.gender = req.sanitize(req.body.Customer.gender);
    req.body.Customer.birthday = req.sanitize(req.body.Customer.birthday);
    req.body.Customer.phone = req.sanitize(req.body.Customer.phone);
    req.body.address.street = req.sanitize(req.body.address.street);
    req.body.address.number = req.sanitize(req.body.address.number);
    req.body.address.zipCode = req.sanitize(req.body.address.zipCode);
    req.body.address.city = req.sanitize(req.body.address.city);
    
    //hashing
    req.body.Customer.name = hashingFunctions.hash(hashKeys.name.algo, hashKeys.name.key, hashKeys.name.iv, req.body.Customer.name);
    req.body.Customer.surname = hashingFunctions.hash(hashKeys.surname.algo, hashKeys.surname.key, hashKeys.surname.iv, req.body.Customer.surname);
    req.body.Customer.gender = hashingFunctions.hash(hashKeys.gender.algo, hashKeys.gender.key, hashKeys.gender.iv, req.body.Customer.gender);
    //req.body.Customer.birthday = hashingFunctions.hash(hashKeys.birthday.algo, hashKeys.birthday.key, hashKeys.birthday.iv, req.body.Customer.birthday);
    req.body.Customer.phone = hashingFunctions.hash(hashKeys.phone.algo, hashKeys.phone.key, hashKeys.phone.iv, req.body.Customer.phone);
    req.body.address.street = hashingFunctions.hash(hashKeys.street.algo, hashKeys.street.key, hashKeys.street.iv, req.body.address.street);
    req.body.address.number = hashingFunctions.hash(hashKeys.number.algo, hashKeys.number.key, hashKeys.number.iv, req.body.address.number);
    req.body.address.zipCode = hashingFunctions.hash(hashKeys.zipCode.algo, hashKeys.zipCode.key, hashKeys.zipCode.iv, req.body.address.zipCode);
    req.body.address.city = hashingFunctions.hash(hashKeys.city.algo, hashKeys.city.key, hashKeys.city.iv, req.body.address.city);
    
    var newCustomer = req.body.Customer;
    newCustomer.address = req.body.address;
    
    User.register({username: mail}, req.body.password, (err, user) => {
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.body.username = mail;
            passport.authenticate("local")(req, res, () => {
                res.redirect("/customer/addPhoto");
            });
            Customer.create(newCustomer, (err, client) => {
                if (err){
                    console.log(err);
                }else{
                    user.role = "customer";
                    user.customer = client;
                    user.save();
                }
            });
        }
    });
});

//@route GET /addPhoto
//@desc form for adding member photo
router.get("/addPhoto", (req, res) => {
    res.render("customer/addPhoto");
});

//@route UPDATE /addPhoto
//@desc updating member photo
router.post("/addPhoto", (req, res) => {
    console.log(req.user);
    req.body.data = hashingFunctions.hash(hashKeys.image.algo, hashKeys.image.key, hashKeys.image.iv, req.body.data);
    User.findOne({username: req.user.username}).populate("customer").exec((err, user) => {
        if(err){
            console.log(err);
        } else {
        user.customer.image.data = req.body.data;
        user.customer.image.mimetype = req.body.type;
        user.customer.save();
        res.end();
        }
    });
});

//@route GET /addPhoto/capture
//@desc capturing member photo via webcam
router.get("/addPhoto/capture", (req, res) => {
    res.render("customer/photoCapture");
});

//@route GET /addPhoto/upload
//@desc uploading member photo
router.get("/addPhoto/upload", (req, res) => {
    res.render("customer/photoUpload");
});

//@route GET /panel
//@desc customer's panel for administrating his account
router.get("/panel", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
        populate: [
        {
            path: "trainings",
            model: "Training"
        },
        {
            path: "club",
            model: "Club",
            populate: {
                path: "trainings",
                model: "Training"
            }
        }
        ]
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var customerData = functions.basicCustomerPanelInfo(user);
            
            customerData.activePackage = [];
            user.customer.packages.forEach(package => {
                if(package.active){
                    customerData.activePackage.push(package);
                }
            });
            customerData.activePackage.forEach((package, i) => {
                var endDate = functions.addDays(package.purchaseDate, (package.timeLimit - 1));
                customerData.activePackage[i].endDate = functions.dateModify(endDate);     
            });
            
            customerData.training = {};
            //customerData.training.upcoming = user.customer.club.trainings.find((training) => {return training.trainingDate > Date.now()});
            customerData.training.last     = user.customer.trainings[user.customer.trainings.length - 1];
            
            customerData.club = {};
            //customerData.club.mail = user.customer.club.mail;
            
            var fiveEvents = [];
            Event.find({startDate: {$gt: Date.now()}}, (err, events) => {
                if(err){
                    console.log(err);
                } else {
                    fiveEvents = events.slice(0,5);    
                }
            })
            
            res.render("customer/panel", {customer: customerData, upcomingEvents: fiveEvents});
        }
    });
});

//@route GET /profile
//@desc showing profile of customer
router.get("/profile", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var customerData = functions.basicCustomerPanelInfo(user);customerData.gender = hashingFunctions.unhash(hashKeys.gender.algo, hashKeys.gender.key, hashKeys.gender.iv, user.customer.gender);
            
            customerData.phone = hashingFunctions.unhash(hashKeys.phone.algo, hashKeys.phone.key, hashKeys.phone.iv, user.customer.phone);
            customerData.address = {};
            customerData.address.street = hashingFunctions.unhash(hashKeys.street.algo, hashKeys.street.key, hashKeys.street.iv, user.customer.address.street);
            customerData.address.number = hashingFunctions.unhash(hashKeys.number.algo, hashKeys.number.key, hashKeys.number.iv, user.customer.address.number);
            customerData.address.zipCode = hashingFunctions.unhash(hashKeys.zipCode.algo, hashKeys.zipCode.key, hashKeys.zipCode.iv, user.customer.address.zipCode);
            customerData.address.city = hashingFunctions.unhash(hashKeys.city.algo, hashKeys.city.key, hashKeys.city.iv, user.customer.address.city);
            customerData.address = "ul. " + customerData.address.street + " " + customerData.address.number + ", " + customerData.address.zipCode + " " + customerData.address.city;
            customerData.birthday = functions.dateModify(user.customer.birthday);
            
            res.render("customer/profile", {customer: customerData});
        }
    });
});

//@route GET /profile/edit
//@desc editing customer's data
router.get("/profile/edit", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var customerData = functions.basicCustomerPanelInfo(user);customerData.gender = hashingFunctions.unhash(hashKeys.gender.algo, hashKeys.gender.key, hashKeys.gender.iv, user.customer.gender);
            
            customerData.phone = hashingFunctions.unhash(hashKeys.phone.algo, hashKeys.phone.key, hashKeys.phone.iv, user.customer.phone);
            customerData.address = {};
            customerData.address.street = hashingFunctions.unhash(hashKeys.street.algo, hashKeys.street.key, hashKeys.street.iv, user.customer.address.street);
            customerData.address.number = hashingFunctions.unhash(hashKeys.number.algo, hashKeys.number.key, hashKeys.number.iv, user.customer.address.number);
            customerData.address.zipCode = hashingFunctions.unhash(hashKeys.zipCode.algo, hashKeys.zipCode.key, hashKeys.zipCode.iv, user.customer.address.zipCode);
            customerData.address.city = hashingFunctions.unhash(hashKeys.city.algo, hashKeys.city.key, hashKeys.city.iv, user.customer.address.city);
            customerData.birthday = user.customer.birthday.getFullYear() + "-" + ("0" + (user.customer.birthday.getMonth() + 1)).slice(-2) + "-" + ("0" + (user.customer.birthday.getDate())).slice(-2);
            
            res.render("customer/profileEdit", {customer: customerData});
        }
    });
});

//@route PUT /
//@desc update customer's data
router.put("/", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            //sanitizer
            req.body.Customer.name = req.sanitize(req.body.Customer.name);
            req.body.Customer.surname = req.sanitize(req.body.Customer.surname);
            req.body.Customer.gender = req.sanitize(req.body.Customer.gender);
            req.body.Customer.birthday = req.sanitize(req.body.Customer.birthday);
            req.body.Customer.phone = req.sanitize(req.body.Customer.phone);
            req.body.address.street = req.sanitize(req.body.address.street);
            req.body.address.number = req.sanitize(req.body.address.number);
            req.body.address.zipCode = req.sanitize(req.body.address.zipCode);
            req.body.address.city = req.sanitize(req.body.address.city);
            
            //hashing
            req.body.Customer.name = hashingFunctions.hash(hashKeys.name.algo, hashKeys.name.key, hashKeys.name.iv, req.body.Customer.name);
            req.body.Customer.surname = hashingFunctions.hash(hashKeys.surname.algo, hashKeys.surname.key, hashKeys.surname.iv, req.body.Customer.surname);
            req.body.Customer.gender = hashingFunctions.hash(hashKeys.gender.algo, hashKeys.gender.key, hashKeys.gender.iv, req.body.Customer.gender);
            req.body.Customer.phone = hashingFunctions.hash(hashKeys.phone.algo, hashKeys.phone.key, hashKeys.phone.iv, req.body.Customer.phone);
            req.body.address.street = hashingFunctions.hash(hashKeys.street.algo, hashKeys.street.key, hashKeys.street.iv, req.body.address.street);
            req.body.address.number = hashingFunctions.hash(hashKeys.number.algo, hashKeys.number.key, hashKeys.number.iv, req.body.address.number);
            req.body.address.zipCode = hashingFunctions.hash(hashKeys.zipCode.algo, hashKeys.zipCode.key, hashKeys.zipCode.iv, req.body.address.zipCode);
            req.body.address.city = hashingFunctions.hash(hashKeys.city.algo, hashKeys.city.key, hashKeys.city.iv, req.body.address.city);
                    
            var updatedCustomer = req.body.Customer;
            updatedCustomer.address = req.body.address;
            
            Object.assign(user.customer, updatedCustomer);
            user.customer.save();
            
            res.redirect("/customer/profile");
        }
    });
});

//@route GET /package/buy
//@desc form for buying package
router.get("/package/buy", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var customerData = functions.basicCustomerPanelInfo(user);
            
            res.render("customer/buyPackage", {customer: customerData});
        }
    });
});

//@route POST /package/buy
//@desc adding new package
router.post("/package/buy", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            
            var packageBought = packages[req.body.package];
            packageBought.purchaseDate = req.body.purchaseDate;
            packageBought.active = true;
            
            user.customer.packages.push(packageBought);
            
            user.customer.save();
            
            res.redirect("/customer/panel");
        }
    });
});

//@route GET /package/active
//@desc showing active packages
router.get("/package/active", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var customerData = functions.basicCustomerPanelInfo(user);
            
            customerData.activePackage = [];
            user.customer.packages.forEach(package => {
                if(package.active){
                    customerData.activePackage.push(package);
                }
            });
            customerData.activePackage.forEach((package, i) => {
                var endDate = functions.addDays(package.purchaseDate, (package.timeLimit - 1));
                customerData.activePackage[i].endDate = functions.dateModify(endDate);
            });
            
            res.render("customer/activePackage", {customer: customerData});
        }
    });
});

//@route GET /package
//@desc showing packages history
router.get("/package", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var customerData = functions.basicCustomerPanelInfo(user);
            
            customerData.packages = user.customer.packages;
            customerData.packages.forEach((package, i) => {
                var endDate = package.purchaseDate.addDays(package.timeLimit - 1);
                customerData.packages[i].endDate = functions.dateModify(endDate);
                customerData.packages[i].startDate = functions.dateModify(package.purchaseDate);
            });
            
            res.render("customer/packagesHistory", {customer: customerData});
        }
    });
});

//@route GET /formalities
//@desc showing status of id card and membership declaration
router.get("/formalities", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
        populate: {
            path: "card",
            model: "Card"
        }
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var customerData = functions.basicCustomerPanelInfo(user);
            
            customerData.declarationStatus = user.customer.declaration;
            customerData.card = {};
            if(typeof user.customer.card != "undefined") {
                customerData.card.orderDate = user.customer.card.orderDate;
                customerData.card.status = user.customer.card.status;
            }
            
            res.render("customer/formalities", {customer: customerData});
        }
    });
});

//@route GET /declarationPrint
//@desc printing membership declaration
router.get("/declarationPrint", (req, res) => {
    User.findOne({username: req.user.username})
    .populate({
        path: "customer",
        model: "Customer",
    }).exec((err, user) => {
        if(err){
            console.log(err);
        } else {
            var name = hashingFunctions.unhash(hashKeys.name.algo, hashKeys.name.key, hashKeys.name.iv, user.customer.name);
            var surname = hashingFunctions.unhash(hashKeys.surname.algo, hashKeys.surname.key, hashKeys.surname.iv, user.customer.surname);
            var image = hashingFunctions.unhash(hashKeys.image.algo, hashKeys.image.key, hashKeys.image.iv, user.customer.image.data);
            var phone = hashingFunctions.unhash(hashKeys.phone.algo, hashKeys.phone.key, hashKeys.phone.iv, user.customer.phone);
            var address = {};
            address.street = hashingFunctions.unhash(hashKeys.street.algo, hashKeys.street.key, hashKeys.street.iv, user.customer.address.street);
            address.number = hashingFunctions.unhash(hashKeys.number.algo, hashKeys.number.key, hashKeys.number.iv, user.customer.address.number);
            address.zipCode = hashingFunctions.unhash(hashKeys.zipCode.algo, hashKeys.zipCode.key, hashKeys.zipCode.iv, user.customer.address.zipCode);
            address.city = hashingFunctions.unhash(hashKeys.city.algo, hashKeys.city.key, hashKeys.city.iv, user.customer.address.city);
            address = "ul. " + address.street + " " + address.number + ", " + address.zipCode + " " + address.city;
            var birthday = functions.dateModify(user.customer.birthday);
            var mail = hashingFunctions.unhash(hashKeys.mail.algo, hashKeys.mail.key, hashKeys.mail.iv, user.username);
            var nowDate = functions.dateModify(new Date(Date.now()));
            var id = user.customer._id;
            
            res.writeHead( 200, {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename=deklaracja_czlonkowska_kskodokan_' + functions.removeDiacritics(name) + '_' + functions.removeDiacritics(surname) + '.pdf'
            } );
            
            let doc = new PDFDocument( {
                size: 'A4',
                margin: 50,
                Title: "Deklaracja członkowska K.S \"Kodokan\" - " + name + " " + surname,
                Author: "Klub Sportowy Kodokan"
            } );
            
            doc.pipe( res );
            
            //czarna ramka
            doc.rect(30, 35, 535, 772).stroke();
            
            doc.fontSize( 12 );
            
            doc.font(path.join(__dirname, "../public/fonts/forPDF/Roboto-Regular.ttf")).text( 'Łukasz Ważny', 10, 30, {
                align: 'center',
                width: 200
            } );
            
            functions.autoprint(doc);
            
            doc.end();
        }
    });
});



module.exports = router;