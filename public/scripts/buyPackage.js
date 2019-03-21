$(document).ready( function() {
    var today = new Date(Date.now());
    $('#date').val(today.toJSON().slice(0,10));
    
    $("input[name=package]").on("change", obj => {
        var ID = "#" + obj.target.id;
        $("div").find(ID).addClass("checked"); 
        $("input[name=package]").not(obj.target).trigger('deselect');
    })
    
    $("input[name=package]").on("deselect", obj => {
        var ID = "#" + obj.target.id;
        $("div").find(ID).removeClass("checked"); 
    })
});
