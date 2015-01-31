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
        return currentPosition/songDuration * 100 + '%';
      }
    }else {
      return '0%';
    }
  },

  comment: function() {
    var comment = Session.get("currentComment");
    if (comment) {
      $('.player-comment h1').fitText(1);
      return comment;
    }
  },

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
    $('.player-container').addClass('hidden');
    $('input').focus();
    soundManager.stopAll();
    Session.set("currentSong", {});
  },


});



Template.player.rendered = function () {
  Session.set("currentSong", undefined);
};


Tracker.autorun(function () {

  var currentPosition = Session.get("currentPosition");

  console.log(currentPosition);

});
