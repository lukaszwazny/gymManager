var express = require("express");
var router  = express.Router();


//@route GET /
//@desc landing page
router.get("/", (req, res) => {
    res.render("landingPage/main", {mail: req.flash("success"), badMail: req.flash("badMail"), loginFailure: req.flash("error")});
});

//@route GET /landingPage/firstDiv
//@desc first div's content on landing page
router.get("/landingPage/firstDiv", (req,res) =>{
    res.render("landingPage/firstDiv")    
});


module.exports = router;