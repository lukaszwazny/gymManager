$("#back").hide();
$(".login").on("click", () => {
    $("#content-change").animate({opacity: 0}, () => {
        $("#content-change").load("/customer/login", () =>{
            scalingButtons();
            $(".login").fadeOut();
            $("#back").fadeIn();
            $("#content-change").animate({opacity: 1});
        });    
    });
});

$("#back").on("click", () => {
    $("#content-change").animate({opacity: 0}, () => {
        $("#content-change").load("/landingPage/firstDiv", () =>{
            scalingButtons();
            $("#back").fadeOut();
            $(".login").fadeIn();
            $("#content-change").animate({opacity: 1});
            onRegister();
        });    
    });
});

function onRegister(){
$("#register").on("click", () => {
    $("#content-change").animate({opacity: 0}, () => {
        $("#content-change").load("/customer/registerMail", () =>{
            scalingButtons();
            $("#back").fadeIn();
            $(".login").fadeOut();
            $("#content-change").animate({opacity: 1});
        });    
    });
});
}

onRegister();