 var nodemailer          = require("nodemailer");
 
 //konfiguracja wysyłania maili
 var transporter = nodemailer.createTransport({
    host: "poczta.anet.pl",
    port: 465,
    secure: true,
    auth: {
        user: "kodokan@mma.gliwice.pl",//process.env.MAILLOGIN
        pass: "angrykurczak220"//process.env.MAILPASS
    },
 });
 
 module.exports = transporter;