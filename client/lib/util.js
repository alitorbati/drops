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


hideModal = function() {
    $('#modal-comments').addClass('hidden');
    $('#modal-overlay').addClass('hidden');
    $('#modal').addClass('hidden');
    $('.player-comments').removeClass('open');
    Session.set("isModalOpen", false);

    // clear comment form 
    $('#add-comment textarea').val("");

    var route = Session.get("previousRoute");
    //Router.go(route);
    // TODO: change routing to include the sub
    Router.go('home');
};

showModal = function(songId) {
    
    var route = Router.current();
    Session.set("previousRoute", route.route._path);
    Session.set("isModalOpen", true);

    Router.go('/songs/'+ songId);

    $('#modal').removeClass('hidden');
    $('#modal-comments').removeClass('hidden');
    $('#modal-overlay').removeClass('hidden');
    $('.player-comments').addClass('open');

};


// Spacebar acts as pause/play
$(document).keydown(function(e) {
    if (e.target.type == 'textarea' || e.target.type == 'input') {
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