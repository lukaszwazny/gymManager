function scalingButtons (){
        if($(window).width() <= 500){
                $('button').removeClass('btn-lg');
        }
        
        if($(window).width() <= 400){
                $('button').addClass('btn-sm');
        }
}

scalingButtons();