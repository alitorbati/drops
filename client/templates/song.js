Template.player.helpers({

  currentSong: function (details, user) {
    var currentSong = Session.get("currentSong");
    if(currentSong) {
      var track = currentSong;
      
      if (!user) {
        user == false; 
      }

      if (user == true) {
        return track.user[details];;
      } else {
        return track[details];;
      }

    } else {
      return 'Loading';
    }
  },

  current_position: function () {
    var currentPosition = Session.get("currentPosition");
    var currentSound = Session.get("currentSound");
    if (currentPosition && currentSound) {
      var songDuration = currentSound.duration;
      var width = currentPosition/songDuration * 100;
      if (isNaN(width)) {
        return '0%';
      } else {
        return width + '%';
      }
    }else {
      return '0%';
    }
  },

  comment: function() {
    var comment = Session.get("currentComment");
    if (comment) {
      return comment;
    }
  },

  twitter_url: function() {
    var song = Session.get('currentSong');
    if (song) {
      var route = Router.current().url;
      //return "https://twitter.com/home?status=@DRRROPSmusic%0ADamn%20son!%20Where'd%20you%20find%20this?!%0" + route;
      return "https://twitter.com/home?status=@DRRROPSmusic%0ADamn%20son!%20Where'd%20you%20find%20this?!%0Awww.drrrops.com"
    } else {
      return "https://twitter.com/home?status=@DRRROPSmusic%0ADamn%20son!%20Where'd%20you%20find%20this?!%0Awww.drrrops.com"
    }
  },

  soundcloud_url: function() {
    var song = Session.get('currentSong');
    if (song) {
      return song.permalink_url;
    }
  }

});

Template.player.events({

  // Scrub song
  "click .song-tracker": function (event) {
    
    event.stopPropagation();

    var target = event.target;

    var distance = $(target).offset().left;
    distance = event.pageX - distance;
    
    var elementWidth = $('.song-tracker').width();
    var position = distance / elementWidth;

    var currentSound = Session.get("currentSound")
    var songDuration = currentSound.duration;
    var songId = currentSound.id;

    var newPosition = songDuration * position;

    newPosition = Math.round(newPosition);

    soundManager.setPosition(songId, newPosition);
  },

    // Scrub song
  "click .player-close": function (event) {
    closePlayer();
  },


  // Pause Song
  "click .player-control.pause": function (event) {

    Session.set("pauseState", "pause");

  },

  // Play Song
  "click .player-control.play": function (event) {

    pauseState = Session.get("pauseState");
    if (pauseState == "pause") {
      Session.set("pauseState", "play");
      soundManager.resumeAll();
    }

  },

  // Play Next Song
  "click .player-control.next": function (event) {

    var nextSong = Session.get("nextSong");
    if (nextSong !== false) {
      Session.set("pauseState", "play");
      var songArray = Session.set("currentSong", nextSong);
    }

  },

  // Play Previous Song
  "click .player-control.previous": function (event) {

    var previousSong = Session.get("previousSong");
    if (previousSong !== false) {
      Session.set("pauseState", "play");
      var songArray = Session.set("currentSong", previousSong);
    }

  },

  "click .facebook-share": function (event) {
      var link = Router.current().url;
      var href = link;
      FB.ui({
        method: 'share',
        href: 'www.drrrops.com',
        picture: 'www.drrrops.com/drop-1024x1024.png',
      }, function(response){});

  },

});

var closePlayer = function() {
    $('.player-container').addClass('hidden');
    $('input').focus();
    soundManager.stopAll();
    Session.set("currentSong", {});
    Session.set("currentPosition", "0");
    Router.go('home');
}

Template.player.rendered = function () {
  Session.set("currentSong", undefined);
};



Tracker.autorun(function () {

  var pauseState = Session.get("pauseState");
  if (pauseState == "pause") {
    soundManager.pauseAll();
    $('.player-control.play').removeClass('hide');
    $('.player-control.pause').addClass('hide');
  }

  if (pauseState == "play") {
    soundManager.resumeAll();
    $('.player-control.play').addClass('hide');
    $('.player-control.pause').removeClass('hide');
  }

});

Tracker.autorun(function () {

  var nextSong = Session.get("nextSong")

  if (nextSong == false) {
    $('.player-control.next').addClass('disabled');
  } else {
    $('.player-control.next').removeClass('disabled');
  }

});

Tracker.autorun(function () {

  var previousSong = Session.get("previousSong")

  if (previousSong == false) {
    $('.player-control.previous').addClass('disabled');
  } else {
    $('.player-control.previous').removeClass('disabled');
  }

});

