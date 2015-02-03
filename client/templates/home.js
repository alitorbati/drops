var COMMENT_SPEED = 1000;

Template.home.helpers({

  currentLink: function () {
    console.log(Router.current().url);
    return Router.current().url;
  }

});

Template.home.events({

    "submit .new-song": function (event) {

        var text = event.target.text.value;
        var track;
        $('.error-message').text("");
        //SC.get("/tracks/" + text, function(resp){
        SC.get('/resolve/?url=' + text, {limit: 1}, function(resp){
          console.log(resp);
          if (resp.errors) {
            $('.error-message').text("That song or set doesn't exist");
          } else {
            track = resp;
            console.log(track);

            // Delete all songs
            Meteor.call("removeAllSongs");

            if (resp.kind == 'track') {
              if (track.streamable == false) {
                console.log('text');
                $('.error-message').text("SoundCloud doesn't allow streaming of this song");
              } else {
                
                console.log(text);
                text = text.replace('/', '%2F');

                Session.set("currentSong", track);

                console.log(text);
                $('.error-message').text("");
                Router.go('home', {}, {query: 'song='+text})
                event.target.text.value = "";

              }
            }

            if (resp.kind == 'playlist') {
              console.log('fuck yea');
              console.log(resp);
              var tracks = resp.tracks;
              console.log(tracks);
              for (var i = 0 ; i < tracks.length ; i++) {
                if (track.stramable !== false) {
                  Meteor.call("addSong", track);
                }
              }

            }
            
          }
        });
        return false;
    },

    "click .facebook-share": function (event) {
        var link = Router.current().url;
        console.log(link);
        var href = "www.drrrops.com" + link;
        console.log(href);
        FB.ui({
          method: 'share',
          href: 'www.drrrops.com',
          picture: 'www.drrrops.com/drop-1024x1024.png',
        }, function(response){});

    },
});

var playSound = function(currentSong) {
  
  soundManager.stopAll();


  if (currentSong != undefined) {
    
    var streamUrl = currentSong.stream_url.replace('https://api.soundcloud.com', '');

    SC.stream(streamUrl,{
        onload : function() {
            Session.set("currentSound", {
                id: this.id,
                duration: this.duration
            });

            $('.player-container').removeClass('hidden');

        },
        onfinish : function(){

        },
        whileplaying : function() {
            
            Session.set("currentPosition", this.position);

            var position = Math.round(this.position /COMMENT_SPEED);
            position = position * COMMENT_SPEED;

            var comments = Session.get("songComments");

            var currentComment = comments[position];

            if (currentComment) {
                Session.set("currentComment", currentComment); 
            }
          
        }},
        function(sound) {

          sound.play();
          
      }
      );
    }
};

var getComments = function(track, callback) {
    SC.get('/tracks/' + track.id + '/comments', function(resp){
        if (resp.errors) {
            console.log('song does not exist');
        } else {
            comments = resp;
            var commentObject = {};

            for( var i = 1; i < comments.length; i++ ){
                var obj = comments[i];
                if(obj != undefined) {
                    var timestamp = obj.timestamp;
                    timestamp = Math.round(timestamp/COMMENT_SPEED);
                    timestamp = timestamp * COMMENT_SPEED;
                    commentObject[timestamp] = obj.body;
                }
            }

            Session.set("songComments", commentObject);
            callback();
        }
    });    
}

Tracker.autorun(function () {
    var currentSong = Session.get("currentSong");
    if (currentSong) {
      console.log(currentSong);
      getComments(currentSong, function() {
        playSound(currentSong);
      });
    }
});

Template.home.rendered = function () {
  $('input').focus();
  // setTimeout(function() {
  //   $('form.new-song').fadeIn();
  // }, 2500);

  var song = Router.current().params;
  console.log(song);
  if(song.query) {
    var songUrl = song.query.song;
    console.log(songUrl);
    $('.new-song input').val(songUrl);
  }

};

 window.fbAsyncInit = function() {
    FB.init({
      appId      : '1563858647192351',
      version    : 'v2.1',
      xfbml      : true
    });
  };
