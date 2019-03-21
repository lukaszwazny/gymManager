$(".nav-tabs li").on("click", (event) => {
    $(event.currentTarget.parentElement.children).removeClass("active");
    $(event.currentTarget).addClass("active");
});

$('.textarea').wysihtml5();