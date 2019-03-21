function getUserMedia(options, successCallback, failureCallback) {
  var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
  if (api) {
    return api.bind(navigator)(options, successCallback, failureCallback);
  }
}

var theStream;

function getStream (type) {
    $(".crop").fadeIn();
    $(".turn-on").fadeOut();
    $(".capture").fadeIn();
  if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
    !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
    alert('Funkcja nie wspierana przez twoją przeglądarkę.');
    return;
  }

  var constraints = {};
  constraints[type] = {facingMode: "user"};
  getUserMedia(constraints, function (stream) {
    var mediaControl = document.querySelector(type);
    
    if ('srcObject' in mediaControl) {
      mediaControl.srcObject = stream;
      mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
    } else if (navigator.mozGetUserMedia) {
      mediaControl.mozSrcObject = stream;
    }
    
    theStream = stream;
  }, function (err) {
    alert('Error: ' + err);
  });
}

$(".crop").hide();
$(".capture").hide();
$("#taken").hide();

var canvas = document.querySelector("canvas");
var ctx = canvas.getContext("2d");
function takePhoto() {
  if (!('ImageCapture' in window)) {
    alert('Nie da się zrobić zdjęcia');
    return;
  }
  
  if (!theStream) {
    alert('Najpierw włącz kamerę!');
    return;
  }
  
  var theImageCapturer = new ImageCapture(theStream.getVideoTracks()[0]);

  theImageCapturer.grabFrame()
    .then(blob => {
        ctx.drawImage(blob, (blob.width - canvas.width)/2, (blob.height - canvas.height)/2, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    })
    .catch(err => alert('Error: ' + err));
    $("canvas").fadeIn();
    $(".capture").fadeOut();
    $("#taken").fadeIn();
}

function again(){
    $(".capture").fadeIn();
    $("#taken").fadeOut();
    $("canvas").fadeOut();
}

var bool = false;
function send(){
  // select canvas element
    var destCanvas = document.getElementById("c");

    //copy canvas by DataUrl
    var sourceImageData = canvas.toDataURL();
    var destCanvasContext = destCanvas.getContext('2d');

    var destinationImage = new Image;
    destinationImage.onload = () => {
      if(!bool){
        bool = true;
        destCanvasContext.translate(destCanvas.width, 0);
        destCanvasContext.scale(-1,1);
      }
      destCanvasContext.drawImage(destinationImage,0,0); 
    };
    destinationImage.src = sourceImageData;
  
  setTimeout(() => {
    var imgData = destCanvas.toDataURL();
    var formData = {
      data: imgData,
      type: "image/png"
    };
    var error = false;
    $.ajax({
      type: 'POST',
      url: '/customer/addPhoto',
      data: formData,
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
  });  
}
