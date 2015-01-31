
Template.song.helpers({

    currentSong: function (details, user) {
    var currentSong = Session.get("currentSong");
    if(currentSong) {
      var track = currentSong.track;
      
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
        return currentPosition/songDuration * 100 + '%';
      }
    }else {
      return '0%';
    }
  },

  time_remaining: function() {
    var currentSound = Session.get("currentSound");
    var currentPosition = Session.get("currentPosition");
    if(currentSound && currentPosition) {
      var songDuration = currentSound.duration;
      timeRemaining = songDuration - currentPosition;
      timeRemaining = Math.round(timeRemaining / 1000);
      if (isNaN(timeRemaining)) {
        return;
      } else {
        return '–' + timeRemaining.toHHMMSS();
      }
    }
  },

});

Template.song.events({

  // Pause Song
  "click #song-pause": function (event) {

    Session.set("pauseState", "pause");

  },

  // Play Song
  "click #song-play": function (event) {

    pauseState = Session.get("pauseState");
    if (pauseState == "pause") {
        Session.set("pauseState", "play");
      soundManager.resumeAll();
    }

  },

  // Play Next Song
  "click #song-next": function (event) {

    var nextSong = Session.get("nextSong");
    if (nextSong !== false) {
      Session.set("pauseState", "play");
      var songArray = Session.set("currentSong", nextSong);
    }

  },

  // Play Previous Song
  "click #song-previous": function (event) {

    var previousSong = Session.get("previousSong");
    if (previousSong !== false) {
      Session.set("pauseState", "play");
      var songArray = Session.set("currentSong", previousSong);
    }

  },

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

  "click .player-comments": function (event) {

    var modal = Session.get("isModalOpen");

    if (modal == true) {

      hideModal();

    } else {

      var song = Session.get("currentSong");
      showModal(song._id);

    }
  },

  "click .player-upvote": function (event) {

    $('.player-upvote').toggleClass('upvoted');
  
  },

});


Template.player.rendered = function () {
  Session.set("currentSong", undefined);
  var playlistArray = Songs.find({}).fetch();
  Session.set("playlist", playlistArray);
  Session.set("nextSong", false);
  Session.set("previousSong", false);
};

var playSound = function(currentSong) {
  var nextSong = "";

  soundManager.stopAll();

  if (currentSong != undefined) {
    
    var streamUrl = currentSong.track.stream_url.replace('https://api.soundcloud.com', '');
    console.log(currentSong);
    SC.stream(streamUrl,{
        onload : function() {
          Session.set("currentSound", {
            id: this.id,
            duration: this.duration
          });
        },
        onfinish : function(){
          
          var nextSong = Session.get("nextSong");
          if (nextSong !== false) {
            var songArray = Session.set("currentSong", nextSong);
          }

        },
        whileplaying : function() {
           
          Session.set("currentPosition", this.position);
          
        }},
        function(sound) {
          

          var songArray = Session.get("playlist");
          console.log(songArray);
          for (var i = 0; i < songArray.length; i++){
            console.log(songArray[i]._id);
            console.log(currentSong._id);
            if (songArray[i]._id == currentSong._id) {
              
              if (i+1 < songArray.length) {
                Session.set("nextSong", songArray[i+1]);
              } else {
                Session.set("nextSong", false);
              }

              if (i-1 >= 0) {
                Session.set("previousSong", songArray[i-1]);
              } else {
                Session.set("previousSong", false);
              }
              
              
            }
          }

          sound.play();
          
        }
    );
  }
}

Tracker.autorun(function () {
    var currentSong = Session.get("currentSong");
  playSound(currentSong);
  
});

Tracker.autorun(function () {

    var pauseState = Session.get("pauseState");
    if (pauseState == "pause") {
        soundManager.pauseAll();
    $('#song-pause').addClass('hide');
    $('#song-play').removeClass('hide');
    }

    if (pauseState == "play") {
        soundManager.resumeAll();
    $('#song-pause').removeClass('hide');
    $('#song-play').addClass('hide');
    }

});

Tracker.autorun(function () {

  var currentPosition = Session.get("currentPosition");

});

Tracker.autorun(function () {

  var nextSong = Session.get("nextSong")

  if (nextSong == false) {
    $('#song-next').addClass('disabled');
  } else {
    $('#song-next').removeClass('disabled');
  }

});

Tracker.autorun(function () {

  var previousSong = Session.get("previousSong")

  if (previousSong == false) {
    $('#song-previous').addClass('disabled');
  } else {
    $('#song-previous').removeClass('disabled');
  }

});


Tracker.autorun(function () {

  var isPlayerHidden = Session.get("hidePlayer");

  console.log(isPlayerHidden);

  if (isPlayerHidden == true) {
    $('#player').addClass('hidden');
    $('footer').removeClass('spacer');
  } else {
    $('#player').removeClass('hidden');
    $('footer').addClass('spacer');
  }
    
});