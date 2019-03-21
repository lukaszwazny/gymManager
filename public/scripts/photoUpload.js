$("button").hide();


//przeciągnij i upuść
var dropbox = document.querySelector("main");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("dragleave", dragleave, false);
dropbox.addEventListener("drop", drop, false);

var bool = true;
function dragleave(e){
    $("main").css("border", "none");
    $("main").height($("main").height() + 8);
    bool = true;
}

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
    if(bool){
        $("main").css("border-radius", "40px");  
        $("main").css("border", "4px dashed #ffbf00");
        $("main").height($("main").height() - 8); 
        bool = false;
    }
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
    $("main").css("border", "none");
    $("main").height($("main").height() + 8);
    bool = true;
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

//wgrywanie zdjęcia
function handleFiles (files){
    var file = files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener("load", () => {
        $("#img").attr("src", reader.result);
        $("#image").css("height", "80vh");
        $("#image").css("max-width", "100vw");
        $("button").show();
        croping();
    });
    $("#upload").hide();
    $("#dropbox").css("padding-top", "5vh");
}

//przycinanie
function croping (){
    const image = document.querySelector('#img');
    const cropper = new Cropper(image, {
      aspectRatio: 373 / 480,
      autoCropArea: 1
    }); 
    
    //wysyłanie na serwer
    $(".send").on("click", () => {
        var croppedImg = cropper.getCroppedCanvas().toDataURL();
        var formData = {
          data: croppedImg,
          type: "image/png"
        };
        var error = false;
        $.ajax({
          type: 'POST',
          url: '/customer/addPhoto',
          data: formData
        })
        .fail(() => {
            $("main").prepend(
            "<div class=\"alert alert-danger\" role=\"alert\">" +
            "Błąd! Sprawdź czy na pewno jesteś zalogowany." +
            "</div>");
            error = true;
        })
        .done(() => {
            if(!error){
                console.log("hej");
                window.location.href = "/customer/panel";
            }    
        });
    })
}

