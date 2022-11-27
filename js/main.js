/* volumeslider = document.getElementByQuerySele("volumeslider"); */

/* 
volumeslider.addEventListener('click', function(){
  let vol = this.value
  audio.volume = vol
} ) */

function play_user_sound(clicked_id){
  audio = new Audio("uploads/" + clicked_id + ".mp3");
  audio.play()
}