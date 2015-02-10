Number.prototype.toHHMMSS = function () {
    var seconds = Math.floor(this),
    hours = Math.floor(seconds / 3600);
    seconds -= hours*3600;
    var minutes = Math.floor(seconds / 60);
    seconds -= minutes*60;

    if (seconds < 10) {seconds = "0"+seconds;}

    if (hours < 1) {
    	return minutes+':'+seconds;
    } else {
    	if (minutes < 10) {minutes = "0"+minutes;}
    	return hours+':'+minutes+':'+seconds;
    }
};

closePlayer = function() {
    $('.player-container').addClass('hidden');
    $('input').focus();
    soundManager.stopAll();
    Session.set("currentSong", {});
    Router.go('home');
};


// // Spacebar acts as pause/play
$(document).keydown(function(e) {

    if (e.target.type == 'text') {
    } else {
        if (e.keyCode == 32) {
            e.preventDefault();
            var pauseState = Session.get("pauseState");
            
            if (pauseState == "play") {
                Session.set("pauseState", "pause");
            } else {
                Session.set("pauseState", "play");
            }
        }
    }
});


// Spacebar acts as pause/play
$(document).keydown(function(e) {
  
  if (e.keyCode == 27) {
      e.preventDefault();
      closePlayer();
  }
});
