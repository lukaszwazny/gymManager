$('#password, #password-confirm').on('keyup', function () {
  if ($('#password').val() == $('#password-confirm').val()) {
    $('#message').html('Hasła się zgadzają!').addClass('password-match').removeClass('password-not-match');
  } else {
    $('#message').html('Hasła się nie zgadzają!').addClass('password-not-match').removeClass('password-match');
}
});


//progress bar

//czy widać więcej niż połowę elementu
function isInViewport(elem) {
  let elemTop = elem.offsetTop;
  let elemBottom = elemTop + elem.offsetHeight;
  let viewportTop = window.scrollY;
  let viewportBottom = viewportTop + window.innerHeight;
  let half = viewportTop + (window.innerHeight / 2);
  return elemBottom > half && elemTop < half;
};

var divs = ["#first", "#third", "#fourth", "#fifth", "#sixth"];
$(window).on("resize scroll", () => {
  divs.forEach((div, i, list) => {
    if(isInViewport(document.querySelector(div))){
      //active
      $(".progress .circle:nth-of-type(" + (i + 1) + ")").removeClass("done").addClass("active");
      $('.progress .circle:nth-of-type(' + (i + 1) + ') .label').html(i + 1);
      $('.progress .bar:nth-of-type(' + (i + 1) + ')').removeClass("done").removeClass("active").addClass('active-after');
      $('.progress .bar:nth-of-type(' + (i) + ')').removeClass("done").removeClass("active-after").addClass('active');
      
      //previous circles
      for(var j = 0; j < i; j++){
        $('.progress .circle:nth-of-type(' + (j + 1) + ')').removeClass('active').addClass('done'); 
        $('.progress .circle:nth-of-type(' + (j + 1) + ') .label').html('&#10003;');
      }
      
      //previous bars
      for(var j = 0; j < i - 1; j++){
        $('.progress .bar:nth-of-type(' + (j + 1) + ')').removeClass("active").removeClass("active-after").addClass('done');
        console.log(j);
      }
      
      //next circles
      for (var j = i + 1; j < list.length; j++){
        $('.progress .circle:nth-of-type(' + (j + 1) + ')').removeClass('active').removeClass('done');
        $('.progress .circle:nth-of-type(' + (j + 1) + ') .label').html(j + 1);
      }
      
      //next bars
      for(var j = i + 1; j < list.length - 1; j++){
        $('.progress .bar:nth-of-type(' + (j + 1) + ')').removeClass('active').removeClass('active-after').removeClass('done');  
      }
    }  
  });
});

//pierwszy div
$(".progress .circle:nth-of-type(1)").addClass("active");
$('.progress .bar:nth-of-type(1)').addClass('active-after');